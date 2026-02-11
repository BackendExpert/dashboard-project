const AuthService = require("../services/auth.service");

const {
    CreateAuthDTO,
    ErrorResDTO,
} = require("../dtos/auth.dto")


const authController = {
    createAuth: async(req, res) => {
        try{
            const {
                email
            } = req.body

            const dto = CreateAuthDTO({email})

            const result = await AuthService.createAuth(
                dto.data,
                req
            )

            res.status(200).json(result)
        }
        catch(err){
            res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = authController;