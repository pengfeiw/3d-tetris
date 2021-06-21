import Shape, {ShapeData} from "./shape";
export const shapeO: ShapeData = [0x0660, 0x0660, 0x0660, 0x0660];
export const shapeI: ShapeData = [0x4444, 0x0F00, 0x4444, 0x0F00];
export const shapeZ: ShapeData = [0x0c60, 0x2640, 0x0c60, 0x2640];
export const shapeS: ShapeData = [0x0360, 0x4620, 0x0360, 0x4620];
export const shapeL: ShapeData = [0x4460, 0x0E80, 0x6220, 0x0170];
export const shapeJ: ShapeData = [0x2260, 0x08E0, 0x6440, 0x0710];
export const shapeT: ShapeData = [0x04E0, 0x4640, 0x0720, 0x2620];

type ShapeName = "O" | "I" | "Z" | "S" | "L" | "J" | "T";

class ShapeCreator {
    private static creator = new ShapeCreator();
    public static get instance() {
        return ShapeCreator.creator;
    }
    private constructor() {
        //
    }
    private shapes: {[name: string]: ShapeData} = {};
    public registerShape(name: ShapeName, data: ShapeData) {
        if (!this.shapes[name]) {
            this.shapes[name] = data;
        }
    }
    public createShape(shapeName: ShapeName) {
        if (this.shapes[shapeName]) {
            return new Shape(this.shapes[shapeName]);
        }
    }
    public createRandomShape() {
        const shapeNames = Object.keys(this.shapes);

        const randomShapeName = shapeNames[Math.round(Math.random() * shapeNames.length)];
        return this.createShape(randomShapeName as ShapeName);
    }
}

const creator = ShapeCreator.instance;

creator.registerShape("O", shapeO);
creator.registerShape("I", shapeI);
creator.registerShape("Z", shapeZ);
creator.registerShape("S", shapeS);
creator.registerShape("L", shapeL);
creator.registerShape("J", shapeJ);
creator.registerShape("T", shapeT);

export default creator;
