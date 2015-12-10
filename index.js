
var of = require('zanner-typeof').of;
var logger = require('zanner-logger')('aliasManager');

var aliasManager = module.exports = function(_log){
	var self = this;
	var items = self._items = [];

	var log = function(){
		(_log ? _log : logger.log).apply(self, arguments);
	};

	// check if there is an alias
	self.is = function(_name){
		var result = aliasExists(items, _name);
		log('debug', 'is("%s") -> %j', _name, result);
		return result;
	};

	// get alias record (name, run, ...)
	self.get = function(_name){
		var result = aliasGet(items, _name);
		log('debug', 'get("%s") -> %j', _name, result);
		return result;
	};

	// get alias record index
	self.index = function(_name){
		var result = aliasIndex(items, _name);
		log('debug', 'getIndex("%s") -> %j', _name, result);
		return result;
	};

	// run alias by name with given arguments
	self.run = function(_name, _arguments){
		log('debug', 'run("%s", %j)', _name, _arguments);
		var result = aliasRun(items, _name, _arguments);
		log('debug', 'run("%s") -> %j', _name, result);
		return result;
	};

	// set alias record (name, run, ...)
	self.set = function(_alias){
		var result = aliasSet(items, _alias);
		if(result==undefined) log('error', 'set(%j): not object', _alias);
		else if(result===false) log('error', 'set(%j): name/run wrong', _alias);
		else if(result===true) log('debug', 'set(%j) -> done', _alias);
		else log('warning', 'set(%j) -> overload', _alias);
		return (result===true) || of(result, 'number');
	};
	// unset alias by name
	self.unset = function(_name){
		if(!aliasUnset(items, _name)){
			log('warning', 'unset("%s"): unknown alias', _name);
			return false;
		}
		else{
			log('debug', 'unset("%s")', _name);
			return true;
		}
	};
};

var aliasExists = function(_items, _name){
	return _items.some(function(item){
		return item.name==_name;
	});
};

var aliasGet = function(_items, _name){
	return _items.find(function(item){
		return item.name==_name;
	});
};

var aliasIndex = function(_items, _name){
	return _items.findIndex(function(item){
		return item.name==_name;
	});
};

var aliasRun = function(_items, _name, _arguments){
	var item = aliasGet(_items, _name);
	return item ? item.run(_arguments) : undefined;
};

var aliasSet = function(_items, _alias){
	if(!of(_alias, 'object')) return undefined;
	else if(!of(_alias.name, 'string') || !of(_alias.run, 'function')) return false;
	else if(aliasExists(_items, _alias.name)){
		var index = aliasIndex(_items, _alias.name);
		_items[index] = _alias;
		return index;
	}
	else{
		_items.push(_alias);
		return true;
	}
};

var aliasUnset = function(_items, _name){
	var index = aliasIndex(_items, _name);
	if(index<0) return false;
	_items[index] = undefined;
	delete _items[index];
	return true;
};
