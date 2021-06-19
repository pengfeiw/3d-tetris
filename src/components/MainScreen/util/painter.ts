import {mat4} from "gl-matrix";
import {gridVertexs} from "../../../data/shaderData";
import {grid_vertex_source, fragment_source} from "../../../data/glsl_source";
import Shader from "../../../gl/shader";

const view = mat4.lookAt(mat4.create(), [0, -100, 300], [0, 0, 0], [0, 1, 0]);

export const drawGridLine = (gl: WebGLRenderingContext) => {
    gl.viewport(0, 0,  gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.19, 0.22, 0.25, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const shader = new Shader(gl, grid_vertex_source, fragment_source);
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
