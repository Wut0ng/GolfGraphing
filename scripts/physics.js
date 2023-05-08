var is_physics_running = false;
var level_failed = false;
var balls = [];
var wall = [];
var zones = [];

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    sub(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    mult(value) {
        return new Vector(this.x * value, this.y * value);
    }

    negate () {
        return this.mult(-1);
    }

    div(value) {
        if (value == 0 || value === undefined || isNaN(value)) {
            return new Vector(this.x, this.y);
        }
        return new Vector(this.x / value, this.y / value);
    }

    magsqr() {
        return this.x ** 2 + this.y ** 2;
    }

    mag() {
        return Math.sqrt(this.magsqr());
    }

    set_mag(value) {
        return this.normalize().mult(value);
    }

    normalize() {
        return this.div(this.mag());
    }

    perp(clockwise) {
        if (clockwise) {
            return new Vector(this.y, -this.x);
        } else {
            return new Vector(-this.y, this.x);
        }
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    cross(other) {
        return this.x * other.y - this.y * other.x;
    }

    dist(other) {
        return other.sub(this).mag();
    }

    rotate(angle) {
        let computed_cos = Math.cos(angle);
        let computed_sin = Math.sin(angle);
        return new Vector(this.x * computed_cos - this.y * computed_sin, this. y * computed_sin + this.y * computed_cos);
    }

    angle() {
        return Math.atan(this.y / this.x) + (this.x < 0 ? Math.PI : this.y < 0 ? 2 * Math.PI : 0)
    }

    clamp(max) {
        return this.set_mag(Math.min(this.mag(), max));
    }
}

class Line {
    constructor(x0, y0, x1, y1) {
        this.vertex = [new Vector(x0, y0), new Vector(x1, y1)];
        this.dir = this.vertex[1].sub(this.vertex[0]).normalize();
        this.mag = this.vertex[1].sub(this.vertex[0]).mag();
        this.pos = new Vector((this.vertex[0].x + this.vertex[1].x) / 2, (this.vertex[0].y + this.vertex[1].y) / 2);
    }
}

class Circle {
    constructor(x, y, radius) {
        this.vertex = [];
        this.pos = new Vector(x, y);
        this.radius = radius;
    }
}

class Body {
    constructor() {
        this.mass = 0;
        this.vel = new Vector(0, 0);
    }
}

class ZoneShape {
    constructor(verticies_array) {
        this.vertex = [];
        let pos_x_sum = 0;
        let pos_y_sum = 0;

        for(let i = 0; i < verticies_array.length; i++) {
            this.vertex.push(new Vector(verticies_array[i][0], verticies_array[i][1]));
            pos_x_sum += verticies_array[i][0];
            pos_y_sum += verticies_array[i][1];
        }

        this.dir = this.vertex[1].sub(this.vertex[0]).normalize();
        this.pos = new Vector(pos_x_sum / verticies_array.length, pos_y_sum / verticies_array.length);
    }
}

class Zone extends Body {
    constructor(verticies_array, is_lava){
        super();
        this.composition = [new ZoneShape(verticies_array)];
        this.pos = this.composition[0].pos;
        this.dir = this.composition[0].dir;
        this.is_lava = is_lava;
    }
}

class Ball extends Body {
    constructor(ball_json, i) {
        super();
        this.id = `ball_n${i}`;
        this.radius = ball_json.radius;
        this.color = ball_json.color;
        this.pos = new Vector(ball_json.pos_x, ball_json.pos_y);
        this.vel = new Vector(ball_json.vel_x, ball_json.vel_y);
        this.acc = new Vector(ball_json.grav_x * 0.1, ball_json.grav_y * 0.04);
        this.validation_id = ball_json.id;

        this.composition = [new Circle(ball_json.pos_x, ball_json.pos_y, ball_json.radius)];

        this.mass = 1;
    }

    setPosition(x, y, a = this.angle) {
        this.pos = new Vector(x, y);
        this.composition[0].pos = this.pos;
    }

    reposition(time_elapsed) {
        let computed_time_elapsed = time_elapsed / 8;
        let grav_mult = this.get_grav_mult();
        this.vel = this.vel.add(this.acc.mult(computed_time_elapsed * grav_mult)).mult(1 - (CONFIG.settings.friction * computed_time_elapsed));
        this.setPosition(this.pos.add(this.vel.mult(computed_time_elapsed)).x, this.pos.add(this.vel.mult(computed_time_elapsed)).y);
    }

    get_grav_mult() {
        for(let i = 0; i < current_level.zones.length; i++) {
            if (current_level.zones[i].type == "grav" && !Object.hasOwn(current_level.zones[i], 'no_hitbox')) {
                if (
                    this.pos.x >= current_level.zones[i].verticies[0][0] &&
                    this.pos.x <= current_level.zones[i].verticies[2][0] &&
                    this.pos.y >= current_level.zones[i].verticies[0][1] &&
                    this.pos.y <= current_level.zones[i].verticies[2][1]
                ) {
                    return -1;
                }
            }
        }
        return 1;
    }
    
    get_html_string(i) {
        let c1 = parseColor(this.color);
        let c2 = [];
        let c3 = [];
        
        let c2_increment = -5;
        let c3_increment = -15;

        c2[0] = Math.max(0, Math.min(255, c1[0] + c2_increment));
        c2[1] = Math.max(0, Math.min(255, c1[1] + c2_increment));
        c2[2] = Math.max(0, Math.min(255, c1[2] + c2_increment));

        c3[0] = Math.max(0, Math.min(255, c1[0] + c3_increment));
        c3[1] = Math.max(0, Math.min(255, c1[1] + c3_increment));
        c3[2] = Math.max(0, Math.min(255, c1[2] + c3_increment));
        
        let c1_string = `rgb(${c1[0]}, ${c1[1]}, ${c1[2]})`;
        let c2_string = `rgb(${c2[0]}, ${c2[1]}, ${c2[2]})`;
        let c3_string = `rgb(${c3[0]}, ${c3[1]}, ${c3[2]})`;

        return `<div id="${this.id}" class="ball"><svg class="ball_svg" viewBox="0 0 40 40"><defs><radialGradient id="gradient_ball_n${i}"><stop offset="0%" stop-color="${c1_string}"/><stop offset="60%" stop-color="${c2_string}"/><stop offset="100%" stop-color="${c3_string}"/></radialGradient></defs><circle style="fill: url(#gradient_ball_n${i}); stroke: rgba(0, 0, 0, 0.4); stroke-width: 1.7" cx="18" cy="18" r="${this.radius}"/></svg></div>`;
    }

    update_pos() {
        let screen_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        let computed_radius = this.radius * ((screen_height - 77) / 540) * 0.95;
        let elem = document.getElementById(this.id);

        elem.style.left = `calc(${this.pos.x / 19.2}% - ${computed_radius / 2}px)`;
        elem.style.top = `calc(${this.pos.y / 10.8}% - ${computed_radius / 2}px)`;
        elem.style.width = `${computed_radius}px`;
        elem.style.height = `${computed_radius}px`;
    }

    enter_hole(target_pos) {
        document.getElementById(this.id).classList.add("ball_entering_animation");
        this.pos = target_pos;
        this.update_pos();
    }

    explode() {
        document.getElementById(this.id).classList.add("ball_explosion");
        explosion_confetti({ gravity: 0, shapes: ["circle"], colors: ["#ff6a3d"], particleCount: 30, spread: 360, origin: { x: this.pos.x / 1920, y: this.pos.y / 1080 }, startVelocity: 25, ticks: 20 });
    }

    out_of_bound() {
        document.getElementById(this.id).classList.add("ball_entering_animation");
    }
}

function parseColor(input) {
    let m = input.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    return [Number(m[1]), Number(m[2]), Number(m[3])]
}

class Wall extends Body {
    constructor(lines) {
        super();
        this.start = lines[0].vertex[0];
        this.end = lines[lines.length-1].vertex[1];
        this.composition = lines;
        this.dir = this.end.sub(this.start).normalize();
        this.pos = new Vector((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
    }
}

class CollisionData {
    constructor(body1, body2, sat) {
        this.body1 = body1;
        this.body2 = body2;
        this.normal = sat.axis;
        this.pen = sat.pen;
        this.vertex = sat.vertex;
    }

    penetration_resolution() {
        let penResolution = this.normal.mult(this.pen / (this.body1.mass + this.body2.mass));
        this.body1.pos = this.body1.pos.add(penResolution.mult(this.body1.mass));
        this.body2.pos = this.body2.pos.add(penResolution.mult(-this.body2.mass));
    }

    collision_resolution() {
        //1. Closing velocity
        let closVel1 = this.body1.vel;
        let closVel2 = this.body2.vel;

        //2. Impulse augmentation
        let relVel = closVel1.sub(closVel2);
        let sepVel = relVel.dot(this.normal);
        let new_sepVel = -sepVel * CONFIG.settings.elasticity;
        let vsep_diff = new_sepVel - sepVel;
        let impulseVec = this.normal.mult(vsep_diff);

        //3. Changing the velocities
        this.body1.vel = this.body1.vel.add(impulseVec.mult(this.body1.mass));
        this.body2.vel = this.body2.vel.add(impulseVec.mult(-this.body2.mass));
    }
}

// -------------------------------------------------------------------------------------------------------------------
// ------------------------------------------ SAT (Separating Axis Theorem) ------------------------------------------

// Separating Axis Theorem on two objects
// Returns with the details of the Minimum Translation Vector (or false if no collision)
function sat(body1, body2) {
    if (!is_collision_suitable(body1, body2)) {
        return { pen: null, axis: null, vertex: null };
    }

    let min_overlap = null;
    let smallest_axis;
    let vertex_obj;

    let axes = find_axes(body1, body2);
    let proj1, proj2 = 0;
    let first_shape_axes = 1;

    for(let i = 0; i < axes.length; i++) {
        proj1 = project_shape_onto_axis(axes[i], body1);
        proj2 = project_shape_onto_axis(axes[i], body2);
        let overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
        if (overlap < 0) {
            return false;
        }

        if ((proj1.max > proj2.max && proj1.min < proj2.min) || (proj1.max < proj2.max && proj1.min > proj2.min)) {
            let mins = Math.abs(proj1.min - proj2.min);
            let maxs = Math.abs(proj1.max - proj2.max);
            if (mins < maxs) {
                overlap += mins;
            } else {
                overlap += maxs;
                axes[i] = axes[i].mult(-1);
            }
        }

        if (overlap < min_overlap || min_overlap === null) {
            min_overlap = overlap;
            smallest_axis = axes[i];
            if (i<first_shape_axes) {
                vertex_obj = body2;
                if(proj1.max > proj2.max) {
                    smallest_axis = axes[i].mult(-1);
                }
            } else {
                vertex_obj = body1;
                if(proj1.max < proj2.max) {
                    smallest_axis = axes[i].mult(-1);
                }
            }
        }  
    };

    if (vertex_obj === body2) {
        smallest_axis = smallest_axis.mult(-1);
    }

    return {
        pen: min_overlap,
        axis: smallest_axis
    }
}

// Returns the min and max projection values of a shape onto an axis
function project_shape_onto_axis(axis, obj) {
    set_ball_vertices_along_axis(obj, axis);
    let min = axis.dot(obj.vertex[0]);
    let max = min;
    let collVertex = obj.vertex[0];
    for(let i = 0; i < obj.vertex.length; i++) {
        let p = axis.dot(obj.vertex[i]);
        if(p < min) {
            min = p;
            collVertex = obj.vertex[i];
        } 
        if(p > max) {
            max = p;
        }
    }
    return {
        min: min,
        max: max, 
        collVertex: collVertex
    }
}

// Finds the projection axes for the two objects
function find_axes(body1, body2) {
    let axes = [];
    if (body1 instanceof Circle && body2 instanceof Circle) {
        if (body2.pos.sub(body1.pos).mag() > 0) {
            axes.push(body2.pos.sub(body1.pos).normalize());
        } else {
            axes.push(new Vector(Math.random(), Math.random()).normalize());
        }
        return axes;
    }
    if (body1 instanceof Circle) {
        axes.push(closest_vertex_to_point(body2, body1.pos).sub(body1.pos).normalize());
    }
    if (body1 instanceof Line) {
        axes.push(body1.dir.perp(false));
    }
    if (body1 instanceof ZoneShape) {
        axes.push(body1.dir.normal());
        axes.push(body1.dir);
    }
    if (body2 instanceof Circle) {
        axes.push(closest_vertex_to_point(body1, body2.pos).sub(body2.pos).normalize());
    }
    if (body2 instanceof Line) {
        axes.push(body2.dir.perp(false));
    }
    if (body2 instanceof ZoneShape) {
        axes.push(body2.dir.perp(false));
        axes.push(body2.dir);
    }
    return axes;
}

// Iterates through an objects vertices and returns the one that is the closest to the given point
function closest_vertex_to_point(obj, p) {
    let closestVertex;
    let minDist = null;
    for (let i = 0; i < obj.vertex.length; i++) {
        if (p.sub(obj.vertex[i]).mag() < minDist || minDist === null) {
            closestVertex = obj.vertex[i];
            minDist = p.sub(obj.vertex[i]).mag();
        }
    }
    return closestVertex;
}

// The ball vertices always need to be recalculated based on the current projection axis direction
function set_ball_vertices_along_axis(obj, axis) {
    if (obj instanceof Circle) {
        obj.vertex[0] = obj.pos.add(axis.normalize().mult(-obj.radius));
        obj.vertex[1] = obj.pos.add(axis.normalize().mult(obj.radius));
    }
}

// ------------------------------------------ SAT (Separating Axis Theorem) ------------------------------------------
// -------------------------------------------------------------------------------------------------------------------

function is_collision_suitable(body1, body2) {
    return true; // TEMP TODO check if two body are close enough before
}

function check_collision_ball(ball1, ball2) {
    let best_sat = { pen: null, axis: null, vertex: null };

    sat(body1.composition[i], body2.composition[j])

    return best_sat;
}

function check_collision(body1, body2) {
    let best_sat = { pen: null, axis: null, vertex: null }

    for (let i = 0; i < body1.composition.length; i++) {
        for (let j = 0; j < body2.composition.length; j++) {
            let current_sat = sat(body1.composition[i], body2.composition[j]);
            if (current_sat.pen !== null && current_sat.pen > best_sat.pen) {
                best_sat = current_sat;
            }
        }
    }

    return best_sat;
}

function compute_collisions(time_elapsed) {
    let collisions = [];

    for (let i = 0; i < balls.length; i++) {
        balls[i].reposition(time_elapsed);
    }
    
    for (let i = 0; i < balls.length; i++) {
        for (let j = i+1; j < balls.length; j++) {
            let best_collision = check_collision(balls[i], balls[j]);
            if (best_collision.pen !== null) {
                collisions.push(new CollisionData(balls[i], balls[j], best_collision));
            }
        }

        for (let j = 0; j < zones.length; j++) {
            let best_collision = check_collision(balls[i], zones[j]);
            if (best_collision.pen !== null) {
                if (zones[j].is_lava) {
                    level_failed = true;
                    balls[i].explode();
                    balls.splice(i, 1);
                    return null;
                }
                collisions.push(new CollisionData(balls[i], zones[j], best_collision));
            }
        }

        let best_collision = check_collision(balls[i], wall);
        if (best_collision.pen !== null) {
            collisions.push(new CollisionData(balls[i], wall, best_collision));
        }
    }

    for (let i = 0; i < collisions.length; i++) {
        collisions[i].penetration_resolution();
        collisions[i].collision_resolution();
    }
}

var time_of_last_update = performance.now();
function physics_loop() {
    let new_time = performance.now()
    let time_elapsed = Math.min(new_time - this.time_of_last_update, 180);
    time_of_last_update = new_time;

    if (is_physics_running && document.hasFocus()) {
        compute_collisions(time_elapsed);
        check_ball_positions();
        update_balls();
        check_win();
    }
    
    requestAnimationFrame(physics_loop);
}

function check_win() {
    if (balls.length <= 0 == !level_failed) {
        current_level.trigger_win();
    }
}

function check_ball_positions() {
    for (let i = 0; i < balls.length; i++) { // HERE TODO TEMP
        if (balls[i].pos.x < 0-(balls[i].radius-4) || balls[i].pos.x > 1920+(balls[i].radius-4) || balls[i].pos.y < 0-(balls[i].radius-4) || balls[i].pos.y > 1080+(balls[i].radius-4)) {
            level_failed = true;
            balls[i].explode();
            balls.splice(i, 1);
            return null;
        }

        for (let j = 0; j < current_level.holes.length; j++) {
            let hole_pos_vec = new Vector(current_level.holes[j].pos_x, current_level.holes[j].pos_y + 10);
            let distance = hole_pos_vec.sub(balls[i].pos).mag() - 4;
            
            if (distance <= current_level.holes[j].radius && current_level.holes[j].id == balls[i].validation_id) {
                balls[i].enter_hole(new Vector(current_level.holes[j].pos_x, current_level.holes[j].pos_y + 2));
                balls.splice(i, 1);
                return null;
            }
        }
    }
}

function create_balls(balls_json) {
    level_failed = false;
    let html_string = "";
    for (let i = 0; i < balls_json.length; i++) {
        let ball = new Ball(balls_json[i], i);
        html_string += ball.get_html_string(i);
        balls.push(ball);
    }
    document.getElementById("ball_container_svgs").innerHTML = html_string;
    update_balls();
}

function create_walls(verticies) {
    let lines = [];
    for (let i = 0; i < verticies.length; i++) {
        for (let j = 0; j < verticies[i].length-1; j++) {
            let line = new Line(verticies[i][j].x, verticies[i][j].y, verticies[i][j+1].x, verticies[i][j+1].y);
            lines.push(line);
        }
    }
    wall = new Wall(lines);
}

function create_zones() {
    zones = [];
    for (let i = 0; i < current_level.zones.length; i++) {
        if (!Object.hasOwn(current_level.zones[i], 'no_hitbox')) {
            if (current_level.zones[i].type == "wall") {
                zones.push(new Zone(current_level.zones[i].verticies, false));
            } else if (current_level.zones[i].type == "lava") {
                zones.push(new Zone(current_level.zones[i].verticies, true));
            }
        }
    }
}

function update_balls() {
    for (let i = 0; i < balls.length; i++) {
        balls[i].update_pos();
    }
}

function delete_balls() {
    balls = [];
    document.getElementById("ball_container_svgs").innerHTML = "";
}

requestAnimationFrame(physics_loop);
