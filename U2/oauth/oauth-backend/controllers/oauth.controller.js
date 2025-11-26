const AuthService = require('../services/oauth.service.js');

class AuthController{
    static login(req, res){
        const {username, password} = req.body;

        const result = AuthService.login(username, password);

        if(!result) return res.status(401).json({message: "Usuario o contrasenia incorrecta"});

        return res.json({
            ok: true,
            token: result.token,
            user: result.user
        });
    }
}
 
module.exports = AuthController;