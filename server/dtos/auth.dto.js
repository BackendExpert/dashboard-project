exports.CreateAuthDTO = (data) => ({
    data: {
        email: String(data?.email || "").trim(),
    },
});

exports.VerifyLoginDTO = (data, token) => ({
    data: {
        otp: String(data?.otp || "").trim(),
    },
    token: String(token).trim(),
});

exports.CreateAccountResDTO = (token, message = "Account created successfully, and OTP send to your Email") => ({
    success: true,
    token,
    message,
    timestamp: Date.now()
});

exports.CreateLoginResDTO = (token, message = "OTP sent to your email") => ({
    success: true,
    token,
    message,
    timestamp: Date.now()
});

exports.VerifyLoginResDTO = (token, message = "Login successful") => ({
    success: true,
    token,
    message,
    timestamp: Date.now()
});

exports.ErrorResDTO = (message = "Something went wrong", code = "SERVER_ERROR") => ({
    success: false,
    error: {
        code,
        message
    },
    timestamp: Date.now()
});