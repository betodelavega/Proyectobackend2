import chai from 'chai';
import chaiHttp from 'chai-http';
import readlineSync from 'readline-sync';
import app from '../src/server.js'; // Asegúrate de que la ruta sea correcta
import User from '../src/dao/models/user.model.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Auth API', () => {
  let email;
  let password;

  before(async () => {
    // Pedir al usuario que ingrese el email y la contraseña por consola
    email = readlineSync.question('Ingrese su email: ');
    password = readlineSync.question('Ingrese su contraseña: ', {
      hideEchoBack: true,
    });

    // Limpiar la base de datos antes de las pruebas
    await User.deleteMany({});

    // Crear un usuario para la prueba
    const user = new User({
      first_name: 'Test',
      last_name: 'User',
      email: email,
      age: 30,
      password: password,
    });
    await user.save();
  });

  describe('POST /api/sessions/login', () => {
    it('should return 401 if user does not exist', (done) => {
      chai
        .request(app)
        .post('/api/sessions/login')
        .send({ email: 'nonexistent@example.com', password: 'password' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('message', 'Usuario no encontrado');
          done();
        });
    });

    it('should return 401 if password is incorrect', (done) => {
      chai
        .request(app)
        .post('/api/sessions/login')
        .send({ email: email, password: 'wrongpassword' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('message', 'Contraseña incorrecta');
          done();
        });
    });

    it('should return 200 and a token if login is successful', (done) => {
      chai
        .request(app)
        .post('/api/sessions/login')
        .send({ email: email, password: password })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Login exitoso');
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });
});
