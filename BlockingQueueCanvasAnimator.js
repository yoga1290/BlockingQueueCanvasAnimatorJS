var BlockingQueueCanvasAnimator=function(canvasId){
			var imgArray=[[]], //2D array
				imgs=[],
				zoomFactor=1,
				offsetX=0.0,
				offsetY=0.0;
			var onProgress=null;

			var canvas = document.getElementById(canvasId);
    		var context = canvas.getContext("2d");
    		var canvasW=canvas.width,
    			canvasH=canvas.height;


    		var lock=false;
    		var blockingQueue=[];
    		var wait4Lock=function(callbackFn){

    			if(callbackFn!==undefined && callbackFn!==null)
    				blockingQueue.push(callbackFn);
    			// console.log("waiting 4 lock:"+blockingQueue.length);
    			if(!lock)
    			{
    				// console.log("lock was released..");
    				if(blockingQueue.length>0)
    					(blockingQueue.shift())();
    			}
	    		else
	    			setTimeout(function(){
	    					wait4Lock();
	    				},500);
    		};

			var run=function(callbackFn){
				wait4Lock(function(){
					lock=true;
					callbackFn();
					lock=false;
				});
				return this;
			};
			var pause=function(){
				wait4Lock(function(){
					lock=true;
				});
			};
			var resume=function(){
				wait4Lock(function(){
					lock=false;
				});
			};

    		var imgLoader=function(i,j,x,y){
    			
    			// console.log("imgLoader("+i+" , "+j+")");
    			lock=true;
    			var img=new Image();
		    	img.onload=function(){
		    		if(onProgress!==null)
    					onProgress(i,j);

		    		if(imgArray[i][j].x!==null
		    			&& imgArray[i][j].x!==undefined)
		    			x=imgArray[i][j].x;
		    		if(imgArray[i][j].y!==null
		    			&& imgArray[i][j].y!==undefined)
		    			y=imgArray[i][j].y;

		    		imgs.push({img:img,x:x,y:y});
		    		if(j+1<imgArray[i].length)
		    			imgLoader(i,j+1,x+img.width,y);
		    		else if(i+1<imgArray.length)
		    			imgLoader(i+1,0,0,y+img.height);
		    		else
		    			lock=false;
		    	};
		    	img.src=imgArray[i][j].src;
    		};



    		var clear=function(){
    			canvas.width=canvas.height=0;
    			canvas.width=canvasW;
    			canvas.height=canvasH;
    			return this;
    		};
    		var load=function(imageArray){
    			imgArray=imageArray;
    			imgLoader(0,0,0,0);
    			return this;
    		};
    		var draw=function(){
	    			for(i=0;i<imgs.length;i++)
	    				//TODO: conditions here?
	    				context.drawImage(imgs[i].img,
	    							0,0,imgs[i].img.width,imgs[i].img.height,
	    								parseInt((imgs[i].x-offsetX)*zoomFactor),
	    								parseInt((imgs[i].y-offsetY)*zoomFactor),
	    								parseInt(imgs[i].img.width*zoomFactor),
	    								parseInt(imgs[i].img.height*zoomFactor)
	    								);
    		};
    		var moveTo=function(x,y){
    			offsetX=x;
    			offsetY=y;
    			return this;
    		};

			var animatePropertiesQueue=[];
			var animateTo=function(x,y,speed,zoom,zoomSpeed){
				wait4Lock(function(){
					animatePropertiesQueue.push(
							{
								x:x,
								y:y,
								speed:speed,
								zoom:zoom,
								zoomSpeed:zoomSpeed
							});
					animate();
				});
				return this;
			};
			var animateToCenter=function(x,y,speed,zoom,zoomSpeed){
				wait4Lock(function(){
					animatePropertiesQueue.push(
							{
								x:(x-canvasW/2),
								y:(y-canvasH/2),
								speed:speed,
								zoom:zoom,
								zoomSpeed:zoomSpeed
							});
					animate();
				});
				return this;
			};

    		var animate=function(){
    				lock=true;

    				param=animatePropertiesQueue.pop();
					// animateTo(x,y,speed,zoom,zoomSpeed);
					// console.log(param);
    				// console.log("animateTo("+offsetX+' , '+offsetY+","+param.zoom+");");
	    			var needRefresh=false;

    				//Step zoomFactor
    				if(zoomFactor+param.zoomSpeed<=param.zoom)
    				{
    					needRefresh=true;
    					zoomFactor+=param.zoomSpeed;
    				}
    				else if(zoomFactor-param.zoomSpeed>=param.zoom)
    				{
    					needRefresh=true;
    					zoomFactor-=param.zoomSpeed;
    				}

    				// Step offsetX
	    			if(offsetX+param.speed
	    					<=param.x)
	    			{
	    				needRefresh=true;
	    				offsetX+=param.speed;
	    			}
	    			else if(offsetX-param.speed
	    						>=param.x)
	    			{
	    				needRefresh=true;
	    				offsetX-=param.speed;
	    			}

	    			//Step offsetY
	    			if(offsetY+param.speed
	    				<=param.y)
	    			{
	    				needRefresh=true;
	    				offsetY+=param.speed;
	    			}
					else if(offsetY-param.speed
						>=param.y)
	    			{
	    				needRefresh=true;
	    				offsetY-=param.speed;
	    			}


	    			clear();
	    			draw();


	    			if(needRefresh)
	    			{
	    				animatePropertiesQueue.push(param);
	    				setTimeout(animate,10);
	    			}
	    			else
	    				lock=false;
    		};


    		var delay=function(msec){
    			wait4Lock(function(){
    				lock=true;
    				setTimeout(function(){
    					lock=false;
    				},msec);
    			});
    			return this;
    		};

    		return	{
    			load:load,
    			clear:clear,
    			moveTo:moveTo,
    			animateTo:animateTo,
    			run:run,
    			pause:pause,
    			resume:resume,
    			delay:delay,
    			onProgress:onProgress
    		};

		};
