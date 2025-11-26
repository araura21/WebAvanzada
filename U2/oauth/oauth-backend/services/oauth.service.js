const jwt = require('jsonwebtoken');
const users = require('../models/user.model.js');
const { jwtSecret, jwtExpiresIn } = require('../config/jwt.config.js');  

class AuthService{
    static login(username, password){
        
        //1. buscar el usuario
        const user = users.find(u => u.username === username && u.password === password);
        //si no existe el usuario
        if(!user) return null;

        //2. crear token
        const payload = {
            sub: user.id,
            username: user.username
        };

        //3. firmar el token
        const token = jwt.sign(payload, jwtSecret, {expiresIn: jwtExpiresIn});
        return{
            token,
            user:{
                id: user.id,
                username: user.username,
                nombreCompleto: user.nombreCompleto,
                email: user.email
            }
        };
    }
}

module.exports = AuthService;