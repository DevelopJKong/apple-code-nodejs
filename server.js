import express from "express";
import methodOverride from "method-override";

const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 4040;
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const session = require("express-session");




let db;

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use('/public',express.static('public'));
app.use(session({secret: "secret",resave:true, saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());


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
  req.body._id = parseInt(req.body._id);

  //요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
  db.collection ('post').deleteOne(req.body,function(error,result){
    console.log('삭제완료');
    return res.status(200).send({message:'삭제완료'});
  });
}

//detail 로 접속하면 detail.ejs 보여줌

const handleDetail = (req,res) =>{
  db.collection('post').findOne({_id:parseInt(req.params.id)},(error,result)=>{
 
    return res.render("detail.ejs",{data:result});
  })
}

//edit 로 접속하면 edit.ejs 보여줌
const handleEdit =  (req,res) => {
  const { id } = req.params
  db.collection('post').findOne({_id : parseInt(id)},function(error,result){
    console.log(result);
    return res.render('edit.ejs', {post: result});
  });
};

const handleLogin = (req,res) => {
  return res.render("login.ejs");
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


const postLogin = (req,res) => {
  return res.redirect("/");
}
passport.use(new LocalStrategy({
  usernameField: 'id',
  passwordField: 'pw',
  session: true,
  passReqToCallback: false,
}, function (id, pw, done) {
  //console.log(입력한아이디, 입력한비번);
  db.collection('login').findOne({ id: id }, function (error, result) {
    if (error) return done(error)

    if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
    if (pw == result.pw) {
      return done(null, result)
    } else {
      return done(null, false, { message: '비번틀렸어요' })
    }
  })
}));




app.get("/", handleHome);
app.get("/beauty", handleBeauty);
app.get("/write", handleWrite);
app.get("/list",handleList);
app.get("/detail/:id",handleDetail);
app.get("/edit/:id",handleEdit);
app.get("/login",handleLogin);



app.delete("/delete",handleDelete);
app.post("/add", postAdd);
app.post("/login",passport.authenticate('local',{
  failureRedirect: '/fail'
}),postLogin);

















MongoClient.connect(
  "mongodb+srv://admin:jeongkong@cluster0.0yehu.mongodb.net/test?retryWrites=true&w=majority",
  function (error, client) {
    if (error) return console.log(error);
    db = client.db('todoapp');
    //서버띄우는 코드 여기로 옮기기
    app.listen("4040", function () {
      console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);
    });
  }
);






