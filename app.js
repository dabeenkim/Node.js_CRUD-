const express = require('express');
const app = express();
const port = 3000;
const postsRouter = require('./routes/posts.js');


app.use(express.json());

app.post("/", (req,res) => {
  console.log(req.body);

  res.send("기본 URI에 POST메소드가 정상적으로 실행되었습니다.")
})

app.get("/", (req,res) => {
  console.log(req.query);


  res.status(400).json({
    "KeyKey" : "value 입니다.",
    "김이름" : "이름빈"
  });
})

app.get("/:id", (req,res) => {
  console.log(req.params);

  res.send(":id URL에 정상적으로 반환되었습니다.")

});



// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });



// localhost:3000/api -> goodsRouter
// app.use("/api", postsRouter);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});


