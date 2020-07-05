const socket = io("http://localhost:5000/");
socket.on('message', (message) => {
    editor.value = message
})



const getEl = id => document.getElementById(id);
const editor = getEl("editor");


editor.addEventListener("keyup", evt => {
     const text = editor.value;
     socket.send(text);
 });
