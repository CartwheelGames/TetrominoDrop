class TetrominoGame {
	game: Phaser.Game;
	gridTiles: GridTile[][];
	currentTetromino: TetrominoActor;
	shapes: ShapeController = new ShapeController();
	colorLookup = [Phaser.Color.getColor(20, 20, 20),	//Default, empty tile
	Phaser.Color.getColor(255, 128, 128),	//tetromino_O
	Phaser.Color.getColor(255, 128, 128),	//tetromino_S
	Phaser.Color.getColor(255, 128, 128),	//tetromino_Z
	Phaser.Color.getColor(255, 128, 128),	//tetromino_J
	Phaser.Color.getColor(255, 200, 128),	//tetromino_L
	Phaser.Color.getColor(255, 128, 200),	//tetromino_T
	Phaser.Color.getColor(128, 200, 255)];	//tetromino_I
	readonly gridHorizontalSize = 10;
	readonly gridVerticalSize = 22;
	timeToAllowInput: number = 0;
	readonly inputCooldownTime: number = 100;
	timeOfNextAutoStep: number = 0;
	readonly timeBetweenSteps: number = 500;
	refreshNeeded: boolean = false;
	leftKey: Phaser.Key;
	rightKey: Phaser.Key;
	downKey: Phaser.Key;
	upKey: Phaser.Key;
	constructor() {
		this.game = new Phaser.Game(300, 480, Phaser.CANVAS, 'content', this);
	}
	preload() {
		// this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// this.game.scale.minWidth = 480;
		// this.game.scale.minHeight = 260;
		// this.game.scale.maxWidth = 1024;
		// this.game.scale.maxHeight = 768;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.stage.backgroundColor = 0xB2FFFF;
		this.game.load.image('tile', 'assets/tile.png');
		this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
	}
	create() {
		const topMargin = 16;
		const bottomMargin = 16;
		var gridGroup = this.game.add.group();
		var tileSize = (this.game.height - (topMargin + bottomMargin)) / this.gridVerticalSize;
		//Populate grid with tiles
		this.gridTiles = [];
		for (var x = 0, xMax = this.gridHorizontalSize; x < xMax; x++) {
			this.gridTiles[x] = [];
			for (var y = 0, yMax = this.gridVerticalSize; y < yMax; y++) {
				var tileSprite = this.game.add.sprite(tileSize * x, tileSize * (this.gridVerticalSize - y), 'tile');
				tileSprite.tint = this.getColorFromIndex(0);
				gridGroup.add(tileSprite);
				tileSprite.width = tileSize;
				tileSprite.height = tileSize;
				this.gridTiles[x][y] = new GridTile(tileSprite);
			}
		}
		//Center the grid group on the screen
		gridGroup.x = this.game.world.centerX - (gridGroup.width * 0.5);
		gridGroup.y = this.game.world.centerY - (gridGroup.height * 0.5) - tileSize;
	}
	update() {
		if (this.currentTetromino == null) {
			this.currentTetromino = this.getNewTetromino();
		}
		else {
			this.handleInput();
			if (this.game.time.now > this.timeOfNextAutoStep) {
				this.timeOfNextAutoStep = this.game.time.now + this.timeBetweenSteps;
				if (!this.tryShiftTetromino(0, -1)) {
					this.finalizeTetromino();
				}
				this.refreshNeeded = true;
			}
		}
	}
	getNewTetromino() {
		const spawnY = this.gridVerticalSize;
		const numberOfValidShapes = 7;
		var type: TetrominoType = Math.floor(Math.random() * numberOfValidShapes) + 1;
		var spawnX = this.getRandomSpawnX(type);
		this.timeOfNextAutoStep = this.game.time.now + this.timeBetweenSteps;
		return new TetrominoActor(type, spawnX, spawnY);
	}
	/**According to the offical Tetris ruleset, O and I Tetrominos spawn in the center, while the others spawn in the center-left.*/
	getRandomSpawnX(type: TetrominoType) {
		const spawnAreaCellWidth = 4;
		const centerOffset = 2;
		const leftCenterOffset = 4;
		var center = Math.floor(this.gridHorizontalSize * 0.5);
		var offset = (type == TetrominoType.O || type == TetrominoType.I) ? centerOffset : leftCenterOffset;
		return center + (Math.floor(Math.random() * spawnAreaCellWidth) - offset);
	}
	handleInput() {
		if (this.currentTetromino != null && this.game.time.now > this.timeToAllowInput) {
			if (this.downKey.isDown) {
			}
			else if (this.upKey.isDown) {
				if (this.tryRotateTetromino()) {
					this.onInputApplied();
				}
			}
			else if (this.rightKey.isDown) {
				if (this.tryShiftTetromino(1, 0)) {
					this.onInputApplied();
				}
			}
			else if (this.leftKey.isDown) {
				if (this.tryShiftTetromino(-1, 0)) {
					this.onInputApplied();
				}
			}
		}
	}
	tryRotateTetromino() {
		if (this.currentTetromino != null) {
			var newRotation:number = this.currentTetromino.rotation + 1;
			if (newRotation >= 4)
			{
				newRotation = 0;
			}
			if (this.getIsTetrominoFreeAtProjectedPosition(this.currentTetromino.type,
					newRotation,
					this.currentTetromino.x,
					this.currentTetromino.y)) {
				this.currentTetromino.rotation = newRotation;
				return true;
			}
		}
		return false;
	}
	tryShiftTetromino(x: number, y: number) {
		if (this.currentTetromino != null) {
			if (this.getIsTetrominoFreeAtProjectedPosition(this.currentTetromino.type,
					this.currentTetromino.rotation,
					this.currentTetromino.x + x,
					this.currentTetromino.y + y)) {
				this.currentTetromino.x += x;
				this.currentTetromino.y += y;
				return true;
			}
		}
		return false;
	}
	onInputApplied() {
		this.refreshNeeded = true;
		this.timeToAllowInput = this.game.time.now + this.inputCooldownTime;
	}
	finalizeTetromino()
	{
		if (this.currentTetromino != null) {
			var currentTetrominoTiles: GridTile[] = this.getTilesAtTetromino(this.currentTetromino);
			if (currentTetrominoTiles != null && currentTetrominoTiles.length > 0) {
				currentTetrominoTiles.forEach(tile => {
					if (tile != null)
					{
						tile.setType(this.currentTetromino.type);
					}
				});
			}
			this.currentTetromino = null;
		}
	}
	getIsTetrominoFreeAtProjectedPosition(type:TetrominoType, rotation:number, originX: number, originY: number) {
		var projectedPosX: number;
		var projectedPosY: number;
		var tile: GridTile;
		var shape: number[][] = this.shapes.getShape(type, rotation);
		var shapeMax = shape[0].length;	//Width and height of the shape's field should be the same
		for (var x = 0; x < shapeMax; x++) {
			for (var y = 0; y < shapeMax; y++) {
				if (shape[x][y] > 0) {
					projectedPosX = x + originX;
					projectedPosY = y + originY;
					 if (projectedPosX < 0 || projectedPosX >= this.gridHorizontalSize || projectedPosY < 0)
					{
					 	return false;
					}
					tile = this.getTileAtCoordinate(projectedPosX, projectedPosY);
					if (projectedPosY < this.gridVerticalSize && (tile == null || tile.type != 0)) {
						return false;
					}
				}
			}
		}
		return true;
	}
	render() {
		if (this.refreshNeeded) {
			this.refreshGrid();
			if (this.currentTetromino != null) {
				this.drawCurrentTetronimo();
			}
			this.refreshNeeded = false;
		}
	}
	refreshGrid() {
		var color: number;
		for (var x = 0, xMax = this.gridHorizontalSize; x < xMax; x++) {
			for (var y = 0, yMax = this.gridVerticalSize; y < yMax; y++) {
				var tile = this.getTileAtCoordinate(x, y);
				if (tile != null) {
					color = this.getColorFromIndex(tile.type);
					if (tile.getTint() != color) {
						tile.setTint(color);
					}
				}
			}
		}
	}
	drawCurrentTetronimo() {
		var color: number;
		var currentTetrominoTiles:GridTile[] = this.getTilesAtTetromino(this.currentTetromino);
		if (currentTetrominoTiles != null && currentTetrominoTiles.length > 0)
		{
			color = this.getColorFromIndex(this.currentTetromino.type);
			currentTetrominoTiles.forEach(tile => {
				if (tile != null && tile.getTint() != color)
				{
					tile.setTint(color);
				}
			});
		}
	}
	getTilesAtTetromino(tetromino:TetrominoActor)
	{
		return this.getTilesAtProjectedTetromino(tetromino.type, tetromino.rotation, tetromino.x, tetromino.y);
	}
	getTilesAtProjectedTetromino(type:TetrominoType, rotation:number, originX:number, originY:number)
	{
		var outputTiles: GridTile[] = [];
		var tetrominoPosX: number;
		var tetrominoPosY: number;
		var tile: GridTile;
		var shape: number[][] = this.shapes.getShape(type, rotation);
		var shapeMax = shape[0].length;	//Width and height of the shape's field should be the same
		for (var x = 0; x < shapeMax; x++) {
			for (var y = 0; y < shapeMax; y++) {
				if (shape[x][y] > 0) {
					tetrominoPosX = originX + x;
					tetrominoPosY = originY + y;
					tile = this.getTileAtCoordinate(tetrominoPosX, tetrominoPosY);
					outputTiles.push(tile);
				}
			}
		}
		return outputTiles;
	}
	getTileAtCoordinate(x: number, y: number) {
		if (x >= 0 && x < this.gridHorizontalSize) {
			if (y >= 0 && y < this.gridVerticalSize) {
				if (this.gridTiles[x][y] != null)
				{
					return this.gridTiles[x][y];
				}
			}
		}
		return null;
	}
	/**Gets color from an index corresponding to a tyle type value, with bounds checking.*/
	getColorFromIndex(index: number) {
		if (index >= 0 || index < this.colorLookup.length) {
			return this.colorLookup[index];
		}
		return this.colorLookup[0];
	}
}
window.onload = () => {
	var game = new TetrominoGame();
}
