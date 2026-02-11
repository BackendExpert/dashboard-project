import React, { useEffect, useState } from 'react'
import API from '../../../services/api'
import { FaCheckCircle, FaSpinner, FaThumbsUp } from 'react-icons/fa'

import DefaultInput from '../../../component/Form/DefaultInput'
import Dropdown from '../../../component/Form/Dropdown'

const ViewMyIssue = () => {
    const [getallissue, setgetallussue] = useState([])
    const [search, setSearch] = useState('')
    const [priority, setPriority] = useState('')
    const [severity, setSeverity] = useState('')
    const [status, setStatus] = useState('')
    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchallissues = async () => {
            try {
                const res = await API.get(`/issue/my-issues?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setgetallussue(Array.isArray(res.data.result) ? res.data.result : [])
            } catch (err) {
                console.log(err)
            }
        }

        if (token) fetchallissues()
    }, [token])

    const filteredIssues = getallissue.filter(issue => {
        const matchTitle = issue.title.toLowerCase().includes(search.toLowerCase())
        const matchPriority = priority ? issue.priority === priority : true
        const matchSeverity = severity ? issue.severity === severity : true
        const matchStatus = status ? issue.status === status : true
        return matchTitle && matchPriority && matchSeverity && matchStatus
    })

    const exportCSV = () => {
        if (!filteredIssues.length) return
        const header = ['Title', 'Description', 'Severity', 'Priority', 'Status', 'Created', 'Updated']
        const rows = filteredIssues.map(i => [
            `"${i.title}"`,
            `"${i.desc}"`,
            i.severity,
            i.priority,
            i.status,
            new Date(i.createdAt).toLocaleString(),
            new Date(i.updatedAt).toLocaleString(),
        ])
        const csvContent = [header, ...rows].map(e => e.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'my_issues.csv'
        link.click()
    }

    return (
        <div>
            <div className="flex flex-col xl:flex-row justify-between items-start gap-4">
                <h1 className="text-xl font-semibold text-gray-500">View My Issues</h1>
                <button
                    onClick={exportCSV}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
                >
                    Export CSV
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow mt-4 grid xl:grid-cols-4 md:grid-cols-2 gap-4">
                <DefaultInput
                    label="Search by Title"
                    type="text"
                    name="search"
                    value={search}
                    placeholder="Search issues..."
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Dropdown
                    label="Priority"
                    name="priority"
                    onChange={(e) => setPriority(e.target.value)}
                    options={[
                        { label: 'Critical', value: 'Critical' },
                        { label: 'High', value: 'High' },
                        { label: 'Medium', value: 'Medium' },
                        { label: 'Low', value: 'Low' },
                    ]}
                />
                <Dropdown
                    label="Severity"
                    name="severity"
                    onChange={(e) => setSeverity(e.target.value)}
                    options={[
                        { label: 'Critical', value: 'Critical' },
                        { label: 'Major', value: 'Major' },
                        { label: 'Minor', value: 'Minor' },
                        { label: 'Low/Cosmetic', value: 'Low/Cosmetic' },
                    ]}
                />
                <Dropdown
                    label="Status"
                    name="status"
                    onChange={(e) => setStatus(e.target.value)}
                    options={[
                        { label: 'Open', value: 'Open' },
                        { label: 'In Progress', value: 'In Progress' },
                        { label: 'Resolved', value: 'Resolved' },
                    ]}
                />
            </div>

            <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-4 mt-4">
                {filteredIssues.length === 0 ? (
                    <p className="text-gray-500">No issues found</p>
                ) : (
                    filteredIssues.map((data, index) => (
                        <div key={index} className="mb-5">
                            <div className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300">
                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold
                                        ${data.status === "Open"
                                                ? "bg-green-100 text-green-800"
                                                : data.status === "In Progress"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                    >
                                        {data.status === "Open" && <FaCheckCircle />}
                                        {data.status === "In Progress" && <FaSpinner className="animate-spin" />}
                                        {data.status === "Resolved" && <FaThumbsUp />}
                                        {data.status}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-2">{data.title}</h3>
                                <p className="text-gray-600 mb-4">{data.desc}</p>

                                <div className="flex flex-wrap gap-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium
                                        ${data.severity === "Critical"
                                                ? "bg-red-100 text-red-800"
                                                : data.severity === "Major"
                                                    ? "bg-orange-100 text-orange-800"
                                                    : data.severity === "Minor"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-800"
                                            }`}
                                    >
                                        Severity: {data.severity}
                                    </span>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium
                                        ${data.priority === "Critical"
                                                ? "bg-red-200 text-red-900"
                                                : data.priority === "High"
                                                    ? "bg-orange-200 text-orange-900"
                                                    : data.priority === "Medium"
                                                        ? "bg-yellow-200 text-yellow-900"
                                                        : "bg-green-200 text-green-900"
                                            }`}
                                    >
                                        Priority: {data.priority}
                                    </span>
                                </div>

                                <div className="flex justify-between mt-4">
                                    <a
                                        href={`/Dashboard/issue/update/${data._id}`}
                                        className="text-blue-500"
                                    >
                                        Update Issue
                                    </a>
                                    <div className="text-right text-gray-400 text-xs">
                                        Created: {new Date(data.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ViewMyIssue
