function _draw_img(img,x,y,alpha=1,scale=[1,1],rotate=0){
	a_ctx.save();
	a_ctx.translate(x,y);
	a_ctx.scale(scale[0],scale[1]);
	a_ctx.rotate(Math.PI/180*rotate);
	a_ctx.globalAlpha = alpha;
	a_ctx.drawImage(img,0,0);
	a_ctx.restore();
}

function _draw_rect(x,y,alpha=1,scale=[1,1],rotate=0,color,w,h){
	a_ctx.save();
	a_ctx.translate(x,y);
	a_ctx.scale(scale[0],scale[1]);
	a_ctx.rotate(Math.PI/180*rotate);
	a_ctx.globalAlpha = alpha;
	a_ctx.fillStyle=color;
	a_ctx.fillRect(0,0,w,h);
	a_ctx.restore();
}

function _draw_text(x,y,alpha=1,scale=[1,1],rotate=0,color,text){
	a_ctx.save();
	a_ctx.translate(x,y);
	a_ctx.scale(scale[0],scale[1]);
	a_ctx.rotate(Math.PI/180*rotate);
	a_ctx.globalAlpha = alpha;
	a_ctx.fillStyle=color;
	a_ctx.fillText(text,0,0);
	a_ctx.font = "100 "+20+"px Courier New";
	a_ctx.restore();
}

function GameStart(){
	document.getElementById('game_canvas').style.display = "inline-block";
	document.getElementById('game_canvas').style.display = "inline-block";
	document.getElementById('game_canvas').style+="position:absolute;right:0;top:100px;z-index:0;float:left;";
	document.getElementById('button_canvas').style+="position:absolute;right:0px;top:0px;z-index:1;float:right;";
	a_canvas.style.display="none";
	stop_animate();
	document.getElementById('s').style.display="none";
	game_setup(dot_data,line_data,"game_canvas","button_canvas",1210,650);
	en_touch_dot=true;
	en_touch_button=true;
	task_start();

}