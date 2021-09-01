var mongoose = require('mongoose')
var Node = require('../Node/node');


//gateway schema
var GatewaySchema = mongoose.Schema({

    gatewayName:{
        type: String,
        required: true
    },
    gatewayIpAddress:{
        type: String,
        unique: true
    },
    gatewayMacAddress:{
        type: String,
        required: true,
        unique: true
    },
    gatewayMark:{
        type: String,
    },  
    gatewayAddress:{
        type: String,
    },
    gatewayLongitude: {
        type: String,
    },
    gatewayLatitude: {
        type: String,
    },
    gatewayNodesNbr: {
        type: Number,
    },
    gatewayNodes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Node',
    }]      
    
});

GatewaySchema.pre('remove', function(next) {
    Node.find({"nodeGateway": this.id },(err, docs) =>{
         if(!err){
             if(docs!=undefined){
                 for(i=0;i<docs.length;i++){
                     docs[i].remove();
                 }
             }
         }else{
             console.log('Error in deleting Node: '+JSON.stringify(err, undefined, 2))
         }
     });  
     next();
 });

 module.exports = mongoose.model('Gateway', GatewaySchema)
