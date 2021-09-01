const mongoose = require('mongoose');
require('../config/config')
mongoose.connect(process.env.MONGODBURI, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false},  (err) =>{
    if(!err)
       console.log("MongoDB connection succeded !!!");
    else  
    console.log('Error in DB connection: '+JSON.stringify(err, undefined, 2));
})

/*
require('../models/user');
require('../models/sensor');
require('../models/node');
require('../models/getway');
*/