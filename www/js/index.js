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
		// $("#"+game.opts[i]).removeClass("checked");
	}
	f.addClass(level,"checked");

	//$("#"+level).addClass("checked");
}

game.initialized = false
game.init = function(){
	if(game.initialized){return;}
	game.initialized = true;
	/* Initialize home page with level selection */
	var initElement =  document.getElementById("init");
	var optElement = document.getElementById("options");

	initElement.setAttribute('style', 'display:none;');
	optElement.setAttribute('style', 'display:block;');
		
	
	for(var i = 0; i < game.opts.length; i++){
//		$("#"+game.opts[i]).on("click",function(){
		var el = f.elById(game.opts[i]);
		f.addEvent(el,"click",function(){
			game.chooseLevel(this.id);
		});
	}

	/* Initialize start button */
	// $("#start").on("click",game.start);
	f.addEvent(f.elById("start"),"click",game.start);
	
	/* Initialize End button */
	//$("#end").on("click",game.end);
	f.addEvent(f.elById("end"),"click",game.end);


	/* Initialize Trigger */
	// $("#trigger").on("click",game.getLetter);
	f.addEvent(f.elById("trigger"),"click",game.getLetter);

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
game.pro = {"list":["always","animal","around","because","before","believe","between","bread","bright","busy","cannot","caught","charge","clapped","clean","chicken","children","doctor","does","goes","everyone","everywhere","flight","inside","juice","kitchen","laughter","lunchroom","nobody","once","orange","outside","piece","purple","raise","round","shoes","today","used","weak","week","whale","which","while","wool","yesterday"]};

game.el = document.getElementById("d");
	
game.getNum = function(min,max){
	if(min === max){return min;}
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

game.getLetter = function(){
	
	// if($("#trigger").hasClass("pull_trigger")){
	if(f.hasClass("trigger","pull_trigger")){
		return;
	}

	// spin and deactivate trigger
	f.addClass("trigger","pull_trigger");

	game.el.innerHTML = '';
	var x = game.getNum(0,game[game.level].list.length-1);
	var a = game[game.level].list[x];
	
	if(a.length == 1){
		var y = game.getNum(0,game.colors.length-1);
		var z = game.getNum(6,15); // fint size in em

		game.el.innerHTML += '<span class="letter" style="color:'+game.colors[y]+';font-size:'+z+'em;">'+a+'</span>';

		// unspin and activate trigger again
		// long enough time that kids actually look at letter!
		setTimeout(function(){f.removeClass("trigger","pull_trigger");},2000);
	} else {
		var x,y,z;
		var j = 0;
		var w1 = 12;
		var w2 = 12;
		/*
			if(game.level == "pro"){
				w1 = 6;
				w2 = 15;
			} else if(game.level == "hard") {
				w1 = 9;
				w2 = 12;
			} else  if(game.level == "medium") {
				w1 = 10;
				w2 = 11;
			}
		*/

		// scale sizes to fit window
		// var em = f.elById("#em").width(); // in px
		var el = f.elById("em");
		el.style.display="inline-block";
		var em = el.offsetWidth;
		el.style.display="none";

		// var w = $(window).width();
		var w = window.offsetWidth;


		// not wide enough?
		if(em*w2*a.length < w){
			var ratio = w/(em*w2*a.length);
			w1 = w1*ratio;
			w2 = w2*ratio;
		}
		// too wide?
		if(em*w2*a.length > w){
			var ratio = w/(em*w2*a.length);
			w1 = w1*ratio;
			w2 = w2*ratio;
		}
		// too tall?
		if(w2 > 26){
			var ratio = 26/w2;
			w1 = w1*ratio;
			w2 = 26;
		}

		for(var i = 0; i < a.length; i++){
			setTimeout(function(){
			y = game.getNum(0,4);
			z = game.getNum(w1,w2);
			x = a.charAt(j);
			if(j == 0){ x = x.toUpperCase(); }
			j++;

			game.el.innerHTML += '<span class="'+game.colors[y]+'" style="font-size:'+z+'em;">'+x+'</span>';;
			},i*100);
		}
		//var t = i*100;
		var t = 5000;
		setTimeout(function(){f.removeClass("trigger", "pull_trigger");/* console.log(f.elById("d").offsetWidth+" word length") */},t);
	}
}
/*
document.addEventListener("deviceready", game.init, false);
window.addEventListener("load", game.init, false);
*/
game.init();

document.addEventListener("deviceready", function(){alert("device ready");}, false);