export function loadStickers(data) {
  data.proposals.forEach((proposal, index) => {
    const num = proposal.id === 'proposal-yes' ? 5 : index + 1;
    const container = document.getElementById('Sowrov' + num);
    lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: proposal.stickerUrl
    });
  });
}

export function showProposal(id) {
  document.querySelectorAll('.proposal-screen').forEach(screen => screen.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  if (id === 'proposal-yes') {
    document.body.style.backgroundColor = '#ffecf0';
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }
}

export function moveRandomEl(el) {
  el.style.position = "absolute";
  el.style.top = Math.floor(Math.random() * 90 + 5) + "%";
  el.style.left = Math.floor(Math.random() * 90 + 5) + "%";
}

let canvas, ctx;
let hearts = [];
const HEARTS_COUNT = 100; // Увеличили количество для непрерывности

export function startHeartsAnimation() {
    canvas = document.getElementById('heartsCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    initHearts();      
    animate();
    window.addEventListener('resize', resizeCanvas);
    // Поддержка как мыши, так и касаний
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function handleMouseMove(e) {
    addHeart(e.clientX, e.clientY);
}

function handleTouchMove(e) {
    e.preventDefault(); // Предотвращаем прокрутку страницы при движении пальца
    const touch = e.touches[0];
    addHeart(touch.clientX, touch.clientY);
}

function addHeart(x, y) {
    const heart = new Heart();
    heart.x = x;
    heart.y = y;
    heart.size = 10;
    heart.speed = 1;
    hearts.push(heart);
}

class Heart {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -50;
        this.size = Math.random() * 20 + 10;
        this.speed = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#ff6f61' : '#ff3b2f';
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(this.x - this.size / 2, this.y - this.size / 4, this.x - this.size, this.y + this.size / 2, this.x, this.y + this.size);
        ctx.bezierCurveTo(this.x + this.size, this.y + this.size / 2, this.x + this.size / 2, this.y - this.size / 4, this.x, this.y);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.y += this.speed;
        return this.y - this.size <= canvas.height;
    }
}

function initHearts() {
    hearts = [];
    for (let i = 0; i < HEARTS_COUNT; i++) {
        hearts.push(new Heart());
    }
}

function animate() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts = hearts.filter(heart => heart.update());
    while (hearts.length < HEARTS_COUNT) {
        hearts.push(new Heart());
    }
    hearts.forEach(heart => heart.draw());
    requestAnimationFrame(animate);
}