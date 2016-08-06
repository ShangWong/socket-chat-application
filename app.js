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

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log(msg);
    socket.broadcast.emit('chat message', msg);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:' + (process.env.PORT || 3000));
});
