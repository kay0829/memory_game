export let memoryBtn = document.getElementsByClassName("btn");
let memoryBtnArr = Array.from(memoryBtn);
let playBtn = document.getElementById("playbtn");

// 한 단계의 순서를 담을 배열
let sequence = [];
// 각 단계
let stage = 1;

const resetAll = () => {
  sequence = [];
  stage = 1;
}

// 게임 처음 시작
playBtn.addEventListener('click', () => {
  resetAll();
  
  startSignal();
});

/**
 * ============================= 게임 신호
 */
const onSignal = ({ condition }) => {
  return new Promise((resolve) => {
    resolve(
      memoryBtnArr.forEach(v => {
        console.log("v", v);
        if (condition) {
          v.classList.add('signal');
        }
      })
    )
  })
}

const offSignal = () => {
  memoryBtnArr.forEach(v => {
    v.classList.remove('signal');
  })
}

const delay = (callback, duration) => {
  return new Promise((resolve) => {
    resolve(
      setTimeout(() => {
        console.log("callback");
        callback()
      }, duration)
    )
  });
}

const repeatSignal3Times = async ({ condition }) => {
  await onSignal({ condition });
  await delay(offSignal, 500);
  await onSignal({ condition });
  await delay(offSignal, 500);
  await onSignal({ condition });
  await delay(offSignal, 500);
}

/**
 * 게임 시작을 알리는 깜빡이는 신호
 * 게임 시작 시, 모든 버튼이 깜빡이며 신호를 줍니다.
 */
const startSignal = async () => {
  await repeatSignal3Times({ condition: true });
}

/**
 * 게임 성공을 알리는 깜빡이는 신호
 * 스테이지 통과 시, 가장 자리의 16개의 버튼이 ㅁ 모양으로 3번 깜빡이며 신호를 줍니다.
 */
const successSignal = () => {
  const condition = (Number.parseInt(v.id) >= 1 &&  Number.parseInt(v.id) <= 5)
  || (Number.parseInt(v.id) >= 21 &&  Number.parseInt(v.id) <= 25)
  || (Number.parseInt(v.id) % 5 === 1)
  || (Number.parseInt(v.id) % 5 === 0);
  

  repeatSignal3Times({ condition });
}

/**
 * 게임 실패을 알리는 깜빡이는 신호
 * 스테이지 실패 시, x 모양으로 3번 깜빡이며 신호를 줍니다.
 */
function failSignal() {
  const condition = (Number.parseInt(v.id) % 6 === 1)
  || (Number.parseInt(v.id) % 4 === 1)

  repeatSignal3Times({ condition });
}
