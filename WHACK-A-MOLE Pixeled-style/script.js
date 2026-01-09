const startBtn = document.getElementById("startBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const menu = document.getElementById("menu");
  const gameScreen = document.getElementById("gameScreen");
  const loseScreen = document.getElementById("loseScreen");
  const holes = document.querySelectorAll(".hole");
  const scoreDisplay = document.getElementById("score");
  const livesDisplay = document.getElementById("lives");
  const finalScoreDisplay = document.getElementById("finalScore");
  const difficultyBtns = document.querySelectorAll(".difficulty-btn");
  const hellPopup = document.getElementById("hellPopup");
  const confirmHellBtn = document.getElementById("confirmHell");
  const cancelHellBtn = document.getElementById("cancelHell");
  
  let score = 0;
  let lives = 5;
  let currentHole = null;
  let currentHole2 = null;
  let gameRunning = false;
  let gameInterval = null;
  let moleSpeed = 1000;
  let selectedDifficulty = "medium";
  let pendingHellBtn = null;

  difficultyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.difficulty === "hellmode") {
        pendingHellBtn = btn;
        hellPopup.style.display = "flex";
        return;
      }
      difficultyBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedDifficulty = btn.dataset.difficulty;
      moleSpeed = parseInt(btn.dataset.speed);
    });
  });

  confirmHellBtn.addEventListener("click", () => {
    if (pendingHellBtn) {
      difficultyBtns.forEach(b => b.classList.remove("selected"));
      pendingHellBtn.classList.add("selected");
      selectedDifficulty = pendingHellBtn.dataset.difficulty;
      moleSpeed = parseInt(pendingHellBtn.dataset.speed);
    }
    hellPopup.style.display = "none";
    pendingHellBtn = null;
  });

  cancelHellBtn.addEventListener("click", () => {
    hellPopup.style.display = "none";
    pendingHellBtn = null;
  });

  function showMole() {
    if (currentHole) {
      currentHole.classList.remove("active");
      currentHole.dataset.hit = "false";
    }
    if (currentHole2) {
      currentHole2.classList.remove("active");
      currentHole2.dataset.hit = "false";
    }

    const randomIndex = Math.floor(Math.random() * holes.length);
    currentHole = holes[randomIndex];
    currentHole.dataset.hit = "false";
    currentHole.classList.add("active");

    // For hellmode, spawn a second mole
    if (selectedDifficulty === "hellmode") {
      let randomIndex2 = Math.floor(Math.random() * holes.length);
      while (randomIndex2 === randomIndex) {
        randomIndex2 = Math.floor(Math.random() * holes.length);
      }
      currentHole2 = holes[randomIndex2];
      currentHole2.dataset.hit = "false";
      currentHole2.classList.add("active");
    }

    setTimeout(() => {
      if (currentHole && currentHole.classList.contains("active") && currentHole.dataset.hit === "false") {
        currentHole.classList.remove("active");
        if (gameRunning) {
          lives--;
          livesDisplay.textContent = lives;
          if (lives <= 0) {
            endGame();
          }
        }
      }
      if (currentHole2 && currentHole2.classList.contains("active") && currentHole2.dataset.hit === "false") {
        currentHole2.classList.remove("active");
        if (gameRunning) {
          lives--;
          livesDisplay.textContent = lives;
          if (lives <= 0) {
            endGame();
          }
        }
      }
    }, 800);
  }

  function startGame() {
    menu.style.display = "none";
    gameScreen.style.display = "flex";
    score = 0;
    lives = 5;
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    gameRunning = true;
    gameInterval = setInterval(showMole, moleSpeed);
  }

  function endGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    if (currentHole) currentHole.classList.remove("active");
    if (currentHole2) currentHole2.classList.remove("active");
    gameScreen.style.display = "none";
    loseScreen.style.display = "flex";
    finalScoreDisplay.textContent = score;
  }

  startBtn.addEventListener("click", startGame);
  
  playAgainBtn.addEventListener("click", () => {
    loseScreen.style.display = "none";
    menu.style.display = "flex";
    difficultyBtns.forEach(b => b.classList.remove("selected"));
  });

  holes.forEach(hole => {
    hole.addEventListener("click", (e) => {
      if (!gameRunning) return;
      
      // Show hammer animation on any click
      hole.classList.add("hammer-active");
      setTimeout(() => {
        hole.classList.remove("hammer-active");
      }, 400);
      
      // Check if clicking an active mole
      if (hole.classList.contains("active")) {
        score++;
        scoreDisplay.textContent = score;
        hole.dataset.hit = "true";
        
        // Add squish animation to mole
        const mole = hole.querySelector(".mole");
        if (mole) {
          mole.classList.add("squish");
          setTimeout(() => {
            mole.classList.remove("squish");
          }, 300);
        }
        
        // Keep mole visible for a moment before disappearing
        setTimeout(() => {
          hole.classList.remove("active");
        }, 600);
      }
      
      e.stopPropagation();
    });
  });

  // Show hammer on any click in the grid area
  gameScreen.addEventListener("click", (e) => {
    if (!gameRunning) return;
    // If click wasn't on a hole, still allow it but don't score
    if (e.target.tagName === "DIV" || e.target.tagName === "IMG") {
      // Click was handled by hole listener above
    }
  });