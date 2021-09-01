var mongoose = require('mongoose')


//Measureschema
var Measureschema = mongoose.Schema({

    measureSensorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Sensor',
    },
    measureValue: {
        type: Number,
        required: true
    },
    measurePrecision: {
        type: Number,
    }, 
    measureThreshold: {
        type: Number,
    },
    measureDate:{
        type: Date,
     }

           
})

 module.exports = mongoose.model('Measure', Measureschema)