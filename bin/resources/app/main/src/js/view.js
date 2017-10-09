///// Views 模板生成 /////
ViewSize();

Views.index = function(){
	Data.ranking = [];
	Data.newbase = [];
	Data.choose = 10;
	Data.mistake = [];
	Data.mistakechoose = [];
	Data.rightchoose = [];
	Data.grade = 0;
	Data_names =[];
	data_name.val("");
	Data.allbase = Base.subject;
	Data.ranking = Base.ans;
	var base = Base.subject.concat();
	var baselength = base.length;
	for(i=0; i<Data.choose; i++){	
		baselength--;
		var th = Math.floor(Math.random()*baselength);	
		Data.newbase.push(base[th]);
		base.splice(th,1);
	};
	
	Data.k = 0;
	var que_title = $("#Question .title");
	var que_choose = $("#Question ul li");
	var tip = $("#Question .tip");
	que_title.html(Data.newbase[Data.k]["title"]);	
	
	que_choose.each(function(){
		var _this = $(this);
		var i = _this.data("i");
		_this.html(Data.newbase[Data.k][i])		
	});
	
	Action.ranking();
	
	tip.html("第1题/共"+Data.choose+"题");
	choosehide();
	
   
	$.get("http://localhost:3000/getIP",function(ip){
		var newip = ip ;
		$("#Index").append(
		'<div class="newip">'+newip	
		+':3000/login'+'</div>'
	);
	})
	

}

	