import {useState,useEffect} from 'react'
import {M} from './data'
const PT=[['Fajr','05:42'],['Sunrise','07:02'],['Dhuhr','12:48'],['Asr','16:15'],['Maghrib','18:32'],['Isha','19:52']]
const mins=t=>{const[h,m]=t.split(':');return h*60+ +m}
const f12=t=>{let[h,m]=t.split(':');const p=h>=12?'PM':'AM';return ((h%12)||12)+':'+m+' '+p}
function useNow(){const[n,s]=useState(new Date());useEffect(()=>{const i=setInterval(()=>s(new Date()),1000);return()=>clearInterval(i)},[]);return n}
function nextP(now){const c=now.getHours()*60+now.getMinutes(),p=PT.filter(x=>x[0]!=='Sunrise');let n=p.find(x=>mins(x[1])>c),d;if(!n){n=p[0];d=mins(n[1])+1440-c}else d=mins(n[1])-c;return[n,d]}
const USERS={admin:['admin','Administrator',null],imam:['demo123','Imam',['dash','events','announce','nikah','prayer','display']],treasurer:['demo123','Treasurer',['dash','donations','finance','zakat']],secretary:['demo123','Secretary',['dash','members','announce','comms','volunteers','facilities','events']],educator:['demo123','Education Officer',['dash','school','announce']],welfare:['demo123','Welfare Officer',['dash','welfare','donations']],member:['demo123','Member',['portal']]}
const badge=s=>/Active|Paid|Approved|Confirmed|Sent|Income|Complete/.test(s)?'ok':/Pending|Review|Scheduled|Draft|Incomplete/.test(s)?'warn':/Expense|Overdue/.test(s)?'bad':'mute'

function Login({on}){const[show,ss2]=useState(false);const[u,su]=useState(''),[p,sp]=useState(''),[e,se]=useState('')
const go=ev=>{ev.preventDefault();const k=u.trim().toLowerCase();if(USERS[k]&&USERS[k][0]===p){localStorage.setItem('auth',k);on(k)}else se('Wrong username or password. Check the demo accounts below.')}
return <div className="login"><div className="lhero"><div><h1>One mosque.<br/>One platform.<br/>Complete control.</h1><p>Members, donations, finance, events, education, welfare and communication — built for Nigerian mosques.</p></div><q>And establish prayer and give zakat… <small>Qur'an 2:43</small></q></div>
<form className="lform" onSubmit={go}><div className="logo big">🕌 Masjid Management System</div><h2>Assalamu Alaikum</h2><p className="sub">Sign in to your admin dashboard</p>
<label>Username<input value={u} onChange={x=>su(x.target.value)} autoFocus/></label><label>Password<input type="password" value={p} onChange={x=>sp(x.target.value)}/></label>
{e&&<div className="err">{e}</div>}<button className="btn">Sign in</button><button type="button" className="ghost" onClick={()=>ss2(!show)}>{show?'Hide':'Show'} demo accounts</button>{show&&<div className="acc"><b>admin</b> / admin — full access{Object.entries(USERS).slice(1).map(([k,v])=><span key={k}><b>{k}</b> / demo123 — {v[1]}</span>)}</div>}</form></div>}

function Stat({l,v,c}){return <div className="card stat"><span className="sl">{l}</span><b>{v}</b>{c&&<em>▲ {c} vs last month</em>}</div>}

function Dashboard({go,u}){const now=useNow(),[n,d]=nextP(now),bars=[4.2,5.1,4.8,6.3,7.9,6.1,8.4,9.2,8.1,10.6,11.3,12.5]
return <>
<div className="hero"><div><h1>Assalamu Alaikum, {u[1]}</h1><p>Here is how your mosque is doing today.</p></div>
<div className="next"><small>Next prayer</small><b>{n[0]} · {f12(n[1])}</b><span>in {Math.floor(d/60)}h {d%60}m</span></div></div>
<div className="grid4"><Stat l="Total Members" v="1,248" c="12%"/><Stat l="Daily Prayers" v="342" c="8%"/><Stat l="Upcoming Events" v="5" c="25%"/><Stat l="Donations (Month)" v="₦12,480,000" c="22%"/></div>
<div className="grid2"><div className="card"><h3>Donations, last 12 months <small>₦ millions</small></h3>
<svg viewBox="0 0 360 140" className="chart">{bars.map((b,i)=><g key={i}><rect x={i*30+6} y={125-b*9} width="20" height={b*9} rx="4" fill={i===11?'#0f7a4f':'#bfe3d2'}/><text x={i*30+16} y="138" fontSize="8" textAnchor="middle" fill="#6b7f77">{'JFMAMJJASOND'[i]}</text></g>)}</svg></div>
<div className="card"><h3>Prayer times <small>Today</small></h3>{PT.map(([a,b])=><div className={'row '+(a===n[0]?'hl':'')} key={a}><span>{a}</span><b>{f12(b)}</b></div>)}</div></div>
<div className="grid2"><div className="card"><h3>Smart insights ✨</h3><ul className="ins"><li>Zakat giving is up <b>22%</b> — send a thank-you broadcast to 118 donors.</li><li><b>14 members</b> have not renewed this quarter. Send a WhatsApp reminder.</li><li>Main Hall is booked 3 of the next 4 Saturdays.</li><li>Ramadan is approaching: publish the timetable to the display and website.</li></ul></div>
<div className="card"><h3>Quick actions</h3><div className="qa">{[['Add member','members'],['Record donation','donations'],['Schedule event','events'],['Send broadcast','comms'],['Book facility','facilities'],['Open display','display']].filter(x=>!u[2]||u[2].includes(x[1])).map(([a,k])=><button key={k} onClick={()=>go(k)}>{a}</button>)}</div></div></div></>}

function Module({k}){const m=M[k],[rows,setR]=useState(m.rows),[q,sq]=useState(''),[open,so]=useState(false),[v,sv]=useState({})
const add=e=>{e.preventDefault();setR([m.cols.map(c=>v[c]||'—'),...rows]);sv({});so(false)}
const shown=rows.filter(r=>r.join(' ').toLowerCase().includes(q.toLowerCase()))
return <><div className="head"><div><h1>{m.i} {m.t}</h1><p>{m.d}</p></div><button className="btn sm" onClick={()=>so(!open)}>{open?'Cancel':'+ Add new'}</button></div>
<div className="grid4">{m.stats.map(([a,b])=><Stat key={a} l={a} v={b}/>)}</div>
{open&&<form className="card addf" onSubmit={add}>{m.cols.map(c=><input key={c} placeholder={c} value={v[c]||''} onChange={x=>sv({...v,[c]:x.target.value})}/>)}<button className="btn sm">Save record</button></form>}
<div className="card"><div className="tools"><input placeholder={'Search '+m.t.toLowerCase()+'…'} value={q} onChange={e=>sq(e.target.value)}/><button className="ghost" onClick={()=>alert('Demo: export to Excel / PDF')}>Export</button></div>
<div className="tw"><table><thead><tr>{m.cols.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{shown.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{j===m.cols.length-1?<span className={'b '+badge(c)}>{c}</span>:c}</td>)}</tr>)}</tbody></table>{!shown.length&&<p className="empty">No records match. Clear the search or add a new record.</p>}</div></div></>}

function Prayer(){const now=useNow(),[n,d]=nextP(now);return <><div className="head"><div><h1>🕌 Prayer Times</h1><p>Daily schedule, Jumu'ah and Ramadan timetables</p></div></div>
<div className="hero"><div><h1>{n[0]} in {Math.floor(d/60)}h {d%60}m</h1><p>Jumu'ah: Khutbah 1:00 PM · Iqamah 1:30 PM · Main Masjid</p></div><div className="next"><b style={{fontSize:28}}>{now.toLocaleTimeString()}</b></div></div>
<div className="card">{PT.map(([a,b])=><div className={'row big '+(a===n[0]?'hl':'')} key={a}><span>{a}</span><b>{f12(b)}</b></div>)}</div></>}

function Display(){const now=useNow(),[n,d]=nextP(now),a=['Jumu\'ah Khutbah today at 1:00 PM','Qur\'an Tafsir class Tuesday 6:30 PM — Education Hall','Charity Drive this Saturday — volunteers welcome'],[i,si]=useState(0)
useEffect(()=>{const t=setInterval(()=>si(x=>(x+1)%3),4000);return()=>clearInterval(t)},[])
return <div className="tv"><div className="tvt"><h2>Masjid Al-Noor</h2><div className="clock">{now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div></div>
<div className="tvg">{PT.map(([x,y])=><div key={x} className={'tvc '+(x===n[0]?'on':'')}><small>{x}</small><b>{f12(y)}</b></div>)}</div>
<p className="tvn">Next: {n[0]} in {Math.floor(d/60)}h {d%60}m</p><div className="tick">📢 {a[i]}</div><p className="tvh">Live preview of the mosque TV display — updates automatically</p></div>}

function Zakat(){const[s,ss]=useState({cash:'',gold:'',biz:'',debt:'',nisab:'5000000'}),g=k=>+s[k]||0,net=g('cash')+g('gold')+g('biz')-g('debt'),due=net>=g('nisab')?net*.025:0
return <><div className="head"><div><h1>🧮 Zakat Calculator</h1><p>Help donors work out zakat and pay straight into the Zakat fund</p></div></div>
<div className="card addf col">{[['cash','Cash & savings (₦)'],['gold','Gold & silver value (₦)'],['biz','Business assets (₦)'],['debt','Debts owed (₦)'],['nisab','Nisab threshold (₦, editable)']].map(([k,l])=><label key={k}>{l}<input type="number" value={s[k]} onChange={e=>ss({...s,[k]:e.target.value})}/></label>)}
<div className="res">Zakat due<b>₦{due.toLocaleString(undefined,{maximumFractionDigits:0})}</b><small>{net>=g('nisab')?'2.5% of net zakatable wealth':'Below nisab — no zakat due'}</small></div><button className="btn sm" onClick={()=>alert('Demo: payment via Paystack / Flutterwave')}>Pay to Zakat Fund</button></div></>}

const NAV=[['dash','🏠','Dashboard'],['members'],['donations'],['finance'],['events'],['school'],['prayer','🕌','Prayer Times'],['announce'],['comms'],['volunteers'],['welfare'],['facilities'],['nikah'],['zakat','🧮','Zakat Calculator'],['display','📺','Digital Display'],['roles']]
export default function App(){const[auth,sa]=useState(USERS[localStorage.getItem('auth')]?localStorage.getItem('auth'):null),[p,sp]=useState('dash'),[nav,sn]=useState(false)
if(!auth)return <Login on={k=>{sp('dash');sa(k)}}/>
if(auth==='member')return <Portal out={()=>{localStorage.removeItem('auth');sa(null)}}/>
const U=USERS[auth],NV=NAV.filter(n=>!U[2]||U[2].includes(n[0])),go=k=>{sp(k);sn(false)}
const page=p==='dash'?<Dashboard go={go} u={U}/>:p==='prayer'?<Prayer/>:p==='display'?<Display/>:p==='zakat'?<Zakat/>:<Module key={p} k={p}/>
return <div className="app"><aside className={nav?'open':''}><div className="logo">🕌 Masjid Management System</div><nav>{NV.map(([k,i,t])=><button key={k} className={p===k?'on':''} onClick={()=>go(k)}><span>{i||M[k].i}</span>{t||M[k].t}</button>)}</nav><q>"And establish prayer and give zakat…" <small>Quran 2:43</small></q></aside>
<main><header><button className="burger" onClick={()=>sn(!nav)}>☰</button><input placeholder="Search members, events, or anything…"/><span className="bell">🔔<i>3</i></span><button className="ghost" onClick={()=>{localStorage.removeItem('auth');sa(false)}}>{U[1]} · Log out</button></header><section>{page}</section></main></div>}

function Portal({out}){const[t,st]=useState('Home'),now=useNow(),[n,d]=nextP(now),[fund,sf]=useState('Sadaqah'),[amt,sa]=useState(5000),[toast,stt]=useState(''),
[rc,sr]=useState([['RC-2025-0412','Zakat','₦100,000','Oct 12, 2025'],['RC-2025-0377','Sadaqah','₦20,000','Sep 26, 2025'],['RC-2025-0301','Mosque Development','₦50,000','Aug 30, 2025'],['RC-2025-0215','Education','₦15,000','Jul 11, 2025']]),
[rsvp,sv]=useState({}),ev=[['Jumu\'ah Khutbah','Oct 25 · 1:00 PM','Main Masjid'],['Qur\'an Tafsir Class','Oct 28 · 6:30 PM','Education Hall'],['Youth Circle','Nov 02 · 5:00 PM','Conference Room'],['Charity Drive','Nov 08 · 9:00 AM','Masjid Compound']],
an=[['Jumu\'ah time change','Khutbah now starts 1:00 PM · Oct 22'],['Ramadan timetable published','View it on the mosque display and website'],['Charity Drive volunteers needed','Register with the Secretary']]
const pay=()=>{sr([['RC-2025-'+(430+rc.length),fund,'₦'+(+amt).toLocaleString(),'Oct 24, 2025'],...rc]);stt('JazakAllahu khairan! ₦'+(+amt).toLocaleString()+' received for '+fund+'. Receipt added.');setTimeout(()=>stt(''),4000);st('Receipts')}
return <div className="portal"><header className="ph"><div className="logo" style={{padding:0,color:'#fff'}}>🕌 Masjid Al-Noor · Member Portal</div><button className="ghost" onClick={out}>Aminu Danjuma · Log out</button></header>
<div className="tabs">{['Home','Donate','Receipts','Events','Profile'].map(x=><button key={x} className={t===x?'on':''} onClick={()=>st(x)}>{x}</button>)}</div>
<div className="pbody">{toast&&<div className="toast">{toast}</div>}
{t==='Home'&&<><div className="hero"><div><h1>Assalamu Alaikum, Aminu</h1><p>Member ID MS-00482 · Member since 2019</p></div><div className="next"><small>Next prayer</small><b>{n[0]} · {f12(n[1])}</b><span>in {Math.floor(d/60)}h {d%60}m</span></div></div>
<div className="grid4"><Stat l="Given this year" v="₦185,000"/><Stat l="Receipts" v={rc.length}/><Stat l="Events attended" v="14"/><Stat l="Family members" v="4"/></div>
<div className="grid2"><div className="card"><h3>Announcements</h3>{an.map(([a,b])=><div className="row" key={a}><span><b>{a}</b><br/><small>{b}</small></span></div>)}</div><div className="card"><h3>Prayer times</h3>{PT.map(([a,b])=><div className={'row '+(a===n[0]?'hl':'')} key={a}><span>{a}</span><b>{f12(b)}</b></div>)}</div></div></>}
{t==='Donate'&&<div className="card addf col"><h3>Give securely</h3><label>Fund<select value={fund} onChange={e=>sf(e.target.value)}>{['Zakat','Sadaqah','Waqf','Mosque Development','Education','Community Support'].map(x=><option key={x}>{x}</option>)}</select></label>
<div className="qa">{[1000,5000,10000,50000].map(x=><button key={x} onClick={()=>sa(x)} style={amt===x?{background:'var(--g)',color:'#fff'}:{}}>₦{x.toLocaleString()}</button>)}</div>
<label>Or enter amount (₦)<input type="number" value={amt} onChange={e=>sa(e.target.value)}/></label><button className="btn" onClick={pay}>Pay ₦{(+amt||0).toLocaleString()} with card / transfer</button><small className="hint">Demo only. Production uses Paystack or Flutterwave.</small></div>}
{t==='Receipts'&&<div className="card"><h3>My donation receipts</h3><div className="tw"><table><thead><tr>{['Receipt','Fund','Amount','Date',''].map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{rc.map(r=><tr key={r[0]}>{r.map((c,j)=><td key={j}>{c}</td>)}<td><button className="ghost" onClick={()=>alert('Demo: PDF receipt '+r[0])}>Download</button></td></tr>)}</tbody></table></div></div>}
{t==='Events'&&<div className="card"><h3>Upcoming events</h3>{ev.map(([a,b,c])=><div className="row" key={a}><span><b>{a}</b><br/><small>{b} · {c}</small></span><button className={rsvp[a]?'btn sm':'ghost'} onClick={()=>sv({...rsvp,[a]:!rsvp[a]})}>{rsvp[a]?'Going ✓':'RSVP'}</button></div>)}</div>}
{t==='Profile'&&<div className="grid2"><div className="card"><h3>My details</h3>{[['Name','Aminu Danjuma'],['Phone','0803 555 0182'],['Group','Adult'],['Address','Wuse II, Abuja'],['Status','Active']].map(([a,b])=><div className="row" key={a}><span>{a}</span><b>{b}</b></div>)}</div><div className="card"><h3>Family</h3>{[['Hauwa Danjuma','Spouse'],['Ibrahim Danjuma','Son · Qur\'an School'],['Maryam Danjuma','Daughter · Islamiyyah'],['Khadija Danjuma','Daughter']].map(([a,b])=><div className="row" key={a}><span>{a}</span><small>{b}</small></div>)}</div></div>}
</div></div>}
