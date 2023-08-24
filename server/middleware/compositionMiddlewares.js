
//middleware that checks if user is actually logged in.
module.exports = (req, res, next) => {
    if(req.session.isAuthentic){
      next();
    }
    else{
      //res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
      console.log("not authenticated " + JSON.stringify(req.session));
      res.send('Log in to interact with compositions.');
    }
  }