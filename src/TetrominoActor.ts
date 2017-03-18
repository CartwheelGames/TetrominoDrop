enum TetrominoType { NONE, O , S, Z, J, L, T, I}
class TetrominoActor
{
	type:TetrominoType;
	x:number;
	y:number;
	rotation:number = 0;
	constructor(type:TetrominoType, x:number, y:number)
	{
		this.type = type;
		this.x = x;
		this.y = y;
	}
}
