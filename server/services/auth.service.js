const bcrypt = require("bcrypt")

const OTP = require("../models/otp.model")
const User = require("../models/user.model")
const Role = require("../models/role.model")

const { genarateOTP } = require("../utils/others/genarateOTP")
const generateToken = require("../utils/tokens/generateToken")

const logUserAction = require("../utils/others/logUserAction")

const createAccountEmail = require("../templates/email/auth.template")
const NotificationEmail = require("../templates/email/notification.template")

const {
    CreateAccountResDTO,
    CreateLoginResDTO,
    VerifyLoginResDTO
} = require("../dtos/auth.dto")
const verifyToken = require("../utils/tokens/verifyToken")

class AuthService {
    static async createAuth(data, req) {
        const existingOTP = await OTP.findOne({ email: data.email })
        if (existingOTP) {
            throw new Error("The OTP Already Send to you Email")
        }

        let user = await User.findOne({ email: data.email });


        const otp = genarateOTP()
        const hashotp = await bcrypt.hash(otp, 10)
        await OTP.create({ email: data.email, otp: hashotp });

        await createAccountEmail(data.email, otp)

        const otptoken = generateToken(
            { email: data.email, type: "OTP_VERIFY" },
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

        return CreateLoginResDTO(otptoken)
    }

    static async verifyOTP(data, token, req) {
        const decoded = verifyToken(token)

        if (decoded.type !== "OTP_VERIFY") {
            throw new Error("Invalid OTP Token")
        }

        const email = decoded.email
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error("User Not found in the Database")
        }
        const userOTP = await OTP.findOne({ email });
        const isValid = await bcrypt.compare(data.otp, userOTP.otp);


        if (!isValid) {
            await logUserAction(
                req,
                "OTP_WRONG",
                `Login OTP MissMatch ${user.email}`,
                this._meta(req),
                user._id
            );
            throw new Error("Password is Not Match")
        }


        //  success
        await OTP.deleteOne({ email });
        const role = await Role.findById(user.role);

        const jwt = generateToken(
            { id: user._id, email: user.email, role: role?.name },
            "1d"
        );


        await logUserAction(
            req,
            "LOGIN_SUCCESS",
            `Login Successful ${data.email}`,
            this._meta(req),
            user._id
        );

        await NotificationEmail(user.email, `Login Successfully`, this._meta(req))
        return VerifyLoginResDTO(jwt);

    }


    // ===========================================================

    // helper for get meta data
    static _ip(req) {
        return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    }
    static _meta(req) {
        return {
            ipAddress: this._ip(req),
            userAgent: req.headers["user-agent"],
            timestamp: new Date()
        };
    }
}

module.exports = AuthService