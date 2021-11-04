
const drawSpace = $("#draw-space");
const linewidth = $("#linewidth");
const clearBtn = $("#clear");
const undoBtn = $("#undo");
const redoBtn = $("#redo");
const framesContainer = $("#frames");
const addFrameBtn = $("#add-frame");
const playBtn = $("#play");
const stopBtn = $("#stop");
const FPS = $("#fps");
const saveBtn = $("#save");
const loadBtn = $("#load");
const loadData = $("#data");
let animation;


// Stack
let undoHistory = [];

const lastPosition = new Two.Anchor(0, 0);

// var two = new Two({
//     width: drawSpace.width(),
//     height: drawSpace.height()
// });
var frames = new LinkedList();
let curFrame = 0;
let line = null;

// console.log(drawSpace[0]);
addFrame();

// two.appendTo(drawSpace[0]); // Get's the DOM Element from the jquery object
// two.add(frames[0]);

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
    const frame = frames.getIndex(curFrame);
    // console.log(frame);
    if(!line) {
        
        line = frame.makeCurve([lastPosition.clone(), curPosition.clone()], true); // Make sure to clone these so that the array has no shallow copies
        line.noFill();
        line.stroke = '#000';
        line.linewidth = linewidth.val();
        line.translation.clear();
        // Adding an offset to account for a problem with drawing.
        line.translation.set(-10, -35);

        // For some reason two.js adds 2 vertices near 0,0 by default to the start of each curve. This removes those.
        line.vertices.shift();
        line.vertices.shift();

        // Sets the end of each line to be a half circle.
        line.cap = "round";
        console.log(line);
        // Add this line to the current frame
        frame.add(line);
        
        // Clear the undo history
        undoHistory = [];
    } else {
        line.vertices.push(curPosition);
    }
    lastPosition.set(curPosition.x, curPosition.y);
    frame.update();
}

function endDraw(event) {
    // Remove event listeners
    drawSpace.off('mouseup');
    // drawSpace.off('mouseout');
    drawSpace.off('mousemove');

    // set the line to null so a new line is created on the next click
    line = null;
}

function addFrame() {
    // Create the new frame and add it to the scene
    const frame = new Two({
        width: drawSpace.width(),
        height: drawSpace.height()
    });
    frame.appendTo(drawSpace[0]); // Get's the DOM Element from the jquery object
    frame.add(new Two.Group());
    curFrame = frames.size();
    frames.push(frame);
    console.log(frame);

    // update display
    presentFrame(frames.getIndex(curFrame));

    // Add new frame button to the page
    addButton(curFrame);

    // TODO - add delete frame button
    
}

function addButton(i) {
    const button = $("<button>");
    button.addClass("frame-button");
    button.attr("data-frame", i);
    framesContainer.append(button);

    // add frame event listeners
    button.on('click', (event) => {
        const id = parseInt(event.target.dataset.frame, 10);
        console.log(id);
        curFrame = id;
        presentFrame(frames.getIndex(id));
    });
}

function presentFrame(frame) {
    hideFrames();
    frame.appendTo(drawSpace[0]); // Get's the DOM Element from the jquery object
    frame.update();
}

function hideFrames(frame) {
    drawSpace.empty();
    
}

drawSpace.on('mousedown', startDraw);

// Clear button
clearBtn.on('click', (event) => {
    const confirmed = confirm("Are you sure you want to clear your frame?");
    if(confirmed) {
        const frame = frames.getIndex(curFrame)
        // Remove all children from the current group
        frame.clear();
        // Clear undo history
        undoHistory = [];
        frame.update();
    }
});

// Undo button
undoBtn.on('click', (event) => {
    const frame = frames.getIndex(curFrame);

    if(frame.scene.children.length > 1) {
        const undid = frame.scene.children.pop();
        // console.log(undid);
        undoHistory.push(undid);
        frame.update();
    }
});

// Redo button
redoBtn.on('click', (event) => {
    const frame = frames.getIndex(curFrame);
    const redid = undoHistory.pop();
    if(redid) {
        frame.scene.children.push(redid);
        frame.update();
    }
});

// Add frame button
addFrameBtn.on('click', addFrame);

// Add animation loop
function startAnimation() {
    console.log('starting animation...')
    if(!animation) {
        console.log('setting animation interval...');
        const framerate = Math.floor(1000.0 / FPS.val());
        animation = setInterval(() => {
            curFrame += 1;
            if(curFrame === frames.size()) curFrame = 0;
            presentFrame(frames.getIndex(curFrame));
        }, framerate);
    }
    
}

function stopAnimation() {
    clearInterval(animation);
    animation = null;
}

// Set play and stop button controls
playBtn.on('click', startAnimation);
stopBtn.on('click', stopAnimation);

// Save Animation
async function save() {
    // // Get the rendered SVG from the DOM
    // const svg = drawSpace.children().prop('outerHTML');
    // console.log(svg);
    // const response = await fetch('/api/animations/', {
    //     method: "POST",
    //     body: {
    //         animationData: svg
    //     }
    // });

    // if(response.ok) {
    //     // Should redirect to the post page
    //     document.location.replace('/');
    // } else {
    //     alert('an error occured!');
    // }
}

saveBtn.on('click', save);

async function load(animationData) {
    // two.interpret($(animationData)[0]);

    // // set frames and curFrame
    // frames = two.scene.children;
    // for(i=0; i<frames.length; i++) {
    //     frames[i].visible = false;
    // }

    // // Remove frameButtons and create new ones for new two
    // framesContainer.empty();
    // for(let i=0; i<frames.length; i++) {
    //     addButton(i);
    // }
    // two.update();
}

loadBtn.on('click', (event) => {
    load(loadData.val());
});