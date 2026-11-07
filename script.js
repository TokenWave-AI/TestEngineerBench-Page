// Numbers transcribed from Tables 3 and 5 of the supplied 25 October 2026 paper.
const models = [
  {name:'DeepSeek-V4.1-Flash',harness:'Claude Code',family:'Open-source',tests:[92.25,27.69,71.29,76.89,86.88],localization:[76.97,76.09,48.26,55.15,51.36,71.20],bugs:[37.93,46.19,3.92]},
  {name:'Kimi-K3',harness:'Claude Code',family:'Open-source',tests:[93.48,25.00,77.53,81.20,120.50],localization:[80.64,76.26,51.60,54.94,51.98,69.72],bugs:[42.72,52.14,3.92]},
  {name:'GLM-5.3',harness:'Claude Code',family:'Open-source',tests:[94.40,21.33,76.64,80.58,142.02],localization:[79.78,75.42,49.39,54.92,51.57,68.73],bugs:[42.34,51.90,2.94]},
  {name:'Claude-Sonnet-5',harness:'Claude Code',family:'Closed-source',tests:[90.65,21.78,68.23,72.88,68.74],localization:[62.89,73.82,40.08,50.49,41.20,66.33],bugs:[33.14,40.63,2.00]},
  {name:'Claude-Opus-5',harness:'Claude Code',family:'Closed-source',tests:[93.16,27.07,79.49,83.39,197.24],localization:[80.80,78.85,56.55,54.63,55.11,71.90],bugs:[45.37,54.57,7.84]},
  {name:'GPT-5.6-Sol',harness:'Codex',family:'Closed-source',tests:[86.02,34.09,72.41,81.41,32.91],localization:[79.80,75.26,52.59,58.55,52.22,70.34],bugs:[43.30,52.38,5.88]},
  {name:'GPT-6-Astra',harness:'Codex',family:'Closed-source',tests:[90.37,27.56,81.41,87.01,162.62],localization:[85.85,71.59,60.56,47.72,59.72,63.27],bugs:[49.04,59.05,7.84]},
];
const tracks = {
  tests:{headers:['HP ↑','F2P ↑','EC ↑','CFG ↑','Tests / instance'],defaultSort:1,note:'HP: head pass rate. F2P: fail-to-pass rate. EC: entry coverage. CFG: change-focused coverage. All values are percentages except suite size; the highest percentage in each column is highlighted.'},
  localization:{headers:['File LR ↑','File LP ↑','Function LR ↑','Function LP ↑','Hunk LR ↑','Hunk LP ↑'],defaultSort:0,note:'LR: localization recall. LP: localization precision. Values are instance-averaged percentages. Hunk matching uses a three-line tolerance. These scores measure reference location agreement, not verified repairs.'},
  bugs:{headers:['Overall ↑','Single-file ↑','Multi-file ↑'],defaultSort:0,note:'Percentage of evaluable reference bugs localized. Each bug requires all reference files and functions plus more than half its edit hunks. Bug occurrences are weighted equally. See Table 5 for the full criterion.'}
};
let activeTrack='tests';let sortColumn=1;let ascending=false;
function renderResults(){
 const track=tracks[activeTrack];
 document.getElementById('results-head').innerHTML='<tr><th scope="col">Model / harness</th>'+track.headers.map((label,i)=>`<th scope="col" aria-sort="${sortColumn===i?(ascending?'ascending':'descending'):'none'}"><button data-sort="${i}" aria-label="Sort by ${label.replace(' ↑','')}">${label}${sortColumn===i?(ascending?' ▴':' ▾'):''}</button></th>`).join('')+'</tr>';
 const query=document.getElementById('model-search').value.trim().toLowerCase();
 const filtered=models.filter(m=>(m.name+' '+m.harness).toLowerCase().includes(query)).sort((a,b)=>(a[activeTrack][sortColumn]-b[activeTrack][sortColumn])*(ascending?1:-1));
 const maxima=track.headers.map((_,i)=>Math.max(...models.map(m=>m[activeTrack][i])));
 document.getElementById('results-body').innerHTML=filtered.length?filtered.map(m=>`<tr><td class="model">${m.name}<small>${m.harness} · ${m.family}</small></td>${m[activeTrack].map((n,i)=>`<td class="${n===maxima[i]&&!(activeTrack==='tests'&&i===4)?'best':''}">${n.toFixed(2)}</td>`).join('')}</tr>`).join(''):`<tr class="no-results"><td colspan="${track.headers.length+1}">No models match your search.</td></tr>`;
 document.getElementById('metric-note').textContent=track.note;
}
document.getElementById('results-head').addEventListener('click',event=>{const button=event.target.closest('[data-sort]');if(!button)return;const next=Number(button.dataset.sort);ascending=next===sortColumn?!ascending:false;sortColumn=next;renderResults();document.querySelector(`[data-sort="${next}"]`).focus();});
document.getElementById('model-search').addEventListener('input',renderResults);
function wireTabs(selector,select){
 const buttons=[...document.querySelectorAll(selector)];
 buttons.forEach(button=>{
  button.addEventListener('click',()=>{buttons.forEach(b=>{b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;});select(button);});
  button.addEventListener('keydown',event=>{let index=buttons.indexOf(button);if(event.key==='ArrowRight')index=(index+1)%buttons.length;else if(event.key==='ArrowLeft')index=(index+buttons.length-1)%buttons.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=buttons.length-1;else return;event.preventDefault();buttons[index].click();buttons[index].focus();});
 });
}
wireTabs('[data-track]',button=>{activeTrack=button.dataset.track;sortColumn=tracks[activeTrack].defaultSort;ascending=false;document.getElementById('results-panel').setAttribute('aria-labelledby',button.id);renderResults();});
function escapeHTML(value){return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');}
document.getElementById('copy-citation').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText(document.getElementById('bibtex').textContent);status.textContent='BibTeX copied to clipboard.';}catch{status.textContent='Select and copy the BibTeX above; clipboard access is unavailable in this browser.';}});

// Dataset charts use the current manuscript inventory, not older release audits.
let selectedCategory = '';
const categoryTotals = [...new Set(PAPER.repositories.map(r => r.category))].map(name => ({
 name, count: PAPER.repositories.filter(r => r.category === name).reduce((sum, r) => sum + r.instances, 0)
})).sort((a,b) => b.count-a.count || a.name.localeCompare(b.name));
function renderCategories(){
 document.getElementById('category-chart').innerHTML=categoryTotals.map(c=>`<button class="category-row ${selectedCategory===c.name?'selected':''}" data-category="${escapeHTML(c.name)}" aria-pressed="${selectedCategory===c.name}" aria-label="${escapeHTML(c.name)}, ${c.count} instances"><span>${escapeHTML(c.name)}</span><span class="category-track"><i style="width:${c.count/17*100}%"></i></span><b>${c.count}</b></button>`).join('');
 document.getElementById('reset-category').classList.toggle('active',!selectedCategory);
}
function renderRepositories(){
 const metric=document.getElementById('repository-sort').value;
 const units={defects:'recorded defects',kloc:'source kLOC',instances:'instances'};
 const rows=PAPER.repositories.filter(r=>!selectedCategory||r.category===selectedCategory).sort((a,b)=>b[metric]-a[metric]||a.repo.localeCompare(b.repo));
 document.getElementById('repository-title').textContent=selectedCategory||'All repositories';
 document.getElementById('repository-count').textContent=`${rows.length} repositories · ${rows.reduce((s,r)=>s+r.instances,0)} instances · ${rows.reduce((s,r)=>s+r.defects,0)} recorded defect occurrences`;
 const top=rows.slice(0,8);const max=Math.max(...rows.map(r=>r[metric]));
 document.getElementById('repository-scale').innerHTML=top.map(r=>`<a href="${r.url}" target="_blank" rel="noopener" class="repo-bar" aria-label="${escapeHTML(r.repo)}, ${r[metric]} ${units[metric]}"><span>${escapeHTML(r.repo)}</span><span class="repo-track"><i style="width:${r[metric]/max*100}%"></i></span><b>${r[metric].toLocaleString('en-US',{maximumFractionDigits:1})}</b></a>`).join('')+`<p class="chart-source">${rows.length>8?'Top 8 repositories · ':''}${units[metric]} · Linear scale from 0</p>`;
 document.getElementById('repository-body').innerHTML=rows.map(r=>`<tr><td><a href="${r.url}" target="_blank" rel="noopener">${escapeHTML(r.repo)}</a></td><td>${escapeHTML(r.category)}</td><td>${r.instances}</td><td>${r.defects}</td><td>${r.kloc.toLocaleString('en-US')}</td></tr>`).join('');
}
document.getElementById('category-chart').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;selectedCategory=button.dataset.category===selectedCategory?'':button.dataset.category;renderCategories();renderRepositories();const active=[...document.querySelectorAll('[data-category]')].find(b=>b.dataset.category===button.dataset.category);active.focus();});
document.getElementById('reset-category').addEventListener('click',()=>{selectedCategory='';renderCategories();renderRepositories();});
document.getElementById('repository-sort').addEventListener('change',renderRepositories);
function renderHistogram(){
 const grouped=document.getElementById('histogram-mode').value==='grouped';
 const data=grouped?[['4–5',74],['6–9',24],['10–15',2]]:PAPER.histogram.map((n,i)=>[String(i+4),n]);
 const max=grouped?80:50;const width=480,height=280,left=34,top=24,bottom=38,plot=height-top-bottom,step=(width-left-12)/data.length;
 const ticks=Array.from({length:grouped?5:6},(_,i)=>i*(grouped?20:10));
 document.getElementById('histogram').innerHTML=`<svg viewBox="0 0 ${width} ${height}" role="group" aria-label="Distribution of recorded defects per instance">${ticks.map(n=>`<line x1="${left}" y1="${height-bottom-n/max*plot}" x2="${width-8}" y2="${height-bottom-n/max*plot}" stroke="#e5e8ed"/><text x="${left-9}" y="${height-bottom-n/max*plot+4}" text-anchor="end" class="chart-tick">${n}</text>`).join('')}${data.map(([label,n],i)=>{const x=left+i*step+step*.14,y=height-bottom-n/max*plot;return `<g class="histogram-bin" tabindex="0" data-label="${label}" data-count="${n}" aria-label="${label} recorded defects: ${n} instances"><title>${label} defects: ${n} instances</title><rect x="${left+i*step}" y="${top-20}" width="${step}" height="${plot+42}" fill="transparent"/><rect class="histogram-bar" x="${x}" y="${y}" width="${step*.72}" height="${n/max*plot}" rx="4"/><text class="bar-value" x="${x+step*.36}" y="${y-8}" text-anchor="middle">${n}</text><text class="chart-tick" x="${x+step*.36}" y="${height-15}" text-anchor="middle">${label}</text></g>`;}).join('')}</svg><p class="axis-label">Recorded defects per instance</p>`;
}
function showBin(event){const bin=event.target.closest('[data-count]');if(bin)document.getElementById('histogram-detail').textContent=`${bin.dataset.label} recorded defects · ${bin.dataset.count} instances (${bin.dataset.count}% of the benchmark)`;}
document.getElementById('histogram').addEventListener('pointerover',showBin);
document.getElementById('histogram').addEventListener('focusin',showBin);
document.getElementById('histogram-mode').addEventListener('change',()=>{renderHistogram();document.getElementById('histogram-detail').textContent='100 instances · Median 5 · Mean 5.31';});

// All finding paragraphs below are manuscript excerpts, with only TeX markup converted.
const findingMetrics=[['91.47%','Head Pass Rate','26.36%','Fail-to-Pass Rate'],['80.48%','Mean change-focused coverage','24.24–37.82%','F2P in the 80–100% CFG interval'],['78.11%','File recall','51.29%','Function recall'],['40.63–59.05%','Single-file bugs localized','2.00–7.84%','Multi-file bugs localized'],['31.6%','Assertion mismatches','37.5%','Misconfigured mocks'],['36.0%','Premature search termination','30.9%','Evidence underuse'],['+4.99 pp','File recall','+2.77 pp','Function recall']];
let activeFinding=0;
document.getElementById('finding-tabs').innerHTML=PAPER.findings.map((f,i)=>`<button id="finding-${i}" data-finding="${i}" role="tab" aria-selected="${i===0}" aria-controls="finding-panel" tabindex="${i===0?0:-1}"><span>0${i+1}</span>${f.title}</button>`).join('');
function renderFinding(index){
 activeFinding=index;const f=PAPER.findings[index],metrics=findingMetrics[index];
 document.getElementById('finding-count').textContent=`${index+1} / ${PAPER.findings.length}`;
 document.getElementById('finding-panel').setAttribute('aria-labelledby',`finding-${index}`);
 document.getElementById('finding-panel').innerHTML=`<p class="eyebrow">FINDING 0${index+1}</p><h3>${f.title}</h3><div class="finding-metrics"><div><strong>${metrics[0]}</strong><span>${metrics[1]}</span></div><div><strong>${metrics[2]}</strong><span>${metrics[3]}</span></div></div><p class="original-prose">${f.html}</p><a class="text-link paper-source" href="assets/paper.pdf" target="_blank">Paper · Experiments ↗</a>`;
}
wireTabs('[data-finding]',button=>renderFinding(Number(button.dataset.finding)));
['prev','next'].forEach(direction=>document.getElementById(`finding-${direction}`).addEventListener('click',()=>{document.querySelector(`[data-finding="${(activeFinding+(direction==='next'?1:-1)+PAPER.findings.length)%PAPER.findings.length}"]`).click();}));

function instruction(n){const p=PAPER.instructions[n-1];return `<details class="instruction"><summary>${p.title} · Complete instruction template</summary><pre class="instruction-text">${escapeHTML(p.text)}</pre></details>`;}
function renderTask(key){
 const panel=document.getElementById('task-document');
 const metricRow=(pairs)=>`<div class="task-metrics">${pairs.map(([value,label])=>`<div><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>`;
 if(key==='prd')panel.innerHTML=`<div class="document-toolbar"><span>prd.md · Full task input</span><a href="assets/folium-prd.md" download>Save PRD ↗</a></div><div class="prd-content">${PAPER.prd}</div>${instruction(1)}${instruction(2)}`;
 else if(key==='tests')panel.innerHTML=`<div class="document-toolbar"><span>TASK 1 · Generated tests</span><span>159 submitted tests</span></div>${metricRow([['83.65%','HP'],['20.75%','F2P'],['96.30%','EC'],['100.00%','CFG']])}<div class="paper-evidence">${PAPER.task1}</div>${instruction(1)}`;
 else panel.innerHTML=`<div class="document-toolbar"><span>TASK 2 · Defect report</span><span>Independent run</span></div>${metricRow([['5 / 5','Reference bugs localized'],['15','Agent-reported findings'],['100%','File / function / hunk LR']])}<div class="paper-evidence">${PAPER.task2Summary}<h4>report.json · Paper excerpt</h4><pre class="report-code"><code>${escapeHTML(PAPER.report)}</code></pre></div>${instruction(2)}`;
}
wireTabs('[data-task]',button=>{document.getElementById('task-document').setAttribute('aria-labelledby',button.id);renderTask(button.dataset.task);});
wireTabs('[data-case-mode]',button=>{const complete=button.dataset.caseMode==='complete';document.getElementById('complete-case').hidden=!complete;document.getElementById('mechanics-case').hidden=complete;});
const caseLabels=['Passing tests, unchecked contract','New assertions, shared defect','Passing suite, missed boundaries','99 tests, no defect exposure','Requirements-derived assertions','Incorrect assertion oracle'];
document.getElementById('mechanism-tabs').innerHTML=PAPER.cases.map((c,i)=>`<button id="mechanism-${i}" data-mechanism="${i}" role="tab" aria-selected="${i===0}" aria-controls="mechanism-panel" tabindex="${i===0?0:-1}"><span>CASE 0${i+1} · ${i===1||i===4?'SUCCESS':'LIMITATION'}</span>${caseLabels[i]}</button>`).join('');
function renderMechanism(index){const c=PAPER.cases[index];document.getElementById('mechanism-panel').setAttribute('aria-labelledby',`mechanism-${index}`);document.getElementById('mechanism-panel').innerHTML=`<p class="eyebrow">TRAJECTORY CASE 0${index+1}</p><h3>${c.title}</h3><div class="mechanism-meta">${c.meta}</div><div class="paper-evidence">${c.html}</div><a class="paper-source text-link" href="assets/paper.pdf#page=25" target="_blank">Paper · Appendix D ↗</a>`;}
wireTabs('[data-mechanism]',button=>renderMechanism(Number(button.dataset.mechanism)));
// Vertical tablists support their expected keyboard directions as well.
document.querySelectorAll('[aria-orientation="vertical"]').forEach(list=>list.addEventListener('keydown',event=>{if(!['ArrowUp','ArrowDown'].includes(event.key))return;const tabs=[...list.querySelectorAll('[role="tab"]')];const i=tabs.indexOf(event.target);if(i<0)return;event.preventDefault();const next=tabs[(i+(event.key==='ArrowDown'?1:-1)+tabs.length)%tabs.length];next.click();next.focus();}));
renderResults();renderCategories();renderRepositories();renderHistogram();renderFinding(0);renderTask('prd');renderMechanism(0);
