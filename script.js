// ==UserScript==
// @name          Quickcamp
// @namespace     http://sebadog.com/quickcamp
// @description	  Organize you projects, Quick!
// @include       http*://*.projectpath.com/*
// @include       http*://*.updatelog.com/*
// @include       http*://*.clientsection.com/*
// @include       http*://*.seework.com/*
// @include       http*://*.grouphub.com/*
// ==/UserScript==

$ = jQuery;

// Bindings for modes like "TODOs" etc
function CampMode() {}
CampMode.prototype = {
	init: function () {},
	initBindings: function () {
		$(window).keydown(
			jQuery.proxy(this.handleKeyPress, this)
		);
	},

	shouldBeActive: function () {
		return false;
	},

	handleKeyPress: function (event) {
		// Iterate over keybindings, find matching and execute it.
		var that = this;
		$.each(this.keyBindings, function (key, func) {
			eventIsKey(key, event) && func.call(that);
		});
	}
};

// Emacs like (kbd )-macro
function eventIsKey(key, event) {
	var ctrl = false, meta = false, upper = false;
	var keySplitted = key.split("-");

	while (keySplitted.length > 1) {
		ctrl |= (keySplitted[0] == 'M');
		meta |= (keySplitted[0] == 'M');
		keySplitted.shift();
	}
	upper = !!keySplitted[0].match(/[A-Z]/);
	key = keySplitted[0];

	return (ctrl == event.ctrlKey)
		&& (meta == event.altKey)
		&& (upper == event.shiftKey)
		&& (key.toUpperCase() == String.fromCharCode(event.keyCode));
}

function scrollTo(node) {
	var top = $(node).offset().top, height = $(node).outerHeight();
	var body = $('body');
	var scrollTop = body[0].scrollTop;
	var windowHeight = window.innerHeight;

	if (top < scrollTop) {
		body[0].scrollTop = top - 100;
	} else if (top + height > scrollTop + windowHeight) {
		body[0].scrollTop = top + height - windowHeight + 100;
	}
}

// A kind of static method.
CampMode.tabUrlMatch = function (tabUrl) {
	return function () {
		var splitted = document.location.pathname.split("/");
		return splitted.length >= 4 && splitted[3].match(tabUrl);
	}
};


TodoLists.prototype = new CampMode();
TodoLists.prototype.constructor = TodoLists;
function TodoLists(test) { this.asdf = test; }
TodoLists.prototype.shouldBeActive = CampMode.tabUrlMatch(new RegExp('^todo_lists$'));
TodoLists.prototype.init = function () {
	this.findLists();
	this.keyBindings = {
		'j': this.nextTodo,
		'k': this.prevTodo,
		'n': this.nextList,
		'p': this.prevList,
		'e': this.editTodo,
		'd': this.removeTodo,
		'm': this.messageTodo,
		'M-j': this.moveTodoDown,
		'M-k': this.moveTodoUp
	};
	this.activeTodo = 0;
	this.initBindings();
};

TodoLists.prototype.findLists = function () {
	this.lists = $('.widget_content.list').map(function () {
		var titleNode = $(this).find('.list_title');
		return {
			todos: $(this).find('.list_widget[id^=item_]'),
			title: titleNode.find('span a').text(),
			node: titleNode
		};
	});
};

TodoLists.prototype.nextTodo = function () {
	/**
	 *
	 * If there is an selected todo is visible:
	 *   jump to next, make sure it is also visible.
	 * Else
	 *   go to the first one that is (partially?) visible?
	 *
	 */
	if (this.selectedTodo) {
		this.unmarkAsSelected(this.selectedTodo);
	}

	if (this.selectedTodo && this.isInView(this.selectedTodo)) {
		this.selectedTodo = this.findNextTodo();
	} else {
		this.selectedTodo = this.findFirstVisibleTodo();
	}

	scrollTo(this.selectedTodo);
	this.markAsSelected(this.selectedTodo);
};

TodoLists.prototype.prevTodo = function () { console.log('stub'); };
TodoLists.prototype.nextList = function () { console.log('stub'); };
TodoLists.prototype.prevList = function () { console.log('stub'); };
TodoLists.prototype.editTodo = function () { console.log('stub'); };
TodoLists.prototype.removeTodo = function () { console.log('stub'); };
TodoLists.prototype.messageTodo = function () { console.log('stub'); };
TodoLists.prototype.moveTodoDown = function () { console.log('stub'); };
TodoLists.prototype.moveTodoUp = function () { console.log('stub'); };

TodoLists.prototype.findFirstVisibleTodo = function () {
	var that = this, firstVisible;
	this.eachTodo(function (todo) {
		if (that.isInView(todo)) {
			firstVisible = todo;
			return false;
		}
	});
	return firstVisible;
};

TodoLists.prototype.findNextTodo = function () {
	var that = this, takeNext = false, next = false;
	this.eachTodo(function (todo) {
		if (todo == that.selectedTodo) {
			takeNext = true;
		} else if (takeNext) {
			next = todo;
			return false;
		}
	});
	return next;
}

// TodoLists.prototype.allTodos = function () {
// 	var res = [];
// 	this.eachTodo(function (todo) {
// 		res.push(todo);
// 	});
// 	return res;
// };

TodoLists.prototype.eachTodo = function (iterator) {
	var ret;
	this.lists.each(function () {
		var list = this;
		this.todos.each(function () {
			ret = iterator(this, list);
			if (ret === false) return false;
		});
		if (ret === false) return false;
	});
};

TodoLists.prototype.markAsSelected = function (node) {
	$(node).addClass('arvid-quickcamp-selected');
};

TodoLists.prototype.unmarkAsSelected = function (node) {
	$(node).removeClass('arvid-quickcamp-selected');
};

TodoLists.prototype.isInView = function (node) {
	var offs = $(node).offset();
	var height = $(node).height();
	return offs.top >= window.scrollY
		&& offs.top + height <= window.scrollY + window.innerWidth;
};

(function($) {
	// Constants
	var glIsMain=false;
	window.addEventListener('keydown', keyHandler, false);

	var d1=ebi("Tabs");
	var d2=ebi("Header");

	var links = {
		79:{
			pObj: lookForTab(d1,"Overview","O"),
		},
		84:{
			pObj: lookForTab(d1,"To-Do","T") || lookForTab(d1,"To-Dos","T"),
		},
		73:{
			pObj: lookForTab(d1,"Milestones","i"),
		},
		77:{
			pObj: lookForTab(d1,"Messages","M"),
		},
		87:{
			pObj: lookForTab(d1,"Writeboards","W"),
		},
		80:{
			pObj: lookForTab(d1,"People","P"),
		},
		65:{
			pObj: lookForTab(d1,"Account","A"),
		},
		70:{
			pObj: lookForTab(d1,"Files","F"),
		},
		69:{
			pObj: lookForTab(d1,"Time","e"),
		},
		76:{
			pObj: lookForTab(d1,"Templates","l"),
		},
		83:{
			pObj: lookForTab(d1,"Search","S"),
		},
		68:{
			pObj: lookForTab(d1,"Dashboard","D")||lookForLink(d2,"Dashboard","D"),
		},
		71:{
			pObj: lookForTab(d1,"Settings","g")||lookForLink(d2,"Settings","g"),
		},
		78:{
			pObj: lookForLink(d2,"Permissions","n"),
		},
		72:{
			pObj: lookForLink(d2,"Help","H"),
		},
		67:{
			pObj: lookForLink(d2,"Choose a project","C"),
		}
	};

	// Init each mode that should be active.
	var modes = [ new TodoLists() ];
	$(modes).each(function () {
		this.shouldBeActive() && this.init();
	});

	function keyHandler(event) {
		if ( event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
			return false;
		}

		if (event.target && event.target.nodeName) {
			var targetNodeName = event.target.nodeName.toLowerCase();
			if (targetNodeName == "select" || targetNodeName == "textarea" ||
				(targetNodeName == "input" && event.target.type &&
				 event.target.type.toLowerCase() == "text")) {
				return false;
			}
		}
		if (event.keyCode in links) {
			if (event.keyCode==67) {
				ebi("P2P_selector").style.display="inline";
				ebi("P2P_link").style.display="none";
				ebi("projectSelector").focus();
			} else {
				if (links[event.keyCode].pObj){
					location.href=links[event.keyCode].pObj.href;
				}
			}
		}
		return false;
	}

})(jQuery);

function ebi(pId){
	return document.getElementById(pId);
}

function ebtn(pObj,pTag){
	return pObj.getElementsByTagName(pTag);
}

function underline(pObj,pUnderline) {
	var lText=pObj.innerHTML;
	var n=lText.indexOf(pUnderline);
	lNewText=lText.substring(0,n)+'<span style="text-decoration:underline!important">'+lText.substring(n,n+1)+'</span>'+lText.substring(n+1);
	pObj.innerHTML=lNewText;
}

function getLink(pObj){
	return pObj.href;
}

function mark(pObj,pUnderline) {
	var lText=pObj.innerHTML;
	var n=lText.indexOf(pUnderline);
	lNewText=lText.substring(0,n)+'<span style="background:#04143F!important;text-decoration:underline;">'+lText.substring(n,n+1)+'</span>'+lText.substring(n+1);
	pObj.innerHTML=lNewText;
}

function getLink(pObj){
	return pObj.href;
}

function nounderline(pObj){
	pObj.style.textDecoration="none";
}

function getElementsByAttribute(pObj,pAttr,pValue,pArr) {
	if (!pArr) {
		var pArr=new Array();
	}
	if (pObj) {
		if (pAttr=="innerHTML"){
			if (pObj.innerHTML==pValue){
				pArr[pArr.length]=pObj;
			}
		}else{
			if (pObj.getAttribute(pAttr)==pValue){
				pArr[pArr.length]=pObj;
			}
		}
		if (pObj.hasChildNodes) {
			for (var i=0;i<pObj.childNodes.length;i++){
				if (pObj.childNodes[i].nodeName!="#text") {
					pArr=getElementsByAttribute(pObj.childNodes[i],pAttr,pValue,pArr) ;
				}
			}
		}
	} else {
		return false;
	}
	return pArr;
}

function lookForTab(pObj,pStr,pShortcut){
	var lItems=getElementsByAttribute(pObj,"innerHTML",pStr);
	if (lItems.length>0) {
		underline(lItems[0],pShortcut);
		return lItems[0];
	} else {
		return false;
	}
}

function lookForLink(pObj,pStr,pShortcut){
	var lItems=getElementsByAttribute(pObj,"innerHTML",pStr);
	if (lItems.length>0) {
		mark(lItems[0],pShortcut);
		return lItems[0];
	} else {
		return false;
	}
}
