// efecto parallax ligero en hover
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.transform = `
      perspective(800px)
      rotateX(${-(y - rect.height/2)/20}deg)
      rotateY(${(x - rect.width/2)/20}deg)
      scale(1.03)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(-10px) scale(1.02)";
  });
});