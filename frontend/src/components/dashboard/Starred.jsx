import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'

const Starred = ({user,searchMail}) => {
  console.log(user)
  const API_URL = import.meta.env.VITE_APP_URL;


  const [data,setData]=useState([])

  const fetchStaredData=async()=>{
    try{
      const response=await axios.get(`${API_URL}/api/getstaredmail/${user.useremail}`)
       setData(response.data.reverse())
    }catch(error){
      console.log(error)
    }
  }
  useEffect(()=>{
    fetchStaredData()
  },[])
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
  const handleExpandRow = (expand, row) => {
    if (expand) {
      seenMail(row)
    }
  }

  const ExpandedRow = ({ data }) => (

    <div className='' style={{ padding: "10px", background: "#f9f9f9", borderRadius: "5px" }}>

      <div className='d-flex flex-wrap gap-5'>
        <h6><strong className='text-warning'>From:</strong> {data.sendby}</h6>
        <h6 cls><strong className='text-warning'>Cc:</strong> {data.cc}</h6>
        <h6><strong className='text-warning'>Bcc:</strong> {data.bcc}</h6>
        <small className="text-muted">{new Date(data.createdAt).toLocaleString()}</small>
      </div>
      <h6 className='mt-2'><strong className='text-warning'>Subject:</strong> {data.subject}</h6>
      <p className='mt-2'>{data.content}</p>
      <div className='mt-3'>
        <small><button className='btn btn-sm btn-warning'>Reply Mail</button></small>
      </div>


    </div>
  );
  const columns = [
  
    { name: "Sender", selector: (row) => row.sendby, sortable: true },
    { name: "Subject", selector: (row) => row.subject, sortable: true },
    { name: "Message", selector: (row) => row.content },
    { name: "Date", selector: (row) => new Date(row.createdAt).toLocaleString(), sortable: true },
  ];
  return (
    <>
    <div>starred</div>
    
    <div className='mt-2'>
          <DataTable
            columns={columns}
            data={filterMail}
            pagination
            highlightOnHover
            selectableRows
            responsive
            expandableRows
            expandableRowsComponent={ExpandedRow}
            onRowExpandToggled={handleExpandRow}
          />
        </div></>
  )
}

export default Starred