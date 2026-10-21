import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir,writeFile } from 'node:fs/promises';
import { makeGame,bank } from '../src/data.js';
const server=spawn('python3',['-m','http.server','4289'],{stdio:'ignore'});
const base=process.env.QA_URL||'http://localhost:4289';
await mkdir('test-results',{recursive:true});
for(let n=0;n<30;n++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
const browser=await chromium.launch();
const sizes=[[375,812],[390,844],[820,1180],[1180,820],[1440,900]];
const results=[];
try{
await Promise.all(sizes.map(async([width,height],run)=>{
 const context=await browser.newContext({viewport:{width,height},hasTouch:run<4,isMobile:run<2,reducedMotion:run===3?'reduce':'no-preference'});
 await context.addInitScript(value=>{Math.random=()=>value;},run%4/4);
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.locator('#start').waitFor();await page.locator('#sound').click();assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');
 let violations=(await new AxeBuilder({page}).analyze()).violations;assert.deepEqual(violations,[],`${width} home accessibility: ${JSON.stringify(violations)}`);
 await page.locator('#start').focus();await page.keyboard.press('Enter');
 const expected=makeGame(()=>run%4/4);
 for(let round=0;round<5;round++){
  const s=expected[round];await page.locator('.matrix').waitFor();assert.equal(await page.locator('.matrix tbody tr.priority').count(),3);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} overflow round ${round}`);
  const buttons=page.locator('.matrix button');for(const b of await buttons.all()){const box=await b.boundingBox();assert.ok(box.width>=44&&box.height>=44,`${width} small target ${JSON.stringify(box)}`);}
  if(round===0||round===3){violations=(await new AxeBuilder({page}).analyze()).violations;assert.deepEqual(violations,[],`${width} round ${round}: ${JSON.stringify(violations)}`);}
  if(round===2){const wrong=s.cols.findIndex((_,j)=>!s.answer.includes(`c${j}`));await page.locator(`[data-choice="c${wrong}"]`).first().click();await page.locator('.feedback.error').waitFor();assert.equal(await page.locator('#next').isVisible(),false);}
  if(round===1&&run===0){await page.locator('[data-choice="c1"]').first().tap();await page.locator('.alarm').waitFor();}
  await page.screenshot({path:`test-results/${width}-${height}-round-${round+1}.png`,fullPage:true});
  // A real 14-second reading/decision window, not a mocked timer.
  await page.waitForTimeout(14000);
  const choice=page.locator(`[data-choice="${s.answer[0]}"]`).first();if(run===4){await choice.focus();await page.keyboard.press('Space');}else await choice.tap();
  await page.locator('.feedback.success').waitFor();assert.equal(await page.locator('#next').isVisible(),true);
  await page.locator('#next').click();
 }
 await page.locator('#replay').waitFor();assert.ok((await page.locator('.results').innerText()).includes('5/5'));assert.ok((await page.locator('.results').innerText()).includes('60%')||run!==0);const summary=await page.locator('.results').innerText();
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 violations=(await new AxeBuilder({page}).analyze()).violations;assert.deepEqual(violations,[]);
 await page.screenshot({path:`test-results/${width}-${height}-final.png`,fullPage:true});
 await page.locator('#replay').click();await page.locator('.matrix').waitFor();assert.ok((await page.locator('.game-head').innerText()).includes('01 / 05'));
 await page.locator('#sound').click();assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'false');assert.deepEqual(errors,[]);
 results.push({viewport:`${width}×${height}`,scenarios:expected.map(s=>s.id),summary,axe:'0 violations',overflow:false,keyboard:run===4?'Space + Enter':'Enter start',touch:run<4,replay:'PASS',audioToggle:'PASS',reducedMotion:run===3,errors});await context.close();
}));
// Every stored answer, including all tied answers, must be present in its rendered table.
const {table}=await import('../src/ui.js');for(const s of bank)for(const a of s.answer)assert.ok(table(s).includes(`data-choice="${a}"`),`${s.id} missing ${a}`);
await writeFile('test-results/report.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();server.kill();}
