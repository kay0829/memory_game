let memoryBtn = document.getElementsByClassName("btn");
// 사실 getElementsByClassName을 써서 나온 결과는 배열이 아닌, 유사배열객체였습니다 짜잔ㅠ
const memoryBtnArr = Array.from(memoryBtn);
// 그래서 배열로써 만들어주는 메소드를 사용했던 겁니다 ㅠ
// 즉, memoryBtnArr 배열 안에는 클래스네임이 btn인 버튼 25개가 요소로 들어있다.

// const 키워드는 변수에 할당된 값이 불변적인 것을 의미하는 것이 아니라, 변수의 재할당을 방지하는 역할
// 랜덤한 버튼 태그 하나를 뽑아오는 변수 randomBtn을 호출하면 해당 버튼 태그 자체가 반환
// 기억력 테스트를 진행할 때, 랜덤한 버튼 하나를 띄워서 게임 과제의 일환으로 삼는다.

let playBtn = document.getElementById("playbtn");
let sequence = [];
let sequenceIndex = 0;
// 스테이지를 통과하든 실패하든, 무조건 배열은 비워져야 한다.
// 통과했으면, 다음 단계를 위해서 / 실패했으면, 1단계를 위해서
let stage = 1;

// 뭔가 느낌이...
// function game(){
//   startGame() // 플레이 버튼을 누르면 게임이 시작
//   playGame() // 게임 진행(통과, 실패)
//   Endgame() // 게임 종료(점수 책정)
// }
// 이런 식으로 코드가 짜여져야 할듯...?

function game() {
  stagePlay();
} // 어떻게 순차적으로 작동시켜야 될까. 또 다시 Promise를 사용해야 되나?

/* ------ 시작과 관련된 로직 ------ */
/* ---------------------------- */

function startGame() {
  console.log("시작합시다 :)");
  sequence = []; // 게임 시작한 순간, 배열을 전부 비운다.
  sequenceIndex = 0;
  startSignal();
}

playBtn.addEventListener("click", game);

// 비동기적으로 진행된 깜빡임을 순차적으로 깜빡이게 하려면 프로미스나 어싱크 어웨잇을 써야 된다
// 게임 시작 시의 버튼 깜빡임을 비동기적으로 수행
function allBlink() {
  return new Promise((resolve) => {
    console.log("빤짝");
    memoryBtnArr.map((el) => el.classList.add(`signal`));
    setTimeout(() => {
      memoryBtnArr.map((el) => el.classList.remove(`signal`));
      resolve(); // 깜빡임이 끝났을 때 resolve 호출(promise 객체 완료 역할 + await 대기 상태 해제)
    }, 500);
  });
}

// 3번 깜빡이게 하는 시작 신호
async function startSignal() {
  await new Promise((resolve) => setTimeout(resolve, 300)); // 누르고 0.2초 대기
  await allBlink();
  await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 대기
  await allBlink();
  await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 대기
  await allBlink();
}

/* ------ 게임 진행과 관련된 로직 ------ */
/* ------------------------------- */

// (Test)25개의 버튼 중, 랜덤으로 한 개의 버튼이 깜빡이게 하는 함수
// 흐름 다시 파악하며 공부하기!
function stageTest() {
  return new Promise((resolve) => {
    const randomIndex = Math.floor(Math.random() * memoryBtnArr.length);
    const randomBtn = memoryBtnArr[randomIndex];
    randomBtn.classList.add("signal");
    setTimeout(() => {
      randomBtn.classList.remove("signal");
      resolve(randomBtn); // 비동기 동작이 완료되면 resolve 호출하여 randomBtn 반환
    }, 500);
  });
}

function memoryBtnClick(event, randomBtn) {
  const clickBtn = event.target;

  // 클릭한 버튼의 정보와 추출한 랜덤 버튼의 정보 비교 및 일치 여부 확인
  if (clickBtn.id === randomBtn.id) {
    console.log("일치!"); // 버튼 정보 일치 시 처리
    successSignal();
  } else {
    console.log("불일치!"); // 버튼 정보 불일치 시 처리
    failSignal();
  }
}

async function stagePlay() {
  const randomBtn = await stageTest(); // stageTest의 반환 값을 받아옴
  for (let i = 0; i < memoryBtnArr.length; i++) {
    memoryBtnArr[i].addEventListener("click", (event) =>
      memoryBtnClick(event, randomBtn)
    );
  }
}

/* ------ 스테이지 통과와 관련된 로직 ------ */

// 스테이지 통과 시의 버튼 깜빡임을 비동기적으로 수행
function successBlink() {
  return new Promise((resolve) => {
    console.log("성공빤짝");
    memoryBtnArr.map((el) =>
      (Number(el.id) > 1 && Number(el.id) < 5) ||
      (Number(el.id) > 21 && Number(el.id) < 25) ||
      (Number(el.id) % 5 === 1 &&
        Number(el.id) !== 1 &&
        Number(el.id) !== 21) ||
      (Number(el.id) % 5 === 0 && Number(el.id) !== 5 && Number(el.id) !== 25)
        ? el.classList.add(`signal`)
        : el
    );
    setTimeout(() => {
      memoryBtnArr.map((el) => el.classList.remove(`signal`));
      resolve(); // 깜빡임이 끝났을 때 resolve 호출(promise 객체 완료 역할 + await 대기 상태 해제)
    }, 500);
  });
}

// 3번 깜빡이게 하는 스테이지 통과 신호
// 두 번 연속으로 play를 누르고 성공 시키니까 o 모양이 아닌 빤짝 신호가 발생(버그)
// => 원인 파악 : 이전 play 버튼에서 나온 랜덤 버튼이 그대로 남아있어서 x 모양과 o 모양이 같이 나오는 거였음. 즉, play버튼에 리셋 기능이 없음
async function successSignal() {
  await new Promise((resolve) => setTimeout(resolve, 300)); // 누르고 0.2초 대기
  await successBlink();
  await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 대기
  await successBlink();
  await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 대기
  await successBlink();
}

/* ------ 스테이지 실패와 관련된 로직 ------ */

// 스테이지 실패 시의 버튼 깜빡임을 비동기적으로 수행
function failBlink() {
  return new Promise((resolve) => {
    console.log("실패빤짝");
    memoryBtnArr.map((el) =>
      Number(el.id) % 6 === 1 || Number(el.id) % 4 === 1
        ? el.classList.add(`signal`)
        : el
    );
    setTimeout(() => {
      memoryBtnArr.map((el) => el.classList.remove(`signal`));
      resolve(); // 깜빡임이 끝났을 때 resolve 호출(promise 객체 완료 역할 + await 대기 상태 해제)
    }, 500);
  });
}

// 3번 깜빡이게 하는 스테이지 실패 신호
async function failSignal() {
  await new Promise((resolve) => setTimeout(resolve, 300)); // 누르고 0.2초 대기
  await failBlink();
  await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 대기
  await failBlink();
  await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 대기
  await failBlink();
}

// 1단계부터 5단계까지는 6초
// 5단계부터 10단계까지는 9초
// 10단계부터 15단계까지는 11초
// 15단계부터 끝까지 12초
