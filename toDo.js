let text = document.querySelector(".inp");
let add = document.querySelector(".add");
let ulL = document.querySelector("ul");
let nameDisplay = document.querySelector(".username")
 let lgout = document.querySelector(".logout");
 let dltA = document.querySelector(".account");
 let dltAccount = document.querySelector(".deletA");

let list = 1,
  indx;
let isUpdt = false;
let tasks = [],
  arr = [];
  let prvs;
add.addEventListener("click", () => {
  console.log("input");
  if (text.value !== "" && isUpdt == true) {

    let list = document.querySelector(".edit");
    console.log(arr);
    list.querySelector(".textI").innerHTML = text.value;
   let idd = list.querySelector(".textI").id;
   console.log(idd);
    update(text.value,idd)
    text.value = "";
    isUpdt = false;
  } else if (text.value !== "") {
    console.log(text.value);
    let mail = JSON.parse(localStorage.getItem("email"));
    let taskid=Date.now();
    let obj = {
      task: text.value,
      email: mail,
      id:taskid,
    };
    loadF(obj);
    createE(text.value,taskid);
    arr.push(obj);
    text.value = "";
  } else {
    alert("add task");
  }
});

nameDisplay.addEventListener("click",()=>{
 dltA.classList.remove("hide");
 
})
lgout.addEventListener("click", () => {
  func()
});
let func =()=>
{
    localStorage.removeItem("email");
    ulL.innerHTML = "";
    let req = new XMLHttpRequest();
    req.open("GET", "/signIn");
    req.send();
    req.onreadystatechange = () => {
      if (req.readyState == 4 && req.status == 200) {
        window.location.href = "/signIn";
      }
    };
}
dltAccount.addEventListener("click", () => {
  let mail = JSON.parse(localStorage.getItem("email"));
  if(confirm("if once your account is deleted it can't be recover"))
  {
    let password=prompt("enter your account password")
    console.log(password)
    let req = new XMLHttpRequest();
    req.open("POST", "/checkPass");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify({email:mail,password:password}));
    req.onreadystatechange = () => {
      if (req.readyState == 4 && req.status == 200) {
        let res = JSON.parse(req.responseText);
        console.log(res);
        if(res.msg=='yes'){
         sendRequest(mail, "dltAccount");
         func()
        }else{
          alert("wrong password entered")
        }
      }
    }
  }

});

let createE = (value,id) => {
  let li = document.createElement("li");
  let newE = `<div class="l-c"><p class="textI" id="${id}">${value}</p></div><div class="r-c"><input type="checkbox" " id="check"><i class="fa-solid 3x fa-pencil" id="updt"></i><i id="delete" class="fa-solid fa-trash 3x"></i></div>`;
  li.innerHTML = newE;
  ulL.append(li);
  tasks.push(li.querySelector(".textI").innerHTML);
  li.querySelector("#delete").addEventListener("click", () => {
    console.log("hello");
    let result = confirm("ARE YOU WANT TO DELETE THE TASK ?");
    if (result === true) {
      
      // arr = arr.filter(task => task.task !== value);
      // loadF();
      delet(value,id);
      li.remove();
    }
  });
     if (li.querySelector("#check").checked == true) {
       console.log(li);
       li.querySelector(".textI").style.textDecoration = "line-through";
     } else {
       li.querySelector(".textI").style.textDecoration = "none";
     }
  li.querySelector("#check").addEventListener("click", () => {
    if (li.querySelector("#check").checked == true) {
      console.log(li);
      li.querySelector(".textI").style.textDecoration = "line-through";
    } else {
      li.querySelector(".textI").style.textDecoration = "none";
    }
  });
      idd = id;
      console.log(id);
  li.querySelector("#updt").addEventListener("click", () => {
    let valu = li.querySelector("p").innerText;
    console.log(valu);
    li.classList.add("edit");
    text.value = li.querySelector(".textI").innerHTML;
    indx = arr.findIndex((el) => el.task == text.value);
    prvs=text.value;
    text.focus();
    isUpdt = true;
    console.log(id);


  });
  console.log(tasks);
};

let sendRequest = (obj,url)=>{
  
 let req = new XMLHttpRequest();
 req.open("POST", `/${url}`);
 req.send(JSON.stringify(obj));
 req.onreadystatechange = () => {
   if (req.readyState == 4 && req.status == 200) {
     console.log(req.responseText);
   }
 };
}
let update=(value,id)=>{
  let mail = JSON.parse(localStorage.getItem("email"));
  let updt = {
    task: value,
    email: mail,
    updateTask: prvs,
    id:id,
  };
  console.log(updt)
    sendRequest(updt, "update");
}

let delet = (value,id) => {
  let mail = JSON.parse(localStorage.getItem("email"));
  let dltObj = {
    task: value,
    email: mail,
    id:id,
  };
  sendRequest(dltObj, "deletTask");
 
};
document.addEventListener("DOMContentLoaded", () => {
  let mail = JSON.parse(localStorage.getItem("email"));
  let req = new XMLHttpRequest();
  req.open("POST", "/taketask");
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(mail));
  req.onreadystatechange = () => {
    if (req.readyState == 4 && req.status == 200) {
      console.log(req.responseText);
      let task = JSON.parse(req.responseText);
      console.log(task);
        nameDisplay.innerHTML = task.pop();
      task.forEach((ele) => {
        createE(ele.task,ele.id);
      });
    }
  };
});
function loadF(obj) {
  // localStorage.setItem("task", JSON.stringify(arr));
  sendRequest(obj, `addTask`);

}
