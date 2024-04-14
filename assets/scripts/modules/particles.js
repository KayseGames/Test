// create constructor function
class Particle {
    constructor( canvas, x, y, directionX, directionY, size, color, curveIntensity, fadeInDuration, fadeOutDuration, invisibleDuration, visibleDuration, fadeDurationMultiplier, opacity = 1) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = canvas.getContext('2d');
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.curveAngle = Math.random() * 2 * Math.PI; // random value between 0 and 2π
        this.CurveIntensity = curveIntensity / 5000; // constant value for the intensity of the curve
        this.curveDirection = Math.random() < 0.5 ? 1 : -1; // random value that is either 1 or -1
        this.size = size;
        this.startSize = size; // store the original size
        this.color = color;
        this.opacity = opacity;
        this.setRandomFadeDuration = (duration) => duration * (Math.random() / 2 + fadeDurationMultiplier) * 60; 
        this.fadeDuration = {
            fadingIn: this.setRandomFadeDuration(fadeInDuration),
            fadingOut: this.setRandomFadeDuration(fadeOutDuration),
            invisible: this.setRandomFadeDuration(invisibleDuration),
            visible: this.setRandomFadeDuration(visibleDuration),
        };
        const totalDuration = this.fadeDuration.visible + this.fadeDuration.fadingOut + this.fadeDuration.invisible + this.fadeDuration.fadingIn;
        this.fadeTimer = Math.random() * totalDuration;

        // Set fadeState to match fadeTimer
        let remainingTime = this.fadeTimer;
        for (const state of ['visible', 'fadingOut', 'invisible', 'fadingIn']) {
            if (remainingTime < this.fadeDuration[state]) {
            this.fadeState = state;
            if (state === 'fadingOut') {
                this.size = this.startSize * (1 - remainingTime / this.fadeDuration[state]);
            } else if (state === 'fadingIn') {
                this.size = this.startSize * (remainingTime / this.fadeDuration[state]);
            } else if (state === 'invisible') {
                this.size = 0;
            } else {
                this.size = this.startSize;
            }
            break;
            }
            remainingTime -= this.fadeDuration[state];
        }
    }
    // add draw method to particle prototype
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);

        // Create radial gradient
        let gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`); // max opacity white in the center
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`); // full transparency on the edge

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
    // add update method to particle prototype
    update() {
        // Check if the particle is still within the canvas boundaries and bounce it back if it hits the edge
        if (this.x + this.size > this.canvas.width || this.x - this.size < 0 || this.y + this.size > this.canvas.height || this.y - this.size < 0) {
            this.directionX = -this.directionX;
            this.directionY = -this.directionY;
        }
        // Update the curve angle of the particle 
        this.curveAngle += this.CurveIntensity * this.curveDirection;
        // Update the direction of the particle based on the curve angle 
        this.directionX = Math.cos(this.curveAngle);
        this.directionY = Math.sin(this.curveAngle);
        // Move the particle
        this.x += this.directionX;
        this.y += this.directionY;

        // Update the fade cycle
        this.fadeTimer++;
        if (this.fadeState === 'visible') {
            if (this.fadeTimer >= this.fadeDuration.visible) {
                this.fadeState = 'fadingOut';
                this.fadeTimer = 0;
            }
        } else if (this.fadeState === 'fadingOut') {
            this.opacity -= 1 / this.fadeDuration.fadingOut;
            this.size -= this.startSize / this.fadeDuration.fadingOut; // shrink the particle
            if (this.fadeTimer >= this.fadeDuration.fadingOut) {
                this.opacity = 0;
                this.size = 0; // set the size to 0
                this.fadeState = 'invisible';
                this.fadeTimer = 0;
            }
        } else if (this.fadeState === 'invisible') {
            if (this.fadeTimer >= this.fadeDuration.invisible) {
                this.fadeState = 'fadingIn';
                this.fadeTimer = 0;
            }
        } else if (this.fadeState === 'fadingIn') {
                this.opacity += 1 / this.fadeDuration.fadingIn;
                this.size += this.startSize / this.fadeDuration.fadingIn; // grow the particle
            if (this.fadeTimer >= this.fadeDuration.fadingIn) {
                this.opacity = 1;
                this.size = this.startSize; // set the size to the original size
                this.fadeState = 'visible';
                this.fadeTimer = 0;
            }
        }


        this.draw();
    }
}

export class Particles {
    constructor( canvas, settings) {
        this.particleArray = [];
        this.Settings = settings;
        this.Canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.Count = settings.Count.value;
        this.Size = settings.Size.value;
        this.SizeMultiplier = settings.SizeMultiplier.value;
        this.SpeedX = settings.SpeedX.value;
        this.SpeedY = settings.SpeedY.value;
        this.Color = settings.Color;

        
        this.animationFrameId = null;
        this.animate = () => {
            // Stop the animation if the window is not in focus
            this.animationFrameId && cancelAnimationFrame(this.animationFrameId);
            // Restart the animation if the window is in focus
            this.animationFrameId = requestAnimationFrame(this.animate);
            // Clear the canvas & update the particles
            this.ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (let particle of this.particleArray) {
                particle.update();
            }
        };
        this.init = function () {
            this.particleArray = [];
            for (let i = 0; i < this.Count; i++) {
                this.ctx.canvas.width = window.innerWidth;
                this.ctx.canvas.height = window.innerHeight;
                let size = Math.max(
                    (Math.random() * (this.Size / 100) * innerWidth * 0.01),
                    (this.Size / 100) * this.SizeMultiplier * innerWidth * 0.01
                );
                let x = Math.random() * (innerWidth - size * 2);
                let y = Math.random() * (innerHeight - size * 2);
                let directionX = Math.random() * this.SpeedX - this.SpeedX / 2;
                let directionY = Math.random() * this.SpeedY - this.speedY / 2;

                this.particleArray.push(new Particle( this.Canvas, x, y, directionX, directionY, size, settings.Color, settings.CurveIntensity.value, settings.FadeInDuration.value, settings.FadeOutDuration.value, settings.InvisibleDuration.value, settings.VisibleDuration.value, settings.FadeDurationMultiplier.value));
            }
            this.animate();
        };
    }
    resize() {
        this.Canvas.width = window.innerWidth;
        this.Canvas.height = window.innerHeight;
        this.init();
    };
    updateSettings (settings) {
        // Update the particle array with the new settings and reset the animation
        this.Count = settings.Count.value;
        this.Size = settings.Size.value;
        this.SizeMultiplier = settings.SizeMultiplier.value;
        this.SpeedX = settings.SpeedX.value;
        this.SpeedY = settings.SpeedY.value;
        this.Settings = settings;
        this.Color = settings.Color;

        this.init();
    };
}

