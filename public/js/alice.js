// import the  Scene Graph library
import * as sg from './spaces.js';
//scene and camera
var scene = new sg.Scene(document.getElementById("scene"));
var camera = new sg.Camera(50);
camera.position = new sg.Vector(-100, 300, 1500);
var cameraR = 0;
camera.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(50, cameraR, -100));
scene.world.add(camera);
// frame 
var frame = document.createElement("div");
frame.className = "panel image";
frame.style.backgroundImage = "url('./img/frame.png')";
var frameDiv = new sg.HTMLDivThing(frame);
frameDiv.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0, 45, 0));
frameDiv.position = new sg.Vector(-70.7, -150, -100);
frameDiv.scale = new sg.Vector(1.5, 1.5, 1.5);
scene.world.add(frameDiv);
// 2 walls
var w1 = document.createElement("div");
w1.className = "panel image";
w1.style.backgroundImage = "url('./img/frame.png')";
var wd1 = new sg.HTMLDivThing(w1);
wd1.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0, -90, 0));
wd1.position = new sg.Vector(190, -10, -10);
wd1.scale = new sg.Vector(2, 2, 2);
frameDiv.add(wd1);
var w2 = document.createElement("div");
w2.className = "panel image";
w2.style.backgroundImage = "url('./img/frame.png ')";
var wd2 = new sg.HTMLDivThing(w2);
wd2.scale = new sg.Vector(2, 2, 2);
wd2.position = new sg.Vector(0, -10, -190);
frameDiv.add(wd2);
// clock
var clock = document.createElement("div");
clock.className = "panel image";
clock.style.backgroundImage = "url('./img/clock.png')";
var clockDiv = new sg.HTMLDivThing(clock);
clockDiv.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(30, -90, 60));
clockDiv.scale = new sg.Vector(0.4, 0.4, 0.4);
clockDiv.position = new sg.Vector(0, 0, 0);
frameDiv.add(clockDiv);
//clock 2
var clock2 = document.createElement("div");
clock2.className = "panel image";
clock2.style.backgroundImage = "url('./img/clock.png')";
var clockDiv2 = new sg.HTMLDivThing(clock2);
clockDiv2.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(30, -90, 60));
clockDiv2.scale = new sg.Vector(0.4, 0.4, 0.4);
clockDiv2.position = new sg.Vector(0, 0, 0);
frameDiv.add(clockDiv2);
// ground
var c1 = document.createElement("div");
c1.className = "panel image";
c1.style.backgroundImage = "url('./img/poker.png')";
var cd1 = new sg.HTMLDivThing(c1);
cd1.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(-90, 0, 0));
cd1.position = new sg.Vector(0, -200, 0);
cd1.scale = new sg.Vector(2, 2, 2);
frameDiv.add(cd1);
//alice
var p = document.createElement("div");
p.className = "panel image";
p.style.backgroundImage = "url('./img/alice.png')";
var pDiv = new sg.HTMLDivThing(p);
pDiv.position = new sg.Vector(0, 30, -80);
pDiv.scale = new sg.Vector(1.2, 1.2, 1.2);
frameDiv.add(pDiv);
// *** render hw 
let hwstartTime = performance.now();
var count = 0;
var camRInc = 0.1;
var renderAssignment = function (t) {
    let dt = (t - hwstartTime) / 1000.0;
    // change focal length
    if (count >= 0 && count < 500) {
        camera.fovy -= 0.025;
        count++;
    }
    else if (count >= 500 && count < 700) {
        count++;
    }
    else if (count >= 700 && count < 1200) {
        camera.fovy += 0.025;
        count++;
        var c = count / 500;
        var o = 1 / c;
    }
    else {
        count = 0;
    }
    cameraR += camRInc;
    if (cameraR > 12 || cameraR < -12) {
        camRInc *= -1;
    }
    camera.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(-13, cameraR, 0));
    /*
    let rotationTime = (dt % 3) / 3
    let yRotation = 360 * rotationTime
    faceDiv.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0,yRotation,0));
    frameDiv.rotation=sg.Matrix.makeRotationFromEuler(new sg.Vector(0,yRotation,30));
    pDiv.rotation=sg.Matrix.makeRotationFromEuler(new sg.Vector(0,-yRotation,0));
    faceDiv2.rotation=sg.Matrix.makeRotationFromEuler(new sg.Vector(0,-yRotation,0));
    eDiv.rotation=sg.Matrix.makeRotationFromEuler(new sg.Vector(0,0,yRotation));
    */
    scene.render();
    requestAnimationFrame(renderAssignment);
};
renderAssignment(hwstartTime);
//# sourceMappingURL=alice.js.map