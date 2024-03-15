var admin = require("firebase-admin");

var serviceAccount = require('./task-base-cd3.json');

const notificationModel=require("../../DB/notification.model.js")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging(); 

const sendNotification=async(deviceTokens, title, body)=>{
  const messages = deviceTokens.map(token => {
    return {
      token,
      notification: {
        title,
        body
      },
      data: {
        title // Optional data payload (customize as needed)
      }
    };
  });

  try {
    const responses = await Promise.all(messages.map(message => messaging.send(message)));
    console.log('Notifications sent successfully:', responses);
    return 'Notifications sent successfully!'; // Consider returning response codes for clarity
  } catch (error) {
    console.error('Error sending notifications:', error);
    return 'Failed to send notifications!'; // Provide clear error message
  }
}


const storeDeviceToken=async(req,res,next)=>{
  const userId=req.user._id;
  const deviceToken=req.body.deviceToken;
  if (userId && deviceToken) {
     const findUser= await notificationModel.findOne({userId:userId});
     if (findUser) {
         await notificationModel.findOneAndUpdate({userId:userId},{deviceToken:deviceToken});
         return res.json({message:"Device Token Has Been Updated Successfully"});
     } else {
         const notification = new notificationModel({
             userId:userId,
             deviceToken:deviceToken
         });
         notification.save();
         return res.json({message:"Device Token Has Been Set Successfully"});
     }
  } else {
      return next(new HttpError(`Unexpected Error: ${error}`, 500));
  }
  }


module.exports = {sendNotification,storeDeviceToken};