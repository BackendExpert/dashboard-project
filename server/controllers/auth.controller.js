const AuthService = require("../services/auth.service");

const {
    CreateAuthDTO,
    ErrorResDTO,
} = require("../dtos/auth.dto")


const authController = {
    createAuth: async (req, res) => {
        try {
            const {
                email
            } = req.body

            const dto = CreateAuthDTO({ email })

            const result = await AuthService.createAuth(
                dto.data,
                req
            )

            res.status(200).json(result)
        }
        catch (err) {
            res.status(400).json(ErrorResDTO(err.message));
        }
    },

    verifyOTP: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const {
                otp
            } = req.body

            const dto = VerifyLoginDTO({ otp }, token)

            const result = await AuthService.verifyOTP(
                dto.data,
                dto.token,
                req
            )

            res.status(200).json(result)

        }
        catch (err) {
            res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = authController;