// 格子尺寸：10 X 20
// 立方体边长为10

export const columnCount = 10; // 列数
export const rowCount = 20; // 行数

/**
 * 获得格子顶点数据
 * @returns 
 */
const getGridVertexs = (): number[] => {
    const top = rowCount / 2, bottom = -rowCount / 2, left = -columnCount / 2, right = columnCount / 2;
    const data: number[] = [];

    // columns
    const miny = bottom * 10, maxy = top * 10;
    for (let i = left; i <= right; i++) {
        data.push(i * 10, maxy, 0);
        data.push(i * 10, miny, 0);
    }

    // rows
    const minx = left * 10, maxx = right * 10;
    for (let i = bottom; i <= top; i++) {
        data.push(minx, i * 10, 0);
        data.push(maxx, i * 10, 0);
    }

    return data;
};

export const gridVertexs = getGridVertexs();

/**
 * 立方体顶点数据，表示shape的一个block
 */
export const cubeVertexs = [
    // near
    -5, -5, 10,
    5, -5, 10,
    5, 5, 10,
    5, 5, 10,
    -5, 5, 10,
    -5, -5, 10,
    // far
    -5, -5, 0,
    -5, 5, 0,
    5, 5, 0,
    5, 5, 0,
    5, -5, 0,
    -5, -5, 0,
    // left
    -5, 5, 0,
    -5, -5, 0,
    -5, -5, 10,
    -5, -5, 10,
    -5, 5, 10,
    -5, 5, 0,
    // right
    5, 5, 0,
    5, 5, 10,
    5, -5, 10,
    5, -5, 10,
    5, -5, 0,
    5, 5, 0,
    // bottom
    -5, -5, 10,
    -5, -5, 0,
    5, -5, 0,
    5, -5, 0,
    5, -5, 10,
    -5, -5, 10,
    // top
    -5, 5, 10,
    5, 5, 10,
    5, 5, 0,
    5, 5, 0,
    -5, 5, 0,
    -5, 5, 10
];

// cube的法向量
export const cubeNormals = [
    // near
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    // far
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    // left
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    // right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    // bottom
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    // top
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0
];

export const randomCubeColor = () => {
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    const color = [];
    for (let i = 0; i < cubeVertexs.length / 3; i++) {
        color.push(r, g, b);
    }
    return color;
};
