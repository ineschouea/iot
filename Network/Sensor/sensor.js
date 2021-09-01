var mongoose = require('mongoose');
var Measure = require('../Measure/measure');


//Sensor schema
var SensorSchema = mongoose.Schema({
    sensorName:{
        type: String,
        required: true,
        unique: true
    },
    sensorNode:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Node'
    },
    sensorType:{
        type: String,
        required: true
    },
    sensorTypeMeasure:{ //onDemande, continue(freq), alert(threshold)
        type: String,
        required: true
    },
   
    sensorMeasures:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Measure',
    }],
    sensorAlert:{
        type: Boolean,
    },
    sensorThreshold:{
        type: Number,
    },
    sensorMeasureFreq:{
        type: Number,
    },
    sensorProcessorPort:{
        type: String,
    }, 
    sensorMark:{
        type: String,
    }
})
SensorSchema.pre('remove', function(next) {
    Measure.find({"sensorId": this.id },(err, docs) =>{
         if(!err){
             if(docs!=undefined){
                 for(i=0;i<docs.length;i++){
                     docs[i].remove();
                 }
             }
         }else{
             console.log('Error in deleting Measure: '+JSON.stringify(err, undefined, 2))
         }
     });  
     next();
 });
 module.exports = mongoose.model('Sensor', SensorSchema)
