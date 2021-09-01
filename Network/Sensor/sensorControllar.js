var express =require('express');
var mongoose = require('mongoose');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var Sensor = require('./sensor');
var Node = require('../Node/node');
var Measure = require('../Measure/measure');

mongoose.set('useFindAndModify', false)

// => localhost:3000/sensors/sensorsList
router.get('/sensorsList', (req, res) => {
  Sensor.find((err, docs) =>{
        if(!err){
            res.send(docs);
        }else{
            console.log('Error in retriving Sensors: '+JSON.stringify(err, undefined, 2))
        }
    });
});

// => localhost:3000/sensors/getSensor/id
router.get('/getSensor/:id', (req, res) => {

    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id)

    Sensor.findById(req.params.id, (err, sensor) =>{
        if(!err){
            if(sensor==null)  
            return res.status(400).send('No record with given name:'+ req.params.id) 
            else
           res.send(sensor);
        }else{
           console.log('Error in retriving Sensor: '+JSON.stringify(err, undefined, 2))
        }
    })
})

// => localhost:3000/sensors/getSensorByName/Name
router.get('/getSensorByName/:Name', (req, res) => {
   
    Sensor.findOne({sensorName:req.params.Name}, (err, sensor) =>{
        if(!err){
            if(sensor==null)  
              return res.status(400).send('No record with given name:'+ req.params.Name)  
            else
           res.send(sensor);
        }else{
           console.log('Error in retriving Sensor: '+JSON.stringify(err, undefined, 2))
        }
    })
})

// => localhost:3000/sensors/updateSensor/id
router.put('/updateSensor/:id', (req, res) => {

    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id)


    var sensor = {
        sensorName: req.body.sensorName,
        sensorType: req.body.sensorType,
        sensorTypeMeasure: req.body.sensorTypeMeasure,
        sensorMeasures: req.body.sensorMeasures, 
        sensorAlert: req.body.sensorAlert,
        sensorLadder: req.body.sensorLadder,
        sensorFreqMeasure: req.body.sensorFreqMeasure,
        sensorCnxnPort: req.body.sensorCnxnPort, 
        sensorMark: req.body.sensorMark
    }


Sensor.findOneAndUpdate(req.params.id,{ $set: sensor }, { new: true },(err, sensor) => {//new: true--> update showed
    if(!err){
        if(sensor==null)  
        return res.status(400).send('No record with given name:'+ req.params.id) 
        else
            res.send(sensor)
        }else{
            if(err.code == 11000)
            res.status(422).send(['Duplicate sensor name found'])
            else
             if(err.name == 'ValidationError'){
                 var valErrors = [];
                 Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
                 res.status(422).send(valErrors);
             }
             console.log('Error in retriving Sensor: '+JSON.stringify(err, undefined, 2))

        }
    }) 
})

// => localhost:3000/sensors/updateSensorByName/Name
router.put('/updateSensorByName/:Name', (req, res) => {

      
        var sensor = {
            sensorName: req.body.sensorName,
            sensorType: req.body.sensorType,
            sensorTypeMeasure: req.body.sensorTypeMeasure,
            sensorAlert: req.body.sensorAlert,
            sensorLadder: req.body.sensorLadder,
            sensorFreqMeasure: req.body.sensorFreqMeasure,
            sensorCnxnPort: req.body.sensorCnxnPort, 
            sensorMark: req.body.sensorMark,
        }

    Sensor.findOneAndUpdate({sensorName:req.params.Name},{ $set: sensor }, { new: true },(err, sensor) => {//new: true--> update showed
        if(!err){
            if(sensor==null)  
            return res.status(400).send('No record with given name:'+ req.params.Name) 
            else
            res.send(sensor);
        }else{
            if(err.code == 11000)
            res.status(422).send(['Duplicate Sensor Name found'])
            else
             if(err.name == 'ValidationError'){
                 var valErrors = [];
                 Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
                 res.status(422).send(valErrors);
             }
             console.log('Error in retriving Sensor: '+JSON.stringify(err, undefined, 2))

        }
    }) 

})


// => localhost:3000/sensors/DeleteSensor/id
router.delete('/DeleteSensor/:id', (req, res) => {

    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id)

     Sensor.findById(req.params.id,(err, sensor) =>{
        if(!err){    
            if(sensor==null)  
            return res.status(400).send('No record with given name:'+ req.params.id) 
            else{
                var id= sensor.id
                sensor.remove();
               res.redirect('/nodes/findSensorAndRemove/'+id);
            }
        }
            else{
                console.log('Error in deleting Sensor: '+JSON.stringify(err, undefined, 2))

        }
      
})
})

// => localhost:3000/sensors/DeleteSensorByName/name
router.delete('/DeleteSensorByName/:name', (req, res) => {

    Sensor.findOne({sensorName:req.params.name} ,(err, sensor) =>{
       if(!err){    
           if(sensor==null) 
           return res.status(400).send('No record with given name:'+ req.params.name) 
          else{
            var id= sensor.id 
            sensor.remove();
              res.redirect('/nodes/findSensorAndRemove/'+id);
           }
           }else{
               console.log('Error in deleting Sensor: '+JSON.stringify(err, undefined, 2))
       }
   }) 

})

// => localhost:3000/sensors/getSensorLat/id
router.get('/getSensorLat/:id', (req, res) => {

    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id)

    Sensor.findById(req.params.id, (err, sensor) =>{

            if(!err){
                if(sensor==null)  
                return res.status(400).send('No record with given name:'+ req.params.id) 
                else
                Node.findById(sensor.sensorNode, (err, node) =>{
                    if(!err){
                       res.send(node.nodeLatitude)
                    }else{
                       console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
                    }
                })
            }else{
               console.log('Error in retriving Sensor: '+JSON.stringify(err, undefined, 2))
            }
        })    
    }) 

    // => localhost:3000/sensors/getSensorLatByName/name
router.get('/getSensorLatByName/:name', (req, res) => {
    Sensor.findOne({sensorName : req.params.name}, (err, sensor) =>{

            if(!err){
                if(sensor==null)  
                return res.status(400).send('No record with given name:'+ req.params.name) 
                else
                Node.findById(sensor.sensorNode, (err, node) =>{
                    if(!err){
                       res.send(node.nodeLatitude)
                    }else{
                       console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
                    }
                })
            }else{
               console.log('Error in retriving Sensor: '+JSON.stringify(err, undefined, 2))
            }
        })    
    }) 

    // => localhost:3000/sensors/getSensorLong/id
router.get('/getSensorLong/:id', (req, res) => {

    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id)

    Sensor.findById( req.params.id, (err, sensor) =>{
            if(!err){
                if(sensor==null)  
                return res.status(400).send('No record with given name:'+ req.params.id) 
                else
                Node.findById(sensor.sensorNode, (err, node) =>{
                    if(!err){
                       res.send(node.nodeLongitude)
                    }else{
                       console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
                    }
                })
            }else{
               console.log('Error in retriving Sensor: '+JSON.stringify(err, undefined, 2))
            }
        })
       
    }) 

    // => localhost:3000/sensors/getSensorLongByName/name
router.get('/getSensorLongByName/:name', (req, res) => {
    
    Sensor.findOne({sensorName : req.params.name}, (err, sensor) =>{
            if(!err){
                if(sensor==null)  
                return res.status(400).send('No record with given name:'+ req.params.name) 
                else
                Node.findById(sensor.sensorNode, (err, node) =>{
                    if(!err){
                       res.send(node.nodeLongitude)
                    }else{
                       console.log('Error in retriving Node: '+JSON.stringify(err, undefined, 2))
                    }
                })
            }else{
               console.log('Error in retriving Sensor: '+JSON.stringify(err, undefined, 2))
            }
        })
       
    }) 

// => localhost:3000/sensors/AddMeasure/id
router.post('/AddMeasure/:id/', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id)

    Sensor.findById(req.params.id, (err, sensor) =>{
        if(!err){
            if(sensor==null)  
                return res.status(400).send('No record with given name:'+ req.params.id) 
                else{
            var id=sensor.id
            var measure = new Measure({
                measureSensorId: id,
                measureValue :req.body.measureValue,
                measurePrecision:req.body.measurePrecision, 
                measureThreshold: req.body.measureThreshold,
                measureDate: new Date()
                });
                measure.save((err, docs) => {
                   if(!err){
                    res.redirect('/sensors/addMeasureToSensor/'+measure.id+'/'+id)
                }else{

            console.log('Error in saving Measure: '+JSON.stringify(err, undefined, 2))
                }
            })
        }
        }else{
            console.log('Error in saving sensor: '+JSON.stringify(err, undefined, 2))

        }
    })
})

// => localhost:3000/sensors/AddMeasureByName/nameSensor
        router.post('/AddMeasureByName/:nameSensor/', (req, res) => {
            Sensor.findOne({sensorName : req.params.nameSensor}, (err, sensor) =>{
                if(!err){
                    if(sensor==null)  
                    return res.status(400).send('No record with given name:'+ req.params.nameSensor) 
                    else{
                    var id=sensor.id
                    var measure = new Measure({
                        measureSensorId: id,
                        measureValue :req.body.measureValue,
                        measurePrecision:req.body.measurePrecision, 
                        measurePrecision: req.body.measurePrecision,
                        measureDate: new Date()
                        });
                        measure.save((err, docs) => {
                           if(!err){
                            res.redirect('/sensors/addMeasureToSensor/'+measure.id+'/'+id)
                        }else{
   
                    console.log('Error in saving Measure: '+JSON.stringify(err, undefined, 2))
                        }
                    })
                }
                }else{
                    console.log('Error in saving sensor: '+JSON.stringify(err, undefined, 2))

                }
            })
        })
          



// => localhost:3000/sensors/getMeasures/deb/fin/interval
router.get('/getMeasures/:deb/:fin/:interval', (req, res) => {
       var freq=5
    Measure.find({measureDate:{$lte:req.params.fin}, measureDate:{$gte:req.params.deb}},(err, measures) =>{
        if(!err){
           if(req.params.interval<freq){
              res.send(measures)
           }else{
               var tabMeasures=new Array();
               for(var i=0; i<=measures.length;i++){
                if(measures[i].measureDate.getMinutes() % interval ==0)
                 tabMeasures.push(measures[i])
               }
               res.send(tabMeasures)

           }
           
        }else{
           console.log('Error in retriving Measures: '+JSON.stringify(err, undefined, 2))
        }
    })
})

// => localhost:3000/sensors/getMeasures/id
router.get('/getMeasures/:id', (req, res) => {

    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id:'+ req.params.id)

    Sensor.findById( req.params.id, (err, sensor) =>{
        if(!err){
            if(sensor==null)  
                    return res.status(400).send('No record with given name:'+ req.params.nameSensor) 
                    else{
            idSensor=sensor.id
            Measure.find({measureSensorId:idSensor},(err, docs) =>{
                if(!err){
                    var tab1= Array()
                    tab1=docs  
                    tab2= Array()
                    for(var i=0;i<tab1.length;i++){
                     tab2.push(tab1[i].measureValue)
                    }
                   res.send(tab2);
                }else{
                   console.log('Error in retriving Measures: '+JSON.stringify(err, undefined, 2))
                }
            })
        }
            }else{
          
            console.log('Error in retriving Measures: '+JSON.stringify(err, undefined, 2))
         }
    })

})
// => localhost:3000/sensors/getMeasuresByName/name
router.get('/getMeasuresByName/:name', (req, res) => {
    Sensor.findOne({sensorName : req.params.name}, (err, sensor) =>{
        if(!err){
            if(sensor==null)  
                    return res.status(400).send('No record with given name:'+ req.params.name) 
                    else{
            idSensor=sensor.id
            Measure.find({measureSensorId:idSensor},(err, docs) =>{
                if(!err){
                    var tab1= Array()
                    tab1=docs  
                    tab2= Array()
                    for(var i=0;i<tab1.length;i++)
                     tab2.push(tab1[i].measureValue)
                   res.send(tab2);
                }else{
                   console.log('Error in retriving Measures: '+JSON.stringify(err, undefined, 2))
                }
            })
        }
            }else{
          
            console.log('Error in retriving Measures: '+JSON.stringify(err, undefined, 2))
         }
    })

})

// => localhost:3000/sensors/addMeasureToSensor/idMeasure/idSensor
router.use('/addMeasureToSensor/:idMeasure/:idSensor', (req, res) => {
    Sensor.findByIdAndUpdate(req.params.idSensor,{
                       $push: {
                       sensorMeasures: req.params.idMeasure
                       }  
                   },
                   { new: true, useFindAndModify: true },(err, docs) => {//new: true--> update showed
        
                       if(!err){
                           res.send(docs);
                       }else{
                           console.log('Error in updating Sensor: '+JSON.stringify(err, undefined, 2))
                        }
                    });    
                
            
    });
module.exports = router