import { Router } from 'express';
import passport from 'passport';
export const router = Router();

router.get('/error', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(400).json({ error: `Error al autenticar` });
});

router.post(
  '/register',
  passport.authenticate('registro', { failureRedirect: '/api/sessions/error' }),
  (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res
      .status(200)
      .json({ payload: 'Registro exitoso!', usuarioRegistrado: req.user });
  }
);

router.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/api/sessions/error' }),
  (req, res) => {
    req.session.usuario = req.user;

    res.setHeader('Content-Type', 'application/json');
    return res
      .status(200)
      .json({ payload: `Login exitoso`, usuarioLogueado: req.user });
  }
);

router.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/api/sessions/error' }),
  (req, res) => {
    req.session.usuario = req.user;

    res.setHeader('Content-Type', 'application/json');
    return res
      .status(200)
      .json({ payload: `Login exitoso`, usuarioLogueado: req.user });
  }
);
