import React, { useEffect, useState } from 'react';
import DefaultInput from '../../component/Form/DefaultInput';
import DefaultButton from '../../component/Buttons/DefaultButton';
import { useNavigate } from 'react-router-dom';
import Toast from '../../component/Toast/Toast';
import useForm from '../../hooks/useForm';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const VerfiyPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const { login } = useAuth();
    const { values, handleChange } = useForm({ otp: '' });
    const [otpToken, setOtpToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('otptoken');
        if (!token) {
            navigate("/", { replace: true });
            return;
        }
        setOtpToken(token);
    }, [navigate]);

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!otpToken) {
            setToast({ success: false, message: "OTP token expired. Please login again." });
            setTimeout(() => navigate("/", { replace: true }), 1500);
            setLoading(false);
            return;
        }

        try {
            const res = await API.post(
                '/auth/verify-otp',
                { otp: values.otp.trim() },
                {
                    headers: {
                        Authorization: `Bearer ${otpToken}`,
                    }
                }
            );

            if (res.data.success) {
                login(res.data.token);
                localStorage.removeItem("otptoken");
                setToast({ success: true, message: res.data.message });
                setTimeout(() => navigate('/dashboard'), 2000);
            }

        } catch (err) {
            setToast({
                success: false,
                message: err.response?.data?.message || "OTP verification failed"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            {toast && (
                <div className="fixed top-6 right-6 z-50">
                    <Toast
                        success={toast.success}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}

            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 text-blue-400 text-xl">
                        🔑
                    </div>
                    <h2 className="text-2xl font-semibold text-white">
                        Enter One-Time Code
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                        Check your email and enter the verification code
                    </p>
                </div>

                <form method="post" onSubmit={handleVerifyOTP} className="space-y-6">
                    <DefaultInput
                        type="text"
                        value={values.otp}
                        name="otp"
                        required
                        onChange={handleChange}
                        placeholder="6-digit security code"
                        disabled={loading}
                    />

                    <DefaultButton
                        type="submit"
                        label={loading ? "Verifying access..." : "Confirm & Continue"}
                        disabled={loading}
                        className="w-full"
                    />
                </form>

                <div className="mt-8 text-center text-xs text-slate-500">
                    This code expires shortly for your protection
                </div>
            </div>
        </div>
    );
};

export default VerfiyPassword;
