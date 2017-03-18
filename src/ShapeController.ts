//This would normally be a json file, easier to test on a desktop in a ts file because of browser restrictions on opening XML/JSON data
class ShapeController {
	shapeDict = [];
	constructor() {
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
	getShape(type:TetrominoType, rotationIndex:number = 0) {
		return this.shapeDict[type][rotationIndex];
	}
}
