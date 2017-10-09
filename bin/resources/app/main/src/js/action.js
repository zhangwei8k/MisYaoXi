///////////////////////////////////// Action ///////////////////////////////////////////
//run 启动入口
Action.run = function(page, wait, fn){
    $("#Loader").css("visibility", "visible");
    var canvas, stage, exportRoot;
    function init() {
        // --- write your JS code here ---

        canvas = document.getElementById("canvas");
        exportRoot = new lib.sopo_logo();

        stage = new createjs.Stage(canvas);
        stage.addChild(exportRoot);
        stage.update();
        createjs.Ticker.setFPS(lib.properties.fps);
        createjs.Ticker.addEventListener("tick", stage);
        //exportRoot.stop();
        //exportRoot.gotoAndStop(20);
        setTimeout(function(){
            exportRoot.stop();
        },3000);
        /*setTimeout(function(){
         exportRoot.play();
         },1000)*/
        //createjs.Ticker.paused = true;
    }
    init();
    $("#canvas").addClass("scales");
    setTimeout(function(){
        Room.ppt({id:["Loader" , page] , mov:["mv-zoom-out" , "mv-fade-in"]}, function(){
            if(fn) fn();
        });
        $(".newsletter-popups").addClass("mfp-hide"); //弹出层隐藏.css("display","none")
    }, wait);
};

Action.start = function(next){
	 Room.ppt({id:[Room.id, "Input_name"] , mov:["fadeOut" , "fadeIn"]} , function(){
        if(next) next();
    });
};
Action.Mov_play = function(json){
    Dom.Index.Vol_man.pause();
    Dom.Index.Vol_women.pause();
    //Dom.Index["Vol_"+json].unloop();
    //Dom.Index["Vol_"+json].loop();
    Dom.Index["Vol_"+json].play(0);
};
Action.Mov_pause = function(json){
    Dom.Index.Vol.pause();
};
Action.inputname = function(next){
	 Room.ppt({id:[Room.id, "Question"] , mov:["fadeOut" , "fadeIn"]} , function(){
        if(next) next();
    });
};
Action.rank = function(next){
	 Room.ppt({id:[Room.id, "Ranklist"] , mov:["fadeOut" , "fadeIn"]} , function(){
        if(next) next();
    });
};

Action.home = function(next){
	 Room.ppt({id:[Room.id, "Index"] , mov:["fadeOut" , "fadeIn"]} , function(){
        if(next) next();
    });
};

Action.finish = function(next){
	 Room.ppt({id:[Room.id, "Finish"] , mov:["fadeOut" , "fadeIn"]} , function(){
        if(next) next();
    });
};

Action.mistake = function(next){
	 Room.ppt({id:[Room.id, "Mistake"] , mov:["fadeOut" , "fadeIn"]} , function(){
        if(next) next();
    });
};

Action.ajaxty = function(){
	 $.ajax({
			url: "http://localhost:3000/ans_add_op",
			type:"post",
			data:{
				"nm": Data_names[0],
				"score": Data.grade
			},
			dataType: 'json',
			cache: false,
			success: function (re) {
				if (re == "fail") {
					alert("更新失败！");
				}else{
					console.log(re);
				}
			}
		});
};
Action.ranking = function(){
	var html = "";
	html = '<li>';
	if(Data.ranking[0])	 html += Data.ranking[0]["nm"]+'<span>'+Data.ranking[0]["score"]+"</span>";
	html += '</li><li>';
	if(Data.ranking[1])	 html += Data.ranking[1]["nm"]+'<span>'+Data.ranking[1]["score"]+"</span>";
	html += '</li><li>';
	if(Data.ranking[2])	 html += Data.ranking[2]["nm"]+'<span>'+Data.ranking[2]["score"]+"</span>";
	html += '</li><li>';
	if(Data.ranking[3])	 html += Data.ranking[3]["nm"]+'<span>'+Data.ranking[3]["score"]+"</span>";
	html += '</li><li>';
	if(Data.ranking[4])	html += Data.ranking[4]["nm"]+'<span>'+Data.ranking[4]["score"]+"</span>";
	html += '</li><li>';
	if(Data.ranking[5])	html += Data.ranking[5]["nm"]+'<span>'+Data.ranking[5]["score"]+"</span>";
	html += '</li><li>';
	if(Data.ranking[6])	html += Data.ranking[6]["nm"]+'<span>'+Data.ranking[6]["score"]+"</span>";
	html += '</li><li>';
	if(Data.ranking[7])	html += Data.ranking[7]["nm"]+'<span>'+Data.ranking[7]["score"]+"</span>";
	html += '</li><li>';
	if(Data.ranking[8])	html += Data.ranking[8]["nm"]+'<span>'+Data.ranking[8]["score"]+"</span>";
	html += '</li><li>';
	if(Data.ranking[9])	html += Data.ranking[9]["nm"]+'<span>'+Data.ranking[9]["score"]+"</span>";
	html += '</li>';
	$("#Ranklist .name ul").html(html);
}
