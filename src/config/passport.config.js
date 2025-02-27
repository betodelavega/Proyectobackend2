import passport from 'passport';
import local from 'passport-local';
import { UsuariosManagerMongo } from '../dao/usuariosManagerMongo.js';
import { generaHash } from '../utils.js';

export const iniciarPassport = () => {
  // 1)
  passport.use(
    'registro',
    new local.Strategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          // logica de registro
          let { nombre } = req.body;
          if (!nombre) {
            return done(null, false);
          }

          let existe = await UsuariosManagerMongo.getBy({ email: username });
          if (existe) {
            return done(null, false);
          }

          password = generaHash(password);

          let usuario = await UsuariosManagerMongo.create({
            nombre,
            email: username,
            password,
          });
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'login',
    new local.Strategy(
      {
        usernameField: 'email',
        // passReqToCallback: true
      },
      async (username, password, done) => {
        try {
          // logica de login

          let usuario = await UsuariosManagerMongo.getBy({ email: username });
          if (!usuario) {
            return done(null, false);
          }
          if (!validaPass(password, usuario.password)) {
            return done(null, false);
          }
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let usuario = await UsuariosManagerMongo.getBy({ _id: id });
    return done(null, usuario);
  });
};
