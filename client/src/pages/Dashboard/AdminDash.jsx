import React, { useEffect, useMemo, useState } from 'react'
import { FaUserClock, FaUserShield } from "react-icons/fa";
import API from '../../services/api';
import { FaCheckCircle, FaList, FaSpinner, FaThumbsUp } from 'react-icons/fa'
import { IoIosWarning } from "react-icons/io";

const AdminDash = () => {
    const [issues, setIssues] = useState([])
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

    const counts = useMemo(() => {
        return {
            open: issues.filter(i => i.status === 'Open').length,
            progress: issues.filter(i => i.status === 'In Progress').length,
            resolved: issues.filter(i => i.status === 'Resolved').length,
            openCriticle: issues.filter(i => i.status === "Open" && i.priority === "Critical").length,
            openSeverity: issues.filter(i => i.status === "Open" && i.severity === "Critical").length
        }
    }, [issues])

    const dashdata = [
        {
            id: 1,
            name: 'Total Issues',
            icon: FaList,
            count: issues.length,
            gradient: 'from-blue-500 to-blue-400',
        },
        {
            id: 2,
            name: 'Open Issues',
            icon: FaCheckCircle,
            count: counts.open,
            gradient: 'from-red-500 to-pink-600',
        },
        {
            id: 3,
            name: 'In Progress',
            icon: FaSpinner,
            count: counts.progress,
            gradient: 'from-yellow-500 to-orange-500',
        },
        {
            id: 4,
            name: 'Resolved',
            icon: FaThumbsUp,
            count: counts.resolved,
            gradient: 'from-emerald-500 to-green-600',
        },
        {
            id: 5,
            name: 'Open and Priority Critical',
            icon: IoIosWarning,
            count: counts.openCriticle,
            gradient: 'from-red-500 to-red-600',
        },
        {
            id: 6,
            name: 'Open and Severity Critical',
            icon: IoIosWarning,
            count: counts.openSeverity,
            gradient: 'from-red-500 to-red-600',
        },

    ]

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashdata.map(({ id, name, icon: Icon, count, gradient }) => (
                    <div
                        key={id}
                        className={`rounded-xl p-5 bg-gradient-to-r ${gradient}
                                    shadow-lg transition-transform duration-200
                                    hover:scale-[1.02]`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <Icon className="h-10 w-10 text-white mb-2" />
                                <p className="text-white text-sm opacity-90">
                                    {name}
                                </p>
                            </div>

                            <p className="text-white text-3xl font-bold">
                                {count}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDash;
