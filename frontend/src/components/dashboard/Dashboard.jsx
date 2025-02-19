import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Header from './Header';
import Inbox from './Inbox';
import Starred from './Starred';
import Send from './Send';

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_APP_URL;
  const [menu, setMenu] = useState('inbox');
  const [user, setUser] = useState({
    userid: '',
    useremail: '',
    userrole: ''
  });

  const [form, setForm] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    content: ''
  });

  const handleChange = (option) => {
    setMenu(option);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    try {  
      const data= { ...user, ...form }; 
      console.log(data)
      await axios.post(`${API_URL}/api/addmail`, data);
      resetForm()
    } catch (error) {
      console.log(error);
    }
  };
  
  

  useEffect(() => {
    const token = sessionStorage.getItem('authtoken'); 
    if (token) {
      try {
        const decode = token.split('.')[1]; 
        const decodedToken = JSON.parse(atob(decode)); 
        setUser({
          userid: decodedToken.id,
          useremail: decodedToken.email,
          userrole: decodedToken.role
        });
        console.log(decodedToken);
      } catch (error) {
        console.error('Token decoding failed:', error);
      }
    } else {
      console.log('No token found');
    }
  }, []);
  // console.log("user", user);
const resetForm=()=>{
  setForm({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    content: ''
  })
}
  return (
    <>
      <Header />
      <div className="container-fluid mt-3">
        <div className="d-flex flex-column flex-md-row">
          <div className="col-12 col-md-3 text-center p-3 border-end">
            <button type="button" className="btn btn-warning w-100" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
              <i className="fa-solid fa-pencil"></i> Compose
            </button>

            <div className="mt-4 align-items-start text-start">
              <ul className="list-unstyled d-flex flex-column gap-3">
                <li style={menu === 'inbox' ? { backgroundColor: '#ffc107', padding: '5px', borderRadius: '5px', display: 'inline-block' } : { backgroundColor: 'transparent' }}>
                  <i className="fa-solid fa-inbox mx-3"></i>
                  <button onClick={() => handleChange('inbox')} className="border-0 bg-transparent">
                    Inbox
                  </button>
                </li>
                <li style={menu === 'starred' ? { backgroundColor: '#ffc107', padding: '5px', borderRadius: '5px' } : {}}>
                  <i className="fa-regular fa-star mx-3"></i>
                  <button onClick={() => handleChange('starred')} className="border-0 bg-transparent">
                    Starred
                  </button>
                </li>
                <li style={menu === 'snoozed' ? { backgroundColor: '#ffc107', padding: '5px', borderRadius: '5px' } : {}}>
                  <i className="fa-regular fa-clock mx-3"></i>
                  <button onClick={() => handleChange('snoozed')} className="border-0 bg-transparent">
                    Snoozed
                  </button>
                </li>
                <li style={menu === 'send' ? { backgroundColor: '#ffc107', padding: '5px', borderRadius: '5px' } : {}}>
                  <i className="fa-regular fa-paper-plane mx-3"></i>
                  <button onClick={() => handleChange('send')} className="border-0 bg-transparent">
                    Send
                  </button>
                </li>
                <li style={menu === 'draft' ? { backgroundColor: '#ffc107', padding: '5px', borderRadius: '5px' } : {}}>
                  <i className="fa-solid fa-file mx-3"></i>
                  <button onClick={() => handleChange('draft')} className="border-0 bg-transparent">
                    Draft
                  </button>
                </li>
                <li>
                  <i className="fa-solid fa-angle-down mx-3"></i>
                  <button className="border-0 bg-transparent">More</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-9 p-3">
            <div className="d-flex justify-content-between">
              <div className="w-50">
                <input type="search" className="form-control" placeholder="Search" />
              </div>
              <div className="d-flex justify-content-evenly gap-4">
                {user.userrole === 'admin' ? (
                  <>
                    <button className="btn btn-warning">
                      <i className="fa-solid fa-users"></i>
                    </button>
                  </>
                ) : ''}
                <button className="btn btn-warning">
                  <i className="fa-regular fa-bell"></i>
                </button>
                <button className="btn btn-warning">
                  <i className="fa-regular fa-address-book"></i>
                </button>
              </div>
            </div>
            <div className="mt-3">
              {menu === 'inbox' ? <Inbox user={user} /> : ''}
            </div>
            <div className="mt-5">
              {menu === 'starred' ? <Starred  user={user}/> : ''}
            </div>
            <div className="mt-5">
              {menu === 'send' ? <Send /> : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="staticBackdropLabel">New Message</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleForm}>
                <div className="mb-2">
                  <input type="text" className="form-control" placeholder="To:" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
                </div>
                <div className="mb-2">
                  <input type="text" className="form-control" placeholder="Cc:" value={form.cc} onChange={(e) => setForm({ ...form, cc: e.target.value })} />
                </div>
                <div className="mb-2">
                  <input type="text" className="form-control" placeholder="Bcc:" value={form.bcc} onChange={(e) => setForm({ ...form, bcc: e.target.value })} />
                </div>
                <div className="mb-2">
                  <input type="text" className="form-control" placeholder="Subject:" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="mb-2">
                  <textarea className="form-control p-2" style={{ height: '3cm' }} placeholder="Write Email:" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-warning">Send</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
