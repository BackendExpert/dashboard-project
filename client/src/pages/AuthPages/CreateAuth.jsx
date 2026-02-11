import React, { useEffect, useState } from 'react'
import DefaultInput from '../../component/Form/DefaultInput'
import DefaultButton from '../../component/Buttons/DefaultButton'
import { useNavigate } from 'react-router-dom'
import Toast from '../../component/Toast/Toast'
import useForm from '../../hooks/useForm'
import API from '../../services/api'
import logo from '../../assets/travel-login.png'

const CreateAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { values, handleChange } = useForm({ email: '' });

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post('/auth/create-auth', values, {
                headers: { "Content-Type": "application/json" },
            })


            if (res.data.success) {
                localStorage.setItem('otptoken', res.data.token)
                setToast({ success: true, message: res.data.message });
                setTimeout(() => navigate('/verify-password'), 2000);
            }
            else {
                setToast({ success: false, message: res.data.message });
            }

        } catch (err) {
            setToast({
                success: false,
                message: err.response?.data?.message || "Something went wrong"
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-6">
            {toast && (
                <div className="fixed top-8 right-8 z-50">
                    <Toast
                        success={toast.success}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}

            <div className="relative w-full max-w-md">

                {/* Floating Image */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2">
                    <div className="w-44 h-44 rounded-full bg-white shadow-xl flex items-center justify-center">
                        <img
                            src={logo}
                            alt=""
                            className="w-32 object-contain"
                        />
                    </div>
                </div>

                {/* Auth Card */}
                <div className="bg-white rounded-3xl shadow-xl px-8 pt-32 pb-10">
                    <h1 className="text-2xl font-semibold text-gray-900 text-center">
                        Verify Your Identity
                    </h1>

                    <p className="text-sm text-gray-500 text-center mt-2 mb-8">
                        We’ll send a secure one-time code to your email
                    </p>

                    <form method="post" onSubmit={handleRequestOTP} className="space-y-6">
                        <DefaultInput
                            type="email"
                            value={values.email}
                            name={"email"}
                            required
                            onChange={handleChange}
                            placeholder={"Email address"}
                        />

                        <DefaultButton
                            type="submit"
                            label={loading ? "Requesting code..." : "Send verification code"}
                            className="w-full"
                        />
                    </form>

                    <div className="mt-8 text-center text-xs text-gray-400">
                        This helps us keep your account secure
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAuth