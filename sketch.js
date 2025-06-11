let circles = [];  // an array to store all circle objects
let rippleCircles = []; // Store ripple effect objects triggered by user clicks


function setup() {
  // Create the canvas using the size of the window
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); // use radians for angle measurements
  background('#f4f1e3');   // Set the background to a light beige

  // Set center of the screen and circle size
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;
  let radius = 200; 
  let spacing = radius * 1.5; // distance between circle centers

  // Add one circle in the center
  circles.push(new PatternCircle(centerX, centerY, radius));

  // Add 6 outer circles around the center
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = centerX + cos(angle) * spacing;
    let y = centerY + sin(angle) * spacing;
    circles.push(new PatternCircle(x, y, radius));
  }
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
  for (let c of circles) {
    if (dist(mouseX, mouseY, c.x, c.y) < c.r * 0.5) {
      // Check if the mouse click is within the central area of a circle
      rippleCircles.push(new RippleCircle(c.x, c.y));  
      // If so, create a new ripple effect at that location
    }
  }
}

// [My change] This class defines the expanding ripple circle (ink ripple effect)
class RippleCircle {
  constructor(x, y) {
  // Set initial position (center of the ripple)
    this.x = x;
    this.y = y;
    this.radius = 0;       // Initial radius 
    this.maxRadius = 130;  // Maximum radius the ripple can reach
    this.alpha = 40;       // Transparency of the ripple circle
  }

  //[My change] Gradually increase the radius of the ripple
  update() {
    // If the current radius is less than the maximum allowed, increase the radius to create the expanding effect.
    if (this.radius < this.maxRadius) {
      this.radius += 2;     // increase radius by 2 units per frame
    }
  }

  // Display the expanding ripple circle
  draw() {
    fill(30, 30, 30, this.alpha);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);
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
      this.dotSizes.push(random(3, 6)); // choose size for each ring of dots
    }
  }

  // Slowly rotate the red dots
  update() {
    this.angleDots += 0.005;
  }

  // Draw everything in this circle
  draw() {
    push();
    translate(this.x, this.y); // move to the circle’s center

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

    // Draw two animated bezier curves.
    let rotateAngle = frameCount * 0.02;
    push();
    rotate(rotateAngle);

    stroke(255, 0, 100);
    strokeWeight(5);
    noFill();
    bezier(0, 0, this.r * 0.3, -this.r * 0.1, this.r * 0.5, this.r * 0.05, this.r * 0.65, this.r * 0.2);

    stroke(255, 60, 160);
    strokeWeight(3);
    bezier(0, 0, this.r * 0.3, -this.r * 0.1, this.r * 0.5, this.r * 0.05, this.r * 0.65, this.r * 0.2);

    pop(); // end bezier rotation
    pop(); // end main drawing
  }

  // Draw red dots in rings around the center
  drawOuterDots(x, y, r) {
    let maxRadius = r * 0.6;
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
