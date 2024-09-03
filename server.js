const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    requestHandle("./index.html", "html", res);
  } else if (req.url === "/index.js") {
    requestHandle("./index.js", "js", res);
  } else if (req.url === "/signUp") {
    console.log("signup");
    requestHandle("./signUp.html", "html", res);
  } else if (req.url === "/signup.js") {
    requestHandle("./signup.js", "js", res);
  } else if (req.url == "/signup.css") {
    requestHandle("./signup.css", "css", res);
  } else if (req.url === "/signin.css") {
    requestHandle("./signin.css", "css", res);
  } else if (req.url === "/signin.js") {
    requestHandle("./signin.js", "js", res);
  } else if (req.url === "/signIn") {
    requestHandle("./signIn.html", "html", res);
  } else if (req.url === "/todo") {
    requestHandle("./toDo.html", "html", res);
  } else if (req.url === "/toDo.css") {
    requestHandle("./toDo.css", "css", res);
  } else if (req.url === "/toDo.js") {
    requestHandle("./toDo.js", "js", res);
  } else if (req.url === "/plus.jpg") {
    requestHandle("./plus.jpg", "jpg", res);
  } else if (req.method === "POST" && req.url === "/post") {
    console.log("POST", "yes");
    write(req, res);
    // res.end("yes")
  } else if (req.url === "/data") {
    read(req, res);
  } else if (req.url === "/addTask") {
    console.log("hello");
    writetask(req, res);
  } else if (req.url === "/taketask") {
    sendTask(req, res);
  } else if (req.url === "/deletTask") {
    delet(req, res);
  } else if (req.url === "/update") {
    console.log("update");
    update(req, res);
  }else if(req.url==='/dltAccount'){
    deletAccount(req,res);
  }else if(req.url==='/checkPass'){
    checkPass(req,res);
  }
});
let email;
let checkPass = (req,res)=>{
     let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on('end',()=>{
    fs.readFile('dataBase.txt','utf-8',(err,data)=>{
      if(err) Console.log(err);
      else {
        data=JSON.parse(data)
        body=JSON.parse(body);
        console.log(body);
        let indx=data.findIndex((obj)=> obj.email===body.email)
        console.log(indx)
        console.log(data[indx].password);
        if (body.password==data[indx].password){
          console.log('yes');
          res.end(JSON.stringify({msg:"yes"}));
        }else{
          res.end(JSON.stringify({ msg: "no" }));
        }

      }


  })

  })
}
let deletAccount= (req,res)=>{
   let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    //  body = JSON.parse(body);
    fs.readFile("dataBase.txt", "utf-8", (err, data) => {
      if (err) console.log(err);
      else {
        console.log(body);
        body = JSON.parse(body);
        data = JSON.parse(data);
        console.log(data);
        console.log(body,data);
        let indx = data.findIndex((obj) => obj.email == body);
        if(indx!=-1){
        console.log(indx);
        data.splice(indx,1);
         fs.writeFile("dataBase.txt", JSON.stringify(data), (err) => {
           if (err) console.log(err);
           else console.log("task update");
         });
         res.end(JSON.stringify({ msg: "account is deleted" }));
        }
      }}
    )
})
}



function update(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    //  body = JSON.parse(body);
    fs.readFile("dataBase.txt", "utf-8", (err, data) => {
      if (err) console.log(err);
      else {
        console.log(body);
        body = JSON.parse(body);
        data = JSON.parse(data);
        console.log(data);
        console.log(body);
        let indx = data.findIndex((obj) => obj.email == body.email);
        let taskindx = data[indx].task.findIndex(
          (task) => task.id == body.id
        );
        console.log(taskindx,data[indx].task[0])
        data[indx].task[taskindx].task = body.task;
        fs.writeFile("dataBase.txt", JSON.stringify(data), (err) => {
          if (err) console.log(err);
          else console.log("task update");
        });
        res.end(JSON.stringify({ msg: "task is deleted" }));
      }
    });
  });
}
function delet(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    body = JSON.parse(body);
    fs.readFile("dataBase.txt", "utf-8", (err, data) => {
      if (err) console.log(err);
      else {
        data = JSON.parse(data);
        let indx = data.findIndex((obj) => obj.email == body.email);
        let taskindx = data[indx].task.findIndex((task) => task.id === body.id);
        data[indx].task.splice(taskindx, 1);
        fs.writeFile("dataBase.txt", JSON.stringify(data), (err) => {
          if (err) console.log(err);
          else console.log("task deleted");
        });
        res.end(JSON.stringify({ msg: "task is deleted" }));
      }
    });
  });
}
function requestHandle(url, name, res) {
  fs.readFile(url, "utf-8", (err, data) => {
    if (err) console.log(err);
    else {
      res.writeHead(200, { "Content-Type": `text/${name}` });
      console.log(url);
      // if(url==="")
      res.end(data);
    }
  });
}
let arr = [];
function sendTask(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    fs.readFile("dataBase.txt", "utf-8", (err, data) => {
      if (err) console.log(err);
      else {
        data = JSON.parse(data);
        body = JSON.parse(body);
        let indx = data.findIndex((obj) => obj.email === body);
        let items = [];
        if(data[indx].task){
        data[indx].task.forEach((element) => {
          items.push(element);
        });
        items.push(data[indx].name);
        res.writeHead(200, { "Content-Type": "text/json" });
        res.end(JSON.stringify(items));}
      }
    });
  });
}

function writetask(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("data", () => {
    console.log(body);
    fs.readFile("dataBase.txt", "utf-8", (err, data) => {
      if (err) console.log(err);
      else {
        data = JSON.parse(data);
        body = JSON.parse(body);
        console.log(body);
        console.log(data);
        let indx = data.findIndex((element) => {
          return element.email == body.email;
        });
        console.log(indx);
        let obj={
          task:body.task,
          id:body.id,
        }
        data[indx].task.push(obj);
        console.log(data);
        fs.writeFile("dataBase.txt", JSON.stringify(data), (err) => {
          if (err) 
          {
            console.log(err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error");
          }
          else{
            res.writeHead(200, { "Content-Type": "text/json" });
            res.end(JSON.stringify('task successfuly add'));
          }
        });
      }
    });
  });
}

function read(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    read(req, res, body);
    // console.log(body);
  });
  req.on("data", () => {
    let indxs;
    const info = fs.readFile("dataBase.txt", "utf-8", (err, data) => {
      if (err) console.log(err);
      else {
        console.log(data);
        data = JSON.parse(data);
        body = JSON.parse(body);
        indxs = data.findIndex(
          (obj) => obj.email === body.email && obj.password === body.password
        );
        email=body.email;
        res.end(JSON.stringify(indxs));
       
      }
    });
  });
}
function write(req, res) {
  let body = "";
  // console.log(data)
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  //  console.log(arr);

  req.on("end", () => {
    const info = fs.readFile("dataBase.txt", "utf-8", (err, data) => {
      //  console.log(arr);

      if (err) console.log(err);
      else {
        console.log(body);
        body = JSON.parse(body);
        let indx = -1;
        console.log(data);
        if (data) {
          data = JSON.parse(data);
          arr = data;
          indx = arr.findIndex((obj) => obj.email === body.email);
          console.log(arr);
          console.log(indx);
        }
        if (indx != -1) {
          res.end(JSON.stringify(indx));
        } else {
          arr.push(body);

          fs.writeFile("dataBase.txt", JSON.stringify(arr), (err) => {
            if (err) console.log(err);
            else console.log("data saved");
          });
          res.end(JSON.stringify(indx));
        }
      }
    });
  });
}
server.listen(5000, () => {
  console.log("server is running on port 5000");
});
