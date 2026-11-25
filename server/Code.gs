/**
 * 중학교 정보 수업 게임 — 결과 모음 서버 (Google Apps Script)
 *
 * 설치: 구글 시트 > 확장 프로그램 > Apps Script 에 이 파일 내용을 통째로 붙여 넣고
 *       배포 > 새 배포 > 유형 "웹 앱" > 실행: 나 / 액세스 권한: 모든 사용자 > 배포
 *       나온 웹 앱 URL(.../exec)을 저장소의 config.js 에 넣습니다.
 *
 * 받는 것: 모둠 번호, 장르, 제시어, 맞혔는지, 핵심요소 글, 완성 그림(작게 줄인 이미지)
 * 이름·닉네임·기기 정보는 받지 않습니다.
 */

var SECRET = "bfc536cdefd2262ab9bb49bb";
var TPIN = 3498242298754679;            // 선생님 비밀번호의 해시 (게임 파일과 같음)
var PERIODS = [[555,610],[610,665],[665,720],[720,765],[825,880],[880,935],[935,990]];
var SHEET_NAME = "이어그리기";
var TZ = "Asia/Seoul";
var GENRES = ["동물", "음식", "직업", "중학교 과목"];
var HEAD = ["받은 시각", "날짜", "교시", "모둠", "장르", "제시어", "맞힘", "도전 횟수", "그린 시간(초)", "그린 인원", "핵심요소", "그림", "모둠 이름"];

function cyrb(str) {
  var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (var i = 0; i < str.length; i++) {
    var ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function nowInfo() {
  var d = new Date();
  var day = Utilities.formatDate(d, TZ, "yyyy-M-d");
  var min = Number(Utilities.formatDate(d, TZ, "H")) * 60 + Number(Utilities.formatDate(d, TZ, "m"));
  var p = -1;
  for (var i = 0; i < PERIODS.length; i++) {
    if (min >= PERIODS[i][0] && min < PERIODS[i][1]) { p = i; break; }
  }
  return { day: day, p: p, time: Utilities.formatDate(d, TZ, "HH:mm:ss") };
}

// 수업 코드는 날짜·교시·게임 번호마다 다르다. 이 서버는 2번 게임(이어 그리기)의 코드를 확인한다.
var GAME_NO = 2;
function codeFor(day, p) {
  return ("00" + (cyrb(SECRET + "|" + day + "|" + p + "|g" + GAME_NO) % 1000)).slice(-3);
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD]);
    sh.setFrozenRows(1);
  } else if (sh.getLastColumn() < HEAD.length) {
    sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD]);   // 예전 시트에 새 칸 제목을 더한다
  }
  return sh;
}

// 시트가 수식으로 해석하지 않도록 글자를 다듬는다
function clean(v, max) {
  var s = String(v == null ? "" : v).replace(/[\r\n\t]/g, " ").trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// 학생 태블릿이 결과를 보낼 때
function doPost(e) {
  var q;
  try { q = JSON.parse(e.postData.contents); } catch (err) { return out({ ok: false, error: "format" }); }
  var n = nowInfo();
  // 수업 시간에는 그 교시의 수업 코드가 맞아야 받고, 수업 시간이 아니면 코드 없이 받는다
  // 수업 코드 확인은 하지 않는다

  var group = Math.round(Number(q.group));
  if (!(group >= 1 && group <= 20)) return out({ ok: false, error: "group" });
  if (GENRES.indexOf(q.genre) < 0) return out({ ok: false, error: "genre" });
  var keys = (q.keys instanceof Array ? q.keys : []).slice(0, 5).map(function (k) { return clean(k, 20).replace(/\|/g, "/"); });
  var img = String(q.img || "");
  if (img.indexOf("data:image/jpeg;base64,") !== 0 || img.length > 45000) img = "";

  var row = [
    n.time, "d" + n.day, n.p + 1, group, q.genre, clean(q.word, 12),
    q.solved ? "O" : "X", Math.min(99, Math.max(0, Math.round(Number(q.tries)) || 0)),
    Math.min(60, Math.max(1, Math.round(Number(q.secs)) || 0)),
    Math.min(5, Math.max(1, Math.round(Number(q.n)) || 0)),
    keys.join(" | "), img, clean(q.gname, 10)
  ];
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = getSheet();
    sh.getRange(sh.getLastRow() + 1, 1, 1, row.length).setValues([row]);
  } finally {
    lock.releaseLock();
  }
  return out({ ok: true });
}

// 선생님 결과 보기 화면이 목록을 가져갈 때
function doGet(e) {
  var q = (e && e.parameter) || {};
  var n = nowInfo();
  // 선생님 비밀번호면 오늘 전체, 학생은 지금 시간대(이번 교시 또는 수업 외) 결과만 볼 수 있다
  var teacher = cyrb("T|" + SECRET + "|" + String(q.pin || "")) === TPIN;
  var student = !teacher && !q.pin;
  if (!teacher && !student) return out({ ok: false, error: q.code ? "code" : "pin" });
  var sh = getSheet();
  var last = sh.getLastRow();
  var since = Math.max(1, Math.round(Number(q.since)) || 1);   // 이 줄 번호 다음부터 돌려준다
  var rows = [];
  if (last > since) {
    var values = sh.getRange(since + 1, 1, last - since, HEAD.length).getDisplayValues();
    for (var i = 0; i < values.length; i++) {
      var r = values[i];
      if (r[1] !== "d" + n.day) continue;                      // 오늘 기록만
      if (student && Number(r[2]) !== n.p + 1) continue;       // 학생은 이번 교시만
      rows.push({
        row: since + 1 + i, time: r[0], period: Number(r[2]), group: Number(r[3]), genre: r[4], word: r[5],
        solved: r[6] === "O", tries: Number(r[7]), secs: Number(r[8]), n: Number(r[9]),
        keys: r[10] ? r[10].split(" | ") : [], img: r[11], gname: r[12] || ""
      });
    }
  }
  return out({ ok: true, last: last, period: n.p + 1, rows: rows });
}
