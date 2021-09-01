var mongoose = require('mongoose')


//AlarmFrameSchema
var AlarmFrameSchema = mongoose.Schema({

    idFrame:{
        type: String,
        required: true
    },
    nodeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Node'
    },
    sensorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Node'
    },
    value:{
        type: Number,
        required: true
    },
    threshold:{
        type: Number,
        required: true
    },
    
    date:{
        type: Date,
        required: true
    }
           
})

 module.exports = mongoose.model('AlarmFrame', AlarmFrameSchema)