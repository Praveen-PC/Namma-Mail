const express=require('express')
const router=express.Router()
const mailcontroller=require('../controllers/mailController')

router.post('/addmail',mailcontroller.addmail)
router.get('/userinbox/:mail',mailcontroller.getInboxMail)
router.get('/usersend/:mail',mailcontroller.getSendMail)

module.exports=router