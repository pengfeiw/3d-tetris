export const cube_vertex_source = `
    attribute vec4 a_position;
    attribute vec3 a_color;

    uniform mat4 u_projection;
    uniform mat4 u_model;
    uniform mat4 u_view;

    varying vec3 v_color;

    void main() {
        gl_Position = u_projection * u_view * u_model * a_position;
        v_color = a_color;
    }
`;

export const grid_vertex_source = `
    attribute vec4 a_position;

    uniform vec3 u_color;
    uniform mat4 u_projection;
    uniform mat4 u_model;
    uniform mat4 u_view;

    varying vec3 v_color;

    void main() {
        gl_Position = u_projection * u_view * u_model * a_position;
        v_color = u_color;
    }
`;

export const fragment_source = `
    precision mediump float;

    varying vec3 v_color;

    void main() {
        gl_FragColor = vec4(v_color, 1.0);
    }
`;
