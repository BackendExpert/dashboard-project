import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useForm from '../../../hooks/useForm'
import DefaultInput from '../../../component/Form/DefaultInput'
import TextAreaInput from '../../../component/Form/TextAreaInput'
import DefaultButton from '../../../component/Buttons/DefaultButton'
import Toast from '../../../component/Toast/Toast'
import API from '../../../services/api'

const UpdateIssue = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)
    const [issue, setIssue] = useState(null)

    const { values, setValues, handleChange } = useForm({
        title: '',
        desc: '',
    })

    // Fetch issue
    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const res = await API.get(`/issue/one-issue/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const issueData = res.data.result

                setIssue(issueData)
                setValues({
                    title: issueData.title,
                    desc: issueData.desc,
                })
            } catch (err) {
                console.log(err)
            }
        }

        if (token) fetchIssue()
    }, [id, token, setValues])

    const handleUpdateIssue = async (e) => {
        e.preventDefault()

        const title = values.title?.trim()
        const desc = values.desc?.trim()


        if (!title && !desc) {
            setToast({
                success: false,
                message: 'Please update at least one field',
            })
            return
        }


        if (
            title === issue?.title &&
            desc === issue?.desc
        ) {
            setToast({
                success: false,
                message: 'No changes detected',
            })
            return
        }

        setLoading(true)

        try {

            const payload = {}
            if (title !== issue.title) payload.title = title
            if (desc !== issue.desc) payload.desc = desc

            const res = await API.put(
                `/issue/update-issue/${id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (res.data.success) {
                setToast({ success: true, message: res.data.message })
                setTimeout(() => navigate('/dashboard/issue/view'), 2000)
            }
        } catch (err) {
            console.log('Full Axios error:', err)
            console.log('Backend response:', err.response?.data)

            setToast({
                success: false,
                message:
                    err.response?.data?.error?.message || 'Something went wrong',
            })
        } finally {
            setLoading(false)
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
                Update Issue
            </h1>

            {/* Issue Data */}
            <div className="bg-white p-4 rounded shadow mt-4">
                <h1 className="text-xl font-semibold text-gray-500 mb-4">
                    Issue Data
                </h1>

                <div className="space-y-3 text-gray-700">
                    <div>
                        <span className="font-medium text-gray-600">Title:</span>
                        <p className="mt-1">{issue?.title || '-'}</p>
                    </div>

                    <div>
                        <span className="font-medium text-gray-600">Description:</span>
                        <p className="mt-1 whitespace-pre-line">
                            {issue?.desc || '-'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="font-medium text-gray-600">Status:</span>
                            <p className="mt-1">{issue?.status}</p>
                        </div>

                        <div>
                            <span className="font-medium text-gray-600">Priority:</span>
                            <p className="mt-1">{issue?.priority}</p>
                        </div>

                        <div>
                            <span className="font-medium text-gray-600">Severity:</span>
                            <p className="mt-1">{issue?.severity}</p>
                        </div>

                        <div>
                            <span className="font-medium text-gray-600">Created At:</span>
                            <p className="mt-1">
                                {issue?.createdAt
                                    ? new Date(issue.createdAt).toLocaleString()
                                    : '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Form */}
            <div className="bg-white p-4 rounded shadow mt-4">
                <form method="post" onSubmit={handleUpdateIssue}>
                    <DefaultInput
                        label="Enter Issue Title"
                        type="text"
                        name="title"
                        value={values.title}
                        placeholder="Enter Issue Title"
                        onChange={handleChange}
                    />

                    <TextAreaInput
                        label="Enter Issue Description"
                        name="desc"
                        value={values.desc}
                        onChange={handleChange}
                        placeholder="Enter Description"
                    />

                    <DefaultButton
                        type="submit"
                        label={loading ? 'Updating Issue.....' : 'Update Issue'}
                    />
                </form>
            </div>
        </div>
    )
}

export default UpdateIssue
