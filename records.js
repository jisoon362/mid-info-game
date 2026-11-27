/* 시간 기록 게임의 신기록판 (공용)
   세계 신기록: 이번 학기 전체 기록을 닉네임별 최고 기록으로 줄 세운다 (반·시간대 구분 없음)
   기록은 config.js의 구글 시트(Apps Script)에 모인다. 수업 코드와는 따로 동작한다. */
(function(){
  "use strict";
  function url(){return window.SHEET_URL||""}
  function semName(code){
    var d=new Date(),y=d.getFullYear(),m=d.getMonth()+1,dd=d.getDate(),sem;
    if(code){var p=code.split("-");return p[0]+"년 "+p[1]+"학기"}
    if((m>3||(m===3&&dd>=1))&&(m<8||(m===8&&dd<=1)))sem=y+"년 1학기";else if(m>=8)sem=y+"년 2학기";else sem=(y-1)+"년 2학기";
    return sem;
  }
  function call(promise){
    return promise.then(function(r){return r.json()}).then(function(j){
      if(!j||!j.ok)throw new Error(j&&j.error||"fail");
      if(!j.rec)throw new Error("old-server");      // 서버가 아직 예전 버전
      return j;
    });
  }
  function submit(g,ev,nick,t,m){
    if(!url())return Promise.reject(new Error("no-url"));
    return call(fetch(url(),{method:"POST",redirect:"follow",body:JSON.stringify({game:"rec",g:g,ev:ev,nick:nick,t:Math.round(t),m:Math.round(m||0)})}));
  }
  function load(g,ev){
    if(!url())return Promise.reject(new Error("no-url"));
    return call(fetch(url()+"?view=rec&g="+g+"&ev="+encodeURIComponent(ev)+"&_="+Date.now(),{redirect:"follow"}));
  }
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  // 신기록판 두 칸을 그린다. fmt(t, m)는 기록을 글자로 바꾸는 함수
  function render(box,data,me,fmt){
    function list(title,rows,empty){
      var h='<section class="rkcol"><h3>'+title+'</h3>';
      if(!rows.length)return h+'<p class="rknone">'+empty+'</p></section>';
      h+='<ol class="rklist">';
      rows.slice(0,10).forEach(function(r,i){
        h+='<li class="'+(r.nick===me?"me":"")+'"><span class="rkn">'+(i===0?"🥇":i===1?"🥈":i===2?"🥉":(i+1)+"위")+'</span><span class="rkw">'+esc(r.nick)+'</span><b>'+esc(fmt(r.t,r.m))+'</b></li>';
      });
      return h+'</ol></section>';
    }
    box.innerHTML=list("🌏 세계 신기록 <small>("+semName(data.sem)+")</small>",data.world,"이번 학기 첫 기록에 도전해 보세요!");
  }
  function message(err){
    var m=String(err&&err.message||err);
    if(m==="old-server")return "신기록판을 쓰려면 선생님이 구글 서버를 최신 버전으로 배포해야 해요.";
    if(m==="nick")return "닉네임이 기록판에 쓸 수 없는 글자예요.";
    return "신기록판에 연결하지 못했어요.";
  }
  var css=document.createElement("style");
  css.textContent='.rkbox{display:grid;grid-template-columns:1fr;gap:12px;width:100%}'+
    '.rkcol{border:1px solid var(--line,#e2e5ea);border-radius:12px;padding:10px 12px;min-width:0}'+
    '.rkcol h3{margin:0 0 6px;font-size:15px;font-weight:800}.rkcol h3 small{font-size:12px;font-weight:600;color:var(--dim,#64748b)}'+
    '.rklist{list-style:none;margin:0;padding:0;font-size:14px;font-variant-numeric:tabular-nums}'+
    '.rklist li{display:grid;grid-template-columns:2.6em 1fr auto;gap:6px;align-items:center;padding:4px 0;border-bottom:1px solid var(--line,#e2e5ea)}'+
    '.rklist li:last-child{border-bottom:0}.rklist li.me{font-weight:800;color:var(--blue,#2563eb)}'+
    '.rkn{text-align:center}.rkw{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
    '.rknone{margin:0;font-size:13px;color:var(--dim,#64748b)}'+
    '.rkstat{font-size:12.5px;color:var(--dim,#64748b);text-align:center;width:100%;margin:2px 0 0}';
  document.head.appendChild(css);
  window.RECORDS={submit:submit,load:load,render:render,message:message,semName:semName};
})();
