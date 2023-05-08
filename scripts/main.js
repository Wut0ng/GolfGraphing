
let screen_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
ROOT.style.setProperty('--master_width', `${screen_width * 0.32}px`);
ROOT.style.setProperty('--box_transition_duration', `${CONFIG.settings.box_transition_duration}s`);

var main_confetti = confetti.create(document.getElementById('canvas_confetti'), { useWorker: false });
var explosion_confetti = confetti.create(document.getElementById('canvas_confetti_explosion'), { useWorker: false });

var current_level = process_first_level();
current_level.load(false);
