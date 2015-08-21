var setControls = function (intface){
	var controls = {
		//select source node
		102: function(){
			intface.state = 'selectSrc'
			console.log('selecting')
		},
		//cycle functions
		//a
		97: function(){
			intface.state = 'attackNode'
			console.log('attacking')
		},
		//d
		100: function(){
			intface.state = 'reinforceNode'
			console.log('reinforcing')
		},

		//cycle threads
		//w
		119: function(){
			var thread = intface.currentThread
			var length = thread.length
			var num = parseInt(thread[length-1])
			if(++num > intface.threads){
				num = 1
			}
			intface.currentThread = "thread" + num
			console.log('switch to ' + intface.currentThread)
		},
		//s
		115: function(){
			var thread = intface.currentThread
			var length = thread.length
			var num = parseInt(thread[length-1])
			if(--num < 1){
				num = intface.threads
			}
			intface.currentThread = "thread" + num
			console.log('switch to ' + intface.currentThread)
		},

		//num switch threads
		//1
		49: function(){
			intface.currentThread = "thread1"
			console.log('switch to ' + intface.currentThread)
		},

		//2
		50: function(){
			intface.currentThread = "thread2"
			console.log('switch to ' + intface.currentThread)
		},

		//3
		// 51:,

		//center to home
		//space
		// 32:,

		//toggle move base
		//t
		116: function(){
			intface.state = 'moveBase'
			console.log('moving')
		},

		//default
		'default': function(){
			console.log('Not a valid control')
		}
	}
	document.addEventListener("keypress", function(e) {
		controls[e.keyCode]()
	});
}

module.exports = setControls;
