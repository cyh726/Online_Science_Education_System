var answer = 332;
var dot_data = [[2,4,18,1,1],
				[6,9,12,0,0],
				[4,3,0,0,1],
				[8,5,0,0,1],
				[3,8,20,0,1],
				[13,4,10,0,1],
				[13,5,0,0,0],
				[9,8,0,1,0],]
		
var line_data= [[0,4],
				[1,4],
				[1,0],
				[3,1],
				[3,0],
				[7,6],
				[0,3],
				[0,2],
				[2,3],
				[2,5],
				[6,5],
				[1,7],
				[5,7],
				[5,3]];	
var level=3;
var diff='簡單';
var task=[{mode:1,name:"送回消息", str:"幫忙把送回去的文件加密。\n任務1：\n首先要讓每個節點數字，加起來等於332。\n(小提示：點擊原點可修改樹葉的值，寫好了再按右方答案確定唷~)"},
		{mode:2,name:"加密消息", str:"幫忙把送回去的文件加密。\n任務2：再把所有節點和相鄰的加在一起。\n(小提示：點擊原點可修改樹葉的值，寫好了再按右方答案確定唷~)"}];

var next_page = "easy_level3_e.html";
var fail_page = "easy_lose.html";