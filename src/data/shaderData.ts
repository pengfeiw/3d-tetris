// 格子尺寸：10 X 20
// 立方体边长为10

/**
 * 获得格子顶点数据
 * @returns 
 */
const getGridVertexs = (): number[] => {
    const top = 10, bottom = -10, left = -5, right = 5;
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
export const cellVertexs = [
    // near
    -5, -5, 10,
    5, -5, 10,
    5, 5, 10,
    5, 5, 10,
    -5, 5, 10,
    -5, -5, 10,
    // far
    -5, -5, 0,
    5, -5, 0,
    5, 5, 0,
    5, 5, 0,
    -5, 5, 0,
    -5, -5, 0,
    // left
    -5, 5, 0,
    -5, 5, 10,
    -5, -5, 10,
    -5, -5, 10,
    -5, -5, 0,
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
    5, -5, 10,
    5, -5, 0,
    5, -5, 0,
    -5, -5, 0,
    -5, -5, 10,
    // top
    -5, 5, 10,
    5, 5, 10,
    5, 5, 0,
    5, 5, 0,
    -5, 5, 0,
    -5, 5, 10
];
