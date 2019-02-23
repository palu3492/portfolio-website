var canvas, ctx, onMobile, mobileW = 1300, w, h, particleNum, particles = [], minDist = 350, mx, my,
    mouseDown = !1, amplitude = h / 200, theta = 0.0, dx, mql = window.matchMedia('(orientation: portrait)');

function initCanvas() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    onMobile = !1;
    mobileW = 1300;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.height = h;
    canvas.width = w;
    firstSlide = document.getElementById('first-slide');
    firstSlide.addEventListener('mousemove', function (t) {
        mousePos = getMousePos(canvas, t)
    }, !1);
    firstSlide.onmousedown = function (t) {
        mouseDown = !1
    };
    firstSlide.onmouseup = function (t) {
        mouseDown = !0
    }
}

function particleAmount() {
    particleNum = (w / 35);
    if (particleNum < 10) particleNum = 10;
    particles = [];
    for (var t = 0; t < particleNum; t++) {
        particles.push(new Particle());
        particles[t].x = (t * (w / particleNum))
    }
}

function getMousePos(t, e) {
    var i = t.getBoundingClientRect();
    mx = e.clientX - i.left;
    my = e.clientY - i.top
}

function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
}

function Particle() {
    this.y = Math.random() * h;
    this.vy = (Math.random() * -1) / 3;
    this.radius = 1.5;
    this.draw = function () {
        var t = Math.abs(this.y - h / 2);
        ctx.fillStyle = 'rgba(47, 109, 181, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, !1);
        ctx.fill();
        ctx.closePath()
    }
}

function draw() {
    clearCanvas();
    if(window.innerHeight > 300 && window.innerWidth > 800) {
        for (var t = 0; t < particles.length; t++) {
            p = particles[t];
            p.draw()
        }
        update();
    }
}

function update() {
    theta += 0.0025;
    var i = theta;
    if (onMobile) {
        amplitude = w / 10
    }
    else {
        if (amplitude < 300) {
            amplitude = w / 10
        }
        else {
            amplitude = 300
        }
    }

    for (var t = 0; t < particles.length; t++) {
        p = particles[t];
        if (t % 2 == 0) p.y = (Math.sin(i) * amplitude) + h / 2; else p.y = (1 - Math.sin(i) * amplitude) + h / 2;
        i += dx;
        if (p.x + p.radius > w) {
            p.x = p.radius
        }
        else if (p.x - p.radius < 0) {
            p.x = w - p.radius
        }

        if (p.y + p.radius > h) {
            p.y = p.radius
        }
        else if (p.y - p.radius < 0) {
            p.y = h - p.radius
        }

        for (var e = t + 1; e < particles.length; e++) {
            var a = particles[e];
            distance(p, a)
        }

        if (mouseDown) {
            mouseRepel(p, mx, my)
        }
        else {
            mouseAttract(p, mx, my)
        }
    }
}

function distance(t, e) {
    var a, n = t.x - e.x, o = t.y - e.y;
    a = Math.sqrt(n * n + o * o);
    if (a <= minDist) {
        var i = (minDist - a) / a, i = i * 1, r = Math.floor(47 * i), s = Math.floor(109 * i), l = Math.floor(181 * i),
            d = 2 * i;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(' + r + ',' + s + ',' + l + ',' + d + ')';
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(e.x, e.y);
        ctx.stroke();
        ctx.closePath()
    }
}

function repositionParticles() {
    particleAmount();
    dx = ((Math.PI * 2) / particleNum);
    for (var t = 0; t < particles.length; t++) {
        particles[t].x = (t * (w / particleNum))
    }
    if (amplitude < 300) {
        amplitude = w / 10
    }
    else {
        amplitude = 300
    }
    dx = ((Math.PI * 2) / particleNum)
}

function mouseAttract(t, e, i) {
    var a, n = t.x - e, o = t.y - i, r = 12;
    a = Math.sqrt(n * n + o * o);
    if (amplitude > 150) amplitude -= 0.07 - (1 / (amplitude - 150));
    if (a <= minDist) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,' + (.75 - a / minDist) + ')';
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(e, i);
        ctx.stroke();
        ctx.closePath();
        if (t.radius < 5) {
            t.radius += 0.1
        }
    }
    else {
        t.radius -= 0.05 * 1.5;
        if (t.radius <= 1.5) {
            t.radius = 1.5
        }
    }
}

function mouseRepel(t, e, a) {
    var i, n = t.x - e, o = t.y - a;
    theta += 0.0003;
    i = Math.sqrt(n * n + o * o);
    var r = (minDist - i) / i;
    if (amplitude < 300) amplitude += 0.1; else if (amplitude >= 300) amplitude = 300;
    if (i <= minDist) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(243,139,0,' + r * .5 + ')';
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(e, a);
        ctx.stroke();
        ctx.closePath()
    }
}

function animLoop() {
    draw();
    requestAnimFrame(animLoop)
}

window.onresize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    w = window.innerWidth;
    h = window.innerHeight;
    clearCanvas();
    repositionParticles();
};


window.addEventListener('load', function () {
    initCanvas();
    repositionParticles();
    animLoop();
    mouseDown = !0;
});

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (t) {
        window.setTimeout(t, 1000 / 60)
    }
})();