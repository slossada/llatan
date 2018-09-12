const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../controllers/user');
const connection = require('./database');

module.exports = function(passport) {
    let opts = {};

    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'password';

    // @ts-ignore
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("El id del jwt_payload es: ", jwt_payload.id);
        User.getUserById(jwt_payload.id, (err, user) => {
            if (err){
                console.log("Error en el passport");
                return done(err, false);
            }
            
            if (user){
                console.log("Hay usuario en el passport");
                return done(null, user);
            }
            else{
                console.log("Paso el ELSE en el passport");
                return done(null, false);
            }
        });
    }));
}