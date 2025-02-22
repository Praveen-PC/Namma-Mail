import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";

const Send = ({ user ,setForm,setEditMail, setEmailId,searchMail}) => {
  console.log(user)
  const API_URL = import.meta.env.VITE_APP_URL;
  const [data, setData] = useState([]);
  const [starredEmails, setStarredEmails] = useState(new Set());
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

  console.log(data)
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/usersend/${user.useremail}`);
      setData(response.data.reverse());
      const staredMailData=response.data.filter((mail)=>mail.starred===1).map(mail=>mail.id)
      setStarredEmails(new Set(staredMailData));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.useremail) {
          fetchData();
        }
      }, [user]); 


  const handleEditMail=(data)=>{
    setEmailId(data.id)
    setEditMail(true)
    console.log(data.id)
    setForm({
      to: data.sendto,
      cc: data.cc,
      bcc: data.bcc,
      subject: data.subject,
      content: data.content
    })
  }


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
  


  const handleStar =async (id) => {
    try{
     if (starredEmails.has(id)) {
       await axios.put(`${API_URL}/api/removestar/${id}`);
     } else {
       await axios.put(`${API_URL}/api/updatestar/${id}`);
     }
     
     fetchData()
     console.log("mail starred")
    }catch(error){
     console.log(error)
    }
   };

  



  const columns = [
    {
      name: "",
      cell: (row) => (
        <button className='border-0 bg-transparent' onClick={(e) => {
          e.stopPropagation(); 
          handleStar(row.id);
        }}>
          <i className={`fa-solid fa-star ${starredEmails.has(row.id) ? "text-warning" : "text-secondary"}`}></i>
        </button>
      ),
      width: "50px"
    },
    { name: "Sender", selector: (row) => row.sendto, sortable: true },
    { name: "Subject", selector: (row) => row.subject, sortable: true },
    { name: "Message", selector: (row) => row.content },
    { name: "Date", selector: (row) => new Date(row.createdAt).toLocaleString(), sortable: true },
  ];

  const ExpandedRow = ({ data }) => (
    
    <div className='' style={{ padding: "10px", background: "#f9f9f9", borderRadius: "5px" }}>
      
      <div className='d-flex flex-wrap gap-5'>
      <h6><strong>From:</strong> {data.sendby}</h6>
        <h6><strong>Cc:</strong>{data.cc}</h6>
        <h6><strong>Bcc:</strong>{data.bcc}</h6>
        <small className="text-muted">{new Date(data.createdAt).toLocaleString()}</small>
      </div>
      <h6><strong>Subject:</strong> {data.subject}</h6>
      <p>{data.content}</p>
      <div className="mb-2 d-flex flex-wrap">
        <small>
        <button type="button" className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={()=>handleEditMail(data)}>
              Edit Mail
            </button>
        </small>
      </div>
     
      
    </div>
  );

  return (
    <>
      <div>
        <div className='d-flex gap-3'>
          <h5 className='fw-bold mt-1'>Send</h5>
          <button className='border-0 bg-transparent text-secondary' onClick={handleDeleteMail}>
            <i className="fa-solid fa-trash"></i>
          </button>
          <button className='border-0 bg-transparent text-secondary' onClick={fetchData}>
            <i className="fa-solid fa-rotate-right"></i>
          </button>
          <button className='border-0 bg-transparent text-secondary'>
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>

        <div className='mt-2'>
          <DataTable
            columns={columns}
            data={filterMail}
            pagination
            highlightOnHover
            selectableRows
            responsive
            expandableRows
            onSelectedRowsChange={(state) => setSelectedMail(state.selectedRows)}
            expandableRowsComponent={ExpandedRow}
          />
        </div>

        
  
      </div>
    </>
  );
};

export default Send;





// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import DataTable from "react-data-table-component";

// const Send = ({ user }) => {
//   const API_URL = import.meta.env.VITE_APP_URL;
//   const [data, setData] = useState([]);
//   const [selectedEmail, setSelectedEmail] = useState(null);
//   const [starredEmails, setStarredEmails] = useState(new Set());

//   console.log("User Email:", user?.useremail); 

//   const fetchData = async () => {
//     try {
//       console.log("Fetching data for:", user?.useremail);
//       const response = await axios.get(`${API_URL}/api/usersend/${user.useremail}`);
//       console.log("API Response:", response.data); 
//       setData(response.data.reverse());
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     }
//   };

//   useEffect(() => {
//     if (user?.useremail) {
//       fetchData();
//     }
//   }, [user]); 

//   const handleRowClick = (row) => {
//     setSelectedEmail(row);
//   };

//   const toggleStar = (id) => {
//     const newStars = new Set(starredEmails);
//     if (newStars.has(id)) {
//       newStars.delete(id);
//     } else {
//       newStars.add(id);
//     }
//     setStarredEmails(newStars);
//   };

//   const columns = [
//     {
//       name: "",
//       cell: (row) => (
//         <button className='border-0 bg-transparent' onClick={(e) => {
//           e.stopPropagation(); 
//           toggleStar(row.id);
//         }}>
//           <i className={`fa-solid fa-star ${starredEmails.has(row.id) ? "text-warning" : "text-secondary"}`}></i>
//         </button>
//       ),
//       width: "50px"
//     },
//     { name: "Sender", selector: (row) => row.sendto, sortable: true },
//     { name: "Subject", selector: (row) => row.subject, sortable: true },
//     { name: "Message", selector: (row) => row.content },
//     { name: "Date", selector: (row) => new Date(row.createdAt).toLocaleString(), sortable: true },
//   ];

//   return (
//     <>
//       <div>
//         <div className='d-flex gap-3'>
//           <h5 className='fw-bold mt-1'>Send</h5>
//           <button className='border-0 bg-transparent text-secondary'>
//             <i className="fa-solid fa-trash"></i>
//           </button>
//           <button className='border-0 bg-transparent text-secondary' onClick={fetchData}>
//             <i className="fa-solid fa-rotate-right"></i>
//           </button>
//           <button className='border-0 bg-transparent text-secondary'>
//             <i className="fa-solid fa-ellipsis-vertical"></i>
//           </button>
//         </div>

//         <div className='mt-2'>
//           <DataTable
//             columns={columns}
//             data={data}
//             pagination
//             highlightOnHover
//             selectableRows
//             striped
//             responsive
//             onRowClicked={handleRowClick}
//           />
//         </div>

//         {/* Display Email Details */}
//         {selectedEmail && (
//           <div className="mt-3 p-3 border rounded">
//             <h6><strong>From:</strong> {selectedEmail.sendby}</h6>
//             <h6><strong>To:</strong> {selectedEmail.sendto}</h6>
//             {selectedEmail.cc && <h6><strong>CC:</strong> {selectedEmail.cc}</h6>}
//             {selectedEmail.bcc && <h6><strong>BCC:</strong> {selectedEmail.bcc}</h6>}
//             <h6><strong>Subject:</strong> {selectedEmail.subject}</h6>
//             <p>{selectedEmail.content}</p>
//             <small className="text-muted">{new Date(selectedEmail.createdAt).toLocaleString()}</small>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Send;
