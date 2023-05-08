
function get_vertices(function_str, step, reverse_step, domain_start, domain_end) {
    console.log(function_str);

    if (function_str == "" || function_str.includes("VAL")) {
        return [ [ {x:960, y:540}, {x:960, y:540} ] ];
    }

    let points = [];
    let got_points = false;
    let got_undefined = false;

    // Add initial points in `points`
    for (let x = domain_start; x <= domain_end; x+=step) {
        let result = eval(function_str);
        if (result === undefined || isNaN(result)) {
            if (got_points) {
                while(true) {
                    x-=reverse_step;
                    let temp_result = eval(function_str);
                    if (!(temp_result === undefined || isNaN(temp_result))) {
                        let p1 = {
                            x: (x + 17.77777778) * 54,
                            y: (temp_result - 10) * -54
                        };
                        x-=reverse_step * 4;
                        let p2 = {
                            x: (x + 17.77777778) * 54,
                            y: (eval(function_str) - 10) * -54
                        };
                        points.push(p2);
                        points.push(p1);
                        break;
                    }
                }
                break;
            } else {
                got_undefined = true;
            }
        } else {
            if (!got_points && got_undefined) {
                got_points = true;
                while (true) {
                    x-=reverse_step;
                    let new_result = eval(function_str);
                    if (new_result === undefined || isNaN(new_result)) {
                        x+=reverse_step;
                        let p1 = {
                            x: (x + 17.77777778) * 54,
                            y: (eval(function_str) - 10) * -54
                        };
                        x+=reverse_step * 4;
                        let p2 = {
                            x: (x + 17.77777778) * 54,
                            y: (eval(function_str) - 10) * -54
                        };
                        points.push(p1);
                        points.push(p2);
                        break;
                    }
                }
            } else {
                points.push({
                    x: (x + 17.77777778) * 54,
                    y: (result - 10) * -54
                });
            }
        }
    }

    // Sort points array
    points.sort((p1, p2) => (p1.x < p2.x) ? 1 : (p1.x > p2.x) ? -1 : 0);

    
    let array_of_points = [];
    let array_of_points_index = 0;
    let is_inside_emp = false;
    for (let i = 0; i < points.length; i++) {
        if (is_point_inside_emp(points[i])) {
            if (!is_inside_emp) {
                array_of_points_index += 1;
            }

            is_inside_emp = true;
        } else {
            if (array_of_points.length <= array_of_points_index) {
                array_of_points.push([]);
            }

            array_of_points[array_of_points_index].push(points[i]);

            is_inside_emp = false;
        }
    }

    array_of_points.unshift(points);
    let array_of_final_points = [];
    for (let k = 0; k < array_of_points.length; k++) {

        let final_points = [];
        // If the point is inbound, push it to `final_points`
        for (let i = 0; i < array_of_points[k].length; i++) {

            let p1 = array_of_points[k][i-1];
            let p2 = array_of_points[k][i];
            let p3 = array_of_points[k][i+1];
            
            if (is_inbound(p1, p2, p3)) {
                final_points.push(array_of_points[k][i]);
            }
        }
        if (final_points.length == 0 && array_of_points[k].length >= 2) {;
            final_points.push(array_of_points[k][0]);
            final_points.push(array_of_points[k][array_of_points.length-1]);
        }

        // Remove parallel points from `points`
        let indexes_to_remove = [];
        for (let i = 0; i < final_points.length; i++) {
            let index_minux_one = i-1;
            while (indexes_to_remove.includes(index_minux_one)) {
                index_minux_one--;
            }
            let p1 = final_points[index_minux_one];
            let p2 = final_points[i];
            let p3 = final_points[i+1];

            if (p1 === undefined) {
                p1 = final_points[final_points.length-1];
            }
            if (p3 === undefined) {
                p3 = final_points[0];
            }


            let v1 = {
                x: p2.x - p1.x,
                y: p2.y - p1.y
            };
            let v2 = {
                x: p2.x - p3.x,
                y: p2.y - p3.y
            };
            let dot_product = (v1.x * v2.x) + (v1.y * v2.y);
            let magnitude1 = Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2));
            let magnitude2 = Math.sqrt(Math.pow(v2.x, 2) + Math.pow(v2.y, 2));
            let before_cos = dot_product / magnitude1 / magnitude2;
            let angle_diff;
            if (before_cos < -1) {
                angle_diff = Math.PI;
            } else {
                angle_diff = Math.acos(before_cos);
            }

            if (angle_diff <= Math.PI * (1 + CONFIG.settings.angle_tolerance) && angle_diff >= Math.PI * (1 - CONFIG.settings.angle_tolerance)) {
                indexes_to_remove.push(i);
            }
        }
        for (let i = indexes_to_remove.length-1; i >= 0; i--) {
            final_points.splice(indexes_to_remove[i], 1);
        }

        array_of_final_points.push([]);
        for (let i = 0; i < final_points.length; i++) {
            array_of_final_points[k].push({
                x: toFixedCustom(Math.max(-1000, Math.min(final_points[i].x, 3000)), 3),
                y: toFixedCustom(Math.max(-1000, Math.min(final_points[i].y, 3000)), 3)
            });
        }
    }
    
    return array_of_final_points;
}

function is_point_inside_emp(point) {
    for(let i = 0; i < current_level.zones.length; i++) {
        if (current_level.zones[i].type == "emp" && !Object.hasOwn(current_level.zones[i], 'no_hitbox')) {
            if (
                point.x >= current_level.zones[i].verticies[0][0] &&
                point.x <= current_level.zones[i].verticies[2][0] &&
                point.y >= current_level.zones[i].verticies[0][1] &&
                point.y <= current_level.zones[i].verticies[2][1]
            ) {
                return true;
            }
        }
    }
    return false;
}

function toFixedCustom(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function is_inbound(p1, p2, p3) {
    return (
        is_on_screen(p1) ||
        is_on_screen(p2) ||
        is_on_screen(p3) ||
        is_cross_screen(p1, p2) ||
        is_cross_screen(p2, p3)
    );
}

function is_on_screen(point) {
    if (point === undefined) {
        return false;
    }
    return (
        point.x <= 1960 &&
        point.x >= -40 &&
        point.y <= 1120 &&
        point.y >= -40
    );
}

function is_cross_screen(p0, p1) {
    if (p0 === undefined || p1 === undefined) {
        return false;
    }
    return (
        is_intersecting(p0, p1, {x: -40, y: -40},       {x: 1960, y: -40}) ||
        is_intersecting(p0, p1, {x: -40, y: -40},       {x: -40, y: 1120}) ||
        is_intersecting(p0, p1, {x: 1960, y: 1120}, {x: 1960, y: -40}) ||
        is_intersecting(p0, p1, {x: 1960, y: 1120}, {x: -40, y: 1120})
    );
}

function is_intersecting(p0, p1, p2, p3) {
    let s1_x = p1.x - p0.x;
    let s1_y = p1.y - p0.y;
    let s2_x = p3.x - p2.x;
    let s2_y = p3.y - p2.y;

    let s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
    let t = ( s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

    return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
}

function get_verticies_str(vertices) {
    if (vertices.length == 0) {
        return "M 960 540 960 540";
    }

    let final_str = "M ";
    for (let i = 0; i < vertices.length; i++) {
        final_str += `${vertices[i].x} ${vertices[i].y} `;
    }
    
    return final_str;
}

function get_verticies_str_polygon(array_of_verticies) {
    let final_str = "";
    for (let i = 0; i < array_of_verticies.length; i++) {
        final_str += `${array_of_verticies[i][0]},${array_of_verticies[i][1]} `;
    }
    return final_str;
}