var assert = require('assert');
var VM = require('../brainfuck').VM;

describe('testing stuff', function () {
    it('just checks primitives', function () {
       assert.equal(1,1);
    });
});

describe('brainfuck vm', function () {
    describe('constructor', function () {
        var vm;
        beforeEach(function () {
            vm = new VM('>>>>');
        });
        it('sets the PC and ptr registers to 0', function () {
            assert.equal(vm.PC, 0);
            assert.equal(vm.ptr, 0);
        });
        it('initializes each buffer element to 0', function () {
            assert.equal(vm.buffer.length, 30000);
            var x = vm.buffer.reduce(function (prev, current) {
                return prev + current;
            } ,0);
            assert.equal(x, 0);
        });
        it('loads the program', function () {
            assert.equal(vm.program, '>>>>');
        });
    });
    describe('bracket matcher', function () {
        var vm;
        beforeEach(function () {
            vm = new VM();
        });
        it('finds the address of the matching bracket from the current PC', function () {
            vm.program='.......[........].....[.........]...';
            vm.PC=7;
            assert.equal(vm.findMatch(), 16);
            vm.PC=16;
            assert.equal(vm.findMatch(), 7);
            vm.PC=22;
            assert.equal(vm.findMatch(), 32);
            vm.PC=32;
            assert.equal(vm.findMatch(), 22);
        });
    });
    describe('opcode', function () {
        var vm;
        beforeEach(function () {
            vm = new VM('+-><.');
        });
        it('+ increments the current cell', function () {
            vm.ptr=100;
            vm.PC=0;
            vm.tick();
            assert.equal(vm.buffer[vm.ptr], 1);
            vm.PC=0;
            vm.tick();
            assert.equal(vm.buffer[vm.ptr], 2);
            vm.PC=0;
            vm.tick();
            assert.equal(vm.buffer[vm.ptr], 3);
        });
        it('- decrements the current cell', function () {
            vm.ptr=100;
            vm.buffer[vm.ptr]=3;
            vm.PC=1;
            vm.tick();
            assert.equal(vm.buffer[vm.ptr], 2);
            vm.PC=1;
            vm.tick();
            assert.equal(vm.buffer[vm.ptr], 1);
            vm.PC=1;
            vm.tick();
            assert.equal(vm.buffer[vm.ptr], 0);
        });
        it('> moves the pointer up', function () {
            vm.PC=2;
            vm.tick();
            assert.equal(vm.ptr, 1);
            vm.PC=2;
            vm.tick();
            assert.equal(vm.ptr, 2);
            vm.PC=2;
            vm.tick();
            assert.equal(vm.ptr, 3);
        });
        it('< moves the pointer down', function () {
            vm.ptr=4;
            vm.PC=3;
            vm.tick();
            assert.equal(vm.ptr, 3);
            vm.PC=3;
            vm.tick();
            assert.equal(vm.ptr, 2);
            vm.PC=3;
            vm.tick();
            assert.equal(vm.ptr, 1);
        });
        it('. prints the current cell', function () {
            vm.buffer[0]='a';
            vm.buffer[1]='b';
            vm.buffer[2]='c';
            var str = '';
            vm.out = function (s) {
                str+=s;
            };
            
            vm.PC=4;
            vm.tick();
            assert.equal(str, 'a');
            vm.ptr=1;
            vm.PC=4;
            vm.tick();
            assert.equal(str, 'ab');
            vm.ptr=2;
            vm.PC=4;
            vm.tick();
            assert.equal(str, 'abc');
        });
    });
});