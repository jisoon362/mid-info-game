/* 정보랜드 지도: 대단원 다섯 개를 랜드마크로 세운 섬.
   window.drawLandMap(상자, 대단원 목록, 대단원별 게임 수, 눌렀을 때 함수) */
(function(){
  "use strict";
  var NS="http://www.w3.org/2000/svg";
  // 등각 투영: x는 오른쪽 아래, y는 왼쪽 아래, z는 위
  function P(cx,cy,x,y,z){return [cx+(x-y),cy+(x+y)/2-(z||0)]}
  function pts(a){return a.map(function(p){return p[0].toFixed(1)+","+p[1].toFixed(1)}).join(" ")}
  function poly(a,fill,extra){return '<polygon points="'+pts(a)+'" fill="'+fill+'"'+(extra||"")+'/>'}
  // 상자: 바닥 중심 (cx,cy), 반너비 a, 반깊이 b, 높이 h, z0 높이에서 시작
  function box(cx,cy,a,b,h,top,left,right,z0){
    z0=z0||0;var p=function(x,y,z){return P(cx,cy,x,y,z+z0)};
    return poly([p(-a,b,0),p(a,b,0),p(a,b,h),p(-a,b,h)],left)+
           poly([p(a,-b,0),p(a,b,0),p(a,b,h),p(a,-b,h)],right)+
           poly([p(-a,-b,h),p(a,-b,h),p(a,b,h),p(-a,b,h)],top);
  }
  function tree(x,y,s){
    s=s||1;
    return '<ellipse cx="'+x+'" cy="'+(y+2)+'" rx="'+(10*s)+'" ry="'+(4*s)+'" fill="#000" opacity=".08"/>'+
      '<rect x="'+(x-2*s)+'" y="'+(y-10*s)+'" width="'+(4*s)+'" height="'+(12*s)+'" fill="#7a5233"/>'+
      '<polygon points="'+x+','+(y-40*s)+' '+(x-12*s)+','+(y-8*s)+' '+(x+12*s)+','+(y-8*s)+'" fill="#2f8f6b"/>'+
      '<polygon points="'+x+','+(y-40*s)+' '+x+','+(y-8*s)+' '+(x+12*s)+','+(y-8*s)+'" fill="#25785a"/>';
  }
  function cloud(x,y,s,o){
    s=s||1;
    return '<g opacity="'+(o||1)+'"><ellipse cx="'+x+'" cy="'+y+'" rx="'+(34*s)+'" ry="'+(14*s)+'" fill="#ffffff"/>'+
      '<ellipse cx="'+(x-14*s)+'" cy="'+(y-8*s)+'" rx="'+(16*s)+'" ry="'+(12*s)+'" fill="#ffffff"/>'+
      '<ellipse cx="'+(x+10*s)+'" cy="'+(y-12*s)+'" rx="'+(18*s)+'" ry="'+(14*s)+'" fill="#ffffff"/>'+
      '<ellipse cx="'+x+'" cy="'+(y+5*s)+'" rx="'+(32*s)+'" ry="'+(7*s)+'" fill="#dfe7f7"/></g>';
  }
  function shadow(x,y,rx,ry){return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="#0b3b33" opacity=".12"/>'}

  /* ---------- 랜드마크 ---------- */
  // 1. 컴퓨팅 시스템: 컴퓨터 조립 공장 (본체, 모니터, 톱니바퀴)
  function lmComputer(x,y){
    var h=shadow(x,y+6,58,22);
    h+=box(x-10,y,30,26,40,"#c9d4e3","#93a4bd","#aebbd0");
    // 공장 지붕 톱니 모양
    h+=box(x-10,y,30,26,10,"#e2e8f2","#b6c3d6","#cbd5e3",40);
    // 굴뚝
    h+=box(x-28,y-8,5,5,26,"#9aa8bc","#6f7f97","#8291a8",50);
    h+='<ellipse cx="'+(x-26)+'" cy="'+(y-112)+'" rx="9" ry="6" fill="#ffffff" opacity=".8"/><ellipse cx="'+(x-16)+'" cy="'+(y-124)+'" rx="7" ry="5" fill="#ffffff" opacity=".6"/>';
    // 모니터
    h+=box(x+30,y+10,4,2,8,"#7b879a","#5d697c","#6d7a8e");
    h+=box(x+30,y+10,22,3,26,"#3b4658","#2d3646","#344052",8);
    var p=function(a,b,z){return P(x+30,y+10,a,b,z)};
    h+=poly([p(-19,3.2,11),p(19,3.2,11),p(19,3.2,31),p(-19,3.2,31)],"#38bdf8");
    h+='<polyline points="'+pts([p(-14,3.3,17),p(-6,3.3,23),p(2,3.3,19),p(12,3.3,27)])+'" fill="none" stroke="#fff" stroke-width="2"/>';
    // 톱니바퀴
    var gx=x-30,gy=y-58,t="";
    for(var i=0;i<8;i++){var a=i*Math.PI/4;t+='<rect x="'+(gx-3)+'" y="'+(gy-17)+'" width="6" height="8" fill="#f59e0b" transform="rotate('+(i*45)+' '+gx+' '+gy+')"/>'}
    h+='<g class="spin" style="transform-origin:'+gx+'px '+gy+'px">'+t+'<circle cx="'+gx+'" cy="'+gy+'" r="12" fill="#f59e0b"/><circle cx="'+gx+'" cy="'+gy+'" r="5" fill="#fff7e6"/></g>';
    return h;
  }
  // 2. 데이터: 시계탑과 막대그래프 빌딩
  function lmData(x,y){
    var h=shadow(x,y+6,60,22);
    h+=box(x+28,y+12,8,8,18,"#86efac","#4ade80","#22c55e");
    h+=box(x+44,y+2,8,8,30,"#93c5fd","#60a5fa","#3b82f6");
    h+=box(x+60,y-8,8,8,44,"#fde68a","#fbbf24","#f59e0b");
    h+=box(x-12,y,16,16,78,"#f5e6c8","#d9bf8f","#e8d3a8");
    var top=function(a,b){return P(x-12,y,a,b,78)};
    var apex=P(x-12,y,0,0,112);
    h+=poly([top(-18,18),top(18,18),apex],"#d6455b")+poly([top(18,-18),top(18,18),apex],"#b8364a");
    // 시계 (왼쪽 면)
    var c=P(x-12,y,0,16.2,56);
    h+='<ellipse cx="'+c[0]+'" cy="'+c[1]+'" rx="10" ry="11" fill="#fff" stroke="#7c5a2b" stroke-width="2.5"/>';
    h+='<line x1="'+c[0]+'" y1="'+c[1]+'" x2="'+c[0]+'" y2="'+(c[1]-7)+'" stroke="#1f2937" stroke-width="2" stroke-linecap="round"/><line class="hand" x1="'+c[0]+'" y1="'+c[1]+'" x2="'+(c[0]+6)+'" y2="'+(c[1]+2)+'" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round" style="transform-origin:'+c[0]+'px '+c[1]+'px"/>';
    // 창문
    var w=P(x-12,y,0,16.2,28);h+='<rect x="'+(w[0]-4)+'" y="'+(w[1]-8)+'" width="8" height="12" rx="4" fill="#7c5a2b"/>';
    return h;
  }
  // 3. 알고리즘과 프로그래밍: 레이싱 서킷
  function lmRace(x,y){
    var h=shadow(x,y+6,84,32);
    h+='<ellipse cx="'+x+'" cy="'+y+'" rx="80" ry="34" fill="#4b5563"/>';
    h+='<ellipse cx="'+x+'" cy="'+y+'" rx="66" ry="26" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="7 7"/>';
    h+='<ellipse cx="'+x+'" cy="'+y+'" rx="50" ry="18" fill="#7cc98a"/>';
    // 결승선
    for(var i=0;i<6;i++){for(var j=0;j<2;j++){h+='<rect x="'+(x-3+j*3)+'" y="'+(y+18+i*2.6)+'" width="3" height="2.6" fill="'+((i+j)%2?"#111":"#fff")+'"/>'}}
    // 자동차 두 대
    h+=box(x+52,y-8,9,5,6,"#ef4444","#b91c1c","#dc2626");
    h+=box(x+52,y-8,4,4,4,"#bfdbfe","#93c5fd","#60a5fa",6);
    h+=box(x-58,y+6,9,5,6,"#3b82f6","#1d4ed8","#2563eb");
    h+=box(x-58,y+6,4,4,4,"#bfdbfe","#93c5fd","#60a5fa",6);
    // 체크무늬 깃발
    var fx=x-6,fy=y-6;
    h+='<line x1="'+fx+'" y1="'+fy+'" x2="'+fx+'" y2="'+(fy-62)+'" stroke="#374151" stroke-width="3"/>';
    var f="";for(var r=0;r<3;r++)for(var c=0;c<4;c++)f+='<rect x="'+(fx+c*7)+'" y="'+(fy-62+r*7)+'" width="7" height="7" fill="'+((r+c)%2?"#111":"#fff")+'"/>';
    h+='<g class="flag" style="transform-origin:'+fx+'px '+(fy-55)+'px">'+f+'<rect x="'+fx+'" y="'+(fy-62)+'" width="28" height="21" fill="none" stroke="#374151" stroke-width="1"/></g>';
    return h;
  }
  // 4. 인공지능: 둥근 지붕 연구소와 안테나, 로봇 머리
  function lmAI(x,y){
    var h=shadow(x,y+6,58,22);
    h+=box(x,y,30,24,26,"#eef2ff","#c7d2fe","#dbe2fe");
    var c=P(x,y,0,0,26);
    h+='<path d="M'+(c[0]-34)+' '+c[1]+' A34 30 0 0 1 '+(c[0]+34)+' '+c[1]+' Z" fill="#a5b4fc"/><path d="M'+c[0]+' '+(c[1]-30)+' A34 30 0 0 1 '+(c[0]+34)+' '+c[1]+' L'+c[0]+' '+c[1]+' Z" fill="#818cf8"/>';
    h+='<line x1="'+c[0]+'" y1="'+(c[1]-30)+'" x2="'+c[0]+'" y2="'+(c[1]-56)+'" stroke="#475569" stroke-width="3"/><circle cx="'+c[0]+'" cy="'+(c[1]-58)+'" r="5" fill="#f43f5e"/>';
    h+='<g class="wave"><path d="M'+(c[0]+10)+' '+(c[1]-66)+' q8 8 0 16" fill="none" stroke="#f43f5e" stroke-width="2.4" stroke-linecap="round"/><path d="M'+(c[0]+17)+' '+(c[1]-72)+' q13 14 0 28" fill="none" stroke="#f43f5e" stroke-width="2.4" stroke-linecap="round" opacity=".6"/></g>';
    // 로봇 머리 (앞쪽)
    var r=P(x,y,-10,40,0);
    h+=shadow(r[0],r[1]+2,16,6);
    h+='<rect x="'+(r[0]-14)+'" y="'+(r[1]-26)+'" width="28" height="22" rx="7" fill="#e5e7eb" stroke="#64748b" stroke-width="2"/><circle cx="'+(r[0]-6)+'" cy="'+(r[1]-15)+'" r="3.4" fill="#0ea5e9"/><circle cx="'+(r[0]+6)+'" cy="'+(r[1]-15)+'" r="3.4" fill="#0ea5e9"/><rect x="'+(r[0]-6)+'" y="'+(r[1]-9)+'" width="12" height="2.6" rx="1.3" fill="#64748b"/><line x1="'+r[0]+'" y1="'+(r[1]-26)+'" x2="'+r[0]+'" y2="'+(r[1]-33)+'" stroke="#64748b" stroke-width="2"/><circle cx="'+r[0]+'" cy="'+(r[1]-35)+'" r="3" fill="#f59e0b"/>';
    return h;
  }
  // 5. 디지털 문화: 사이버 탐정 사무소 (집, 돋보기 간판, 자물쇠 방패)
  function lmCyber(x,y){
    var h=shadow(x,y+6,60,22);
    h+=box(x,y,28,22,34,"#fde7c7","#e5c08e","#f0d2a6");
    var p=function(a,b,z){return P(x,y,a,b,z)};
    var r1=p(-32,0,62),r2=p(32,0,62);
    h+=poly([p(-32,26,30),p(32,26,30),r2,r1],"#3f6fb5")+poly([p(32,-26,30),p(32,26,30),r2],"#2f5793");
    // 문과 창문
    var d=p(-8,22.2,0);h+='<polygon points="'+pts([p(-14,22.2,0),p(-4,22.2,0),p(-4,22.2,18),p(-14,22.2,18)])+'" fill="#7c4a22"/>';
    h+='<polygon points="'+pts([p(6,22.2,12),p(18,22.2,12),p(18,22.2,24),p(6,22.2,24)])+'" fill="#bae6fd" stroke="#7c4a22" stroke-width="1.5"/>';
    // 돋보기 간판
    var s=p(30,-6,46);
    h+='<line x1="'+(s[0]-6)+'" y1="'+(s[1]+10)+'" x2="'+(s[0]+18)+'" y2="'+(s[1]+10)+'" stroke="#475569" stroke-width="2.5"/>';
    h+='<g class="bob2"><circle cx="'+(s[0]+14)+'" cy="'+(s[1]+28)+'" r="10" fill="#dbeafe" stroke="#1f2937" stroke-width="3"/><line x1="'+(s[0]+21)+'" y1="'+(s[1]+35)+'" x2="'+(s[0]+29)+'" y2="'+(s[1]+43)+'" stroke="#1f2937" stroke-width="4" stroke-linecap="round"/><line x1="'+(s[0]+14)+'" y1="'+(s[1]+10)+'" x2="'+(s[0]+14)+'" y2="'+(s[1]+18)+'" stroke="#475569" stroke-width="1.5"/></g>';
    // 자물쇠 방패
    var k=p(-46,30,0);
    h+=shadow(k[0],k[1]+2,12,5);
    h+='<path d="M'+k[0]+' '+(k[1]-38)+' l15 6 v12 q0 14 -15 20 q-15 -6 -15 -20 v-12 z" fill="#22c55e" stroke="#15803d" stroke-width="2"/><rect x="'+(k[0]-6)+'" y="'+(k[1]-24)+'" width="12" height="9" rx="2" fill="#fff"/><path d="M'+(k[0]-4)+' '+(k[1]-24)+' v-3 a4 4 0 0 1 8 0 v3" fill="none" stroke="#fff" stroke-width="2"/>';
    return h;
  }
  var LANDMARKS=[
    {no:1,x:300,y:440,name:"조립 공장",draw:lmComputer},
    {no:2,x:272,y:268,name:"데이터 시계탑",draw:lmData},
    {no:3,x:500,y:178,name:"알고리즘 서킷",draw:lmRace},
    {no:4,x:728,y:268,name:"AI 연구소",draw:lmAI},
    {no:5,x:700,y:440,name:"사이버 탐정 사무소",draw:lmCyber}
  ];
  var START={x:500,y:528};

  function balloon(x,y,c1,c2,s){
    s=s||1;
    var g='<g class="bob">';
    g+='<path d="M'+(x-34*s)+' '+(y-40*s)+' Q'+(x-36*s)+' '+(y-92*s)+' '+x+' '+(y-94*s)+' Q'+(x+36*s)+' '+(y-92*s)+' '+(x+34*s)+' '+(y-40*s)+' Q'+(x+26*s)+' '+(y-14*s)+' '+(x+8*s)+' '+(y-4*s)+' L'+(x-8*s)+' '+(y-4*s)+' Q'+(x-26*s)+' '+(y-14*s)+' '+(x-34*s)+' '+(y-40*s)+' Z" fill="'+c1+'"/>';
    g+='<path d="M'+x+' '+(y-94*s)+' Q'+(x-14*s)+' '+(y-60*s)+' '+(x-6*s)+' '+(y-4*s)+' L'+(x+6*s)+' '+(y-4*s)+' Q'+(x+14*s)+' '+(y-60*s)+' '+x+' '+(y-94*s)+' Z" fill="'+c2+'"/>';
    g+='<path d="M'+(x-34*s)+' '+(y-40*s)+' Q'+(x-36*s)+' '+(y-92*s)+' '+x+' '+(y-94*s)+' Q'+(x-24*s)+' '+(y-70*s)+' '+(x-20*s)+' '+(y-10*s)+' Q'+(x-30*s)+' '+(y-22*s)+' '+(x-34*s)+' '+(y-40*s)+' Z" fill="'+c2+'"/>';
    g+='<path d="M'+(x+34*s)+' '+(y-40*s)+' Q'+(x+36*s)+' '+(y-92*s)+' '+x+' '+(y-94*s)+' Q'+(x+24*s)+' '+(y-70*s)+' '+(x+20*s)+' '+(y-10*s)+' Q'+(x+30*s)+' '+(y-22*s)+' '+(x+34*s)+' '+(y-40*s)+' Z" fill="'+c2+'"/>';
    g+='<line x1="'+(x-7*s)+'" y1="'+(y-4*s)+'" x2="'+(x-6*s)+'" y2="'+(y+8*s)+'" stroke="#4b3621" stroke-width="1.5"/><line x1="'+(x+7*s)+'" y1="'+(y-4*s)+'" x2="'+(x+6*s)+'" y2="'+(y+8*s)+'" stroke="#4b3621" stroke-width="1.5"/>';
    g+='<rect x="'+(x-8*s)+'" y="'+(y+8*s)+'" width="'+(16*s)+'" height="'+(12*s)+'" rx="2" fill="#6b4423"/>';
    return g+'</g>';
  }

  function label(L,title,count){
    var text=L.no+". "+title,x=L.x,y=L.y+44;
    var sub=count?"게임 "+count+"개":"준비 중",line2=L.name+" · "+sub;
    var w=Math.max(110,text.length*16+28,line2.length*11.5+28);
    return '<g class="tag'+(count?"":" soon")+'"><rect x="'+(x-w/2)+'" y="'+(y-16)+'" width="'+w+'" height="44" rx="14" class="tagbg"/>'+
      '<text x="'+x+'" y="'+(y+2)+'" class="t1">'+text+'</text><text x="'+x+'" y="'+(y+20)+'" class="t2">'+line2+'</text></g>';
  }

  window.drawLandMap=function(holder,areas,counts,onPick){
    var cx=500,cy=330,rx=440,ry=250,h=48;
    var V=[[cx,cy-ry],[cx+rx*.866,cy-ry/2],[cx+rx*.866,cy+ry/2],[cx,cy+ry],[cx-rx*.866,cy+ry/2],[cx-rx*.866,cy-ry/2]];
    var s='<svg viewBox="0 0 1000 700" xmlns="'+NS+'" role="group" aria-label="정보랜드 지도. 랜드마크를 누르면 그 단원의 게임이 나와요.">';
    s+='<defs><linearGradient id="lmTop" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#9ff0ea"/><stop offset=".55" stop-color="#c9f0dc"/><stop offset="1" stop-color="#f3efc4"/></linearGradient>'+
       '<linearGradient id="lmL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5aa9a6"/><stop offset="1" stop-color="#7fb7a6"/></linearGradient>'+
       '<linearGradient id="lmR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8db09a"/><stop offset="1" stop-color="#c2a476"/></linearGradient></defs>';
    // 하늘 장식
    s+=cloud(110,90,1,.95)+cloud(880,110,.8,.9)+cloud(940,560,.9,.85);
    // 섬 옆면 (두 겹)
    s+=poly([V[4],V[3],[V[3][0],V[3][1]+h],[V[4][0],V[4][1]+h]],"url(#lmL)")+poly([V[3],V[2],[V[2][0],V[2][1]+h],[V[3][0],V[3][1]+h]],"url(#lmR)");
    s+='<polyline points="'+pts([[V[4][0],V[4][1]+16],[V[3][0],V[3][1]+16],[V[2][0],V[2][1]+16]])+'" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="3"/>';
    // 섬 윗면
    s+=poly(V,"url(#lmTop)",' stroke="#ffffff" stroke-opacity=".6" stroke-width="3" stroke-linejoin="round"');
    // 강
    s+='<path d="M640 120 Q600 170 640 210 Q690 250 650 300 Q610 350 660 395" fill="none" stroke="#7dd3fc" stroke-width="14" stroke-linecap="round" opacity=".7"/>';
    // 길 (출발 → 1 → 2 → 3 → 4 → 5 → 출발)
    var route=[START].concat(LANDMARKS).concat([START]),d="M"+route[0].x+" "+route[0].y;
    for(var i=1;i<route.length;i++){var a=route[i-1],b=route[i],mx=(a.x+b.x)/2,my=(a.y+b.y)/2;var ox=(cy-my)*.12,oy=(mx-cx)*.12;d+=" Q"+(mx+ox)+" "+(my+oy)+" "+b.x+" "+b.y}
    s+='<path d="'+d+'" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 14"/>';
    // 나무와 구름
    s+=tree(180,350,1)+tree(205,372,.8)+tree(820,350,1)+tree(800,378,.75)+tree(410,520,.8)+tree(600,515,.85)+tree(395,250,.7)+tree(610,255,.7);
    s+=cloud(500,330,1.1,.95);
    // 출발 깃발
    s+=shadow(START.x,START.y+4,22,8)+'<ellipse cx="'+START.x+'" cy="'+START.y+'" rx="20" ry="9" fill="#fff"/><line x1="'+START.x+'" y1="'+START.y+'" x2="'+START.x+'" y2="'+(START.y-40)+'" stroke="#374151" stroke-width="3"/><polygon points="'+START.x+','+(START.y-40)+' '+(START.x+26)+','+(START.y-32)+' '+START.x+','+(START.y-24)+'" fill="#ef4444"/>';
    s+='<text x="'+(START.x)+'" y="'+(START.y+30)+'" class="start">출발!</text>';
    // 랜드마크 (뒤에 있는 것부터 그린다)
    LANDMARKS.slice().sort(function(a,b){return a.y-b.y}).forEach(function(L){
      var A=areas[L.no-1]||{title:""},n=counts[L.no]||0;
      s+='<g class="lm'+(n?"":" soon")+'" data-area="'+L.no+'" tabindex="0" role="button" aria-label="'+L.no+'. '+A.title+', '+L.name+', '+(n?"게임 "+n+"개":"준비 중")+'">';
      s+='<ellipse cx="'+L.x+'" cy="'+(L.y+4)+'" rx="92" ry="64" fill="transparent"/>';
      s+=L.draw(L.x,L.y)+label(L,A.title,n)+'</g>';
    });
    // 떠 있는 열기구와 종이비행기
    s+=balloon(165,235,"#fb923c","#fff7ed",.9)+balloon(845,205,"#f87171","#fff1f2",.75);
    s+='<g class="plane"><polygon points="120,520 176,500 140,532" fill="#e8dcc6"/><polygon points="140,532 176,500 146,540" fill="#c9b897"/></g>';
    s+='</svg>';
    holder.innerHTML=s;
    var gs=holder.querySelectorAll(".lm");
    for(var k=0;k<gs.length;k++){
      (function(g){
        var no=+g.getAttribute("data-area");
        g.addEventListener("click",function(){onPick(no)});
        g.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();onPick(no)}});
      })(gs[k]);
    }
  };
  window.LAND_NAMES={1:"조립 공장",2:"데이터 시계탑",3:"알고리즘 서킷",4:"AI 연구소",5:"사이버 탐정 사무소"};
})();
