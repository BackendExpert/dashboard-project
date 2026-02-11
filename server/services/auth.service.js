const bcrypt = require("bcrypt")

const OTP = require("../models/otp.model")
const User = require("../models/user.model")
const Role = require("../models/role.model")

const { genarateOTP } = require("../utils/others/genarateOTP")
const generateToken = require("../utils/tokens/generateToken")

const logUserAction = require("../utils/others/logUserAction")

const createAccountEmail = require("../templates/email/auth.template")

const {
    CreateAccountResDTO,
    CreateLoginResDTO
} = require("../dtos/auth.dto")

class AuthService {
    static async createAuth(data, req) {
        const existingOTP = await OTP.findOne({ email: data.email })
        if (!existingOTP) {
            throw new Error("The OTP Already Send to you Email")
        }

        const user = await User.findOne({ email: data.email })

        const otp = genarateOTP()
        const hashotp = await bcrypt.hash(otp, 10)

        await createAccountEmail(data.email, otp)

        const otptoken = generateToken(
            { email, type: "OTP_VERIFY" },
            "5min"
        )

        if (!user) {
            const role = await Role.findOne({ name: "user" })
            if (!role) {
                throw new Error("Defult Role cannot found")
            }

            user = await User.create({
                email: data.email,
                role: role._id,
                isActive: true,
                isEmailVerified: false
            })

            await logUserAction(
                req,
                "REGISTER_OTP_SENT",
                `Registration OTP sent ${data.email}`,
                this._meta(req),
                user._id
            );

            return CreateAccountResDTO(otptoken)
        }
        await logUserAction(
            req,
            "LOGIN_OTP_SENT",
            `Login OTP sent ${data.email}`,
            this._meta(req),
            user._id
        );

        return CreateAccountResDTO(otptoken)
    }
}

module.exports = AuthService