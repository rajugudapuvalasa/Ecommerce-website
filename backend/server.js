import app from './app.js';
import mongoose from 'mongoose';

const PORT =process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.log(err));


app.get("/test",(req,res)=>{
    res.send("API is working properly");
})


app.listen(PORT, () => console.log(`server is running on port ${PORT}`));