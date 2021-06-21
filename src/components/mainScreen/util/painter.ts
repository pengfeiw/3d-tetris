import {mat4, vec3} from "gl-matrix";
import {gridVertexs, cubeVertexs, randomCubeColor, cubeNormals} from "../../../data/shaderData";
import {grid_vertex_source, cube_vertex_source, grid_fragment_source, cube_fragment_source} from "../../../data/glsl_source";
import Shader from "../../../gl/shader";
import {columnCount, rowCount} from "../../../data/shaderData";
import Shape from "./shape";

const view = mat4.lookAt(mat4.create(), [0, -200, 200], [0, 0, 0], [0, 1, 0]);

export const drawGridLine = (gl: WebGLRenderingContext) => {
    const shader = new Shader(gl, grid_vertex_source, grid_fragment_source);
    shader.useProgram();

    // set vertexs
    const posBuffer = gl.createBuffer();
    const posLocation = gl.getAttribLocation(shader.program, "a_position");
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridVertexs), gl.STATIC_DRAW);
    gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLocation);

    // set color
    shader.setFloat3("u_color", 1, 1, 1);

    // set matrix
    const model = mat4.create();
    const projection = mat4.perspective(mat4.create(), Math.PI * 0.25, gl.canvas.width / gl.canvas.height, 0.1, 1000);
    shader.setMat4("u_model", new Float32Array(model));
    shader.setMat4("u_projection", new Float32Array(projection));
    shader.setMat4("u_view", new Float32Array(view));

    gl.drawArrays(gl.LINES, 0, gridVertexs.length / 3);
};

/**
 * draw cube
 * @param gl WebGLRenderingContext.
 * @param cellDatas the value of every cell, the value must be 0 or 1.
 * @param lightColor the color of light.
 * @param lightDirection the direction of light.
 */
export const drawCube = (gl: WebGLRenderingContext, cellDatas: (0 | 1)[][], lightColor: vec3, lightDirection: vec3, cubeColor?: vec3) => {
    const shader = new Shader(gl, cube_vertex_source, cube_fragment_source);
    shader.useProgram();

    // set cube vertexs
    const posBuffer = gl.createBuffer();
    const posLocation = gl.getAttribLocation(shader.program, "a_position");
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexs), gl.STATIC_DRAW);
    gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLocation);

    // set cube normals
    const normalBuffer = gl.createBuffer();
    const normalLocation = gl.getAttribLocation(shader.program, "a_normal");
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeNormals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLocation);

    const projection = mat4.perspective(mat4.create(), Math.PI * 0.25, gl.canvas.width / gl.canvas.height, 0.1, 1000);
    shader.setMat4("u_view", new Float32Array(view));
    shader.setMat4("u_projection", new Float32Array(projection));
    shader.setFloat3("u_lightColor", lightColor[0], lightColor[1], lightColor[2]);
    shader.setFloat3("u_lightDirectionReverse", -lightDirection[0], -lightDirection[1], -lightDirection[2]);

    for (let row = 0; row < cellDatas.length; row++) {
        const curRow = cellDatas[row];
        for (let col = 0; col < curRow.length; col++) {
            const cellValue = curRow[col];
            if (cellValue === 1) {
                // set color
                const colorBuffer = gl.createBuffer();
                const colorLocation = gl.getAttribLocation(shader.program, "a_color");
                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                if (cubeColor) {
                    const color: number[] = [];
                    for (let i = 0; i < cubeVertexs.length / 3; i++) {
                        color.push(cubeColor[0], cubeColor[1], cubeColor[2]);
                    }
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
                } else {
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(randomCubeColor()), gl.STATIC_DRAW);
                }
                gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(colorLocation);

                // set matrix
                const model = mat4.translate(mat4.create(), mat4.create(), [10 * (col - (columnCount / 2 - 0.5)), 10 * (row - (rowCount / 2 - 0.5)), 0]);
                shader.setMat4("u_model", new Float32Array(model));

                gl.drawArrays(gl.TRIANGLES, 0, 36);
            }
        }
    }
};

interface GameRunData {
    cellDatas: (0 | 1)[][]; // 当前所有格子数据
    activeShape: Shape | null; // 活动的shape
    activeShapePos: {x: number; y: number}, // 活动的shape的左下角坐标
    lightColor: vec3; // 光照颜色
    lightDirection: vec3; // 光照方向
    settledCubeColor: vec3; // 已定的cube颜色
    activeCubeColor: vec3; // 活动的cube颜色
}

export const gameRunData: GameRunData = {
    cellDatas: [],
    activeShape: null,
    activeShapePos: {
        x: 0, y: 0
    },
    lightColor: [1, 1, 1],
    lightDirection: [0, 0.3, -1],
    settledCubeColor: [0.36, 0.42, 0.60],
    activeCubeColor: [1, 1, 1]
};

export const draw = (gl: WebGLRenderingContext) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.19, 0.22, 0.25, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // draw grid line
    drawGridLine(gl);
    // draw settled cube
    drawCube(gl, gameRunData.cellDatas, gameRunData.lightColor, gameRunData.lightDirection, gameRunData.settledCubeColor);
    // draw active cube
    if (gameRunData.activeShape) {
        const cellData:(0 | 1)[][] = [];
        for (let i = 0; i < rowCount + 4; i++) {
            const rowData: (0 | 1)[] = [];
            for (let j = 0; j < columnCount; j++) {
                rowData.push(0);
            }
            cellData.push(rowData);
        }

        let shapeData = gameRunData.activeShape.data;
        const pos = gameRunData.activeShapePos;
        for (let i = pos.y + 3; i >= pos.y; i--) {
            for (let j = pos.x; j < pos.x + 4; j++) {
                if (i >= 0 && j >= 0) {
                    cellData[i][j] = (shapeData & 0x8000) === 0 ? 0 : 1; 
                    shapeData <<= 1;
                }
            }
        }
        
        drawCube(gl, cellData, gameRunData.lightColor, gameRunData.lightDirection, gameRunData.activeCubeColor);
    }

    window.requestAnimationFrame(() => {
        draw(gl);
    });
};
