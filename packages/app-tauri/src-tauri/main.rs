#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::{Arc, Mutex};
use std::process::Command;
use tauri::{
    api::process::{Command as TauriCommand, CommandEvent},
    Manager,
};

struct AppState {
    db_process: Option<u32>,
    back_process: Option<u32>,
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            let app_dir = app_handle.path_resolver().app_data_dir().unwrap();
            let db_dir = app_dir.join("database");
            
            // 1. Inicializar clúster si no existe
            if !db_dir.exists() {
                println!("Inicializando clúster PostgreSQL en {:?}", db_dir);
                std::fs::create_dir_all(&db_dir).unwrap();
                
                let (mut rx, child) = TauriCommand::new_sidecar("initdb")
                    .expect("Failed to create initdb command")
                    .args(&["-D", db_dir.to_str().unwrap(), "-U", "sga", "-E", "UTF8"])
                    .spawn()
                    .expect("Failed to spawn initdb");
                
                // Esperar a que initdb termine de forma síncrona para simplificar
                // (en un escenario real, leer rx hasta que termine)
                let status = Command::new("cmd")
                    .args(["/C", "ping 127.0.0.1 -n 3 > nul"]) // Simulación de espera o manejo real de PID
                    .status();
            }

            // 2. Levantar PostgreSQL
            println!("Levantando PostgreSQL...");
            let (mut db_rx, db_child) = TauriCommand::new_sidecar("postgres")
                .expect("Failed to create postgres command")
                .args(&["-D", db_dir.to_str().unwrap(), "-p", "5433"])
                .spawn()
                .expect("Failed to spawn postgres");
            
            let db_pid = db_child.pid();

            // 3. Levantar Backend Fastify
            // Le pasamos las variables de entorno necesarias
            println!("Levantando Backend Fastify...");
            let (mut back_rx, back_child) = TauriCommand::new_sidecar("back")
                .expect("Failed to create back command")
                .envs(vec![
                    ("DATABASE_URL".to_string(), "postgresql://sga:sga@localhost:5433/sga_db".to_string()),
                    ("TRPC_PORT".to_string(), "3000".to_string())
                ].into_iter().collect())
                .spawn()
                .expect("Failed to spawn backend");
            
            let back_pid = back_child.pid();

            app.manage(Arc::new(Mutex::new(AppState {
                db_process: Some(db_pid),
                back_process: Some(back_pid),
            })));

            Ok(())
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::Destroyed => {
                let state: tauri::State<Arc<Mutex<AppState>>> = event.window().state();
                let mut state = state.lock().unwrap();

                // 4. Al cerrar la app, detener procesos de forma segura
                println!("Deteniendo procesos...");
                if let Some(back_pid) = state.back_process.take() {
                    println!("Matando proceso backend PID: {}", back_pid);
                    // Lógica para matar el proceso en Windows (taskkill)
                    let _ = Command::new("taskkill")
                        .args(&["/F", "/PID", &back_pid.to_string()])
                        .status();
                }

                if let Some(db_pid) = state.db_process.take() {
                    let app_dir = event.window().app_handle().path_resolver().app_data_dir().unwrap();
                    let db_dir = app_dir.join("database");
                    
                    println!("Deteniendo PostgreSQL...");
                    // Usamos pg_ctl para un apagado seguro
                    let _ = TauriCommand::new_sidecar("pg_ctl")
                        .expect("Failed to create pg_ctl command")
                        .args(&["stop", "-D", db_dir.to_str().unwrap(), "-m", "fast"])
                        .spawn();
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
