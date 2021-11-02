
const drawSpace = $("#draw-space");
const linewidth = $("#linewidth");
const clearBtn = $("#clear");
const undoBtn = $("#undo");
const redoBtn = $("#redo");
const framesContainer = $("#frames");
const addFrameBtn = $("#add-frame");

// Stack
let undoHistory = [];

const lastPosition = new Two.Anchor(0, 0);
const two = new Two({
    width: drawSpace.width(),
    height: drawSpace.height()
});
const frames = [];
let curFrame = 0;
let line = null;

// console.log(drawSpace[0]);
frames.push(new Two.Group());

two.appendTo(drawSpace[0]); // Get's the DOM Element from the jquery object
two.add(frames[0]);

function startDraw(event) {

    // Set initial position
    lastPosition.set(event.clientX, event.clientY);

    // Add event listeners
    drawSpace.mouseup(endDraw);
    // drawSpace.mouseout(endDraw); // Doesn't work, triggers when going over another line for whatever reason.
    drawSpace.mousemove(draw);
}

function draw(event) {
    // Get the current position as a Two.Anchor
    const curPosition = new Two.Anchor(event.clientX, event.clientY);
    
    // If a line hasn't been created, start one. otherwise, add the new position to the line.
    if(!line) {
        line = two.makeCurve([lastPosition.clone(), curPosition.clone()], true); // Make sure to clone these so that the array has no shallow copies
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

        // Add this line to the current frame
        frames[curFrame].add(line);
        
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

function addFrame() {
    const frame = new Two.Group();
    frames.push(frame);
    curFrame = frames.length-1;
    console.log('Adding a frame');
    two.add(frame);
    // TODO - update display

    // Add new frame button to the page
    const newFrameBtn = $("<button>");
    newFrameBtn.addClass("frame-button");
    newFrameBtn.attr("data-frame-id", curFrame);
    // TODO - add delete frame button
    // TODO - add frame event listeners

    framesContainer.append(newFrameBtn);
}

drawSpace.on('mousedown', startDraw);

// Clear button
clearBtn.on('click', (event) => {
    const confirmed = confirm("Are you sure you want to clear your frame?");
    if(confirmed) {
        // Remove all children from the current group
        while(frames[curFrame].children.length > 0) {
            frames[curFrame].children.pop();
        }
        // Clear undo history
        undoHistory = [];
        two.update();
    }
});

// Undo button
undoBtn.on('click', (event) => {
    if(frames[curFrame].children.length > 0) {
        const undid = frames[curFrame].children.pop();
        console.log(undid);
        undoHistory.push(undid);
        two.update();
    }
});

// Redo button
redoBtn.on('click', (event) => {
    const redid = undoHistory.pop();
    if(redid) {
        frames[curFrame].children.push(redid);
        two.update();
    }
});

// Add frame button
addFrameBtn.on('click', addFrame);