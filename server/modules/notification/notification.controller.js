var admin = require("firebase-admin");

var serviceAccount = require('./task-base.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const sendNotification=async(deviceToken,title,body)=>{
    const message = 
    { 
      "token" : deviceToken,
      "notification":{
          "title":title,
          "body":body
      },
      "data" : {
          "title" : "Title"
      }
  }

admin.messaging().send(message)
  .then(function (response) {
    return 'message succesfully sent !',response
  })
 
}


module.exports = sendNotification;