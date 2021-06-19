const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    var shader = gl.createShader(type) as WebGLShader;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // 检测是否着色器是否编译成功
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!success) {
        throw "colud not compile shader: " + gl.getShaderInfoLog(shader);
    }

    return shader;
};

/**
 * 链接着顶点着色器和片段着色器，生成着色程序
 * @param gl  
 * @param vertexShader 
 * @param fragmentShader 
 * @returns WebGLProgram
 */
const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
    var program = gl.createProgram() as WebGLProgram;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!success) {
        throw "colud not link shader: " + gl.getProgramInfoLog(program); 
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
};

/**
 * 封装的着色器程序类
 */
class Shader {
    public gl: WebGLRenderingContext;
    public program: WebGLProgram;
    public constructor(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
        this.gl = gl;
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        this.program = createProgram(gl, vertexShader, fragmentShader);
    }
    public useProgram() {
        this.gl.useProgram(this.program);
    }
    // #region uniform工具函数  https://www.khronos.org/registry/OpenGL-Refpages/es2.0/xhtml/glUniform.xml
    public setFloat(name: string, value: number) {
        const location = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform1f(location, value);
    }
    public setFloat2(name: string, x: number, y: number) {
        const location = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform2f(location, x, y);
    }
    public setFloat3(name: string, x: number, y: number, z: number) {
        const location = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform3f(location, x, y, z);
    }
    public setFloat4(name: string, x: number, y: number, z: number, w: number) {
        const location = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform4f(location, x, y, z, w);
    }
    public setMat3(name: string, value: Float32Array) {
        const location = this.gl.getUniformLocation(this.program, name);
        this.gl.uniformMatrix3fv(location, false, value); // transpose参数必须为false
    }
    public setMat4(name: string, value: Float32Array) {
        const location = this.gl.getUniformLocation(this.program, name);
        this.gl.uniformMatrix4fv(location, false, value); // transpose参数必须为false
    }
    // #endregion
}

export default Shader;
