const db = require("../dbConnections")
const express = require('express')
const jwt = require('jsonwebtoken');
const { body, Result } = require("express-validator");
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors')
const { request } = require('express');


const user_signup = async (req,res,next)=>{
    try {
        await db.query(`select * from user where username=? and Mobile_no=?`,[req.body.username,req.body.Mobile_no],(err,result,fields)=>{
            if(err){
                res.status(401).send({
                    success:false,
                    err:err.message
                });
            }
            if(!result.length){
                db.query(`insert into user (username,Mobile_no) values (?,?)`,[req.body.username,req.body.Mobile_no],(err,result,fields)=>{
                    if(err){
                        res.status(400).send({
                            success:false,
                            msg:"user with this username or mobile number already exits please enter unique username and mobile number",
                            err:err.message
                        })
                    }
                    else{
                        res.status(200).send({
                            success:true,
                            results:result,
                            msg:"Signup Successfully"
                        })
                    }
                })
            }else{
                res.status(200).send({
                    success:true,
                    msg:"User already exits please login to continue"
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            error:error.message
        })
    }
}

const signup = async (req, res, next) => {
    // try {
    await db.query('select * from user where username=? and Mobile_no=?', [req.body.Mobile_no,req.body.username], (err, results, feilds) => {
        if (err) {
            res.status(400).send({
                success: false,
                message:"user already exits with this username",
                err: err
            })
        }
        if (!results.length) {
            db.query('Insert into user(username,Mobile_no) values(?,?)', [req.body.username, req.body.Mobile_no], (berr, bresult, feilds) => {
                if (berr) {
                    res.status(400).send({
                        success: false,
                        message:"user already exits with this mobile number",
                        err:berr
                    })
                }
                else {
                   
                   
                    db.query('select * from user where Mobile_no=?', [req.body.Mobile_no], (cerr, cresult, feilds) => {
                        if (cerr) {
                            res.status(400).send({
                                success: false,
                                message:"user already exists please login",
                                err:cerr
                            })
                        }
                        else{
                            const token = jwt.sign({ data: cresult }, process.env.JWT_SECRET_KEY)    
                        res.status(201).send({
                        success: true,
                        message: "Signup Successfully",
                        results: cresult,
                        token: token
                    })
                   }
                   })
                }
            })
        }
    })
}

const check_Mo_no = async (req, res, next) => {

    await db.query(`select * from user where Mobile_no=?`, [req.body.mobile_no], (error, result, feilds) => {
        if (error) {
            res.status(400).send({
                success: false,
                err: error
            })
        } else {

            if (result.length > 0) {
                res.status(200).send({
                    success: true,
                    message: "Login Successfully"
                    
                })
            } else {
                res.status(404).send({
                    success: false,
                    message: "User not found Please signup first"
                    
                })
            }
        }
    })
}

const user_login = async (req, res, next) => {
    await db.query(`select * from user where Mobile_no=?`, [req.body.Mobile_no], (err, result, feilds) => {

        if (err) {
            res.status(400).send({
                success: false,
                err: err.message
            })
        }
        if (result) {
            const token = jwt.sign({ data: result }, process.env.JWT_SECRET_KEY,{expiresIn:"730h"})
            if (result.length) {
            // result[0]={token:token}
                res.send({
                    
                    message: "Login Successfully",
                    success: true,
                    results: result,
                    token:token
                    
                })
            } else {
                res.status(400).send({
                    success: false,
                    message: "Please signup to continue"
                })
            }
        }
    })
}

const user_update_language_and_category = async (req, res, next) => {
  
        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)

        let decoded_Mobile_no = decode.data[0].Mobile_no

    db.query(`update user set Language=?,category=? where Mobile_no=${decoded_Mobile_no}`, [req.body.Language, req.body.category], (err, result) => {
        if (err) {
            res.status(400).send({
                success: false,
                err: err.message
            })
        }
        else {

            res.status(200).send({
                success: true,
                message: `updated successfully`,
                // results: result
            })
        }

    })
}

const user_getQuestion_by_language_and_category=async(req,res,next)=>{
    try{
        await db.query("Select * from questionnaire where Language=? and category=?",[req.params.Language,req.params.category],(err,result)=>{
            if(err){
                res.status(400).send({
                    success:false,
                    err:err
                })
            }
            console.log(result)
            if(result){
                res.status(200).send({
                    success:true,
                    results:result
                   
                })
            }else{
                res.status(404).send({
                    success:false,
                    
                })
            }
        })
    }
    catch(Exeption){
        res.status(400).send({
            success:false,
            err:Exeption
        })
    }
}

const user_logout=async(req,res,next)=>{
    try{
        const token=req.headers.authorizattion.split(" ")[1]
        const decode=jwt.decode(token)

        const decoded_userid=decode.user_id
        db.query('update user set status="INACTIVE" where user_id=?',[decoded_userid],(err,result)=>{
            if(err){
                res.status(400).send({
                    success:false,
                    err:err

                })
            }
            if(result){
                res.status(200).send({
                    success:true,
                    msg:"Logout Success"
                })
            }
        })
    }
    catch(err){
        res.status(400).send({
            success:false,
            err:err
        })
    }
}

// const signup = async (req, res, next) => {
//     // try {

//         await db.query('select * from user where mobile_no=? and username=?', [req.body.mobile_no, req.body.username], (err1, result, feilds) => {

//             if (err1) {
//                 res.status(400).send({
//                     success: false,
//                     err:err1
//                 })
//             }
//             if (result) {
//                  db.query(`update user set avtar='${req.body.avtar}' ,language=? where username=? and mobile_no=?`,[req.body.language,req.body.username,req.body.mobile_no],(berr,bresult)=>{
//                     if(berr){
//                         res.status(400).send({
//                             success:false,
//                             ere:berr
//                         })
//                     }
//                 if(bresult){
               
//                 const token = jwt.sign({ data: result }, process.env.JWT_SECRET_KEY)
//                 if (result.length) {
//                     res.send({
//                         message: "User Already Exists",
//                         success: true,
//                         results:result,
//                         token: token
//                     })
//                 }
//                 if (!result.length) {

//                     db.query('Insert into user(username,mobile_no,Language,Avtar) values(?,?,?,?)', [req.body.username, req.body.mobile_no, req.body.Language, req.body.Avtar], (berr, bresult, feilds) => {
//                         if (berr) {
//                             res.status(400).send({
//                                 success: false,
//                                 err: berr
//                             })
//                         }
//                         else if (bresult) {
//                             db.query(`select * from user where username="${req.body.username}"`, (err, result, feilds) => {
//                                 if (err) {
//                                     res.status(400).send({
//                                         success: false,
//                                         err: err
//                                     })
//                                 }

//                                 if (result) {
//                                     const token = jwt.sign({ data: result }, process.env.JWT_SECRET_KEY)

//                                     res.status(200).send({
//                                         success: true,
//                                         message: "New User Created",
//                                         // results: bresult,
//                                         token: token

//                                     })
//                                 }
//                             })
//                         }
//                     })

//                 }        
//             }
//         }) 
//             }
//         })

//     // }
//     // catch (err) {
//     //     res.status(400).send({
//     //         seccess: false,
//     //         err: err.message
            
//     //     })
//     // }
// }

const avtar_category = async (req, res) => {
    try {
        await db.query('Select * from avtar', (err, results, feilds) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }
            else if (results) {
                res.status(200).send({
                    success: true,
                    results: results
                })
            }
        })
    }
    catch (err) {
        res.status(400).send({
            seccess: false,
            err: err
        })
    }

}

const user_get_all_categories = async (req,res,next)=>{
    try {
        await db.query(`select * from category`,(err,result,feilds)=>{
            if(err){
                res.status(401).send({
                    success:false,
                    err:err.message 
                });
            }
            if(!result){
                res.status(404).send({
                    success:false,
                    msg:"data not found"
                });
            }else(
                res.status(200).send({
                    success:true,
                    msg:"All categories ",
                    results:result
                })
            )
        })
    } catch (error) {
       res.status(500).send({
        success:false,
        error:error.message
       }) 
    }
}
// **************************************

// const admin_addCategory=(req,res,next)=>{
//     await db.query('insert into category ')
// }*************************************
const adminLogin1 = async (req, res, next) => {
    db.query('Select * from admin where username=? and email=?', [req.body.username, req.body.email], (err, result, feilds) => {
        if (err) {
            res.status(400).send({
                success: false,
                err: err
            })
        }
        if (result) {
            if (!result.length) {
                res.status(404).send({
                    success: false,
                    msg: "Wrong Username ,email or Password"
                })
            }
          else {
           const  is_PasswordCorrect=bcrypt.compareSync(req.body.password,result[0].password)
            //  console.log(result)
                       if(is_PasswordCorrect==true){
                          const token = jwt.sign({ data: result }, process.env.POCKET_ADMIN_SECRET)
                           res.status(200).send({
                            success:true,
                            results:result,
                            token:token
                           })
                       }
                       if(is_PasswordCorrect==false){
                           res.status(400).send({
                            success:false,
                            msg:"Wrong Password"
                           })
                       }
                 
          }

            // else {
            //     is_PasswordCorrect = bcrypt.compareSync(req.body.password, result[0].password, (err) => {
            //             if (err) {
            //                 res.status(400).send({
            //                     success: false,
            //                     msg: "Wrong password",

            //                 })
            //             }
            //             else {
            //                 const token = jwt.sign({ data: result }, process.env.POCKET_ADMIN_SECRET)
            //                 res.status(200).send({
            //                     success: true,
            //                     msg: `User login Successfull`,
            //                     results: result,
            //                     token: token
            //                 })
            //             }
            //         })
            // }
        }

    })
}

const admin_forgot_password = (req, res) => {
    try {
        db.query(`select email from admin where email=?`, [req.body.email], (err, result) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }
            if (result) {
                if (!result.length) {
                    res.status(400).send({
                        success: false,
                        msg: "Email not Found"
                    })
                }
                else {
                    const EncryptedPassword = bcrypt.hashSync(req.body.password, 10)
                    db.query(`update admin set password=? where email=?`, [EncryptedPassword, req.body.email], (uerr, uresult) => {
                        if (uerr) {
                            res.status(400).send({
                                success: false,
                                error: uerr
                            })
                        }
                        else {
                            res.status(200).send({
                                success: true,
                                msg: "password reset successfully"
                            })
                        }
                    })

                }
            }

        })
    } catch (error) {
        res.status(400).send({
            success: false,
            err: error
        })
    }
}

// const add_question = async (req, res, next) => {
//     try {

//         const auth = req.headers.authorization.split(" ")[1]
//         const decode = jwt.decode(auth)
//                 console.log(decode);
//         let decoded_Username = decode.data[0].Admin_id
//         console.log(decoded_Username)
//         await db.query('select * from questionnaire where question=? ', [req.body.Question], (err, result, feilds) => {
//             if (err) {
//                 res.status(400).send({
//                     success: false,
//                     err: err.message,
//                     block: 1
//                 })
//             }
//             if (result) {
//                 if (result.length > 0) {
//                     res.status(200).send({
//                         success: true,
//                         msg: "Question Already Exists "
//                     })
//                 }
//                 else {
//                     db.query(`insert into questionnaire(Question,category,option1,option2,option3,option4,correct_option,Description,Language,created_at,added_by) values(?,?,?,?,?,?,?,?,?,?,?)`, [req.body.Question, req.body.category, req.body.option1, req.body.option2, req.body.option3, req.body.option4, req.body.correct_option, req.body.Description,req.body.Language,Date.now(),decoded_Username], (berr, bresult, feilds) => {
//                         if (berr) {
//                             res.status(400).send({
//                                 success: false,
//                                 err: berr.message,
//                                 block: 2
//                             })
//                         }
//                         if (bresult) {
//                             res.status(200).send({
//                                 success: true,
//                                 msg: `Question Added `,
//                                 results: bresult
//                             })
//                         }

//                     })
//                 }
//             }

//         })


//     }
//     catch (err) {
//         res.status(400).send({
//             seccess: false,
//             err: err.message
//         })
//     }
// }

const add_question = async (req, res, next) => {
    try {

        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)

        let decoded_Username = decode.data[0].Admin_id
        console.log(decoded_Username)
        await db.query('select * from questionnaire where question=? ', [req.body.Question], (err, result, feilds) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err.message,
                    block: 1
                })
            }
            if (result) {
                if (result.length > 0) {
                    res.status(200).send({
                        success: true,
                        msg: "Question Already Exists "
                    })
                }
                else {
                    db.query(`insert into questionnaire(Question,category,Level,option1,option2,option3,option4,correct_option,Language,Status,Description,added_by) values(?,?,?,?,?,?,?,?,?,?,?,?)`, [req.body.Question, req.body.category,req.body.Level, req.body.option1, req.body.option2, req.body.option3, req.body.option4, req.body.correct_option,req.body.Language,req.body.Status,req.body.Description, decoded_Username], (berr, bresult, feilds) => {
                        if (berr) {
                            res.status(400).send({
                                success: false,
                                err: berr,
                                block: 2
                            })
                        }
                        if (bresult) {
                            res.status(200).send({
                                success: true,
                                msg: `Question Added by Admin:${decoded_Username}`,
                                results: bresult
                            })
                        }

                    })
                }
            }

        })


    }
    catch (err) {
        res.status(400).send({
            seccess: false,
            err: err.message
        })
    }
}

const question = async (req, res, next) => {
    await db.query('select * from questionnaire where category=? order by rand()', [req.body.category], (err, result, feilds) => {
        if (err) {
            res.status(400).send({
                success: false,
                err: err
            })
        }
        if (result) {
            if (!result.length) {
                res.status(404).send({
                    success: false,
                    msg: "Category not"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    results: result
                })
            }

        }
    })
}

const add_avtar = async (req, res, next) => {
    try {
        var file = req.file.filename
        await db.query('Insert into avtar(Avtar_id,avtar,image) values(?,?,?)', [req.body.Avtar_id, req.body.avtar, file], (err, result, feilds) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }
            if (result) {
                res.status(200).send({
                    success: true,
                    msg: "Avtar Added",
                    avtar_url: `127.0.0.1:5000/${file}`,
                    results: result

                })
            }
        })
    }
    catch (err) {
        res.status(400).send({
            success: false,
            msg: "Error due to try block",
            err: err
        })
    }

}

const get_question_user = async (req, res, next) => {

    const default_status = "ACTIVE";
    try {
        await db.query('Select Question_id,Question,option1,option2,option3,option4,correct_option,Description from questionnaire where status= ? and category=? and language=? order by rand()', [default_status, req.body.category,req.body.language], (err, result, feilds) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }
            else if (result) {
                if (!result.length) {
                    res.status(400).send({
                        success: false,
                        msg: `No Questions found for category ${req.body.category} or ${req.body.language}`
                    })
                }
                else {
                    res.status(200).send({
                        success: true,
                        results: result
                    })
                }
            }
        })
    }
    catch (err) {
        res.status(400).send({
            success: false,
            err: err
        })
    }
}

const admin_signup = async (req, res, next) => {
    try {
        await db.query(`select * from admin where username=? and email=? and password=?`, [req.body.username, req.body.email, req.body.password], (err, result, feilds) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }
            if (result) {
                if (result.length) {
                    res.status(302).send({
                        success: false,
                        msg: "User Already Exists"
                    })
                }
                else {
                    const EncryptedPassword = bcrypt.hashSync(req.body.password, 10)
                    //  const EncryptedPassword=  bcrypt.hash(req.body.password, 10, (err) => {
                    // if (err) {
                    //     return res.status(400).send({
                    //         success: false,
                    //         err: err
                    //     })
                    // }
                    // else {
                    db.query('Insert into admin(username,email,password) values(?,?,?)', [req.body.username, req.body.email, EncryptedPassword], (err, result, feilds) => {
                        if (err) {
                            return res.status(400).send({
                                success: false,
                                err: err
                            })
                        }
                        if (result) {
                            return res.status(200).send({
                                success: true,
                                message: `New Admin ${req.body.username} Registered Successfully`,
                                results: result
                            })
                        }
                    })
                    // }
                    // })
                }
            }
        })
    }
    catch (err) {
        if (er) {
            res.status(400).send({
                success: false,
                err: err
            })
        }
    }
}

const admin_update_question = async (req, res, next) => {

    try {
        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)

        const decoded_Username = decode.data[0].Admin_id

        await db.query(`Update questionnaire set Question=?,category=?,option1=?,option2=?,option3=?,option4=?,correct_Option=?,Description=?,Language=?,Status=?,updated_at=${Date.now()},added_by=? where Question_id=?`, [req.body.Question, req.body.category, req.body.option1, req.body.option2, req.body.option3, req.body.option4, req.body.correct_Option, req.body.Description, req.body.Language, req.body.Status,decoded_Username,req.params.Question_id], (err, result, feilds) => {
            if (err) {
                res.status(401).send({
                    success: false,
                    err: err.message
                })
            }
            if (result) {
                res.status(200).send({
                    success: true,
                    results: result
                })
            }
        })
    }
    catch (err) {
        if (err) {
            res.status(400).send({
                success: false,
                err: err.message
            })
        }
    }
}

const delete_question = async (req, res, next) => {
    try {
      await db.query(
        "select * from questionnaire where Question_id=?",
        [req.params.Question_id],
        (err, result, feilds) => {
          if (err) {
            res.status(400).send({
              success: false,
              err: err,
            });
          } else {
            db.query(
              "delete from questionnaire where Question_id= ?",
              [req.params.Question_id],
              (berr, bresult, feilds) => {
                if (berr) {
                  res.status(400).send({
                    success: false,
                    err: berr,
                  });
                } else {
                  res.status(200).send({
                    success: true,
                    msg: "Question Delete successfully...",
                    results: bresult,
                  });
                }
              }
            );
          }
        }
      );
    } catch (err) {
      res.status(400).send({
        seccess: false,
        err: err,
      });
    }
  };

// const admin_update_question = async (req, res, next) => {
//     try {
//       const auth = req.headers.authorization.split(" ")[1];
//       const decode = jwt.decode(auth);
  
//       const decoded_Username = decode.data[0].Admin_id;
  
//       await db.query(
//         `update questionnaire set Question=? , category=? , Level=?, option1=? , option2=? , option3=? , option4=? , correct_Option=? , Description=? , Language=? , Status=? , updated_at=${Date.now()},added_by=? where question_id=?`,
//         [
//           req.body.Question,
//           req.body.category,
//           req.body.Level,
//           req.body.option1,
//           req.body.option2,
//           req.body.option3,
//           req.body.option4,
//           req.body.correct_Option,
//           req.body.Description,
//           req.body.Language,
//           req.body.Status,
//           req.params.question_id,
//           decoded_Username
//         ],
//         (err, result, feilds) => {
//           if (err) {
//             res.status(400).send({
//               success: false,
//               err: err.message,
//             });
//           }
//           if (result) {
//             res.status(200).send({
//               success: true,
//               results: result,
//               msg:"change"
//             });
//           }
//         }
//       );
//     } catch (err) {
//       if (err) {
//         res.status(400).send({
//           success: false,
//           err: err.message,
//         });
//       }
//     }
//   }

const admin_add_category = async (req, res, next) => {

    const auth = req.headers.authorization.split(" ")[1]
    const decode = jwt.decode(auth)

    const decoded_Username = decode.data[0].Admin_id
    const decoded = jwt.decode.username

    try {


        await db.query('Insert into category (category,added_by) values(?,?)', [req.body.category, decoded_Username
        ], (err, result, feilds) => {
            if (err) {
                res.status(400).send({
                    success: true,
                    err: err,

                })
            }
            if (result) {
                res.status(200).send({
                    success: true,
                    msg: `New category ${req.body.category} added `,
                    results: result

                })
            }

        })
    }
    catch (err) {
        if (err) {
            res.status(400).send({
                ssuccess: false,
                err: err.message
            })
        }
    }
}

const get_all_categories = async (req,res,next)=>{
    try {
        await db.query(`select * from category`,(err,result,feilds)=>{
            if(err){
                res.status(401).send({
                    success:false,
                    err:err.message 
                });
            }
            if(!result){
                res.status(404).send({
                    success:false,
                    msg:"data not found"
                });
            }else(
                res.status(200).send({
                    success:true,
                    msg:"All categories ",
                    results:result
                })
            )
        })
    } catch (error) {
       res.status(500).send({
        success:false,
        error:error.message
       }) 
    }
}

const get_all_language = async (req,res,next)=>{
    try {
        await db.query(`select * from language`,(err,result,feilds)=>{
            if(err){
                res.status(401).send({
                    success:false,
                    err:err.message 
                });
            }
            if(!result){
                res.status(404).send({
                    success:false,
                    msg:"data not found"
                });
            }else(
                res.status(200).send({
                    success:true,
                    msg:"All categories ",
                    results:result
                })
            )
        })
    } catch (error) {
       res.status(500).send({
        success:false,
        error:error.message
       }) 
    }
}

const admin_add_language = async (req, res, next) => {
    try {
        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)

        const decoded_Username = decode.data[0].Admin_id


        const token = req.headers.Autherization;
        // const decoded = token.decode.username
        await db.query('Insert into language (language,added_by) values(?,?)', [req.body.language, decoded_Username], (err, result, feilds) => {
            if (err) {
                res.status(400).send({
                    success: true,
                    err: err
                })
            }
            if (result) {
                res.status(200).send({
                    success: true,
                    results: result
                })
            }

        })
    }
    catch (err) {
        if (err) {
            res.status(400).send({
                ssuccess: false,
                err: err.message,
                err_code: err.code
            })
        }
    }
}

const admin_delete_language = async (req, res, next) => {



    db.query('Delete from language where language? or language_id=?', [req.body.language_id, req.body.language], (err, result, feilds) => {
        if (err) {
            res.status(400).send({
                success: false,
                err: err
            })
        }
        if (result) {
            if (!result.length) {
                res.status(400).send({
                    success: false,
                    msg: `question_id:${req.body.question_id} do not exists`
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    results: result
                })
            }
        }
    })
}

const total_user = async (req, res, next) => {
    await db.query('select count(user_id) from user', (err, result) => {
        if (err) {
            res.status(400).send({
                success: false,
                err: err
            })
        }
        if (result) {
            res.status(200).send({
                success: true,
                results: result
            })
        }
    })
}

const total_language = async (req, res, next) => {
    await db.query('select count(language_id) as Total_language from language', (err, result) => {

        db.query('select count(category_id) as Total_Category from category', (aerr, aresult) => {

            db.query('select count(user_id) as Total_Users from user', (berr, bresult) => {

                db.query('select count(admin_id) as Total_Admins from admin', (cerr, cresult) => {

                    if (cerr || berr || aerr || err) {
                        res.status(400).send({
                            success: false,
                            err: err || aerr || berr || cerr
                        })
                    }
                    else {

                        res.status(200).send({
                            success: true,
                            results: [{
                                Total_Admin: cresult[0].Total_Admins,
                                Total_Users: bresult[0].Total_Users,
                                Total_Languages: result[0].Total_language,
                                Total_Categories: aresult[0].Total_Category
                            }]

                        })
                    }
                })
            })
        })
    })
}

const total_category = async (req, res, next) => {
    await db.query('select  count(category_id) as Total_categories from category', (err, result) => {
        if (err) {
            res.status(400).send({
                success: false,
                err: err
            })
        }
        if (result) {
            res.status(200).send({
                success: true,
                results: result
            })
        }
    })
}

const quiz_category = async (req, res, next) => {
    try {
        await db.query('select category from category', (err, result) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }

            if (result) {
                res.status(200).send({
                    success: true,
                    results: result
                })
            }
        })
    }
    catch (err) {
        res.status(400).send({
            success: false,
            err: err
        }
        )
    }
}

const admin_update_questionStatus = async (req, res, next) => {
    try {
        await db.query('select question_id from questionnaire where question_id=?', [req.body.question_id], (err, result, feilds) => {

            if (err) {
                res.status(400).send({

                    success: false,
                    err: err
                })
            }
            if (result) {
                db.query('update questionnaire set Status=? where question_id=?', [req.body.Status, req.body.question_id], (berr, bresult, feilds) => {
                    if (berr) {
                        res.status(400).send({
                            success: false,
                            err: err
                        })
                    }
                    if (bresult) {
                        res.status(200).send({
                            success: true,
                            msg: `Status updated to:'${req.body.Status}' for question_id:${req.body.question_id}`
                        })
                    }
                })
            }
        })
    }

    catch (err) {
        if (err) {
            res.status(400).send({
                err: err
            })
        }
    }
}

const answer1 = async (req, res, next) => {

    try {

        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)

        const decoded_Username = decode.data[0].user_id


        // console.log(decoded_Username)

        db.query('Select * from questionnaire where question_id=?', [req.body.question_id], (question_err, question_result) => {
            if (question_err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }

            if (question_result) {

                if (!question_result.length) {
                    res.status(404).send({
                        success: false,
                        msg: `question for id:${req.body.question_id} not found`
                    })
                }
                else {
                    if (req.body.answer == question_result[0].correct_Option) {
                        var isCorrectans = '1'
                    }
                    else if (req.body.answer !== question_result[0].correct_Option) {
                        var isCorrectans = '0'
                    }
                    db.query('Insert into answer (user_id,question_id,category,answer,isCorrect) values(?,?,?,?,?)', [decoded_Username, req.body.question_id, question_result[0].category, req.body.answer, isCorrectans], (answer_err, answer_result, feilds) => {
                        if (answer_err) {
                            res.status(400).send({
                                success: false,
                                err: answer_err
                            })
                        }
                        else if (answer_result) {
                            res.status(200).send({
                                success: true,
                                isCorrect: isCorrectans,


                            })
                        }
                    })
                }
            }

        })
    }
    catch (err) {
        res.status(400).send({
            success: false,
            err: err.message
        })
    }
}

const admin_Statistics = async (req, res, next) => {
    try {
        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)

        const decoded_Username = decode.data[0].user_id

        db.query('Select * from attempts where user_id=? and category=?', [decoded_Username, req.body.category], (err, result) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }
            if (result){
                if (!result.length) {
                   res.status(404).send({
                    success:false,
                    msg:`No attempts for user:${decoded_Username} for category:${req.body.category}`
                   })
                }
                else {
                    res.status(200).send({
                        success: true,
                        results: result
                    })
                }
            }
        })
    }
    catch (err) {
        res.status(400).send({
            success: false,
            err: err
        })
    }
}

const admin_get_user=async(req,res,next)=>{
    await db.query('select * from user',(err,result)=>{
        if(err){
            res.status(400).send({
                success:false,
                err:err
            })
        }
        if(result){
            if(!result.length){
                res.status(204).send({
                    success:true,
                    msg:"No Users till Now"
                })
            }
            else{
              res.status(200).send({
                success:true,
                results:result
              })
            }
        }

    })
}

const delete_user = async (req, res, next) => {
    try {
      await db.query(
        "select * from user where user_id=?",
        [req.params.user_id],
        (err, result, feilds) => {
          if (err) {
            res.status(400).send({
              success: false,
              err: err,
            });
          } else {
            db.query(
              "delete from user where user_id = ?",
              [req.params.user_id],
              (berr, bresult, feilds) => {
                if (berr) {
                  res.status(400).send({
                    success: false,
                    err: berr,
                  });
                } else {
                  res.status(200).send({
                    success: true,
                    msg: "User Delete successfully...",
                    results: bresult,
                  });
                }
              }
            );
          }
        }
      );
    } catch (err) {
      res.status(400).send({
        seccess: false,
        err: err,
      });
    }
  };

const admin_getQuestion=async(req,res,next)=>{
    try{
        await db.query("Select * from questionnaire where category=?",[req.params.category],(err,result)=>{
            if(err){
                res.status(400).send({
                    success:false,
                    err:err
                })
            }
            if(result){
                res.status(200).send({
                    success:true,
                    results:result
                })
            }
        })
    }
    catch(Exeption){
        res.status(400).send({
            success:false,
            err:Exeption
        })
    }
}

const admin_getQuestion_by_language_and_category=async(req,res,next)=>{
    try{
        await db.query("Select * from questionnaire where Language=? and category=?",[req.params.Language,req.params.category],(err,result)=>{
            if(err){
                res.status(400).send({
                    success:false,
                    err:err
                })
            }
            console.log(result)
            if(result){
                res.status(200).send({
                    success:true,
                    results:result
                   
                })
            }else{
                res.status(404).send({
                    success:false,
                    
                })
            }
        })
    }
    catch(Exeption){
        res.status(400).send({
            success:false,
            err:Exeption
        })
    }
}

const admin_getQuestion_by_Id=async(req,res,next)=>{
    try{
        await db.query("Select * from questionnaire where Question_id=?",[req.params.Question_id],(err,result)=>{
            if(err){
                res.status(400).send({
                    success:false,
                    err:err
                })
            }
            console.log(result)
            if(result){
                res.status(200).send({
                    success:true,
                    results:result
                   
                })
            }else{
                res.status(404).send({
                    success:false,
                    
                })
            }
        })
    }
    catch(Exeption){
        res.status(400).send({
            success:false,
            err:Exeption
        })
    }
}

const user_rank = async (req, res, next) => {
    const auth = req.headers.authorization.split(" ")[1]
    const decode = jwt.decode(auth)
    const decoded_Username = decode.data[0].user_id
    const user_name = decode.data[0].username

    await db.query(`SELECT SUM(correct_Answers) AS sum_of_correct_Answers FROM attempts where user_id=${decoded_Username}`, (err1, results, feilds) => {
        if (err1) {
            res.status(400).send({
                success: false,
                err: err1
            })
        }
        if (results) {
            const total_score = results[0].sum_of_correct_Answers;
            // if (total_score > 0 && total_score == total_score) {
            // if(!decoded_Username){}
            db.query(`select * from rank where user_id=${decoded_Username}`, (err, result) => {
                if (err) {
                    res.status(400).send({
                        success: false,
                        err: err
                    })
                }
                if (!result.length) {

                    // console.log(user_name)
                    db.query(`insert into rank (user_id,user_name,average_score) values (?,?,?)`, [decoded_Username, user_name, total_score], (err, result) => {
                        if (err) {
                            res.status(400).send({
                                success: false,
                                err: err
                            })
                        }
                        if (result) {
                            db.query(`select * from rank order by average_score DESC`, (err, result) => {
                                if (err) {
                                    res.status(400).send({
                                        success: false,
                                        err: score_err
                                    })
                                }
                                if (result) {
                                    res.send({
                                        message: "User rank updated",
                                        success: true,
                                        results: result
                                    })
                                }
                            })
                        }
                    })
                }

                // }
                else {
                    db.query(`select * from rank where user_id=${decoded_Username}`, (err, result) => {
                        if (err) {
                            res.status(400).send({
                                success: false,
                                err: err
                            })
                        }
                        if (result) {
                            db.query(`update rank set average_score=${total_score} where user_id=${decoded_Username}`, (err, result) => {
                                if (err) {
                                    res.status(400).send({
                                        success: false,
                                        err: err
                                    })
                                }
                                if (result) {
                                    db.query(`select user_name,average_score from rank order by average_score DESC`, (err, result) => {
                                        if (err) {
                                            res.status(400).send({
                                                success: false,
                                                err: score_err
                                            })
                                        }
                                        if (result) {
                                            res.send({
                                                message: "User rank updated",
                                                success: true,
                                                results:result
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })


        }
    })
}

const new_login_api = async (req, res, next) => {
    await db.query(`select * from user where Mobile_no=?`, [req.body.Mobile_no], (err1, result, feilds) => {
        if (err1) {
            res.status(400).send({
                success: false,
                err: err1
            })
        }
        if (result) {
            const token = jwt.sign({ data: result }, process.env.JWT_SECRET_KEY)
            if (result.length) {
                res.send({
                    message: "User Exist And Login successfully",
                    success: true,
                    token: token,
                    results: result
                })
            } else {
                db.query('Insert into user(username,Mobile_no) values(?,?)', [req.body.username, req.body.Mobile_no], (berr, bresult, feilds) => {
                    if (berr) {
                        res.status(400).send({
                            success: false,
                            err: berr
                        })
                    }
                    else {
                        db.query(`select * from user where Mobile_no=?`, [req.body.Mobile_no], (berr1, result1, feilds) => {
                            if (berr1) {
                                res.status(400).send({
                                    success: false,
                                    err: berr1
                                })
                            } else {
                                if (result1) {
                                    const token = jwt.sign({ data: result1 }, process.env.JWT_SECRET_KEY)
                                    if (result1.length) {
                                        res.status(201).send({
                                            message: "User Registered Successfully",
                                            success: true,
                                            token: token,
                                            results: result1
                                        })
                                    }
                                }
                            }
                        })
                    }
                })
            }
        }
    })
}
module.exports = {
    user_signup,signup,check_Mo_no,user_login,user_update_language_and_category, user_logout,avtar_category, add_question,
    question, add_avtar, admin_signup, get_question_user, admin_update_question, admin_add_category,
    admin_add_language, admin_delete_language, total_user, total_language, total_category, admin_update_questionStatus,
    adminLogin1, answer1, quiz_category, admin_Statistics,admin_get_user,delete_user,admin_getQuestion,
    delete_question,admin_getQuestion_by_language_and_category,admin_getQuestion_by_Id,get_all_categories,
    user_getQuestion_by_language_and_category,admin_forgot_password,user_get_all_categories,get_all_language, user_rank
    ,new_login_api
}

