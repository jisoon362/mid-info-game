/* 밝은 모드 / 어두운 모드. 모든 화면이 함께 쓰고, 고른 모드는 이 기기에 기억합니다. */
(function(){
  var KEY="mig|theme",t="light";
  try{t=localStorage.getItem(KEY)==="dark"?"dark":"light"}catch(e){}
  var root=document.documentElement;
  root.setAttribute("data-theme",t);
  function paint(){
    var bs=document.querySelectorAll("[data-theme-toggle]");
    for(var i=0;i<bs.length;i++){bs[i].textContent=t==="dark"?"밝게":"어둡게";bs[i].setAttribute("aria-label",t==="dark"?"밝은 모드로 바꾸기":"어두운 모드로 바꾸기")}
  }
  document.addEventListener("click",function(e){
    var b=e.target.closest?e.target.closest("[data-theme-toggle]"):null;if(!b)return;
    t=t==="dark"?"light":"dark";root.setAttribute("data-theme",t);
    try{localStorage.setItem(KEY,t)}catch(x){}
    paint();
  });
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",paint);else paint();
})();
