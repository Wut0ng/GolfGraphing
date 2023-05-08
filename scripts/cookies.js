
var current_level_number = 0;
var unlocked_level = 0;

function process_first_level() {
    unlocked_level = get_level_cookie();
    current_level_number = unlocked_level;

    save_level_cookie();
    create_menu();

    console.log("Cookie:", unlocked_level);

    return new Level(CONFIG.levels[current_level_number]);
}

function clear_cookie() {
    unlocked_level = 0;
    current_level_number = 0;
    save_level_cookie();
}

function get_level_cookie() {
    let unlocked_level_cookie_value = getCookie("unlockedLevel");
    if (unlocked_level_cookie_value == null) {
        return 0;
    }
    return Number(unlocked_level_cookie_value);
}

function save_level_cookie() {
    setCookie("unlockedLevel", `${unlocked_level}`, 99999);
}

function load_next_level() {
    current_level_number += 1;
    if (current_level_number >= CONFIG.levels.length) {
        current_level_number = 0;
    }
    if (current_level_number > unlocked_level) {
        unlocked_level = current_level_number;
        save_level_cookie();
        create_menu();
    }
    current_level = new Level(CONFIG["levels"][current_level_number]);
    current_level.load(false);
}

function play_level(number) {
    document.body.classList.remove("master_show_menu");
    current_level_number = number;
    current_level = new Level(CONFIG["levels"][current_level_number]);
    current_level.load(false);
}

function create_menu() {
    let final_str = "";

    for (let i = 0; i < CONFIG.levels.length; i++) {
        if (i > unlocked_level) {
            break;
        }
        
        final_str += `<div onclick="play_level(${i})" class="level_selection_level"><div class="level_selection_level_text">Chapter ${CONFIG.levels[i].chapter_number}    -    Level ${CONFIG.levels[i].level_number}</div><div class="button_play_level">Play</div></div>`;
    }

    document.getElementById("level_selection_box").innerHTML = final_str;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + ";path=/;SameSite=Lax";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}