import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import { config } from './config/config.js';
import { UsuariosManagerMongo } from './dao/usuariosManagerMongo.js';
import { auth } from './middleware/auth.js';

import { iniciarPassport } from './config/passport.config.js';
import passport from 'passport';

import { router as sessionsRouter } from './routes/sessions.router.js';
import { router as vistasRouter } from './routes/vistas.router.js';

const PORT = config.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: config.MONGO_URL,
      dbName: config.DBNAME,
    }),
  })
);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

iniciarPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('./src/public'));
app.use('/api/sessions', sessionsRouter);
app.use('/', vistasRouter);

app.get('/', (req, res) => {
  if (req.session.contador) {
    req.session.contador++;
  } else {
    req.session.contador = 1;
  }

  res.setHeader('Content-Type', 'application/json');
  return res
    .status(200)
    .json({ payload: `Hola. Visitas: ${req.session.contador}` });
});

app.post('/login', async (req, res) => {
  let { user, pass } = req.body;

  let usuarios = await UsuariosManagerMongo.getUsuarios();
  let usuario = usuarios.find((u) => u.nombre == user && u.password == pass);
  if (!usuario) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: `Credenciales inválidas` });
  }

  req.session.usuario = usuario;

  res.setHeader('Content-Type', 'application/json');
  return res
    .status(200)
    .json({ payload: `Login exitoso para ${usuario.nombre}` });
});

app.get('/datos', auth, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({ payload: 'Datos confidenciales' });
});

app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: `Error en logout` });
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: 'Logout exitoso' });
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server escuchando en puerto ${PORT}`);
});

const conectar = async () => {
  try {
    await mongoose.connect(config.MONGO_URL, {
      dbName: config.DBNAME,
    });
    console.log(`Conexión a DB establecida`);
  } catch (err) {
    console.log(`Error al conectarse con el servidor de BD: ${err}`);
  }
};

conectar();
