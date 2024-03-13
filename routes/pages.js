const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

// Serve HBS files
//   cpanel ==> /public/
router.use(authController.isLoggedIn); // This should come before the routes that need authentication
router.get('/', authController.isLoggedIn, (req, res) => {
    if(req.user){
        let status = true; // or false based on your logic

        // Render the HTML with the status variable
        res.render("index", { statusMessage: status ? "User is authenticated." : "User is not authenticated." });
        // console.log(req.user)
        // console.log("Enterd into / Route && Status = 'ok'")
        // // res.render("index" , {status: 'ok', user: req.user});
        // res.render("index" , {status: true, user: req.user});
    } else {
        console.log("Enterd into / Route && Status = 'not ok'")
        res.render("index" , {status: false, user: 'nothing' });
    }
});

router.get('/index', authController.isLoggedIn,(req, res) => {
    if(req.user){
        console.log(req.user)
        console.log("Enterd into Index Route && Status = 'ok'")
        res.render("index" , {status: true, user: req.user});
    } else {
        console.log("Enterd into non- Index Route && Status = 'not ok'")
        res.render("index" , {status: true, user: 'nothing' });
    }
});

router.get('/register', (req, res) => {
    if(req.user){
        res.render("register");
    } else {
       
        res.render("register");
    }
});

router.get('/auth/register', (req, res) => {
    res.render("register");
});

router.get('/login', (req, res) => {
    res.render("login");
});
router.get('/auth/login', (req, res) => {
    res.render("login");
});


router.get('/data', authController.isLoggedIn,authController.data, (req, res) => {
   if (req.user) {
        let status = true; // or false based on your logic
        // console.log("Crime Route Activated!")
        res.render("data",{ statusMessage: status ? "User is authenticated." : "User is not authenticated." })
    } else {
        // console.log("Login Crime Route Activated!")
        res.render("data",  {status: false, user: 'nothing' });
    }
});


router.get('/crime', authController.isLoggedIn,(req, res) => {
    if (req.user) {
        let status = true; // or false based on your logic
        console.log("Crime Route Activated!")
        res.render("crime",{ statusMessage: status ? "User is authenticated." : "User is not authenticated." })
    } else {
        console.log("Login Crime Route Activated!")
        res.render("login",  {status: false, user: 'nothing' });
    }
});

router.get('/logout', authController.logout, (req, res) => {
});

router.post('/find', authController.find, (req, res) => {
    if(err){
        console.log(err)
    }else{
        console.log("SuccessFull FInd Route")
        
    }
});

router.post('/register_case', authController.register_case,(req, res) => {
    console.log("Entered register_case POST Route")
    res.render("crime")
});

router.get('/information_page/:fir_id', authController.information,(req, res) => {
    console.log("Entered INFO POST Route")
    res.render("information_page")
});

router.get('/information_page/:fir_id/crime', authController.information,(req, res) => {
    console.log("Entered INFO POST Route")
    res.render("crime")
});

router.get('/information_page/crime', authController.information,(req, res) => {
    res.render("crime")
});

router.get('/admin_panel', authController.view,(req, res) => {
    console.log("Entered admin panel Route")
    res.render("admin_panel")
});

router.get('/auth/admin_panel', authController.view,(req, res) => {
    console.log("Entered admin panel Route")
    res.render("admin_panel")
});

router.get('/view',authController.view,(req, res) => {
    // console.log("Entered AUTH admin panel Route")
    res.render("admin_panel")
});

router.get('/view', authController.view, (req, res) => {
if (req.user) {
        let status = true; // or false based on your logic
        // console.log("Crime Route Activated!")
        res.render("admin_panel",{ statusMessage: status ? "User is authenticated." : "User is not authenticated." })
    } else {
        // console.log("Login Crime Route Activated!")
        res.render("admin_panel",  {status: false, user: 'nothing' });
    }
});
 
 
router.get('/success',(req, res) => {
    res.render("success")
});

 router.get('/information_page/:fir_id', authController.information,(req, res) => {
    // console.log("Entered INFO POST Route")
    res.render("information_page")
});

router.get('/edit_user',authController.edit, (req, res) => {
    //  console.log("Entered AUTH admin panel Route")
     res.render("edit_user")
});
router.get('/edit_user/:fir_id',authController.edit, (req, res) => {
     res.render("edit_user")
});

router.post('/edit_user/:fir_id',authController.update, (req, res) => {
    //  console.log("Entered UPDATE POST Route")
     res.render("edit_user")
});


router.get('/:fir_id',authController.delete, (req, res) => {
    //  console.log("Entered DELETE  POST Route")
     res.render("admin_panel")
});
router.post('/edit_user/admin_panel',(req, res) => { 
    //  console.log("Entered DELETE  POST Route")
    res.render("admin_panel")
});

// router.post('/view/:fir_id',authController.edit, (req, res) => {
//     //  console.log("Entered VIEW POST Route")
//      res.render("edit_user")
// });



module.exports = router;