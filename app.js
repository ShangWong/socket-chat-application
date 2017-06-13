var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.use(express.static('client'));
app.use('/', express.static('client'));
// app.use('/client', express.static(path.join(__dirname + '/client')));

app.get('/', function(req, res){
  res.sendFile(__dirname + 'index.html');
});

var userCount = 0;

io.on('connection', function(socket){
  socket.on('chat', function(msg){
    console.log(msg);
    socket.broadcast.emit('chat message', msg);
  });

  var newUser = false;

  // when the client emits 'add user', this listens and executes
  socket.on('userjoin', function (username) {
    if (newUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++userCount;
    console.log('user joined');
    console.log('Current user count is ' + userCount);
    newUser = true;
    socket.emit('login', {
      newUser: newUser
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('userCount', userCount);
  });

  socket.on('disconnect', function(){
    userCount = userCount - 1;
    console.log('user left');
    console.log('Current user count is ' + userCount);
    socket.broadcast.emit('userCount', userCount);
  });

});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:' + (process.env.PORT || 3000));
});
