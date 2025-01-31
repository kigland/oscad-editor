// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

export default `
// Hi 朋友您好！ 这是一个眼镜的模型。
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

/* [基础定制] */

// 眼镜颜色
model_color = "#F00";
// 眼镜框总宽(mm)
glasses_width = 100;
// 眼镜腿长(mm)
temple_length = 80;
// 镜片间距(mm)
lens_distance = 8;
// 横梁宽(mm)
bridge_width = 2;
// 眼镜腿宽(mm)
temple_width = 1;
// 眼镜腿高(mm)
temple_height = 4;
// 眼镜腿位置微调
temple_offset = -0.005;

/* [高级定制] */
// 镜片厚度(mm) [0.5:3]
lens_height = 1;
// 镜片圆环分段数 [20:200]
lens_segments = 100;
// 鼻托圆柱体分段数 [20:100]
bridge_segments = 50;

/* [计算参数] */
// 单个镜片尺寸
lens_size = (glasses_width - lens_distance) / 2;
// 镜片外圈半径
lens_outer_radius = lens_size/2;
// 镜片内圈半径
lens_inner_radius = lens_outer_radius - lens_height;
module glasses_hollow_cylinders_with_nosepad(
    outer_r, 
    inner_r, 
    height, 
    distance,            
    bridge_width,
    temple_w,temple_h,           
    temple_offset,      
    lens_segments = 100, 
    nosepad_segments = 50
) {
    // 计算关键尺寸
    center_distance = (outer_r * 2) + distance;
    
    // 左右镜片
    mirror_pair() {
        translate([center_distance/2, 0, 0])
        hollow_cylinder(outer_r, inner_r, height, 0, lens_segments);
    }
    
    // 眼镜腿
    mirror_pair() {
        translate([(center_distance/2 + outer_r)*(1 + temple_offset), -temple_w/2, 0])
        rotate([0, 90, 0])
        cube([temple_length, temple_h, temple_w]);
    }
    
    // 鼻托
    rotate([0, 90, 0])
    cylinder(h = distance*1.1, r = bridge_width/2, center = true, $fn = nosepad_segments);
}

// 辅助模块：创建镜像对称的部件
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

// 创建眼镜
rotate([90, 0, 0])
color(model_color) glasses_hollow_cylinders_with_nosepad(
    lens_outer_radius,
    lens_inner_radius,
    lens_height,
    lens_distance,
    bridge_width,
    temple_width,temple_height,
    temple_offset,
    lens_segments,
    bridge_segments
);
`