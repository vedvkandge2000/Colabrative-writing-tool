# Colabrative-writing-tool


This is a Simple colabrative document creator web application build with the help of  node.js,express.js,ejs, socket.io. The main features are you can share your document with other user and
also you can edit your document with other contributors in real-time also along with this user authentication and password reset using gmail(nodemailer) is also implemented.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

To get you started you can simply clone the repository:

```
https://github.com/vedvkandge2000/Colabrative-writing-tool
```
and install the dependencies
```
npm install
```
A number of node.js tools is necessary to initialize and test the project. You must have node.js and its package manager (npm) installed. You can get them from http://nodejs.org/. The tools/modules used in this project are listed in package.json and include express, mongodb and mongoose.


### Run application

The project is preconfigured with a simple development web server. The simplest way to start this server (on port 5000)is:
```
node app.js
```

Another way is install nodemon and run and server will start on port 5000
```
nodemon app.js
```


## Built With

* [Bootstrap](https://getbootstrap.com/) - The web framework used
* [npm](https://www.npmjs.com/) - Dependency Management
* [mongoose](https://mongoosejs.com/docs/api/model.html) - Used to generate database
* [ejs](https://ejs.co/#install) - Used for webpage rendering. JS framework.
* [socket.io](https://socket.io/) - Used for real-time editing.

