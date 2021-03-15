// var child = require('child_process').spawn('java' ,['-jar', `${__dirname}\\test.jar`,`${__dirname}\\teams24.txt`]);
var pro = require('child_process');
const child = pro.spawn(`${__dirname}\\cppSRC\\BasketballEliminationProblem.exe`, [
  `${__dirname}\\cppSRC\\input1.txt`,
]);

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
