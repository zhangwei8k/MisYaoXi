///////////////////////////////////// Room ///////////////////////////////////////////

////房间规范
// (Room)go房间离开，come房间进来，ppt同步离开和进来
// (Room)hide暂时隐藏，会关闭run程序（stop程序）; show开始显示，会运行run程序
// (Rooms)come_before:进来前，coming：进来时，come_after:进来后；go_before：离开前，going：离开时,go_after：离开后;
// (Rooms)ppt同步后的循序 1.come_before , 2.go_before , 3.going , 4.coming , 5.come_after , 6.go_after
// (Rooms)run运行的程序，stop停止的程序
// (Rooms)act点击等事件，io事件


///////////////////////////////////// rooms ///////////////////////////////////////////

////Index
Rooms.Index = {};
Rooms.Index.dom = function(){
	Dom.Index = {};
    Dom.Index.cls = $("#Index .cls");
    Dom.Index.cls_is=0;
	Dom.Index.start = $("#Index .start");
	Dom.Index.rank = $("#Index .rank");
	Dom.Index.video = new Media("#Index .video video");

    Dom.Index.sound = $("#Index .sound");
    Dom.Index.song = $("#Index .song");
    Dom.Index.man = $("#Index .man");
    Dom.Index.women = $("#Index .women");
    Dom.Index.Vol_man = new Media("#Index #Vol_man");
    Dom.Index.Vol_women = new Media("#Index #Vol_women");
};
Rooms.Index.act = function(){
	Dom.Index.start.click(function(){
		Action.start();
	});
	Dom.Index.rank.click(function(){
		Action.rank();
	});
    Dom.Index.sound.click(function(){
        if(!Lock.btn("sound",2)) return;
        cc.mov({id:Dom.Index.sound, mov:"fadeOutRight",hide:true});
        setTimeout(function(){
            cc.mov({id:Dom.Index.man, mov:"fadeInRight"});
            cc.mov({id:Dom.Index.women, mov:"fadeInRight",wait:200});
        },200);
        Dom.Index.cls_is=1;
    });
    Dom.Index.cls.click(function(){
        if(!Lock.btn("body",2)) return;
        if(Dom.Index.cls_is==1){
            Dom.Index.song.removeClass("act");
            cc.mov({id:Dom.Index.women, mov:"fadeOutRight",hide:true});
            cc.mov({id:Dom.Index.man, mov:"fadeOutRight",hide:true,wait:200});
            setTimeout(function(){
                cc.mov({id:Dom.Index.sound, mov:"fadeInRight"});
            },200);
            Dom.Index.Vol_man.pause();
            Dom.Index.Vol_women.pause();
            Dom.Index.cls_is=0;
        }
    });
    Dom.Index.man.click(function(){
        if(!Lock.btn("song",1)) return;
        if(Dom.Index.man.hasClass("act")){
            Dom.Index.Vol_man.pause();
            Dom.Index.song.removeClass("act");
           // $(this).removeClass("act");
            return;
        }
        Dom.Index.song.removeClass("act");
        $(this).addClass("act");
        Action.Mov_play("man");
    });
    Dom.Index.women.click(function(){
        if(!Lock.btn("song",1)) return;
        if(Dom.Index.women.hasClass("act")){
            Dom.Index.Vol_women.pause();
            // $(this).removeClass("act");
            Dom.Index.song.removeClass("act");
            return;
        }
        Dom.Index.song.removeClass("act");
        $(this).addClass("act");
        Action.Mov_play("women");
    });
};
Rooms.Index.come_before = function(next){
	Dom.Index.video.play(0);
	 if(next) next();
}

Rooms.Input_name = {};
Rooms.Input_name.dom = function(){
	Dom.Input_name = {};
    Dom.Input_name.start = $("#Input_name .start");
    Dom.Input_name.cls = $("#Input_name .cls");

};
Rooms.Input_name.act = function(){

    Dom.Input_name.cls.click(function(){
        Action.home();
    });
};

Rooms.Question = {};
Rooms.Question.dom = function(){
	Dom.Question = {};
	Dom.Question.back = $("#Question .back");
	Dom.Question.box = $("#Question .box");
	Dom.Question.cover_box = $("#Question .cover_box");
	Dom.Question.continues = $("#Question .continue");
	Dom.Question.home = $("#Question .home");
	Dom.Question.title = $("#Question .title");
	Dom.Question.choose = $("#Question ul li");
	Dom.Question.tip = $("#Question .tip");

};
Rooms.Question.act = function(){
	Dom.Question.back.click(function(){
		Dom.Question.box.addClass("act");
		Dom.Question.cover_box.addClass("act");
		
	});
	Dom.Question.continues.click(function(){
		Dom.Question.box.removeClass("act");
		Dom.Question.cover_box.removeClass("act");
	});
	Dom.Question.home.click(function(){
		Action.home();
		Views.index();
		setTimeout(function(){
			Dom.Question.box.removeClass("act");
			Dom.Question.cover_box.removeClass("act");
		},1000)
	})
	Dom.Question.choose.click(function(){
		Data.k++;
		Data.ki=Data.k+1;
		if(Data.k==Data.choose){
			Action.finish();
			TIMESLY = setTimeout(function(){
				Action.mistake();
				Action.ajaxty();
				Action.ranking();
					setTimeout(function(){
					$("#Mistake .misleft").addClass("act");
					$("#Mistake .misright").addClass("act");
				})
				

			},5000);
			Data.ki = Data.k;			
		}

		
		if(Data.k<Data.choose){
			Dom.Question.tip.html("第"+Data.ki+"题/共"+Data.choose+"题");
			Dom.Question.title.html(Data.newbase[Data.k]["title"]);	
			choosehide();
			Dom.Question.choose.each(function(){
				var _this = $(this);
				var i = _this.data("i");
				_this.html(Data.newbase[Data.k][i])		
			});			
		
			$("#_unable").show();
			setTimeout(function(){
				$("#_unable").hide();
			},500)			
		}

	})
};

Rooms.Ranklist = {};
Rooms.Ranklist.dom = function(){
	Dom.Ranklist = {};
	Dom.Ranklist.back = $("#Ranklist .back");
	Dom.Ranklist.home = $("#Ranklist .home");
};
Rooms.Ranklist.act = function(){
	Dom.Ranklist.home.click(function(){
		Action.home();
		Views.index();
		setTimeout(function(){
			$("#Ranklist .back").css("display","none");
		},300);		
		$("#Mistake .misright .swiper-wrapper").html("");
	});
	Dom.Ranklist.back.click(function(){
		setTimeout(function(){
			$("#Ranklist .back").css("display","none");
		},300);	
		Action.mistake();
	})
};


Rooms.Finish = {};
Rooms.Finish.dom = function(){
	Dom.Finish = {};
	Dom.Finish.result = $("#Finish .result");
};
Rooms.Finish.act = function(){
	Dom.Finish.result.click(function(){
		Action.mistake();
		Action.ajaxty();
		Action.ranking();
		clearTimeout(TIMESLY);
		
		
		
	})
};


Rooms.Mistake = {};
Rooms.Mistake.dom = function(){
	Dom.Mistake = {};
	Dom.Mistake.ranking = $("#Mistake .ranking");
	Dom.Mistake.home = $("#Mistake .home");
	Dom.Mistake.restart = $("#Mistake .restart");
};
Rooms.Mistake.act = function(){
	Dom.Mistake.home.click(function(){
		Action.home();
		$("#Mistake .misleft").removeClass("act");
		$("#Mistake .misright").removeClass("act");
		Views.index();
		$("#Mistake .misright .swiper-wrapper").html("");
	})
	Dom.Mistake.restart.click(function(){
		$("#Ranklist .back").css("display","inline-block");
		$("#Mistake .misleft").removeClass("act");
		$("#Mistake .misright").removeClass("act");
		Action.rank();	
	})
	Dom.Mistake.ranking.click(function(){
		$("#Ranklist .back").css("display","inline-block");
		$("#Mistake .misleft").removeClass("act");
		$("#Mistake .misright").removeClass("act");
		Action.rank();	
	})
};
Rooms.Mistake.coming = function(){
	$("#Mistake .misleft").addClass("act");
	$("#Mistake .misright").addClass("act");
};
Rooms.Mistake.go_afert = function(){
	$("#Mistake .misleft").removeClass("act");
	$("#Mistake .misright").removeClass("act");
};