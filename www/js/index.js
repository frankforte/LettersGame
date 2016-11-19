/* Letters Game. Copyright 2015 Frank Forte. All rights reserved. */
/* Helpers */
var f = {};
f.elById = function(e){
	return typeof(e) == "string" ? document.getElementById(e) : e;
}
f.hasClass = function(el,c){
	el = f.elById(el);
	return typeof(el.className) != "undefined" ? el.className.match(new RegExp(" ?\\b"+c+"\\b")) : false;
}
f.addClass = function(el,c){
	el = f.elById(el);
	el.className = ( el.className ? el.className + " " + c : c);
}
f.removeClass = function(el,c){
	el = f.elById(el);
	if(el.className){
	el.className = el.className.replace(new RegExp(" ?\\b"+c+"\\b"),'');
	}
}
f.addEvent = function(elem, event, fn) {
    if (elem.addEventListener) {
        elem.addEventListener(event, fn, false);
    } else {
        elem.attachEvent("on" + event, function() {
            // set the this pointer same as addEventListener when fn is called
            return(fn.call(elem, window.event));   
        });
    }
}

/** game properties and methods **/
var game = {};
game.opts = ["easy","medium","hard","pro"];
game.level = "easy"; /* default */
game.pages = {};
game.pages.init = document.getElementById("init");
game.pages.home = document.getElementById("home");
game.pages.gameboard = document.getElementById("gameboard");
game.showPage = function(p){
	for(var i in game.pages){
		game.pages[i].style.display="none";
	}
	game.pages[p].style.display="block";
};
game.chooseLevel = function(level){
	game.level = level;
	for(var i = 0; i < game.opts.length; i++){
		f.removeClass(game.opts[i],"checked");
	}
	f.addClass(level,"checked");
}

game.initialized = false
game.init = function(){
	if(game.initialized){return;}
	game.initialized = true;
	/* Remove loading message */
	game.getLetter("Letters Game");
	game.pages.init.style="display:none;";
	
	for(var i = 0; i < game.opts.length; i++){
		var el = f.elById(game.opts[i]);
		f.addEvent(el,"click",function(){
			game.chooseLevel(this.id);
		});
	}

	/* Initialize start button */
	f.addEvent(f.elById("start"),"click",game.start);
	
	/* Initialize End button */
	f.addEvent(f.elById("end"),"click",game.end);


	/* Initialize Trigger */
	f.addEvent(f.elById("trigger"),"mousedown",game.getLetter);
	f.addEvent(f.elById("trigger"),"touchstart",game.getLetter);

}

game.start = function(){
	game.showPage("gameboard");
}
game.end = function(){
	game.showPage("home");
	game.el.innerHTML = "";
}


game.range = function(start,stop) {
  var result=[];
  for (var idx=start.charCodeAt(0),end=stop.charCodeAt(0); idx <=end; ++idx){
    result.push(String.fromCharCode(idx));
  }
  return result;
};


// game.colors = ["#CC0000","#009900","#6666FF","DDDD00","#CC66FF","#990000"];
game.colors = ["c1","c2","c3","c4","c5","c6"];
game.bgcolors = ["#CC3333","#66FF33","#0000FF","FFFF00","#6600CC"];

game.easy = {"list":game.range("a","z")};
game.medium = {"list":["add","after","again","any","apple","arm","banana","bark","been","being","bent","best","bone","black","block","blue","bring","brown","bush","came","cane","card","cart","case","chain","chair","chalk","chat","chin","chop","clam","clan","clap","claw","clay","clean","cool","dark","desk","drop","end","family","fang","fast","fell","few","fill","flag","flat","fool","foot","fort","free","fresh","from","glad","golf","gone","grit","hand","hang","happy","harm","help","here","hide","hill","hint","hope","horn","how","ill","into","jaw","joke","just","keep","king","last","line","look","luck","made","many","meal","must","nice","new","next","odd","put","quit","rang","space","said","time","was","yard","yarn"]};
game.hard = {"list":["baseball","brother","can't","clover","cloud","crayon","club","coat","come","cookie","could","crow","cube","cupcake","deal","dew","didn't","dime","dine","dirt","doll","don't","door","draw","dream","dress","drink","dull","each","east","easy","eight","eleven","every","father","field","fine","first","flew","flower","friend","globe","going","grape","grass","grew","heavy","I'm","it's","know","marker","maybe","milk","morning","mother","myself","much","never","notebook","other","over","paper","pencil","pretty","rabbit","school","seven","sew","shirt","sister","smell","stray","string","summer","start","swing","table","thank","thrift","twelve","twist","under","very","water","were","where","won't","yellow","zebra","zero"]};
game.pro = {"list":["always","animal","around","because","before","believe","between","bread","bright","busy","cannot","caught","charge","clapped","clean","chicken","children","doctor","does","goes","everyone","everywhere","flight","galaxy","inside","juice","kitchen","laughter","lunchroom","nobody","once","orange","outside","piece","purple","raise","round","shoes","today","used","weak","week","whale","which","while","wool","yesterday"]};

game.h1 = document.getElementById("h1");
game.el = document.getElementById("d");

game.getNum = function(min,max){
	if(min === max){return min;}
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

game.getLetter = function(name){
	
	/* prevent double submission */
	if(f.hasClass("trigger","pull_trigger")){
		return;
	}

	/* spin and deactivate trigger */
	f.addClass("trigger","pull_trigger");


	/* check for supplied string */
	if(typeof(name) != "string"){
		var name = false
	}

	var devicePixelRatio = window.devicePixelRatio || 1;
	
	/* height and width of 1em */
	var el = f.elById("em");
	el.style.display="inline-block";
	var em = el.offsetWidth;
	var emh = el.offsetHeight;
	el.style.display="none";

	/* Letter Container */
	var letterbox = f.elById("letters");
	
	/* width and height of container */
	var maxw = letterbox.offsetWidth - 10;	
	var maxh = letterbox.offsetHeight - 16;

	var targ = (name ? "h1" : "el" );
	game[targ].innerHTML = '';

	/* Choose string to display */
	if(!name){
		var x = game.getNum(0,game[game.level].list.length-1);
		var a = game[game.level].list[x];
	} else {
		a = name
	}

	var x,y,z;
	var j = 0;
	var w1 = em; /* px */
	var w2 = em;
	

	// scale word to fit window
/*
	var lenw = w2*a.length;
	
	// too wide?
	if(lenw > w){
		var ratio = w/lenw;
		w1 = w1*ratio;
		w2 = w2*ratio;
	}
	// not wide enough?
	if(lenw < w){
		var ratio = w/lenw;
		w1 = w1*ratio;
		w2 = w2*ratio;
	}
	// too tall?
	var maxh = 300*lenw;
	if(w2 > maxh){
		var ratio = maxh/w2;
		w1 = w1*ratio;
		w2 = maxh;
	}
*/

	/* fit witdth first */
	var lw = em*a.length; /* width of all letters */
console.log("maxw: "+ maxw);
console.log("letters width "+a.length+" * "+em+": "+lw);

//	if(lw > maxw){
		scale = maxw / lw; 
		/* shrink to fit */ 
//	} else {
//		scale = lw / maxw;
		/* grow to fit */
//	}

console.log("scale"+ scale);

	// new width per letter
	z = em * scale;
console.log("font width: "+z);
console.log("em width: "+em);
console.log("em height: "+emh);
	// convert to font size, which is based on height

	z = Math.round( z * emh / em, 0 );
	console.log("font height"+ z);

	// scale to pixel ratio for high res screens?
	/* z = Math.round( z*devicePixelRatio, 0 ); */

	/* fit to height */
	if(z > maxh){ z = maxh; };
console.log("max font height"+ maxh);

	game[targ].style="font-size: "+z+"px";
	game[targ].style.fontSize= z+"px;";
	
	var n = document.createTextNode(' ');
	game[targ].appendChild(n);
	setTimeout(function(){n.parentNode.removeChild(n)}, 1);


	game[targ].style.display="none";
	game[targ].style.display="block";
	console.log(game[targ]);
	for(var i = 0; i < a.length; i++){
		setTimeout(function(){

		y = game.getNum(0,4); /* color */
		/*
		z = game.getNum(w1,w2);
		if(devicePixelRatio > 1){
			z = z*devicePixelRatio*3;
		}
		z = Math.round(z,0);
		*/
		x = a.charAt(j); /* letter */
 x = 'w';
		if(j == 0){ x = x.toUpperCase(); }
		j++;

		game[targ].innerHTML += '<span class="'+game.colors[y]+'" >'+x+'</span>';
		},i*100);
	}
	
	var t = (name ? 0 : i*1000);
	setTimeout(function(){
		f.removeClass("trigger", "pull_trigger");
	},t);
}


function init(){
	if(window.MobileAccessibility){
	window.MobileAccessibility.usePreferredTextZoom(false);
	}

	document.addEventListener("deviceready", game.init, false);
	game.init();
}
window.onload = init;

function effectiveDeviceWidth() {
    var deviceWidth = window.orientation == 0 ? window.screen.width : window.screen.height;
    if (navigator.userAgent.indexOf('Android') >= 0 && window.devicePixelRatio) {
        deviceWidth = deviceWidth / window.devicePixelRatio;
    }
    return deviceWidth;
}
