var mongoose = require('mongoose')


//commandFrameSchema
var commandFrameSchema = mongoose.Schema({

    idCmd:{
        type: String,
        required: true
    },
    payload: [{
        type: String,
        required: true
    }]
           
})

 module.exports = mongoose.model('commandFrame', commandFrameSchema)
 