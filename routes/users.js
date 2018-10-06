const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/user');
const Evento = require('../models/evento');
const Disponibilidad = require('../models/disponibilidad');
const Rol = require('../models/rol');
const EstadoDisp = require('../models/estado-disp');
const TipoCoordinacion = require('../models/tipo-coordinacion');


// Controllers
const con_User = require('../controllers/user');
const con_Guia = require('../controllers/guia');
const con_Evento = require('../controllers/evento');

// Registra al usuario
router.post('/register', (req, res, next) => {
    con_User.registrar(req.body, (user, err) => {
        if (err)
            res.json({success: false, msg: 'Failed to register user'});
        else {
            res.json({success: true, msg: 'User registered'});
        }
    });
});

// Autentica al usuario en el ingreso al sistema
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    con_User.getUserByUsername(username, (user, err) => { 

        if (!user)
            return res.json({success: false, msg: 'Usuario no registrado.'});

        if (err) throw err;
        
        // If there is a user
        con_User.comparePassword(password, user.Password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                const token = jwt.sign(user, 'password', {
                    expiresIn: 604800 // 1 week in seconds
                });

                res.json({
                    success: true,
                    token: 'Bearer '+token,
                    user: {
                        id: user.id,
                        Nombre: user.Nombre,
                        Snombre: user.Snombre,
                        Apellido: user.Apellido,
                        Cedula: user.Cedula,
                        Email: user.Email,
                        Username: user.Username,
                        esAdministrador: user.esAdministrador,
                        SobreNombre: user.SobreNombre,
                        FechaNacimiento: user.FechaNacimiento,
                        AnoIngreso: user.AnoIngreso,
                        Sexo: user.Sexo,
                        Rol: user.Rol
                    }
                });
            
            // If there is no match
            } else
                return res.json({success: false, msg: 'Clave incorrecta.'});
        });
    });
});

// Profile
// Autentica al usuario y retorna un objeto de usuario con todos sus datos corriendo la funcion de passport e insertando los datos en req.user.
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({ user: req.user });
});

/* PETICIONES POST */
// Actualiza los datos de un guia
router.post('/datos-guia', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Guia.actualizarDatos(req.body, (err) => {
        if (err) 
            res.json({ success: false, msg: 'Se produjo un error al actualizar sus datos.' });
        else 
            res.json({ success: true, msg: 'Se actualizaron sus datos exitosamente.' });
    });
});

// Registra un evento nuevo
router.post('/crear-evento', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Evento.registrar(req.body, (err) => {
        if (err)
            res.json({ success: false, msg: 'Se produjo un error al registrar un nuevo evento.' });
        else
            res.json({ success: true, msg: 'Se registro el evento exitosamente.' });
    });
});

// Actualiza un evento
router.post('/actualizar-evento', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Evento.actualizarEvento(req.body, (err) => {
        if (err)
            res.json({ success: false, msg: 'Se produjo un error al actualizar el evento.' });
        else
            res.json({ success: true, msg: 'Se actualizo el evento exitosamente.' });
    });
});

// Marca la disponibilidad de un evento
router.post('/marcar-disponibilidad', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Evento.actualizarDisp(req.body, (err) => {
        if (err) 
            res.json({ success: false, msg: 'Se produjo un error al actualizar su disponibilidad.' });
        else 
            res.json({ success: true, msg: 'Se actualizó su disponibilidad exitosamente.' });
    });
});

// Finaliza un evento
router.post('/finalizar-evento', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Evento.finalizarEvento(req.body, (err) => {
        if (err) 
            res.json({ success: false, msg: 'Se produjo un error al finalizar el evento.' });
        else 
            res.json({ success: true, msg: 'Se finalizó el evento exitosamente.' });
    });
});

// Actualiza los coordis de un evento
router.post('/guardar-coordis', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Evento.guardarCoordis(req.body, (err) => {
        if (err)
            res.json({ success: false, msg: 'Se produjo un error al guardar los Coordinadores.' });
        else
            res.json({ success: true, msg: 'Se guardo la información exitosamente.' });
    });
});

// Actualiza los directores de un evento
router.post('/guardar-directores', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Evento.guardarDirectores(req.body, (err) => {
        if (err)
            res.json({ success: false, msg: 'Se produjo un error al guardar los Directores.' });
        else
            res.json({ success: true, msg: 'Se guardo la información exitosamente.' });
    });
});

// Actualiza los guias de un evento
router.post('/guardar-guias', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Evento.guardarGuias(req.body, (err) => {
        if (err)
            res.json({ success: false, msg: 'Se produjo un error al guardar los Guias.' });
        else
            res.json({ success: true, msg: 'Se guardo la información exitosamente.' });
    });
});

/* PETICIONES GET */
// Obtiene todos los datos necesarios para el login
router.get('/login', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_User.getLogin((data, err) => {
        if (err) throw err;

        if (data) {
            res.json({
                roles: data.roles,
                estados: data.estados,
                tipos: data.tipos
            });
        }
    });
});

// Obtiene todos los roles
router.get('/roles', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Guia.getRoles((data, err) => {
        if (err) throw err;

        if (data) {
            res.json({
                roles: data.roles,
            });
        }
    });
});

// Obtiene todos los Estados de Disponibilidad
router.get('/estados',passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Evento.getEstadosDisponibilidad((data, err) => {
        if (err) throw err;

        if (data) {
            res.json({
                estados: data.estados,
            });
        }
    });
});

// Obtiene todos los coordis y baquianos
router.get('/coordis-y-baquianos',passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Guia.getCoordisyBaquianos((data, err) => {
        if (err) throw err;

        if (data) {
            res.json({
                guias: data.guias,
            });
        }
    });
});

// Obtiene todos el staff de un evento
router.post('/staff',passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Evento.getStaffEvento(req.body, (data, err) => {
        if (err) throw err;

        if (data) {
            res.json({
                staff: data.staff,
                coordis: data.coordis,
                directores: data.directores,
                guias: data.guias
            });
        }
    });
});

// Obtiene todos los eventos
router.get('/eventos', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Evento.getEventos(req.user.id, (data, err) => {
        if (err) throw err;
        
        if (data) {
            res.json({
                userid: req.user.id,
                eventos: data.eventos,
            });
        }
    });
});

// Obtiene todos mis eventos
router.get('/mis-eventos', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    con_Evento.getMisEventos(req.user.id, (data, err) => {
        if (err) throw err;
        
        if (data) {
            res.json({
                userid: req.user.id,
                eventos: data.eventos,
            });
        }
    });
});

module.exports = router;