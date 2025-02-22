import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import DataTable from 'react-data-table-component';


const Admin = () => {
    const API_URL = import.meta.env.VITE_APP_URL;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newError = {};
        if (!name) newError.name = "Name Required";
        if (!email) newError.email = "Email Required";
        if (!password) newError.password = "Password Required";
        if (!role) newError.role = "Role Required";

        setError(newError);

        if (Object.keys(newError).length > 0) return;

        try {
            const response = await axios.post(`${API_URL}/api/adduser`, { name, email, password, role });
            console.log(response.data);
            reset();
        } catch (error) {
            console.log("Error while Inserting", error);
        }
    };

    const reset = () => {
        setName('');
        setEmail('');
        setPassword('');
        setRole('');
    };


    const [menu, setMenu] = useState('mail');
    const [mailData, SetMailData] = useState([])
    const [userData, setUserData] = useState([])
    const fetchMail = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/allmail`)
            SetMailData(response.data)
        } catch (error) {
            console.log(error)
        }
    }



    const fetchUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/getaddress`);
            setUserData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMail()
        fetchUser()
    }, [menu])

    const handleMenu = (option) => {
        setMenu(option);
    };

    const handleDeleteUser=async(user)=>{
        try{
            await axios.delete(`${API_URL}/api/deleteuser/${user.id}`)
            console.log("user deleted successfully")
            fetchUser()
        }catch(error){
            console.log(error)
        }
    }

    const handleDeleteMail=async(mail)=>{
        try{
            await axios.delete(`${API_URL}/api/deletemail/${mail.id}`)
            fetchMail()
            console.log('mail deleted successfully')

        }catch(error){
            console.log(error)
        }
    }

    const columnMail = [
        { name: '#', selector: (row, index) => index + 1, sortable: true ,width:'100px'},
        { name: "BY", selector: (row) => row.sendby },
        { name: 'TO', selector: (row) => row.sendto },
        { name: 'Subject', selector: (row) => row.subject },
        { name: 'Content', selector: (row) => row.content },
        {
            name: 'Action', cell: (row) => (
                <div>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteMail(row)}><i class="fa-solid fa-trash"></i></button>
                </div>
            )
        }
    ]

    const columnUser = [
        { name: "#", selector: (row, index) => index + 1, sortable: true ,width:'100px'},
        { name: "Name", selector: (row) => row.username, sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: true },
        { name: "Role", selector: (row) => row.role, sortable: true },
        {
            name: "Action",
            cell: (row) => (
                <div>
                    {/* <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(row)}><i class="fa-solid fa-pen-to-square"></i></button> */}
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(row)}><i class="fa-solid fa-trash"></i></button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Header />
            <div className="container">
                <h4 className="fw-bold mt-4">Admin Panel</h4>
                <div className="d-flex flex-wrap gap-3 mt-4">
                    <button
                        className="btn btn-sm"
                        style={menu === 'mail' ? { backgroundColor: '#ffc107', padding: '5px', borderRadius: '5px' } : {}}
                        onClick={() => handleMenu('mail')}> All Mails
                    </button>
                    <button
                        className="btn btn-sm"
                        style={menu === 'user' ? { backgroundColor: '#ffc107', padding: '5px', borderRadius: '5px' } : {}}
                        onClick={() => handleMenu('user')}> Users
                    </button>
                    <button
                        className="btn btn-sm"
                        style={menu === 'adduser' ? { backgroundColor: '#ffc107', padding: '5px', borderRadius: '5px' } : {}}
                        onClick={() => handleMenu('adduser')}> Add user
                    </button>
                </div>

                <div className='mt-4'>
                    {menu === 'user' ?
                        <>
                            <div className='border p-2 rounded table-resposnive'>
                                <DataTable
                                    columns={columnUser}
                                    data={userData}
                                    pagination
                                    striped
                                    highlightOnHover
                                    responsive />
                                <div className='mt-5'></div>
                            </div>
                        </> :
                        ''}

                    {menu === 'mail' ? <>
                        <div className='border p-2 rounded table-resposnive text-center'>
                            <DataTable
                                data={mailData}
                                columns={columnMail}
                                pagination
                                responsive
                                highlightOnHover /></div>
                        <div className='mt-5'></div>
                    </> : ""}

                    {menu === 'adduser' ? <>
                        <div className='container d-flex  align-items-center  '>
                            <form className='rounded  p-4 border' onSubmit={handleSubmit}>
                                <h5 className='fw-bold mb-4'>New User</h5>


                                <div className='row'>
                                    <div className='col'>
                                        <div className='mb-3'>
                                            <label htmlFor="name" className='form-label'>Name</label>
                                            <input className='form-control' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Full Name' />
                                            {error.name && <div className='text-danger'><small>{error.name}</small></div>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='mb-3'>
                                            <label htmlFor="email" className='form-label'>Email</label>
                                            <input className='form-control' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email' />
                                            {error.email && <div className='text-danger'><small>{error.email}</small></div>}
                                        </div>

                                    </div>
                                </div>



                                <div className='row'>
                                    <div className='col'>
                                        <div className='mb-3'>
                                            <label htmlFor="role" className='form-label'>Role</label>
                                            <select className='form-select' value={role} onChange={(e) => setRole(e.target.value)}>
                                                <option value="">Select User Role</option>
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            {error.role && <div className='text-danger'><small>{error.role}</small></div>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='mb-3'>
                                            <label htmlFor="password" className='form-label'>Password</label>
                                            <input className='form-control' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' />
                                            {error.password && <div className='text-danger'><small>{error.password}</small></div>}
                                        </div>

                                    </div>
                                </div>
                                <button className='btn btn-warning'>Add User</button>
                            </form>
                        </div>
                        <div className='mt-5'></div>
                    </> : ''}

                </div>
            </div>
        </>
    );
};

export default Admin;
