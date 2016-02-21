VM.prototype.findMatch = function () {
  var type = this.program[this.PC];
  var idx = this.PC;
  var scanDirection = bracketToSign(type);
  var braceCount = scanDirection;
  while(braceCount !== 0) {
    idx+=scanDirection;
    braceCount+=bracketToSign(this.program[idx]);
  }
  return idx;
  function bracketToSign (ch) {
    return ({'[':1,']':-1}[ch]) || 0;
  }
};
VM.prototype.tick = function () {
  var inst = this.program[this.PC];
  var cell = this.buffer[this.ptr];
  switch (inst) {
    case '+':
      this.buffer[this.ptr]++;
      break;
    case '-':
      this.buffer[this.ptr]--;
      break;
    case '>':
      this.ptr++;
      break;
    case '<':
      this.ptr--;
      break;
    case '.':
      this.out(cell);
      break;
    case '[':
      if (cell) {
        this.push();
      }
      else {
        this.PC = this.findMatch()+1;
        return;
      }
      break;
    case ']':
      this.pop();
      return;
    default:
    //NOP
      break;
  }
  this.PC++;
};
VM.prototype.push = function () {
  this.stack.push(this.PC);
};
VM.prototype.pop = function () {
  this.PC = this.stack.pop();
};
VM.prototype.out = function (x) {
  console.log(String.fromCharCode(x));
};
VM.prototype.run = function () {
  while (this.PC < this.program.length) {
    this.tick();
  }  
};
function VM (program) {
  this.program = program || '';
  this.ptr=0;
  this.PC=0;
  this.stack = [];
  var a = [];
  for (var i = 0; i<30000; i++) {
    a[i]=0;
  }
  this.buffer = a;
}

module.exports.VM = VM;
// var str = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';
// var vm = new VM(str);
// var stdout = '';
// vm.out = function (s) {
//   stdout+=s;
// }
// vm.run();
// console.log(stdout + stdout + stdout);