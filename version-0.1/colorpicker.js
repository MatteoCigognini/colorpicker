class Picker {
    constructor(target, width, height) {
        this.target = target;
        this.width = width;
        this.height = height;
        this.target.width = width;
        this.target.height = height;
        this.gradientStartColor = "rgb(255, 0, 0)";
        //Get context 
        this.context = this.target.getContext("2d");
        //Bottom gradient bar
        this.gradientBar = { width: this.width, height: 20 };
        //Circle 
        this.pickerCircle = { x: 10, y: 10, width: 7, height: 7 };
        this.pickerBarCircle = { x: 3, y: this.height - this.gradientBar.height, width: 12, height: 12 };
        //Event listener
        this.listenForEvents();
    }

    draw() {
        this.build();
    }

    build() {
        let gradient = this.context.createLinearGradient(0, 0, this.width, (this.height - this.gradientBar.height));
        gradient.addColorStop(0, this.gradientStartColor);
        gradient.addColorStop(1, this.gradientStartColor);
        //Fill it
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.width, (this.height - this.gradientBar.height));
        //White and black
        gradient = this.context.createLinearGradient(0, 0, 0, (this.height - this.gradientBar.height));
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
        //Fill it
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.width, (this.height - this.gradientBar.height));

        //Create bottom linear gradient bar
        gradient = this.context.createLinearGradient(0, this.height - this.gradientBar.height, this.width, this.gradientBar.height);
        gradient.addColorStop(0, "rgb(255, 0, 0)");
        gradient.addColorStop(0.15, "rgb(255, 0, 255)");
        gradient.addColorStop(0.33, "rgb(0, 0, 255)");
        gradient.addColorStop(0.49, "rgb(0, 255, 255)");
        gradient.addColorStop(0.67, "rgb(0, 255, 0)");
        gradient.addColorStop(0.84, "rgb(255, 255, 0)");
        gradient.addColorStop(1, "rgb(255, 0, 0)");
        this.context.fillStyle = gradient;
        this.context.fillRect(0, this.height - this.gradientBar.height, this.gradientBar.width, this.gradientBar.height);

        //Circle 
        this.context.beginPath();
        this.context.arc(this.pickerCircle.x, this.pickerCircle.y, this.pickerCircle.width, 0, Math.PI * 2);
        this.context.strokeStyle = "black";
        this.context.stroke();
        this.context.closePath();

        //Gradient bar circle
        this.context.beginPath();
        this.context.fillStyle = 'white';
        this.context.fillRect(this.pickerBarCircle.x, (this.height - (this.gradientBar.height - (this.gradientBar.height - this.pickerBarCircle.height) / 2)), this.pickerBarCircle.width, this.pickerBarCircle.height);
        this.context.closePath();

    }

    listenForEvents() {
        let isMouseDown = false,
            isMouseDown2 = false;
        const onMouseDown = (e) => {
            isMouseDown = true;
            let currentX = e.clientX - this.target.offsetLeft;
            let currentY = e.clientY - this.target.offsetTop;
            if (currentY < this.height - this.gradientBar.height) {
                isMouseDown2 = false;
                //Move color picker circle
                if (currentY > this.pickerCircle.y && currentY < this.pickerCircle.y + this.pickerCircle.width && currentX > this.pickerCircle.x && currentX < this.pickerCircle.x + this.pickerCircle.width) {
                    isMouseDown = false;
                } else {
                    this.pickerCircle.x = currentX;
                    this.pickerCircle.y = currentY;
                }
            } else {
                isMouseDown = false;
                isMouseDown2 = true;
                //Move color picker bar circle
                this.pickerBarCircle.x = currentX;
            }
        }

        const onMouseMove = (e) => {
            if (isMouseDown) {
                let currentX = e.clientX - this.target.offsetLeft;
                let currentY = e.clientY - this.target.offsetTop;
                if (currentY < this.height - this.gradientBar.height) {
                    this.pickerCircle.x = currentX;
                    this.pickerCircle.y = currentY;
                } else {
                    this.pickerCircle.x = currentX;
                }
            } else {
                if (isMouseDown2) {
                    let currentX = e.clientX - this.target.offsetLeft;
                    this.pickerBarCircle.x = currentX;
                    let colorData = this.getPickedBarColor();
                    this.gradientStartColor = `rgb(${colorData.r}, ${colorData.g}, ${colorData.b})`;
                }
            }
        }

        const onMouseUp = () => {
            isMouseDown = false;
            isMouseDown2 = false;
        }

        //Register 
        this.target.addEventListener("mousedown", onMouseDown);
        this.target.addEventListener("mousemove", onMouseMove);
        this.target.addEventListener("mousemove", () => this.onChangeCallback(this.getPickedColor()));


        document.addEventListener("mouseup", onMouseUp);
    }

    getPickedColor() {
        let imageData = this.context.getImageData(this.pickerCircle.x, this.pickerCircle.y, 1, 1);
        return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2] };
    }

    getPickedBarColor() {
        let imageData = this.context.getImageData(this.pickerBarCircle.x, this.pickerBarCircle.y, 1, 1);
        return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2] };
    }

    onChange(callback) {
        this.onChangeCallback = callback;
    }
}
