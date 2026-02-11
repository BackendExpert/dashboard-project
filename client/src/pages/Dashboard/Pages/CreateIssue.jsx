import React, { useEffect, useState } from 'react'
import useForm from '../../../hooks/useForm';
import DefaultInput from '../../../component/Form/DefaultInput';
import TextAreaInput from '../../../component/Form/TextAreaInput';
import DefaultButton from '../../../component/Buttons/DefaultButton';
import { useNavigate } from 'react-router-dom';
import API from '../../../services/api';
import Toast from '../../../component/Toast/Toast';


const CreateIssue = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const token = localStorage.getItem('token')

    const { values, handleChange } = useForm({
        title: '',
        desc: '',
    });

    const headleCreateIssue = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post(
                '/issue/create-issue',
                { ...values },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (res.data.success) {
                setToast({ success: true, message: res.data.message });
                setTimeout(() => navigate('/dashboard/issue/view'), 2000);
            }

        } catch (err) {
            console.log("Full Axios error:", err);                 
            console.log("Backend response:", err.response?.data); 

            setToast({
                success: false,
                message: err.response?.data?.error?.message || "Something went wrong"
            });
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            {toast && (
                <div className="fixed top-6 right-6 z-50">
                    <Toast
                        success={toast.success}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}
            <h1 className="text-2xl font-semibold text-gray-500">
                Create Your Issue
            </h1>
            <div className="bg-white p-4 rounded shadow mt-4">
                <form method="post" onSubmit={headleCreateIssue}>
                    <div className="">
                        <DefaultInput
                            label={"Enter Issue Title"}
                            type='text'
                            name={'title'}
                            value={values.title}
                            placeholder={"Enter Issue Title"}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="">
                        <TextAreaInput
                            label={"Enter Issue Description"}
                            name={'desc'}
                            value={values.desc}
                            onChange={handleChange}
                            required
                            placeholder={"Enter Description"}
                        />
                    </div>

                    <div className="">
                        <DefaultButton
                            type='submit'
                            label={loading ? "Creating New Issue....." : "Create New Issue"}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateIssue