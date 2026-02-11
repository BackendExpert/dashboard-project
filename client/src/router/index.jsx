import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WebSite from '../layouts/WebSite'
import DefultError from '../component/Errors/DefultError'
import CreateAuth from '../pages/AuthPages/CreateAuth'
import VerifyPassword from '../pages/AuthPages/VerifyPassword'
import PrivateRoute from './PrivateRoute'
import Dashboard from '../layouts/Dashboard'
import DashHome from '../pages/Dashboard/DashHome'
import DashError from '../component/Dashboard/DashError'
import CreateIssue from '../pages/Dashboard/Pages/CreateIssue'
import ViewMyIssue from '../pages/Dashboard/Pages/ViewMyIssue'
import ManageIssues from '../pages/Dashboard/Pages/ManageIssues'
import UpdateIssue from '../pages/Dashboard/Pages/UpdateIssue'
import ModifyIssue from '../pages/Dashboard/Pages/ModifyIssue'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<WebSite />} >
                    <Route path='*' element={<DefultError />} />

                    <Route index element={<CreateAuth />} />
                    <Route path='/verify-password' element={<VerifyPassword />} />
                </Route>

                <Route path='/dashboard/' element={<PrivateRoute roles={['admin', 'user']} ><Dashboard /></PrivateRoute>}>
                    <Route path='*' element={<PrivateRoute roles={['admin', 'user']} ><DashError /></PrivateRoute>} />
                    <Route index element={<PrivateRoute roles={['admin', 'user']} ><DashHome /></PrivateRoute>} />

                    <Route path='issue/create' element={<PrivateRoute roles={['admin', 'user']} ><CreateIssue /></PrivateRoute>} />
                    <Route path='issue/view' element={<PrivateRoute roles={['admin', 'user']} ><ViewMyIssue /></PrivateRoute>} />
                    <Route path='issue/update/:id' element={<PrivateRoute roles={['admin', 'user']} ><UpdateIssue /></PrivateRoute>} />

                    <Route path='issue/manage' element={<PrivateRoute roles={['admin']} ><ManageIssues /></PrivateRoute>} />
                    <Route path='issue/modify/:id' element={<PrivateRoute roles={['admin']} ><ModifyIssue /></PrivateRoute>} />
                    

                </Route>

            </Routes>
        </BrowserRouter>
    )
}

export default App
