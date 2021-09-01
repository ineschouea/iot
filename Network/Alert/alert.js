var mongoose = require('mongoose')


//Alertschema
var AlertSchema = mongoose.Schema({

    sensorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Sensor',
        required: true
    },
    message: {
        type: String,
        required: true
    },
     dateNaissance:{
        type: Date,
        required: true
     },
     dateGeneration:{
        type: Date,
        required: true
     },
     dateAcq:{
        type: Date,
        required: true
     },
     niveau:{
        type: Date,
        required: true
     },
     adress:{
        type: String,
        required: true
    },
    Destination:[{
        type: String,
        required: true
    }],
    AvertType:{
        type: String,
        required: true
    }
           
})

 module.exports = mongoose.model('Alert', AlertSchema)
