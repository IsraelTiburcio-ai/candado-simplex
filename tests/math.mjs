import assert from 'node:assert/strict';
import {A,b,costs,entering,admissible,advance,leaving,pivot,EPS} from '../src/math.js';
import {bank,states,makeGame} from '../src/data.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<EPS,`${a} ≠ ${b}`);
// Independently invert each original basis: no reuse of the game's pivot routine.
function inverse(m){const n=m.length,t=m.map((r,i)=>[...r,...r.map((_,j)=>+(i===j))]);for(let j=0;j<n;j++){const i=t.findIndex((r,h)=>h>=j&&Math.abs(r[j])>EPS);assert.ok(i>=0);[t[i],t[j]]=[t[j],t[i]];const v=t[j][j];t[j]=t[j].map(x=>x/v);for(let h=0;h<n;h++)if(h!==j){const q=t[h][j];t[h]=t[h].map((x,k)=>x-q*t[j][k]);}}return t.map(r=>r.slice(n));}
for(const s of states){const inv=inverse(A.map(r=>s.base.map(j=>r[j])));const expected=inv.map(r=>Array.from({length:13},(_,j)=>r.reduce((z,v,i)=>z+v*(j===12?b[i]:A[i][j]),0)));expected.forEach((r,i)=>r.forEach((v,j)=>near(v,s.rows[i][j])));assert.ok(s.rows.every(r=>r[12]>=-EPS));for(let k=0;k<3;k++)for(let j=0;j<13;j++){const z=expected.reduce((sum,r,i)=>sum+costs[k][s.base[i]]*r[j],0)-(j===12?0:costs[k][j]);near(z,s.eval[k][j]);}}
near(states.at(-1).rows[2][12],40/3);near(states.at(-1).rows[3][12],40/3);near(states.at(-1).eval[2][12],800/3);assert.equal(states.length,5);
assert.equal(bank.length,20);assert.equal(new Set(bank.map(s=>s.id)).size,20);
for(const s of bank){assert.ok(s.answer.length,s.id);assert.ok(s.why&&s.rule&&s.admissible);assert.ok(s.cols.length<=3);assert.equal(s.eval.length,3);if(!s.conceptual){s.indices.forEach((j,h)=>s.eval.forEach((r,k)=>near(r[h],s.state.eval[k][j])));}
if(s.type==='B'){assert.deepEqual(s.answer,entering(s.eval,s.k).map(j=>`c${j}`));assert.ok(!advance(s.eval,s.k));}
if(s.type==='C'){const expected=s.cols.flatMap((_,j)=>s.eval[s.k][j]>EPS&&s.eval.slice(0,s.k).some(r=>r[j]<-EPS)?[`c${j}`]:[]);assert.deepEqual(s.answer,expected);}
if(s.type==='D'){assert.ok(entering(s.state.eval,s.k).includes(s.entry));assert.deepEqual(s.answer,leaving(s.state,s.entry).map(i=>`r${i}`));const next=pivot(s.state,Number(s.answer[0].slice(1)),s.entry);assert.ok(next.rows.every(r=>r[12]>=-EPS));for(let h=0;h<s.k;h++)near(next.eval[h][12],s.state.eval[h][12]);}
if(s.type==='E'){assert.deepEqual(s.answer,[advance(s.state.eval,s.k)?s.k===2?'end':`p${s.k+1}`:`p${s.k}`]);}
}
assert.deepEqual(entering([[0,-2,0,0],[4,5,-1,12],[0,0,0,0]],1),[0]);
assert.deepEqual(entering([[0,0,-1,0],[3,3,8,12]],1),[0,1]);
assert.deepEqual(leaving({rows:[[0,12],[-1,4],[2,8],[3,12]].map(r=>[r[0],...Array(11).fill(0),r[1]])},0),[2,3]);
for(let i=0;i<4;i++){assert.deepEqual(makeGame(()=>i/4).map(s=>s.type),['A','B','C','D','E']);}
console.log('PASS · 20 escenarios; 5 bases reconstruidas independientemente; signos, empates, protección, razones y avance.');
