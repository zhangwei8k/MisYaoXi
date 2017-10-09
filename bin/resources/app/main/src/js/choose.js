
var choosed = $("#Question ul li");

function choosehide(){
		var ALLCHOOSE= $("#Question ul li.D");	
		if(!Data.newbase[Data.k]["D"]){
			ALLCHOOSE.hide();
		}else{
			ALLCHOOSE.show();
		}
		
		var ALLCHOOSE_C= $("#Question ul li.C");	
		if(!Data.newbase[Data.k]["C"]){
			ALLCHOOSE_C.hide();
		}else{
			ALLCHOOSE_C.show();
		}
}

choosed.each(function(){
		var _this = $(this);
		_this.click(function(){
			var i = _this.data("i");
			if( i == Data.newbase[Data.k]["ans"]){
				Data.grade = Data.grade+10; //成绩改动
				$("#Mistake .score").html(Data.grade);
				console.log(Data.grade);
			}else{
				Data.mistake.push(Data.newbase[Data.k]["D"]);
				console.log(Data.mistake);
				Data.mistakechoose.push(i);
				Data.rightchoose.push(Data.newbase[Data.k]["ans"])
				console.log(Data.mistakechoose);
				console.log(Data.rightchoose);
				
				var cc = {
					A:"",
					B:"",
					C:"",
					D:""
				};
				cc[Data.newbase[Data.k]["ans"]] = "right";
				cc[i] = "err";
				
				if(Data.newbase[Data.k]["C"]==""){
					cc.C = "space";
				}
				if(Data.newbase[Data.k]["D"]==""){
					cc.D = "space";
				}
				
				
				$("#Mistake .misright .swiper-wrapper").append(
							'<div class="swiper-slide"><div class="item"><div class="title">'
							+Data.newbase[Data.k]["title"]
							+'</div><div class="clist">'
							+'<ul><li class="A '+cc.A+'" data-i="A">'
							+Data.newbase[Data.k]["A"]
							+'</li><li class="B '+cc.B+'" data-i="B">'
							+Data.newbase[Data.k]["B"]
							+'</li><li class="C '+cc.C+'" data-i="C">'
							+Data.newbase[Data.k]["C"]
							+'</li><li class="D '+cc.D+'" data-i="D">'
							+Data.newbase[Data.k]["D"]
							+'</li></ul></div></div></div>'		      
				);
			};
		})	
});

