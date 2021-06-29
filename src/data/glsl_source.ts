export const cube_vertex_source =
    `#version 300 es
    in vec4 a_position; // 立方体顶点数据
    in vec3 a_color;
    in vec3 a_normal; // 立方体法向量

    uniform mat4 u_projection;
    uniform mat4 u_model;
    uniform mat4 u_view;

    out vec3 v_color;
    out vec3 v_normal;

    void main() {
        gl_Position = u_projection * u_view * u_model * a_position;
        v_color = a_color;
        v_normal = mat3(u_model) * a_normal;
    }
`;


export const cube_fragment_source =
    `#version 300 es
    precision highp float;

    out vec4 FragColor;

    uniform vec3 u_lightDirectionReverse; // 光照的逆向量
    uniform vec3 u_lightColor; // 光照颜色

    in vec3 v_color; // 立方体颜色
    in vec3 v_normal; // 法向量

    void main() {
        vec3 normal = normalize(v_normal);
        vec3 lightDirectionReverse = normalize(u_lightDirectionReverse);
        float light = dot(normal, lightDirectionReverse);

        FragColor = vec4(v_color * u_lightColor, 1.0);
        FragColor.rgb *= light;
    }
`;

export const grid_vertex_source =
    `#version 300 es
    in vec4 a_position;

    uniform vec3 u_color;
    uniform mat4 u_projection;
    uniform mat4 u_model;
    uniform mat4 u_view;

    out vec3 v_color;

    void main() {
        gl_Position = u_projection * u_view * u_model * a_position;
        v_color = u_color;
    }
`;

export const grid_fragment_source =
    `#version 300 es
    precision highp float;
    out vec4 FragColor;

    in vec3 v_color;

    void main() {
        FragColor = vec4(v_color, 1.0);
    }
`;
