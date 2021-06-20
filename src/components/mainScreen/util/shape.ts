export type ShapeData = [number, number, number, number];

class Shape {
    private datas: ShapeData
    private shapeIndex = 0;
    public constructor(datas: ShapeData) {
        this.datas = datas;
        this.shapeIndex = Math.round(Math.random() * 3);
    }
    public rotate() {
        this.shapeIndex++;
        this.shapeIndex %= 4;
    }
    public get data() {
        return this.datas[this.shapeIndex];
    }
}

export default Shape;
