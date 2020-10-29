const fine_canvas = document.getElementById("fine"),
    fine_picker = document.getElementById("fine_picker");

const coarse_canvas = document.getElementById("coarse"),
    coarse_picker = document.getElementById("coarse_picker");

const colour_instance_box = document.getElementById("instance"),
    colour_value_box = document.getElementById("value");

var fine_canvas_ctx, coarse_canvas_ctx, fine_picker_ctx, coarse_picker_ctx;
var current_col, picker_x = 0,
    picker_y = 0;

function init() {
    coarse_canvas.width = coarse_canvas.clientWidth;
    coarse_canvas.height = coarse_canvas.clientHeight;
    coarse_picker.height = coarse_picker.clientHeight;
    coarse_picker.width = coarse_picker.clientWidth;
    coarse_canvas_ctx = coarse_canvas.getContext("2d");
    coarse_picker_ctx = coarse_picker.getContext("2d");

    fine_canvas.width = fine_canvas.clientWidth;
    fine_canvas.height = fine_canvas.clientHeight;
    fine_picker.height = fine_canvas.height;
    fine_picker.width = fine_canvas.width;
    fine_canvas_ctx = fine_canvas.getContext("2d");
    fine_picker_ctx = fine_picker.getContext("2d");

    draw_coarse_gradient();
    draw_fine_gradient("#f00");
    pick_colour_coarse(0);
}

function draw_coarse_gradient() {
    var gradient = coarse_canvas_ctx.createLinearGradient(0, 0, 0, coarse_canvas.height);
    gradient.addColorStop(0, "#f00");
    gradient.addColorStop(1 / 6, "#f0f");
    gradient.addColorStop(1 / 6 * 2, "#00f");
    gradient.addColorStop(1 / 6 * 3, "#0ff");
    gradient.addColorStop(1 / 6 * 4, "#0f0");
    gradient.addColorStop(1 / 6 * 5, "#ff0");
    gradient.addColorStop(1, "#f00");
    coarse_canvas_ctx.fillStyle = gradient;
    coarse_canvas_ctx.fillRect(0, 0, coarse_canvas.width, coarse_canvas.height);
}

function draw_fine_gradient(final_colour) {
    gradient = fine_canvas_ctx.createLinearGradient(0, 0, fine_canvas.width, 0);
    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(1, final_colour);
    fine_canvas_ctx.fillStyle = gradient;
    fine_canvas_ctx.fillRect(0, 0, fine_canvas.width, fine_canvas.height);

    gradient = fine_canvas_ctx.createLinearGradient(0, 0, 0, fine_canvas.height);
    gradient.addColorStop(0, "#0000");
    gradient.addColorStop(1, "#000");
    fine_canvas_ctx.fillStyle = gradient;
    fine_canvas_ctx.fillRect(0, 0, fine_canvas.width, fine_canvas.height);
}

function pick_colour_coarse(y) {
    const img_data = coarse_canvas_ctx.getImageData(0, y, 1, 1).data;
    coarse_picker_ctx.clearRect(0, 0, coarse_picker.width, coarse_picker.height);
    coarse_picker_ctx.beginPath();
    coarse_picker_ctx.moveTo(0, y);
    coarse_picker_ctx.lineTo(coarse_picker.width, y - coarse_picker.width / 2);
    coarse_picker_ctx.lineTo(coarse_picker.width, y + coarse_picker.width / 2);
    coarse_picker_ctx.fill();
    draw_fine_gradient(`rgb(${img_data[0]},${img_data[1]},${img_data[2]})`);
    pick_colour_fine(picker_x, picker_y);
}

function pick_colour_fine(x, y) {
    const img_data = fine_canvas_ctx.getImageData(x, y, 1, 1).data;
    picker_x = x;
    picker_y = y;
    fine_picker_ctx.clearRect(0, 0, fine_picker.width, fine_picker.height);
    fine_picker_ctx.lineWidth = 2;
    fine_picker_ctx.strokeStyle = "black";
    fine_picker_ctx.beginPath();
    fine_picker_ctx.arc(x, y, 10, 0, Math.PI * 2);
    fine_picker_ctx.stroke();
    fine_picker_ctx.strokeStyle = "white";
    fine_picker_ctx.beginPath();
    fine_picker_ctx.arc(x, y, 12, 0, Math.PI * 2);
    fine_picker_ctx.stroke();
    current_col = `rgb(${img_data[0]},${img_data[1]},${img_data[2]})`;
    colour_instance_box.style.backgroundColor = current_col;
    colour_value_box.innerHTML = current_col;
}
init();
window.addEventListener("resize", init);

coarse_picker.onpointerdown = (e) => {
    coarse_picker.onpointermove = colour_pick_coarse;
    coarse_picker.setPointerCapture(e.pointerId);
};
coarse_picker.onpointerup = (e) => {
    coarse_picker.onpointermove = null;
    coarse_picker.releasePointerCapture(e.pointerId)
};
coarse_canvas.onpointerdown = (e) => {
    coarse_canvas.onpointermove = colour_pick_coarse;
    coarse_canvas.setPointerCapture(e.pointerId);
};
coarse_canvas.onpointerup = (e) => {
    coarse_canvas.onpointermove = null;
    coarse_canvas.releasePointerCapture(e.pointerId)
};
fine_picker.onpointerdown = (e) => {
    fine_picker.onpointermove = (e) => {
        fine_picker_rect = fine_picker.getBoundingClientRect();
        pick_colour_fine(e.pageX - fine_picker_rect.left, e.pageY - fine_picker_rect.top);
    };
    fine_picker.setPointerCapture(e.pointerId);
};
fine_picker.onpointerup = (e) => {
    fine_picker.onpointermove = null;
    fine_picker.releasePointerCapture(e.pointerId)
};

function colour_pick_coarse(e) {
    coarse_picker_rect = coarse_picker.getBoundingClientRect();
    pick_colour_coarse(e.pageY - coarse_picker_rect.top);
}