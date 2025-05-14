const express = require("express")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const Auth = require("./AuthModel")


dotenv.config()

const app = express()

app.use(express.json())



const PORT = process.env.PORT || 8000




mongoose.connect(process.env.MONGODB_URL)
   .then(() => {
      console.log("mongoDb connected successfully...");
      app.listen(PORT, () => {
         console.log(`Server started running on Port ${PORT}`)
         console.log("Mongo URI:", process.env.MONGODB_URL);


      }
      )
   }
   )


app.post("/sign-Up", async(req, res) => {
  try 
      {

   const {email,state, firstName,passWord, lastName } = req.body

   const existingUser =await  Auth.findOne({email})
   if(existingUser) {
      res.status(404).json({message: "User already exist"})
   }

   if(!email){
      return res.status(404).json( {message: "please insert your email"});
      
   }
   if(passWord.length<6){
      return res.status(400).json({message: "password should be a minimum of 6 char"})
   }

   
   if (!passWord){
      return res.status(404).json({message: "please insert password"})
   }
    
const hashedPassword = await bcrypt.hash(passWord, 10)

   const newUser = new Auth({email,state, firstName,passWord:hashedPassword, lastName })
    
      
 await newUser.save()
    res.json({
      newUser:{email,state, firstName, lastName, hashedPassword }
    })
     

    } catch (error) {
      res.json({message: error.message })
    }


})
   
   
  
    
    


app.post("/login-In",async(req,res)=>{
try {
    const {email,passWord} =req.body
const user =await Auth.findOne({email}).select(" +passWord")
if(!user){
   return res.status(404).json({message: "User dosenot exist"})
}


const isMatch =await bcrypt.compare(passWord,user?.passWord )
if (!isMatch){
    return res.status(404).json({message: "incorrect email or passWord"})
}



const acsessToken = jwt.sign(
   {id: user?._id} ,
   // user
   process.env.ACCESS_TOKEN,
   {expiresIn: "5m"}

)
const refreshToken = jwt.sign(
   {id: user?._id} ,
   // user
   process.env.REFRESH_TOKEN,
   {expiresIn: "5m"}

)

const {passWord: _, ...userWithoutPassWord} =user.toObject()

res.status(200).json({
   message: "user login success",
   acsessToken ,
   user: userWithoutPassWord,
   refreshToken
   

   // }
})

// Generate a token using jsonwebtoken
// Token means , user is authenticated 
// Login token: Access token
// registration :Active token

} catch (error) {
   
   res.status(404).json({message:error.message})
}

}
)

  








