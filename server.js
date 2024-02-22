

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./Database/connection');
const PDTRouter = require('./Router/PDTRouter');
const { poolConnect, pool, sql } = require('./Database/AXconnection');

const http = require('http');
const socketIo = require('socket.io');
/**create an express app*/
const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  //pass the server, solving some cors issues
  cors:{
      //tell the server which server will make the call to our socket.io server 
      origin : "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Authorization", "Content-Type"],
  },
}
  
);

// process.env.TZ = 'Asia/Manila';

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
const port = 4001;
/** Middleware that looks for the body of incomming request / data to server */
/** and attach to the req object */
// app.use(express.json());

/**A node module use to get the data from the request / Post object*/
/**Increase payload size limit to 50MB*/
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
/** Middleware to console incoming request */
app.use((req, res, next)=>{
    // console.log(req.path, req.method);
    next();
});

/**Connection to database */
connection.connect((err) => {
    if (err) {
      throw err;
    }
    // console.log('Connected to database');
  });


io.on('connection', (socket) => {
  // console.log('A user connected');

  socket.on('disconnect', () => {
    // console.log('A user disconnected');
  });
  
});     
// /** Set a route handler */
app.use('/', PDTRouter);

/** Listen for request */
server.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});

module.exports = {
  app,  // You can export the Express app if needed
  server,
  io,    // Export the io object so it can be accessed in other files
};