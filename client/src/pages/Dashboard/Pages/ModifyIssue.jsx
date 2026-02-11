import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../../services/api'
import Toast from '../../../component/Toast/Toast'


const ModifyIssue = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [toast, setToast] = useState(null);

    const [loading, setLoading] = useState(false)
    const [issue, setIssue] = useState(null)

    // Editable fields
    const [severity, setSeverity] = useState('')
    const [priority, setPriority] = useState('')
    const [status, setStatus] = useState('')

    // ================= FETCH ONE ISSUE =================
    useEffect(() => {
        const fetchOneIssue = async () => {
            try {
                const res = await API.get(`/issue/one-issue/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                const data = res.data.result
                setIssue(data)

                // preload editable values
                setSeverity(data.severity)
                setPriority(data.priority)
                setStatus(data.status)
            } catch (err) {
                console.error(err)
            }
        }

        if (token && id) fetchOneIssue()
    }, [token, id])

    // ================= UPDATE =================
    const handleUpdate = async () => {
        try {
            setLoading(true)

            const payload = {}

            if (severity !== issue.severity) payload.severity = severity
            if (priority !== issue.priority) payload.priority = priority
            if (status !== issue.status) payload.status = status

            // nothing changed → skip API call
            if (Object.keys(payload).length === 0) {
                setToast({
                    success: false,
                    message: 'No changes detected',
                })
                setLoading(false)
                return
            }

            const res = await API.put(
                `/issue/modify-issue/${id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (res.data.success) {
                setToast({
                    success: true,
                    message: res.data.message,
                })

                setTimeout(() => {
                    navigate('/dashboard/issue/manage')
                }, 2000)
            }
        } catch (err) {
            console.log('Full Axios error:', err)
            console.log('Backend response:', err.response?.data)

            setToast({
                success: false,
                message:
                    err.response?.data?.error?.message ||
                    err.response?.data?.message ||
                    'Something went wrong',
            })
        } finally {
            setLoading(false)
        }
    }

    if (!issue) {
        return <p className="text-gray-400">Loading issue...</p>
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
            <h1 className="font-semibold text-gray-500 mb-4">Modify Issue</h1>

            <div className="md:flex gap-4">
                {/* ================= LEFT : ISSUE INFO ================= */}
                <div className="bg-white p-6 rounded-2xl shadow border border-emerald-100 w-full">
                    <h2 className="text-lg font-semibold mb-4">Issue Information</h2>

                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-600">Title</p>
                        <p className="text-gray-800">{issue.title}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-600">Description</p>
                        <p className="text-gray-800 whitespace-pre-line">
                            {issue.desc}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-gray-600">Severity</p>
                            <p className="text-gray-700">{issue.severity}</p>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-600">Priority</p>
                            <p className="text-gray-700">{issue.priority}</p>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-600">Status</p>
                            <p className="text-gray-700">{issue.status}</p>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-600">Created</p>
                            <p className="text-gray-700">
                                {new Date(issue.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT : MODIFY ================= */}
                <div className="bg-white p-6 rounded-2xl shadow border border-emerald-100 w-full">
                    <h2 className="text-lg font-semibold mb-4">Update Status</h2>

                    {/* Severity */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-emerald-600 mb-2">
                            Severity
                        </label>
                        <select
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-300"
                        >
                            <option>Critical</option>
                            <option>Major</option>
                            <option>Minor</option>
                            <option>Low/Cosmetic</option>
                        </select>
                    </div>

                    {/* Priority */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-emerald-600 mb-2">
                            Priority
                        </label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-300"
                        >
                            <option>Critical</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-emerald-600 mb-2">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-300"
                        >
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                        </select>
                    </div>

                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600
                                   text-white py-3 rounded-xl font-semibold
                                   hover:opacity-90 transition"
                    >
                        {loading ? 'Updating...' : 'Update Issue'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModifyIssue
