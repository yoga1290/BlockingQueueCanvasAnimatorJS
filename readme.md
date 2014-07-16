#	Usuage:
-----


+	Add the JS file to your page header:


	```html
		<script src="BlockingQueueCanvasAnimator.js”></script>
	```

+	Create a canavas with id, width and height attributes:


	```html
		<canavas id="myCanvas" width="800" height="800"></canvas>
	```


+	Have fun with the Animator


	```javascript
		var animator=BlockingQueueCanvasAnimator("myCanvas");
		animator.load([
			[{src:'img.png'},[{src:'img2.png'}]],
			[{src:'imageWithXY.png',x:1000,y:1000}]]
			,...
		]);
	```

-----

#	functions:

-----

+	**load([[{src},{src,x,y}]])**:
>Loads images before drawing/animating from the given 2D array.
>Each element must has **src** value and optionally, X and Y indicating its position in the canvas (only will show up when needed)

+	**moveTo(x,y)**:
> without any kind of animation, draw images starting from a given **(x,y)** offset.

+	**animateTo(x,y,speed,zoomFactor,zoomSpeed)**:
> animateTo the given **(x,y)** offset, skipping **speed** pixels per time and zooming by **zoomFactor**, increasing/decreasing the **zoomFactor** by **zoomSpeed** per time

+	**run(function)**:
> add a function to the blocking queue