var fs = require("fs");
var cwd = process.cwd();
var uidfile = cwd + "/app/script/uids";


var _uids = fs.readFileSync(uidfile).toString().split("\n");

module.exports = function(offset){
	return _uids[offset];
}
/*
module.exports = (function(){
		var _uids = fs.readFileSync(uidfile).toString().split("\n");
		
		return function(){
			return _uids;
			};
		})();
*/
