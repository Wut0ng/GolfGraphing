
function disable_all_events() {
    document.body.classList.add("master_no_interaction");

    document.body.classList.remove("master_grabbing");
    document.body.classList.remove("master_resizing");

    document.body.classList.remove("master_reset_button_clicked");
    document.body.classList.remove("master_reset_button_pressed");
    document.body.classList.remove("master_playstop_button_clicked");
    document.body.classList.remove("master_playstop_button_pressed");
    document.body.classList.remove("master_menu_button_clicked");
    document.body.classList.remove("master_menu_button_pressed");
}

function enable_all_events() {
    document.body.classList.remove("master_no_interaction");
}

// ---------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------ Reset --------------------------------------------------------------

function reset_button_trigger() {
    setTimeout(function() {
        current_level.load(true);
    }, 1);
}

let reset_key_pressed = false;
let reset_key_triggered = false;
function reset_key_down() {
    if (!reset_key_pressed && !document.body.classList.contains("master_no_interaction")) {
        reset_key_pressed = true;
        document.body.classList.add("master_reset_button_pressed");
        if (document.body.classList.contains("master_stop_button")) {
            reset_button_trigger();
            document.body.classList.remove("master_reset_button_clicked");
            reset_key_triggered = true;
        }
    }
}

function reset_key_up() {
    if (!reset_key_triggered && reset_key_pressed && document.body.classList.contains("master_reset_button_pressed") && !document.body.classList.contains("master_stop_button") && !document.body.classList.contains("master_no_interaction")) {
        reset_button_trigger();
        document.body.classList.remove("master_reset_button_clicked");
    }
    reset_key_triggered = false;
    reset_key_pressed = false;
    document.body.classList.remove("master_reset_button_pressed");
}

let reset_button_triggered = false;
function reset_button_down() {
    if (!document.body.classList.contains("master_no_interaction")) {
        reset_button_triggered = true;
        document.body.classList.add("master_reset_button_clicked");
        if (document.body.classList.contains("master_stop_button")) {
            reset_button_trigger();
            document.body.classList.remove("master_reset_button_pressed");
            reset_button_triggered = false;
        }
    }
}

function reset_button_up() {
    if (reset_button_triggered && document.body.classList.contains("master_reset_button_clicked") && !document.body.classList.contains("master_stop_button") && !document.body.classList.contains("master_no_interaction")) {
        reset_button_trigger();
        document.body.classList.remove("master_reset_button_pressed");
    }
    reset_button_triggered = false;
    document.body.classList.remove("master_reset_button_clicked");
}

function reset_button_leave() {
    document.body.classList.remove("master_reset_button_clicked");
    reset_button_triggered = false;
}

// ------------------------------------------------------------ Reset --------------------------------------------------------------
// ---------------------------------------------------------- Play Stop ------------------------------------------------------------

function playstop_button_trigger() {
    current_level.play_stop();
}

let playstop_key_pressed = false;
let playstop_key_triggered = false;
function playstop_key_down() {
    if (!playstop_key_pressed && !document.body.classList.contains("master_no_interaction")) {
        playstop_key_pressed = true;
        document.body.classList.add("master_playstop_button_pressed");
        if (document.body.classList.contains("master_stop_button")) {
            playstop_button_trigger();
            document.body.classList.remove("master_playstop_button_clicked");
            playstop_key_triggered = true;
        }
    }
}

function playstop_key_up() {
    if (!playstop_key_triggered && playstop_key_pressed && document.body.classList.contains("master_playstop_button_pressed") && document.body.classList.contains("master_play_button") && !document.body.classList.contains("master_no_interaction")) {
        playstop_button_trigger();
        document.body.classList.remove("master_playstop_button_clicked");
    }
    playstop_key_triggered = false;
    playstop_key_pressed = false;
    document.body.classList.remove("master_playstop_button_pressed");
}

let playstop_button_triggered = false;
function playstop_button_down() {
    if (!document.body.classList.contains("master_no_interaction")) {
        playstop_button_triggered = true;
        document.body.classList.add("master_playstop_button_clicked");
        if (document.body.classList.contains("master_stop_button")) {
            playstop_button_trigger();
            document.body.classList.remove("master_playstop_button_pressed");
            playstop_button_triggered = false;
        }
    }
}

function playstop_button_up() {
    if (playstop_button_triggered && document.body.classList.contains("master_playstop_button_clicked") && document.body.classList.contains("master_play_button") && !document.body.classList.contains("master_no_interaction")) {
        playstop_button_trigger();
        document.body.classList.remove("master_playstop_button_pressed");
    }
    playstop_button_triggered = false;
    document.body.classList.remove("master_playstop_button_clicked");
}

function playstop_button_leave() {
    document.body.classList.remove("master_playstop_button_clicked");
    playstop_button_triggered = false;
}

// ---------------------------------------------------------- Play Stop ------------------------------------------------------------
// ------------------------------------------------------------- Hint --------------------------------------------------------------

function hint_button_trigger() {
    if (document.body.classList.contains("master_show_tooltip") && !document.body.classList.contains("master_hide_tooltip")) {
        document.body.classList.remove("master_show_tooltip");
        document.body.classList.add("master_hide_tooltip");
    } else {
        document.body.classList.add("master_show_tooltip");
        document.body.classList.remove("master_hide_tooltip");
    }
}

let hint_key_pressed = false;
function hint_key_down() {
    if (!hint_key_pressed && !document.body.classList.contains("master_no_interaction")) {
        hint_key_pressed = true;
        document.body.classList.add("master_hint_button_pressed");
    }
}

function hint_key_up() {
    hint_key_pressed = false;
    if (document.body.classList.contains("master_hint_button_pressed") && !document.body.classList.contains("master_no_interaction")) {
        hint_button_trigger();
        document.body.classList.remove("master_hint_button_clicked");
        document.body.classList.remove("master_hint_button_pressed");
    }
}

function hint_button_down() {
    if (!document.body.classList.contains("master_no_interaction")) {
        document.body.classList.add("master_hint_button_clicked");
    }
}

function hint_button_up() {
    if (document.body.classList.contains("master_hint_button_clicked") && !document.body.classList.contains("master_no_interaction")) {
        hint_button_trigger();
        document.body.classList.remove("master_hint_button_clicked");
        document.body.classList.remove("master_hint_button_pressed");
    }
}

function hint_button_leave() {
    document.body.classList.remove("master_hint_button_clicked");
}

// ------------------------------------------------------------- Hint --------------------------------------------------------------
// ------------------------------------------------------------- Menu --------------------------------------------------------------

function menu_button_trigger() {
    if (document.body.classList.contains("master_show_menu")) {
        document.body.classList.remove("master_show_menu");
    } else {
        document.body.classList.add("master_show_menu");
        current_level.stop();
    }
}

let menu_key_pressed = false;
function menu_key_down() {
    if (!menu_key_pressed && !document.body.classList.contains("master_no_interaction")) {
        menu_key_pressed = true;
        document.body.classList.add("master_menu_button_pressed");
    }
}

function menu_key_up() {
    menu_key_pressed = false;
    if (document.body.classList.contains("master_menu_button_pressed") && !document.body.classList.contains("master_no_interaction")) {
        menu_button_trigger();
        document.body.classList.remove("master_menu_button_clicked");
        document.body.classList.remove("master_menu_button_pressed");
    }
}

function menu_button_down() {
    if (!document.body.classList.contains("master_no_interaction")) {
        document.body.classList.add("master_menu_button_clicked");
    }
}

function menu_button_up() {
    if (document.body.classList.contains("master_menu_button_clicked") && !document.body.classList.contains("master_no_interaction")) {
        menu_button_trigger();
        document.body.classList.remove("master_menu_button_clicked");
        document.body.classList.remove("master_menu_button_pressed");
    }
}

function menu_button_leave() {
    document.body.classList.remove("master_menu_button_clicked");
}

// ------------------------------------------------------------- Menu --------------------------------------------------------------
// -------------------------------------------------------------- Tab --------------------------------------------------------------

function tab_key_down() {
    document.body.classList.add("master_tab_view"); // TODO
}

function tab_key_up() {
    document.body.classList.remove("master_tab_view");
}

// -------------------------------------------------------------- Tab --------------------------------------------------------------
// --------------------------------------------------------- Window Resize ---------------------------------------------------------

var old_screen_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
function window_resize() {
    let screen_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let screen_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    ROOT.style.setProperty('--screen_height_no_unit', `${screen_height}`);

    let master_width = Number(getComputedStyle(ROOT).getPropertyValue('--master_width').replace("px", ""));
    let new_master_width = master_width / old_screen_width * screen_width;
    ROOT.style.setProperty('--master_width', `${Math.min(Math.max(new_master_width, screen_width * 0.08), screen_width * 0.92)}px`);

    update_balls();

    old_screen_width = screen_width;

    document.body.classList.remove("master_section_bank_noborder");
    let left_height = Number(window.getComputedStyle(document.getElementById("master_left")).height.replace("px", ""));
    let sections = document.getElementById("inner_master_left").childNodes;
    for (let i = 0; i < sections.length; i++) {
        let section_style = window.getComputedStyle(sections[i]);
        left_height -= Number(section_style.getPropertyValue("height").replace("px", ""));
        left_height -= Number(section_style.getPropertyValue("border-top-width").replace("px", ""));
        left_height -= Number(section_style.getPropertyValue("border-bottom-width").replace("px", ""));
        left_height -= Number(section_style.getPropertyValue("padding-top").replace("px", ""));
        left_height -= Number(section_style.getPropertyValue("padding-bottom").replace("px", ""));
    }
    if (left_height <= 10) {
        document.body.classList.add("master_section_bank_noborder");
        ROOT.style.setProperty('--section_bank_margin', `0px`);
    } else {
        document.body.classList.remove("master_section_bank_noborder");
        ROOT.style.setProperty('--section_bank_margin', `${left_height}px`);
    }
    if (left_height <= -1) {
        document.body.classList.add("master_left_overflow");
    } else {
        document.body.classList.remove("master_left_overflow");
    }
}

// --------------------------------------------------------- Window Resize ---------------------------------------------------------
// -------------------------------------------------------- Event Listeners --------------------------------------------------------

document.addEventListener("keydown", function onEvent(event) {
    if (event.code === "KeyR") {
        reset_key_down();
    } else if (event.code === "Space") {
        playstop_key_down();
    } else if (event.code === "Tab") {
        tab_key_down();
    } else if (event.code === "Escape") {
        menu_key_down();
    } else if (event.code === "KeyH") {
        hint_key_down();
    }
});

document.addEventListener("keyup", function onEvent(event) {
    if (event.code === "KeyR") {
        reset_key_up();
        event.preventDefault();
    } else if (event.code === "Space") {
        playstop_key_up();
        event.preventDefault();
    } else if (event.code === "Tab") {
        tab_key_up();
        event.preventDefault();
    } else if (event.code === "Escape") {
        menu_key_up();
        event.preventDefault();
    } else if (event.code === "KeyH") {
        hint_key_up();
        event.preventDefault();
    }
});

window.addEventListener("resize", function(event) {
    window_resize();
}, true);

// -------------------------------------------------------- Event Listeners --------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------
