
class Level {
    number;
    name;
    sections;
    yfunctions;
    verticies;
    verticies_winning;
    is_golf_level;
    winning_functions;
    balls;
    zones;
    custom_classes;

    constructor(level_json) {
        box_count = 0;
        section_count = 0;
        this.level_number = level_json.level_number;
        this.chapter_number = level_json.chapter_number;
        this.is_golf_level = level_json.winning_functions == undefined;

        this.tooltip = level_json.tooltip;
        
        this.winning_functions = level_json.winning_functions || [];
        this.balls = level_json.balls || [];
        this.zones = level_json.zones || [];
        this.holes = level_json.holes || [];
        this.custom_classes = level_json.custom_classes || [];

        this.sections = [];
        this.yfunctions = []; // [section_index, value]
        this.verticies = [];
        this.verticies_winning = [];
        
        for (let i = 0; i < level_json["sections"].length; i++) {
            this.sections.push(new Section(level_json["sections"][i]));

            if (this.sections[i].type == "y_function" || this.sections[i].type == "y_function_locked") {
                this.yfunctions.push([i, []]);
            }
        }
    }

    load(is_reload) {
        for (let i = 0; i < this.custom_classes.length; i++) {
            document.body.classList.add(this.custom_classes[i]);
        }
        is_physics_running = false;
        document.body.classList.remove("master_grabbing");
        delete_balls();
        document.getElementById("inner_master_left").innerHTML = this.get_html_string();
        document.getElementById("chapter_number").innerHTML = this.chapter_number;
        document.getElementById("level_number").innerHTML = this.level_number;
        if (this.is_golf_level) {
            document.body.classList.add("display_ball");
            document.body.classList.add("master_play_button");
            document.body.classList.remove("master_stop_button");
            create_balls(this.balls);
        } else {
            document.body.classList.remove("display_ball");
            document.body.classList.remove("master_play_button");
            document.body.classList.remove("master_stop_button");
        }
        this.set_event_listeners();
        this.compute_functions();

        if (is_reload) {
            this.graph_functions_update();
        } else {
            document.body.classList.remove("master_show_tooltip");
            document.body.classList.remove("master_hide_tooltip");
            this.graph_functions_initial();
            if (this.tooltip !== undefined) {
                document.getElementById("tooltip_title").innerHTML = this.tooltip.title;
                document.getElementById("tooltip_subtitle").innerHTML = this.tooltip.subtitle;
                ROOT.style.setProperty('--tooltip_width', `${this.tooltip.width}px`);
                ROOT.style.setProperty('--tooltip_height', `${this.tooltip.height}px`);
                ROOT.style.setProperty('--tooltip_background', `center 100% / 100% 100% no-repeat url("../imgs/tooltips/${this.tooltip.img}")`);
            }
            this.create_holes();
        }
        window_resize();
    }

    create_holes() {
        if (this.is_golf_level) {
            let html_string = "";

            for (let i = 0; i < this.holes.length; i++) {
                let pc = parseColor(this.holes[i].color);

                let c1 = [];
                let c2 = [];
                
                let c1_increment = -46;
                let c2_increment = 50;

                c1[0] = Math.max(0, Math.min(255, pc[0] + c1_increment));
                c1[1] = Math.max(0, Math.min(255, pc[1] + c1_increment));
                c1[2] = Math.max(0, Math.min(255, pc[2] + c1_increment));
        
                c2[0] = Math.max(0, Math.min(255, pc[0] / 4 + c2_increment));
                c2[1] = Math.max(0, Math.min(255, pc[1] / 4 + c2_increment));
                c2[2] = Math.max(0, Math.min(255, pc[2] / 4 + c2_increment));
                
                let c1_string = `rgba(${c1[0]}, ${c1[1]}, ${c1[2]}, 0.75)`;
                let c2_string = `rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, 0.20)`;

                // fill="url(#gradient_hole_n${i})"

                html_string += `<circle stroke="${c1_string}" stroke-width="5" fill="${c2_string}" class="hole" cx="${this.holes[i].pos_x}" cy="${this.holes[i].pos_y}" r="${this.holes[i].radius}" id="hole_n${i}" inner_id="${this.holes[i].id}"/>`;
            }
            
            document.getElementById("hole_div").innerHTML = html_string;
        } else {
            document.getElementById("hole_div").innerHTML = "";
        }
    }

    play_stop() {
        if (this.is_golf_level) {
            if (document.body.classList.contains("master_stop_button")) {
                is_physics_running = false;
                delete_balls();
                create_balls(this.balls);
                update_balls();

                document.body.classList.add("master_play_button");
                document.body.classList.remove("master_stop_button");
            } else {
                is_physics_running = true;

                document.body.classList.add("master_stop_button");
                document.body.classList.remove("master_play_button");
            }
        } else {
            is_physics_running = false;
            delete_balls();
            
            document.body.classList.remove("master_play_button");
            document.body.classList.remove("master_stop_button");
        }
    }

    stop() {
        if (this.is_golf_level) {
            if (document.body.classList.contains("master_stop_button")) {
                is_physics_running = false;
                delete_balls();
                create_balls(this.balls);
                update_balls();

                document.body.classList.add("master_play_button");
                document.body.classList.remove("master_stop_button");
            }
        } else {
            is_physics_running = false;
            delete_balls();
            
            document.body.classList.remove("master_play_button");
            document.body.classList.remove("master_stop_button");
        }
    }

    get_html_string() {
        let html_string = "";
        for (let i = 0; i < this.sections.length; i++) {
            html_string += this.sections[i].get_html_string();
        }
        return html_string;
    }

    set_event_listeners() {
        for (let i = 0; i < this.sections.length; i++) {
            this.sections[i].set_event_listeners();
        }
    }

    update_functions(no_animation = false) {
        this.compute_functions();
        this.graph_functions_update(no_animation);
        if (this.is_golf_level) {
            if (document.body.classList.contains("master_stop_button")) {
                this.play_stop()
            }
        } else {
            if (this.verify_winning_functions()) {
                this.trigger_win();
            }
        }
    }

    trigger_win() {
        is_physics_running = false;
        let custom_classes = this.custom_classes;

        let sliders = document.getElementsByClassName("slider");
        for (let i = 0; i < sliders.length; i++) {
            sliders[i].disabled = true;
        }
        document.activeElement.blur();

        disable_all_events();
        setTimeout(function() {
            document.body.classList.add("master_checkmark");

            setTimeout(function() {
                document.body.classList.add("master_show_confetti");
                main_confetti({ particleCount: 75, spread: 50, origin: { x: 0.5, y: 1.25 }, startVelocity: 70, ticks: 200 });
                main_confetti({ particleCount: 68, spread: 45, origin: { x: 0.2, y: 1.25 }, startVelocity: 55, ticks: 200 });
                main_confetti({ particleCount: 68, spread: 45, origin: { x: 0.8, y: 1.25 }, startVelocity: 55, ticks: 200 });

                setTimeout(function() {
                    document.body.classList.remove("master_show_confetti");
                    for (let i = 0; i < custom_classes.length; i++) {
                        document.body.classList.remove(custom_classes[i]);
                    }
                    
                    load_next_level();

                    document.body.classList.remove("master_checkmark");
                    enable_all_events();
                }, 1000);
            }, 950);
        }, CONFIG.settings.function_transition_duration * 1000);

    }

    verify_winning_functions() {
        for (let i = 0; i < this.verticies_winning.length; i++) {
            if (!this.verify_single_winning_function(this.verticies_winning[i])) {
                return false;
            }
        }
        return true;
    }

    verify_single_winning_function(v1) {
        for (let i = 0; i < this.verticies.length; i++) {
            if (this.compare_verticies(v1, this.verticies[i])) {
                return true;
            }
        }
        return false;
    }

    compare_verticies(v1, v2) {
        for (let i = 0; i < v1.length; i++) {
            let vector_diff = {
                x: v1[i].x - v2[i].x,
                y: v1[i].y - v2[i].y
            };
            let vector_diff_mag = Math.sqrt(vector_diff.x**2 + vector_diff.y**2);
            if (vector_diff_mag > CONFIG.settings.verif_pixel_tolerance) {
                return false;
            }
        }
        return true;
    }

    compute_functions() {
        let custom_vars = []; // [ {letter, function_string}, {letter, function_string} ]
        for (let i = 0; i < this.sections.length; i++) {
            if (this.sections[i].type == "constant") {
                let letter = this.sections[i].letter;
                let function_string = this.get_function_string(this.sections[i].id);
                custom_vars.push({letter: letter, function_string: function_string, section_id: this.sections[i].id});
            } else if (this.sections[i].type == "constant_slider") {
                let letter = this.sections[i].letter;
                let slider = document.getElementById(this.sections[i].id);
                let value = slider.value;

                let function_string = String(value)
                .replaceAll("sin(", "ZZZ(")
                .replaceAll("cos(", "ZZZZ(")
                .replaceAll("tan(", "ZZZZZ(")
                .replaceAll("sqrt(", "ZZZZZ(");
                custom_vars.push({letter: letter, function_string: function_string, section_id: this.sections[i].id});
            }
        }

        for (let i = 0; i < custom_vars.length; i++) {
            let function_string = custom_vars[i].function_string;
            function_string = function_string.replaceAll(custom_vars[i].letter, "INVALID");
            for (let j = 0; j < custom_vars.length; j++) {
                function_string = function_string.replaceAll(custom_vars[j].letter, custom_vars[j].function_string);
            }
            custom_vars[i].function_string = function_string;
        }

        for (let i = 0; i < custom_vars.length; i++) {
            let function_string = custom_vars[i].function_string;
            function_string = function_string.replaceAll(custom_vars[i].letter, "INVALID");
            for (let j = 0; j < custom_vars.length; j++) {
                function_string = function_string.replaceAll(custom_vars[j].letter, custom_vars[j].function_string);
            }
            custom_vars[i].function_string = function_string;
        }

        for (let i = 0; i < custom_vars.length; i++) {
            if (custom_vars[i].function_string.includes("VAL")) {
                document.getElementById(custom_vars[i].section_id).parentNode.classList.add("error_section");
            } else {
                document.getElementById(custom_vars[i].section_id).parentNode.classList.remove("error_section");
            }
        }

        for (let i = 0; i < this.yfunctions.length; i++) {
            let function_string = "";
            if (this.sections[this.yfunctions[i][0]].type == "y_function_locked") {
                function_string = this.sections[this.yfunctions[i][0]].value;
            } else {
                function_string = this.get_function_string(this.sections[this.yfunctions[i][0]].id);
            }

            for (let j = 0; j < custom_vars.length; j++) {
                function_string = function_string.replaceAll(custom_vars[j].letter, custom_vars[j].function_string);
            }

            if (function_string.includes("VAL") || /.*\/0([^.]|$|\.(0{4,}.*|0{1,4}([^0-9]|$))).*/.test(function_string)) {
                function_string = "VAL";
                document.getElementById(this.sections[this.yfunctions[i][0]].id).parentNode.classList.add("error_section");
            } else {
                document.getElementById(this.sections[this.yfunctions[i][0]].id).parentNode.classList.remove("error_section");
            }

            this.yfunctions[i][1] = function_string
            .replaceAll("ZZZZZ(", "Math.sqrt(")
            .replaceAll("ZZZZZ(", "Math.tan(")
            .replaceAll("ZZZZ(", "Math.sin(")
            .replaceAll("ZZZ(", "Math.cos(");
        }
    }

    get_function_string(function_id) {
        let section = document.getElementById(function_id);
        let boxes = section.getElementsByClassName("box");

        let values = []; // [calcul_type, content]
        for (let j = 0; j < boxes.length; j++) {
            values.push([boxes[j].getAttribute("calcul_type"), boxes[j].getAttribute("box_content")]);
        }

        let blocks = []; // [calcul_type, [content, content, ...]]
        let current_type = "";
        let current_contents = [];
        for (let j = 0; j < values.length; j++) {
            if (current_type == "") {
                current_type = values[j][0];
            }
            if (values[j][0] != current_type) {
                blocks.push([current_type, current_contents]);
                current_type = values[j][0];
                current_contents = [];
            }
            current_contents.push(values[j][1]);
        }
        if (current_contents.length > 0) {
            blocks.push([current_type, current_contents]);
        }

        let final_string = "";
        for (let j = 0; j < blocks.length; j++) {
            switch(blocks[j][0]) {
                case "normal_box":
                    let interior_string = "";
                    for (let k = 0; k < blocks[j][1].length; k++) {
                        if (k != 0) {
                            interior_string = interior_string.concat("*");
                        }
                        let replaced = blocks[j][1][k];
                        interior_string = interior_string.concat(`(${replaced})`);
                    }
                    final_string = final_string.concat(`(${interior_string})`);
                    break;

                case "sign_box":
                    let is_negative = false;
                    let mult_div = "";
                    for (let k = 0; k < blocks[j][1].length; k++) {
                        if (blocks[j][1][k] == "-") {
                            is_negative = !is_negative;
                        }
                        if (blocks[j][1][k] == "%" || blocks[j][1][k] == "*") {
                            mult_div = blocks[j][1][k];
                            is_negative = false;
                        }
                    }
                    if (j == 0) {
                        if (is_negative) {
                            final_string = final_string.concat("-");
                        }
                    } else if (j != blocks.length - 1) {
                        if (is_negative) {
                            final_string = final_string.concat(mult_div).concat("-");
                        } else {
                            if (mult_div == "") {
                                final_string = final_string.concat("+");
                            } else {
                                final_string = final_string.concat(mult_div);
                            }
                        }
                    }
                    break;

                default:
                    break;
            }
        }

        let final_string_replaced = final_string
        .replaceAll("cos(", 'ZZZ(')
        .replaceAll("sin(", 'ZZZZ(')
        .replaceAll("tan(", 'ZZZZZ(')
        .replaceAll("sqrt(", 'ZZZZZZ(')
        .replaceAll("[^s]", "**(")
        .replaceAll("[^e]", ")")
        .replaceAll("[fs]", "(")
        .replaceAll("[fm]", ")/(")
        .replaceAll("[fe]", ")")
        .replaceAll("[b]", "")
        .replaceAll(/\s+/g, '')
        .replaceAll(/(\w+)([a-z])/g, "$1*$2")
        .replaceAll(")(", ')*(')
        .replaceAll(")x", ')*x')
        .replaceAll("x(", 'x*(')
        .replaceAll("-x", '(-1*x)')
        .replaceAll("%", '/');

        if (final_string_replaced == "" || final_string == "+" || final_string == "-" || final_string == "*" || final_string == "/") {
            return "INVALID";
        }

        return final_string_replaced;
    }
    
    graph_functions_initial() {
        this.verticies = [];
        let final_str = "";
        let final_str_underlay = "";
        let final_str_zones = "";
        let final_str_masks = `<rect x="0" y="0" width="1920" height="1080" fill="white"/>`

        for (let i = this.zones.length-1; i >= 0; i--) {
            if (!Object.hasOwn(this.zones[i], 'invisible')) {
                let verticies_str = get_verticies_str_polygon(this.zones[i].verticies);
                final_str_zones += `<polygon class="svg_zone_${this.zones[i].type}" points="${verticies_str}"/>`;
                if (this.zones[i].type == "emp") {
                    final_str_masks += `<polygon points="${verticies_str}" fill="black" />`;
                }
            }
        }

        for (let i = this.yfunctions.length-1; i >= 0; i--) {
            let verticies = get_vertices(this.yfunctions[i][1], CONFIG.settings.step, CONFIG.settings.small_step, -18, 18);
            for (let j = 1; j < verticies.length; j++) {
                this.verticies.push(verticies[j]);
            }
            let verticies_str = get_verticies_str(verticies[0]);
            final_str += `<path id="svg_path_n${i}" stroke="${CONFIG.settings.function_colors[i]}" stroke-width="${CONFIG.settings.width}" class="svg_path" mask="url(#myMask)" d="${verticies_str}"/>`;
        }

        for (let i = this.winning_functions.length-1; i >= 0; i--) {
            let verticies = get_vertices(this.winning_functions[i], CONFIG.settings.step, CONFIG.settings.small_step, -18, 18);
            for (let j = 1; j < verticies.length; j++) {
                this.verticies_winning.push(verticies[j]);
            }
            let verticies_str = get_verticies_str(verticies[0]);
            final_str_underlay += `<path stroke="rgb(0, 0, 0)" stroke-width="${CONFIG.settings.width}" class="svg_path" d="${verticies_str}"/>`;
        }
        
        document.getElementById("svg_div").innerHTML = `<mask id="myMask" maskUnits="userSpaceOnUse">${final_str_masks}</mask>${final_str}`;
        document.getElementById("svg_div_underlay").innerHTML = final_str_underlay;
        document.getElementById("svg_div_zones").innerHTML = final_str_zones;

        if (this.verticies.length > 0) {
            create_walls(this.verticies);
        }
        create_zones();
    }

    graph_functions_update(no_animation) {
        this.verticies = [];

        for (let i = this.yfunctions.length-1; i >= 0; i--) {
            let verticies = get_vertices(this.yfunctions[i][1], CONFIG.settings.step, CONFIG.settings.small_step, -18, 18);
            for (let j = 0; j < verticies.length; j++) {
                for (let k = 1; k < verticies.length; k++) {
                    this.verticies.push(verticies[k]);
                }
                let verticies_str = get_verticies_str(verticies[0]);

                if (no_animation) {
                    document.getElementById(`svg_path_n${i}`).setAttribute("d", verticies_str);
                } else {
                    gsap.to(document.getElementById(`svg_path_n${i}`), {duration: CONFIG.settings.function_transition_duration, morphSVG: verticies_str, ease: "power1.inOut"});
                }
                
                // setTimeout(function() {
                //     document.getElementById(`svg_path_n${i}`).setAttribute("d", verticies_str);
                // }, CONFIG.settings.function_transition_duration * 1000);
            }
        }
        
        if (this.verticies.length > 0) {
            create_walls(this.verticies);
        }
    }
}

function ccos(x) {
    return Math.cos(x);
}