const request = require('request');
const io = require('socket.io-client');
const config = require('./config');

const socket = io(config.herokuAppUrl);
let answers = [];

socket.on('connect', () => {
  console.log('connect');

  socket.emit('auth:submit', config.password);
});

socket.on('auth:success', () => {
  console.log('auth:success');

  socket.emit('answers:all');
});

socket.on('answers:all', (data) => {
  console.log('answers:all');
  answers = data;
});

socket.on('answers:new', (newAnswer) => {
  console.log('answers:new');
  console.log(newAnswer);
  answers.push(newAnswer);
});

socket.on('answers:sent', (answerId) => {
  console.log('answers:sent');
  console.log(answerId);
  const answer = answers.find((a) => a.id === answerId);
  console.log('answer');
  console.log(answer);
  if (answer) {
    request(config.unityUrl+'?message='+encodeURIComponent(answer.text), (error) => {
      if (error) console.error(error);
    });
  } else {
    console.error('Answer with id:' + answerId + ' was not found');
  }
});

socket.on('scene:action', (action) => {
  console.log('scene:action ' + action);
  if (action === 'next') {
    request(config.unityUrl+'?command=change', (error) => {
      if (error) console.error(error);
    });
  } else if (action === 'final') {
    request(config.unityUrl+'?command=final', (error) => {
      if (error) console.error(error);
    });
  }
});
