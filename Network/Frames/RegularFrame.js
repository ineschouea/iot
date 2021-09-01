var mongoose = require('mongoose')


//RegularFrameSchema
var RegularFrameSchema = mongoose.Schema({

    frameType:{
        type: String,
        required: true
    },
    nodeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Node',
        required: true

    },
    NbrSensors:{
    type: Number,
    required: true

   },
  /* values:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Measure',
    required: true
           
}]*/
values:[{
    type: String,
    required: true
           
}]
});
 module.exports = mongoose.model('RegularFrame', RegularFrameSchema)