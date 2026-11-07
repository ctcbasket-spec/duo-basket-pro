const $=s=>document.querySelector(s);
const goals=["Réussir 10 passes sans erreur","Marquer 5 paniers chacun","Réussir 5 double-pas main droite","Réussir 5 double-pas main gauche","Faire 3 minutes de dribbles contrôlés","Réussir 5 tirs après une passe","Réussir 5 défenses propres","Terminer le défi final ensemble"];
let state={s1:0,s2:0,n1:"Joueur 1",n2:"Joueur 2",done:[],seconds:3600};
try{state={...state,...JSON.parse(localStorage.getItem("duoBasketPro")||"{}")}}catch(e){}
function save(){localStorage.setItem("duoBasketPro",JSON.stringify(state))}
function renderScores(){
 $("#score1").textContent=state.s1;$("#score2").textContent=state.s2;
 $("#name1").value=state.n1;$("#name2").value=state.n2;
 $("#winner").textContent=state.s1===state.s2?"ÉGALITÉ 🤝":state.s1>state.s2?state.n1+" mène ! 🔥":state.n2+" mène ! 🔥";
 $("#teamScore").textContent=(state.s1+state.s2)+" panier(s) marqué(s) au total";
}
function renderGoals(){
 $("#goalList").innerHTML="";
 goals.forEach((g,i)=>{const row=document.createElement("label");row.className="goal";const cb=document.createElement("input");cb.type="checkbox";cb.checked=state.done.includes(i);cb.addEventListener("change",()=>{state.done=cb.checked?[...state.done,i]:state.done.filter(x=>x!==i);save();renderGoals()});const span=document.createElement("span");span.textContent=g;row.append(cb,span);$("#goalList").append(row)});
 $("#goalCount").textContent=state.done.length;$("#goalBar").style.width=(state.done.length/goals.length*100)+"%";$("#allDone").hidden=state.done.length!==goals.length;
}
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll("section").forEach(x=>x.classList.toggle("active",x.id===b.dataset.tab))}));
document.querySelectorAll("[data-score]").forEach(b=>b.addEventListener("click",()=>{const k="s"+b.dataset.score;state[k]++;save();renderScores()}));
document.querySelectorAll("[data-minus]").forEach(b=>b.addEventListener("click",()=>{const k="s"+b.dataset.minus;state[k]=Math.max(0,state[k]-1);save();renderScores()}));
$("#name1").addEventListener("change",e=>{state.n1=e.target.value.trim()||"Joueur 1";save();renderScores()});
$("#name2").addEventListener("change",e=>{state.n2=e.target.value.trim()||"Joueur 2";save();renderScores()});
$("#resetScores").addEventListener("click",()=>{if(confirm("Remettre les deux scores à zéro ?")){state.s1=state.s2=0;save();renderScores()}});
$("#resetGoals").addEventListener("click",()=>{state.done=[];save();renderGoals()});
let remaining=Number.isFinite(state.seconds)?state.seconds:3600, interval=null;
function clock(){let h=Math.floor(remaining/3600),m=Math.floor(remaining%3600/60),s=remaining%60;$("#clock").textContent=[h,m,s].map(x=>String(x).padStart(2,"0")).join(":")}
function stop(){if(interval){clearInterval(interval);interval=null}}
$("#start").addEventListener("click",()=>{if(interval||remaining<=0)return;interval=setInterval(()=>{remaining=Math.max(0,remaining-1);clock();if(remaining===0){stop();alert("Séance terminée ! Bravo à vous deux 🏀")}},1000)});
$("#pause").addEventListener("click",stop);
$("#restart").addEventListener("click",()=>{stop();remaining=3600;clock()});
renderScores();renderGoals();clock();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
let deferredPrompt;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installHint").style.display="block"});
if(location.protocol==="https:" && !window.matchMedia("(display-mode: standalone)").matches)$("#installHint").style.display="block";
