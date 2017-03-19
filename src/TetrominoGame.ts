enum GameplayState { NONE, LOADING, MENU, PLAY, END }
class TetrominoGame {
	game: Phaser.Game;
	gridTiles: GridTile[][];
	currentTetromino: TetrominoActor;
	nextTetromino: TetrominoActor;
	readonly shapes: ShapeController = new ShapeController();
	readonly nextTetrominoColor: number = Phaser.Color.getColor(50, 50, 50);
	readonly overtoppedColor: number = Phaser.Color.getColor(150, 150, 150);
	readonly colorLookup = [Phaser.Color.getColor(20, 20, 20),	//Default, empty tile color
		Phaser.Color.getColor(241, 196, 15),	//tetromino_O color
		Phaser.Color.getColor(41, 249, 93),		//tetromino_S color
		Phaser.Color.getColor(231, 76, 60),		//tetromino_Z color
		Phaser.Color.getColor(36, 113, 163),	//tetromino_J color
		Phaser.Color.getColor(80, 114, 241),	//tetromino_L color
		Phaser.Color.getColor(142, 68, 173),	//tetromino_T color
		Phaser.Color.getColor(59, 198, 201)];	//tetromino_I color
	readonly gridHorizontalSize = 10;
	readonly gridVerticalSize = 22;
	timeToAllowInput: number = 0;
	readonly inputCooldownTime: number = 150;
	timeOfNextAutoStep: number = 0;
	readonly timeBetweenSteps: number = 500;
	refreshNeeded: boolean = false;
	leftKey: Phaser.Key;
	rightKey: Phaser.Key;
	downKey: Phaser.Key;
	upKey: Phaser.Key;
	restartKey: Phaser.Key;
	gameplayState: GameplayState = GameplayState.PLAY;
	playerScore: number = 0;
	topScore: number = 0;
	playerScoreText: Phaser.Text;
	topScoreText: Phaser.Text;
	messageText: Phaser.Text;
	shapeDict = [];
	constructor() {
		this.game = new Phaser.Game(300, 480, Phaser.CANVAS, 'content', this);
	}
	/**Phaser calls this first. Meant for basic settings and loading assets into memory.*/
	private preload() {
		this.game.load.image('tile', 'assets/tile.png');
		this.game.load.json('shapes', 'http://cartwheelgames.com/demo/tetromino/assets/shapes.json');
	}
	/**Phaser fires this after the preload function, for initializing certain variables.*/
	private create() {
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.minWidth = 300;
		this.game.scale.minHeight = 480;
		this.game.scale.maxWidth = 400;
		this.game.scale.maxHeight = 640;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.stage.backgroundColor = Phaser.Color.getColor(90, 90, 90);
		const topPadding = -8;
		const verticalMargin = 60;
		var gridGroup = this.game.add.group();
		var tileSize = (this.game.height - verticalMargin) / this.gridVerticalSize;
		this.timeOfNextAutoStep = this.game.time.now + this.timeBetweenSteps;
		this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.restartKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
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
		gridGroup.y = this.game.world.centerY - (gridGroup.height * 0.5) - tileSize + topPadding;
		//Text for score / reset message
		var style = { font: "13px Arial", fill: "#FFFFFF", align: "left" };
		this.playerScoreText = this.game.add.text(16, this.game.world.height - 28, "", style);
		this.topScoreText = this.game.add.text(96, this.game.world.height - 28, "", style);
		this.messageText = this.game.add.text(196, this.game.world.height - 28, "R to Restart", style);
		this.refreshScoreDisplay();
		//Parse cached JSON for the shapes
		var shapesJSONCache = this.game.cache.getJSON('shapes');
		this.shapeDict[TetrominoType.O] = shapesJSONCache.O;
		this.shapeDict[TetrominoType.I] = shapesJSONCache.I;
		this.shapeDict[TetrominoType.S] = shapesJSONCache.S;
		this.shapeDict[TetrominoType.Z] = shapesJSONCache.Z;
		this.shapeDict[TetrominoType.J] = shapesJSONCache.J;
		this.shapeDict[TetrominoType.L] = shapesJSONCache.L;
		this.shapeDict[TetrominoType.T] = shapesJSONCache.T;
	}
	/**When restarting the game, reset key variables.*/
	private cleanup() {
		this.currentTetromino = null;
		this.timeToAllowInput = this.game.time.now + this.inputCooldownTime;
		this.timeOfNextAutoStep = this.game.time.now + this.timeBetweenSteps;
		this.playerScore = 0;
		for (var x = 0, xMax = this.gridHorizontalSize; x < xMax; x++) {
			for (var y = 0, yMax = this.gridVerticalSize; y < yMax; y++) {
				this.gridTiles[x][y].setType(TetrominoType.NONE);
				this.gridTiles[x][y].setTint(this.getColorFromIndex(0));
			}
		}
		this.refreshScoreDisplay();
		this.refreshNeeded = true;	//We do need to refresh the visuals after clearing everything
	}
	/**Updates once per frame.*/
	private update() {
		switch (this.gameplayState) {
			default:
			case GameplayState.PLAY:
				if (this.currentTetromino == null) {
					if (this.nextTetromino == null) {
						this.currentTetromino = this.getNewTetromino();
					}
					else {
						this.currentTetromino = this.nextTetromino;
					}
					this.timeOfNextAutoStep = this.game.time.now + this.timeBetweenSteps;
					this.timeToAllowInput = this.game.time.now + this.inputCooldownTime;
					this.nextTetromino = this.getNewTetromino();
				} else {
					this.handleInput();
					if (this.game.time.now > this.timeOfNextAutoStep) {
						this.timeOfNextAutoStep = this.game.time.now + this.timeBetweenSteps;
						if (!this.tryShiftCurrentTetromino(0, -1)) {
							this.finalizeTetromino();
						}
						this.refreshNeeded = true;
					}
				}
				break;
			case GameplayState.END:
				if (this.restartKey.justDown) {
					this.cleanup();
					this.gameplayState = GameplayState.PLAY;
				}
				break;
		}
	}
	/**Generates data for a new Tetromino.*/
	private getNewTetromino() {
		const numberOfValidShapes = 7;
		var type: TetrominoType = Math.floor(Math.random() * numberOfValidShapes) + 1;
		var shape: number[][] = this.shapes.getShape(type);
		var spawnX = this.getRandomSpawnX(type);
		var spawnY: number = this.gridVerticalSize - (shape[1].length - 2);
		return new TetrominoActor(type, spawnX, spawnY);
	}
	/**According to the offical Tetris ruleset, O and I Tetrominos spawn in the center, while the others spawn in the center-left.*/
	private getRandomSpawnX(type: TetrominoType) {
		const spawnAreaCellWidth = 4;
		const centerOffset = 2;
		const leftCenterOffset = 4;
		var center = Math.floor(this.gridHorizontalSize * 0.5);
		var offset = (type == TetrominoType.O || type == TetrominoType.I) ? centerOffset : leftCenterOffset;
		return center + (Math.floor(Math.random() * spawnAreaCellWidth) - offset);
	}
	/**Detects and processes input for the Play game state.*/
	private handleInput() {
		if (this.currentTetromino != null && this.game.time.now > this.timeToAllowInput) {
			if (this.downKey.isDown) {
				if (this.tryDropCurrentTetromino()) {
					this.onInputApplied();
					this.timeOfNextAutoStep = this.game.time.now + this.timeBetweenSteps;
				}
			}
			else if (this.upKey.isDown) {
				if (this.tryRotateCurrentTetromino()) {
					this.onInputApplied();
				}
			}
			else if (this.rightKey.isDown) {
				if (this.tryShiftCurrentTetromino(1, 0)) {
					this.onInputApplied();
				}
			}
			else if (this.leftKey.isDown) {
				if (this.tryShiftCurrentTetromino(-1, 0)) {
					this.onInputApplied();
				}
			}
			else if (this.restartKey.justDown) {
				this.cleanup();
			}
		}
	}
	/**Rotates the current Tetromino, if possible.*/
	private tryRotateCurrentTetromino() {
		if (this.currentTetromino != null) {
			var newRotation: number = this.currentTetromino.rotation + 1;
			if (newRotation >= 4) {
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
	/**Processes all movement for the currentTetromino.*/
	private tryShiftCurrentTetromino(x: number, y: number) {
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
	/**Will attempt to drop the currentTetromino to its lowest possible point.*/
	private tryDropCurrentTetromino() {
		var newY: number = this.currentTetromino.y;
		if (this.currentTetromino != null) {
			for (var i = this.currentTetromino.y - 1; i >= -2; i--) {
				if (this.getIsTetrominoFreeAtProjectedPosition(this.currentTetromino.type, this.currentTetromino.rotation, this.currentTetromino.x, i)) {
					newY = i;
				}
				else {
					break;
				}
			}
		}
		if (newY != this.currentTetromino.y) {
			return this.tryShiftCurrentTetromino(0, newY - this.currentTetromino.y);
		}
		return false;
	}
	/**Checks to see if a hypothetical Tetromino would fit in a given position.*/
	private getIsTetrominoFreeAtProjectedPosition(type: TetrominoType, rotation: number, originX: number, originY: number) {
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
					if (projectedPosX < 0 || projectedPosX >= this.gridHorizontalSize || projectedPosY < 0) {
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
	/**Fire whenever player input has been successfully applied during the game.*/
	private onInputApplied() {
		this.refreshNeeded = true;
		this.timeToAllowInput = this.game.time.now + this.inputCooldownTime;
	}
	/**When the currentTetromino cannot descend any further, copy its data to the grid and unset its variable.*/
	private finalizeTetromino() {
		var currentTetrominoTiles: GridTile[];
		if (this.currentTetromino != null) {
			currentTetrominoTiles = this.getTilesAtTetromino(this.currentTetromino);
			if (currentTetrominoTiles != null && currentTetrominoTiles.length > 0) {
				currentTetrominoTiles.forEach(tile => {
					if (tile != null) {
						tile.setType(this.currentTetromino.type);
					} else {
						this.gameplayState = GameplayState.END;
						this.refreshNeeded = true;
					}
				});
			}
			this.clearCompletedRows();
			this.currentTetromino = null;
		}
	}
	private clearCompletedRows() {
		var tile: GridTile;
		for (var y = 0, yMax = this.gridVerticalSize; y < yMax; y++) {
			for (var x = 0, xMax = this.gridHorizontalSize; x < xMax; x++) {
				tile = this.getTileAtCoordinate(x, y);
				if (tile != null) {
					if (tile.type == TetrominoType.NONE)	//Don't clear this row, has an empty space.
					{
						break;
					}
					else if (x == xMax - 1)	//No empty spaces on the row, can clear it.
					{
						this.dropGridAboveRow(y);
						this.scorePoint();
						y = -1
						x = -1;	//Restart the loops to clear / shift more rows.
					}
				}
			}
		}
	}
	/**Really only shifts the rows above target row down by one.*/
	private dropGridAboveRow(targetRow: number) {
		var tile: GridTile;
		var aboveTile: GridTile;
		for (var x = 0, xMax = this.gridHorizontalSize; x < xMax; x++) {
			for (var y = targetRow, yMax = this.gridVerticalSize; y < yMax; y++) {
				tile = this.getTileAtCoordinate(x, y);
				aboveTile = this.getTileAtCoordinate(x, y + 1);
				if (tile != null) {
					if (aboveTile != null) {
						tile.setType(aboveTile.type);
					}
					else {
						tile.setType(TetrominoType.NONE);
					}
				}
			}
		}
	}
	private scorePoint() {
		this.playerScore++;
		if (this.playerScore > this.topScore) {
			this.topScore = this.playerScore;
		}
		this.refreshScoreDisplay();
	}
	/**Updates the current and top score dialogs.*/
	private refreshScoreDisplay() {
		this.playerScoreText.text = "Score: " + this.playerScore;
		this.topScoreText.text = "Top Score: " + this.topScore;
	}
	//#region Render the Grid and Tetronimos
	private render() {
		if (this.refreshNeeded) {
			this.refreshGrid();
			if (this.nextTetromino != null && this.gameplayState == GameplayState.PLAY) {
				this.drawNextTetronimo();
			}
			if (this.currentTetromino != null && this.gameplayState == GameplayState.PLAY) {
				this.drawCurrentTetronimo();
			}
			this.refreshNeeded = false;
		}
	}
	/**Redraws the grid background and landed bricks. nextTetromino and currentTetromino not included in this pass.*/
	private refreshGrid() {
		var color: number;
		for (var x = 0, xMax = this.gridHorizontalSize; x < xMax; x++) {
			for (var y = 0, yMax = this.gridVerticalSize; y < yMax; y++) {
				var tile = this.getTileAtCoordinate(x, y);
				if (tile != null) {
					//When the player is overtopping the grid, render the tiles as grey.
					if (this.gameplayState == GameplayState.END && tile.type != TetrominoType.NONE)
					{
						color = this.overtoppedColor;
					}
					else
					{
						color = this.getColorFromIndex(tile.type)
					}
					if (tile.getTint() != color) {
						tile.setTint(color);
					}
				}
			}
		}
	}
	/**Draws the nextTetronimo. Reusing some spaces in the upper left corner rather than add more hud elements. */
	private drawNextTetronimo() {
		var color: number;
		const horizontalOffset: number = 1;
		var verticalOffset: number;
		var tiles: GridTile[];
		if (this.nextTetromino != null) {
			var shape: number[][] = this.shapes.getShape(this.nextTetromino.type);
			verticalOffset = this.gridVerticalSize - (shape[1].length + 1);
			tiles = this.getTilesAtProjectedTetromino(this.nextTetromino.type, 0, horizontalOffset, verticalOffset);
			color = this.nextTetrominoColor;
			tiles.forEach(tile => {
				if (tile != null && tile.getTint() == this.getColorFromIndex(0)) {
					tile.setTint(color);
				}
			});
		}
	}
	/**Draws the currentTetronimo in its specified position.*/
	private drawCurrentTetronimo() {
		var color: number;
		var tiles: GridTile[] = this.getTilesAtTetromino(this.currentTetromino);
		if (tiles != null && tiles.length > 0) {
			color = this.getColorFromIndex(this.currentTetromino.type);
			tiles.forEach(tile => {
				if (tile != null && tile.getTint() != color) {
					tile.setTint(color);
				}
			});
		}
	}
	//#endregion
	/**Gets an array of all tiles that would overlap with a tetromino given its current position/rotation.*/
	private getTilesAtTetromino(tetromino: TetrominoActor) {
		return this.getTilesAtProjectedTetromino(tetromino.type, tetromino.rotation, tetromino.x, tetromino.y);
	}
	/**Gets an array of all tiles that would overlap with a tetromino at a given point and rotation.*/
	private getTilesAtProjectedTetromino(type: TetrominoType, rotation: number, originX: number, originY: number) {
		var outputTiles : GridTile[] = [];
		var tetrominoPosX : number;
		var tetrominoPosY : number;
		var tile : GridTile;
		var shape : number[][] = this.shapes.getShape(type, rotation);
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
	/**Return a specific tile from a given x,y coordinate set, with bounds checking.*/
	private getTileAtCoordinate(x: number, y: number) {
		if (x >= 0 && x < this.gridHorizontalSize) {
			if (y >= 0 && y < this.gridVerticalSize) {
				if (this.gridTiles[x][y] != null) {
					return this.gridTiles[x][y];
				}
			}
		}
		return null;
	}
	/**Gets color from an index corresponding to a tyle type value, with bounds checking.*/
	private getColorFromIndex(index: number) {
		if (index >= 0 || index < this.colorLookup.length) {
			return this.colorLookup[index];
		}
		return this.colorLookup[0];
	}
}
window.onload = () => {
	var game = new TetrominoGame();
}
