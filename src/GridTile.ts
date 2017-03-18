class GridTile
{
    type:TetrominoType = 0;
    sprite:Phaser.Sprite;
    constructor(sprite:Phaser.Sprite)
    {
        this.sprite = sprite;
    }
    getTint()
    {
        return this.sprite.tint;
    }
    setTint(tint:number)
    {
        this.sprite.tint = tint;
    }
    setType(type:TetrominoType)
    {
        this.type = type;
    }
}