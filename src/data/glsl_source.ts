export const cube_vertex_source = `
    attribute vec4 a_position; // 立方体顶点数据
    attribute vec3 a_color;
    attribute vec3 a_normal; // 立方体法向量

    uniform mat4 u_projection;
    uniform mat4 u_model;
    uniform mat4 u_view;

    varying vec3 v_color;
    varying vec3 v_normal;

    void main() {
        gl_Position = u_projection * u_view * u_model * a_position;
        v_color = a_color;
        v_normal = mat3(u_model) * a_normal;
    }
`;


export const cube_fragment_source = `
    precision mediump float;

    uniform vec3 u_lightDirectionReverse; // 光照的逆向量
    uniform vec3 u_lightColor; // 光照颜色

    varying vec3 v_color; // 立方体颜色
    varying vec3 v_normal; // 法向量

    void main() {
        vec3 normal = normalize(v_normal);
        vec3 lightDirectionReverse = normalize(u_lightDirectionReverse);
        float light = dot(normal, lightDirectionReverse);

        gl_FragColor = vec4(v_color * u_lightColor, 1.0);
        gl_FragColor.rgb *= light;
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

export const grid_fragment_source = `
    precision mediump float;

    varying vec3 v_color;

    void main() {
        gl_FragColor = vec4(v_color, 1.0);
    }
`;
