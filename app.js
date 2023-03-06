const express = require('express');
const GlobalRouter = require('./routes/index.js');
const indexRouter = require("./schemas/index.js");
const app = express();
const port = 3001;
//웹에서 MongoDB연결
const connect = require("./schemas");
connect();

app.use(express.json());
app.use(express.urlencoded({ exrended: false}));
app.use("/", GlobalRouter);



app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});


