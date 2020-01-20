let btnStart = document.querySelector("img.btn-start");
let cardsContainer = document.querySelector(".cards");
let partyIndexInterval, timerIndexInterval, sec, min, firstCard, secondCard;
let countGuessedPair = 0;
let enableChoice = true;

function clearContent(modal, modalBox) {
  modal.classList.remove("show");
  modalBox.classList.remove("show");
  [...cardsContainer.children].forEach(card => card.remove());
  countGuessedPair = 0;
  enableChoice = true;
  firstCard = null;
  secondCard = null;
  sec = null;
  min = null;
  btnStart.remove();
  const contentGame = document.querySelector(".content-game");
  [...contentGame.children].forEach(el => el.remove());
  contentGame.classList.add("hidden");
}
function playAgine(modal, modalBox) {
  clearContent(modal, modalBox);
  startPlay();
}

function restartGame(modal, modalBox) {
  clearContent(modal, modalBox);
  party();
  const dashboard = document.querySelector(".dashboard");
  btnStart = document.createElement("img");
  btnStart.src = "./images/btn-play.png";
  btnStart.classList.add("btn-start");
  btnStart.alt = "Play button";
  dashboard.appendChild(btnStart);
  btnStart.addEventListener("click", startPlay);
}

function finishGame() {
  clearInterval(timerIndexInterval);
  const modal = document.querySelector(".finish-modal");
  const modalBox = document.querySelector(".modal-container");
  const score = modal.querySelector(".score span");
  const time = modal.querySelector(".time span");
  score.innerText = countGuessedPair;
  time.innerText = `${min}:${sec}`;
  modal.classList.add("show");
  modalBox.classList.add("show");

  const closeBtn = document.querySelector(".btn-close");
  closeBtn.addEventListener("click", () => restartGame(modal, modalBox));
  const restartBtn = document.querySelector(".btn-restart");
  restartBtn.addEventListener("click", () => playAgine(modal, modalBox));
}

function updateResult() {
  ++countGuessedPair;
  const counter = document.querySelector(".result span");
  counter.innerText = countGuessedPair;
  if (countGuessedPair === 6) return true;
  else return false;
}

function guessed() {
  firstCard.removeEventListener("click", showCard);
  secondCard.removeEventListener("click", showCard);
  setTimeout(() => {
    const firstCardParent = firstCard.parentNode;
    const secondCardParent = secondCard.parentNode;
    firstCardParent.children[1].classList.add("guessed");
    secondCardParent.children[1].classList.add("guessed");
    const checkResult = updateResult();
    if (checkResult) finishGame();
    else restartCards();
  }, 500);
}

function restartCards() {
  cardsContainer.addEventListener("click", showCard);
  firstCard = null;
  secondCard = null;
  enableChoice = !enableChoice;
}

function checkPairCards(firstCard, secondCard) {
  const firstCardId = firstCard.dataset["cardId"];
  const secondCardId = secondCard.dataset["cardId"];
  return firstCardId === secondCardId;
}

function showCard(e) {
  if (
    !firstCard &&
    enableChoice &&
    e.target.parentNode.classList.contains("cardBox-inner") &&
    !e.target.classList.contains("guessed")
  ) {
    firstCard = e.target;
    firstCard.parentNode.classList.add("visible");
  } else if (
    firstCard &&
    e.target.parentNode.classList.contains("cardBox-inner") &&
    enableChoice &&
    !e.target.classList.contains("guessed")
  ) {
    enableChoice = !enableChoice;
    secondCard = e.target;
    secondCard.parentNode.classList.add("visible");
    cardsContainer.removeEventListener("click", showCard);
    const result = checkPairCards(firstCard.parentNode, secondCard.parentNode);

    if (result) guessed();
    else {
      setTimeout(() => {
        firstCard.parentNode.classList.remove("visible");
        secondCard.parentNode.classList.remove("visible");
        restartCards();
      }, 1000);
    }
  } else {
    return;
  }
}

function timer(contentGame) {
  const timeDisplay = document.createElement("div");
  timeDisplay.classList.add("timer");

  sec = 1;
  min = "00";

  timeDisplay.innerText = `00:01`;
  contentGame.appendChild(timeDisplay);

  timerIndexInterval = setInterval(() => {
    sec++;
    if (sec == 60) {
      min++;
      if (min < 10) min = "0" + min;
      sec = 0;
    }
    if (sec < 10) sec = "0" + sec;
    timeDisplay.innerText = `${min}:${sec}`;
  }, 1000);
}

function guessedPair(contentGame) {
  const result = document.createElement("div");
  result.classList.add("result");
  result.innerHTML = `<h1><span>${countGuessedPair}</span>/6</h1>`;
  contentGame.appendChild(result);
}

function generateDashboard() {
  const contentGame = document.querySelector(".content-game");
  contentGame.classList.remove("hidden");
  guessedPair(contentGame);
  timer(contentGame);
}

function countdown() {
  const dashboard = document.querySelector(".dashboard");
  let countNumber = 3;
  let counter;

  counter = document.createElement("div");
  counter.classList.add("countdown");
  counter.innerText = countNumber;
  dashboard.appendChild(counter);
  --countNumber;

  countdownIndexInterval = setInterval(() => {
    if (countNumber === 0) {
      counter.remove();
      clearInterval(countdownIndexInterval);
      generateDashboard();
    } else {
      let indexDiv = [...dashboard.children].indexOf(counter);
      if (indexDiv !== -1) counter.remove();

      counter = document.createElement("div");
      counter.classList.add("countdown");
      counter.innerText = countNumber;
      dashboard.appendChild(counter);
      --countNumber;
    }
  }, 1000);
}

function startPlay(e) {
  if (e) e.target.classList.add("slide-out");

  clearInterval(partyIndexInterval);
  [...cardsContainer.children].forEach(card => (card.style.display = "none"));

  setTimeout(() => {
    [...cardsContainer.children].forEach(card => card.remove());

    countdown();
    generateCards("visible");
    setTimeout(() => {
      [...cardsContainer.children].forEach(card =>
        card.children[0].classList.remove("visible")
      );
    }, 3000);
  }, 1000);

  cardsContainer.addEventListener("click", showCard);
}

function party() {
  generateCards();
  partyIndexInterval = setInterval(() => {
    let countCards = cardsContainer.childNodes.length;
    let random = Math.floor(Math.random() * countCards);

    cardsContainer.childNodes[random].children[0].classList.add("visible");
    setTimeout(() => {
      cardsContainer.childNodes[random].children[0].classList.remove("visible");
    }, 1000);
  }, 500);
}

function generateCards(info) {
  const numbersCards = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
  for (let i = 1; i <= 12; i++) {
    let indexCard = Math.floor(Math.random() * numbersCards.length);
    let number = numbersCards[indexCard];
    numbersCards.splice(indexCard, 1);

    const cardBox = document.createElement("div");
    cardBox.classList.add("cardBox");
    cardsContainer.appendChild(cardBox);

    const cardBoxInner = document.createElement("div");
    cardBoxInner.classList.add("cardBox-inner");
    if (info == "visible") cardBoxInner.classList.add("visible");
    cardBoxInner.dataset.cardId = number;
    cardBox.appendChild(cardBoxInner);

    const cardInvisible = document.createElement("div");
    cardInvisible.classList.add("card-invisible");
    cardBoxInner.appendChild(cardInvisible);

    const cardVisible = document.createElement("div");
    cardVisible.classList.add("card-visible");
    cardBoxInner.appendChild(cardVisible);

    const card = document.createElement("img");
    card.src = `./images/${number}.jpg`;
    cardVisible.appendChild(card);
  }
}

party();
btnStart.addEventListener("click", startPlay);
