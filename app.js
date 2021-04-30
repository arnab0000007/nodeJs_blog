 require('dotenv').config()
 const express = require("express");
 const mongoose = require('mongoose')
 const config = require('config')


 //import middleware
 const setMiddleware = require('./middleware/middleware')
 //import route
 const setRoutes = require('./routes/routes');
 const e = require('express');


 const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@test.nxwfs.mongodb.net/express-blog?retryWrites=true&w=majority`


 const app = express();

 //Setup View Engine
 app.set("view engine", "ejs");
 app.set("views", "views");


 //using middlewares from middleware directory
 setMiddleware(app)

 //using routes from route directory
 setRoutes(app)


 app.use((req, res, next) => {
   let error = new Error('404 page not found')
   error.status = 404
   next(error)
 })

 app.use((error, req, res, next) => {
   if (error.status == 404) {
     return res.render('pages/error/404', {
       flashMessage: {}
     })
   }
   console.log(error.message)
   console.log(error)
   res.render('pages/error/500', {
     flashMessage: {}
   })
 })

 const PORT = process.env.PORT || 8080;
 mongoose.set('useUnifiedTopology', true);
 mongoose.connect(MONGODB_URI, {
     useNewUrlParser: true
   })
   .then(() => {
     console.log('database Connected');
     app.listen(PORT, () => {
       console.log(`Server is Running on PORT ${PORT}`);
     });
   }).catch(e => {
     return console.log(e)
   })