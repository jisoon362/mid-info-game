/* 수업 코드 (모든 게임 공용)
   - 시간대마다, 게임마다 다른 두 자리 숫자
   - 시간대: 9:15~10:10 / 10:10~11:05 / 12:00~13:45 / 13:45~14:40 / 15:35~
   - 시간대 밖(아침, 11:05~12:00, 14:40~15:35)에는 코드 없이 열린다
   - 한 시간대에 한 번만 통과하면 되고, 시간대가 끝나면 통과가 풀린다 (예: 10:10~11:05에 통과하면 11:05까지)
   - 기기 시계가 조금 어긋나도 되도록, 바로 붙은 시간대 경계 앞뒤 5분은 옆 시간대 코드도 받는다
   - 선생님 비밀번호: 1218 */
(function(){
  "use strict";
  var SECRET="bfc536cdefd2262ab9bb49bb";
  var TPIN=4035313603775800;                  // "1218"
  var SLOTS=[[555,610],[610,665],[720,825],[825,880],[935,1440]];   // 분 단위
  var GRACE=5*60*1000;
  var ENABLED=false;   // 수업 코드 사용 여부. 다시 쓰려면 true로 바꾼다
  function cyrb(str){var h1=0xdeadbeef,h2=0x41c6ce57;for(var i=0;i<str.length;i++){var ch=str.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677)}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return 4294967296*(2097151&h2)+(h1>>>0)}
  function dayKey(d){return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}
  function at(d,min){var x=new Date(d);x.setHours(0,min,0,0);return x.getTime()}
  function hm(m){if(m>=1440)return "";var x=m%60;return Math.floor(m/60)+":"+(x<10?"0":"")+x}
  function slot(d){var m=d.getHours()*60+d.getMinutes();for(var i=0;i<SLOTS.length;i++)if(m>=SLOTS[i][0]&&m<SLOTS[i][1])return i;return -1}
  function code(d,s,g){return ("0"+cyrb(SECRET+"|"+dayKey(d)+"|s"+s+"|g"+g)%100).slice(-2)}
  function label(s){return SLOTS[s][1]>=1440?hm(SLOTS[s][0])+" 이후":hm(SLOTS[s][0])+" ~ "+hm(SLOTS[s][1])}
  // 코드가 필요한 때: 시간대 안에 있을 때만 (시간대 사이 빈 시간에는 코드 없이 열린다)
  function needed(d){return ENABLED&&slot(d||new Date())>=0}
  // 맞으면 그 시간대가 끝나는 시각(ms), 틀리면 0, 코드가 필요 없는 시간이면 -1
  // 한 시간대에 한 번만 통과하면 되고, 시간대가 끝나면 통과가 풀린다
  // 기기 시계가 조금 어긋난 경우를 위해, 경계 앞뒤 5분 안이면 바로 옆 시간대 코드도 받는다
  function check(input,g){
    var d=new Date(),s=slot(d),t=d.getTime();
    if(!ENABLED||s<0)return -1;
    var ok=code(d,s,g)===input;
    if(!ok&&s>0&&SLOTS[s-1][1]===SLOTS[s][0]&&t<at(d,SLOTS[s][0])+GRACE)ok=code(d,s-1,g)===input;
    if(!ok&&s<SLOTS.length-1&&SLOTS[s+1][0]===SLOTS[s][1]&&t>=at(d,SLOTS[s][1])-GRACE)ok=code(d,s+1,g)===input;
    return ok?at(d,SLOTS[s][1]):0;
  }
  function teacherOk(pin){return cyrb("T|"+SECRET+"|"+String(pin))===TPIN}

  /* ---------- 게이트가 없는 게임용: 화면을 덮는 수업 코드 입력창 ---------- */
  function mountGate(g){
    var KP="mig|pass|g"+g,KL="mig|lock|g"+g;
    function get(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}}
    function put(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
    var css=document.createElement("style");
    css.textContent='.ccgate{position:fixed;inset:0;z-index:50;background:var(--bg,#fff);color:var(--ink,#0f172a);overflow:auto;display:grid;place-items:center;padding:20px 16px}'+
      '.ccgate form{width:min(100%,380px);display:flex;flex-direction:column;gap:12px}'+
      '.ccgate h2{margin:0;font-size:24px;font-weight:800}.ccgate p{margin:0;color:var(--dim,#64748b);font-size:15px}'+
      '.ccgate input{font:inherit;padding:12px;border-radius:10px;border:2px solid var(--line,#e2e5ea);background:var(--bg,#fff);color:inherit;width:100%}'+
      '.ccgate .digits{font-size:40px;font-weight:800;letter-spacing:14px;text-align:center}'+
      '.ccgate .go{font:inherit;font-size:18px;font-weight:700;padding:12px;border-radius:10px;border:0;background:var(--ink,#0f172a);color:var(--bg,#fff);cursor:pointer}'+
      '.ccgate .err{min-height:22px;color:#dc2626;font-weight:700}'+
      '.ccgate .link{background:none;border:0;color:var(--dim,#64748b);text-decoration:underline;font:inherit;font-size:13px;cursor:pointer;align-self:center}'+
      '.ccgate .now{text-align:center;background:var(--cell,#f3f5f8);border-radius:10px;padding:12px;font-size:14px}'+
      '.ccgate .now b{display:block;font-size:48px;letter-spacing:10px;color:#2563eb;line-height:1.15}';
    document.head.appendChild(css);
    var box=document.createElement("div");box.className="ccgate";box.hidden=true;
    box.innerHTML='<form id="ccf"><h2>수업 코드를 넣어요</h2><p>선생님이 알려 준 숫자 2자리를 넣으면 시작할 수 있어요. 코드는 시간마다, 게임마다 달라요.</p>'+
      '<input id="ccin" class="digits" inputmode="numeric" maxlength="2" autocomplete="off" aria-label="수업 코드"><p class="err" id="ccerr" aria-live="polite"></p>'+
      '<button class="go" type="submit">시작하기</button><button class="link" type="button" id="cct">선생님 메뉴</button></form>'+
      '<form id="cctf" hidden><h2>선생님 메뉴</h2><input id="ccpin" type="password" inputmode="numeric" maxlength="8" autocomplete="off" aria-label="선생님 비밀번호" placeholder="선생님 비밀번호">'+
      '<p class="err" id="ccperr" aria-live="polite"></p><div class="now" id="ccnow" hidden></div><button class="go" type="submit">열기</button><button class="link" type="button" id="ccback">돌아가기</button></form>';
    document.body.appendChild(box);
    var $=function(id){return document.getElementById(id)};
    function main(){return document.querySelector("main")}
    function lockMsg(err){var l=get(KL,{n:0,until:0}),t=Date.now();if(t<l.until){err.textContent="여러 번 틀렸어요. "+Math.ceil((l.until-t)/1000)+"초 뒤에 다시 넣을 수 있어요.";return null}return l}
    function fail(l){l.n++;if(l.n%3===0)l.until=Date.now()+20000*Math.pow(2,Math.min(6,l.n/3-1));put(KL,l)}
    function refresh(){
      var need=needed()&&get(KP,0)<=Date.now();
      if(need&&box.hidden){$("ccin").value="";$("ccerr").textContent="";$("ccf").hidden=false;$("cctf").hidden=true}
      box.hidden=!need;var m=main();if(m)m.inert=need;
    }
    $("ccf").onsubmit=function(e){
      e.preventDefault();var err=$("ccerr"),l=lockMsg(err);if(!l)return;
      var r=check($("ccin").value.replace(/\D/g,""),g);
      if(r<0){refresh();return}
      if(!r){fail(l);err.textContent="맞지 않는 코드예요. 선생님이 알려 준 숫자를 다시 확인하세요.";return}
      put(KL,{n:0,until:0});put(KP,r);refresh();
    };
    $("cct").onclick=function(){$("ccf").hidden=true;$("cctf").hidden=false;$("ccnow").hidden=true;$("ccperr").textContent="";$("ccpin").focus()};
    $("ccback").onclick=function(){$("cctf").hidden=true;$("ccf").hidden=false};
    $("cctf").onsubmit=function(e){
      e.preventDefault();var err=$("ccperr"),l=lockMsg(err);if(!l)return;
      if(!teacherOk($("ccpin").value)){fail(l);err.textContent="비밀번호가 달라요.";return}
      put(KL,{n:0,until:0});$("ccpin").value="";err.textContent="";
      var d=new Date(),s=slot(d),nw=$("ccnow");nw.hidden=false;
      nw.innerHTML=s<0?"지금은 코드가 필요 없는 시간이에요":label(s)+" 수업 코드<b>"+code(d,s,g)+"</b>";
    };
    refresh();setInterval(refresh,5000);
  }

  window.CLASSCODE={enabled:ENABLED,SLOTS:SLOTS,slot:slot,code:code,label:label,hm:hm,needed:needed,check:check,teacherOk:teacherOk,TPIN:TPIN,mountGate:mountGate};
})();
