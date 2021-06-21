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
    /**
     * 获取当前data
     */
    public get data() {
        return this.datas[this.shapeIndex];
    }
    /**
     * 获取旋转一次后的data
     */
    public getAfterOneRotate_Data() {
        return this.datas[(this.shapeIndex + 1) % 4];
    }
}

export default Shape;
