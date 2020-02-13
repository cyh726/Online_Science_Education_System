var answer = 100;
var dot_data = [[1,1,2,0,1],
				[2,7,7,1,0],
				[3,4,0,0,1],
				[5,2,0,0,1],
				[6,3,9,0,1],
				[6,7,1,0,1],
				[7,1,2,1,0],
				[8,4,3,0,0]];
var line_data= [[0,1],
				[1,2],
				[1,5],
				[3,6],
				[4,6],
				[7,6],
				[0,3],
				[0,2],
				[2,3],
				[2,5],
				[3,4],
				[2,7],
				[4,7],
				[5,7]];	
var level=1;
var diff='簡單';
var task=[{mode:1,name:"Task 1", str:"幫忙加密藏匿地點的數字\n\n任務1：\n讓每個節點數字，加起來等於100。"},
		{mode:2,name:"Task 2", str:"test"}];

var next_page = "adv_level2_s.html";
var fail_page = "adv_lose.html";