import { router, protectedProcedure } from '../../trpc';
import { 
  ListarUsuariosSchema, 
  CrearUsuarioSchema, 
  ActualizarEstadoUsuarioSchema, 
  AsignarRolesSchema 
} from './usuarios.schemas';
import { UsuariosService } from './usuarios.service';

export const usuariosRouter = router({
  getRoles: protectedProcedure.query(async () => {
    return UsuariosService.getRoles();
  }),

  listarUsuarios: protectedProcedure
    .input(ListarUsuariosSchema)
    .query(async ({ input }) => {
      return UsuariosService.listarUsuarios(input);
    }),

  crearUsuario: protectedProcedure
    .input(CrearUsuarioSchema)
    .mutation(async ({ input, ctx }) => {
      return UsuariosService.crearUsuario(input, ctx.user.usuarioId);
    }),

  actualizarEstadoUsuario: protectedProcedure
    .input(ActualizarEstadoUsuarioSchema)
    .mutation(async ({ input, ctx }) => {
      return UsuariosService.actualizarEstadoUsuario(input, ctx.user.usuarioId);
    }),

  asignarRoles: protectedProcedure
    .input(AsignarRolesSchema)
    .mutation(async ({ input, ctx }) => {
      return UsuariosService.asignarRoles(input, ctx.user.usuarioId);
    }),
});
