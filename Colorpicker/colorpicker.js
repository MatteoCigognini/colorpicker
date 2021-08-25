var abs_mouse_pos = [0, 0];
var active_element = null;


class Color_Picker {
    constructor() {
        this.selected_slider = null;
        this.position = [0, 0];
        this.window = document.getElementById("color-picker");
        this.header = document.getElementById("color-picker-header");
        this.color_square = document.getElementById("color-square");
        this.ctx = this.color_square.getContext("2d");
        this.color_slider = new Slider(-11, 244, -11, 244, "square", "color-slider", "color-selector")
        this.hue_slider = new Slider(0, 0, -10, 245, "vertical", "hue-slider", "hue-selector")
        this.hue_slider.selector.style.backgroundColor = "hsl(0, 100%, 50%)";
        this.current_color = this.hsl(Math.floor(this.hue_slider.value) * 360 / 256, Math.floor(this.color_slider.value[0] * 50 / 256), 50);
        this.hue_input = new Button_Slider("hue", "H", 65, 0, 3, "number", 360);
        this.saturation_input = new Button_Slider("saturation", "S", 65, 0, 3, "number", 255);
        this.lightness_input = new Button_Slider("lightness", "L", 65, 0, 3, "number", 255);
        this.alpha_input = new Button_Slider("alpha", "A", 65, 0, 3, "number", 255);
        this.red_input = new Button_Slider("red", "R", 65, 0, 3, "number", 255);
        this.green_input = new Button_Slider("green", "G", 65, 0, 3, "number", 255);
        this.blue_input = new Button_Slider("blue", "B", 65, 0, 3, "number", 255);
        this.hex_input = new Button_Slider("hex", "Hex", 70, 0, 6, "hex", 255);
        this.new_color = document.getElementById("new-color");
        this.old_color = document.getElementById("old-color");

        this.init();
        this.draw_color_square(0);
    }

    init() {
        this.new_color.style.backgroundColor = this.current_color;
        this.old_color.style.backgroundColor = this.current_color;
        this.color_square.width = 256;
        this.color_square.height = 256;
        this.color_slider.selector.style.backgroundColor = "white";
    }

    draw_color_square(hue) {
        var gradB = this.ctx.createLinearGradient(1, 1, 1, 256);
        gradB.addColorStop(0, "white");
        gradB.addColorStop(1, "black");

        var gradC = this.ctx.createLinearGradient(1, 1, 256, 1);
        gradC.addColorStop(0, "hsla(" + hue + ",100%,50%,0)");
        gradC.addColorStop(1, "hsla(" + hue + ",100%,50%,1)");

        this.ctx.fillStyle = gradB;
        this.ctx.fillRect(0, 0, 256, 256);
        this.ctx.fillStyle = gradC;
        this.ctx.globalCompositeOperation = "multiply";
        this.ctx.fillRect(0, 0, 256, 256);
        this.ctx.globalCompositeOperation = "source-over";
    }

    toggle_display() {
        if (getComputedStyle(this.window, null).display == "grid") {
            this.window.style.display = "none";
        } else {
            this.window.style.display = "grid";
        }
    }

    update_color() {
        var hue = Math.ceil(this.hue_slider.value * 360 / 256);

        var RGB = this.ctx.getImageData(this.color_slider.value[0], this.color_slider.value[1], 1, 1).data;
        console.log(this.color_slider.value[1]);
        // this.hue_input.input.value = H;
        // this.saturation_input.input.value = S;
        // this.lightness_input.input.value = L;
        this.red_input.input.value = RGB[0];
        this.green_input.input.value = RGB[1];
        this.blue_input.input.value = RGB[2];

        var hue_color = this.hsl(hue, 100, 50);
        this.current_color = this.rgb(RGB[0], RGB[1], RGB[2]);

        this.hue_slider.selector.style.backgroundColor = hue_color;
        this.color_slider.selector.style.backgroundColor = this.current_color;
        this.new_color.style.backgroundColor = this.current_color;


        this.draw_color_square(hue);
    }

    rgb(r, g, b) {
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    hsl(h, s, l) {
        return "hsl(" + h + "," + s + "%," + l + "%)";
    }

    hsl_to_rgb(h, s, l) {
        var h = h / 359;
        var s = s / 100
        var l = l / 100
        var r, g, b;

        if (s == 0) {
            r = g = b = l;
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.floor(r * 256), Math.floor(g * 256), Math.floor(b * 256)];
    }
}

class Slider {
    constructor(min_x, max_x, min_y, max_y, direction, name, selector) {
        this.name = name;
        this.bar = document.getElementById(name);
        this.selector = document.getElementById(selector);
        this.min_x = min_x;
        this.max_x = max_x;
        this.min_y = min_y;
        this.max_y = max_y;
        this.direction = direction;
        if (direction == "square") {
            this.value = [0, 0];
        } else {
            this.value = 0
        }
    }

    move_slider() {
        if (this.direction == "vertical") {
            this.selector.style.top = this.selector.offsetTop - this.selector.getBoundingClientRect().y + abs_mouse_pos[1] + this.min_y + "px";
            this.clamp_y();
            this.value = this.selector.offsetTop - this.min_y;
        } else if (this.direction == "square") {
            this.selector.style.left = this.selector.offsetLeft - this.selector.getBoundingClientRect().x + abs_mouse_pos[0] + this.min_x + "px";
            this.selector.style.top = this.selector.offsetTop - this.selector.getBoundingClientRect().y + abs_mouse_pos[1] + this.min_y + "px";
            this.clamp_x();
            this.clamp_y();
            this.value[0] = this.selector.offsetLeft - this.min_x;
            this.value[1] = this.selector.offsetTop - this.min_y;
        }

        color_picker.update_color();
    }

    clamp_x() {
        if (this.selector.offsetLeft < this.min_x) {
            this.selector.style.left = this.min_x + "px";
        }
        if (this.selector.offsetLeft > this.max_x) {
            this.selector.style.left = this.max_x + "px";
        }
    }

    clamp_y() {
        if (this.selector.offsetTop < this.min_y) {
            this.selector.style.top = this.min_y + "px";
        }
        if (this.selector.offsetTop > this.max_y) {
            this.selector.style.top = this.max_y + "px";
        }
    }
}

class Button_Slider {
    constructor(name, button_name, width, default_val, max_length, type, max_value) {
        this.name = name;
        this.wrapper = document.getElementById(name);
        this.input = document.createElement("input");
        this.max_value = max_value;
        this.init(button_name, width, default_val, max_length, type);
    }

    init(button_name, width, default_val, max_length, type) {
        this.wrapper.style.overflow = "auto";
        this.wrapper.style.height = 25 + "px";

        let name_elem = document.createElement("span");
        name_elem.innerHTML = button_name + ":";
        name_elem.style.userSelect = "none";
        name_elem.style.color = "white";
        name_elem.style.float = "left";
        name_elem.style.lineHeight = "25px";
        this.wrapper.appendChild(name_elem);

        let input_wrapper = document.createElement("div");
        input_wrapper.style.position = "relative"
        input_wrapper.style.overflow = "auto";
        input_wrapper.style.height = "inherit";
        input_wrapper.style.float = "right";
        this.wrapper.appendChild(input_wrapper);

        this.input.style.width = width + "px";
        this.input.style.height = "inherit";
        this.input.style.backgroundColor = "rgb(23, 23, 23)";
        this.input.style.borderRadius = "4px";
        this.input.style.border = "0";
        this.input.style.padding = "0";
        this.input.style.color = "white";
        this.input.style.fontSize = "12pt";
        this.input.style.padding = "0 0 0 5px";
        this.input.style.outline = "none";
        this.input.value = default_val;
        if (type == "hex") {
            this.input.onkeypress = this.is_hex;
        } else {
            this.input.oninput = this.number_oninput(this, this.input);
            this.input.onkeypress = this.is_number;
            this.input.onchange = this.number_onchange(this, this.input)
        }
        this.input.maxLength = max_length;
        input_wrapper.appendChild(this.input);

        if (type == "number") {
            let caret = document.createElement("i")
            caret.className = "fas fa-caret-down";
            caret.style.position = "absolute";
            caret.style.color = "white";
            caret.style.lineHeight = this.wrapper.clientHeight + "px";
            caret.style.fontSize = "16pt";
            caret.style.right = "5px";
            input_wrapper.appendChild(caret);
        }
    }

    is_number(evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }

    is_hex(evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode >= 97 && charCode <= 102) {
            return true;
        }
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }

    number_onchange(owner, input_elem) {
        return function () {
            if (input_elem.value.length == 0) {
                input_elem.value = 0;
            }
            color_picker.update_color();
        }
    }

    number_oninput(owner, input_elem) {
        return function () {
            var leading_zero = /^0[0-9].*$/;
            if (leading_zero.test(input_elem.value)) {
                input_elem.value = parseInt(input_elem.value, 10);
            }
            if (input_elem.value > owner.max_value) {
                input_elem.value = owner.max_value;
            }
            color_picker.update_color();
        }
    }

}
var color_picker = new Color_Picker();
color_picker.hue_slider.selector.onmousedown = function () {
    active_element = color_picker.hue_slider.selector;
}
color_picker.hue_slider.bar.onmousedown = function () {
    active_element = color_picker.hue_slider.selector;
}

color_picker.color_slider.selector.onmousedown = function () {
    active_element = color_picker.color_slider.selector;
}
color_picker.color_slider.bar.onmousedown = function () {
    active_element = color_picker.color_slider.selector;
}


window.addEventListener("mousemove", function (e) {
    e.stopPropagation();
    let x = e.pageX;
    let y = e.pageY;
    abs_mouse_pos = [x, y];

    if (active_element == color_picker.hue_slider.selector) {
        color_picker.hue_slider.move_slider();
    } else if (active_element == color_picker.color_slider.selector) {
        color_picker.color_slider.move_slider();
    }
});

window.addEventListener("mousedown", function (e) {
    e.stopPropagation();
    if (active_element == color_picker.hue_slider.selector) {
        color_picker.hue_slider.move_slider();
    } else if (active_element == color_picker.color_slider.selector) {
        color_picker.color_slider.move_slider();
    }
});

window.addEventListener("mouseup", function () {
    active_element = null;
});