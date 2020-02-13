	var canvas, ctx, canvas_b, ctx_b, canvas_f, ctx_f;
	var en_touch_dot = false, en_click_dot = false, en_modify_dot = false, 
		en_touch_button = false, en_click_button = false,
		en_pausebox = false, en_taskbox = false, en_inputbox = false,
		en_continue = false, en_modify_inputbox = false,
		en_sumbox = true,
		en_foreground = false;
	var grid_flag = true, num_flag = false, enter_flag = false;
	var unit, mode=1;
	var input = "";
	var task_text = [], now_task=0;
	var mouse_dot_x = -1, mouse_dot_y = -1, now_key = -1;
	var mode_data = [[0],[0.2],[0.4],[0.5]];
	var dot_list = new Array(), line_list = new Array(), button_list = new Array();
	var dot_class = {
		createNew: function(_x,_y,_value = "0",_isKey,_isAns_2){
			var dot = {};
			dot.x = _x;
			dot.y = _y;
			dot.value = "" + ((Number(_value) > 0) ? ""+_value : ""); // value用string儲存
			dot.state = ((dot.value.length < 1) ? "default" : "protected");
			dot.link = [];
			dot.sum = "";
			dot.isKey = (_isKey==0) ? false : true;
			dot.isAns_2 = (_isAns_2==0) ? false : true;
			return dot;
		}
	};
	var line_class = {
		createNew: function(_index0,_index1,_state = "default"){
			var line = {};
			line.index0 = _index0;
			line.index1 = _index1;
			line.state = _state;
			return line;
		}
	};
	var button_class = {
		createNew: function(_x,_y,_name,_state = "default",_size_x=1.3,_size_y=1.3){
			var button = {};
			button.x = _x;
			button.y = _y;
			button.size_x = _size_x;
			button.size_y = _size_y;
			button.name = _name;
			button.state = _state;
			return button;
		}
	};

	
	function game_setup(my_dot_data,my_line_data,my_canvas,my_canvas_b,my_width=600,my_height=600){
		/* 抓必要資料 */
		canvas = document.getElementById(my_canvas);
		canvas_b = document.getElementById(my_canvas_b);
		ctx = canvas.getContext('2d');
		ctx_b = canvas_b.getContext('2d');
		canvas.height = my_height;
		canvas.width = my_width;
		unit = canvas.width / 19;
		canvas_b.height = canvas.height;
		canvas_b.width = unit*2;
		/* push 點的資料 */
		my_dot_data.forEach(function(my){
			dot_list.push(dot_class.createNew(my[0],my[1],my[2],my[3],my[4]));
		});
		/* push 線的資料 */
		my_line_data.forEach(function(my){
			line_list.push(line_class.createNew(my[0],my[1]));
		});

		// 更新連結資料
		line_list.forEach(function(line){
			dot_list[line.index0].link.push(line.index1);
			dot_list[line.index1].link.push(line.index0);
		});
		/*push 文字的資料*/
		tasktext_update(task[now_task].str);

		
		console.log(task_text);

		/*push 按鈕的資料*/
		var button_data = [[1,1,'pause'],[1,2.3,'task'],[1,3.6,'restart'],[1,9,'答案確定'],[1,9,'繼續']];
		button_data.forEach(function(my){
			button_list.push(button_class.createNew(my[0],my[1],my[2]));
		});
		// event listener
		canvas.addEventListener("mousemove", canvas_mouse_event, false);
		canvas.addEventListener("click", click_event, false);
		canvas_b.addEventListener("mousemove", canvas_b_mouse_event, false);
		canvas_b.addEventListener("click", click_b_event, false);
		document.addEventListener("keydown", keydown_event, false); // 無法focus在canvas上
		// 整理資料
		update_mode();
		update();
	}


	function update(){
		// console.log("en_touch_dot",en_touch_dot);
		// 清空畫布
		ctx.clearRect(0,0,canvas.width,canvas.height);
		// 背景
		draw_background();
		// 顯示格線
		if(grid_flag) draw_grid();
		// 畫線、點
		line_list.forEach(function(my){
			draw_line(my.index0, my.index1);
		});
		dot_list.forEach(function(my){
			if(mode == 1){
				draw_circle(my.x, my.y, 0.2, my.state);
				if(enter_flag){
					// 計算總和
					var sum = Number(my.value);
					my.link.forEach(function(link_dot){
						sum += Number(dot_list[link_dot].value);
					});
					var state = (my.state == "mouseon")?"mouseon":"enter";
					draw_textbox(my.x, my.y, sum, state);
				}else if(my.state == "click" || my.state == "click_mouseon" || my.value.length > 0 ){
					draw_textbox(my.x, my.y, my.value, my.state);
				}
			}else if(mode == 2){
				draw_circlebox(my.x, my.y, my.state);
				draw_text(my.x, my.y, 'white', 0.9, 0.5, my.value, false,10,ctx);
				if(my.state == "click" || my.state == "click_mouseon" || my.sum.length > 0 ){
					draw_textbox(my.x, my.y, my.sum, my.state);
				}
			}else if(mode == 3){
					draw_circlebox(my.x, my.y, my.state, my.isKey);
				if(my.isKey){
					draw_text(my.x, my.y, 'white', 0.9, 1, my.sum, false,10,ctx);
				}
				else{
					draw_text(my.x, my.y, 'white', 0.9, 0.5, my.sum, false,10,ctx);
				}
			}
		});

		// 總數字
		if(en_sumbox)draw_sumbox();
		// 按鈕
		for(var i=0;i<button_list.length-2;i++){
			draw_button(button_list[i].x,button_list[i].y,button_list[i].name,button_list[i].state);
		}
		if(en_continue) 
			draw_button(button_list[button_list.length-1].x,button_list[button_list.length-1].y,button_list[button_list.length-1].name,button_list[button_list.length-1].state);
		else
			draw_button(button_list[button_list.length-2].x,button_list[button_list.length-2].y,button_list[button_list.length-2].name,button_list[button_list.length-2].state);

		// LEVEL
			draw_text(1,5.8,'white',1,0.7,diff,true,90,ctx_b,"end");
			draw_text(1,6,'white',1,3,"LEVEL "+level,true,90,ctx_b,"start");

		// 顯示點的index
		if(num_flag) draw_dot_num();
		if(en_inputbox) draw_inputbox();
		if(en_taskbox) draw_taskbox();
		if(en_pausebox) draw_pausebox();
		if(en_foreground) draw_foreground();

		window.requestAnimationFrame(update);
	}

	function canvas_mouse_event(e){
		var mouse_pos = getMousePos(canvas,e);
		mouse_pos.x /= unit;
		mouse_pos.y /= unit;
		// console.log(dot_list[5]);
		if(en_touch_dot){
			for(var key in dot_list){
				
				var x = dot_list[key].x - mouse_pos.x;
				var y = dot_list[key].y - mouse_pos.y;
				if(x <= mode_data[mode][0] && x >= -mode_data[mode][0] && y <=  mode_data[mode][0] && y >= -mode_data[mode][0]){
					en_click_dot = true;
					mouse_dot_x = dot_list[key].x;
					mouse_dot_y = dot_list[key].y;
					switch(dot_list[key].state){
						case "default":
							dot_list[key].state = "mouseon";
							break;
						case "mouseon":
						case "click_mouseon":
							break;
						case "click":
							dot_list[key].state = "click_mouseon";
							break;
					}
				}else{
					switch(dot_list[key].state){
						case "default":
							break;
						case "mouseon":
							dot_list[key].state = "default";
							break;
						case "click":
							break;
						case "click_mouseon":
							dot_list[key].state = "click";
							break;
					}
				}
			}
		}else{
			en_click_dot = false;
		}
	}

	function canvas_b_mouse_event(e){
		var mouse_pos = getMousePos(canvas_b,e);
		

		mouse_pos.x /= unit;
		mouse_pos.y /= unit;
		if(en_touch_button){
			
			for(key in button_list){
				var x = mouse_pos.x - button_list[key].x;
				var y = mouse_pos.y - button_list[key].y;

				if(x >= -0.65 && x <= 0.65 && y >= -0.65 && y <= 0.65){
					en_click_button = true;
					switch(button_list[key].state){
						case "default":
							button_list[key].state = "mouseon";
							break;
						case "click":
							button_list[key].state = "click_mouseon";
							break;
						case "mouseon":
						case "click_mouseon":
							break;
					}
				}else{
					switch(button_list[key].state){
						case "default":
							break;
						case "mouseon":
							button_list[key].state = "default";
							break;
						case "click":
							break;
						case "click_mouseon":
							button_list[key].state = "click";
							break;

					}
				}
			}
		}else{
			en_click_button = false;
		}
	}

	function click_event(e){
		enter_flag = false;
		// console.log("click: "+mouse_dot_x+" "+mouse_dot_y);
		if(en_click_dot){
			// console.log("now_key: "+now_key);
			for(key in dot_list){
				// console.log(dot_list[key].state);
				switch(dot_list[key].state){
					case "default":
						break;
					case "mouseon":
						dot_list[key].state = "click";
						now_key = key;
						break;
					case "click":
						dot_list[key].state = "default";
						break;
					case "click_mouseon": 
						break;
				}
			}
			en_click_dot = false;
			en_modify_dot = true;
			
		}
	}

	function click_b_event(e){
		if(en_click_button){
			// console.log("now_key: "+now_key);
			for(key in button_list){
				// console.log(dot_list[key].state);
				switch(button_list[key].state){
					case "default":
						break;
					case "mouseon":
						button_list[key].state = "click";
						update_box_en(button_list[key],true);
						break;
					case "click_mouseon":
						button_list[key].state = "default";
						update_box_en(button_list[key],false);
						break;
					case "click":
						button_list[key].state = "default";
						break;

				}
			}
		}
	}

	function update_box_en(my,on){
		switch(my.name){
			case "pause":
				en_click_dot = en_touch_dot = en_modify_dot = en_modify_inputbox = (on) ? false : true;
				en_pausebox = en_continue = (on) ? true : false;
				en_taskbox = false;
				break;
			case "task":
				en_click_dot = en_touch_dot = en_modify_dot = (on) ? false : true;
				en_pausebox = false;
				en_modify_inputbox = true;
				en_taskbox = en_continue = (on) ? true : false;
				break;
			case "繼續":
				if(en_continue){
					en_modify_inputbox = en_click_dot = en_touch_dot = en_modify_dot = (on) ? true : false;
					if(on) 
						en_pausebox = en_taskbox = en_continue = false;
				}
				break;
			case "restart":
				location.reload();
				break;
			case "答案確定":
				if(!en_continue) submit_answer();
				break;

		}
	}

	function keydown_event(e){
		switch(e.key){
			case "0":
				if(mode == 1 && dot_list[now_key].value.length == 0) 
					return;
				else if(mode == 2 && dot_list[now_key].sum.length == 0)
					return;
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
				if(mode == 1 && dot_list[now_key].value.length < 4 && en_modify_dot){
					dot_list[now_key].value += e.key;
				}else if(mode == 2 && dot_list[now_key].sum.length < 4 && en_modify_dot){
					dot_list[now_key].sum += e.key;

				}else if(mode == 3 && input.length < 8 && en_modify_inputbox){
					input += e.key;
				}
		}
		if(e.keyCode == 8){
			if(mode==1 && en_modify_dot)
				dot_list[now_key].value = dot_list[now_key].value.substring(0, dot_list[now_key].value.length-1);
			else if(mode==2 && en_modify_dot)
				dot_list[now_key].sum = dot_list[now_key].sum.substring(0, dot_list[now_key].sum.length-1);
			else if(mode==3 && en_modify_inputbox)
				input = input.substring(0, input.length-1);

			// console.log("backspace");
		}
		if(e.keyCode == 13){
			enter_flag = true;
			en_modify_dot = false;
			console.log("enter");
			for(key in dot_list){
				// console.log(dot_list[key].state);
				switch(dot_list[key].state){
					case "default":
					case "mouseon":
						break;
					case "click":
						dot_list[key].state = "default";
						break;
				}
			}
		}
		
	}

	function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.x- rect.left,
          y: evt.y - rect.top
        };
    }

    function submit_answer(){
    	switch(task[now_task].mode){
    		case 1: 	// 所有點總和等於加密數字
    			var sum = 0;
    			for(key in dot_list){
    				sum+=Number(dot_list[key].value);
    			}
    			if (sum==answer){
    				console.log('right');
    				now_task++;
    				task_over();
    				update_mode();
    			}else{
    				console.log('wrong');
    				task_fail();
    			}
				break;
    		case 2: 	// 將所有點加在一起
    			var wrong = 0;
    			for(key in dot_list){
    				if(dot_list[key].sum != update_dot_sum(dot_list[key]))
    					wrong++;
    			}
    			if (wrong==0){
    				console.log('right');
    				now_task++;
    				task_over();
    				update_mode();
    			}else{
    				console.log('wrong');
    				task_fail();
    			}
    			break;
    		case 3: 	// 解密地圖
    			var sol=0;
    			for(var key in dot_list){
    				if(dot_list[key].isKey){
						sol+=Number(dot_list[key].sum);
					}
    			}
	   			if (sol==input){
    				console.log('right');
    				now_task++;
    				task_over();
    				update_mode();
    			}else{
    				console.log('wrong');
    				task_fail();
    			}

    	}
    }

    function update_dot_sum(my){
		var sum = 0;
		my.link.forEach(function(link_dot){
			sum += Number(dot_list[link_dot].value);
		});
		sum += Number(my.value);
    	return sum;
    }

    function update_mode(){
		// 更新成遊戲模式資料
		if(task.length<=now_task){
			setTimeout(function(){window.location.replace(next_page);},1000);
			set_all_cookies();
			
		}else
			mode=task[now_task].mode;
			en_inputbox = false;
		switch(task[now_task].mode){
			case 1:
				// 
				break;
			case 2:
				// dot 要變大而且要存原本的值
				tasktext_update(task[now_task].str);
				en_inputbox = false;
				for(var key in dot_list){
					if(dot_list[key].isAns_2){
						dot_list[key].sum = ""+update_dot_sum(dot_list[key]);
						dot_list[key].state = "protected";
					}else
						dot_list[key].state = "default";
				}
				setTimeout(task_start,3000);
				break;
			case 3:
				// 算出正確的sum 並存進去
				en_sumbox = false;
				for(var key in dot_list){
					dot_list[key].sum = ""+update_dot_sum(dot_list[key]);
					dot_list[key].state = "default";
				}
				en_modify_inputbox = en_inputbox = true;
				break;
		}
    }

    function task_start(){
		
		//TASK NAME
		setTimeout(function(){en_foreground = true;foreground_style.text=task[now_task].name; TweenLite.to(leaf_style, 1, {a:0.8,size:2.1,rotate:10});}, 10);
		setTimeout(function(){TweenLite.to(leaf_style, 1, {rotate:0});}, 1500);
		setTimeout(function(){TweenLite.to(leaf_style, 0.5, {a:0 ,size:2,rotate:0});}, 2000);
		setTimeout(function(){TweenLite.to(mask_style, 0.5, {a:0.9, w_a:0,size:2});}, 0);
		setTimeout(function(){TweenLite.to(mask_style, 0.5, {a:0, w_a:0,size:2});}, 2400);
		//TASK 內容
		setTimeout(function(){taskbox_style.a=0,taskbox_style.text_a=0;en_taskbox=true;TweenLite.to(taskbox_style, 0.5, {a:0.95,text_a:0.9});}, 2500);
		setTimeout(function(){TweenLite.to(taskbox_style, 0.4, {a:0,text_a:0});}, 5000);
		setTimeout(function(){en_taskbox=false;taskbox_style.a=0.95,taskbox_style.text_a=0.95}, 5500);
		//開始
		setTimeout(function(){foreground_style.text='開~始~'; TweenLite.to(leaf_style, 1, {a:0.8,size:2.1,rotate:10});}, 5500);
		setTimeout(function(){TweenLite.to(leaf_style, 1, {rotate:0});}, 6000);
		setTimeout(function(){TweenLite.to(leaf_style, 0.5, {a:0 ,size:2,rotate:0});}, 6000);
		setTimeout(function(){TweenLite.to(mask_style, 0.5, {a:0.9, w_a:0,size:2});}, 4900);
		setTimeout(function(){TweenLite.to(mask_style, 0.5, {a:0, w_a:0,size:2});}, 6200);
    }

    function task_over(){
		setTimeout(function(){en_foreground = true;foreground_style.text='過關!'; TweenLite.to(leaf_style, 1, {a:0.8,size:2.1,rotate:10});}, 10);
		setTimeout(function(){TweenLite.to(leaf_style, 1, {rotate:0});}, 1500);
		setTimeout(function(){TweenLite.to(leaf_style, 0.5, {a:0 ,size:2,rotate:0});}, 2000);
		setTimeout(function(){TweenLite.to(mask_style, 0.5, {a:0.9, w_a:0,size:2});}, 0);
    }

    function task_fail(){
		setTimeout(function(){en_foreground = true;foreground_style.text='錯了!!'; TweenLite.to(leaf_style, 0.5, {a:0.8,size:2});}, 10);
		for(var i=0;i<5;i++){
			setTimeout(function(){TweenLite.to(leaf_style, 0.1, {rotate:5});}, 700+i*200);
			setTimeout(function(){TweenLite.to(leaf_style, 0.1, {rotate:0});}, 800+i*200);
		}

		setTimeout(function(){TweenLite.to(leaf_style, 0.5, {a:0 ,size:2,rotate:0});}, 2000);
		setTimeout(function(){TweenLite.to(mask_style, 0.5, {a:0.9, w_a:0,size:2});}, 0);
		setTimeout(function(){window.location.href=fail_page;},2500);
    }

    function tasktext_update(task_str){
    	task_text = [];
		var tmp = "";
		for(var i in task_str){
			tmp += task_str[i];
			if(tmp.length == 12 || tmp[tmp.length-1] == "\n"){
				task_text.push(tmp);
				tmp = "";
			}
		}
		if(tmp.length > 0) task_text.push(tmp);
    }

    function set_all_cookies(){
    	var d;
    	switch(diff){
    		case "簡單":
    			d=0;
    			break;
    		case "困難":
    			d=1;
    			break;
    	}
    	set_cookies('level',level+d*3);
    	console.log(document.cookie);

    }

    function set_cookies(cname,cvalue){
		document.cookie = cname+cvalue+"";
    }