//everything that the server has to do is right here

let express  = require('express');

const cors = require('cors');


let app = express();
app.use(express.json());
app.use(cors());

app.get('/', function(req, res) {
	res.send('<h1>Welcome to Node.js project setup</h1>')
})

app.post("/login", (req, res) =>{
    //get the username and password from request object
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    res.send({success: true, username: username});
    //hash the password

    //check the database to see if this credential combo matches



})




const PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
	console.log(`Server started on port: ${PORT}`);
})