function addTodolist(e) {
  var obj_list = {
      todo: "",   // 用于存储用户输入的数据
      done: false     // false表示未做,true表示已做
  };
  document.getElementById("add_list").value = document.getElementById("add_list").value.trim(); // 去除前后空格
  if (document.getElementById("add_list").value.length === 0){
      alert("不能为空");
      return;
  }

  obj_list.todo = document.getElementById("add_list").value; // 用户输入数据
  todolist.unshift(obj_list); // 放入TodoList数组中

  saveData(todolist); // 保存至本地缓存

  document.getElementById("add_list").value = "";     // 初始化输入框
  load();     // 将用户输入的数据添加至dom节点
  document.getElementById("add_list").focus(); // 聚焦
}

function load(){
  var todo = document.getElementById("todolist"),
      todoString = "";

  todolist = loadData(); // 从本地缓存中加载数据到todolist中
  // console.log(todolist);

  // todolist数组对象里若包含用户输入数据，则将其添加至dom节点；若为空对象，则初始化页面。
  if (todolist.length != 0){
    for (let i=0; i<todolist.length; i ++){
      todoString += "<li><input id='input-"+i+"' type='checkbox' onchange='update("+i+",\"done\"," + !todolist[i].done + ")' ";
        
      if(todolist[i].done) { // 做过的就打上勾
          todoString += "checked='checked'";  
      }
        
      todoString += " style='display:inline'>"; // 标签不换行，使多个标签可以保持在同一行
        
      if(todolist[i].done) { // 做过的打上删除线
          todoString += "<del style='display:inline'>" + todolist[i].todo + "</del>";
      } else { // 没做过的不用打上删除线
          todoString += "<p style='display:inline'>" + todolist[i].todo + "</p>";
      }
        
      todoString += "<a onclick='remove("+i+")'>-</a></li>"; // 删除事项为 - 号
        
      todo.innerHTML = todoString; // 替换原有 html 内容
    }
  }
  else {
      // console.log("empty");
      todo.innerHTML = ""; // 数组为空直接清空原有 html 内容
  }
} 

function update(i, field, value) {
  // console.log("update");
  todolist[i][field] = value; // 字符串形式使用[]，变量形式使用.
  if (value){ // 如果是已做，则将其放到数组尾部
    var temp = todolist[i];
    todolist.splice(i, 1);
    todolist.push(temp);
  }
  else { // 如果变为未做，则将其放到数组头部
    var temp = todolist[i];
    todolist.splice(i, 1);
    todolist.unshift(temp);
  }
  
  saveData(todolist); // 保存至本地缓存
  load(); // 更新 dom 节点
}

function remove(i) {
  // console.log("remove");
  todolist.splice(i, 1); // splice(i,1) 表示从第i个位置起删除1个元素
  saveData(todolist); //相同名称的缓存会覆盖，更新缓存

  load(); // 更新 dom 节点
}

function saveData(data) {
  localStorage.setItem("mytodolist", JSON.stringify(data));   //JS对象转换成JSON对象存进本地缓存
}

function loadData() {
  var hisTory = localStorage.getItem("mytodolist"); // 从本地缓存获取 mytodolist 对应项的JSON对象
  // console.log(hisTory)
  if(hisTory !=null){
      return JSON.parse(hisTory);     // JSON对象转换为JS对象
  }
  else { return []; }
}

function clear() {
  localStorage.removeItem("mytodolist"); // 删除本地缓存的 mytodolist 项
  load(); // 更新 dom 节点
}

function deletedone() {
  // 找到最小的已做事项的位置，然后从这个位置开始删除
  var pos = todolist.length;
  for(let i=0; i<todolist.length; i ++) { // let 是块作用域 var 是函数作用域
    if (todolist[i].done) {
      pos = i;
      break;
    }
  }
  todolist.splice(pos);
  saveData(todolist); // 保存至本地缓存

  load(); // 更新 dom 节点
}

window.addEventListener("load", load);  //页面加载完毕调用load函数

// 清除全部
document.getElementById("clearbutton").onclick = clear;
// 删除已做
document.getElementById("deletedonebutton").onclick = deletedone;

// 回车添加
document.getElementById("add_list").onkeydown = function (event) {
  if(event.key === 'Enter'){
      addTodolist();
  }
};
// 点击按钮添加
document.getElementById("addbutton").onclick = addTodolist;