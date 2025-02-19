// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import DataTable from "react-data-table-component";

// const Send = ({ user }) => {
//   const API_URL = import.meta.env.VITE_APP_URL;
//   const [data, setData] = useState([]);
//   const [selectedEmail, setSelectedEmail] = useState(null);
//   const [starredEmails, setStarredEmails] = useState(new Set());

// console.log(data)
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/usersend/${user.useremail}`);
//       setData(response.data.reverse());
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//         if (user?.useremail) {
//           fetchData();
//         }
//       }, [user]); 


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

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";

const Send = ({ user }) => {
  const API_URL = import.meta.env.VITE_APP_URL;
  const [data, setData] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [starredEmails, setStarredEmails] = useState(new Set());

  console.log("User Email:", user?.useremail); // Debugging

  const fetchData = async () => {
    try {
      console.log("Fetching data for:", user?.useremail);
      const response = await axios.get(`${API_URL}/api/usersend/${user.useremail}`);
      console.log("API Response:", response.data); // Debugging
      setData(response.data.reverse());
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (user?.useremail) {
      fetchData();
    }
  }, [user]); 

  const handleRowClick = (row) => {
    setSelectedEmail(row);
  };

  const toggleStar = (id) => {
    const newStars = new Set(starredEmails);
    if (newStars.has(id)) {
      newStars.delete(id);
    } else {
      newStars.add(id);
    }
    setStarredEmails(newStars);
  };

  const columns = [
    {
      name: "",
      cell: (row) => (
        <button className='border-0 bg-transparent' onClick={(e) => {
          e.stopPropagation(); 
          toggleStar(row.id);
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

  return (
    <>
      <div>
        <div className='d-flex gap-3'>
          <h5 className='fw-bold mt-1'>Send</h5>
          <button className='border-0 bg-transparent text-secondary'>
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
            data={data}
            pagination
            highlightOnHover
            selectableRows
            striped
            responsive
            onRowClicked={handleRowClick}
          />
        </div>

        {/* Display Email Details */}
        {selectedEmail && (
          <div className="mt-3 p-3 border rounded">
            <h6><strong>From:</strong> {selectedEmail.sendby}</h6>
            <h6><strong>To:</strong> {selectedEmail.sendto}</h6>
            {selectedEmail.cc && <h6><strong>CC:</strong> {selectedEmail.cc}</h6>}
            {selectedEmail.bcc && <h6><strong>BCC:</strong> {selectedEmail.bcc}</h6>}
            <h6><strong>Subject:</strong> {selectedEmail.subject}</h6>
            <p>{selectedEmail.content}</p>
            <small className="text-muted">{new Date(selectedEmail.createdAt).toLocaleString()}</small>
          </div>
        )}
      </div>
    </>
  );
};

export default Send;
