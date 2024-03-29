class Engine
{
	constructor()
	{
		this.isMeasure = false;

		this.htmlLang = document.documentElement.lang;

		this.map;
		this.codeLinesEngine;

		this.sequenceTempo = null;
		this.animationTempo = null;

		this.sequence = [];

		this.currentLevel = 1;

		this.init();
	}

	rotateImg(obj)
	{
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');

		let dSizeX = this.map['cellSize'] * obj['cellWidth'];
		let dSizeY = this.map['cellSize'] * obj['cellHeight'];

		canvas.width = Math.sqrt((dSizeX * dSizeX) + (dSizeY * dSizeY));
		canvas.height = canvas.width;

		let canvasHalfWidth = canvas.width / 2;
		let canvasHalfHeight = canvas.height / 2;

		ctx.translate(canvasHalfWidth, canvasHalfHeight);
		ctx.rotate(obj['angle'] * Math.PI / 180);
		ctx.translate(- canvasHalfWidth, - canvasHalfHeight);

		let sX = obj['imgSrcCol'] * obj['spriteSizeSrcX'];
		let sY = obj['imgSrcRow'] * obj['spriteSizeSrcY'];

		let dMiddleX = (canvasHalfWidth) - (dSizeX / 2);
		let dMiddleY = (canvasHalfWidth) - (dSizeY / 2);

		ctx.drawImage(obj['img'], sX, sY, obj['spriteSizeSrcX'], obj['spriteSizeSrcY'], dMiddleX, dMiddleY, dSizeX, dSizeY);

		return canvas;
	}

	drawObj(obj, clearR = true)
	{
		let cellSize = this.map['cellSize'];

		if (clearR == true)
		{
			obj.ctx.clearRect(0, 0, obj.canvas.width, obj.canvas.height);
		}

		let imgRot = this.rotateImg(obj);

		let posX = (obj.posCol * cellSize) + (cellSize / 2) - (imgRot.width / 2);
		let posY = (obj.posRow * cellSize) + (cellSize / 2) - (imgRot.height / 2);

		obj.ctx.drawImage(imgRot, 0, 0, imgRot.width, imgRot.height, posX, posY, imgRot.width, imgRot.height);
	}

	moveObj(obj, direction)
	{
		let hypo = 1;
		let triangleWidth = hypo * Math.sin(obj.angle * Math.PI / 180);
		let triangleHeight = -1 * (hypo * Math.cos(obj.angle * Math.PI / 180));

		triangleWidth = obj.angle == 0 || obj.angle == 180 ? 0 : triangleWidth;
		triangleHeight = obj.angle == 90 || obj.angle == 270 ? 0 : triangleHeight;

		let posCol = direction == 'MoveFront' ? obj.posCol + triangleWidth : obj.posCol - triangleWidth;
		let posRow = direction == 'MoveFront' ? obj.posRow + triangleHeight : obj.posRow - triangleHeight;

		return {posCol: posCol, posRow: posRow};
	}

	rotateObj(obj, direction)
	{
		let cellSize = this.map['cellSize'];
		let newAngle = 0;

		if (typeof direction == "string")
		{
			newAngle = direction == "Right" ? obj.angle + 90 : obj.angle - 90;
		}
		else
		{
			newAngle = obj.angle + direction;
		}

		return newAngle;
	}

	drawMap()
	{
		this.map['ctx'].clearRect(0, 0, this.map['canvas'].width, this.map['canvas'].height);
		
		let rowsLength = this.map['rowsLength'];
		let colsLength = this.map['colsLength'];
		let cellSize = this.map['cellSize'];
		
	}

	refreshStarCanvas()
	{
		let starsCanvas = document.getElementById('star-canvas');
		let starsCtx = starsCanvas.getContext('2d');

		let starsList = this.map['starsList'];

		starsCanvas.width = this.map['canvas'].width;
		starsCanvas.height = this.map['canvas'].height;

		starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

		if (starsList && Object.keys(starsList).length > 0)
		{
			for (let starName in starsList)
			{
				let star = starsList[starName];
				this.drawObj(star, false);
			}
		}
	}

	cleanAllCanvas()
	{
		let canvas = document.querySelectorAll('canvas');
		for (let i = canvas.length - 1; i >= 0; i--)
		{
			let ctx = canvas[i].getContext('2d');
			ctx.clearRect(0, 0, canvas[i].width, canvas[i].height);
		}
	}

	updateCanvasSize()
	{
		// rest canvas container size
		this.map['canvas'].width = 0;
		this.map['canvas'].height = 0;
		
		let canvasSize;
		let canvasContainerWidth = this.map['canvas'].parentNode.offsetWidth;
		let canvasContainerHeight = this.map['canvas'].parentNode.offsetHeight;

		// adapt to portrait or landscape
		if (canvasContainerHeight > canvasContainerWidth)
		{
			canvasSize = canvasContainerWidth;
			this.map['cellSize'] = Math.floor(canvasContainerWidth / this.map['colsLength']);	
		}
		else
		{
			canvasSize = canvasContainerHeight;
			this.map['cellSize'] = Math.floor(canvasContainerHeight / this.map['rowsLength']);
		}

		this.map['canvas'].width = canvasSize;
		this.map['canvas'].height = canvasSize;

		this.drawMap();

		// draw water
		if (this.map['water'])
		{
			let water = this.map['water'];
			this.drawObj(water, false);
		}

		// draw bushes
		if(this.map['bushes'])
		{
			for (let i = this.map['bushes'].length - 1; i >= 0; i--)
			{
				this.drawObj(this.map['bushes'][i], false);
			}
		}

		let objectList = this.map['objectList'];
		for (let obj in objectList)
		{
			objectList[obj].canvas.width = canvasSize;
			objectList[obj].canvas.height = canvasSize;

			this.drawObj(objectList[obj]);
		}

		this.refreshStarCanvas();

		let uiCanvas = document.getElementById('ui-canvas');
		uiCanvas.width = canvasSize;
		uiCanvas.height = canvasSize
	}

	checkCollisionBetween(obj1, obj2, obj1PadTop = 0, obj1PadBot = 0, obj1PadLeft = 0, obj1PadRight = 0)
	{
		let obj1PosLeft = obj1['posCol'] - (obj1['cellWidth'] / 2);
		let obj1PosRight = obj1['posCol'] + (obj1['cellWidth'] / 2);
		let obj1PosTop = obj1['posRow'] - (obj1['cellHeight'] / 2);
		let obj1PosBot = obj1['posRow'] + (obj1['cellHeight'] / 2);

		let obj2PosLeft = obj2['posCol'] - (obj2['cellWidth'] / 2);
		let obj2PosRight = obj2['posCol'] + (obj2['cellWidth'] / 2);
		let obj2PosTop = obj2['posRow'] - (obj2['cellHeight'] / 2);
		let obj2PosBot = obj2['posRow'] + (obj2['cellHeight'] / 2);

		if (obj2PosLeft <= obj1PosRight + parseInt(obj1PadRight, 10) && obj2PosRight > obj1PosLeft - parseInt(obj1PadLeft, 10) && obj2PosTop <= obj1PosBot + parseInt(obj1PadBot, 10) && obj2PosBot > obj1PosTop - parseInt(obj1PadTop, 10))
		{
			return true;
		}

		return false;
	}

	checkEdgeCollision(col, row)
	{
		// with Edges map
		if (col > 0 && col < this.map['colsLength'] - 1 && row > 0 && row < this.map['rowsLength'] - 1)
		{
			return false;
		}
		return true;
	}

	smoothMoveObj(time, objName, obj, newPosCol, newPosRow, continueAnimation)
	{
		let xLength = obj.posCol - newPosCol;
		let yLength = obj.posRow - newPosRow;
		let xSmoothStep = xLength / 10;
		let YSmoothStep = yLength / 10;

		let animIndex = 0;

		this.sequenceTempo = setInterval(()=>
		{
			obj.posCol -= xSmoothStep;
			obj.posRow -= YSmoothStep;

			// test next frame animation and draw
			if (obj['idleAnimTempo'] && animIndex % 10 == 1)
			{
				obj['imgSrcRow'] = 1;
				obj['imgSrcCol'] = obj['imgSrcCol'] < obj.animImgLength - 1 ? obj['imgSrcCol'] + 1 : 0;
			}
			animIndex += 1;
			this.drawObj(obj);

			if (objName == "turtle")
			{
				let player = this.map['objectList']['player'];

				if (this.checkCollisionBetween(obj, player, 0, 0, "-1", "-2") == true)
				{
					player.posCol -= xSmoothStep;
					player.posRow -= YSmoothStep;
					/*
					player.posCol = posCol;
					player.posRow = posRow;
					*/
					this.drawObj(player);
				}
			}

			if (obj.posCol.toFixed(1) == newPosCol.toFixed(1) && obj.posRow.toFixed(1) == newPosRow.toFixed(1))
			{
				clearInterval(this.sequenceTempo);
				continueAnimation();
			}
		}, time);
	}

	smoothRotateObj(time, obj, newAngle, continueAnimation)
	{
		let direction = obj.angle < newAngle ? 1 : -1;

		this.sequenceTempo = setInterval(()=>
		{
			obj.angle += direction
			this.drawObj(obj);

			if (obj.angle == newAngle)
			{
				clearInterval(this.sequenceTempo);
				continueAnimation();
			}
		}, time);
	}

	launchAnimation(key, callNextSequenceLine)
	{
		if (key.indexOf("Move") != -1)
		{
			let index = key.indexOf("Move");
			let objName = key.slice(0, index);
			let obj = this.map['objectList'][objName];
			let action = key.slice(index, key.length);
			let newPos = this.moveObj(obj, action);
			let newPosCol = newPos['posCol'];
			let newPosRow = newPos['posRow'];

			// block if edge of map
			if (this.checkEdgeCollision(newPosCol, newPosRow) == true)
			{
				let message = this.htmlLang == "en" ? "In the wall!" : "壁の中に";
				this.loadGameLost(message);
				return;
			}

			// block if Bushes
			let bushesList = this.map['bushes'];
			if (bushesList)
			{
				for (let i = bushesList.length - 1; i >= 0; i--)
				{
					if (this.checkCollisionBetween(bushesList[i], obj, 0, 1) == true)
					{
						let message = this.htmlLang == "en" ? "In the wall!" : "壁の中に";
						this.loadGameLost(message);
						return;
					}
				}
			}

			// move
			this.smoothMoveObj(10, objName, obj, newPosCol, newPosRow, ()=>
			{
				if (objName == "player")
				{
					let player = this.map['objectList']['player'];
					let starsList = this.map['starsList'];

					// with STARS
					for (let starName in starsList)
					{
						if (this.checkCollisionBetween(starsList[starName], player) == true)
						{
							delete starsList[starName];
							this.refreshStarCanvas();
							if (Object.keys(starsList).length == 0)
							{
								this.victoryBox();
								return;
							}
						}
					}

					// with WATER
					if (this.map['water'] && this.checkCollisionBetween(this.map['water'], player, "-1", "-1") == true)
					{
						if(!this.map['objectList']['turtle'] || this.checkCollisionBetween(this.map['objectList']['turtle'], player, 0, 0, "-1", "-1") == false)
						{
							let message = this.htmlLang == "en" ? "You drowned!" : "溺れた";
							this.loadGameLost(message);
							return;
						}
					}
				}
				callNextSequenceLine(obj);
			});
		}
		else if (key.indexOf("Rotate") != -1)
		{
			let index = key.indexOf("Rotate");
			let objName = key.slice(0, index);
			let obj = this.map['objectList'][objName];

			key = key.replace(objName + "Rotate", "");
			key = key.match(/\d+/g) != null ? parseInt(key, 10) : key;

			let newAngle = this.rotateObj(this.player, key);
			this.smoothRotateObj(5, obj, newAngle, ()=>
			{
				callNextSequenceLine()
			})
		}
	}

	loadAnimation()
	{
		this.launchAnimation(this.sequence[0], (obj) =>
		{
			this.sequence.splice(0, 1);
			// call next sequence line
			if (this.sequence.length > 0)
			{
				//this.launchAnimation(this.sequence[0]);
				this.loadAnimation();
			}
			// no more sequence line
			else
			{
				// idle obj anim
				if (obj)
				{
					obj['imgSrcCol'] = 0;
					obj['imgSrcRow'] = 0;
					this.drawObj(obj);
				}

				this.codeLinesEngine.codeLines.shift();
				this.codeLinesEngine.currentSequenceLine += 1;
				// call next code line
				if (this.codeLinesEngine.codeLines.length > 0)
				{
					this.checkCode();
				}
				// no more code line
				else
				{
					if (Object.keys(this.map['starsList']).length)
					{
						let message = this.htmlLang == "en" ? "You have not harvested all the stars!" : "あなたはすべてのほしをしゅうかくしていません";
						this.loadGameLost(message);	
					}
					// unlock code container and run button
					/*
					let textarea = document.getElementById('code-container');
					let runButton = document.getElementById('run-button');
					textarea.style = '';
					runButton.style = '';*/
				}
			}
		})
	}

	checkCode()
	{
		let codeLines = this.codeLinesEngine.codeLines;

		codeLines = codeLines.length == 0 ? this.codeLinesEngine.getLines : codeLines;

		if (codeLines.length > 0)
		{
			if (this.codeLinesEngine.check(codeLines[0]))
			{
				let code = this.codeLinesEngine.translate(codeLines[0]);
				code[0] = code[0].charAt(0).toLowerCase() + code[0].slice(1);
				code[1] = code[1].charAt(0).toUpperCase() + code[1].slice(1);
				if (code[1] != "Rotate")
				{
					code[2] = code[2] == "" ? 1 : code[2];
					for (let i = 0, length = code[2]; i < length; i++)
					{
						this.sequence.push(code[0] + code[1]);
					}
				}
				else
				{
					this.sequence.push(code[0] + code[1] + code[2]);
				}
				this.codeLinesEngine.colorcurrentSequenceLine("correctCode");
				this.loadAnimation();
			}
			else
			{
				this.codeLinesEngine.colorcurrentSequenceLine("wrongCode");

				let error = this.codeLinesEngine.manageError(this.htmlLang);

				this.codeLinesEngine.codeLines = [];

				this.loadGameLost(error);
			}
		}
	}

// SOME MOUSE TOOLS

	getMouseCanvasPos(canvas, event)
	{
		let canvasInfos = canvas.getBoundingClientRect();
		let canvasTop = canvasInfos.top;
		let canvasLeft = canvasInfos.left;

		return [event.clientX - canvasLeft, event.clientY - canvasTop];
	}

	putObjDomOnMouse(obj, event)
	{
		obj.style.left = event.clientX + "px";
		obj.style.top = event.clientY + "px";
	}

// MEASURING DEVICE

	closeMeasure(canvas)
	{
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		let measureMobileIcon = document.getElementById('measureMobile-icon');
		if (measureMobileIcon)
		{
			measureMobileIcon.remove();
		}

		this.isMeasure = false;
		canvas.onmousemove = null;
		canvas.onclick = null;
	}

	drawMeasure(canvas, originX, originY, originCol, originRow)
	{
		let that = this;
		canvas.onclick = null;
		document.getElementById('measureMobile-icon').remove();
		canvas.onmousemove = function(event)
		{
			let ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			let canvasMousePos = that.getMouseCanvasPos(canvas, event)

			// get hypoT
			let posX = canvasMousePos[0];
			let posY = canvasMousePos[1];

			let col = Math.floor(posX / that.map['cellSize']);
			let row = Math.floor(posY / that.map['cellSize']);

			let lengthCol = col - originCol;
			let lengthRow = row - originRow;

			let hypoT = Math.floor(Math.sqrt((lengthCol * lengthCol) + (lengthRow * lengthRow)));

			// get angle
			let angle = Math.atan2(lengthRow - 0, lengthCol - 0) * 180/Math.PI;

			angle = angle < 0 ? angle + 360 : angle;
			angle += 90;
			angle = angle >= 360 ? Math.floor(angle - 360): Math.floor(angle);

			// draw
			ctx.beginPath();
			ctx.moveTo(originX, originY);
			ctx.lineTo(posX, posY);
			ctx.strokeStyle = "blue";
			ctx.stroke();
			ctx.closePath();

			ctx.arc(originX, originY, 10, 0, 2 * Math.PI);
			ctx.fillStyle = "rgba(75, 75, 175, 0.2)";
			ctx.fill();

			ctx.font = "24px Courier";
			ctx.fillStyle = "#e1c6cb";
			ctx.fillText(angle + "°",  originX + 8, originY - 8); 
			ctx.fillText(hypoT, posX, posY); 
		}
		canvas.onclick = function()
		{
			that.closeMeasure(canvas);
		}
	}

	beginMeasure(canvas, e)
	{
		if (this.isMeasure == false)
		{
			let that = this;
			let measureMobileIcon = document.createElement('img');
			measureMobileIcon.setAttribute('id', 'measureMobile-icon')
			measureMobileIcon.setAttribute('src', './assets/img/latte.png')
			measureMobileIcon.classList.add('measureMobile-icon');
			document.body.appendChild(measureMobileIcon);

			this.putObjDomOnMouse(measureMobileIcon, e);

			this.isMeasure = true;

			canvas.onmousemove = function(event)
			{
				that.putObjDomOnMouse(measureMobileIcon, event);
			};

			canvas.onclick = function(event)
			{
				let canvasMousePos = that.getMouseCanvasPos(canvas, event)

				let originCol = Math.floor(canvasMousePos[0] / that.map['cellSize']);
				let originRow = Math.floor(canvasMousePos[1] / that.map['cellSize']);
				let originX = originCol * that.map['cellSize'];
				let originY = originRow * that.map['cellSize'];
				that.drawMeasure(canvas, originX, originY, originCol, originRow);
			};
		}
		else
		{
			this.closeMeasure(canvas);
		}
	}

// INSERT TEXT NAME OBJECT ON CLICK

	insertTextAtCursor(text)
	{
	    let sel, range, html;
	    let codeContainer = document.getElementById('code-container');
	    if (window.getSelection)
	    {
	        sel = window.getSelection();
	        // check if cursor is in code-container
            let isCodeContainerParent = sel;
            while (isCodeContainerParent && isCodeContainerParent != codeContainer)
            {
            	isCodeContainerParent = isCodeContainerParent.focusNode || isCodeContainerParent.parentNode;
            }
            // insert text
	        if (isCodeContainerParent && sel.getRangeAt && sel.rangeCount)
	        {
	            range = sel.getRangeAt(0);
	            range.deleteContents();
	            range.insertNode(document.createTextNode(text));
	        }
	    }
	}

	overObject(canvas, event)
	{
		let that = this;

		let mouseXY = this.getMouseCanvasPos(canvas, event);

		let mouseObj =
		{
			posCol: Math.floor(mouseXY[0] / this.map['cellSize']),
			posRow: Math.floor(mouseXY[1] / this.map['cellSize']),
			cellWidth: 1,
			cellHeight: 1
		}

		canvas.style.cursor = "";

		if (this.isMeasure == false)
		{
			canvas.onclick = null;
		}

		if (this.checkCollisionBetween(mouseObj, this.map['objectList']['player']))
		{
			canvas.style.cursor = "pointer";

			if (this.isMeasure == false)
			{
				canvas.onclick = function()
				{
					that.insertTextAtCursor("Player");
					canvas.onclick = null;
				}
			}
		}
		else if (this.map['objectList']['turtle'] && this.checkCollisionBetween(mouseObj, this.map['objectList']['turtle']))
		{
			canvas.style.cursor = "pointer";

			if (this.isMeasure == false)
			{
				canvas.onclick = function()
				{
					that.insertTextAtCursor("Turtle");
					canvas.onclick = null;
				}
			}
		}
	}

// INTRO AND OUTRO MODAL BOX

	nextMap()
	{	
		let nextLevelBtn = document.getElementById('nextLevel-button');
		let codeContainer = document.getElementById('code-container');

		codeContainer.innerHTML = "";
		this.currentLevel += 1;
		nextLevelBtn.classList.add('hidden');

		// true for loadGameIntro
		let hideContainer = false;
		this.reset(hideContainer);
		this.loadGameIntro();
	}
	
	victoryBox()
	{
		let message = this.htmlLang == "en" ? "The demo is over. Thank you for participating!" : "DEMOはおわりました。ごさんかいただきありがとうございます！";

		let messageContainer = document.getElementById('message-container');
		let messageContent = document.getElementById('message-content');
		let nextLevelBtn = document.getElementById('nextLevel-button');

		if(this.currentLevel < this.map['levelMax'])
		{
			message = this.htmlLang == "en" ? "Good game!" : "いいゲーム";
			nextLevelBtn.classList.remove('hidden');
		}

		messageContent.innerText = message;
		messageContainer.classList.remove('hidden');
	}


	loadGameLost(lostMessage)
	{
		this.codeLinesEngine.codeLines = [];
		this.sequence = [];

		let messageContainer = document.getElementById('message-container');
		let messageContent = document.getElementById('message-content');
		let restartButton = document.getElementById('restart-button');

		messageContent.innerText = lostMessage;

		restartButton.classList.remove('hidden');
		messageContainer.classList.remove('hidden');
	}

	closeGameIntro()
	{
		let messageContainer = document.getElementById('message-container');
		let introButton = document.getElementById('intro-button');
		let codeContainer = document.getElementById('code-container');

		messageContainer.classList.add('hidden');
		introButton.classList.add('hidden');

		codeContainer.focus();
	}

	loadGameIntro()
	{
		let messageContainer = document.getElementById('message-container');
		let messageContent = document.getElementById('message-content');
		let introButton = document.getElementById('intro-button');

		messageContent.innerText = this.htmlLang == "en" ? this.map['introEn'] : this.map['introJp'];
		introButton.classList.remove('hidden');
	}

	showHelp()
	{
		let msgContainer = document.getElementById('message-container');
		let introBtn = document.getElementById('intro-button');

		msgContainer.classList.remove('hidden');
		introBtn.classList.remove('hidden');
		
	}

// INIT AND RESET

	reset(hideContainer = true)
	{
		let events = false;

		let messageContainer = document.getElementById('message-container');
		let restartButton = document.getElementById('restart-button');

		if (hideContainer === true)
		{	
			messageContainer.classList.add('hidden');
		}
		restartButton.classList.add('hidden');

		this.codeLinesEngine.resetColorLines();

		let textarea = document.getElementById('code-container');
		let runButton = document.getElementById('run-button');
		// installtation help button
		let helpButton = document.getElementById('help-button');
		textarea.style = '';
		runButton.style = '';

		if (this.map['objectList']['turtle'])
		{
			clearTimeout(this.map['objectList']['turtle']['idleAnimTempo']);
		}

		this.cleanAllCanvas();

		this.init(events);
	}

	initIdleAnimation(obj)
	{
		obj.idleAnimTempo = setInterval(()=>
		{
			if (obj.imgSrcRow == 0)
			{
				obj['imgSrcCol'] = obj['imgSrcCol'] < obj.animImgLength - 1 ? obj['imgSrcCol'] + 1 : 0;
				this.drawObj(obj);
			}
		}, 600);
	}

	initBushes()
	{
		for (let i = this.map['bushes'].length - 1; i >= 0; i--)
		{
			let bush = this.map['bushes'][i];
			let cellSize = this.map['cellSize'];

			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d');

			bush['cellWidth'] = bush['cellWidth'] < 2 ? 2 : bush['cellWidth'];

			canvas.width = bush['spriteSizeSrcX'] * bush['cellWidth'];
			canvas.height = bush['spriteSizeSrcY'];

			let sX = 0;
			let sY = 0;
			let dX = 0;
			let dY = 0;

			for (let j = 0, length = bush['cellWidth']; j < length; j++)
			{
				if (j > 0 && j < length - 1)
				{
					sX = bush['spriteSizeSrcX'];
				}
				if (j == length - 1)
				{
					sX = 32;
				}
				ctx.drawImage(bush['img'], sX, sY, bush['spriteSizeSrcX'], bush['spriteSizeSrcY'], dX, dY, bush['spriteSizeSrcX'], bush['spriteSizeSrcY']);
				dX += bush['spriteSizeSrcX'];
			}

			bush['spriteSizeSrcX'] = canvas.width;
			bush['img'] = canvas;
		}
	}

	preloadImg(backOnInit)
	{
		let objectList = this.map['objectList'];
		let imgsList = [objectList];
		let imgsLength = Object.keys(objectList).length;

		if (this.map['starsList'])
		{
			let starsList = this.map['starsList'];
			imgsList.push(starsList);
			imgsLength += Object.keys(starsList).length;
		}

		if (this.map['water'])
		{
			let waterImg = this.map['water'];
			imgsList.push({waterImg: waterImg});
			imgsLength += 1;
		}

		if (this.map['bushes'])
		{
			let bushes = this.map['bushes'];
			imgsList.push(bushes);
			imgsLength += Object.keys(bushes).length;
		}

		imgsLength -= 1;

		let index = 0;

		for (let i = imgsList.length - 1; i >= 0; i--)
		{
			for (let objName in imgsList[i])
			{
				imgsList[i][objName].img = new Image();
				imgsList[i][objName].img.onload = () =>
				{
					if(index == imgsLength)
					{
						backOnInit();
					}
					index += 1;
				}
				imgsList[i][objName].img.src = imgsList[i][objName].imgSrc;
			}
		}
	}

	init(events = true)
	{
		this.sequence = [];
		this.map = new Map(this.currentLevel);
		// preload images
		this.preloadImg(() =>
		{
  			// init all objects from this map
			let objsMethods = {};
			let objectList = this.map['objectList'];

			for (let objName in objectList)
			{
				objsMethods[objName] = objectList[objName].getMethods;

	  			// init player
	  			this[objName] = this.map.objectList[objName];
			}

			// init idle animations
			if(this.map['objectList']['turtle'])
			{
				this.initIdleAnimation(this.map['objectList']['turtle']);
			}

			// init brushes
			if(this.map['bushes'])
			{
				this.initBushes();
			}

			// init code system with methods from objects
			this.codeLinesEngine = new CodeLinesEngine(objsMethods);

  			// events
  			if (events == true)
  			{
  				let that = this;

				let runBtn = document.getElementById('run-button');
				runBtn.addEventListener('click', () => { this.checkCode(); }, false);

				window.addEventListener('resize', () => { this.updateCanvasSize(); }, false);
				  
				document.onkeydown = event=>{ if((event.ctrlKey || event.metaKey) && event.keyCode === 13){ this.checkCode(); } };

				let introButton = document.getElementById('intro-button');
				introButton.addEventListener('click', () => { this.closeGameIntro(); }, false);
				  
				let btnHelp = document.getElementById('help-button');
				btnHelp.addEventListener('click', ()=>{ this.showHelp(); }, false);

				let restartButton = document.getElementById('restart-button');
	  			restartButton.addEventListener('click', () => { this.reset(); }, false);

				let uiCanvas = document.getElementById('ui-canvas');
	  			uiCanvas.addEventListener('mousemove', this.overObject.bind(this, uiCanvas), false);

	  			let measureIcon = document.getElementById('measure-icon');
	  			measureIcon.addEventListener('click', this.beginMeasure.bind(this, uiCanvas), false);

	  			let nextLevelBtn = document.getElementById('nextLevel-button');
	  			nextLevelBtn.addEventListener('click', () => { this.nextMap(); }, false);

	  			this.loadGameIntro();
  			}


  			//display game board
  			this.updateCanvasSize();
		});
	}
}

let engine = new Engine();