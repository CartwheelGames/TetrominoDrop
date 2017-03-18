var GridTile = (function () {
    function GridTile(sprite) {
        this.type = 0;
        this.sprite = sprite;
    }
    GridTile.prototype.getTint = function () {
        return this.sprite.tint;
    };
    GridTile.prototype.setTint = function (tint) {
        this.sprite.tint = tint;
    };
    GridTile.prototype.setType = function (type) {
        this.type = type;
    };
    return GridTile;
}());
//This would normally be a json file, easier to test on a desktop in a ts file because of browser restrictions on opening XML/JSON data
var ShapeController = (function () {
    function ShapeController() {
        this.shapeDict = [];
        this.shapeDict[TetrominoType.O] =
            [
                [
                    [1, 1],
                    [1, 1]
                ],
                [
                    [1, 1],
                    [1, 1]
                ],
                [
                    [1, 1],
                    [1, 1]
                ],
                [
                    [1, 1],
                    [1, 1]
                ]
            ];
        this.shapeDict[TetrominoType.I] =
            [
                [
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0]
                ],
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0]
                ],
                [
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0]
                ],
                [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
            ];
        this.shapeDict[TetrominoType.S] =
            [
                [
                    [0, 1, 0],
                    [0, 1, 1],
                    [0, 0, 1]
                ],
                [
                    [0, 0, 0],
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                [
                    [1, 0, 0],
                    [1, 1, 0],
                    [0, 1, 0]
                ],
                [
                    [0, 1, 1],
                    [1, 1, 0],
                    [0, 0, 0]
                ]
            ];
        this.shapeDict[TetrominoType.Z] =
            [
                [
                    [0, 0, 1],
                    [0, 1, 1],
                    [0, 1, 0]
                ],
                [
                    [0, 0, 0],
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                [
                    [0, 1, 0],
                    [1, 1, 0],
                    [1, 0, 0]
                ],
                [
                    [1, 1, 0],
                    [0, 1, 1],
                    [0, 0, 0]
                ]
            ];
        this.shapeDict[TetrominoType.T] =
            [
                [
                    [0, 1, 0],
                    [0, 1, 1],
                    [0, 1, 0]
                ],
                [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 1, 0]
                ],
                [
                    [0, 1, 0],
                    [1, 1, 0],
                    [0, 1, 0]
                ],
                [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ]
            ];
        this.shapeDict[TetrominoType.L] =
            [
                [
                    [0, 1, 0],
                    [0, 1, 0],
                    [0, 1, 1]
                ],
                [
                    [0, 0, 0],
                    [1, 1, 1],
                    [1, 0, 0]
                ],
                [
                    [1, 1, 0],
                    [0, 1, 0],
                    [0, 1, 0]
                ],
                [
                    [0, 0, 1],
                    [1, 1, 1],
                    [0, 0, 0]
                ]
            ];
        this.shapeDict[TetrominoType.J] =
            [
                [
                    [0, 1, 1],
                    [0, 1, 0],
                    [0, 1, 0]
                ],
                [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 0, 1]
                ],
                [
                    [0, 1, 0],
                    [0, 1, 0],
                    [1, 1, 0]
                ],
                [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ]
            ];
    }
    ShapeController.prototype.getShape = function (type, rotationIndex) {
        if (rotationIndex === void 0) { rotationIndex = 0; }
        return this.shapeDict[type][rotationIndex];
    };
    return ShapeController;
}());
var TetrominoType;
(function (TetrominoType) {
    TetrominoType[TetrominoType["NONE"] = 0] = "NONE";
    TetrominoType[TetrominoType["O"] = 1] = "O";
    TetrominoType[TetrominoType["S"] = 2] = "S";
    TetrominoType[TetrominoType["Z"] = 3] = "Z";
    TetrominoType[TetrominoType["J"] = 4] = "J";
    TetrominoType[TetrominoType["L"] = 5] = "L";
    TetrominoType[TetrominoType["T"] = 6] = "T";
    TetrominoType[TetrominoType["I"] = 7] = "I";
})(TetrominoType || (TetrominoType = {}));
var TetrominoActor = (function () {
    function TetrominoActor(type, x, y) {
        this.rotation = 0;
        this.type = type;
        this.x = x;
        this.y = y;
    }
    return TetrominoActor;
}());
var GameplayState;
(function (GameplayState) {
    GameplayState[GameplayState["NONE"] = 0] = "NONE";
    GameplayState[GameplayState["LOADING"] = 1] = "LOADING";
    GameplayState[GameplayState["MENU"] = 2] = "MENU";
    GameplayState[GameplayState["PLAY"] = 3] = "PLAY";
    GameplayState[GameplayState["END"] = 4] = "END";
})(GameplayState || (GameplayState = {}));
var TetrominoGame = (function () {
    function TetrominoGame() {
        this.shapes = new ShapeController();
        this.colorLookup = [Phaser.Color.getColor(20, 20, 20),
            Phaser.Color.getColor(23, 167, 255),
            Phaser.Color.getColor(12, 232, 25),
            Phaser.Color.getColor(255, 255, 0),
            Phaser.Color.getColor(232, 66, 12),
            Phaser.Color.getColor(185, 13, 255),
            Phaser.Color.getColor(73, 84, 255),
            Phaser.Color.getColor(208, 255, 50)]; //tetromino_I
        this.gridHorizontalSize = 10;
        this.gridVerticalSize = 22;
        this.timeToAllowInput = 0;
        this.inputCooldownTime = 250;
        this.timeOfNextAutoStep = 0;
        this.timeBetweenSteps = 500;
        this.refreshNeeded = false;
        this.isOvertopped = false;
        this.gameplayState = GameplayState.PLAY;
        this.playerScore = 0;
        this.topScore = 0;
        this.game = new Phaser.Game(300, 480, Phaser.CANVAS, 'content', this);
    }
    TetrominoGame.prototype.preload = function () {
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
        this.restartKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    };
    TetrominoGame.prototype.create = function () {
        var topMargin = 16;
        var bottomMargin = 16;
        var gridGroup = this.game.add.group();
        var tileSize = (this.game.height - (topMargin + bottomMargin)) / this.gridVerticalSize;
        this.timeOfNextAutoStep = this.game.time.now + this.timeBetweenSteps;
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
    };
    TetrominoGame.prototype.cleanup = function () {
        this.currentTetromino = null;
        this.timeToAllowInput = this.game.time.now + this.inputCooldownTime;
        this.timeOfNextAutoStep = this.game.time.now + this.timeBetweenSteps;
        this.isOvertopped = false;
        this.playerScore = 0;
        for (var x = 0, xMax = this.gridHorizontalSize; x < xMax; x++) {
            for (var y = 0, yMax = this.gridVerticalSize; y < yMax; y++) {
                this.gridTiles[x][y].setType(TetrominoType.NONE);
                this.gridTiles[x][y].setTint(this.getColorFromIndex(0));
            }
        }
        this.refreshNeeded = true; //We do need to refresh the visuals after clearing everything
    };
    TetrominoGame.prototype.update = function () {
        switch (this.gameplayState) {
            default:
            case GameplayState.PLAY:
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
                break;
            case GameplayState.END:
                if (this.restartKey.justDown) {
                    this.cleanup();
                    this.gameplayState = GameplayState.PLAY;
                }
                break;
        }
    };
    TetrominoGame.prototype.getNewTetromino = function () {
        var spawnY = this.gridVerticalSize;
        var numberOfValidShapes = 7;
        var type = Math.floor(Math.random() * numberOfValidShapes) + 1;
        var spawnX = this.getRandomSpawnX(type);
        this.timeOfNextAutoStep = this.game.time.now + this.timeBetweenSteps;
        return new TetrominoActor(type, spawnX, spawnY);
    };
    /**According to the offical Tetris ruleset, O and I Tetrominos spawn in the center, while the others spawn in the center-left.*/
    TetrominoGame.prototype.getRandomSpawnX = function (type) {
        var spawnAreaCellWidth = 4;
        var centerOffset = 2;
        var leftCenterOffset = 4;
        var center = Math.floor(this.gridHorizontalSize * 0.5);
        var offset = (type == TetrominoType.O || type == TetrominoType.I) ? centerOffset : leftCenterOffset;
        return center + (Math.floor(Math.random() * spawnAreaCellWidth) - offset);
    };
    TetrominoGame.prototype.handleInput = function () {
        if (this.currentTetromino != null && this.game.time.now > this.timeToAllowInput) {
            if (this.downKey.isDown) {
                if (this.tryDropTetromino()) {
                    this.onInputApplied();
                }
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
            else if (this.restartKey.justDown) {
                this.cleanup();
            }
        }
    };
    TetrominoGame.prototype.tryRotateTetromino = function () {
        if (this.currentTetromino != null) {
            var newRotation = this.currentTetromino.rotation + 1;
            if (newRotation >= 4) {
                newRotation = 0;
            }
            if (this.getIsTetrominoFreeAtProjectedPosition(this.currentTetromino.type, newRotation, this.currentTetromino.x, this.currentTetromino.y)) {
                this.currentTetromino.rotation = newRotation;
                return true;
            }
        }
        return false;
    };
    TetrominoGame.prototype.tryShiftTetromino = function (x, y) {
        if (this.currentTetromino != null) {
            if (this.getIsTetrominoFreeAtProjectedPosition(this.currentTetromino.type, this.currentTetromino.rotation, this.currentTetromino.x + x, this.currentTetromino.y + y)) {
                this.currentTetromino.x += x;
                this.currentTetromino.y += y;
                return true;
            }
        }
        return false;
    };
    TetrominoGame.prototype.tryDropTetromino = function () {
        var newY = this.currentTetromino.y;
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
            return this.tryShiftTetromino(0, newY - this.currentTetromino.y);
        }
        return false;
    };
    TetrominoGame.prototype.getIsTetrominoFreeAtProjectedPosition = function (type, rotation, originX, originY) {
        var projectedPosX;
        var projectedPosY;
        var tile;
        var shape = this.shapes.getShape(type, rotation);
        var shapeMax = shape[0].length; //Width and height of the shape's field should be the same
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
    };
    TetrominoGame.prototype.onInputApplied = function () {
        this.refreshNeeded = true;
        this.timeToAllowInput = this.game.time.now + this.inputCooldownTime;
        this.timeOfNextAutoStep = this.game.time.now + this.timeBetweenSteps;
    };
    TetrominoGame.prototype.finalizeTetromino = function () {
        var _this = this;
        if (this.currentTetromino != null) {
            var currentTetrominoTiles = this.getTilesAtTetromino(this.currentTetromino);
            if (currentTetrominoTiles != null && currentTetrominoTiles.length > 0) {
                currentTetrominoTiles.forEach(function (tile) {
                    if (tile != null) {
                        tile.setType(_this.currentTetromino.type);
                    }
                    else {
                        _this.isOvertopped = true;
                        _this.gameplayState = GameplayState.END;
                    }
                });
            }
            this.clearCompletedLines();
            this.currentTetromino = null;
        }
    };
    TetrominoGame.prototype.clearCompletedLines = function () {
        var tile;
        var linesToClear = [];
        for (var y = 0, yMax = this.gridVerticalSize; y < yMax; y++) {
            for (var x = 0, xMax = this.gridHorizontalSize; x < xMax; x++) {
                tile = this.getTileAtCoordinate(x, y);
                if (tile != null) {
                    if (tile.type == 0) {
                        break;
                    }
                    else if (x == xMax - 1) {
                        linesToClear.push(y);
                    }
                }
            }
        }
        for (var i = 0, iMax = linesToClear.length; i < iMax; i++) {
            for (var x = 0, xMax = this.gridHorizontalSize; x < xMax; x++) {
                tile = this.getTileAtCoordinate(x, linesToClear[i]);
                if (tile != null) {
                    tile.setType(TetrominoType.NONE);
                }
            }
        }
        this.playerScore += linesToClear.length;
        if (this.playerScore > this.topScore) {
            this.topScore = this.playerScore;
        }
    };
    TetrominoGame.prototype.render = function () {
        if (this.refreshNeeded) {
            this.refreshGrid();
            if (this.currentTetromino != null) {
                this.drawCurrentTetronimo();
            }
            this.refreshNeeded = false;
        }
    };
    TetrominoGame.prototype.refreshGrid = function () {
        var color;
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
    };
    TetrominoGame.prototype.drawCurrentTetronimo = function () {
        var color;
        var currentTetrominoTiles = this.getTilesAtTetromino(this.currentTetromino);
        if (currentTetrominoTiles != null && currentTetrominoTiles.length > 0) {
            color = this.getColorFromIndex(this.currentTetromino.type);
            currentTetrominoTiles.forEach(function (tile) {
                if (tile != null && tile.getTint() != color) {
                    tile.setTint(color);
                }
            });
        }
    };
    TetrominoGame.prototype.getTilesAtTetromino = function (tetromino) {
        return this.getTilesAtProjectedTetromino(tetromino.type, tetromino.rotation, tetromino.x, tetromino.y);
    };
    TetrominoGame.prototype.getTilesAtProjectedTetromino = function (type, rotation, originX, originY) {
        var outputTiles = [];
        var tetrominoPosX;
        var tetrominoPosY;
        var tile;
        var shape = this.shapes.getShape(type, rotation);
        var shapeMax = shape[0].length; //Width and height of the shape's field should be the same
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
    };
    TetrominoGame.prototype.getTileAtCoordinate = function (x, y) {
        if (x >= 0 && x < this.gridHorizontalSize) {
            if (y >= 0 && y < this.gridVerticalSize) {
                if (this.gridTiles[x][y] != null) {
                    return this.gridTiles[x][y];
                }
            }
        }
        return null;
    };
    /**Gets color from an index corresponding to a tyle type value, with bounds checking.*/
    TetrominoGame.prototype.getColorFromIndex = function (index) {
        if (index >= 0 || index < this.colorLookup.length) {
            return this.colorLookup[index];
        }
        return this.colorLookup[0];
    };
    return TetrominoGame;
}());
window.onload = function () {
    var game = new TetrominoGame();
};
