
const drawSpace = $("#draw-space");
const linewidth = $("#linewidth");
const clearBtn = $("#clear");
const lastPosition = new Two.Anchor(0, 0);
const two = new Two({
    width: drawSpace.width(),
    height: drawSpace.height()
});
const frames = [];
const curFrame = 0;
let line = null;

// console.log(drawSpace[0]);
frames.push(new Two.Group());

two.appendTo(drawSpace[0]); // Get's the DOM Element from the jquery object
two.add(frames[0]);

function startDraw(event) {
    // Starts drawing a line 
    console.log('starting draw');
    // Set initial positio
    // console.log(lastPosition);
    lastPosition.set(event.clientX, event.clientY);

    // Add event listeners
    drawSpace.mouseup(endDraw);
    // drawSpace.mouseout(endDraw);
    drawSpace.mousemove(draw);
}

function draw(event) {
    // Draws the line to the page
    // TODO
    // console.log('drawing...');
    // console.log(event.clientX, event.clientY);

    const curPosition = new Two.Anchor(event.clientX, event.clientY);
    // console.log(lastPosition, curPosition);
    
    

    if(!line) {
        console.log('starting new line');
        line = two.makeCurve([lastPosition.clone(), curPosition.clone()], true);
        line.noFill();
        line.stroke = '#333';
        line.linewidth = linewidth.val();
        line.translation.clear();
        line.translation.set(-10, -35);
        line.vertices.shift();
        line.vertices.shift();
        line.cap = "round";
        // line.vertices.shift();
        // two.add(line);
    } else {
        line.vertices.push(curPosition);
    }
    lastPosition.set(curPosition.x, curPosition.y);
    two.update();
}

function endDraw(event) {
    console.log('ending draw');
    // Remove event listeners
    drawSpace.unbind('mouseup');
    drawSpace.unbind('mouseout');
    drawSpace.unbind('mousemove');

    // Add the line to the page
    console.log(line);
    line = null;
}

drawSpace.on('mousedown', startDraw);
