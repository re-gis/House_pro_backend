const { default: mongoose } = require('mongoose');
const User = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const Token = require('../models/UserToken');
const { sendEmail } = require('../utils/email');
const { isLoggedIn } = require('../middlewares/authMiddleware');
require('../auth/userAuth');




// User landing page
const userLanding = (req, res) => {
  return res.json({ message: "User landing page" });
};



// Signup user
const userSignup = async(req, res) => {
    let uname = req.body.name
    let email = req.body.email
    let password = req.body.password
    let confirmPass = req.body.confirmPass
    let phone = req.body.phone
    let country = req.body.country


    // Check if all user credentials are given
    if(!uname || !email || !password || !confirmPass || !phone || !country) {
        res.json({ message: 'All inputs are required!' })
    } else {
        // Check if the email already exists
        let exists = await User.findOne({ email })
        if(exists) {
           return res.json({ message: `${email} already exists!` })
        } else {
            // Check if the passwords match
            if(password !== confirmPass){
               return res.json({ message: 'Please confirm password' })
            } else {
              // Hash the password
              const hashedPass = await bcrypt.hash(password, 10);
              let user = await User.create({
                name: uname,
                email: email,
                password: hashedPass,
                country: country,
                phone: phone,
              });

              // Make a token for the user
              let token = await Token.create({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex')
              })
              
              const message = `${process.env.BASE_URL}/users/verify/${user._id}/${token.token}`
              // Send the link
              emailSent = await sendEmail(user.email, 'Verify Email', message)
                console.log('Email sent');
                res.json({ message: 'Email sent to your account!'})
              
            }
        }
    }
}


// Email verification
const emailVerify = async(req, res) => {
  let user = await User.findOne({ _id: req.params.id})
  if(!user) {
    res.json({ message: 'Invalid link'})
  } else {
    let token = await Token.findOne({userId: user._id, token: req.params.token })
    if(!token) {
      res.json({ message: 'Invalid link!'})
    } else {
      let updatedUser = await User.updateOne({ _id: user._id, verified: true })
      let deleteToken = await Token.findByIdAndRemove(token._id)
      if(updatedUser && deleteToken) {
        res.json({ message: 'Email verified!'})
      }
    }
  }
}


// Login user
const loginUser = async(req, res) => {
    // Check if the user credentials are all given
    let email = req.body.email
    let password = req.body.password

    if(!email || !password) {
      res.json({ message: 'All inputs are required!'})
    } else {
      // Check if the user exists
      let userExists = await User.findOne({ email })
      if(!userExists) {
        res.json({ message: 'Invalid Email!'})
      } else {
        // Check if the password matches
        let currentPass = await userExists.password
        let matchingPass = await bcrypt.compare(password, currentPass)
        if(matchingPass) {
          // Check if the email is verified
          if(userExists.verified === true) {
            // If the user is logged in set a session
            res.json({ message: 'Nice'})
          } else {
            res.json({ message: 'Please verify the Email'})
          }
        } else {
          res.json({ message: 'Email Or Password Incorrect!' })
        }
      }
    }
}




module.exports = {
    loginUser,
    userLanding,
    userSignup,
    emailVerify,
}