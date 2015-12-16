
var pf = require('util').format;
var logger = require('zanner-logger')('aliasManager');
var alias = require('./alias');

var aliasManager = module.exports = function(_log){
	var self = this;
	var items = self._items = [];

	var log = function(){
		(_log ? _log : logger.log).apply(self, arguments);
	};

	// check if there is an alias
	self.is = function(_name){
		var promise = new Promise(function(resolve, reject){
			if(alias.exists(items, _name)){
				log('debug', 'is("%s") -> true', _name);
				resolve();
			}
			else{
				log('debug', 'is("%s") -> catch', _name);
				reject();
			}
		});
		return promise;
	};

	// get alias record (name, run, ...)
	self.get = function(_name){
		var promise = new Promise(function(resolve, reject){
			var item = alias.get(items, _name);
			if(item===undefined){
				log('debug', 'get("%s") -> catch', _name);
				reject();
			}
			else{
				log('debug', 'get("%s") -> %j', _name, item);
				resolve(item);
			}
		});
		return promise;
	};

	// get alias record index
	self.index = function(_name){
		var promise = new Promise(function(resolve, reject){
			var idx = alias.index(items, _name);
			if(idx===-1){
				log('debug', 'getIndex("%s") -> catch', _name);
				reject();
			}
			else{
				log('debug', 'getIndex("%s") -> %j', _name, index);
				resolve(index);
			}
		});
		return promise;
	};

	// run alias by name with given arguments
	self.run = function(_name, _arguments){
		var promise = new Promise(function(resolve, reject){
			log('debug', 'run("%s", %j)', _name, _arguments);
			alias.run(items, _name, _arguments)
				.then(function(result){
					log('debug', 'run("%s") -> %j', _name, result);
					resolve(result);
				})
				.catch(function(){
					log('debug', 'run("%s") -> catch', _name);
					reject();
				});
		});
		return promise;
	};

	// set alias record (name, run, ...)
	self.set = function(_alias){
		var promise = new Promise(function(resolve, reject){
			alias.set(items, _alias)
				.then(function(result){
					var index = result[0], overload = result[1];
					overload ? log('warning', 'set(%j) -> overload', _alias) : log('debug', 'set(%j) -> done', _alias);
					resolve(index);
				})
				.catch(function(error){
					log('error', 'set(%j): %s', _alias, error);
					reject(error);
				});
		});
		return promise;
	};

	// unset alias by name
	self.unset = function(_name){
		var promise = new Promise(function(resolve, reject){
			alias.unset(items, _name)
				.then(function(result){
					var index = result[0];
					items = self._items = result[1];
					log('debug', 'unset("%s") -> ', _name, index);
					resolve(index);
				})
				.catch(function(){
					log('warning', 'unset("%s"): unknown alias', _name);
					reject();
				});
		});
		return promise;
	};
};

aliasManager.prototype.inspect = function(depth){
	var items = this._items;
	items = items.map(function(item){
		return item.name;
	});
	return pf('aliasManager(%j)', items);
};
