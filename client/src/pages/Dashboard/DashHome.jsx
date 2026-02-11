import React from 'react'
import { useAuth } from '../../context/AuthContext'
import AdminDash from './AdminDash'
import UserDash from './UserDash'

const DashHome = () => {
    const { auth } = useAuth()

    if (auth?.role === "admin") {
        return (
            <AdminDash />
        )
    }
    if (auth?.role === "user") {
        return (
            <UserDash />
        )
    }
}

export default DashHome