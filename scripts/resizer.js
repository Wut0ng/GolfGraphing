
const master_resizer = document.getElementById("master_resizer");

const resizerMouseDownHandler = function(e) {
    document.addEventListener('mousemove', resizerMouseMoveHandler);
    document.addEventListener('mouseup', resizerMouseUpHandler);
    document.body.classList.add("master_resizing");
};

const resizerMouseMoveHandler = function(e) {
    if (document.body.classList.contains("master_resizing")) {
        let screen_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        ROOT.style.setProperty('--master_width', `${Math.min(Math.max(e.clientX, screen_width * 0.08), screen_width * 0.92)}px`);
    }
};

const resizerMouseUpHandler = function() {
    document.removeEventListener('mousemove', resizerMouseMoveHandler);
    document.removeEventListener('mouseup', resizerMouseUpHandler);
    document.body.classList.remove("master_resizing");
};

master_resizer.addEventListener('mousedown', resizerMouseDownHandler);
