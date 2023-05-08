
var box_count = 0;
var time_of_last_update_scroll;

class Box {
    type;
    calcul_type;
    id;
    content;

    constructor(box_content) {
        if (box_content.replaceAll('[b]', '') == "+" || box_content.replaceAll('[b]', '') == "-" || box_content.replaceAll('[b]', '') == "*" || box_content.replaceAll('[b]', '') == "%") {
            if (box_content.includes("[b]")) {
                this.type = "bounded_sign_box";
            } else {
                this.type = "sign_box";
            }
            this.calcul_type = "sign_box";
        } else {
            if (box_content.includes("[b]")) {
               this.type = "bounded_box";
            } else {
                this.type = "normal_box";
            }
            this.calcul_type = "normal_box";
        }

        this.content = box_content;
        this.id = `box_n${box_count}`;
        box_count++;
    }

    get_html_string() {
        return `<div class="box ${this.type}" id="${this.id}" box_content="${this.content.replaceAll('[b]', '')}" box_type="${this.type}" calcul_type="${this.calcul_type}">${this.content
            .replaceAll('[^s]', '<div class="exponent">')
            .replaceAll('[^e]', '</div>')
            .replaceAll('[fs]', '<div class="fraction"><div class="fraction_top">')
            .replaceAll('[fm]', '</div><div class="fraction_middle"></div><div class="fraction_bottom">')
            .replaceAll('[fe]', '</div></div>')
            .replaceAll('[b]', '')
            .replaceAll('%', '/')
        }</div>`;
    }

    set_event_listener() {
        let box = document.getElementById(this.id);
        let parent = box.parentNode;
        let box_holders = document.getElementsByClassName("box_holder");
        let width;
        let lastX;
        let lastY;
        let mouseX;
        let mouseY;
        let is_moving = false;
        let box_id = this.id;
        let affected_siblings = [];
        
        const boxMouseDownHandler = function(event) {
            if (event.button == 0) {
                is_moving = true;
                time_of_last_update_scroll = performance.now();

                let e = { clientX: event.clientX, clientY: event.clientY };
                let box_holder_bounding = parent.getBoundingClientRect();
                let master_left_bounding = parent.parentNode.parentNode.getBoundingClientRect();
                e.clientX = Math.max(master_left_bounding.left, e.clientX);
                e.clientY = Math.max(master_left_bounding.top, Math.min(e.clientY, master_left_bounding.bottom));
                if (box.getAttribute("box_type") == "bounded_box" || box.getAttribute("box_type") == "bounded_sign_box") {
                    e.clientY = Math.max(box_holder_bounding.top, Math.min(e.clientY, box_holder_bounding.bottom));
                }

                box.classList.add("box_notransition");
                box.style.transform = `translate(${0}px, ${0}px)`;
                let rect = box.getBoundingClientRect();
                lastX = (rect.right + rect.left) / 2;
                lastY = (rect.top + rect.bottom) / 2;
                box.classList.remove("box_notransition");

                // lastInnerY = document.getElementById("inner_master_left").getBoundingClientRect().top;
                lastX = (rect.right + rect.left) / 2;
                lastY = (rect.top + rect.bottom) / 2;
                let computed_box = window.getComputedStyle(box);
                width = rect.right - rect.left + Number(computed_box.marginLeft.replaceAll("px", "")) + Number(computed_box.marginRight.replaceAll("px", ""));

                let past_box = false;
                for (let i = 0; i < parent.children.length; i++) {
                    if (past_box) {
                        affected_siblings.push(parent.children[i]);
                    } else if (parent.children[i].id == this.id) {
                        past_box = true;
                    }
                }
                
                box.classList.add("moving_box");
                box.classList.remove("post_moving_box");
                document.addEventListener('mousemove', boxMouseMoveHandler);
                document.addEventListener('mouseup', boxMouseUpHandler);
                document.body.classList.add("master_grabbing");

                boxMouseMoveHandler(e);
            }
        };

        const boxMouseMoveHandler = function(event, is_first = true) {

            let e = { clientX: event.clientX, clientY: event.clientY };
            let box_holder_bounding = parent.getBoundingClientRect();
            let master_left = document.getElementById("master_left");

            let master_left_bounding = master_left.getBoundingClientRect();
            e.clientX = Math.max(master_left_bounding.left, e.clientX);
            e.clientY = Math.max(master_left_bounding.top, Math.min(e.clientY, master_left_bounding.bottom));
            if (box.getAttribute("box_type") == "bounded_box" || box.getAttribute("box_type") == "bounded_sign_box") {
                e.clientY = Math.max(box_holder_bounding.top, Math.min(e.clientY, box_holder_bounding.bottom));
            }
            
            let total_overset = 0;
            if (is_first) {
                mouseX = event.clientX;
                mouseY = event.clientY;
            }

            let new_time = performance.now()
            let time_elapsed = Math.min(new_time - time_of_last_update_scroll, 2000);
            time_of_last_update_scroll = new_time;

            let above_overset = -CONFIG.settings.auto_scroll_speed * Math.min(1, Math.max(0, master_left_bounding.top + 30 - e.clientY));
            let under_overset = CONFIG.settings.auto_scroll_speed * Math.min(1, Math.max(0, e.clientY - (master_left_bounding.bottom - 50)));
            total_overset = (above_overset + under_overset);

            let before_scroll = master_left.scrollTop;
            document.getElementById("master_left").scrollBy(0, total_overset * time_elapsed);
            let after_scroll = master_left.scrollTop;
            let scroll_delta = after_scroll - before_scroll;
            lastY -= scroll_delta;

            if (document.body.classList.contains("master_grabbing") && is_moving && (is_first || total_overset != 0)) {
                requestAnimationFrame(function() {
                    if (mouseY == event.clientY && mouseX == event.clientX) {
                        boxMouseMoveHandler(event, false);
                    }
                });
            }

            if (document.body.classList.contains("master_grabbing") && is_moving) {

                box.style.transform = `translate(${e.clientX - lastX}px, ${e.clientY - lastY}px)`;

                let current_box_i = -1;
                let current_box_j = -1;
                for (let i = 0; i < box_holders.length; i++) {
                    let boxes_in_holder = box_holders[i].getElementsByClassName("box");
                    for (let j = 0; j < boxes_in_holder.length; j++) {
                        if (boxes_in_holder[j] == box) {
                            current_box_i = i;
                            current_box_j = j;
                        }
                    }
                }

                let has_colided = false;
                for (let i = 0; i < box_holders.length; i++) {
                    has_colided = false;

                    let holder_rect = box_holders[i].getBoundingClientRect();
                    let y_top = holder_rect.top;
                    if (i == 0) {
                        y_top = -99999;
                    }
                    let y_bottom = holder_rect.bottom;
                    if (i+1 == box_holders.length) {
                        y_bottom = 99999;
                    }

                    let boxes_in_holder = box_holders[i].getElementsByClassName("box");
                    
                    for (let j = 0; j < boxes_in_holder.length; j++) {
                        let target_box = boxes_in_holder[j];
                        if (target_box != box) {
                            if (has_colided) {
                                if (affected_siblings.includes(target_box)) {
                                    target_box.style.transform = `translate(0, 0)`;
                                } else {
                                    target_box.style.transform = `translate(${width}px, 0)`;
                                }
                            } else {
                                let rect_right = target_box.getBoundingClientRect();
                                let x_right = (rect_right.right + rect_right.left) / 2;

                                let x_left = -99999;
                                let left_index = j - 1;
                                if (i == current_box_i && left_index == current_box_j) {
                                    left_index--;
                                }
                                if (left_index >= 0) {
                                    let rect_left = boxes_in_holder[left_index].getBoundingClientRect();
                                    x_left = (rect_left.right + rect_left.left) / 2;
                                }


                                if (e.clientX >= x_left && e.clientX <= x_right && e.clientY >= y_top && e.clientY <= y_bottom) {
                                    has_colided = true;
                                    if (affected_siblings.includes(target_box)) {
                                        target_box.style.transform = `translate(0, 0)`;
                                    } else {
                                        target_box.style.transform = `translate(${width}px, 0)`;
                                    }
                                } else {
                                    if (affected_siblings.includes(target_box)) {
                                        target_box.style.transform = `translate(-${width}px, 0)`;
                                    } else {
                                        target_box.style.transform = `translate(0, 0)`;
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                document.removeEventListener('mousemove', boxMouseMoveHandler);
                document.removeEventListener('mouseup', boxMouseUpHandler);
            }
        };
        
        const boxMouseUpHandler = function(event) {

            is_moving = false;
            
            let e = { clientX: event.clientX, clientY: event.clientY };
            let box_holder_bounding = parent.getBoundingClientRect();
            let master_left_bounding = parent.parentNode.parentNode.getBoundingClientRect();
            e.clientX = Math.max(master_left_bounding.left, e.clientX);
            e.clientY = Math.max(master_left_bounding.top, Math.min(e.clientY, master_left_bounding.bottom));
            if (box.getAttribute("box_type") == "bounded_box" || box.getAttribute("box_type") == "bounded_sign_box") {
                e.clientY = Math.max(box_holder_bounding.top, Math.min(e.clientY, box_holder_bounding.bottom));
            }

            document.removeEventListener('mousemove', boxMouseMoveHandler);
            document.removeEventListener('mouseup', boxMouseUpHandler);
            
            if (document.body.classList.contains("master_grabbing")) {
                let triggered = false;
                let new_box_i;
                let new_box_j;
                let current_box_i;
                let current_box_j;
                for (let i = 0; i < box_holders.length; i++) {
                    let boxes_in_holder = box_holders[i].getElementsByClassName("box");
                    for (let j = 0; j < boxes_in_holder.length; j++) {
                        if (boxes_in_holder[j] == box) {
                            current_box_i = i;
                            current_box_j = j;
                        }
                    }
                }

                for (let i = 0; i < box_holders.length; i++) {
                    let holder_rect = box_holders[i].getBoundingClientRect();
                    let y_top = holder_rect.top;
                    if (i == 0) {
                        y_top = -99999;
                    }
                    let y_bottom = holder_rect.bottom;
                    if (i+1 == box_holders.length) {
                        y_bottom = 99999;
                    }
                    let boxes_in_holder = box_holders[i].getElementsByClassName("box");
                    for (let j = 0; j < boxes_in_holder.length; j++) {
                        let target_box = boxes_in_holder[j];
                        if (box != target_box) {
                            let rect_right = target_box.getBoundingClientRect();
                            let x_right = (rect_right.right + rect_right.left) / 2;

                            let x_left = -99999;
                            let left_index = j - 1;
                            if (i == current_box_i && left_index == current_box_j) {
                                left_index--;
                            }
                            if (left_index >= 0) {
                                let rect_left = boxes_in_holder[j-1].getBoundingClientRect();
                                x_left = (rect_left.right + rect_left.left) / 2;
                            }

                            if (e.clientX >= x_left && e.clientX <= x_right && e.clientY >= y_top && e.clientY <= y_bottom) {
                                new_box_i = i;
                                new_box_j = j;

                                triggered = true;
                                break;
                            }
                        }
                    }
                    if (triggered) {
                        break;
                    } else {
                        let last_child_x = 0;
                        if (box_holders[i].getElementsByTagName("*").length > 0) {
                            let last_child_rect = box_holders[i].lastChild.getBoundingClientRect();
                            last_child_x = (last_child_rect.right + last_child_rect.left) / 2;
                        }

                        if (e.clientX >= last_child_x && e.clientY >= y_top && e.clientY <= y_bottom) {
                            new_box_i = i;
                            new_box_j = boxes_in_holder.length;

                            triggered = true;
                            break;
                        }
                    }
                }

                box.classList.remove("moving_box");
                box.classList.remove("post_moving_box");
                document.body.classList.remove("master_grabbing");

                if (triggered && !(new_box_i == current_box_i && (new_box_j == current_box_j || new_box_j-1 == current_box_j))) {
                    
                    let boxes_id_pos = []; // [Id, left_pos, top_pos]
                    let all_boxes = document.getElementsByClassName("box");
                    for (let i = 0; i < all_boxes.length; i++) {
                        let old_rect = all_boxes[i].getBoundingClientRect();
                        boxes_id_pos.push([all_boxes[i].id, old_rect.x, old_rect.y]);
                    }
                    
                    document.body.classList.add("master_notransition");

                    let target_section_boxes = box_holders[new_box_i].getElementsByClassName("box");
                    if (new_box_j >= target_section_boxes.length) {
                        box_holders[new_box_i].insertAdjacentHTML("beforeend", box.outerHTML);
                    } else {
                        target_section_boxes[new_box_j].insertAdjacentHTML("beforebegin", box.outerHTML);
                    }
                    box.remove();
                    box = document.getElementById(box_id);
                    parent = box.parentNode;
                    box.addEventListener('mousedown', boxMouseDownHandler);

                    for (let i = 0; i < boxes_id_pos.length; i++) {
                        let elem =  document.getElementById(boxes_id_pos[i][0]);
                        elem.style.transform = '';
                        let new_rect = elem.getBoundingClientRect();
                        let dx = new_rect.x - boxes_id_pos[i][1];
                        let dy = new_rect.y - boxes_id_pos[i][2];
                        elem.style.transform = `translate(${-dx}px, ${-dy}px)`;
                    }
                    let _ = document.getElementById(boxes_id_pos[boxes_id_pos.length-1][0]).getBoundingClientRect(); // DONT REMOVE! Somehow the transition of the last box does not work without this line
                    
                    document.body.classList.remove("master_notransition");
                    let all_boxes_new = document.getElementsByClassName("box");
                    for (let i = 0; i < all_boxes_new.length; i++) {
                        all_boxes_new[i].style.transform = '';
                    }
                    setTimeout(function() {
                        current_level.update_functions();
                    }, 0);
                } else {
                    let all_boxes = document.getElementsByClassName("box");
                    for (let i = 0; i < all_boxes.length; i++) {
                        all_boxes[i].style.transform = '';
                    }
                }
                
                affected_siblings = [];

                document.getElementById(box_id).classList.add("post_moving_box");
                setTimeout(function() {
                    let temp_box = document.getElementById(box_id);
                    if (temp_box != undefined) {
                        temp_box.classList.remove("post_moving_box");
                    }
                }, CONFIG.settings.box_transition_duration * 1000 + 10);
            }
        };
        
        box.addEventListener('mousedown', boxMouseDownHandler);
    }
}
