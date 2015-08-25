if(!Array.prototype.getUniqueNodes){
	Array.prototype.getUniqueNodes = function(){
		var u = {}, a = [];
		for(var i = 0, l = this.length; i < l; ++i){
			if(u.hasOwnProperty(this[i].id)) {
				continue;
			}
			a.push(this[i]);
			u[this[i].id] = 1;
		}
		return a;
	};
}
