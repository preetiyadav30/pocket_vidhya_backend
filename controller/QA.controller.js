const db = require("../dbConnections")
const express = require('express')
const jwt = require('jsonwebtoken');
const { body, Result } = require("express-validator");
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors')
const { request } = require('express');

const QA=async(req,res,next)=>{
    try{
        
        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)
        const decoded_userId=decode.data[0].user_id

        db.query("select question_id,level,category,question,option1, option2,  option3,  option4,correct_option from questionnaire rand where question_id=?",[req.body.question_id],(err,result)=>{
            if(!req.body.question_id||!req.body.answer){
              res.status(404).send({
                success:false,
                msg:`Please enter question_id and answer`
                
              })
        }           
          else if(err){
                res.status(400).send({
                    success:true,
                    err:err
                })
            }
           else if(result){
                let isCorrect_answer;
                if(!result.length){
                    res.status(400).send({
                        success:"false",
                        msg:`Question witht id:${req.body.question_id} is not available`
                    })
                }
                else{
                if(result[0].correct_option!==req.body.answer){
                    isCorrect_answer=0;
                }
                else if(result[0].correct_option==req.body.answer){
                     isCorrect_answer=1;
                }
                res.status(200).send({
                    success:true,
                    Correct_Answer:isCorrect_answer,
                    QuestionResponse:result,
                   
                })

            
                
            }
        }
    })       
}
catch(err){
    res.status(400).send({
        success:false,
        err:err.message
    })
}
}

const my_progress = async (req,res,next)=>{
    try {
        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)
        const decoded_User_id = decode.data[0].user_id
        const decoded_category = decode.data[0].category
        const decoded_language = decode.data[0].language
        const decoded_Username = decode.data[0].username
        const decoded_Mobile_no = decode.data[0].Mobile_no
        // console.log(decoded_Username)
        db.query(`select count(question_id) as Total_Available_Questions from questionnaire where status='ACTIVE' and category='${decoded_category}'`, (totalQuestion_err, totalQuestion_result) => {

            if(totalQuestion_err){
                res.status(401).send({
                    success:false,
                    error:totalQuestion_err
                });
            }else{
                if(totalQuestion_result){
                    if(!totalQuestion_result.length){
                        res.status(404).send({
                            success:false,
                            message:"no question available"
                        })
                    }else{
                         db.query(`SELECT * FROM attempts WHERE user_id=? and category=? ORDER BY 
                         Attempt_id DESC LIMIT 1`,[decoded_User_id,decoded_category],(err,result)=>{
                            if(err){
                                res.status(400).send({
                                    success:false,
                                    err:err.message
                                })
                            }
                            if(result){
                               if(!result.length){
                                res.status(404).send({
                                    success:false,
                                    message:"you are not attempted any question"
                                })
                               }
                               else{            
                                let Right_Answer=result[0].correct_Answers
                                let Unattempted_Question = result[0].q_Skipped
                                let Attempted_question = result[0].q_attempted
                                const percentage = (100*Right_Answer)/Attempted_question
                                const Wrong_Answer = Attempted_question-(Right_Answer+Unattempted_Question)
                                const Total_Question = totalQuestion_result[0]
                                res.status(200).send({
                                    Username:decoded_Username,Mobile_no:decoded_Mobile_no,
                                    percentage,Right_Answer,Wrong_Answer,Attempted_question,Unattempted_Question,
                                    Total_Questions:Total_Question   
                                })
                                
                               
                               }
                            }
                        })
                    }
                }
             
            }
        })

    } catch (error) {
        res.status(500).send({
            success:false,
            error:error
        })
    }
}

const admin_my_progress = async(req,res,next)=>{
    try {
        await db.query(`select * from attempts where user_id=?`,(req.params.user_id),(err,result)=>{
            if(err){
                res.status(400).send({
                    success:false,
                    err:err.message
                })
            }
            if(result){
                if(!result.length){
                    res.status(404).send({
                        success:false,
                        message:" This user did not attempt any quiz"
                    })
                }
                else{
                    const Right_Answer = result[0].correct_Answers
                    const Attempted_question = result[0].q_attempted
                    const Unattempted_Question = result[0].q_Skipped
                    const Category = result[0].category
                    const Level = 1
                    const Wrong_Question = Attempted_question-(Right_Answer+Unattempted_Question)

                    // res.status(200).send([{
                    //     Level,
                    //     Category,
                    //     Right_Answer,
                    //     Wrong_Question,
                    //     Attempted_question,
                    //     Unattempted_Question,

                    // }])
                    res.status(200).send({
                        success:true,
                        results:[{Level,Category,Right_Answer,Wrong_Question,Attempted_question,Unattempted_Question}]
                    }
                    )
                 }
            }
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            error:error
        })
    }
}

module.exports={QA, my_progress, admin_my_progress}