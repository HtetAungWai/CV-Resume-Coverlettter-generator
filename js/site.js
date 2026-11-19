const $=s=>document.querySelector(s);
const esc=t=>String(t||"").replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const DOCS={resume:"Resume",cv:"CV",cover:"Cover letter"};
const DD={
resume:{dos:["Keep it to one page","Start bullets with strong verbs: built, led, reduced, launched","Add numbers: users, hours saved, grades, team size","Mirror keywords from the job post","Use one clean font and consistent dates","Save as PDF named Firstname-Lastname-Resume"],donts:["Don’t write “Responsible for…” lists of duties","Don’t add a photo, age or ID number unless the country expects it","Don’t use a casual email address","Don’t include every job you’ve ever had","Don’t use tables, columns or graphics that break applicant systems","Don’t lie or inflate; interviews will test it"]},
cv:{dos:["Lead with education if you’re a student or researcher","List projects, publications, awards and certifications","Use reverse chronological order, newest first","Give each entry a date and a one-line outcome","Keep sections in a consistent order","Update it every term"],donts:["Don’t pad it just to fill pages","Don’t send the full CV when a one-page resume is requested","Don’t leave unexplained gaps without a short note","Don’t mix date formats","Don’t list skills with made-up proficiency bars","Don’t copy a template without removing placeholder text"]},
cover:{dos:["Address a real person when you can find the name","Open with the role and one sharp reason you fit","Give one or two specific proofs, with results","Show you researched the company","Keep it under one page","Close with a clear next step"],donts:["Don’t start with “To whom it may concern, I am writing to apply”","Don’t repeat your resume line by line","Don’t send the same letter to every company","Don’t talk only about what you want to gain","Don’t leave another company’s name in by mistake","Don’t skip proofreading"]}};
const EX={
resume:{bad:`<p class="nm">resume</p><p>cooldude99@mail.com · 08x-xxx</p><h4>OBJECTIVE</h4><p>To get a job where I can use my skills and grow in a good company.</p><h4>Experience</h4><ul><li>Responsible for helping customers</li><li>Did social media</li><li>Worked in team</li></ul><h4>Skills</h4><p>Microsoft Word, hard worker, Python ★★★★★, Teamwork ★★★★★</p><p>References available on request. Hobbies: sleeping, music.</p>`,
badWhy:["Vague objective could fit anyone","Duties, not achievements, and no numbers","Star ratings mean nothing","Unprofessional email and mixed fonts","Wasted space on hobbies"],
good:`<p class="nm">Nina Chaiyasit</p><p>nina.c@mail.com · Bangkok · github.com/ninac</p><h4>Summary</h4><p>Computer science student who builds web tools for student organisations. Seeking a front-end internship.</p><h4>Experience</h4><p><b>Web Lead, TechBridge Club</b> · 2025–now</p><ul><li>Built the club sign-up site; 120 members registered in two weeks</li><li>Cut event admin time by 4 hours a week with a Calendar automation</li><li>Trained 9 new members on Git and HTML</li></ul><h4>Skills</h4><p>JavaScript, React, Python, Git, Figma</p>`,
goodWhy:["Tailored summary names the target role","Bullets start with verbs and show results","Numbers prove impact","Clean, scannable, one page"]},
cv:{bad:`<p class="nm">CV of Somchai</p><p>Born 12 May 2004, single, Thai. Photo attached.</p><h4>education</h4><p>School – 2018, University – 2022?? (not finished)</p><h4>Everything I did</h4><p>Joined club. Went to seminar. Python course. Part time job 2023. Another job 2024. Volunteer.</p><p>Page 1 of 6 (mostly blank)</p>`,
badWhy:["Personal details nobody needs","Unclear dates and unfinished entries","No outcomes, just activities","Inconsistent headings and formats","Empty pages"],
good:`<p class="nm">Somchai Pattana</p><p>somchai.p@mail.com · Bangkok</p><h4>Education</h4><p><b>BSc Computer Science</b>, Stamford University · 2022–2026 · GPA 3.6</p><h4>Projects</h4><ul><li>Campus Study Planner: React app used by 80 students (2025)</li><li>Sentiment analysis of course reviews with Python (2025)</li></ul><h4>Certifications</h4><ul><li>Google Data Analytics, 2025</li></ul><h4>Experience</h4><p><b>Teaching assistant</b>, Intro to Programming · 2024–2025</p>`,
goodWhy:["Education first, with clear dates","Projects with scale and year","Consistent headings and formats","Only relevant content, any length it needs"]},
cover:{bad:`<p>To whom it may concern,</p><p>I am writing to apply for job in your company. I am very hard working and passionate. I think this job will help me to grow my career. My resume is attached, please read it.</p><p>Thank you. I hope you will consider me. Sincerely, Somchai</p>`,
badWhy:["Generic opening with no role or name","Focuses on what the writer gets","No proof, only adjectives","Repeats “see my resume”","Careless grammar"],
good:`<p>Dear Ms Tanaka,</p><p>I’m applying for the Front-End Intern role at Orbit Labs. Your open-source dashboard kit is why: I used it for my club’s event tracker.</p><p>As web lead at TechBridge, I built a sign-up site that 120 members used in two weeks, and an automation that saves our officers four hours a week. I’d like to bring that same bias for useful, simple tools to your team.</p><p>I’d welcome a short call to talk about how I can help. Thank you for your time.</p><p>Warm regards,<br>Nina Chaiyasit</p>`,
goodWhy:["Names the person, role and company","Links company to personal experience","Specific proof with numbers","Ends with a clear next step"]}};
function seg(el,items,cur,fn){el.innerHTML="";items.forEach(([k,l])=>{const b=document.createElement("button");b.textContent=l;b.className=k===cur?"on":"";b.onclick=()=>{fn(k);seg(el,items,k,fn)};el.appendChild(b)})}
const docItems=Object.entries(DOCS);
function showDos(k){const d=DD[k];$("#dosbox").innerHTML=`<div class="do"><h3>Do</h3><ul>${d.dos.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div class="dont"><h3>Don’t</h3><ul>${d.donts.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`}
function showEx(k){const e=EX[k];$("#exbox").innerHTML=`<div><span class="label b">Dark side · bad</span><div class="paper bad">${e.bad}</div><ul class="why">${e.badWhy.map(x=>`<li>✗ ${esc(x)}</li>`).join("")}</ul></div><div><span class="label g">Light side · good</span><div class="paper good">${e.good}</div><ul class="why">${e.goodWhy.map(x=>`<li>✓ ${esc(x)}</li>`).join("")}</ul></div>`}
const routes=["basics","anatomy","write","dos","examples","build"];
function route(){const h=(location.hash||"#basics").slice(1);const r=routes.includes(h)?h:"basics";
 routes.forEach(x=>{$("#v-"+x).classList.toggle("on",x===r)});
 document.querySelectorAll("#tabs a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+r))}
const LAD=[["Duty","Helped with the club website.","A vague duty. A reader can’t picture what you did."],["Action","Built the club sign-up website.","A strong verb and a clear thing you made."],["Result","Built the club sign-up website that 120 members used in two weeks.","Now there’s a number a reader can trust and remember."]];
function ladder(k){const l=LAD[k];$("#ladbox").innerHTML=`<p style="font:1.3rem Cambria,Georgia,serif;margin:0 0 6px">${esc(l[1])}</p><p style="color:var(--muted);margin:0">${esc(l[2])}</p>`}
seg($("[data-for=lad]"),[[0,"1 · Duty"],[1,"2 · Action"],[2,"3 · Result"]],0,ladder);ladder(0);
addEventListener("hashchange",route);route();
document.querySelectorAll(".seg").forEach(el=>{const w=el.dataset.for;
 if(w==="dos"){seg(el,docItems,"resume",showDos);showDos("resume")}
 if(w==="ex"){seg(el,docItems,"resume",showEx);showEx("resume")}
 });
(()=>{const b=document.querySelector(".menu"),t=document.querySelector("#tabs");if(!b||!t)return;
const set=o=>{t.classList.toggle("open",o);b.setAttribute("aria-expanded",o)};
b.onclick=()=>set(!t.classList.contains("open"));
t.addEventListener("click",e=>{if(e.target.closest("a"))set(false)});
addEventListener("hashchange",()=>{scrollTo(0,0);window.hyperspace&&window.hyperspace()})})();
