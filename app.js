require('./lib/database');
require('./config/config')
//require('./socketIO')
const bodyParser = require("body-parser");
//const CommandFrame = require('./Network/Frames/commandFrame');
//const io = require('socket.io-client');


var express =require('express');

const cors = require('cors');
const session = require('express-session');
const users = require('./User/userControllar');
const sensors = require('./Network/Sensor/sensorControllar');
const gateways = require('./Network/Gateway/gatewayControllar');
const nodes = require('./Network/Node/nodeControllar');
var RegularFrame = require('./Network/Frames/RegularFrame');

//let socket = io.connect("http://localhost:5000/Socket");


var app = express();
var router = express.Router();


//middleware
app.use(express.json({extended: true}));//send JSON data to nodeJS
app.use(cors());//{ origin: 'http://localhost:4200' }
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
//error handler
/*app.use((err, req, res, next) =>{
    if(err.name == 'ValidationError'){
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors);
    }
});*/


//start app server
app.listen(process.env.PORT||8080, () => console.log('server started at port'+process.env.PORT)); 


// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})


app.use(bodyParser.urlencoded({ extended: true }))

app.post("/", (req, res) => {
  frame= req.body.choix
    if(frame=="Discover")
     res.redirect('/discover')

    else if (frame=="Get Nodes Configurations") 
    //res.sendFile(__dirname + '/views/GNC.html');
    res.redirect('/getNodesConfigurations')
 
    else if (frame=="Set Nodes Configurations")
       //res.sendFile(__dirname + '/views/SNC.html'); 
       res.redirect('/setNodesConfigurations')

    else if (frame=="Read Node battery level") 
    //res.sendFile(__dirname + '/views/LB.html');
    res.redirect('/getBatteryLevel')
    else if (frame=="Get Node sensors measures")
    //res.sendFile(__dirname + '/views/GM.html'); 
    res.redirect('/getSensorsMeasures')

    else  
  res.send("You must select a frame type")
  
});


//Mqtt publisher
var mqtt = require('mqtt');


var client  = mqtt.connect('mqtt://test.mosquitto.org')
//console.log(client==null)
var topic1 = 'test/temperature'


client.on('connect', function () {

  client.subscribe(topic1, function (err) {
   // console.log('subscribed on test/temperature topic' )
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})

app.use('/sensors', sensors);
app.use('/users', users);
app.use('/gateways', gateways);
app.use('/nodes', nodes);



//////////////////////////
//Socket io
var express =require('express');
var mongoose = require('mongoose');
var router = express.Router();


//const Gateway = require('./Network/Gateway/gateway');
const Node = require('./Network/Node/node');
const Sensor = require('./Network/Sensor/sensor');
const Measure = require('./Network/Measure/measure');


const io = require('socket.io-client');
const Gateway = require('./Network/Gateway/gateway');
const CommandFrame = require('./Network/Frames/commandFrame');
const measure = require('./Network/Measure/measure');

let socket = io.connect("http://localhost:5000/Socket");

function SaveNode(node, gatewayId){
    console.log("saving")
    node.save((err, docs) => {
        if(!err){
          Gateway.findByIdAndUpdate(gatewayId,{
            $push: {
            nodes: node.id
            }  
        },
        { new: true, useFindAndModify: true },(err, docs) => {//new: true--> update showed

            if(err){
          
                console.log('Error in updating Gateway: '+JSON.stringify(err, undefined, 2))
             }
         });    
        }
        else{
             console.log('Error in saving Node: '+JSON.stringify(err, undefined, 2))
        }
    });
}

function SaveMeasure(measure, SensorId){
  console.log("saving")
  Measure.save((err, docs) => {
      if(!err){
        Sensor.findByIdAndUpdate(SensorId,{
          $push: {
          measures: measure.id
          }  
      },
      { new: true, useFindAndModify: true },(err, docs) => {//new: true--> update showed

          if(err){
        
              console.log('Error in updating Sensor: '+JSON.stringify(err, undefined, 2))
           }
       });    
      }
      else{
           console.log('Error in saving Measure: '+JSON.stringify(err, undefined, 2))
      }
  });
}

function existantNode(frame){
  var node=Node()
  node=JSON.parse(frame)
  Node.findOne({macAddress: node.macAddress}, (err, doc) =>{ 
    if (!err) {
       if(doc == null)
          console.log("non-existant node "+node.macAddress )
       else{
          var foundNode = Node({
              sensors: doc.macAddress,
              address: doc.address,
              macAddress:doc.macAddress,
              latitude:  doc.latitude,
              longitude:  doc.longitude,
              nodeName: doc.nodeName,
              maxSensors: doc.maxSensors,
              gateway: doc.gateway
              })

          if(!equal(foundNode, node)){
             console.log("Modified Node "+node.macAddress)
             socket.emit("config", foundNode);
          }else{
            console.log("Stable data for "+node.macAddress)
          }   
       } 
  } else {
     console.log("error")
    }
})

}

function equalArrays(arr1,arr2){
  if (arr1.length == arr2.length
    && arr1.every(function(u, i) {
        return u === arr2[i];
    })
) {
return true} 
else {
   return false;
}
}

function equal(node1,node2){
  if(
  equalArrays(node1.sensors,node2.sensors) &&
  node1.address == node2.address &&
  node1.macAddress == node2.macAddress &&
  node1.latitude == node2.latitude &&
  node1.longitude == node2.longitude &&
  node1.nodeName == node2.nodeName &&
  node1.maxSensors == node2.maxSensors &&
  node1.gateway.toString() ==  node2.gateway.toString()
  )
 return true
 else 
 return false

}


//connection
socket.on("welcome", (msg)=>{
 console.log("received: "+msg);
 socket.emit("msg", "I'am your client");
});


//reception de message
socket.on('msg', (msg) => {
  console.log(msg)
})

//reception of discoverOneNodeResp
socket.on('discoverOneNodeResp', (frame) => {
  console.log('discover Response!!')
  console.log(frame)
         //null response
  if(frame==null){
    console.log("non-existant node")
  }else{
     frame.gateway=mongoose.Types.ObjectId(frame.gateway)
         //Non configured node
  if(frame.nodeName==null){
    console.log("non configured node "+frame.macAddress )
    var node = new Node({
      address: "ENIT",
      //ipAddress:"192.168.10.2",
      macAddress:frame.macAddress,
      latitude:  "15.65",
      longitude:  "14.21",
      nodeName: "node2",
      maxSensors: "20",
      gateway: mongoose.Types.ObjectId("60b11cec0037db3790420d70")
  });
  //SaveNode(node, node.gateway)
  socket.emit("config", node);
  
}else {
        //existant node
        existantNode(JSON.stringify(frame),  (err, doc)=> {
     
        });
      
}
  }
})

//reception of discoveryResp
socket.on('discoveryResp', (tab) => {
  console.log('Discovery Response!!')
  if(tab.length == 0)
  console.log("No data")
  else{
    var node =new Node()

    for(var i=0;i<tab.length;i++){

     currentNode=tab[i]
     currentNode.gateway=mongoose.Types.ObjectId(currentNode.gateway)

  if(currentNode.nodeName==null){
    console.log("non configured node "+ currentNode.macAddress)
    var node = new Node({
      address: "ENIT",
     // ipAddress:"192.168.10.2",
      macAddress:currentNode.macAddress,
      latitude:  "15.65",
      longitude:  "14.21",
      nodeName: "node2",
      maxSensors: "20",
      gateway: mongoose.Types.ObjectId("60b11d1af8be202f78544047")
  });
  //SaveNode(node, node.gateway)
  socket.emit("config", node);

  }else {
    existantNode(JSON.stringify(currentNode),  (err, doc)=> {
    
    });
  
}
  }
  }

})
//reception of sensorRequest
socket.on('sensorRequest', (measure) => {
  console.log('Request Response!!')
  console.log(measure)
  //save
})

//reception of discoveryResp
socket.on('NodeRequest', (tab) => {
  console.log('Request Response!!')
  for(var i=0; i<tab.length;i++){
    console.log(tab[i])
    //save
  }
})
////////////////////// Response //////////////////////
socket.on('Response', (frame) => {
  console.log("")
  if(frame.idCmd=="RDISC"){
  console.log('---------->RDISC Response!!!!!')
  var gatewayID= mongoose.Types.ObjectId(frame.payload[0])

  for(var i=1; i<frame.payload.length;i++){
    console.log("")
    console.log("node "+i)
    var node= JSON.parse(frame.payload[i])
    console.log(node)
    //save

  }

  }else if(frame.idCmd=="RGNC"){
    console.log("")
    console.log('---------->RGNC Response!!!!!')
    console.log(frame.payload[0])
    for(var i=1; i<frame.payload.length;i++){
      console.log("")
      console.log("node "+i)
      var node= JSON.parse(frame.payload[i])
      console.log(node)
      //save
    }
  }else if(frame.idCmd=="RLB"){
    console.log("")
    console.log('---------->RLB Response!!!!!')
    console.log("")
    
    console.log("id node= "+frame.payload[0])
    console.log("Battery level= "+frame.payload[1])

    } else if(frame.idCmd=="RGM"){
      console.log('---------->RGM Response!!!!!')
      console.log("id node= "+frame.payload[0])
      for(i=1; i<frame.payload.length;i++){
      console.log("")
      var measure= JSON.parse(frame.payload[i])
      console.log("Measure"+i)
      console.log(measure)
    }
  
      }
    
})

////////////////////// Alarm //////////////////////

socket.on('Alarm', (frame) => {
  
  console.log("---------->Alarm !!!!!")
  console.log(frame)

})

////////////////////// Regular frame //////////////////////

socket.on('RegFrame', (frame) => {
  
  console.log("---------->RegFrame !!!!!")
  console.log(frame)
  console.log("")

  for(i=0; i<frame.values.length;i++){
    console.log("")
    var measure= JSON.parse(frame.values[i])
    console.log("Measure"+(i+1))
    console.log(measure)
  }

})

////////////////////// Request //////////////////////

//----------------->Discover 
app.get("/discover",(req,res) => {
for(i=0;i<6;i++)
console.log("")

var pl1=new Array()
var Nbrgateways = 1;
var idGatway ="60cfec074052b117d40bb179"

pl1.push(Nbrgateways)
pl1.push(idGatway)

var cmd1 = new CommandFrame({
  idCmd:"DISC",
  payload: pl1
})
console.log("---------->DISC Request")
console.log(cmd1)
socket.emit("Request", cmd1);
res.sendFile(__dirname + '/views/Discover.html'); 

})
//---------------->Get Nodes Configurations
app.get("/getNodesConfigurations",(req,res) => {
  for(i=0;i<6;i++)
  console.log("")

var pl2=new Array()
idNode1="C1-DF-9A-F1-46-C0"
idNode2="C1-DF-9A-F1-46-C1"
nbrNodes=2;
pl2.push(nbrNodes)
pl2.push(idNode1)
pl2.push(idNode2)

var cmd2 = new CommandFrame({
  idCmd:"GNC",
  payload: pl2
})
console.log("---------->GNC Request")
console.log(cmd2)
socket.emit("Request", cmd2);
res.sendFile(__dirname + '/views/GNC.html'); 

})
//---------------->Set Nodes Configurations
app.get("/setNodesConfigurations",(req,res) => {
for(i=0;i<6;i++)
console.log("")

var pl3=new Array()
idNode1="C1-DF-9A-F1-46-C0"
var node = {
  nodeName:"node1",
  nodeIpAddress:"192.168.10.2",
  nodeMacAddress:idNode1,
  nodeGateway:  mongoose.Types.ObjectId('60b11cec0037db3790420d70'),
  nodeAddress: "FST",
  nodeLongitude:"15.2",
  nodeLatitude:"18.52",

} 
pl3.push(idNode1)
pl3.push(JSON.stringify(node))

var cmd3 = new CommandFrame({
  idCmd:"SNC",
  payload: pl3
})
console.log("---------->SNC Request")
console.log(cmd3)
socket.emit("Request", cmd3);
res.sendFile(__dirname + '/views/SNC.html'); 

})
//---------------->Read Node battery level 
app.get("/getBatteryLevel",(req,res) => {
  for(i=0;i<6;i++)
  console.log("")


var pl4=new Array()
var idNode="C1-DF-9A-F1-46-C0"

pl4.push(idNode)

var cmd4 = new CommandFrame({
  idCmd:"LB",
  payload: pl4
})
console.log("---------->BL  Request")
console.log(cmd4)
socket.emit("Request", cmd4);
res.sendFile(__dirname + '/views/LB.html'); 

})
//---------------->Get Node sensors measures 
app.get("/getSensorsMeasures",(req,res) => {
 for(i=0;i<6;i++)
console.log("")

var pl5=new Array()
var idNode="C1-DF-9A-F1-46-C0"
var sensorsNbr=2
var idSensor1="60cfedb491579e0d3818d418"
var idSensor2="60cfedc291579e0d3818d419"

pl5.push(idNode)
pl5.push(sensorsNbr)
pl5.push(idSensor1)
pl5.push(idSensor2)

var cmd5 = new CommandFrame({
  idCmd:"GM",
  payload: pl5
})
console.log("---------->GM Request")
console.log(cmd5)
socket.emit("Request", cmd5);
res.sendFile(__dirname + '/views/GM.html'); 

})





