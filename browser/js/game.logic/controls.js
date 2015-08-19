define([], function () {

	var setControls = function (interface){
		var controls = {
			//select source node
			102: function(){
				interface.state = 'selectSrc'
				console.log('selecting')
			},
			//cycle functions
			//a
			97: function(){
				interface.state = 'attackNode'
				console.log('attacking')
			},
			//d
			100: function(){
				interface.state = 'reinforceNode'
				console.log('reinforcing')
			},

			//cycle threads
			//w
			119: function(){
				var thread = interface.currentThread
				var length = thread.length
				var num = parseInt(thread[length-1])
				if(++num > interface.threads){
					num = 1
				}
				interface.currentThread = "thread" + num
				console.log('switch to ' + interface.currentThread)
			},
			//s
			115: function(){
				var thread = interface.currentThread
				var length = thread.length
				var num = parseInt(thread[length-1])
				if(--num < 1){
					num = interface.threads
				}
				interface.currentThread = "thread" + num
				console.log('switch to ' + interface.currentThread)
			},

			//num switch threads
			//1
			49: function(){
				interface.currentThread = "thread1"
				console.log('switch to ' + interface.currentThread)
			},

			//2
			50: function(){
				interface.currentThread = "thread2"
				console.log('switch to ' + interface.currentThread)
			},

			//3
			// 51:,

			//center to home
			//space
			// 32:,

			//toggle move base
			//t
			116: function(){
				interface.state = 'moveBase'
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
	
	return setControls;
});