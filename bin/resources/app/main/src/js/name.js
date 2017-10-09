
send_name = $("#Input_name .start");
data_name = $("#Input_name .data_name");
send_name.click(function(){
	Data.infor_name = data_name.val();
	if(!Data.infor_name){
		$("#Input_name .input_tip").html("提示：请先输入姓名后点击确认按钮");
		setTimeout(function(){
			$("#Input_name .input_tip").html("");
		},3000)
	}else{
		Data_names.push(Data.infor_name);
		Action.inputname();
	}
})
