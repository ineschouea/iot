var express =require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var Node = require('./node');
var Sensor = require('../Sensor/sensor');
var Gateway = require('../Gateway/gateway');


//=>localhost:3000/nodes/addSensor/idNode
router.post('/addSensor/:idNode',(req,res,next) => {
    if(!ObjectId.isValid(req.params.idNode))
    return res.status(400).send('No record with given id:'+ req.params.idNode)
    Node.findById(req.params.idNode, (err, docs) =>{
       if(!err){
            var sensor = new Sensor({
                sensorName: req.body.sensorName,
                sensorType: req.body.sensorType,
                sensorTypeMeasure: req.body.sensorTypeMeasure,
                sensorNode: req.params.idNode,
                sensorAlert: req.body.sensorAlert,
                sensorThreshold: req.body.sensorThreshold,
                sensorFreqMeasure: req.body.sensorFreqMeasure,
                sensorCnxnPort: req.body.sensorCnxnPort, 
                sensorMark: req.body.sensorMark,
            })
          
            sensor.save((err, doc) => {
                if(!err){
                   res.redirect('/nodes/addSensorToNode/'+sensor.id+'/'+req.params.idNode)
                }
                else{
                    if(err.code == 11000)
                    res.status(422).send(['Duplicate Sensor Name found'])
                    else
                     if(err.name == 'ValidationError'){
                         var valErrors = [];
                         Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
                         res.status(422).send(valErrors);
                     }
                    
                }
            });
        
       }else{
          console.log('Error in retriving node: '+JSON.stringify(err, undefined, 2))
       }
   
});

});

//=>localhost:3000/nodes/addSensorByMAC/MACNode
router.post('/addSensorByMAC/:MACNode',(req,res,next) => {
  
    Node.findOne({ nodeMacAddress: req.params.MACNode}, (err, node) =>{
    if(!err){
        if(node==null)  
         return res.status(400).send('No record with given MAC address:'+ req.params.MACNode)
         else{

        var sensor = new Sensor({
            sensorName: req.body.sensorName,
            sensorType: req.body.sensorType,
            sensorTypeMeasure: req.body.sensorTypeMeasure,
            sensorNode: node.id,
            sensorAlert: req.body.sensorAlert,
            sensorThreshold: req.body.sensorThreshold,
            sensorCnxnPort: req.body.sensorCnxnPort, 
            sensorMark: req.body.sensorMark,
        })
          
            sensor.save((err, sensor) => {
                if(!err){
                   res.redirect('/nodes/addSensorToNode/'+sensor.id+'/'+node.id)
                }
                else{
                    if(err.code == 11000)
                    res.status(422).send(['Duplicate Sensor Name found'])
                    else
                     if(err.name == 'ValidationError'){
                         var valErrors = [];
                         Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
                         res.status(422).send(valErrors);
                     }
                }
            })
      
        }
        
       }else{
          console.log('Error in retriving node: '+JSON.stringify(err, undefined, 2))
       }
   
})

})

//=>localhost:3000/nodes/addSensorByName/nameNode
router.post('/addSensorByName/:nameNode',(req,res,next) => {
  
    Node.findOne({ nodeName: req.params.nameNode}, (err, node) =>{
    if(!err){
        if(node==null)  
         return res.status(400).send('No record with given name:'+ req.params.nameNode)
         else{

        var sensor = new Sensor({
            sensorName: req.body.sensorName,
            sensorType: req.body.sensorType,
            sensorTypeMeasure: req.body.sensorTypeMeasure,
            sensorNode: node.id,
            sensorAlert: req.body.sensorAlert,
            sensorThreshold: req.body.sensorThreshold,
            sensorCnxnPort: req.body.sensorCnxnPort, 
            sensorMark: req.body.sensorMark,
        })
          
            sensor.save((err, sensor) => {
                if(!err){
                   res.redirect('/nodes/addSensorToNode/'+sensor.id+'/'+node.id)
                }
                else{
                    if(err.code == 11000)
                    res.status(422).send(['Duplicate Sensor Name found'])
                    else
                     if(err.name == 'ValidationError'){
                         var valErrors = [];
                         Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
                         res.status(422).send(valErrors);
                     }
                }
            })
      
        }
        
       }else{
          console.log('Error in retriving node: '+JSON.stringify(err, undefined, 2))
       }
   
})

})

// => localhost:3000/nodes/nodesList
router.get('/nodesList', (req, res) => {
  Node.find((err, docs) =>{
        if(!err){
            res.send(docs);
        }else{
            console.log('Error in retriving Nodes: '+JSON.stringify(err, undefined, 2))
        }
    });
});

// => localhost:3000/nodes/getNode/id
router.get('/getNode/:id', (req, res) => {
  
    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id)

    Node.findById(req.params.id, (err, node) =>{
       if(!err){
           res.send(node)
       }else{
           console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
        }
    })

})

// => localhost:3000/nodes/getNodeByMAC/MAC
router.get('/getNodeByMAC/:MAC', (req, res) => {
  
     
    Node.findOne({nodeMacAddress:req.params.MAC}, (err, node) =>{
       if(!err){
        if(node==null)  
        return res.status(400).send('No record with given MAC address:'+ req.params.MAC)  
        else
           res.send(node);
       }else{
           console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
        }
    })

})

// => localhost:3000/nodes/getNodeByName/Name
router.get('/getNodeByName/:Name', (req, res) => {

     
    Node.findOne({nodeName:req.params.Name}, (err, node) =>{
       if(!err){
        if(node==null)  
        return res.status(400).send('No record with given Name:'+ req.params.Name)  
        else
           res.send(node);
       }else{
           console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
        }
    })

})

// => localhost:3000/nodes/updateNode/id
router.put('/updateNode/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id)
    
    var node = {
        nodeName: req.body.nodeName,
        nodeIpAddress: req.body.nodeIpAddress,
        nodeMacAddress: req.body.nodeMacAddress,
        nodeMark: req.body.nodeMark,  
        nodeAddress: req.body.nodeAddress,
        nodeLongitude: req.body.nodeLongitude,
        nodeLatitude: req.body.nodeLatitude,
    }

    Node.findOneAndUpdate(req.params.id,{ $set: node }, { new: true },(err, docs) => {//new: true--> update showed
        if(!err){
            res.send(docs);
        }else{
            if(err.code == 11000)
            res.status(422).send(['Duplicate MAC address or IP address found'])
            else
             if(err.name == 'ValidationError'){
                 var valErrors = [];
                 Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
                 res.status(422).send(valErrors);
             }
        }
    }) 

})

// => localhost:3000/nodes/updateNodeByMAC/MAC
router.put('/updateNodeByMAC/:MAC', (req, res) => {
  
    var node = {
        nodeName: req.body.nodeName,
        nodeIpAddress: req.body.nodeIpAddress,
        nodeMacAddress: req.body.nodeMacAddress,
        nodeMark: req.body.nodeMark,  
        nodeAddress: req.body.nodeAddress,
        nodeLongitude: req.body.nodeLongitude,
        nodeLatitude: req.body.nodeLatitude,
    }

    Node.findOneAndUpdate({nodeMacAddress: req.params.MAC},{ $set: node }, { new: true },(err, node) => {//new: true--> update showed
        if(!err){
            if(node==null)  
            return res.status(400).send('No record with given MAC address:'+ req.params.MAC)
            else
            res.send(node);
        }else{
            if(err.code == 11000)
            res.status(422).send(['Duplicate MAC address or IP address found'])
            else
             if(err.name == 'ValidationError'){
                 var valErrors = [];
                 Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
                 res.status(422).send(valErrors);
             }
        }
    }) 

})

// => localhost:3000/nodes/updateNodeByName/Name
router.put('/updateNodeByName/:Name', (req, res) => {
  
    var node = {
        nodeName: req.body.nodeName,
        nodeIpAddress: req.body.nodeIpAddress,
        nodeMacAddress: req.body.nodeMacAddress,
        nodeMark: req.body.nodeMark,  
        nodeAddress: req.body.nodeAddress,
        nodeLongitude: req.body.nodeLongitude,
        nodeLatitude: req.body.nodeLatitude,
    }

    Node.findOneAndUpdate({nodeName: req.params.Name},{ $set: node }, { new: true },(err, node) => {//new: true--> update showed
        if(!err){
            if(node==null)  
            return res.status(400).send('No record with given name:'+ req.params.Name)
            else
            res.send(node);
        }else{
            if(err.code == 11000)
            res.status(422).send(['Duplicate MAC address or IP address found'])
            else
             if(err.name == 'ValidationError'){
                 var valErrors = [];
                 Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
                 res.status(422).send(valErrors);
             }
        }
    }) 

})
// => localhost:3000/nodes/addSensorToNode/idSensor/idNode
router.use('/addSensorToNode/:idSensor/:idNode', (req, res) => {
    Node.find(req.params.id, (err, docs) =>{
        if(!err){
            var nbr = Number(docs[0].nodeSensorsNbr+1)
            Node.findByIdAndUpdate(req.params.idNode,{
                $push: {
                  nodeSensors: req.params.idSensor
                },
                nodeSensorsNbr : nbr
              },
             { new: true, useFindAndModify: true },(err, docs) => {//new: true--> update showed
                  if(!err){
                      res.send("succeded!!");
                  }else{
                      console.log('Error in updating Node: '+JSON.stringify(err, undefined, 2))
                  }
              });    
          
        }else{
            console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
         }
     })   
})

// => localhost:3000/nodes/DeleteNode/id
router.delete('/DeleteNode/:id', (req, res) => {

    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id)
    
        Node.findById(req.params.id, (err, node) =>{
            if(!err){  
                id=node.id
                if(node!= null){
                    node.remove();
                    res.redirect('/gateways/findNodeAndRemove/'+id);
                } 
            }else{
                    console.log('Error in deleting Node: '+JSON.stringify(err, undefined, 2))
            }
        })   
    })

    // => localhost:3000/nodes/DeleteNodeByMAC/MAC
router.delete('/DeleteNodeByMAC/:MAC', (req, res) => {

    
    Node.findOne({nodeMacAddress :req.params.MAC}, (err, node) =>{
        if(!err){  
            if(node==null)  
            return res.status(400).send('No record with given MAC address:'+ req.params.MAC)
            else{
                id=node.id
                node.remove();
                res.redirect('/gateways/findNodeAndRemove/'+id);
            } 
        }else{
                console.log('Error in deleting Node: '+JSON.stringify(err, undefined, 2))
        }
    })   
})

// => localhost:3000/nodes/DeleteNodeByName/Name
router.delete('/DeleteNodeByName/:Name', (req, res) => {

    
    Node.findOne({nodeName :req.params.Name}, (err, node) =>{
        if(!err){  
          
            if(node==null)  
            return res.status(400).send('No record with given name:'+ req.params.Name)

        else{
                id=node.id
                node.remove();
                res.redirect('/gateways/findNodeAndRemove/'+id);
            } 
        }else{
                console.log('Error in deleting Node: '+JSON.stringify(err, undefined, 2))
        }
    })   
})



// => localhost:3000/nodes/findSensorAndRemove/idSensor
router.use('/findSensorAndRemove/:idSensor', (req, res) => {
    Node.findOneAndUpdate({ nodeSensors: req.params.idSensor}, { $pull: { nodeSensors: req.params.idSensor} }, function(err, node){
        if(!err){
            var nbr = Number(node.nodeSensorsNbr-1)
            var id=node.id
            Node.findByIdAndUpdate(id,{nodeSensorsNbr: nbr},{ new: true},(err, docs) => {//new: true--> update showed
                         if(!err){
                                res.send(node)
                         }else{
                               console.log('Error in updating gateway: '+JSON.stringify(err, undefined, 2))        
                             }
                    })
            res.send(node)
        }else{
            console.log('Error in removing sensor from Node: '+JSON.stringify(err, undefined, 2))        }
    } )
 
 })

// => localhost:3000/nodes/getNodeLong/id

    router.get('/getNodeLong/:id', (req, res) => {
       
        if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('No record with given id:'+ req.params.id)

            Node.findById(req.params.id, (err, node) =>{
               if(!err){
                  res.send(node.nodeLongitude);
               }else{
                  console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
               }
        })
    
    })

    // => localhost:3000/nodes/getNodeLongByMAC/MAC

    router.get('/getNodeLongByMAC/:MAC', (req, res) => {
       
          
        Node.findOne({nodeMacAddress:req.params.MAC}, (err, node) =>{
           if(!err){
            if(node==null)  
            return res.status(400).send('No record with given MAC address:'+ req.params.MAC)
            else
              res.send(node.nodeLongitude);
           }else{
              console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
           }
    })

})

// => localhost:3000/nodes/getNodeLongByName/Name

router.get('/getNodeLongByName/:Name', (req, res) => {
       
          
    Node.findOne({nodeName:req.params.Name}, (err, node) =>{
       if(!err){
        if(node==null)  
        return res.status(400).send('No record with given Name:'+ req.params.Name)
        else
          res.send(node.nodeLongitude);
       }else{
          console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
       }
})

})
    // => localhost:3000/nodes/getNodeLat/id

    router.get('/getNodeLat/:id', (req, res) => {

        if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('No record with given id:'+ req.params.id)
        Node.findById(req.params.id, (err, node) =>{

               if(!err){
                  res.send(node.nodeLatitude);
               }else{
                  console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
               }
        })
    
    })  

     // => localhost:3000/nodes/getNodeLatByMAC/MAC

     router.get('/getNodeLatByMAC/:MAC', (req, res) => {
        Node.findOne({nodeMacAddress:req.params.MAC}, (err, node) =>{

               if(!err){
                if(node==null)  
                return res.status(400).send('No record with given MAC Address:'+ req.params.MAC)
                else
                  res.send(node.nodeLatitude);
               }else{
                  console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
               }
        })
    
    }) 

     // => localhost:3000/nodes/getNodeLatByName/Name

     router.get('/getNodeLatByName/:Name', (req, res) => {
        Node.findOne({nodeName:req.params.Name}, (err, node) =>{

               if(!err){
                if(node==null)  
                return res.status(400).send('No record with given name:'+ req.params.Name)
                else
                  res.send(node.nodeLatitude);
               }else{
                  console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
               }
        })
    
    }) 

    // => localhost:3000/nodes/getSensors/id
router.get('/getSensors/:id', (req, res) => {
  
    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id)

    Node.findById(req.params.id, (err, node) =>{
       if(!err){
        {
            var sensorsIDs = Promise.resolve(node.nodeSensors);
            sensorsIDs.then(async function(sensors) {
                for(i=0; i<sensors.length; i++){
                    sensors[i]=await new Promise((resolve, reject) => {
                    
                        Sensor.findById(sensors[i], function(err,sensor) {
                                             resolve(sensor.sensorName);
                                        })
                                    });
                                
                }
              res.send(sensors)
            })
         }
       }else{
           console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
        }
    })

})

// => localhost:3000/nodes/getSensorsByMAC/MAC
router.get('/getSensorsByMAC/:MAC', (req, res) => {
  
     
    Node.findOne({nodeMacAddress:req.params.MAC}, (err, node) =>{
       if(!err){
        if(node==null)  
        return res.status(400).send('No record with given MAC address:'+ req.params.MAC)  
        else
        {
            var sensorsIDs = Promise.resolve(node.nodeSensors);
            sensorsIDs.then(async function(sensors) {
                for(i=0; i<sensors.length; i++){
                    sensors[i]=await new Promise((resolve, reject) => {
                    
                        Sensor.findById(sensors[i], function(err,sensor) {
                                             resolve(sensor.sensorName);
                                        })
                                    });
                                
                }
              res.send(sensors)
            })
         }
       }else{
           console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
        }
    })

})

// => localhost:3000/nodes/getSensorsByName/Name
router.get('/getSensorsByName/:Name', (req, res) => {
    
     
    Node.findOne({nodeName:req.params.Name}, (err, node) =>{
       if(!err){
        if(node==null)  
        return res.status(400).send('No record with given Name:'+ req.params.Name)  
        else
        {
            var sensorsIDs = Promise.resolve(node.nodeSensors);
            sensorsIDs.then(async function(sensors) {
                for(i=0; i<sensors.length; i++){
                    sensors[i]=await new Promise((resolve, reject) => {
                    
                        Sensor.findById(sensors[i], function(err,sensor) {
                                             resolve(sensor.sensorName);
                                        })
                                    });
                                
                }
              res.send(sensors)
            })
         }
       }else{
           console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
        }
    })

})
module.exports = router