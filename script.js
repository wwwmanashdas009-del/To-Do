const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const defaultSkills=[
{id:"english",name:"English",icon:"🇬🇧"},
{id:"instagram",name:"Instagram",icon:"📸"},
{id:"ai",name:"AI Automation",icon:"🤖"},
{id:"coding",name:"Coding",icon:"💻"},
{id:"trading",name:"Trading",icon:"📈"}];
let logs=JSON.parse(localStorage.getItem("svLogs")||"[]"),goals=JSON.parse(localStorage.getItem("svGoals")||"[]");
let note=localStorage.getItem("svNote")||"";
const today=()=>new Date().toISOString().slice(0,10);
function save(){localStorage.setItem("svLogs",JSON.stringify(logs));localStorage.setItem("svGoals",JSON.stringify(goals));}
function toast(x){let t=$("#toast");t.textContent=x;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),1700)}
function skillStats(id){let a=logs.filter(x=>x.skill===id);return {count:a.length,mins:a.reduce((s,x)=>s+x.minutes,0)}}
function renderSkills(){
 $("#skills").innerHTML=defaultSkills.map(s=>{let x=skillStats(s.id),p=Math.min(100,x.count*10);return `<div class="skill-card glass tilt"><div class="skill-icon">${s.icon}</div><div class="skill-name">${s.name}</div><div class="skill-meta">${x.count} sessions • ${x.mins} min</div><div class="skill-progress"><i style="width:${p}%"></i></div></div>`}).join("");
 $("#skill").innerHTML=defaultSkills.map(s=>`<option value="${s.id}">${s.icon} ${s.name}</option>`).join("");
 $("#levels").innerHTML=defaultSkills.map(s=>{let x=skillStats(s.id),p=Math.min(100,x.count*10);return `<div class="level"><div class="level-head"><b>${s.icon} ${s.name}</b><span>${p}%</span></div><div class="level-bar"><i style="width:${p}%"></i></div></div>`}).join("");
}
function renderDashboard(){
 let td=logs.filter(x=>x.date===today()),done=Math.min(100,td.length*20),deg=done*3.6;
 $("#percent").textContent=done+"%";$("#bar").style.width=done+"%";$("#ring").style.background=`conic-gradient(#76eaff 0 ${deg}deg,#9a83ff ${deg}deg,#ffffff0d ${deg}deg)`;
 $("#todayCount").textContent=td.length+" activit"+(td.length===1?"y":"ies");$("#summary").textContent=`${td.length} learning activit${td.length===1?"y":"ies"} logged today.`;
 let a=[...logs].slice(-5).reverse();$("#activity").innerHTML=a.length?a.map(x=>`<div class="activity-item"><b>${x.skillName} • ${x.minutes} min</b><p>${escapeHtml(x.text)}</p></div>`).join(""):`<p class="muted">No activity yet. Start learning.</p>`;
 let streak=0,d=new Date();while(true){let k=d.toISOString().slice(0,10);if(logs.some(x=>x.date===k)){streak++;d.setDate(d.getDate()-1)}else break}$("#streak").textContent=streak;
}
function renderHistory(){$("#history").innerHTML=logs.length?[...logs].reverse().map(x=>`<div class="history-row"><p><b>${x.skillName}</b> — ${escapeHtml(x.text)}</p><span>${x.date} • ${x.minutes}m</span></div>`).join(""):`<p class="muted">Your learning history will appear here.</p>`}
function renderGoals(){$("#goalsList").innerHTML=goals.length?goals.map((g,i)=>`<div class="goal glass ${g.done?"done":""}"><button class="goal-check" data-g="${i}">${g.done?"✓":""}</button><div class="goal-text">${escapeHtml(g.text)}</div><button class="goal-del" data-d="${i}">×</button></div>`).join(""):`<div class="glass panel"><p class="muted">No goals yet. Add one above.</p></div>`}
function render(){renderSkills();renderDashboard();renderHistory();renderGoals();$("#dailyNote").value=note;$("#noteCount").textContent=note.length+" characters";applyTilt()}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
$("#learnForm").onsubmit=e=>{e.preventDefault();let id=$("#skill").value,s=defaultSkills.find(x=>x.id===id);logs.push({skill:id,skillName:s.name,text:$("#learnText").value.trim(),minutes:+$("#minutes").value,date:today()});save();e.target.reset();$("#minutes").value=30;render();toast("Learning saved ✦")};
$("#saveNote").onclick=()=>{note=$("#dailyNote").value;localStorage.setItem("svNote",note);$("#noteCount").textContent=note.length+" characters";toast("Today's note saved ✓")};
$("#dailyNote").oninput=e=>$("#noteCount").textContent=e.target.value.length+" characters";
$("#goalForm").onsubmit=e=>{e.preventDefault();goals.push({text:$("#goalInput").value.trim(),done:false});$("#goalInput").value="";save();render();toast("Goal added")};
$("#goalsList").onclick=e=>{let c=e.target.closest("[data-g]"),d=e.target.closest("[data-d]");if(c){goals[c.dataset.g].done=!goals[c.dataset.g].done;save();render()}if(d){goals.splice(d.dataset.d,1);save();render();toast("Goal removed")}};
$("#clearLogs").onclick=()=>{if(!logs.length)return;logs=[];save();render();toast("History cleared")};
$("#quickAdd").onclick=()=>{document.querySelector('[data-page="learn"]').click();setTimeout(()=>$("#learnText").focus(),150)};
$$(".tab").forEach(b=>b.onclick=()=>{$$(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");$$(".page").forEach(x=>x.classList.remove("active"));$("#"+b.dataset.page).classList.add("active")});
function tick(){$("#clock").textContent=new Intl.DateTimeFormat("en-IN",{weekday:"long",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(new Date())}tick();setInterval(tick,30000);
function applyTilt(){$$(".tilt").forEach(c=>{c.onpointermove=e=>{if(innerWidth<700)return;let r=c.getBoundingClientRect(),x=e.clientX/r.width-r.left/r.width-.5,y=e.clientY/r.height-r.top/r.height-.5;c.style.transform=`perspective(900px) rotateX(${y*-3}deg) rotateY(${x*4}deg) translateY(-3px)`};c.onpointerleave=()=>c.style.transform=""})}
render();