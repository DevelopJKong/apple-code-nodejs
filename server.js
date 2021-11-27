import express from "express";

const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 4040;

let db;

app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');


const handleHome = (req, res) => {
  res.sendFile(__dirname + "/index.html");
};

const handleBeauty = (req, res) => {
  return res.send("뷰티용품을 구매할수있는 페이지 입니다");
};

const handleWrite = (req, res) => {
  return res.sendFile(__dirname + "/write.html");
};

const handleList = (req, res) => {
    // 모든 데이터 찾기
    db.collection('post').find().toArray((error,result)=>{
        console.log(result);
        return res.render('list.ejs',{posts:result});
    }); 

}

const handleDelete = (req,res) => {
  console.log(req.body);
  req.body._id = parseInt(req.body._id)

  //요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
  db.collection ('post').deleteOne(req.body,function(error,result){
    console.log('삭제완료');
  });
  return res.send('삭제완료');
}



const postAdd = (req, res) => {
    res.redirect('/');
    console.log(req.body.date);
    console.log(req.body.title);
    db.collection('counter').findOne({name: '게시물갯수'},(error,result)=>{
      let allList = result.totalPost;
      console.log(allList);
        db.collection('post').insertOne({_id: allList,title: req.body.title,date:req.body.date},()=>{
          allList += 1;
          console.log(allList);
          console.log('저장완료');
          //counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야함 (수정);
          //$set은 update를 사용할때 사용하는 operator이다
          db.collection('counter').updateOne({name:'게시물갯수'},{ $set :{totalPost:allList}},(error,result)=>{
            if(error) {return console.log(error);}
          })
      })
    });
  

};

app.get("/", handleHome);
app.get("/beauty", handleBeauty);
app.get("/write", handleWrite);
app.get("/list",handleList);
app.delete("/delete",handleDelete);
app.post("/add", postAdd);

MongoClient.connect(
  "mongodb+srv://admin:1q2w3e4r@cluster0.0yehu.mongodb.net/test?retryWrites=true&w=majority",
  function (error, client) {
    if (error) return console.log(error);
    db = client.db('todoapp');
    //서버띄우는 코드 여기로 옮기기
    app.listen("4040", function () {
      console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);
    });
  }
);
