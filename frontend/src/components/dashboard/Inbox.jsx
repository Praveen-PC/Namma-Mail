// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import DataTable from "react-data-table-component";

// const Inbox = ({ user }) => {
//   const API_URL = import.meta.env.VITE_APP_URL;
//   const [data, setData] = useState([]);

//   const fetchData = async () => {

//     try {
//       const response = await axios.get(`${API_URL}/api/userinbox/${user.useremail}`);
//       setData(response.data.reverse());
//       console.log(response.data)
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     if (user?.useremail) {
//       fetchData();
//     }
//   }, [user]); 


//   const columns = [
//     { name: "Sender", selector: (row) => row.sendby, sortable: true },
//     { name: "Subject", selector: (row) => row.subject, sortable: true },
//     { name: "Message", selector: (row) => row.content},
//     { name: "Date", selector: (row) => new Date(row.createdAt).toLocaleString(), sortable: true },
//   ];

//   return (
//     <>
//       <div>
//         <div className='d-flex gap-3'>
//         <h5 className='fw-bold mt-1'>Inbox</h5>
//         <button className='border-0 bg-transparent text-secondary'><i class="fa-solid fa-trash"></i></button>
//         <button className='border-0 bg-transparent text-secondary'><i class="fa-solid fa-rotate-right"></i></button>
//         <button className='border-0 bg-transparent text-secondary'><i class="fa-solid fa-ellipsis-vertical"></i></button>
//         </div>
       
//         <div className='mt-2'>
//         <DataTable
//         columns={columns}
//         data={data}
//         pagination
//         highlightOnHover
//         selectableRows
//         striped
//         responsive
//       />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Inbox;


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";

const Inbox = ({ user }) => {
  const API_URL = import.meta.env.VITE_APP_URL;
  const [data, setData] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [starredEmails, setStarredEmails] = useState(new Set());


  const fetchData = async () => {
   
    try {
      const response = await axios.get(`${API_URL}/api/userinbox/${user.useremail}`);
      setData(response.data.reverse());
    } catch (error) {
      console.error(error);
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
    { name: "Sender", selector: (row) => row.sendby, sortable: true },
    { name: "Subject", selector: (row) => row.subject, sortable: true },
    { name: "Message", selector: (row) => row.content },
    { name: "Date", selector: (row) => new Date(row.createdAt).toLocaleString(), sortable: true },
  ];

  return (
    <>
      <div>
        <div className='d-flex gap-3'>
          <h5 className='fw-bold mt-1'>Inbox</h5>
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
            <h6><strong>Subject:</strong> {selectedEmail.subject}</h6>
            <p>{selectedEmail.content}</p>
            <small className="text-muted">{new Date(selectedEmail.createdAt).toLocaleString()}</small>
          </div>
        )}
      </div>
    </>
  );
};

export default Inbox;
