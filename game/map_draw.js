
	function draw_background(){
		ctx_b.fillStyle=ctx.fillStyle = "#fcf2df";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx_b.fillStyle = "#2a1912";
		ctx_b.fillRect(0,0,canvas_b.width,canvas_b.height);
	}

	function draw_grid(){
		ctx.beginPath();
		ctx.fillStyle = "#8d6d0a";
		ctx.lineWidth = 1;
		for(var i=1;(i*unit)<canvas.width;i++){
			ctx.moveTo(i*unit, 0);
			ctx.lineTo(i*unit, canvas.height);
			ctx.font = "2px Arial 微軟正黑體";
			ctx.fillText(i,i*unit,11);
		}
		for(var i=1;(i*unit)<canvas.height;i++){
			ctx.moveTo(0, i*unit);
			ctx.lineTo(canvas.width, i*unit);
			ctx.fillText(i,0,i*unit);
		}
		ctx.strokeStyle = "#8d6d0a";
		ctx.stroke();
	}

	function draw_dot_num(){
		ctx.save();
		ctx.beginPath();
		ctx.font = "100 "+unit*0.4+"px Courier New";
		ctx.fillStyle = 'white';
		for(key in dot_list){
			ctx.fillText(key, (dot_list[key].x-0.13)*unit, (dot_list[key].y+0.13)*unit);
		}
		ctx.stroke();
		ctx.restore();
	}

	function draw_line(x1, y1, x2, y2){
		x1 = x1*unit;
		y1 = y1*unit;		
		x2 = x2*unit;
		y2 = y2*unit;
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.strokeStyle = '#2a1912';
		ctx.lineWidth = 0.1*unit;
		ctx.stroke();
	}

	function draw_line(index0,index1){
		var x1 = dot_list[index0].x*unit;
		var y1 = dot_list[index0].y*unit;		
		var x2 = dot_list[index1].x*unit;
		var y2 = dot_list[index1].y*unit;
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.bezierCurveTo(x1+0.1*unit,y1+0.1*unit,x2+0.1*unit,y2+0.1*unit,x2,y2);
		ctx.strokeStyle = '#2a1912';
		ctx.lineWidth = 0.05*unit;
		ctx.stroke();
	}

	function draw_circle(x, y, radius = 0.2 , color = "default"){
		x = x*unit;
		y = y*unit;
		switch(color) {
			case "default":
			case "protected":
				ctx.fillStyle = '#2a1912';
				break;
			case "click_mouseon": 
			case "mouseon": 
				ctx.fillStyle = '#c58229';
				radius += 0.05;
				break;
			case "click":
				ctx.fillStyle = '#6f2208';
				radius += 0.03;
				break;
		}
		radius = radius*unit;
		ctx.globalAlpha = 0.99;
		ctx.beginPath();
		ctx.moveTo(x+radius,y);
		ctx.arc(x, y, radius, 0, Math.PI*2, false);
		ctx.fill();
	}

	function draw_text(x,y,color,alpha,size,text,change = true,rotate = 0,my_ctx=ctx,align="center"){
		my_ctx.save();
		my_ctx.translate(x*unit,y*unit);
		my_ctx.rotate(Math.PI/180*rotate);
		my_ctx.globalAlpha = alpha;
		my_ctx.strokeStyle = my_ctx.fillStyle = color;
		my_ctx.textAlign=align;
		my_ctx.textBaseline="middle";
		size = (change) ? size/text.length : size;
		my_ctx.font = "100 "+unit*size+"px Courier New";
		my_ctx.fillText(text,0,0);
		my_ctx.restore();
	}

    function draw_leaf_1(x, y, color, alpha ,size){
		ctx.save();
		ctx.beginPath();
		ctx.globalAlpha = alpha;
		y=(y-size/2)*unit;
		x=(x-size/2)*unit;
		size = unit*size/1.5;
		ctx.moveTo(x,y);
		ctx.bezierCurveTo(x+1*size,y,x+2*size,y,x+1.5*size,y+1.5*size);
		ctx.bezierCurveTo(x+1*size,y+1*size,x-0.1*size,y+2*size,x,y);
		ctx.fillStyle = color;
		ctx.lineWidth = 0.1*unit;
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.bezierCurveTo(x+0.5*size,y+1.5*size,x+1.5*size,y+0.65*size,x+1.5*size,y+1.5*size);
		ctx.bezierCurveTo(x+1*size,y+1*size,x-0.1*size,y+2*size,x,y);
		ctx.fill();
		ctx.restore();
    }

    function draw_leaf_2(x, y, color, alpha ,size){
		ctx.save();
		y=(y-size/4)*unit;
		x=(x-size/2)*unit;
		size = size/1.5*unit;
		ctx.fillStyle = color;
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.bezierCurveTo(x+0.7*size,y-0.35*size,x+1.2*size,y-0.05*size,x+=1.5*size, y+=0.5*size);
		ctx.bezierCurveTo(x-0.2*size,y+0.15*size,x-1*size,y+0.35*size,x-=1.5*size, y-=0.5*size);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(x+size*0.07,y+size*0.03);
		ctx.bezierCurveTo(x+0.3*size,y+0.5*size,x+1*size,y+0.5*size,x+1.5*size, y+0.5*size);
		ctx.fill();
		ctx.restore();
    }

    function draw_mask(color,my_ctx=ctx,alpha=0.85){
    	my_ctx.save();
    	my_ctx.fillStyle = color;
		my_ctx.globalAlpha = alpha;
		my_ctx.fillRect(0,0,canvas.width,canvas.height);
    	my_ctx.restore();
    }

	function draw_box(x,y,size_x,size_y,color,my_ctx=ctx,alpha=0.9,scale=[1,1],rotate=0){
		my_ctx.save();
		my_ctx.translate(x*unit,y*unit);
		my_ctx.rotate(rotate*Math.PI/180);
		my_ctx.scale(scale[0], scale[1]);
		x=(x-size_x/2)*unit;
		size_x *= unit;
		size_y *= unit;
		x = -size_x/2;
		y= -size_y/2
		my_ctx.beginPath();
		ctx.globalAlpha = alpha;
		my_ctx.arc(x+=0.5*unit,y+0.5*unit,unit*0.5,Math.PI,Math.PI/180*270,false);
		my_ctx.lineTo(x+=(size_x-unit*1),y);
		my_ctx.arc(x,y+0.5*unit,unit*0.5,Math.PI/180*270,Math.PI/180*0,false);
		my_ctx.lineTo(x+0.5*unit,y+=(size_y-unit*0.5));
		my_ctx.arc(x,y,unit*0.5,Math.PI/180*0,Math.PI/180*90,false);
		my_ctx.lineTo(x-=(size_x-unit*1),y+0.5*unit);
		my_ctx.arc(x,y,unit*0.5,Math.PI/180*90,Math.PI/180*180,false);
		my_ctx.lineTo(x-0.5*unit,y-=(size_y-unit*1));
    	my_ctx.fillStyle = color;
		my_ctx.fill();
		my_ctx.restore();
	}

	function draw_textbox(x, y, value = "",state = "click"){
		x+=1;		
		y+=0.5;	
		var text_color;	
		switch(state){
			case "click_mouseon": 
				draw_leaf_2(x,y,'#c58229',0.9,1.5);
				text_color='white';
				break;
			case "mouseon":
				draw_leaf_2(x,y,'#c58229',0.9,1.5);
				text_color='white';
				break;
			case "default":
				draw_leaf_2(x,y,'#6f7f5b',0.9,1.5);
				text_color='white';
				break;
			case "click":
				draw_leaf_2(x,y,'#6f2208',0.9,1.5);
				text_color='white';
				break;
			case "protected":
			case "enter":
				if(mode==1)
					draw_leaf_2(x,y,'#2a1912',0.9,1.5);
				else
					draw_leaf_2(x,y,'#c58229',0.9,1.5);
					
				text_color = 'white';
				break;
		}
		draw_text(x,y-0.1,text_color,1,0.5,value,false, 20);
		ctx.restore();
	}

	function draw_circlebox(x, y, state, isKey=false){
		var color, size=0, s=1;
		switch(state) {
			case "default":
			case "protected":
				color = '#2a1912';
				break;
			case "click_mouseon": 
			case "mouseon": 
				color = '#c58229';
				size = 0.05;
				break;
			case "click":
				color = '#722e19';
				size = 0.03;
				break;

		}
		if(isKey)	
			s=2;
		draw_box(x, y, 1.3+size, 1+size, color,ctx,0.99,[0.65*s,0.65*s],10);
	}

	function draw_sumbox(){
		var sum=0;
		dot_list.forEach(function(my){
			sum += Number(my.value);
		});
		draw_leaf_1(canvas.width/unit-1.5, canvas.height/unit-1.5, '#2a1912', 0.9 ,1.8);
		draw_text(canvas.width/unit-1.4, canvas.height/unit-1.5, 'white', 1, 2, ""+sum);
		draw_text(canvas.width/unit-1.9, canvas.height/unit-2.1, 'white', 1, 0.65, "總和");
	}

	function draw_pausebox(){
		draw_mask('#2a1912');
		draw_box(canvas.width/unit/2,canvas.height/unit/2,6,6,'#2a1912');
		draw_text(canvas.width/unit/2,canvas.height/unit/2,"white",0.9,5,"STOP",true,0);
	}

	var taskbox_style = {a:0, text_a:0};
	function draw_taskbox(){
		var mid_x=canvas.width/unit/2;
		var mid_y=canvas.height/unit/2;
		draw_mask('#2a1912',ctx,taskbox_style.a);

		draw_box(mid_x,mid_y,6,6,'#2a1912',ctx,taskbox_style.a);
		draw_text(mid_x+2.5,mid_y-2.4,"white",taskbox_style.text_a,5,"<TASK>",true,0,ctx,"end");
		var y=mid_y-2;
		for(var i in task_text){
			draw_text(mid_x-2.5,y+=0.5,"white",taskbox_style.text_a,0.35,task_text[i],false,0,ctx,"start");
			if(task_text[i][task_text[i].length-1] == "\n")
				y+=0.2;
		}
	}

	function draw_button(x,y,name,state,x_size=1.3,y_size=1.3){
		ctx.save();
		switch(state){
			case "default":
				draw_box(x,y,x_size,y_size,"#fcf2df",ctx_b);
				draw_text(x,y,'#2a1912',0.9,0.33,name,false,45,ctx_b);
				break;
			case "click":
				draw_box(x,y,x_size,y_size,"#c58229",ctx_b);
				draw_text(x,y,'white',0.9,0.8,name[0].toUpperCase()+"",false,45,ctx_b);
				break;
			case "mouseon":
			case "click_mouseon":
				draw_box(x,y,x_size,y_size,"#2a1912",ctx_b);
				draw_text(x,y,'white',0.9,0.37,name,false,0,ctx_b);
				break;
		}
		ctx.restore();
	}

	function draw_inputbox(){
		draw_box(5,9,15,3,"#c58229",ctx,0.9,[0.5,0.5],0);
		draw_text(3,9.05,"#2a1912",0.9,2.5,"暗藏密碼是：");		
		draw_box(6.5,9,10,2.5,"white",ctx,0.2,[0.4,0.4],0);
		draw_text(6.5,9.05,"#2a1912",0.9,1,input,false);		
	}

	var foreground_style={text:""};
	var leaf_style={r:111, g:127, b:91, a:0, t_a:1, t_size:1 ,size:2, rotate:0};
	var mask_style={a:0};
	function draw_foreground(){
		draw_mask("#2a1912",ctx,mask_style.a);
		draw_mask("#2a1912",ctx_b,mask_style.a);
		draw_leaf_1(canvas.width/unit/2,canvas.height/unit/2,"rgb("+parseInt(leaf_style.r)+","+parseInt(leaf_style.g)+","+parseInt(leaf_style.b)+")",leaf_style.a,3*leaf_style.size);
		draw_text(canvas.width/unit/2+0.5,canvas.height/unit/2-0.2,"white",leaf_style.a,1.5*leaf_style.t_size,foreground_style.text,false,leaf_style.rotate);

	}



	