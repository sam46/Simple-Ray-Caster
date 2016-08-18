var updateCanvas = true;
var controls = {areaAlpha: 0.1, raysAlpha: 0.1, count: 1000};

window.onload = function(){
	var canvas = document.getElementById("canvas"),
		 ctx = canvas.getContext("2d");

	var width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight;

	// Borrowed the polygons layout from "Nicky Case"	
	var segments = [
		// Border
		{a:{x:0,y:0}, b:{x:width,y:0}},
		{a:{x:width,y:0}, b:{x:width,y:height}},
		{a:{x:width,y:height}, b:{x:0,y:height}},
		{a:{x:0,y:height}, b:{x:0,y:0}},

		// Polygon #1
		{a:{x:100,y:150}, b:{x:120,y:50}},
		{a:{x:120,y:50}, b:{x:200,y:80}},
		{a:{x:200,y:80}, b:{x:140,y:210}},
		{a:{x:140,y:210}, b:{x:100,y:150}},

		// Polygon #2
		{a:{x:100,y:200}, b:{x:120,y:250}},
		{a:{x:120,y:250}, b:{x:60,y:300}},
		{a:{x:60,y:300}, b:{x:100,y:200}},

		// Polygon #3
		{a:{x:200,y:260}, b:{x:220,y:150}},
		{a:{x:220,y:150}, b:{x:300,y:200}},
		{a:{x:300,y:200}, b:{x:350,y:320}},
		{a:{x:350,y:320}, b:{x:200,y:260}},

		// Polygon #4
		{a:{x:340,y:60}, b:{x:360,y:40}},
		{a:{x:360,y:40}, b:{x:370,y:70}},
		{a:{x:370,y:70}, b:{x:340,y:60}},

		// Polygon #5
		{a:{x:450,y:190}, b:{x:560,y:170}},
		{a:{x:560,y:170}, b:{x:540,y:270}},
		{a:{x:540,y:270}, b:{x:430,y:290}},
		{a:{x:430,y:290}, b:{x:450,y:190}},

		// Polygon #6
		{a:{x:400,y:95}, b:{x:580,y:50}},
		{a:{x:580,y:50}, b:{x:480,y:150}},
		{a:{x:480,y:150}, b:{x:400,y:95}}
	];
	for (var i = 4; i < segments.length; i++) {	// make the polygons a bit larger
		segments[i].a.x *= 2.8* width/2000.0;
		segments[i].b.x *= 2.8* width/2000.0;
		segments[i].a.y *= 2.8* width/2000.0;
		segments[i].b.y *= 2.8* width/2000.0;
	}

	var raycaster = new Raycaster(segments, controls.count);
	this.updateRaysCount = function(){
		raycaster = new Raycaster(segments, controls.count);
	};

	var dgui = new dat.GUI({width: 400, height: 600});
	dgui.add(controls,"raysAlpha", 0.01,0.2);
	dgui.add(controls,"areaAlpha", 0.01,0.2);
	dgui.add(controls,"count", 500,2500);
	dgui.add(this,"updateRaysCount");

	var pts = [];
	drawLoop();




	function drawLoop() {
	    requestAnimationFrame(drawLoop);
	    if(updateCanvas) {
			pts = raycaster.cast(Mouse).getPts();
	    	draw();
	    	updateCanvas = false;
	    }
	}

	function draw(){
		ctx.clearRect(0,0,canvas.width,canvas.height);

		//Draw polygons
		ctx.strokeStyle = "rgba(255,255,255,0.1)";
		for(var i=0;i<segments.length;i++){
			var seg = segments[i];
			ctx.beginPath();
			ctx.moveTo(seg.a.x,seg.a.y);
			ctx.lineTo(seg.b.x,seg.b.y);
			ctx.stroke();
		}

		// Draw source
		ctx.fillStyle = "#dd3838";
		ctx.beginPath();
	    ctx.arc(Mouse.x, Mouse.y, 4, 0, 2*Math.PI, false);
	    ctx.fill();
	    ctx.closePath();
		
		// draw light rays
		ctx.strokeStyle = "rgba(255,0,0,"+controls.raysAlpha+")";
		for(var i=0;i<pts.length;i++) {
			ctx.beginPath();
			ctx.moveTo(Mouse.x,Mouse.y);
			ctx.lineTo(pts[i].x, pts[i].y);
			ctx.stroke();
		}

		// draw light rays landing points
		ctx.fillStyle = "#ff3833";
		for(var i=0;i<pts.length;i++) {
			ctx.beginPath();
		    ctx.arc(pts[i].x, pts[i].y, 1, 0, 2*Math.PI, false);
		    ctx.fill();
		    ctx.closePath();
		}

		// draw polygons that has landing points as its vertices
		ctx.fillStyle = 'rgba(255,225,100,+'+ controls.areaAlpha +')';
		ctx.beginPath();
		ctx.moveTo(pts[0].x, pts[0].y);
		for(var i=1;i<pts.length;i++){
			ctx.lineTo(pts[i].x, pts[i].y);
		}
		ctx.lineTo(pts[0].x, pts[0].y);
		ctx.closePath();
		ctx.fill();

	}	// end draw

}	// end window.onload

var Mouse = {
	x: canvas.width/2,
	y: canvas.height/2
};

window.onmousemove = function(event){	
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
	updateCanvas = true;
};
