const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const {ProducerUserFormResponse} = require("./mq/producer/googleSheet")
const {initConsumers} = require("./mq/consumerinit")

const port = process.env.PORT || 3001;

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

initConsumers('172.18.59.254:4161')

// when use submits the form we are send a event on the topic : user_response,
// all of the different channel for different usecase can connect to this topic to perform different business usecases
app.post('/form/response',async(req,res)=>{

    try {
        await ProducerUserFormResponse(req.body);
        res.status(200).send("response submitted successfully");
      } catch (e) {
        console.log(e)
        res
          .status(201)
          .send(
            "failed to update the info values , please check the payload again!!!"
          );
      }
})

//init consumer


// //connect to Db and start the server
// InitDB()
//   .then((res) => {
    app.listen(port, function () {
      console.log("atlan post submission action service backend service is running on port : ", port);
    });
//   })
//   .catch((e) => {
//     console.log("DB init failed", e);
//   });