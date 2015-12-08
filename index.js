
var of = require('zanner-typeof').typeOf;
var logger = require('zanner-logger')('aliasManager');

var aliasManager = module.exports = function(_log){
	var self = this;
	var items = self._items = [];
	var log = function(){
		(_log ? _log : logger).log.apply(self, arguments);
	};

	// check if there is an alias
	self.is = function(name){
		var result = aliasExists(items, name);
		log('debug', 'is("%s") -> %j', name, result);
		return result;
	};

	// get alias record (name, run, ...)
	self.get = function(name){
		var result = aliasGet(items, name);
		log('debug', 'get("%s") -> %j', name, result);
		return result;
	};

	// get alias record index
	self.index = function(name){
		var result = aliasIndex(items, name);
		log('debug', 'getIndex("%s") -> %j', name, result);
		return result;
	};

	// run alias by name with given arguments
	self.run = function(name, args){
		log('debug', 'run("%s") with args: %j', name, args);
		var result = aliasRun(items, name, args);
		log('debug', 'run("%s") -> %j', name, result);
		return result;
	};

	// set alias record (name, run, ...)
	self.set = function(alias){
		var result = aliasSet(items, alias);
		if(result==undefined) log('error', 'set(%j)', alias);
		else if(result===false) log('error', 'set(%j): name/run wrong', alias);
		else if(result===true) log('debug', 'set(%j) -> %j', alias, result);
		else log('warning', 'set(%j) -> overload alias', alias);
		return result;
	};
	// unset alias by name
	self.unset = function(name){
		if(!aliasUnset(items, name)){
			log('warning', 'unset("%s"): unknown alias', name);
			return false;
		}
		else{
			log('debug', 'unset("%s")', name);
			return true;
		}
	};
};

var aliasExists = function(items, name){
	return items.some(function(v){
		return v.name==name;
	});
};

var aliasGet = function(items, name){
	return items.find(function(v){
		return v.name==name;
	});
};

var aliasIndex = function(items, name){
	return items.findIndex(function(v){
		return v.name==name;
	});
};

var aliasRun = function(items, name, args){
	var item = this._get(items, name);
	return item ? item.run(args) : undefined;
};

var aliasSet = function(items, alias){
	if(!of(alias, 'object')) return undefined;
	else if(!of(alias.name, 'string') || !of(alias.run, 'function')) return false;
	else if(this._is(items, alias.name)){
		var index = this._index(items, alias.name);
		items[index] = alias;
		return index;
	}
	else{
		items.push(alias);
		return true;
	}
};

var aliasUnset = function(items, name){
	var index = this._getIndex(items, name);
	if(index<0) return false;
	else{
		items[index] = undefined;
		delete items[index];
		return true;
	}
};
