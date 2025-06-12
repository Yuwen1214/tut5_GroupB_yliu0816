let circles = [];  // an array to store all circle objects
let rippleCircles = []; // Store ripple effect objects triggered by user clicks
let inkMode = '1D4C50'; // Set an initial default color
let randomChineseInkColor = null; // Store random color for key '0'


function setup() {
  // Create the canvas using the size of the window
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); // use radians for angle measurements
  background('#f4f1e3');   // Set the background to a light beige

}

function draw() {
  background('#f4f1e3'); // Changed background color to a soft beige tone to reflect traditional Chinese aesthetics
  // Loop through and render all ripple (ink spread) animations
  for (let r of rippleCircles) {
    r.update();            // update animations
    r.draw();              // draw each circle
  }
  for (let c of circles) {
    c.update(); // update animations
    c.draw();   // draw each circle
  }
}

// Loop through all umbrella circles
function mousePressed() {
  let radius = 200;
  let x = mouseX;
  let y = mouseY;

  circles.push(new PatternCircle(x, y, radius));
  rippleCircles.push(new RippleCircle(x, y));
}

// Trigger ink drops on latest ripple circle
function keyPressed() {
  if (key === '1') inkMode = '1D4C50';    
  else if (key === '2') inkMode = 'E68959'; 
  else if (key === '3') inkMode = 'CCD8D0'; 
  else if (key === '0') {
    inkMode = 'randomChinese';
    // Generate and store one random color on key '0'
    let chineseInkPalette = [
      color(36, 39, 30),      // #24271E
      color(211, 164, 136),   // #D3A488
      color(59, 78, 61),      // #3B4E3D
      color(175, 95, 84),     // #AF5F54
      color(151, 8, 4),       // #970804
      color(46, 47, 37),      // #2E2F25
      color(29, 76, 80),      // #1D4C50
    ];
    randomChineseInkColor = random(chineseInkPalette);
  }

  if (rippleCircles.length > 0) {
    let mode = inkMode;
    if (inkMode === 'randomChinese') {
      if (randomChineseInkColor) {
        mode = randomChineseInkColor;
      }
    }
    
    rippleCircles[rippleCircles.length - 1].addInkDrop(mode);
  }
}


// This class defines the expanding ripple circle (ink ripple effect)
class RippleCircle {
  constructor(x, y) {
  // Set initial position (center of the ripple)
    this.x = x;
    this.y = y;
    this.radius = 0;       // Initial radius 
    this.maxRadius = 130;  // Maximum radius the ripple can reach
    this.pg = createGraphics(windowWidth, windowHeight);  // Offscreen graphics layer for drawing ink effects
    this.pg.clear();       //Clear the offscreen layer to start transparent
    this.inkDrops = [];
  }

  // Gradually increase the radius of the ripple
  update() {
    // If the current radius is less than the maximum allowed, increase the radius to create the expanding effect.
    if (this.radius < this.maxRadius) {
      this.radius += 1.5;     // increase radius by 2 units per frame
    }
  }

  // Display the expanding ripple circle
  draw() {
    image(this.pg, 0, 0);     // Draw the offscreen ink layer onto the main canvas

    fill(5, 7, 5, 20);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);

    // Draw ink drops
    for (let drop of this.inkDrops) {
      let c = drop.color;
      c.setAlpha(drop.alpha); // source: https://p5js.org/reference/p5.Color/setAlpha/
      fill(c);                // Added color attribute
      noStroke();
      ellipse(this.x + drop.offsetX, this.y + drop.offsetY, drop.r * 2);
    }
    
  }

  addInkDrop(mode) {
    let colorToUse;

    // Define preset ink colors for key '1', '2', and '3'
    let palette = {
      '1D4C50': color(29, 76, 80, 2),
      'E68959': color(230, 137, 89, 10),
      'CCD8D0': color(204, 216, 208),
    };

    // If mode matches preset keys, pick from palette; otherwise use custom color
    if (mode === '1D4C50' || mode === 'E68959' || mode === 'CCD8D0') {
      colorToUse = palette[mode];
    } else {
      colorToUse = mode;
    }

    // Generate 7 ink drops with random offset and size
    for (let i = 0; i < 7; i++) {
      let angle = random(TWO_PI);
      let offsetRadius = random(this.radius * 0.6, this.radius * 0.73);
      let offsetX = cos(angle) * offsetRadius;
      let offsetY = sin(angle) * offsetRadius;
      let s = random(13, 15) * 2;
  
      // Each drop has 5 layers fading from center outward, creating ink wash effect
      for (let j = 0; j < 5; j++) {
        let a = map(j, 0, 4, 10, 1); 
        this.pg.fill(red(colorToUse), green(colorToUse), blue(colorToUse), a);
        this.pg.noStroke();
        this.pg.ellipse(this.x + offsetX, this.y + offsetY, s);
      }
      this.inkDrops.push({
        offsetX: offsetX,
        offsetY: offsetY,
        r: s / 2,          // Radius of the ink drop
        alpha: 40,
        color: colorToUse  // Ink color from preset palette or random
      });
    }
  }
}

// This class creates each circle design
class PatternCircle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.angleDots = random(TWO_PI); // start rotation from a random angle
    this.dotSizes = [];              
    this.generateColors();           // pick random colors
  }

  // Pick random colors for this circle
  generateColors() {
    this.strokeColor = color(random(0, 255), random(0, 100), random(10, 150));
    this.baseCircleColor = color(random(200, 255), random(200, 255), random(200, 255));
    this.bgColor = color(random(150, 255), random(150, 255), random(150, 255));
    this.lineColor = color(random(200, 255), random(200, 255), random(0, 100));
    this.outerDotColor = color(random(0, 255), random(0, 80), random(0, 255), 120);

    this.dotSizes = [];
    let maxRadius = this.r * 0.2; 
    for (let r = 9; r < maxRadius; r += 10) {
      this.dotSizes.push(random(3, 6));  // choose size for each ring of dots
    }
  }

  // Slowly rotate the red dots
  update() {
    this.angleDots += 0.005;
  }

  // Draw everything in this circle
  draw() {
    push();
    translate(this.x, this.y);   // move to the circle’s center

    // Draw white background circle
    fill(this.baseCircleColor);
    noStroke();
    circle(0, 0, this.r * 0.5);

    // Draw rotating red dots
    push();
    rotate(this.angleDots); 
    this.drawOuterDots(0, 0, this.r);
    pop();

    // Draw the pink background circle
    fill(this.bgColor);
    stroke(this.strokeColor);
    strokeWeight(5);
    circle(0, 0, this.r * 0.3);

    // Draw lines from center like spikes
    stroke(this.lineColor);
    let spikes = 20;
    let innerR = 10;
    let outerR = 30;
    for (let i = 0; i < spikes; i++) {
      strokeWeight(i % 2 === 0 ? 3 : 1.5); // thick and thin lines
      let angle1 = TWO_PI * i / spikes;
      let angle2 = TWO_PI * (i + 1) / spikes;
      let x1 = cos(angle1) * innerR;
      let y1 = sin(angle1) * innerR;
      let x2 = cos(angle2) * outerR;
      let y2 = sin(angle2) * outerR;
      line(x1, y1, x2, y2);
    }

    // Draw several small colored circles in the center
    noStroke();
    fill(255, 65, 70);
    circle(0, 0, this.r * 0.03);

    fill(100, 130, 100);
    circle(0, 0, this.r * 0.02);

    noFill();
    stroke(80, 255, 120, 60);
    strokeWeight(2.5);
    fill(180, 50, 80);
    circle(0, 0, this.r * 0.1);

    fill(30, 180, 60);
    circle(0, 0, this.r * 0.07);

    fill(255);
    circle(0, 0, this.r * 0.03);

    // Draw two black arcs for decoration
    stroke(30, 40, 50, 90);
    strokeWeight(2);
    noFill();
    arc(0, 0, 24, 23, PI * 1.05, PI * 1.85);
    arc(0, 0, 20, 25, PI * 0.45, PI * 0.75);

    // Draw animated bezier curves.
    let stamenCount = 17;  // Number of ribs to draw
    let rotateAngle = frameCount * 0.02;
    push();
    rotate(rotateAngle);

    stroke(0, 0, 0, 60);
    strokeWeight(2);
    noFill();
    for (let i = 0; i < stamenCount; i++) {
      let angle = TWO_PI * i / stamenCount; // Angle for each rib
      push();
      rotate(angle);

      // Bezier curve shaped like an umbrella rib
      bezier(0, 0, this.r * 0.09, -this.r * 0.1, this.r * 0.2, this.r * 0.05, this.r * 0.6, this.r * 0.2);
      pop(); // End rotation for current rib
    }
    pop(); // end bezier rotation
    pop(); // end main drawing
  }

  // Draw red dots in rings around the center
  drawOuterDots(x, y, r) {
    let maxRadius = r * 0.2;
    let ringIndex = 0;
    for (let i = 10; i < maxRadius; i += 12) {
      let numDots = floor(TWO_PI * i / 10); // how many dots on this ring
      let dotSize = this.dotSizes[ringIndex];
      for (let j = 0; j < numDots; j++) {
        let angle = TWO_PI * j / numDots;
        let dx = x + cos(angle) * i;
        let dy = y + sin(angle) * i;
        fill(this.outerDotColor);
        noStroke();
        ellipse(dx, dy, dotSize); // draw each dot
      }
      ringIndex++;
    }
  }
}

// Allow canvas to resize with browser window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background('#f4f1e3'); // Reset background after resizing
}
