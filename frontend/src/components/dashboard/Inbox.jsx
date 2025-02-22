
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";

const Inbox = ({ user, setNotification, notification ,searchMail}) => {
  const API_URL = import.meta.env.VITE_APP_URL;
  const [data, setData] = useState([]);
  const [starredEmails, setStarredEmails] = useState(new Set());
  const [replyMailData, SetReplyMailData] = useState({})
  const [selectedMail, setSelectedMail] = useState([])

  const [filterMail,setFilterMail]=useState([])

  useEffect(() => {
    if (!searchMail.trim()) {
      setFilterMail(data); 
      return;
    }

    const filtered = data.filter(mail => {
      if (!mail) return false; 
      const { to = '', subject = '', content = '',sendby='' } = mail; 

      return (
        to.toLowerCase().includes(searchMail.toLowerCase()) ||
        subject.toLowerCase().includes(searchMail.toLowerCase()) ||
        content.toLowerCase().includes(searchMail.toLowerCase()) ||
        sendby.toLowerCase().includes(searchMail.toLowerCase())
      );
    });

    setFilterMail(filtered);
  }, [searchMail, data]);

  console.log("user", user)

  const [replyMessage, setReplyMessage] = useState({
    sendto: '',
    sendby: '',
    mailid: '',
    message: ''
  })

  console.log("inox noti", notification)
  useEffect(() => {
    if (user?.useremail) {
      setReplyMessage({
        sendto: replyMailData.sendby,
        sendby: user.useremail,
        mailid: replyMailData.id,
        message: ""
      });
    }
  }, [replyMailData, user]);
  console.log(replyMessage)
  console.log(replyMailData)

  const hanldeReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/replymail`, replyMessage)
      console.log("reply mail sended")
      setReplyMessage({
        message: ''
      })
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  console.log("data", data)

  const handleDeleteMail = async () => {
    if (selectedMail.length === 0) return; 
  
    const ids = selectedMail.map(mail => mail.id); 
  
    try {
      await axios.delete(`${API_URL}/api/deletemail`, { data: { ids } });
      console.log("Mails deleted successfully");
  
      fetchData(); 
      setSelectedMail([]); 
    } catch (error) {
      console.error("Error deleting mails:", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/userinbox/${user.useremail}`);
      setData(response.data);
      let noti = new Set();
      response.data.forEach((data) => {
        if (data.seen === 0) {
          noti.add(data.id)
        }
      })
      setNotification(noti)

      const staredMailData = response.data.filter((mail) => mail.starred === 1).map(mail => mail.id)
      setStarredEmails(new Set(staredMailData));


    } catch (error) {
      console.error(error);
    }
  };

  console.log("stared", starredEmails)

  useEffect(() => {
    if (user?.useremail) {
      fetchData();
    }
  }, [user]);

  const ExpandedRow = ({ data }) => (
    <div className='' style={{ padding: "10px", background: "#f9f9f9", borderRadius: "5px" }}>
      <div className='d-flex flex-wrap gap-5'>
        <h6><strong className='text-warning'>From:</strong> {data.sendby}</h6>
        <h6><strong className='text-warning'>Cc:</strong> {data.cc}</h6>
        <h6><strong className='text-warning'>Bcc:</strong> {data.bcc}</h6>
        <small className="text-muted">{new Date(data.createdAt).toLocaleString()}</small>
      </div>
      <h6 className='mt-2'><strong className='text-warning'>Subject:</strong> {data.subject}</h6>
      <p className='mt-2'>{data.content}</p>

  
      <div className="mt-3">
        <h6><strong className='text-warning'>Replies:</strong></h6>
        {data.replies.length > 0 ? (
          data.replies.map(reply => (
            <div key={reply.id} style={{ borderTop: "1px solid #ddd", padding: "5px 0" }}>
             
              <h6><strong className='text-warning'>By :</strong> {reply.repsendby}</h6>
              <div className='d-flex flex-wrap gap-3 align-items-center'>
                <p>{reply.message}</p>
                <small className="text-muted"><p>{new Date(reply.createdAt).toLocaleString()}</p></small>
              </div>

            </div>
          ))
        ) : (
          <p>No replies</p>
        )}
      </div>

      <div className='mt-3'>
        <button type="button" className="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Reply Mail
        </button>
      </div>
    </div>
  );


  // const ExpandedRow = ({ data }) => (

  //   <div className='' style={{ padding: "10px", background: "#f9f9f9", borderRadius: "5px" }}>

  //     <div className='d-flex flex-wrap gap-5'>
  //       <h6><strong className='text-warning'>From:</strong> {data.sendby}</h6>
  //       <h6 cls><strong className='text-warning'>Cc:</strong> {data.cc}</h6>
  //       <h6><strong className='text-warning'>Bcc:</strong> {data.bcc}</h6>
  //       <small className="text-muted">{new Date(data.createdAt).toLocaleString()}</small>
  //     </div>
  //     <h6 className='mt-2'><strong className='text-warning'>Subject:</strong> {data.subject}</h6>
  //     <p className='mt-2'>{data.content}</p>
  //     <div className='mt-3'>
  //       <button type="button" class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal" >
  //         Reply Mail
  //       </button>
  //       {/* <small><button className='btn btn-sm btn-warning'>Reply Mail</button></small> */}
  //     </div>


  //   </div>
  // );
  const seenMail = async (mailData) => {
    if (mailData.seen === 0) {
      try {
        await axios.put(`${API_URL}/api/updateseenmail/${mailData.id}`)
        await fetchData()
        console.log("mail updated to seen")
      } catch (error) {
        console.log(error)
      }
    }
  }
  const handleExpandRow = (expand, row) => {
    if (expand) {
      seenMail(row)
      SetReplyMailData(row)
    }
  }

  const handleStar = async (id) => {
    try {
      if (starredEmails.has(id)) {
        await axios.put(`${API_URL}/api/removestar/${id}`);
      } else {
        await axios.put(`${API_URL}/api/updatestar/${id}`);
      }

      fetchData()
      console.log("mail starred")
    } catch (error) {
      console.log(error)
    }
  };

  const columns = [
    {
      name: "",
      cell: (row) => (
        <button className='border-0 bg-transparent' onClick={(e) => {
          e.stopPropagation(); handleStar(row.id)
            ;
        }}>
          <i className={`fa-solid fa-star ${starredEmails.has(row.id) ? "text-warning" : "text-secondary"}`}></i>
        </button>
      ),
      width: "50px"
    },
    { name: "Sender", selector: (row) => row.sendby, sortable: true },
    { name: "Subject", selector: (row) => row.subject, sortable: true },
    { name: "Message", selector: (row) => row.content },
    { name: "Date", selector: (row) => new Date(row.createdAt).toLocaleDateString(), sortable: true },
  ];
  const conditionalRowStyles = [
    {
      when: (row) => notification.has(row.id),
      style: {
        backgroundColor: "#fff4c2",
        fontWeight: "bold",
      }
    }
  ];

  return (
    <>
      <div>
        <div className='d-flex gap-3'>
          <h5 className='fw-bold mt-1'>Inbox</h5>
          <button className='border-0 bg-transparent text-secondary' onClick={handleDeleteMail} >
            <i className="fa-solid fa-trash"></i>
          </button>
          <button className='border-0 bg-transparent text-secondary' onClick={fetchData}>
            <i className="fa-solid fa-rotate-right"></i>
          </button>
          <button className='border-0 bg-transparent text-secondary'>
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>

        <div className='mt-2' >
          <DataTable
            columns={columns}
            data={filterMail}
            pagination
            highlightOnHover
            selectableRows

            onSelectedRowsChange={(state) => setSelectedMail(state.selectedRows)}
            responsive
            expandableRows
            expandableRowsComponent={ExpandedRow}
            conditionalRowStyles={conditionalRowStyles}
            onRowExpandToggled={handleExpandRow}
          />
        </div>


      </div>




      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Reply Mail</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form action="" onSubmit={hanldeReplySubmit} >
                <div className='border rounded p-2 mb-3'>
                  <h6><strong className='text-warning' >To :</strong> {replyMailData.sendby}</h6>
                  <p><strong className='text-warning'>Message :</strong> {replyMailData.content}</p>
                  <small><p className='text-muted fw-small'> {new Date(replyMailData.createdAt).toLocaleString()}</p></small>
                </div>
                <div className='mb-3'>
                  <textarea name="" id="" className='form-control' style={{ height: '3cm' }} placeholder='reply...' value={replyMessage.message} onChange={(e) => setReplyMessage({ ...replyMessage, message: e.target.value })}></textarea>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" class="btn btn-warning">Send</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Inbox;

