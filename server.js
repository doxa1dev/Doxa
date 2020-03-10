const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const server = app.listen(3000);
console.log('Server is listening...........')
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  //Don't forget to add your keys to the .env file! See .env.example for more info
  apiKey: "ea231293",
  apiSecret: "GuyTyYn09Sz35qMl"
});

app.post('/request', (req, res) => {
  // A user registers with a mobile phone number
  let phoneNumber = req.body.number;
  
  console.log(phoneNumber);
  
  nexmo.verify.request({number: phoneNumber, brand: 'Verity', lg: 'en-us', next_event_wait : 180}, (err, result) => {
    if(err) {
      console.log(err);
      
      //Oops! Something went wrong, respond with 500: Server Error
      res.status(500).send({error_text: err.message});
    } else {
      console.log(result);
      
      if(result && result.status == '0') {
        //A status of 0 means success! Respond with 200: OK
        res.status(200).send(result);
      } else {
        //A status other than 0 means that something is wrong with the request. Respond with 400: Bad Request
        //The rest of the status values can be found here: https://developer.nexmo.com/api/verify#status-values
        res.status(400).send(result);
      }
    }
  });
});

app.post('/check', (req, res) => {
  //To verify the phone number the the request ID and code is required.
  let code = req.body.code;
  let requestId = req.body.request_id;
  
  console.log("Code: " + code + " Request ID: " + requestId);
  
  nexmo.verify.check({request_id: requestId, code: code}, (err, result) => {
    if(err) {
      console.log(err);
      
      //Oops! Something went wrong, respond with 500: Server Error
      res.status(500).send({error_text: err.message});
    } else {
      console.log(result)
      
      if(result && result.status == '0') {
        //A status of 0 means success! Respond with 200: OK
        res.status(200).send(result);
        console.log('Account verified!');
      } else {
        //A status other than 0 means that something is wrong with the request. Respond with 400: Bad Request
        //The rest of the status values can be found here: https://developer.nexmo.com/api/verify#status-values
        res.status(400).send(result);
        console.log('Error verifying account');
      }
    }
  });
});

app.post('/search', (req, res) => {
  //To verify the phone number the the request ID and code is required.
  let requestId = req.body.request_id;
  
  nexmo.verify.search(requestId, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send(result);
    }
  });
});



app.post('/cancel', (req, res) => {
  //User sends the request id to cancel the verification request
  let requestId = req.body.request_id;
  
  console.log("Request ID: " + requestId);
  
  nexmo.verify.control({request_id: requestId, cmd:'cancel'}, (err, result) => {
    if(err) {
      console.log(err);
      
      //Oops! Something went wrong, respond with 500: Server Error
      res.status(500).send({error_text: err.message});
    } else {
      if(result && result.status == '0') {
        //A status of 0 means the verify request was succesfully cancelled! Respond with 200: OK
        res.status(200).send(result);
      } else {
        //A status other than 0 means that something is wrong with the request. Respond with 400: Bad Request
        //The rest of the status values can be found here: https://developer.nexmo.com/api/verify#status-values
        res.status(400).send(result);
      }
    }
  });
});


