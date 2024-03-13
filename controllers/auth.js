// jshint esversion6
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require("util");

// MySQL Database Configuration
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.register = (req, res) => {
    // res.send("From submitted");
    const { name, email, password, confirmedpassword} = req.body;
    console.log(email)
    console.log(password)
    db.query('SELECT email FROM userinfo WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }else {
            if(results.length > 0) {
                return res.render('register', {
                    message: "That E-mail is already in use"
                })
            }else if(password !== confirmedpassword){
                return res.render('register', {
                    message: "Passwords do not match"
                });
            }
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO userinfo SET ?', {username: name, email : email, password: hashedPassword}, (error, results) => {
            if(error){
                console.log(error);
            }
            else{
                console.log(results);
                return res.render('register', {
                    message1: "User Registered"
                });
            }
        })
    });
}

exports.login = async (req, res) => {
    try{
    const { email, password } = req.body;
    if (!email || !password) {
        return res.render('login', {
            message: "Please Provide an email and password"
        })
    }
    console.log(email)
    console.log(password)
    if(email == 'admin@gmail.com' && password == process.env.ADMIN_PASSWORD)
    {
        res.redirect("admin_panel")
    }   
    else{
        db.query('SELECT * FROM userinfo WHERE email = ?', [email], async (err, results) => {
        console.log(results);
        if (!results || !await bcrypt.compare(password, results[0].password)) {
            // console.log("enter loop line");
            return res.render('login', {
                message: "E-mail or Password is incorrect"
            })
        } else {
            const id = results[0].user_id;
            // console.log("ID: "+id+","+results[0].user_id)

            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            console.log("the token is " + token);

            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            }
            // This can be viewd under Inspect -> Memory -> Session Manager
            res.cookie('userSave', token, cookieOptions);
            // console.log("second line");
            res.status(200).redirect("/");
        }
        
    })}
    } catch(err) {
        console.log(err);
    }
}

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.userSave) {
        // console.log("Cookies are saved.")
        // console.log("Entered isLoggedIn")
        // console.log("userSave cookie : "+ req.cookies.userSave)
        try {
            // 1. Verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.userSave,
                process.env.JWT_SECRET
            );
            
            // console.log("Decoded Id: "+decoded.id);
            // console.log("Decoded IAT: "+decoded.iat);
            // console.log("Decoded EXP: "+decoded.exp);
            // console.log(decoded);

            // 2. Check if the user still exist
            db.query('SELECT * FROM userinfo WHERE user_id = ?', [decoded.id], (err, results) => {
                // console.log(results);
                if (!results) {
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (err) {
            console.log(err)
            return next();
        }
    } else {
        // console.log("No Cookies saved.")
        next();
    }
}
exports.logout = (req, res) => {
    // res.cookie('userSave', 'logout', {
    //     expires: new Date(Date.now() + 2 * 1000),
    //     httpOnly: true
    // });
    res.clearCookie("userSave")
    res.status(200).redirect("/");
}



// Find Crimes by name
exports.find = (req, res) => {
    console.log("Entered Find Expots")
    let searchTerm = req.body.search;

    db.query('SELECT * FROM fir_records WHERE fir_id = ?', [searchTerm], (err, rows) => {
        if(!err) {
            res.render("data", { rows });
        }
        else{
            console.log(err)
        }
        console.log("The find from fir : \n ", rows);
    });
}

exports.form = (req, res) => {
    res.render("crime")
}


exports.register_case = async (req, res) => {
    try{
        var userID = 0;
        var firID = 1;
        console.log("Entered register_case")
        const{  in_name, in_father_name, in_age,in_nationality ,in_passport_no,in_occupation ,in_house_no,in_area ,in_village ,in_city ,in_state ,in_zip,in_email,
                crime_type,crime_date ,crime_location ,crime_description ,
                witness_name,witness_contact,witness_statement ,
                suspect_name,suspect_description,   
                sampleFile, evidence_description
        } = req.body;


        // 'INSERT INTO userinfo SET ?', {username: name, email : email, password: hashedPassword}
        db.query('INSERT INTO fir_records SET ?', {crime_type: crime_type, 
                                                    crime_date : crime_date, 
                                                    crime_location: crime_location, 
                                                    crime_description: crime_description},  (err, rows) => {
            console.log("Entered FIR_RECORDS query")
            if(err) console.log(err)
            // console.log("The data from Fir_records : \n ", rows);
        });

        db.query('SELECT * FROM fir_records WHERE crime_type = ?' , [crime_type], async (err, results) => {
            console.log("Inside fir_records searching for current informant_id")
            const const_id = results[0].fir_id;
            var firID = const_id;

            if(err){
                console.log(err)
            } else{
                console.log("fir_id got : "+firID)
            }

            db.query('INSERT INTO informant SET ?', {fir_id: firID, 
                                                    in_name: in_name, 
                                                    in_father_name:in_father_name, 
                                                    in_age : in_age, 
                                                    in_nationality: in_nationality, 
                                                    in_passport_no : in_passport_no,
                                                    in_occupation:in_occupation, 
                                                    in_house_no:in_house_no,
                                                    in_area:in_area, 
                                                    in_village : in_village, 
                                                    in_city:in_city,
                                                    in_state:in_state,
                                                    in_zip:in_zip, 
                                                    in_email:in_email}, (err, rows) => {
                console.log("Entered Informant query")
                if(err) console.log(err)
                    // console.log("The data from Informant : \n ", rows);
            });
            
            db.query('INSERT INTO witnesses SET ?', {fir_id : firID, 
                                                    witness_name : witness_name, 
                                                    witness_contact : witness_contact, 
                                                    witness_statement : witness_statement}, (err, rows) => {
                console.log("Entered witnesses query")
                if(err) console.log(err)
                // console.log("The data from witnesses : \n ", rows);
            });   

            db.query('INSERT INTO suspects SET ?',  {fir_id: firID, 
                                                    suspect_name: suspect_name, 
                                                    suspect_description : suspect_description},(err, rows) => {
                console.log("Entered suspects query")
                if(err) console.log(err)
                // console.log("The data from suspects : \n ", rows);
            });
            // 'INSERT INTO userinfo SET ?', {username: name, email : email, password: hashedPassword}
            db.query('INSERT INTO evidence SET ?',{fir_id: firID, 
                                                    // image:sampleFile,
                                                    evidence_description: evidence_description}, (err, rows) => {
                console.log("Entered evidence query")
                if(err) console.log(err)
                
                // console.log("The data from evidence : \n ", rows);
            });
            db.query('SELECT * FROM fir_records ORDER BY fir_id DESC LIMIT 1', (err, results) => {
                console.log(results[0])
                var last_value_from_firID = results[0].fir_id
                if (err) {
                  console.log(err);
                  return;
                }
                res.render('success', {alert : "F.I.R. ID : " + last_value_from_firID , 
                                      alert2 : "Your FIR is registered Successfully, save the ID for future reference"})
               
              });
        });

    }catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
        
}

//View Users/ Crime DB
exports.data = (req, res) => {
    // res.render('data');
    console.log("Entered DATA Expots")
    
    db.query('SELECT * FROM fir_records', (err, rows1) => {
        //When done with the connection, release it
        // Connection.release();
        if(!err) {
            res.render("data", { rows1 });
        }
        else{
            console.log(err)
        }
    });
}


exports.information = (req, res) => {
    console.log("eneter into Info exports")
    db.query('SELECT * FROM fir_records WHERE fir_id = ?', [req.params.fir_id], (err, firRows) => {
        

        db.query('SELECT * FROM informant WHERE fir_id = ?', [req.params.fir_id], (err, informantRows) => {
            

            db.query('SELECT * FROM witnesses WHERE fir_id = ?', [req.params.fir_id], (err, witnessRows) => {
                

                db.query('SELECT * FROM suspects WHERE fir_id = ?', [req.params.fir_id], (err, suspectRows) => {
                    

                    db.query('SELECT * FROM evidence WHERE fir_id = ?', [req.params.fir_id], (err, evidenceRows) => {

                            res.render("information_page", {firRows,informantRows,witnessRows,suspectRows, evidenceRows });
            
                    });
                });
            });
        });
    });
};

// View FIRs
exports.view = (req, res) => {
    // User the connection
    console.log("Entered view Exports");
    db.query('SELECT * FROM fir_records', (err, rowsfromviews) => {
        // When done with the connection, release it
        if (!err) {
            // let removedUser = req.query.removed;
            console.log("Rendered ADMIN PANEL");
            res.render('admin_panel', { rowsfromviews });
        } else {
            console.log(err);
        }
      console.log('The view from fir_records table: \n', rowsfromviews);
    });
}

exports.edit = (req, res) => {
    console.log("Entered EDIT Expots")
    
    db.query('SELECT * FROM fir_records WHERE fir_id = ?',[req.params.fir_id], (err, rowsfromEdit) => {
        //When done with the connection, release it
        // Connection.release();
        if(!err) {
            res.render("edit_user", { rowsfromEdit });
        }
        else{
            console.log(err)
        }
        // console.log("The data from fir  : \n ", rowsfromEdit);
    });
    // res.render("edit_user")
}

exports.update = (req, res) => {
    console.log("Entered UPDATE Expots")
    const {crime_type, crime_date, crime_location, crime_description} = req.body;
    
    db.query('UPDATE fir_records SET crime_type = ? ,crime_date = ? ,crime_location = ?,crime_description = ? WHERE fir_id = ?',[crime_type, crime_date, crime_location, crime_description, req.params.fir_id], (err, rows) => {
        //When done with the connection, release it
        // db.release(); //Optional
        if(!err) {
            db.query('SELECT * FROM  fir_records WHERE fir_id = ?',[req.params.fir_id], (err, rows) => {
                //When done with the connection, release it
                // Connection.release();
                if(!err) {
                    res.redirect("/admin_panel");
                }
                else{
                    console.log(err)
                }

            });
            
        }
        else{
            console.log(err)
        }
    });
}


exports.delete = (req, res) => {
    db.query('DELETE FROM fir_records WHERE fir_id = ?', [req.params.fir_id], (err, rows) => {
        if (!err) {
            res.redirect("admin_panel");
        } else {
            console.log(err);
        }
    });
};
