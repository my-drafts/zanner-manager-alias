
var am = require('../');
var frun = function(a){
	return a;
};
var f1 = function(){
	console.log('!1: %j', arguments);
};
var f2 = function(){
	console.log('!2: %j', arguments);
};

var a = new am();

a.set({ name: 'a1', run: frun })
	.catch(f2)
	.then(function(){
		f1(arguments, 1);
	});

a.set({ name: 'a1', run: frun })
	.catch(f2)
	.then(function(){
		f1(arguments, 2);
	});

a.set({ name: 'a2', run: frun })
	.catch(f2)
	.then(function(){
		f1(arguments, 3);
	});

a.set({ name: 'a2', run: frun })
	.catch(f2)
	.then(function(){
		f1(arguments, 4);
	});

a.unset('a2')
	.catch(f2)
	.then(function(){
		f1(arguments, 5);
	});

setTimeout(function(){
	a.run('a1', 3).then(f1).catch(f2);
}, 2000);

setTimeout(function(){
	console.log(a);
}, 3000);
