const express = require('express');
const app = express();

const handleHome = (req,res) => {
    res.sendFile(__dirname + '/index.html');
};

const handleBeauty = (req,res) => {
    return res.send("뷰티용품을 구매할수있는 페이지 입니다");
};

const handleWrite = (req,res) => {
    return res.sendFile(__dirname + '/write.html');
}
const postAdd = (req,res) => {
    console.log(req.body);
    return res.send("전송완료");
}

app.get("/",handleHome);
app.get("/beauty",handleBeauty);
app.get("/write",handleWrite);

app.post("/add",postAdd);

app.use(express.urlencoded({extended: true})) 


app.listen(4040,function(){
    console.log('listening on 4040');
});