import React, { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import TopNav from '../component/Nav/TopNav'
import Nav from '../component/Nav/Nav'
import Footer from '../component/Footers/Footer'
import Menubar from '../component/Nav/Menubar'


const WebSite = () => {

    return (
        <div className="relative">
            <div className="">
                <Outlet />
            </div>
        </div>
    )
}

export default WebSite
