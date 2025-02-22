const express=require('express')
const router=express.Router()
const mailcontroller=require('../controllers/mailController')

router.post('/addmail',mailcontroller.addmail)
router.get('/userinbox/:mail',mailcontroller.getInboxMail)
router.get('/usersend/:mail',mailcontroller.getSendMail)
router.get('/getaddress',mailcontroller.getEmailAddress)
router.get('/allmail',mailcontroller.getAllMailInfo)
router.delete('/deletemail/:id',mailcontroller.deletemail)
 router.put('/updateseenmail/:id',mailcontroller.updateMailSeen)
 router.put('/updatemail/:id',mailcontroller.updateMail)
 router.put('/updatestar/:id',mailcontroller.updateStar)
 router.put('/removestar/:id',mailcontroller.removeStar)
 router.get('/getstaredmail/:mail',mailcontroller.getStaredMailUser)
 router.post('/replymail',mailcontroller.replymessage)
 router.delete('/deletemail',mailcontroller.deleteMail)

module.exports=router