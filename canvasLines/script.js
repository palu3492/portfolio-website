
document.addEventListener("DOMContentLoaded", function(e) {

    const canvas = document.getElementById('c');
    const ctx = canvas.getContext("2d");
    let height,width,innerpoints = [], outerpoints = [],particles = [], colors = [];

    const noofpoints = 200, trashold = 10;
    let x, y, p, n, point,dx,dy,color;
    deltaangle = Math.PI * 2 / noofpoints;
    r = Math.min(height,width) * 0.5;

    const distance = (x1,y1,x2,y2) => {
        return Math.sqrt(Math.pow(y2 - y1,2) + Math.pow(x2 - x1,2) )
    };
    const mapVal = (num, in_min, in_max, out_min, out_max) => {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    };

    const resize = () => {

        // ctx.drawImage(img, 25, 25);
        // ctx.globalCompositeOperation = "source-out";


        height = ctx.canvas.clientHeight;
        width = ctx.canvas.clientWidth;

        if(ctx.canvas.clientWidth !== canvas.width ||
            ctx.canvas.clientHeight !== canvas.height
        ){
            console.log("resized");
            canvas.width = width;
            canvas.height = height;
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(-Math.PI);
            innerpoints = [];
            r = 10;
            for(let i = deltaangle; i <= Math.PI * 2 ; i += deltaangle){
                // x = r * 16 * Math.pow(Math.sin(i),3);
                // y = r * (13 * Math.cos(i) - 5 * Math.cos(2*i) - 2 *Math.cos(3*i) - Math.cos(4 * i));
                x = 0;
                y = 0;
                innerpoints.push({
                    x,
                    y
                });

                // x = 10 * r * 16 * Math.pow(Math.sin(i),3);
                // y = 10 * r * (13 * Math.cos(i) - 5 * Math.cos(2*i) - 2 *Math.cos(3*i) - Math.cos(4 * i));
                x = random(width,-width,true);
                y = random(height,-height,true);
                outerpoints.push({
                    x,
                    y
                });
                let step = random(0.001,0.003,true);
                particles.push({
                    step,
                    x,
                    y
                });
                colors.push(randomColor());
            }
        }
    };

    const img = new Image;
    img.onload = resize;
    img.src = "testImage.png";


    const random = (min,max, isFloat) => {
        if(isFloat) {
            return (Math.random() * (max - min) + min);
        }
        return ~~(Math.random() * (max - min) + min);
    };

    const randomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };


    // resize();

    //particles = [...outerpoints];
    ctx.globalAlpha = 0.5;
    ctx.globalCompositeOperation = 'source-over';
    const draw = ()=>{
        // ctx.fillStyle = "rgba(0,0,0,0.03)";
        // ctx.fillRect(-width,-height,width*2,height*2);
        // ctx.beginPath();

        for(let i = 0; i < innerpoints.length; i++){
            s = outerpoints[i];
            d = innerpoints[i];
            point = particles[i];

            if(distance(point.x, point.y,d.x,d.y) > 10) {
                dx = d.x - s.x;
                dy = d.y - s.y;

                point.x += dx * point.step;
                point.y += dy * point.step;
                color = distance(0,0,point.x,point.y);
                ctx.beginPath();
                ctx.fillStyle = colors[i];
                ctx.arc(point.x, point.y, 2, 0, Math.PI*2 ,false);
                ctx.closePath();
                ctx.fill();
            } else {
                point.x = d.x;
                point.y = d.y;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2, 0, Math.PI*2 ,false);
                ctx.closePath();
                ctx.fill();
                particles[i].x = s.x;
                particles[i].y = s.y;
                particles[i].step = random(0.001,0.003,true);
            }
        }

    };


    const render = () => {
        resize();
        draw();
        requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
});