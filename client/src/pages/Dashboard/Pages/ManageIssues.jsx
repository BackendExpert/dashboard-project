import React, { useEffect, useMemo, useState } from 'react'
import API from '../../../services/api'
import DefaultInput from '../../../component/Form/DefaultInput'
import Dropdown from '../../../component/Form/Dropdown'
import { FaEdit } from 'react-icons/fa'

const ITEMS_PER_PAGE = 15

const ManageIssues = () => {
    const severityColors = {
        'Critical': 'bg-red-100 text-red-700 ring-red-200',
        'Major': 'bg-orange-100 text-orange-700 ring-orange-200',
        'Minor': 'bg-yellow-100 text-yellow-700 ring-yellow-200',
        'Low/Cosmetic': 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    }

    const priorityColors = {
        'Critical': 'bg-red-100 text-red-700 ring-red-200',
        'High': 'bg-orange-100 text-orange-700 ring-orange-200',
        'Medium': 'bg-yellow-100 text-yellow-700 ring-yellow-200',
        'Low': 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    }

    const [issues, setIssues] = useState([])
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [priority, setPriority] = useState('')
    const [severity, setSeverity] = useState('')
    const [status, setStatus] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await API.get(`/issue/all-issues?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setIssues(Array.isArray(res.data.result) ? res.data.result : [])
            } catch (err) {
                console.error(err)
            }
        }
        if (token) fetchIssues()
    }, [token])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setCurrentPage(1)
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    const filteredIssues = useMemo(() => {
        return issues.filter(issue => {
            const matchTitle = issue.title.toLowerCase().includes(debouncedSearch.toLowerCase())
            const matchPriority = !priority || issue.priority === priority
            const matchSeverity = !severity || issue.severity === severity
            const matchStatus = !status || issue.status === status
            return matchTitle && matchPriority && matchSeverity && matchStatus
        })
    }, [issues, debouncedSearch, priority, severity, status])

    const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE)
    const paginatedIssues = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredIssues.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredIssues, currentPage])

    // CSV Export
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
        link.download = 'issues.csv'
        link.click()
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <h1 className="font-semibold text-gray-500 text-xl">Manage Issues</h1>
                <button
                    onClick={exportCSV}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
                >
                    Export CSV
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <DefaultInput
                    label="Search Title"
                    name="search"
                    placeholder="Type issue title..."
                    value={search}
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

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left">#</th>
                            <th className="px-6 py-4 text-left">Title</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-left">Severity</th>
                            <th className="px-6 py-4 text-left">Priority</th>
                            <th className="px-6 py-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100">
                        {paginatedIssues.map((data, index) => (
                            <tr key={index} className="hover:bg-emerald-50">
                                <td className="px-6 py-4">{index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}</td>
                                <td className="px-6 py-4 font-semibold">{data.title}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">{data.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs ring-1 ${severityColors[data.severity]}`}>{data.severity}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs ring-1 ${priorityColors[data.priority]}`}>{data.priority}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <a href={`/Dashboard/issue/modify/${data._id}`} className="flex items-center text-blue-500 gap-1">
                                        <FaEdit /> Modify
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 mt-4">
                {paginatedIssues.map((data, index) => (
                    <div key={index} className="bg-white p-4 rounded-2xl shadow border border-emerald-100">
                        <div className="flex justify-between">
                            <h3 className="font-semibold">{data.title}</h3>
                            <span className="text-xs text-gray-400">#{index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}</span>
                        </div>

                        <div className="mt-3 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Status</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">{data.status}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Severity</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ring-1 ${severityColors[data.severity]}`}>{data.severity}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Priority</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ring-1 ${priorityColors[data.priority]}`}>{data.priority}</span>
                            </div>

                            <div className="mt-2">
                                <a href={`/Dashboard/issue/modify/${data._id}`} className="flex items-center text-blue-500 gap-1">
                                    <FaEdit /> Modify
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold
                                ${currentPage === p ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ManageIssues
