const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900
    },
    used_at: {
        type: Date,
    },
}, { timestamps: true });

const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;