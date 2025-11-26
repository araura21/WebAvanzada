const UserService = require('../services/user.service.js');

class UserController{
    static profile(req, res){
        
        //extraer el id del usuario desde el token jwt
        const userId = req.user.sub; //sub: para traer el id del token segun el jwt

        const perfil = UserService.getProfile(userId);
        
        if(!perfil) return res.status(401).json({message: "Perfil no encontrado"});

        return res.json({
            ok: true,
            data: perfil,
        });
    }
}

module.exports = UserController;