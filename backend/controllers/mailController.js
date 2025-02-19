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
  const getInboxMail = async (req, res) => {
    const { mail } = req.params;
    try {
      const sql = "SELECT * FROM mailinfo WHERE sendto = ?";
      const [data] = await db.query(sql, [mail]);
      res.status(200).send(data);
    } catch (error) {
      res.status(500).json(error);
    }
  };


  const getSendMail = async (req, res) => {
    const { mail } = req.params;
    try {
      const sql = "SELECT * FROM mailinfo WHERE sendby = ?";
      const [data] = await db.query(sql, [mail]);
      res.status(200).send(data);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  

  module.exports={addmail,getInboxMail,getSendMail}