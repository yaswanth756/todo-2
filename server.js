var express=require("express");
var bodyparser=require("body-parser");
var path=require("path");
var app=express();
app.use(express.static(__dirname));
app.use(bodyparser.json());
const port=3000;
//-------------------mysql database connection>
const mysql=require("mysql");
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "Raju@123",
    database: process.env.DB_NAME || "todoDB",
    port: process.env.DB_PORT || 3306,
});

db.connect((err)=>{
    if(err) throw err;
    console.log("connected to my database");
});
db.query("SELECT * FROM todos",(err,result)=>{
    console.log(result);
});


//--------------------------------mysql database connection START>
//--------------------------------PAGE load>
var todoList=[];
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

//--------------------------------todo get load>
app.get("/api/todolist",(req,res)=>{
    db.query("SELECT * from todos order by id DESC",(err,result)=>{
        if(result.length===0){
            res.json({message:"Your to-do list is empty! 🍃 Let's get productive and add your first task!"});
        }else{
            
            res.json(result);
        }
    })
});



//--------------------------------post load>
app.post("/api/todolist",(req,res)=>{
    var {name, description,date}=req.body;
    var sql="insert into todos (name,description,date) VALUES (?,?,?)";
    db.query(sql,[name,description,date],(err,result)=>{
        if(err){
            res.status(500).json({message:err.message});
        }
        else{
            res.status(200).json({message:"todo added successfully"});
        }
    });
})

//--------------------------------updateload>
app.put('/api/todolist/:id',(req,res)=>{
    const todoId=req.params.id;
    console.log(todoId);
    var {status}=req.body;
    var sql="update todos SET status=? where id=?";
    db.query(sql,[status,todoId],(err,result)=>{
        if(err){
            res.status(500).json({error:err.message});

        }else{
            res.status(200).json({message: "Todo updated successfully"});
        }
    });
})

app.delete('/api/todolist/:id', (req, res) => {
    const todoId = req.params.id;

    // SQL query to delete the todo
    const sql = "DELETE FROM todos WHERE id = ?";
    db.query(sql, [todoId], (err, result) => {
        if (err) {
            console.log(err);  // Log the error on the server side
            res.status(500).json({ error: err.message });
        } else {
            if (result.affectedRows === 0) {  // Check if the row exists
                return res.status(404).json({ message: "Todo not found" });
            }
            res.status(200).json({ message: "Todo deleted successfully" });
        }
    });
});

//--------------------------------listen>
app.listen(port,()=>{
    console.log("good sucess bro!");
});

