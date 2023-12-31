const mongoose = require("mongoose");
const mongoUri = "mongodb://localhost:27017/?appName=MongoDB+Compass&directConnection=true&serverSelectionTimeoutMS=2000"

    async function connectMongo(){
    try{
        await mongoose.connect(mongoUri,{
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            family: 4,
        });
        console.log("connected to the mongo database");
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {connectMongo} 