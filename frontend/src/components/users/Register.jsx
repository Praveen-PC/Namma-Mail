import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/Header';

const Register = () => {
    const API_URL = import.meta.env.VITE_APP_URL;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState({});

    const navigate = useNavigate();

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
            navigate('/');
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

    return (
        <>
            <Header />
            <div className='container d-flex justify-content-center align-items-center vh-100'>
                <form className='rounded shadow p-5 bg-light' onSubmit={handleSubmit}>
                    <h2 className='text-center text-primary'>Register</h2>
                    
                    <div className='mb-3'>
                        <label htmlFor="name" className='form-label'>Name</label>
                        <input className='form-control' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Full Name' />
                        {error.name && <div className='text-danger'><small>{error.name}</small></div>}
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="email" className='form-label'>Email</label>
                        <input className='form-control' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email' />
                        {error.email && <div className='text-danger'><small>{error.email}</small></div>}
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="role" className='form-label'>Role</label>
                        <select className='form-select' value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="">Select User Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        {error.role && <div className='text-danger'><small>{error.role}</small></div>}
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="password" className='form-label'>Password</label>
                        <input className='form-control' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' />
                        {error.password && <div className='text-danger'><small>{error.password}</small></div>}
                    </div>

                    <button className='btn btn-primary'>Register</button>
                </form>
            </div>
        </>
    );
};

export default Register;
