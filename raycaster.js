function LineLineXtion(L1, L2,log){	// get the intersection between two lines
	var L1Vertical = !isFinite(L1.m);
	var L2Vertical = !isFinite(L2.m);

	if(L1Vertical && L2Vertical)
		return null;	
	if(L1.m - L2.m == 0)	
		return null;
	if(L1Vertical)
		return {x: L1.x0, y: L1.x0*L2.m + L2.b};
	if(L2Vertical)
		return {x: L2.x0, y: L2.x0*L1.m + L1.b};
	
	var X = (L2.b - L1.b) / (L1.m - L2.m);
	var Y = L1.m * X + L1.b;

	return {x: X, y: Y}; 
}

function onSegment(p, seg) {	// detemine if a point lies on a segment
	var maxX = seg.a.x >=  seg.b.x ?   seg.a.x : seg.b.x;
	var maxY = seg.a.y >=  seg.b.y ?   seg.a.y : seg.b.y;
	var minX = seg.a.x <=  seg.b.x ?   seg.a.x : seg.b.x;
	var minY = seg.a.y <=  seg.b.y ?   seg.a.y : seg.b.y;

	//return (p.x <= maxX) && (p.x >= minX) && (p.y <= maxY) && (p.y >= minY);	// Ahhhhhhh floating pointssssss damn youuuu
	return (p.x <= maxX + 0.0001) && (p.x + 0.0001 >= minX) && (p.y <= maxY+ 0.0001) && (p.y + 0.0001>= minY);
}

function Raycaster(segments, count) {
	var pts = [];
	var rays = [];
	var self = this;
	var src;
	var rCount = count;	// how many rays to cast
	generateRays();

	this.getPts = function(){
		return pts.sort(cmp);
	}

	// used for sorting
	function cmp (a,b) { // return the argument (angle with x-axis) difference of two points
		var aArg = Math.atan2( a.y -src.y, a.x -src.x);
			bArg = Math.atan2( b.y -src.y, b.x -src.x);
		return aArg-bArg;
	}

	function generateRays(){
		var incr = Math.PI*2.0/rCount;
		var ang = 0.0;
		for (var i = 0; i < rCount; i++) {
			rays.push({x: Math.round(Math.cos(ang)*10000000)/10000000.0, y:Math.round(Math.sin(ang)*10000000)/10000000.0 });
		//	if(rays[i].x == 0) rays[i].x = 0.01;	// dont wanna deal with vertical cases now, (undefined slopes)
			ang += incr;
		}
	}

	this.cast = function(Source) { // The core of the program
		src = Source;
		pts = [];
	    for (var i = 0; i < rays.length; i++) {
	    	// construct a line from the ray
	    	var line = {
	    		m: rays[i].y/rays[i].x,
	    		b: src.y - (rays[i].y/rays[i].x)*src.x,
	    		x0: src.x 	// in case m is undefined
	    	};

	    	// get all intersections with the segments for the current ray
	    	var intersections = [];
	    	for (var j = 0; j < segments.length; j++) {
	    		var segSlope =  (segments[j].a.y - segments[j].b.y)/(segments[j].a.x - segments[j].b.x);
	    		var segmentline = {
	    			m: segSlope,
					b: segments[j].a.y - segSlope*segments[j].a.x,
					x0: segments[j].a.x	// in case the slope is undefined
	    		}

	    		var xtion = LineLineXtion(line, segmentline);
	    		if(xtion) { // if there is an intersection
	    			if(onSegment(xtion, segments[j]))	// and if the intersection point is on the segment
	    				intersections.push(xtion);	
	    		}

	    	}
	    	///// filter intersections: choose the closest point in front of the ray \\\\\
	     	var closestDist = 100000000;
	     	var closest = null;
	   		for (var j = 0; j < intersections.length; j++) {
	     		var xtion = intersections[j];

	    		if( UdotV({x: rays[i].x, y: rays[i].y},
	    			 {x: xtion.x-src.x, y: xtion.y-src.y}) < 0 ) { 
	    			// skip this point if it's not in front of the ray
	    		 	continue;	
	    		}  		

	    		// only pick the closest intersection to the source
	    		var dist2 = distSqr(Mouse,xtion);
				if(closestDist > dist2) {
					closestDist = dist2;
					closest = {x: xtion.x, y: xtion.y};
				}
	    	}

	   		if(closest)	pts.push(closest);
	    }

	    return self;
	};

}

// helper function  //
function UdotV(u,v){
	return u.x*v.x + u.y*v.y;
}

function distSqr(p1,p2) {
	return (p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y);
}

