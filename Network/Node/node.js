var mongoose = require('mongoose')
var Sensor = require('../Sensor/sensor');



//node schema
var NodeSchema = mongoose.Schema({
  
    nodeName:{
        type: String,
        required: true
    },
    nodeIpAddress:{
        type: String,
        unique: true
    },
    nodeMacAddress:{
        type: String,
        required: true,
        unique: true
    },
    nodeMark:{
        type: String,
    }, 
    nodeGateway:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Gateway',
    },
    nodeAddress:{
        type: String,
    },
    nodeLongitude: {
        type: String,
    },
    nodeLatitude: {
        type: String,
    },
    nodeSensorsNbr: {
        type: Number,
    },
    nodeSensors:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Sensor',
    }]    
     
});
NodeSchema.pre('remove', function(next) {
   Sensor.find({"sensorNode": this.id },(err, docs) =>{
        if(!err){
            if(docs!=undefined){
                for(i=0;i<docs.length;i++){
                    docs[i].remove();
                }
            }
        }else{
            console.log('Error in deleting Sensor: '+JSON.stringify(err, undefined, 2))
        }
    });  
    next();
});

 module.exports = mongoose.model('Node', NodeSchema)
