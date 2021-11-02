
const drawSpace = $("#draw-space");
const linewidth = $("#linewidth");
const clearBtn = $("#clear");
const undoBtn = $("#undo");
const redoBtn = $("#redo");

// Stack
let undoHistory = [];

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
        // Adding an offset to account for a problem with drawing.
        line.translation.set(-10, -35);

        // For some reason two.js adds 2 vertices near 0,0 by default to the start of each curve. This removes those.
        line.vertices.shift();
        line.vertices.shift();

        // Sets the end of each line to be a half circle.
        line.cap = "round";
        
        // Clear the undo history
        undoHistory = [];
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

// Clear button
clearBtn.on('click', (event) => {
    const confirmed = confirm("Are you sure you want to clear your frame?");
    if(confirmed) {
        two.clear();
        two.update();
    }
});

// Undo button
undoBtn.on('click', (event) => {
    if(two.scene.children.length > 1) {
        const undid = two.scene.children.pop();
        console.log(undid);
        undoHistory.push(undid);
        two.update();
    }
});

// Redo button
redoBtn.on('click', (event) => {
    const redid = undoHistory.pop();
    if(redid) {
        two.scene.children.push(redid);
        two.update();
    }
});