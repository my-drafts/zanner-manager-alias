
var of = require('zanner-typeof').of;

var exists = module.exports.exists = function(_items, _name){
	return _items.some(function(item){
		return item.name==_name;
	});
};

var get = module.exports.get = function(_items, _name){
	return _items.find(function(item){
		return item.name==_name;
	});
};

var index = module.exports.index = function(_items, _name){
	return _items.findIndex(function(item){
		return item.name==_name;
	});
};

var run = module.exports.run = function(_items, _name, _arguments){
	// resolve(return) reject()
	var promise = new Promise(function(resolve, reject){
		var item = get(_items, _name);
		if(item===undefined) reject();
		else resolve(item.run(_arguments));
	});
	return promise;
};

var set = module.exports.set = function(_items, _alias){
	// resolve([index, overload]) reject(error)
	var promise = new Promise(function(resolve, reject){
		setImmediate(function(){
			if(!of(_alias, 'object')){
				reject('not object');
			}
			else if(!of(_alias.name, 'string') || !of(_alias.run, 'function')){
				reject('name/run wrong');
			}
			else{
				var idx = index(_items, _alias.name);
				if(idx===-1){
					resolve([_items.push(_alias)-1, false]);
				}
				else{
					_items[idx] = _alias;
					resolve([idx, true]);
				}
			}
		});
	});
	return promise;
};

var unset = module.exports.unset = function(_items, _name){
	// resolve(index) reject()
	var promise = new Promise(function(resolve, reject){
		setImmediate(function(){
			var idx = index(_items, _name);
			if(idx===-1){
				reject();
			}
			else if(idx===0){
				resolve([idx, _items.slice(1)]);
			}
			else if(idx===_items.length-1){
				resolve([idx, _items.slice(0, idx)]);
			}
			else{
				resolve([idx, _items.slice(0, idx).concat(_items.slice(idx+1))]);
			}
		});
	});
	return promise;
};
