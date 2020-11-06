const express = require("express")
const app = express();
const aws = require("aws-sdk")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json({extended:false}));
app.set("view engine","ejs")
app.set("views","./views")
//config
const region = "ap-southeast-1"; 
const accessKeyId = "AKIAUJEV5DUPWLJGQRTP";
const secretAccessKey = "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";
app.listen(4000,(err)=>{
    if(err)
        console.log("Loi: ",err);
    else
        console.log("server runing port 40node ");
});

const dynamoDB = new aws.DynamoDB.DocumentClient({
    region: region,
    accessKeyId : accessKeyId,
    secretAccessKey : secretAccessKey
})
// get danh sach Linh Kien
app.get("/",(req,res)=>{
    const paramsDanhSachLinhKien = {
        TableName : "LinkKien",
    };
    dynamoDB.scan(paramsDanhSachLinhKien,(error,data)=>{
        if(error)
            console.log(JSON.stringify(error,null,2));
        else 
            res.render("index",{
                linhKien : data.Items
            });
    });
});
// add linh kien /api/addLinhKien
app.post("/api/addLinhKien",(req,res)=>{
    const {maLinhKien,ten,donViTinh,gia,thongSoKyThuat} = req.body;
    console.log(maLinhKien);
    const linhKien = {
        maLinhKien : maLinhKien,
        tenLinhKien : ten,
        donViTinh : donViTinh,
        gia : gia,
        thongSoKyThuat : thongSoKyThuat
    };
    const paramsAddLinhKien = {
        TableName : "LinkKien",
        Item: linhKien
    };
    dynamoDB.put(paramsAddLinhKien,(error,data)=>{
        if(error){
            console.log("Loi",error);
            return res.json({msg:"Lỗi khi thêm"});
        }
        else 
            res.redirect("/");
           // return res.json({msg:"Thêm thành công!!!!"});
    });
});
    // delete sinh vien
app.post("/deleteLinhKien",(req,res)=>{
    const {id,maLinhKien} = req.body;

    console.log(maLinhKien);
    const paramsDeleteLinhKien = {
        TableName : "LinkKien",
        Key:{
          //  id : parseInt(id),
            maLinhKien : maLinhKien
        }
    };
    dynamoDB.delete(paramsDeleteLinhKien,(err,data)=>{
        if(err)
            console.log(JSON.stringify(err,null,2));
        else   
            res.redirect("/");
    });
});
app.post("/updateForm",(req,res)=>{
        const {id,maLinhKien,tenLinhKien,gia,donViTinh,thongSoKyThuat} = req.body;
        const linhKien = {
            maLinhKien : maLinhKien,
            tenLinhKien : tenLinhKien,
             donViTinh : donViTinh,
             gia : gia,
             thongSoKyThuat : thongSoKyThuat
        }
        res.render("formupdate",{
            linhKien: linhKien
        });
});

app.post("/updateLinhKien",(req,res)=>{
    const {maLinhKien,tenLinhKien,donViTinh,gia,thongSoKyThuat} = req.body;
    console.log(donViTinh);
    console.log(maLinhKien)
    const paramsUpdate = {
        TableName : "LinkKien",
        Key :{
            "maLinhKien" : maLinhKien
        },
        UpdateExpression: "set tenLinhKien =:tenLK , donViTinh = :donViTinh , gia = :gia , thongSoKyThuat =:tskt",
        ExpressionAttributeValues:{
            ":tenLK" : tenLinhKien,
            ":donViTinh" : donViTinh,
            ":gia" : Number.parseInt(gia),
            ":tskt" : thongSoKyThuat
        },
        ReturnValues:"UPDATED_NEW"
    };
    dynamoDB.update(paramsUpdate,(err,data)=>{
        if(err)
            console.log(err)
        else
            res.redirect("/");
    });
})