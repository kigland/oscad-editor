// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

export default `
// Hi 朋友您好！ 这是一个眼镜的模型。
// By KIGLAND Remi
// 本模型是由 OpenSCAD 语言编写的。
/*
## 基本形状
// 1. 立方体
cube([width, length, height]); // 例如: cube([10, 10, 10]);

// 2. 球体
sphere(r = radius); // 例如: sphere(r = 5);

// 3. 圆柱体
cylinder(h = height, r = radius); // 例如: cylinder(h = 10, r = 5);

## 基本操作

// 1. 立方体
cube([width, length, height]); // 例如: cube([10, 10, 10]);

// 2. 球体
sphere(r = radius); // 例如: sphere(r = 5);

// 3. 圆柱体
cylinder(h = height, r = radius); // 例如: cylinder(h = 10, r = 5);

## 变换
// 1. 平移
translate([x, y, z]) object; // 例如: translate([10, 0, 0]) cube([5, 5, 5]);

// 2. 旋转（角度）
rotate([x, y, z]) object; // 例如: rotate([0, 45, 0]) cube([5, 5, 5]);

// 3. 缩放
scale([x, y, z]) object; // 例如: scale([2, 1, 1]) cube([5, 5, 5]);

## 实用技巧

// 1. 模块化设计（类似函数）
module my_shape(size) {
    cube([size, size, size]);
}
my_shape(10);

// 2. 循环
for (i = [0:2:10]) {  // 从0到10，步长为2
    translate([i, 0, 0]) cube([1, 1, 1]);
}

// 3. 条件语句
if (size > 10) {
    sphere(r = size);
} else {
    cube([size, size, size]);
}

## 常用参数
// 1. $fn 设置圆形物体的分段数（越大越平滑）
sphere(r = 10, $fn = 100);

// 2. center 参数使物体居中
cube([10, 10, 10], center = true);

## 基本线条（使用 polygon）
// 1. 直线
polygon(points = [
    [0, 0],    // 起点
    [10, 10],  // 终点
    [10, 11],  // 给线条一定宽度
    [0, 1]
]);

// 2. 折线
polygon(points = [
    [0, 0],    // 第一个点
    [10, 0],   // 第二个点
    [10, 10],  // 第三个点
    [11, 10],  // 加宽度的点
    [11, 0],
    [1, 0]
]);
## 曲线路径
// 1. 贝塞尔曲线点集生成
// 需要自定义模块来生成贝塞尔曲线的点
module bezier_points(p0, p1, p2, p3, steps=10) {
    for(t = [0:1/steps:1]) {
        x = pow(1-t,3)*p0[0] + 
            3*pow(1-t,2)*t*p1[0] + 
            3*(1-t)*pow(t,2)*p2[0] + 
            pow(t,3)*p3[0];
        
        y = pow(1-t,3)*p0[1] + 
            3*pow(1-t,2)*t*p1[1] + 
            3*(1-t)*pow(t,2)*p2[1] + 
            pow(t,3)*p3[1];
            
        translate([x, y, 0])
            circle(r=0.1);
    }
}

## 实用技巧
// 1. 创建一条带宽度的路径
module path_with_width(points, width=1) {
    // 生成偏移点来创建宽度
    offset_points = [];
    for(i = [0:len(points)-2]) {
        dx = points[i+1][0] - points[i][0];
        dy = points[i+1][1] - points[i][1];
        len = sqrt(dx*dx + dy*dy);
        nx = -dy/len * width/2;  // 法向量
        ny = dx/len * width/2;
        
        // 添加两侧的点
        offset_points = concat(
            offset_points,
            [[points[i][0]+nx, points[i][1]+ny]]
        );
    }
    // 使用 polygon 连接所有点
    polygon(points = offset_points);
}

// 2. 画圆弧
module arc(radius, start_angle, end_angle, width = 1) {
    difference() {
        circle(r = radius + width/2);
        circle(r = radius - width/2);
        // 切除不需要的部分
        rotate([0, 0, start_angle])
            translate([-radius*2, 0, 0])
                square(radius*4);
        rotate([0, 0, end_angle])
            translate([0, -radius*2, 0])
                square(radius*4);
    }
}

## 实际应用示例

// 创建一个简单的草图
module sketch() {
    // 主要轮廓
    polygon(points = [
        [0, 0],
        [20, 0],
        [20, 10],
        [0, 10]
    ]);
    
    // 添加一些细节线条
    translate([5, 5])
        arc(radius = 2, start_angle = 0, end_angle = 180, width = 0.5);
    
    // 添加一条路径
    path_with_width([
        [0, 0],
        [10, 5],
        [20, 0]
    ], width = 0.5);
}

// 将草图拉伸成3D
linear_extrude(height = 5)
    sketch();
*/

/*
 * Parametric Glasses OpenSCAD Model
 * Copyright (C) 2025 KIGLAND (www.kig.land) Autor: Remi (Mingwei) Li
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**/

/* [基础参数配置] */
// 眼镜颜色
model_color = "#E84193";
// 眼镜框总宽(mm)
glasses_width = 290;
// 眼镜腿长(mm)
temple_length = 220;
// 镜片间距(mm)
lens_distance = 15;
// 横梁宽(mm)
bridge_width = 4;
// 眼镜腿宽(mm)
temple_width = 4;
// 眼镜腿高(mm)
temple_height = 8;
// 眼镜腿位置微调
temple_offset = -0.005;

/* [高级参数配置] */

// 铰链紧固件直径
fastener_diameter = 2;
// 镜片厚度(mm) [0.5:3]
lens_height = 3;
// 镜片圆环分段数 [20:200]
lens_segments = 100;
// 鼻托圆柱体分段数 [20:100]
bridge_segments = 50;

// 拆分间距
split_distance = 30;

/* [打印设置] */
// 是否拆分模型
split_model = false; // [true:拆分展示,false:完整展示]


/* [计算参数] */
function calculate_lens_params() = 
let(
    lens_size = (glasses_width - lens_distance) / 2,
    lens_outer_radius = lens_size/2,
    lens_inner_radius = lens_outer_radius - lens_height
) [lens_size, lens_outer_radius, lens_inner_radius];

/* [铰链参数] */
hinge_params = [
    ["fastener_diameter", fastener_diameter],          
    ["fastener_height", temple_height], // 铰链紧固件高度
    ["diameter_scale", 1.8],            // 铰链直径放大系数
    ["height_scale", 1.2],              // 高度放大系数
    ["head_height_ratio", 0.2],         // 紧固件头部高度比例
    ["head_diameter_ratio", 0.8],       // 紧固件头部直径比例
    ["quality", 80]                     // 圆柱体分段数
];

/* [通用工具函数] */
function bezier3(t, p0, p1, p2, p3) = 
    pow(1-t,3)*p0 + 
    3*pow(1-t,2)*t*p1 + 
    3*(1-t)*pow(t,2)*p2 + 
    pow(t,3)*p3;

function generate_bezier_points(steps, temple_length) = 
    [for (i = [0:steps])
        bezier3(
            i/steps,
            [0, 0, 0],
            [0, temple_length*0.9, 0],
            [0, temple_length*0.9, 0],
            [0, temple_length, -15]
        )
    ];

/* [基础几何模块] */
module mirror_pair() {
    children();
    mirror([1, 0, 0]) children();
}

module hollow_cylinder(outer_r, inner_r, height, x_pos = 0, segments = 100) {
    translate([x_pos, 0, 0]) {
        difference() {
            cylinder(h = height, r = outer_r, center = true, $fn = segments);
            cylinder(h = height + 1, r = inner_r, center = true, $fn = segments);
        }
    }
}

/* [铰链组件] */
module hinge_fastener(params) {
    d = params[0][1];
    h = params[1][1];
    height_scale = params[3][1];
    head_height_ratio = params[4][1];
    head_diameter_ratio = params[5][1];
    quality = params[6][1];
    
    total_height = h * height_scale;
    head_height = h * head_height_ratio;
    
    cylinder(h = total_height, r = d/2, center = true, $fn = quality);
    
    translate([0, 0, total_height/2]) 
        cylinder(h = head_height, r = d * head_diameter_ratio, 
                center = true, $fn = quality);
}

module lens_hinge(params) {
    d = params[0][1];
    h = params[1][1];
    diameter_scale = params[2][1];
    quality = params[6][1];
    
    hinge_height = h/3;
    outer_radius = d/2 * diameter_scale;
    
    difference() {
        union() {
            cylinder(h = hinge_height, r = outer_radius, 
                    center = true, $fn = quality);
            
            cube_size = outer_radius * 2;
            translate([-outer_radius, 0, 0]) 
                cube([cube_size, cube_size, hinge_height], center = true);
        }
        cylinder(h = h * 1.5, r = d/2, center = true, $fn = quality);
    }
}

module frame_hinge(params) {
    h = params[1][1];
    offset = h/3;
    
    translate([0, 0, offset]) lens_hinge(params);
    translate([0, 0, -offset]) lens_hinge(params);
}

/* [眼镜腿模块] */
module temple_profile(temple_h, temple_w) {
    cube([1, temple_h, temple_w], center=true);
}

module temple_bezier_extrude(temple_length, temple_h, temple_w) {
    points = generate_bezier_points(50, temple_length);
    
    for (i = [0:len(points)-2]) {
        vector = points[i+1] - points[i];
        angle_z = atan2(vector[1], vector[0]);
        angle_y = -atan2(vector[2], 
                  sqrt(vector[0]*vector[0] + vector[1]*vector[1]));
        
        hull() {
            translate(points[i])
                rotate([90, 0, angle_z])
                    temple_profile(temple_h, temple_w);
            
            translate(points[i+1])
                rotate([90, 0, angle_z])
                    temple_profile(temple_h, temple_w);
        }
    }
}

/* [分离组件模块] */
module main_frame(outer_r, inner_r, height, distance, bridge_width, temple_w, lens_segments, nosepad_segments) {
    center_distance = (outer_r * 2) + distance;
    
    mirror_pair() {
        translate([center_distance/2, 0, 0])
            hollow_cylinder(outer_r, inner_r, height, 0, lens_segments);
    }
    
    mirror_pair() {
        translate([(center_distance/2 + outer_r) + temple_width/2, 0, 0])
            rotate([90,0,0])
                frame_hinge(hinge_params);
    }
    
    rotate([0, 90, 0])
        cylinder(h = distance*1.1, r = bridge_width/2, 
                center = true, $fn = nosepad_segments);
}

module temple_assembly(outer_r, distance, temple_w, temple_h) {
    center_distance = (outer_r * 2) + distance;
    
    mirror_pair() {
        translate([(center_distance/2 + outer_r) + temple_width/2, 0, 0])
            rotate([90,-90,0])
                lens_hinge(hinge_params);
        
        translate([(center_distance/2 + outer_r)+(temple_w/2), 0,
                   -temple_w+temple_w*0.3])
            rotate([-90, 0, 0])
                temple_bezier_extrude(temple_length, temple_h, temple_w);
    }
}

module fastener_assembly(outer_r, distance, temple_w) {
    center_distance = (outer_r * 2) + distance;
    
    mirror_pair() {
        translate([(center_distance/2 + outer_r)+(temple_w/2), +1,0])
            rotate([-90, 0, 0])
                hinge_fastener(hinge_params);
    }
}

module glasses_frame(
    outer_r, inner_r, height, distance,            
    bridge_width, temple_w, temple_h,           
    temple_offset, lens_segments = 100, 
    nosepad_segments = 50
) {
    center_distance = (outer_r * 2) + distance;
    
    mirror_pair() {
        translate([center_distance/2, 0, 0])
            hollow_cylinder(outer_r, inner_r, height, 0, lens_segments);
    }
    
    mirror_pair() {
        translate([(center_distance/2 + outer_r) + temple_width/2, 0, 0])
            rotate([90,0,0])
                frame_hinge(hinge_params);
        
        translate([(center_distance/2 + outer_r) + temple_width/2, 0, 0])
            rotate([90,-90,0])
                lens_hinge(hinge_params);
        
        translate([(center_distance/2 + outer_r)+(temple_w/2), +1,0])
            rotate([-90, 0, 0])
                hinge_fastener(hinge_params);
      
        translate([(center_distance/2 + outer_r)+(temple_w/2), 0,
                   -temple_w+temple_w*0.3])
            rotate([-90, 0, 0])
                temple_bezier_extrude(temple_length, temple_h, temple_w);
    }   
    
    rotate([0, 90, 0])
        cylinder(h = distance*1.1, r = bridge_width/2, 
                center = true, $fn = nosepad_segments);
}

/* [主程序] */
lens_params = calculate_lens_params();
lens_outer_radius = lens_params[1];
lens_inner_radius = lens_params[2];

rotate([90, 0, 0]) {
    color(model_color) {
        if (split_model) {
            rotate([90,0,0])
            translate([0, -split_distance, 0])
                main_frame(
                    lens_outer_radius,
                    lens_inner_radius,
                    lens_height,
                    lens_distance,
                    bridge_width,
                    temple_width,
                    lens_segments,
                    bridge_segments
                );
            rotate([0,0,0])
            translate([0, split_distance*0.5, -split_distance])
                temple_assembly(
                    lens_outer_radius,
                    lens_distance,
                    temple_width,
                    temple_height
                );
            rotate([90,0,0])
            translate([0, 2*split_distance, 0])
                fastener_assembly(
                    lens_outer_radius,
                    lens_distance,
                    temple_width
                );
        } else {
            glasses_frame(
                lens_outer_radius,
                lens_inner_radius,
                lens_height,
                lens_distance,
                bridge_width,
                temple_width,
                temple_height,
                temple_offset,
                lens_segments,
                bridge_segments
            );
        }
    }
}
`