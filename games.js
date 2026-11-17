/* 단원 위계 (2022 개정 중학교 정보) */
window.CURRICULUM = [
  { grade: "2학년", areas: [
    { no: 1, title: "컴퓨팅 시스템", units: ["컴퓨팅 시스템의 구성과 동작", "피지컬 컴퓨팅 시스템"] },
    { no: 2, title: "데이터", units: ["데이터의 표현과 관리", "데이터의 구조화와 해석"] },
    { no: 3, title: "알고리즘과 프로그래밍", units: ["알고리즘", "프로그래밍"] },
    { no: 4, title: "인공지능", units: ["인공지능의 이해", "인공지능의 활용"] },
    { no: 5, title: "디지털 문화", units: ["디지털 사회와 직업", "디지털 윤리"] }
  ] }
];

/* 게임 목록. 새 게임을 추가할 때 아래에 한 줄씩 더합니다.
   no: 번호, folder: games/ 아래 폴더 이름, title: 이름, desc: 한 줄 설명,
   grade: 학년, area: 대단원 번호, unit: 소단원 번호 (위 단원 위계에서의 위치) */
window.GAMES = [
  { no: 1, folder: "01-card-move", title: "카드 옮기기", grade: "2학년", area: 2, unit: 1, desc: "파란 카드를 눌러서 빨간 카드를 제일 구석으로 옮기기 · 개인전과 릴레이" },
  { no: 2, folder: "02-relay-draw", title: "이어 그리기", grade: "2학년", area: 2, unit: 1, desc: "3초씩 이어 그리고 맞히기 · 핵심요소 적기 · 모둠 활동" },
  { no: 3, folder: "03-build-computer", title: "컴퓨팅 시스템 조립하기", grade: "2학년", area: 1, unit: 1, desc: "퀴즈로 돈을 벌어 하드웨어와 소프트웨어를 사서 컴퓨터 완성하기" }
];
