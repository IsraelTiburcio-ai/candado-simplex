export const EPS=1e-8;
export const names=['x₁','x₂','d₁⁻','d₁⁺','d₂⁻','d₂⁺','d₃⁻','d₃⁺','d₄⁻','d₄⁺','d₅⁻','d₅⁺'];
export const A=[[2,4,1,-1,0,0,0,0,0,0,0,0],[3,3,0,0,1,-1,0,0,0,0,0,0],[1,0,0,0,0,0,1,-1,0,0,0,0],[0,1,0,0,0,0,0,0,1,-1,0,0],[30,40,0,0,0,0,0,0,0,0,1,-1]];
export const b=[80,80,10,10,1200];
export const costs=[[0,0,0,1,0,1,0,0,0,0,0,0],[0,0,0,0,0,0,30,0,40,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,0]];
export function evaluate(s){return costs.map(c=>[...c.map((v,j)=>s.rows.reduce((z,r,i)=>z+c[s.base[i]]*r[j],0)-v),s.rows.reduce((z,r,i)=>z+c[s.base[i]]*r[12],0)]);}
export function initial(){const s={rows:A.map((r,i)=>[...r,b[i]]),base:[2,4,6,8,10]};s.eval=evaluate(s);return s;}
export function admissible(rows,k){return rows[k].slice(0,-1).flatMap((v,j)=>v>EPS&&rows.slice(0,k).every(r=>r[j]>=-EPS)?[j]:[]);}
export function entering(rows,k){const a=admissible(rows,k);const max=Math.max(...a.map(j=>rows[k][j]));return a.filter(j=>Math.abs(rows[k][j]-max)<EPS);}
export function advance(rows,k){return Math.abs(rows[k].at(-1))<EPS||!admissible(rows,k).length;}
export function leaving(s,j){const ratios=s.rows.map(r=>r[j]>EPS?r[12]/r[j]:Infinity);const min=Math.min(...ratios);return ratios.flatMap((v,i)=>Number.isFinite(v)&&Math.abs(v-min)<EPS?[i]:[]);}
export function pivot(s,i,j){const rows=s.rows.map(r=>[...r]);const p=rows[i][j];rows[i]=rows[i].map(v=>v/p);rows.forEach((r,h)=>{if(h!==i){const m=r[j];rows[h]=r.map((v,l)=>v-m*rows[i][l]);}});const base=[...s.base];base[i]=j;const t={rows,base};t.eval=evaluate(t);return t;}
export function trace(){const states=[initial()];let k=0;for(let n=0;n<30&&k<3;n++){const s=states.at(-1);if(advance(s.eval,k)){k++;continue;}const j=entering(s.eval,k)[0],i=leaving(s,j)[0];if(i===undefined)throw Error('Sin salida');states.push(pivot(s,i,j));}return states;}
export function fmt(v){if(Math.abs(v)<EPS)return '0';if(Math.abs(v-Math.round(v))<EPS)return String(Math.round(v)).replace('-','−');for(const d of [2,3,6])if(Math.abs(v*d-Math.round(v*d))<EPS)return `${Math.round(v*d)}/${d}`.replace('-','−');return v.toFixed(2).replace('-','−');}
