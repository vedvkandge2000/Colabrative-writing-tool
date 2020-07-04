// var socket = io('http://localhost:5000');
// const log = console.log;

// const getEl = id => document.getElementById(id);

// const editor = getEl("editor");

// editor.addEventListener("keyup", evt => {
//     const text = editor.value;
//     socket.send(text);
// });

// socket.on('message', data => {
//     editor.value = data;
// });

const socket = io("http://localhost:5000/")

socket.on('message', (message) => {
    editor.value = message
})

const getEl = id => document.getElementById(id);
const editor = getEl("editor");

editor.addEventListener("keyup", evt => {
     const text = editor.value;
     socket.send(text);
 });
    
 
// document.querySelector('#submit-btn').addEventListener('click', () => {
//     // e.preventDefault()

//     const message = document.querySelector("#editor").value;
//     const id = document.getElementById("post-id");
//     console.log("hello");
    
    
    
//     // socket.emit('message', {message:message,id:id})
// })