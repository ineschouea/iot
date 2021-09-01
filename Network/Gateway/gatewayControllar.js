var express =require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var Gateway = require('./gateway');
var Node = require('../Node/node');


//=>localhost:3000/gateways/addGateway
router.post('/addGateway',(req,res,next) => {
 
       var gateway = new Gateway({
        gatewayName: req.body.gatewayName,
        gatewayIpAddress: req.body.gatewayIpAddress,
        gatewayMacAddress: req.body.gatewayMacAddress,
        gatewayMark: req.body.gatewayMark,  
        gatewayAddress: req.body.gatewayAddress,
        gatewayLongitude: req.body.gatewayLongitude,
        gatewayLatitude:req.body.gatewayLatitude,
        gatewayNodesNbr: 0, 
        });

        gateway.save((err, docs) => {
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

//=>localhost:3000/gateways/addNode/idGateway
router.post('/addNode/:idGateway',(req,res,next) => {
    if(!ObjectId.isValid(req.params.idGateway))
    return res.status(400).send('No record with given id:'+ req.params.idGateway)
  
    Gateway.findById(req.params.idGateway, (err, docs) =>{
       if(!err){
            var node = new Node({
                nodeName: req.body.nodeName,
                nodeIpAddress: req.body.nodeIpAddress,
                nodeMacAddress: req.body.nodeMacAddress,
                nodeMark: req.body.nodeMark,  
                nodeAddress: req.body.nodeAddress,
                nodeLongitude: req.body.nodeLongitude,
                nodeLatitude: req.body.nodeLatitude,
                nodeSensorsNbr: 0,
                nodeGateway : req.params.idGateway
            });
        
           
            node.save((err, docs) => {
                if(!err){
                   res.redirect('/gateways/addNodeToGateway/'+node.id+'/'+req.params.idGateway)
                }
                else{
                    if(err.code == 11000)
                    res.status(422).send(['Duplicate MAC address or IP address found'])
                    else
                     if(err.name == 'ValidationError'){
                         var valErrors = [];
                         Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
                         res.status(422).send(valErrors);
                     }                }
            })
       
       }else{
          console.log('Error in retriving Gateway: '+JSON.stringify(err, undefined, 2))
       }
})

   
  })

 //=>localhost:3000/gateways/addNodeByMAC/MACGateway
router.post('/addNodeByMAC/:MACGateway',(req,res,next) => {
  
    Gateway.findOne({gatewayMacAddress: req.params.MACGateway}, (err, gateway) =>{
        if(!err){
            if(gateway==null)
            return res.status(400).send('No record with given MAC address:'+ req.params.MACGateway)
            else{
            var node = new Node({
                nodeName: req.body.nodeName,
                nodeIpAddress: req.body.nodeIpAddress,
                nodeMacAddress: req.body.nodeMacAddress,
                nodeMark: req.body.nodeMark,  
                nodeAddress: req.body.nodeAddress,
                nodeLongitude: req.body.nodeLongitude,
                nodeLatitude: req.body.nodeLatitude,
                nodeSensorsNbr: 0,
                nodeGateway : gateway.id

            })
            
            node.save((err, doc) => {
                if(!err){
                   res.redirect('/gateways/addNodeToGateway/'+node.id+'/'+gateway.id)
                
                }
                else{
                    if(err.code == 11000)
                    res.status(422).send(['Duplicate MAC address or IP address found'])
                    else
                     if(err.name == 'ValidationError'){
                         var valErrors = [];
                         Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
                         res.status(422).send(valErrors);
                     }                }
            });
        }
       }else{
          console.log('Error in retriving Gateway: '+JSON.stringify(err, undefined, 2))
       }
});


    
  }); 

  //=>localhost:3000/gateways/addNodeByName/GatewayName
router.post('/addNodeByName/:GatewayName',(req,res,next) => {
  
    Gateway.findOne({gatewayName: req.params.GatewayName}, (err, gateway) =>{
        if(!err){
            if(gateway==null)
            return res.status(400).send('No record with given name:'+ req.params.GatewayName)
            else{
            var node = new Node({
                nodeName: req.body.nodeName,
                nodeIpAddress: req.body.nodeIpAddress,
                nodeMacAddress: req.body.nodeMacAddress,
                nodeMark: req.body.nodeMark,  
                nodeAddress: req.body.nodeAddress,
                nodeLongitude: req.body.nodeLongitude,
                nodeLatitude: req.body.nodeLatitude,
                nodeSensorsNbr: 0,
                nodeGateway : gateway.id
            })
            
            node.save((err, gateway) => {
                if(!err){
            
                   res.redirect('/gateways/addNodeToGateway/'+node.id+'/'+gateway.id)
              
                }
                else{
                    if(err.code == 11000)
                    res.status(422).send(['Duplicate MAC address or IP address found'])
                    else
                     if(err.name == 'ValidationError'){
                         var valErrors = [];
                         Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
                         res.status(422).send(valErrors);
                     }                }
            });
        }
       }else{
          console.log('Error in retriving Gateway: '+JSON.stringify(err, undefined, 2))
       }
});


    
  }); 
// => localhost:3000/gateways/gatewaysList
router.get('/gatewaysList', (req, res) => {
    Gateway.find((err, docs) =>{
        if(!err){
            res.send(docs);
        }else{
            console.log('Error in retriving Gateways: '+JSON.stringify(err, undefined, 2))
        }
    });
});


// => localhost:3000/gateways/getGateway/id
router.get('/getGateway/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('No record with given id:'+ req.params.id)
      
        Gateway.findById(req.params.id, (err, gateway) =>{
           if(!err){
              if(gateway!=null)
              res.send(gateway)
              else
              return res.status(400).send('No record with given id:'+ req.params.id)
            
           }else{
              console.log('Error in retriving Getway: '+JSON.stringify(err, undefined, 2))
           }
    });

});

// => localhost:3000/gateways/getGatewayByMac/gatewayMac
router.get('/getGatewayByMac/:gatewayMac', (req, res) => {

        Gateway.findOne({gatewayMacAddress: req.params.gatewayMac}, (err, gateway) =>{
           if(!err){
               if(gateway!=null)
              res.send(gateway)
              else
              return res.status(400).send('No record with given mac:'+ req.params.gatewayMac)
           }else{
              console.log('Error in retriving Getway: '+JSON.stringify(err, undefined, 2))
           }
    });

});

// => localhost:3000/gateways/getGatewayByName/gatewayName
router.get('/getGatewayByName/:gatewayName', (req, res) => {

    Gateway.findOne({gatewayName: req.params.gatewayName}, (err, gateway) =>{
       if(!err){
           if(gateway!=null)
          res.send(gateway)
          else
        return res.status(400).send('No record with given name:'+ req.params.gatewayName)
       }else{
          console.log('Error in retriving Getway: '+JSON.stringify(err, undefined, 2))
       }
});

});


// => localhost:3000/gateways/updateGateway/id
router.put('/updateGateway/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('No record with given id:'+ req.params.id);
      
     var gateway = {
        gatewayName: req.body.gatewayName,
        gatewayIpAddress: req.body.gatewayIpAddress,
        gatewayMacAddress: req.body.gatewayMacAddress,
        gatewayMark: req.body.gatewayMark,  
        gatewayAddress: req.body.gatewayAddress,
        gatewayLongitude: req.body.gatewayLongitude,
        gatewayLatitude:req.body.gatewayLatitude
        };

      Gateway.findByIdAndUpdate(req.params.id,{ $set: gateway }, { new: true },(err, docs) => {//new: true--> update showed
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
    });  

});

 // => localhost:3000/gateways/updateGatewayByMac/macGateway
router.put('/updateGatewayByMac/:macGateway', (req, res) => {
  
      
     var gateway = {
        gatewayName: req.body.gatewayName,
        gatewayIpAddress: req.body.gatewayIpAddress,
        gatewayMacAddress: req.body.gatewayMacAddress,
        gatewayMark: req.body.gatewayMark,  
        gatewayAddress: req.body.gatewayAddress,
        gatewayLongitude: req.body.gatewayLongitude,
        gatewayLatitude:req.body.gatewayLatitude
        };

      Gateway.findOneAndUpdate({gatewayMacAddress: req.params.macGateway},{ $set: gateway }, { new: true },(err, docs) => {//new: true--> update showed
        if(!err){
            if(docs==null)
            return res.status(400).send('No record with given MAC address:'+ req.params.macGateway)
            else
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
    });  

});

// => localhost:3000/gateways/updateGatewayByName/GatewayName
router.put('/updateGatewayByName/:GatewayName', (req, res) => {
  
      
    var gateway = {
       gatewayName: req.body.gatewayName,
       gatewayIpAddress: req.body.gatewayIpAddress,
       gatewayMacAddress: req.body.gatewayMacAddress,
       gatewayMark: req.body.gatewayMark,  
       gatewayAddress: req.body.gatewayAddress,
       gatewayLongitude: req.body.gatewayLongitude,
       gatewayLatitude:req.body.gatewayLatitude
       };

     Gateway.findOneAndUpdate({gatewayName: req.params.GatewayName},{ $set: gateway }, { new: true },(err, docs) => {//new: true--> update showed
       if(!err){
        if(docs==null)
        return res.status(400).send('No record with given name:'+ req.params.GatewayName)
        else
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
   });  

});

// => localhost:3000/gateways/addNodeToGateway/idNode/idGateway
router.use('/addNodeToGateway/:idNode/:idGateway', (req, res) => {

       Gateway.find(req.params.id, (err, docs) =>{
           if(!err){
               var nbr = Number(docs[0].gatewayNodesNbr+1)

               Gateway.findByIdAndUpdate(req.params.idGateway,{
                $push: {
                gatewayNodes: req.params.idNode
                },
                gatewayNodesNbr: nbr
            },
            { new: true, useFindAndModify: true },(err, docs) => {//new: true--> update showed
 
                if(!err){
                    console.log(docs.gatewayNodesNbr)
                    res.send(docs);
                }else{
                    console.log('Error in updating Gateway: '+JSON.stringify(err, undefined, 2))
                 }
             });  
           }else{
              console.log('Error in retriving Getway: '+JSON.stringify(err, undefined, 2))
           }
    });
          
    });


// => localhost:3000/gateways/DeleteGateway/id
router.delete('/DeleteGateway/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
       return res.status(400).send('No record with given id:'+ req.params.id);

       Gateway.findById(req.params.id, (err, gateway) =>{
     if(!err){
        if(gateway!= undefined){
            gateway.remove();
            res.send(gateway);    
        }     
        else
        return res.status(400).send('No record with given id:'+ req.params.id)
     }else{
        console.log('Error in retriving Gateway: '+JSON.stringify(err, undefined, 2))
      }
    });

});

// => localhost:3000/gateways/DeleteGatewayByMac/macGateway
router.delete('/DeleteGatewayByMac/:macGateway', (req, res) => {

    Gateway.findOne({gatewayMacAddress: req.params.macGateway}, (err, gateway) =>{
        if(!err){
        if(gateway!= null){
            gateway.remove();
            res.send(gateway);          
        }   
        else
        return res.status(400).send('No record with given MAC address:'+ req.params.macGateway);  

     }else{
        console.log('Error in retriving Gateway: '+JSON.stringify(err, undefined, 2))
      }
    });

});

// => localhost:3000/gateways/DeleteGatewayByName/gatewayName
router.delete('/DeleteGatewayByName/:gatewayName', (req, res) => {

    Gateway.findOne({gatewayName: req.params.gatewayName}, (err, gateway) =>{
        if(!err){
        if(gateway!= null){
            gateway.remove();
            res.send(gateway);          
        }   
        else
        return res.status(400).send('No record with given naame:'+ req.params.gatewayName);  

     }else{
        console.log('Error in retriving Gateway: '+JSON.stringify(err, undefined, 2))
      }
    });

});

// => localhost:3000/gateways/findNodeAndRemove/idNode
router.use('/findNodeAndRemove/:idNode', (req, res) => {
    Gateway.findOneAndUpdate({ gatewayNodes: req.params.idNode}, { $pull: { gatewayNodes: req.params.idNode} }, function(err, gateway){
       if(!err){
        var nbr = Number(gateway.gatewayNodesNbr-1)
        var id=gateway.id
        Gateway.findByIdAndUpdate(id,{gatewayNodesNbr: nbr},{ new: true},(err, docs) => {//new: true--> update showed
                     if(!err){
                            res.send(gateway)
                     }else{
                           console.log('Error in updating gateway: '+JSON.stringify(err, undefined, 2))        
                         }
                })
           res.send(gateway)
       }else{
        console.log('Error in removing node from gateway: '+JSON.stringify(err, undefined, 2))        
       }
   } )

})
 
// => localhost:3000/gateways/getGatewayLat/id
router.get('/getGatewayLat/:id', (req, res) => {

    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id);
       
    Gateway.findById(req.params.id, (err, gateway) =>{
        if(!err){
            if(gateway!=null)
              res.send(gateway.gatewayLatitude)
              else
              return res.status(400).send('No record with given id:'+ req.params.id);
           }else{
              console.log('Error in retriving Getway: '+JSON.stringify(err, undefined, 2))
           }
    });

});

// => localhost:3000/gateways/getGatewayLatByMac/mac
router.get('/getGatewayLatByMac/:mac', (req, res) => {

      
    Gateway.findOne({gatewayMacAddress: req.params.mac}, (err, gateway) =>{
        if(!err){
            if(gateway!=null)
              res.send(gateway.gatewayLatitude)
              else
              return res.status(400).send('No record with given MAC address:'+ req.params.mac);
           }else{
              console.log('Error in retriving Getway: '+JSON.stringify(err, undefined, 2))
           }
    });

});

// => localhost:3000/gateways/getGatewayLatByName/name
router.get('/getGatewayLatByName/:name', (req, res) => {

      
    Gateway.findOne({gatewayName: req.params.name}, (err, gateway) =>{
        if(!err){
            if(gateway!=null)
              res.send(gateway.gatewayLatitude);
              else
              return res.status(400).send('No record with given name:'+ req.params.name);
           }else{
              console.log('Error in retriving Getway: '+JSON.stringify(err, undefined, 2))
           }
    });

});

// => localhost:3000/gateways/getGatewayLong/id
router.get('/getGatewayLong/:id', (req, res) => {

    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id);

    Gateway.findById(req.params.id, (err, gateway) =>{
        if(!err){
            if(gateway!=null)
              res.send(gateway.gatewayLongitude)
            else
            return res.status(400).send('No record with given id:'+ req.params.id);
           }else{
              console.log('Error in retriving Getway: '+JSON.stringify(err, undefined, 2))
           }
    });

});
// => localhost:3000/gateways/getGatewayLongByMac/mac
router.get('/getGatewayLongByMac/:mac', (req, res) => {

      
    Gateway.findOne({gatewayMacAddress: req.params.mac}, (err, gateway) =>{
        if(!err){
            if(gateway != null)
              res.send(gateway.gatewayLongitude);
              else
              return res.status(400).send('No record with given MAC address:'+ req.params.mac);
           }else{
              console.log('Error in retriving Getway: '+JSON.stringify(err, undefined, 2))
           }
    });

});
// => localhost:3000/gateways/getGatewayLongByName/name
router.get('/getGatewayLongByName/:name', (req, res) => {

      
    Gateway.findOne({gatewayName: req.params.name}, (err, gateway) =>{
        if(!err){
            if(gateway!= null)
              res.send(gateway.gatewayLongitude)
            else
              return res.status(400).send('No record with given name:'+ req.params.name);

           }else{
              console.log('Error in retriving Getway: '+JSON.stringify(err, undefined, 2))
           }
    })

})


// => localhost:3000/gateways/getNodes/id
router.get('/getNodes/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('No record with given id:'+ req.params.id)
      
    
        Gateway.findById(req.params.id, (err, gateway) =>{
           if(!err){
              if(gateway!=null){
               
                var nodesIDs = Promise.resolve(gateway.gatewayNodes);
                nodesIDs.then(async function(nodes) {
                    for(i=0; i<nodes.length; i++){
                        nodes[i]=await new Promise((resolve, reject) => {
                        
                            Node.findById(nodes[i], function(err,node) {
                                                 resolve(node.nodeName);
                                            })
                                        });
                                    
                    }
                  res.send(nodes)
                })
            

           
                /*async function  Get_Nodes()
                {
                    var rs = await new Promise((resolve, reject) => {
                        var Nodes=new Array()
                        gateway.gatewayNodes.forEach(nodeId => {
                        Node.findById(nodeId, function(err,node) {
                            Nodes.push(node.nodeName)
                                             resolve(Nodes);
                                        })
                                    });
                                })
                     console.log(rs);  
                 }

               Get_Nodes()*/
               

                 
            }
                                      
            else
              return res.status(400).send('No record with given id:'+ req.params.id)
           }else{
              console.log('Error in retriving Gateway: '+JSON.stringify(err, undefined, 2))
           }
    })
})

// => localhost:3000/gateways/getNodesByMac/gatewayMac
router.get('/getNodesByMac/:gatewayMac', (req, res) => {

        Gateway.findOne({gatewayMacAddress: req.params.gatewayMac}, (err, gateway) =>{
           if(!err){
               if(gateway!=null)
              {
                var nodesIDs = Promise.resolve(gateway.gatewayNodes);
                nodesIDs.then(async function(nodes) {
                    for(i=0; i<nodes.length; i++){
                        nodes[i]=await new Promise((resolve, reject) => {
                        
                            Node.findById(nodes[i], function(err,node) {
                                                 resolve(node.nodeName);
                                            })
                                        });
                                    
                    }
                  res.send(nodes)
                })
              }
              else
              return res.status(400).send('No record with given mac:'+ req.params.gatewayMac)
           }else{
              console.log('Error in retriving Getway: '+JSON.stringify(err, undefined, 2))
           }
    });

});

// => localhost:3000/gateways/getNodesByName/gatewayName
router.get('/getNodesByName/:gatewayName', (req, res) => {

    Gateway.findOne({gatewayName: req.params.gatewayName}, (err, gateway) =>{
       if(!err){
           if(gateway!=null)
         {
            var nodesIDs = Promise.resolve(gateway.gatewayNodes);
            nodesIDs.then(async function(nodes) {
                for(i=0; i<nodes.length; i++){
                    nodes[i]=await new Promise((resolve, reject) => {
                    
                        Node.findById(nodes[i], function(err,node) {
                                             resolve(node.nodeName);
                                        })
                                    });
                                
                }
              res.send(nodes)
            })
         }
          else
        return res.status(400).send('No record with given name:'+ req.params.gatewayName)
       }else{
          console.log('Error in retriving Getway: '+JSON.stringify(err, undefined, 2))
       }
});

});
module.exports = router