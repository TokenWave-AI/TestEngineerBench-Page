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
document.getElementById('results-head').addEventListener('click',event=>{const button=event.target.closest('[data-sort]');if(!button)return;const next=Number(button.dataset.sort);ascending=next===sortColumn?!ascending:false;sortColumn=next;renderResults();animatePanel(document.getElementById('results-body'));document.querySelector(`[data-sort="${next}"]`).focus();});
document.getElementById('model-search').addEventListener('input',renderResults);
function reducedMotion(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
function animatePanel(panel){
 if(!panel||panel.hidden||reducedMotion())return;
 panel.getAnimations().forEach(animation=>animation.cancel());
 panel.animate([{opacity:.2,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'cubic-bezier(.2,.7,.2,1)'});
}
function syncTabIndicator(list){
 const selected=list.querySelector('[role="tab"][aria-selected="true"]');
 if(!selected||!list.offsetWidth||!selected.offsetWidth)return;
 list.classList.add('motion-tabs');
 list.style.setProperty('--tab-x',selected.offsetLeft+'px');list.style.setProperty('--tab-y',selected.offsetTop+'px');
 list.style.setProperty('--tab-w',selected.offsetWidth+'px');list.style.setProperty('--tab-h',selected.offsetHeight+'px');
}
function refreshTabIndicators(){document.querySelectorAll('[role="tablist"]').forEach(syncTabIndicator);}
function animateBars(container){
 if(!container||reducedMotion())return;
 container.querySelectorAll('.plot-bar,.plot-range,.repo-track i').forEach((bar,i)=>bar.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:420,delay:Math.min(i*24,150),easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'}));
}
function wireTabs(selector,select){
 const buttons=[...document.querySelectorAll(selector)];
 buttons.forEach(button=>{
  button.addEventListener('click',()=>{
   const changed=button.getAttribute('aria-selected')!=='true';
   buttons.forEach(b=>{b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;});
   if(changed){select(button);animatePanel(document.getElementById(button.getAttribute('aria-controls')));}
   refreshTabIndicators();
  });
  button.addEventListener('keydown',event=>{let index=buttons.indexOf(button);const vertical=button.parentElement.getAttribute('aria-orientation')==='vertical';if(event.key==='ArrowRight'||(vertical&&event.key==='ArrowDown'))index=(index+1)%buttons.length;else if(event.key==='ArrowLeft'||(vertical&&event.key==='ArrowUp'))index=(index+buttons.length-1)%buttons.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=buttons.length-1;else return;event.preventDefault();buttons[index].click();buttons[index].focus();});
 });
 if(buttons.length)syncTabIndicator(buttons[0].parentElement);
}
wireTabs('[data-track]',button=>{activeTrack=button.dataset.track;sortColumn=tracks[activeTrack].defaultSort;ascending=false;document.getElementById('results-panel').setAttribute('aria-labelledby',button.id);renderResults();});
function escapeHTML(value){return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');}
document.getElementById('copy-citation').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText(document.getElementById('bibtex').textContent);status.textContent='BibTeX copied to clipboard.';}catch{status.textContent='Select and copy the BibTeX above; clipboard access is unavailable in this browser.';}});

// Dataset charts use the current manuscript inventory, not older release audits.
let selectedCategory = '';
const categoryTotals = [...new Set(PAPER.repositories.map(r => r.category))].map(name => ({
 name, count: PAPER.repositories.filter(r => r.category === name).reduce((sum, r) => sum + r.instances, 0)
})).sort((a,b) => b.count-a.count || a.name.localeCompare(b.name));
const categoryPalette=['#1D73FF','#475CFF','#8054FF','#124A09','#839800','#85EA00','#710120','#C51354','#DF3FD3','#F5580B','#FFA222','#FDDC24','#D9DDFF','#EEE8FF','#FFE4EE','#FFDECE'];
const categoryColor=name=>categoryPalette[categoryTotals.findIndex(c=>c.name===name)];
function renderCategories(){
 let angle=-Math.PI/2;
 const segments=categoryTotals.map(c=>{
  const start=angle+.006,end=angle+c.count/100*Math.PI*2-.006;angle+=c.count/100*Math.PI*2;
  const point=(r,a)=>[140+r*Math.cos(a),140+r*Math.sin(a)].map(n=>n.toFixed(3)).join(' ');
  const large=end-start>Math.PI?1:0;const middle=(start+end)/2;
  const d=`M ${point(114,start)} A 114 114 0 ${large} 1 ${point(114,end)} L ${point(78,end)} A 78 78 0 ${large} 0 ${point(78,start)} Z`;
  return `<path d="${d}" style="--segment-x:${(Math.cos(middle)*7).toFixed(2)}px;--segment-y:${(Math.sin(middle)*7).toFixed(2)}px" fill="${categoryColor(c.name)}" class="donut-segment ${selectedCategory&&selectedCategory!==c.name?'muted':''}" data-category="${escapeHTML(c.name)}" tabindex="0" role="button" aria-label="${escapeHTML(c.name)}, ${c.count} instances" aria-pressed="${selectedCategory===c.name}"><title>${escapeHTML(c.name)}: ${c.count} instances</title></path>`;
 }).join('');
 const selected=categoryTotals.find(c=>c.name===selectedCategory);
 document.getElementById('category-chart').innerHTML=`<svg viewBox="0 0 280 280" class="category-donut" role="group" aria-label="Instances across 16 application categories">${segments}<text x="140" y="139" text-anchor="middle" class="donut-total">${selected?selected.count:100}</text><text x="140" y="164" text-anchor="middle" class="donut-caption">instances</text></svg><div class="category-legend">${categoryTotals.map(c=>`<button class="category-row ${selectedCategory===c.name?'selected':''}" data-category="${escapeHTML(c.name)}" aria-pressed="${selectedCategory===c.name}" aria-label="Filter ${escapeHTML(c.name)}, ${c.count} instances"><i class="category-swatch" style="background:${categoryColor(c.name)}"></i><span>${escapeHTML(c.name).replaceAll('/',' / ')}</span><b>${c.count}</b></button>`).join('')}</div>`;
 document.getElementById('reset-category').classList.toggle('active',!selectedCategory);
}
function renderRepositories(){
 const metric=document.getElementById('repository-sort').value;
 const units={defects:'recorded defects',kloc:'source kLOC',instances:'instances'};
 const rows=PAPER.repositories.filter(r=>!selectedCategory||r.category===selectedCategory).sort((a,b)=>b[metric]-a[metric]||a.repo.localeCompare(b.repo));
 document.getElementById('repository-title').textContent=selectedCategory||'All repositories';
 document.getElementById('repository-count').textContent=`${rows.length} repositories · ${rows.reduce((s,r)=>s+r.instances,0)} instances · ${rows.reduce((s,r)=>s+r.defects,0)} recorded defect occurrences`;
 const top=rows.slice(0,8);const max=Math.max(...rows.map(r=>r[metric]));
 document.getElementById('repository-scale').innerHTML=top.map(r=>`<a href="${r.url}" target="_blank" rel="noopener" class="repo-bar" aria-label="${escapeHTML(r.repo)}, ${r[metric]} ${units[metric]}"><span>${escapeHTML(r.repo)}</span><span class="repo-track"><i style="width:${r[metric]/max*100}%;background:${categoryColor(r.category)}"></i></span><b>${r[metric].toLocaleString('en-US',{maximumFractionDigits:1})}</b></a>`).join('')+`<p class="chart-source">${rows.length>8?'Top 8 repositories · ':''}${units[metric]} · Linear scale from 0</p>`;
 animateBars(document.getElementById('repository-scale'));
 document.getElementById('repository-body').innerHTML=rows.map(r=>`<tr><td><a href="${r.url}" target="_blank" rel="noopener">${escapeHTML(r.repo)}</a></td><td>${escapeHTML(r.category)}</td><td>${r.instances}</td><td>${r.defects}</td><td>${r.kloc.toLocaleString('en-US')}</td></tr>`).join('');
}
let categoryCountFrame=0;
function updateCategoryCount(value){
 const element=document.querySelector('.donut-total');cancelAnimationFrame(categoryCountFrame);
 const start=Number(element.textContent);if(reducedMotion()){element.textContent=String(value);return;}
 const time=performance.now();function tick(now){const progress=Math.min((now-time)/260,1);element.textContent=String(Math.round(start+(value-start)*(1-(1-progress)**3)));if(progress<1)categoryCountFrame=requestAnimationFrame(tick);}
 categoryCountFrame=requestAnimationFrame(tick);
}
function setCategory(category){
 if(category===selectedCategory)return;selectedCategory=category;
 document.querySelectorAll('#category-chart [data-category]').forEach(element=>{
  const selected=element.dataset.category===category;
  element.setAttribute('aria-pressed',String(selected));element.classList.toggle('is-active',selected);element.classList.toggle('selected',selected);element.classList.toggle('muted',Boolean(category)&&!selected&&element.classList.contains('donut-segment'));
 });
 const data=categoryTotals.find(c=>c.name===category);updateCategoryCount(data?data.count:100);
 document.getElementById('reset-category').classList.toggle('active',!category);renderRepositories();
}
const categoryChart=document.getElementById('category-chart');
categoryChart.addEventListener('pointerover',event=>{if(event.pointerType==='touch')return;const target=event.target.closest('[data-category]');if(target)setCategory(target.dataset.category);});
categoryChart.addEventListener('focusin',event=>{const target=event.target.closest('[data-category]');if(target)setCategory(target.dataset.category);});
categoryChart.addEventListener('click',event=>{const target=event.target.closest('[data-category]');if(target)setCategory(target.dataset.category);});
categoryChart.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();setCategory('');}else if(event.target.classList.contains('donut-segment')&&['Enter',' '].includes(event.key)){event.preventDefault();setCategory(event.target.dataset.category);}});
document.getElementById('reset-category').addEventListener('click',()=>setCategory(''));
document.getElementById('reset-category').addEventListener('pointerenter',()=>setCategory(''));
document.getElementById('statistics').addEventListener('pointerleave',()=>{if(!document.activeElement?.matches('#category-chart :focus-visible'))setCategory('');});
document.getElementById('statistics').addEventListener('focusout',event=>{if(!event.currentTarget.contains(event.relatedTarget))setCategory('');});
document.getElementById('repository-sort').addEventListener('change',renderRepositories);
function renderHistogram(){
 const data=PAPER.histogram.map((n,i)=>[String(i+4),n]);
 const max=50;const width=480,height=280,left=34,top=24,bottom=38,plot=height-top-bottom,step=(width-left-12)/data.length;
 const ticks=Array.from({length:6},(_,i)=>i*10);
 document.getElementById('histogram').innerHTML=`<svg viewBox="0 0 ${width} ${height}" role="group" aria-label="Distribution of recorded defects per instance">${ticks.map(n=>`<line x1="${left}" y1="${height-bottom-n/max*plot}" x2="${width-8}" y2="${height-bottom-n/max*plot}" stroke="#e5e8ed"/><text x="${left-9}" y="${height-bottom-n/max*plot+4}" text-anchor="end" class="chart-tick">${n}</text>`).join('')}${data.map(([label,n],i)=>{const x=left+i*step+step*.14,y=height-bottom-n/max*plot;return `<g class="histogram-bin" tabindex="0" data-label="${label}" data-count="${n}" aria-label="${label} recorded defects: ${n} instances"><title>${label} defects: ${n} instances</title><rect x="${left+i*step}" y="${top-20}" width="${step}" height="${plot+42}" fill="transparent"/><rect class="histogram-bar" x="${x}" y="${y}" width="${step*.72}" height="${n/max*plot}" rx="4"/><text class="bar-value" x="${x+step*.36}" y="${y-8}" text-anchor="middle">${n}</text><text class="chart-tick" x="${x+step*.36}" y="${height-15}" text-anchor="middle">${label}</text></g>`;}).join('')}</svg><p class="axis-label">Recorded defects per instance</p>`;
}
function showBin(event){const bin=event.target.closest('[data-count]');if(bin)document.getElementById('histogram-detail').textContent=`${bin.dataset.label} recorded defects · ${bin.dataset.count} instances (${bin.dataset.count}% of the benchmark)`;}
document.getElementById('histogram').addEventListener('pointerover',showBin);
document.getElementById('histogram').addEventListener('focusin',showBin);

// Concise takeaways and chart values come from the manuscript tables and RQ analysis.
function findingViews(index){
 const row=(label,values,color)=>({label,values,colors:color?[color]:undefined});
 const blue='#1D73FF',indigo='#475CFF',violet='#8054FF',burgundy='#710120',baseline='#9BA8BB';
 if(index===0)return [
  {label:'Test quality',unit:'Seven-agent mean (%)',source:'Table 3 · Seven coding agents',rows:[row('Head Pass Rate',[91.47],blue),row('Entry Coverage',[75.29],'#124A09'),row('Change-focused Coverage',[80.48],indigo),row('Fail-to-Pass Rate',[26.36],violet)]},
  {label:'Localization',unit:'Mean localization recall (%)',source:'Table 3 · Seven coding agents',rows:[row('File',[78.11],blue),row('Function',[51.29],indigo),row('Hunk',[51.88],violet)]}
 ];
 if(index===1){
  const range=(label,column,color)=>({label,min:Math.min(...models.map(m=>m.bugs[column])),max:Math.max(...models.map(m=>m.bugs[column])),color});
  return [
   {label:'Across models',unit:'Reference bugs localized (%)',source:'Table 5 · Range across seven models',type:'range',rows:[range('All reference bugs',0,indigo),range('Single-file bugs',1,blue),range('Multi-file bugs',2,burgundy)]},
   {label:'By model',unit:'Reference bugs localized (%)',source:'Table 5 · Bug-level localization criterion',series:[{name:'Single-file',color:blue},{name:'Multi-file',color:burgundy}],rows:models.map(m=>row(m.name,[m.bugs[1],m.bugs[2]]))}
  ];
 }
 if(index===2){
  const selected=['Incomplete output','Incomplete data processing','Missing input validation','Incorrect regular expression','Generic data-operation error','Typo / symbol error'];
  return [{label:'Hunk recall',column:4,color:violet},{label:'Function recall',column:2,color:indigo}].map(v=>({label:v.label,unit:'Mean localization recall (%)',source:'Table 6 · Selected cohorts · Five systems · 86 annotated instances; cohorts overlap',rows:selected.map(name=>row(name,[PAPER.cohorts.find(c=>c.name===name).values[v.column]],v.color))}));
 }
 if(index===3)return [
  {label:'Test construction',unit:'Share of reviewed failure mechanisms (%)',source:'RQ4 · Reviewed Task 1 failure mechanisms',max:40,precision:1,rows:PAPER.failureMechanisms.tests.map(([name,value])=>row(name,[value],violet))},
  {label:'Localization',unit:'Share of reviewed failure mechanisms (%)',source:'RQ4 · Reviewed localization failure mechanisms',max:40,precision:1,rows:PAPER.failureMechanisms.localization.map(([name,value])=>row(name,[value],blue))}
 ];
 return ['recall','precision'].map(metric=>({label:metric==='recall'?'Recall':'Precision',unit:`Localization ${metric} (%)`,source:'Table 7 · GPT-5.6-Sol / Codex · 100 paired instances',series:[{name:'Repository-provided tests',color:baseline},{name:'Agent-authored tests',color:blue}],rows:PAPER.pairedTesting[metric].map((values,i)=>row(['File','Function','Hunk'][i],values))}));
}
let activeFinding=0;
document.getElementById('finding-tabs').innerHTML=PAPER.findings.map((f,i)=>`<button id="finding-${i}" data-finding="${i}" role="tab" aria-selected="${i===0}" aria-controls="finding-panel" tabindex="${i===0?0:-1}"><span>RQ${f.rq}</span>${PAPER.highlights[i].label}</button>`).join('');
function renderFindingChart(viewIndex){
 const view=findingViews(activeFinding)[viewIndex],max=view.max||100,series=view.series||[],precision=view.precision??2;
 const ticks=Array.from({length:5},(_,i)=>max*i/4);
 const rows=view.rows.map(r=>{
  const values=view.type==='range'?`<div class="plot-lane"><span class="plot-range" style="left:${r.min/max*100}%;width:${(r.max-r.min)/max*100}%;background:${r.color}"></span><span class="range-value">${r.min.toFixed(2)}–${r.max.toFixed(2)}%</span></div>`:r.values.map((value,i)=>`<div class="plot-lane" aria-label="${escapeHTML(r.label)}${series[i]?', '+series[i].name:''}: ${value.toFixed(precision)}%"><span class="plot-bar" style="width:${value/max*100}%;background:${r.colors?.[i]||series[i]?.color||'#1D73FF'}"></span><span class="plot-value">${value.toFixed(precision)}%</span></div>`).join('');
  return `<div class="plot-row"><span class="plot-row-label">${escapeHTML(r.label)}</span><div class="plot-lanes">${values}</div></div>`;
 }).join('');
 document.getElementById('finding-chart').innerHTML=`<p class="plot-unit">${view.unit}</p>${series.length?`<div class="plot-legend">${series.map(s=>`<span><i style="background:${s.color}"></i>${s.name}</span>`).join('')}</div>`:''}<div class="evidence-plot ${view.type==='range'?'range-plot':''}"><div class="plot-axis" aria-hidden="true">${ticks.map(n=>`<span>${n}</span>`).join('')}</div><div class="plot-rows">${rows}</div></div><p class="plot-source">${view.source}</p>`;
 animateBars(document.getElementById('finding-chart'));
}
function renderFinding(index){
 activeFinding=index;const finding=PAPER.findings[index],highlight=PAPER.highlights[index],views=findingViews(index);
 document.getElementById('finding-count').textContent=`${index+1} / ${PAPER.findings.length}`;
 const panel=document.getElementById('finding-panel');panel.setAttribute('aria-labelledby',`finding-${index}`);
 panel.innerHTML=`<p class="eyebrow">RQ${finding.rq}</p><h3>${finding.title}</h3><ul class="finding-points">${highlight.points.map(([label,value])=>`<li><strong>${label}.</strong> ${value}</li>`).join('')}</ul><div class="finding-evidence"><div class="finding-view-tabs" role="tablist" aria-label="RQ${finding.rq} chart view">${views.map((view,i)=>`<button id="finding-view-${i}" data-finding-view="${i}" role="tab" aria-controls="finding-chart" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${view.label}</button>`).join('')}</div><div id="finding-chart" role="tabpanel" aria-labelledby="finding-view-0"></div></div><a class="text-link paper-source" href="assets/paper.pdf" target="_blank" rel="noopener">Paper · RQ${finding.rq} ↗</a>`;
 renderFindingChart(0);
 wireTabs('[data-finding-view]',button=>{document.getElementById('finding-chart').setAttribute('aria-labelledby',button.id);renderFindingChart(Number(button.dataset.findingView));});
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
renderResults();renderCategories();renderRepositories();renderHistogram();renderFinding(0);renderTask('prd');renderMechanism(0);

window.addEventListener('resize',()=>requestAnimationFrame(refreshTabIndicators));
document.fonts.ready.then(refreshTabIndicators);
requestAnimationFrame(refreshTabIndicators);
