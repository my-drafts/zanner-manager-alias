
var am = require('../');

var a = new am();
a.set({
	name: 'a1',
	run: function(a){
		console.log(a);
		return a;
	}
});
a.set({
	name: 'a1',
	run: function(a){
		console.log(a);
		return a;
	}
});
a.set({
	name: 'a2',
	run: function(a){
		console.log(a);
		return a;
	}
});
a.run('a1', 3);

console.log(a);
