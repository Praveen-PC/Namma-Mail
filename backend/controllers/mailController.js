const db=require('../model/db')



const addmail = async (req, res) => {
    const { useremail, to, userrole, userid, cc, bcc, subject, content} = req.body;
    const setSeen=0;
    const setStart=0; 
    try {
      const sql = 'INSERT INTO mailinfo(sendby, sendto, userrole, userid, cc, bcc, subject, content, seen, starred) VALUES(?,?,?,?,?,?,?,?,?,?)';
      await db.query(sql, [useremail, to, userrole, userid, cc, bcc, subject, content, setSeen, setStart]);
      res.status(200).send("Mail sent successfully");
    } catch (error) {
      res.status(400).send(error);
    }
  };

  // get userinbox mail
  // const getInboxMail = async (req, res) => {
  //   const { mail } = req.params;
  //   try {
  //     const sql = "SELECT * FROM mailinfo WHERE sendto = ?";
  //     const [data] = await db.query(sql, [mail]);
  //     res.status(200).send(data);
  //   } catch (error) {
  //     res.status(500).json(error);
  //   }
  // };
  const getInboxMail = async (req, res) => {
    const { mail } = req.params;
    try {
        const sql = `
            SELECT 
                m.id AS mail_id, 
                m.sendby, 
                m.sendto, 
                m.subject, 
                m.content, 
                m.seen, 
                m.starred, 
                m.createdAt AS mail_createdAt,
                r.id AS reply_id,
                r.repsendby, 
                r.repsendto, 
                r.message AS reply_message, 
                r.createdAt AS reply_createdAt
            FROM mailinfo m
            LEFT JOIN replies r ON m.id = r.mailid
            WHERE m.sendto = ?
            ORDER BY m.createdAt DESC, r.createdAt ASC;
        `;
        
        const [data] = await db.query(sql, [mail]);

        // Group emails and their replies into a structured response
        const mailsMap = new Map();

        data.forEach(row => {
            if (!mailsMap.has(row.mail_id)) {
                mailsMap.set(row.mail_id, {
                    id: row.mail_id,
                    sendby: row.sendby,
                    sendto: row.sendto,
                    subject: row.subject,
                    content: row.content,
                    seen: row.seen,
                    starred: row.starred,
                    createdAt: row.mail_createdAt,
                    replies: []
                });
            }

            if (row.reply_id) {
                mailsMap.get(row.mail_id).replies.push({
                    id: row.reply_id,
                    repsendby: row.repsendby,
                    repsendto: row.repsendto,
                    message: row.reply_message,
                    createdAt: row.reply_createdAt
                });
            }
        });

        res.status(200).json(Array.from(mailsMap.values()));
    } catch (error) {
        res.status(500).json(error);
    }
};



  const getSendMail = async (req, res) => {
    const { mail } = req.params;
    console.log(mail)
    try {
      const sql = "SELECT * FROM mailinfo WHERE sendby = ?";
      const [data] = await db.query(sql, [mail]);
      res.status(200).send(data);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  

  const getEmailAddress=async(req,res)=>{
    try{
      const sql='SELECT * FROM userdetails'
      const [data]=await db.query(sql)
      res.status(200).send(data)

    }catch(error){
      req.status(400).send(error)
    }
  }

  // get all for admin

  const getAllMailInfo=async(req,res)=>{
    try{
      const sql='SELECT * FROM mailinfo'
      const [data]=await db.query(sql)
      res.status(200).send(data)

    }catch(error){
      res.status(400).send(error)

    }
  }
  
  // delete an particular mail

  const deletemail=async(req,res)=>{
    const {id}=req.params
    try{
      const sql='DELETE FROM mailinfo WHERE id=?'
      await db.query(sql,[id])
      res.status(200).send('mail deleted successfully')

    }catch(error){
      res.status(400).send(error)
    }
  }

  // set seen mail

  const updateMailSeen=async(req,res)=>{
    const {id}=req.params;
    const setSeen=1;
    try{
      const sql='UPDATE mailinfo SET seen=? WHERE id=?'
      await db.query(sql,[setSeen,id])
      res.status(200).send("mail seen updated")
    }
    catch(error){
      res.status(400).send(error)
    }
  }

  // update an particular mail

  const updateMail=async(req,res)=>{
    const{id}=req.params
    const {to,cc,bcc,subject,content}=req.body;
    try{
      const sql='UPDATE mailinfo SET sendto=? ,cc=?,bcc=?,subject=?,content=? WHERE id=?';
      await db.query(sql,[to,cc,bcc,subject,content,id])
      res.status(200).send("mail updated")

    }catch(error){
      res.status(400).send(error)
    }
  }

  // update star in mail

  const updateStar=async(req,res)=>{
    const {id}=req.params
    const setStar=1;
    try{
      const sql="UPDATE mailinfo SET starred=? WHERE id=?"
      await db.query(sql,[setStar,id])
      res.status(200).send("mail started")
    }catch(error){
      res.status(400).send(error)
    }
  }

  const removeStar=async(req,res)=>{
    const {id}=req.params
    console.log(id)
    const setStar=0;
    try{
      const sql="UPDATE mailinfo SET starred=? WHERE id=?"
      await db.query(sql,[setStar,id])
      res.status(200).send("mail unstarted")
    }catch(error){
      res.status(400).send(error)
    }
  }

  // get starred mail for particular user


  const getStaredMailUser=async(req,res)=>{
    const {mail}=req.params
    try{
      const sql='SELECT * FROM mailinfo WHERE sendto=? AND starred=1'
     const [data]= await db.query(sql,[mail])
      res.status(200).send(data)
    }catch(error){
      res.status(400).send(error)
    }
  }


  // reply message for 
  const replymessage=async(req,res)=>{
    const {sendto,sendby,mailid,message}=req.body
    try{
      const sql="INSERT INTO replies (repsendto,repsendby,mailid,message) VALUES (?,?,?,?)"
      await db.query(sql,[sendto,sendby,mailid,message])
      res.send(200).status("reply mail send successfully")
    }catch(error){
      res.status(400).send(error)
    }
  }


  // delete an email

  // const deleteMail=async(req,res)=>{
  //   const {id}=req.params
  //   try{
  //     const sql='DELETE FROM mailinfo Where id IN(?)'
  //     await db.query(sql,[id])
  //     res.status(200).send("mail was deleted")

  //   }catch(error){
  //     res.status(400).send(error)
  //   }
  // }

  const deleteMail = async (req, res) => {
    const { ids } = req.body; // Extract IDs from request body
  
    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No mail IDs provided" });
    }
  
    try {
      const sql = 'DELETE FROM mailinfo WHERE id IN (?)';
      await db.query(sql, [ids]); // Pass array correctly
  
      res.status(200).json({ message: "Mails deleted successfully" });
    } catch (error) {
      console.error("Error deleting mails:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  module.exports={addmail,getInboxMail,getSendMail,
                 getEmailAddress,getAllMailInfo,
                 deletemail,updateMailSeen,
                updateMail,updateStar,
              removeStar,getStaredMailUser,
              replymessage,deleteMail}