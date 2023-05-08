
var section_count = 0;

class Section {
    type;
    id;
    number;
    function_color;
    boxes;
    letter;

    constructor(section_json) {
        this.type = section_json["type"];
        this.id = `section_n${section_count}`;
        this.number = section_count;
        this.function_color = section_json;
        section_count++;
        this.boxes = [];
        this.letter = section_json.letter;
        this.text = section_json.text;
        this.value = section_json.value;
        this.step = section_json.step || 1;
        
        this.min = section_json.min;
        this.max = section_json.max;
        this.default = section_json.default;

        if (Object.hasOwn(section_json, 'boxes')) {
            let boxes_splitted = section_json.boxes.split("/");
            if (section_json.boxes == "") {
                boxes_splitted = [];
            }
            for (let i = 0; i < boxes_splitted.length; i++) {
                this.boxes.push(new Box(boxes_splitted[i]));
            }
        }
    }

    get_html_string() {
        let html_string = '';
        switch(this.type) {
            case "y_function":
                html_string = `<div class="section"><div class="function_start_color" style="background: ${CONFIG.settings.function_colors[this.number]};"></div><div class="function_start_y">y</div><div class="function_start">=</div><div class="box_holder" id="${this.id}">`;
                for (let i = 0; i < this.boxes.length; i++) {
                    html_string += this.boxes[i].get_html_string();
                }
                html_string += '</div></div>';
                return html_string;

            case "y_function_locked":
                html_string = `<div class="section"><div class="function_start_color" style="background: ${CONFIG.settings.function_colors[this.number]};"></div><div class="function_start_y">y</div><div class="function_start">=</div><div class="text_holder" id="${this.id}">${this.text}</div></div>`;
                return html_string;

            case "constant":
                html_string = `<div class="section constant_section"><div class="constant_section_start">${this.letter}</div><div class="function_start">=</div><div class="box_holder" id="${this.id}">`;
                for (let i = 0; i < this.boxes.length; i++) {
                    html_string += this.boxes[i].get_html_string();
                }
                html_string += '</div></div>';
                return html_string;
            
            case "constant_slider":
                html_string = `<div class="section constant_section constant_slider"><div class="constant_slider_upper"><div class="constant_section_start">${this.letter}</div><div class="function_start">=</div><div class="constant_slider_number" id="${this.id}_number">${this.default}</div></div><div class="constant_slider_lower"><div class="constant_slider_number_left">${this.min}</div><input type="range" min="${this.min}" max="${this.max}" value="${this.default}" step="${this.step}" class="slider" slider_constant_letter="${this.letter}" id="${this.id}"><div class="constant_slider_number_right">${this.max}</div></div></div>`;
                return html_string;

            case "bank":
                html_string = `<div class="section section_bank"><div class="section_bank_start"></div><div class="box_holder" id="${this.id}">`;
                for (let i = 0; i < this.boxes.length; i++) {
                    html_string += this.boxes[i].get_html_string();
                }
                html_string += '</div></div>';
                return html_string;

            default:
                return html_string;
        }
    }

    set_event_listeners() {
        switch(this.type) {
            case "constant_slider":
                let slider_id = this.id;
                let slider = document.getElementById(slider_id);
                slider.setAttribute("has_changed", "true");
                slider.onchange = function() {
                    if (!slider.disabled) {
                        slider.setAttribute("has_changed", "true");
                        setTimeout(function() {
                            if (!slider.disabled) {
                                current_level.update_functions();
                            }
                        }, 0);
                    }
                }
                slider.oninput = function() {
                    if (!slider.disabled) {
                        slider.setAttribute("has_changed", "false");
                        let current_value = slider.value;
                        document.getElementById(`${this.id}_number`).innerHTML = current_value;
                        setTimeout(function() {
                            if (current_value == slider.value && slider.getAttribute("has_changed") == "false") {
                                slider.setAttribute("has_changed", "true");
                                if (!slider.disabled) {
                                    current_level.update_functions();
                                }
                            }
                        }, 40);
                    }
                }
                break;

            default:
                for (let i = 0; i < this.boxes.length; i++) {
                    this.boxes[i].set_event_listener();
                }
                break;
        }
    }
}
