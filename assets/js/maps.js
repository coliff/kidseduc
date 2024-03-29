class Map
{
	constructor(currentMap)
	{
		this.levelMax = 5;
		if (currentMap == 1)
		{
			this.canvas = document.getElementById('board-canvas');
			this.ctx = this.canvas.getContext('2d');

			this.cellSize = 16;
			this.rowsLength = 21,
			this.colsLength = 21,
			this.cellsInfos = [],

			this.introEn = "1. Use the \"moveFront(12)\" command to reach the star... the value in parenthese is the number of steps.";
			this.introJp = "\"moveFront (12)\"コマンドをつかってスターにとうたつしてください";

			this.shortcutsName = ["move front"];
			this.shortcutsCommand = ["moveFront()"];

			this.objectList =
			{
				player: new Player(Math.floor((this.rowsLength / 5) * 4), Math.floor(this.colsLength / 2))
			}

			this.starsList = 
			{
				star1: new Star(Math.floor(this.rowsLength / 5), Math.floor((this.colsLength / 6) * 3))
			}
		}
		else if (currentMap == 2)
		{
			this.canvas = document.getElementById('board-canvas');
			this.ctx = this.canvas.getContext('2d');

			this.cellSize = 16;
			this.rowsLength = 21,
			this.colsLength = 21,
			this.cellsInfos = [],

			this.introEn = "2. Use \"move Back ()\" to go backwards. Do not forget to add the number of steps in parentheses.";
			this.introJp = "うしろにいどうするには \"move Back（）\"をつかってください。（）をついかすることをわすれないでください";

			this.shortcutsName = ["move front", "move back"];
			this.shortcutsCommand = ["moveFront()", "moveBack()"];

			this.objectList =
			{
				player: new Player(Math.floor(this.rowsLength / 2), Math.floor(this.colsLength / 2))
			}

			this.starsList = 
			{
				star1: new Star(Math.floor(this.rowsLength / 5), Math.floor(this.colsLength / 2)),
				star2: new Star(Math.floor(this.rowsLength / 5 * 4), Math.floor(this.colsLength / 2))
			}
		}
		else if (currentMap == 3)
		{
			this.canvas = document.getElementById('board-canvas');
			this.ctx = this.canvas.getContext('2d');

			this.cellSize = 16;
			this.rowsLength = 21,
			this.colsLength = 21,
			this.cellsInfos = [],

			this.introEn = "3. Use the \"rotateRight()\" or \"rotateLeft()\" to reach the star... the value in parenthese is the number of turn.";
			this.introJp = "ほしにとうたつするには \"rotateRight（）\"または \"rotateLeft（）\"をつかってください。";

			this.shortcutsName = ["move front", "move back", "turn right", "turn left"];
			this.shortcutsCommand = ["moveFront()", "moveBack()", "rotateRight()", "rotateLeft()"];

			this.objectList =
			{
				player: new Player(Math.floor(this.rowsLength / 2), Math.floor(this.colsLength / 2))
			}

			this.starsList = 
			{
				star1: new Star(Math.floor(this.rowsLength / 2), Math.floor(this.colsLength / 6)),
				star2: new Star(Math.floor(this.rowsLength / 2), Math.floor((this.colsLength / 6) * 5))
			}
		}
		else if (currentMap == 4)
		{
			this.canvas = document.getElementById('board-canvas');
			this.ctx = this.canvas.getContext('2d');

			this.cellSize = 16;
			this.rowsLength = 21,
			this.colsLength = 21,
			this.cellsInfos = [],

			this.introEn = "4. Use \"rotate()\" with the right angle between parentheses... use the measuring device at the top left to help you!";
			this.introJp = "「rotate（）」をつかってかくどをかえてください。（）のなかにかくどのすうじをいれてください。";

			this.shortcutsName = ["move front", "move back", "turn right", "turn left", "rotation"];
			this.shortcutsCommand = ["moveFront()", "moveBack()", "rotateRight()", "rotateLeft()", "rotate()"];


			this.bushes = [new Bushes(Math.floor(this.rowsLength / 2), Math.floor(this.colsLength / 2), 4)];

			this.objectList =
			{
				player: new Player(Math.floor((this.rowsLength / 5) * 4), Math.floor(this.colsLength / 2))
			}

			this.starsList = 
			{
				star1: new Star(Math.floor(this.rowsLength / 2), Math.floor(this.colsLength / 6)),
				star2: new Star(Math.floor(this.rowsLength / 5), Math.floor(this.colsLength / 2)),
				star3: new Star(Math.floor(this.rowsLength / 2), Math.floor((this.colsLength / 6) * 5))
			}
		}
		else if (currentMap == 5)
		{
			this.canvas = document.getElementById('board-canvas');
			this.ctx = this.canvas.getContext('2d');

			this.cellSize = 16;
			this.rowsLength = 21,
			this.colsLength = 21,
			this.cellsInfos = [],

			this.introEn = "5. Use the turtle to cross the river... You can advance the turtle like this \"Turtle.moveFront(6)\"";
			this.introJp = "かわをわたるためにかめをつかう。。。あなたはこのようにかめをすすめることができます";

			this.shortcutsName = ["move front"];
			this.shortcutsCommand = ["moveFront"];

			this.water = new Water(Math.floor(this.rowsLength / 2), Math.floor(this.colsLength / 2));
			/*this.water['cellHeight'] = this.water['spriteSizeSrcY'] / this.cellSize;
			this.water['cellWidth'] = this.water['spriteSizeSrcX'] / this.cellSize;*/

			this.objectList =
			{
				player: new Player(Math.floor((this.rowsLength / 5) * 4), Math.floor(this.colsLength / 2)),
				turtle: new Turtle()
			}
			this.objectList['turtle']['posRow'] = Math.floor(this.water['posRow']);
			this.objectList['turtle']['posCol'] = Math.floor(this.colsLength / 5);

			this.starsList = 
			{
				star1: new Star(Math.floor(this.rowsLength / 5), Math.floor(this.colsLength / 6)),
				star2: new Star(Math.floor(this.rowsLength / 5), Math.floor((this.colsLength / 6) * 3)),
				star3: new Star(Math.floor(this.rowsLength / 5), Math.floor((this.colsLength / 6) * 5))
			}
		}
	}
}