const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken')
const db=require('./dbConnections')
const controller=require('./controller/user.controller')
const QAcontroller=require('./controller/QA.controller')
const multer=require('multer')
const path=require('path')
const validation=require('./validator')

const controller1=require('./controller/answer.controller')
const adminValidation=require('./admin_validation');const { JWT } = require('google-auth-library');
const cors=require('cors');
const { createPool } = require('mysql');
const storage= multer.diskStorage({
    destination:'Pocket_Vidhya/public/images',
    filename:(req,file,callback)=>{
        return callback(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload=multer({
    storage:storage
});

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();});

/**************USER ******************/

router.post("/user/signup",controller.user_signup)

router.post("/signup",controller.signup)

router.post('/user/mobile_verification',controller.check_Mo_no)

router.post("/user/login",controller.user_login)

router.post('user/logout',validation,controller.user_logout)

router.patch("/user/update_language_and_category",validation,controller.user_update_language_and_category)

router.get("/user/getQuestion/:Language/:category",validation,controller.user_getQuestion_by_language_and_category)

router.post('/user/answer',validation,controller1.answer_attempt)

router.get('/user/get_all_categories',validation,controller.user_get_all_categories)

//router.get('/getAvtar',upload.single('image'),controller.avtar_category)

//router.post('/add_avtar', adminValidation,upload.single('image'),controller.add_avtar)

//router.post('/answer',validation,controller.answer1);

router.post('/user/rank', validation, controller.user_rank)

router.post ('/get_question_user',validation,controller.get_question_user)

router.post('/quiz_Categories',validation,controller.quiz_category)
//****************************************************************************/

/*************ADMIN **********************************************************/

router.get('/user/total',adminValidation,controller.total_user)

router.get('/admin/Dashboard_total',controller.total_language)

router.get('/admin/total_category',adminValidation,controller.total_category)

router.patch('/admin/update_question_status',adminValidation,controller.admin_update_questionStatus)

// router.patch('/admin_update_question/:question_id',adminValidation,controller.admin_update_question);

router.put('/admin_update_question/:Question_id',adminValidation,controller.admin_update_question);

router.post('/admin/add_category',adminValidation,controller.admin_add_category)

router.get('/admin/get_all_categories',controller.get_all_categories)

router.get("/admin/get_all_language",controller.get_all_language)

router.post('/admin/delete_language',adminValidation,controller.admin_delete_language)

router.post('/admin/add_question',adminValidation,controller.add_question)

router.post('/admin/Signup',controller.admin_signup)

router.post('/admin/Login',controller.adminLogin1)

router.post('/admin/forgot_password',controller.admin_forgot_password)

router.post('/admin/add_language',adminValidation,controller.admin_add_language)

router.get('/admin/getStatistics',adminValidation,controller.admin_Statistics)

router.get('/admin/getQuestions/:category',controller.admin_getQuestion)

router.get('/admin/getQuestions_by_id/:Question_id',controller.admin_getQuestion_by_Id)

router.get('/admin/getUsers',adminValidation,controller.admin_get_user)

router.delete("/user/delete_user/:user_id",controller.delete_user)

router.delete("/admin/delete_question/:Question_id",controller.delete_question);

router.get('/admin/getQuestion/:Language/:category',controller.admin_getQuestion_by_language_and_category)

router.post('/user/QA',QAcontroller.QA)

//***************************************************************************/


module.exports=router