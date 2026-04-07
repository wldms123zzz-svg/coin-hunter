import React from 'react';
import MoneyArchiveDashboard from './MoneyArchiveDashboard.jsx';

function App() {
return (
<div className="App">
<MoneyArchiveDashboard />
</div>
);
}

export default App;

2. src/MoneyArchiveDashboard.jsx (최종 완성본)
아래 코드를 전체 복사하여 덮어씌우십시오. doShare 함수를 실제 버튼에 연결하여 unused-vars 에러를 해결했습니다.

import { useState, useRef } from "react";

const COINS = [
{ id:"c1", year:1998, denom:500, grade:"전설", gradeColor:"#FF8A65", price:5000000,
pastel:"#FFF9C4", pastelDark:"#FBC02D", icon:"🌟", iconBack:"🦅" },
{ id:"c2", year:1966, denom:10,  grade:"희귀", gradeColor:"#9575CD", price:1000000,
pastel:"#FFF9C4", pastelDark:"#FBC02D", icon:"🏛️", iconBack:"🕊️" },
{ id:"c3", year:1970, denom:100, grade:"레어", gradeColor:"#5C9BF5", price:150000,
pastel:"#FFF9C4", pastelDark:"#FBC02D", icon:"⚓", iconBack:"🌊" },
{ id:"c4", year:1982, denom:500, grade:"레어", gradeColor:"#5C9BF5", price:80000,
pastel:"#FFF9C4", pastelDark:"#FBC02D", icon:"🌿", iconBack:"🍃" },
{ id:"c5", year:2006, denom:10,  grade:"일반", gradeColor:"#90A4AE", price:5000,
pastel:"#FFF9C4", pastelDark:"#FBC02D", icon:"⭕", iconBack:"◯"  },
{ id:"c6", year:1983, denom:50,  grade:"레어", gradeColor:"#5C9BF5", price:30000,
pastel:"#FFF9C4", pastelDark:"#FBC02D", icon:"🌸", iconBack:"🌺" },
{ id:"c7", year:1991, denom:100, grade:"레어", gradeColor:"#5C9BF5", price:25000,
pastel:"#FFF9C4", pastelDark:"#FBC02D", icon:"🎋", iconBack:"🎍" },
{ id:"c8", year:2001, denom:500, grade:"일반", gradeColor:"#90A4AE", price:3000,
pastel:"#FFF9C4", pastelDark:"#FBC02D", icon:"⭕", iconBack:"◯"  },
];

const RARE_DB = { 1998: COINS[0], 1966: COINS[1], 1970: COINS[2] };
const COMMON_YRS = [2015, 2018, 2020, 2021, 2022, 2023];
const mockOCR = () => Math.random() < 0.15
? [1998,1966,1970][Math.floor(Math.random()*3)]
: COMMON_YRS[Math.floor(Math.random()*COMMON_YRS.length)];

const USER_NAME = "사용자";

const doShare = async (isSuccess) => {
const text = isSuccess
? ${USER_NAME}님이 행운의 동전을 찾았어요!
: 지갑에 있는 가능성들을 확인해보시겠어요?;
try {
if (navigator.share) await navigator.share({ title:"화폐 아카이브", text, url: window.location.href });
else { await navigator.clipboard.writeText(text); alert("복사되었어요!"); }
} catch(_){}
};

const PastelFront = ({ coin, size }) => (
<svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialGradient id={pf${coin.id}} cx="40%" cy="35%" r="65%">
<stop offset="0%" stopColor="#FFE44D" stopOpacity="0.95"/>
<stop offset="100%" stopColor="#FFB800" stopOpacity="1"/>
</radialGradient>
</defs>
<circle cx="100" cy="100" r="96" fill={coin.pastelDark} opacity="0.45"/>
<circle cx="100" cy="100" r="88" fill={url(#pf${coin.id})}/>
<circle cx="100" cy="100" r="88" fill="none" stroke={coin.pastelDark} strokeWidth="2.5" opacity="0.6"/>
<circle cx="100" cy="100" r="74" fill="none" stroke={coin.pastelDark} strokeWidth="1.5" opacity="0.35"/>
<text x="100" y="105" textAnchor="middle" fontSize="60" dominantBaseline="middle">{coin.icon}</text>
</svg>
);

const PastelBack = ({ coin, size }) => (
<svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialGradient id={pb${coin.id}} cx="60%" cy="35%" r="65%">
<stop offset="0%" stopColor="#FFE44D" stopOpacity="0.95"/>
<stop offset="100%" stopColor="#FFB800" stopOpacity="1"/>
</radialGradient>
</defs>
<circle cx="100" cy="100" r="96" fill={coin.pastelDark} opacity="0.45"/>
<circle cx="100" cy="100" r="88" fill={url(#pb${coin.id})}/>
<circle cx="100" cy="100" r="88" fill="none" stroke={coin.pastelDark} strokeWidth="2.5" opacity="0.6"/>
<circle cx="100" cy="100" r="74" fill="none" stroke={coin.pastelDark} strokeWidth="1.5" opacity="0.35"/>
<text x="100" y="105" textAnchor="middle" fontSize="64" dominantBaseline="middle">{coin.iconBack}</text>
<text x="100" y="162" textAnchor="middle" fontSize="16" fontWeight="700" letterSpacing="2" fill={coin.gradeColor} opacity="0.5">{coin.year}</text>
</svg>
);

const PastelCoin3D = ({ coin, size = 160, spinning = true }) => (

<div style={{ width:size, height:size, perspective: size*5 }}>
<div style={{
width:"100%", height:"100%", position:"relative",
transformStyle:"preserve-3d",
animation: spinning ? "coinSpin 5s linear infinite" : "none",
}}>
<div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden" }}>
<PastelFront coin={coin} size={size}/>
</div>
<div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", transform:"rotateY(180deg)" }}>
<PastelBack coin={coin} size={size}/>
</div>
</div>
</div>
);

const MiniCoin = ({ coin, size=52, isFound=false }) => (

<div style={{
width:size, height:size, borderRadius:"50%", background:coin.pastelDark,
opacity: isFound ? 1 : 0.5,
display:"flex", alignItems:"center", justifyContent:"center",
boxShadow:"0 4px 12px rgba(0,0,0,0.07)", flexShrink:0
}}>
<div style={{ width:size0.82, height:size0.82, borderRadius:"50%", background:coin.pastel,
display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
<span style={{ fontSize:size0.3 }}>{coin.icon}</span>
<span style={{ fontSize:size0.22, fontWeight:900, color:coin.gradeColor, lineHeight:1 }}>{coin.denom}</span>
</div>
</div>
);

const Badge = ({ label, color }) => (
<span style={{ padding:"2px 8px", borderRadius:99, fontSize:10, fontWeight:700, color:"#fff", background:color }}>
{label}
</span>
);

const GridCoin = ({ coin, found }) => (

<div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"12px 4px",
opacity: found ? 1 : 0.28, filter: found ? "none" : "grayscale(1)" }}>
<MiniCoin coin={coin} size={52} isFound={found}/>
<div style={{ textAlign:"center" }}>
<div style={{ fontSize:11, fontWeight:700, color:"#191F28" }}>{coin.year}년</div>
<div style={{ fontSize:10, color:"#8B95A1" }}>{coin.denom}원</div>
</div>
{found ? <Badge label={coin.grade} color={coin.gradeColor}/> : <span style={{ fontSize:13 }}>🔒</span>}
</div>
);

export default function MoneyArchiveDashboard() {
const [scanning, setScanning] = useState(false);
const [scanResult, setScanResult] = useState(null);
const [foundIds, setFoundIds] = useState([]);
const fileRef = useRef(null);

const handleScan = async (e) => {
const file = e.target.files?.[0];
if (!file) return;
setScanning(true);
await new Promise(r => setTimeout(r, 1600));
const year = mockOCR();
const coin = RARE_DB[year] || null;
const result = coin ? { isRare:true, coin, year } : { isRare:false, coin:null, year };
setScanning(false); setScanResult(result);
if (result.isRare) setFoundIds(p => p.includes(coin.id) ? p : [...p, coin.id]);
e.target.value = "";
};

return (
<div style={{ maxWidth:390, margin:"0 auto", minHeight:"100vh", background:"#F7F8FA", paddingBottom:104 }}>
<div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px 10px" }}>
<div style={{ width:36 }}/>
<span style={{ fontSize:17, fontWeight:700, color:"#191F28" }}>희귀 동전 찾기</span>
<button style={{ width:36, height:36, borderRadius:"50%", background:"rgba(0,0,0,0.05)", border:"none" }}>✕</button>
</div>

  <div style={{ margin:"6px 16px 14px", background:"#fff", borderRadius:24, padding:"36px 24px 28px", display:"flex", flexDirection:"column", alignItems:"center", gap:22 }}>
    <PastelCoin3D coin={COINS[0]} size={164} spinning/>
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:26, fontWeight:900, color:"#3182F6", letterSpacing:-1, lineHeight:1.2, marginBottom:8 }}>
        지갑 속에 오백만원이?
      </div>
      <div style={{ fontSize:14, color:"#8B95A1", lineHeight:1.7 }}>
        단 <strong>8,000개</strong>만 발행된 전설의 동전<br/>
        지금 내 지갑에 있을 수도 있어요
      </div>
    </div>
    <div style={{ background:"#F7F8FA", borderRadius:99, padding:"9px 22px", display:"flex", alignItems:"center", gap:6 }}>
      <span style={{ fontSize:13, color:"#8B95A1" }}>내 컬렉션</span>
      <span style={{ fontSize:14, fontWeight:900 }}>{foundIds.length}</span>
      <span style={{ fontSize:13, color:"#D1D6DB" }}>/</span>
      <span style={{ fontSize:13, color:"#8B95A1" }}>{COINS.length}개 아이템 해제하기</span>
    </div>
  </div>

  <div style={{ margin:"0 16px 14px", background:"#fff", borderRadius:24, padding:"22px 20px" }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
      <span style={{ fontSize:15, fontWeight:800 }}>희귀 동전 컬렉션</span>
      <span style={{ fontSize:12, color:"#B0B8C1" }}>스캔으로 아이템 해제</span>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
      {COINS.map(coin => <GridCoin key={coin.id} coin={coin} found={foundIds.includes(coin.id)}/>)}
    </div>
  </div>

  <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={handleScan}/>
  <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:390, padding:"12px 16px 34px", background:"linear-gradient(transparent, #F7F8FA 38%)" }}>
    <button onClick={() => !scanning && fileRef.current?.click()} style={{ width:"100%", height:56, borderRadius:16, background: scanning ? "#D1D6DB" : "#3182F6", border:"none", color:"#fff", fontSize:16, fontWeight:700 }}>
      {scanning ? "스캔 중..." : "아이템 해제"}
    </button>
  </div>

  {scanResult && (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={() => setScanResult(null)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }}/>
      <div style={{ position:"relative", width:"100%", maxWidth:390, background:"#fff", borderRadius:"24px 24px 0 0", padding:"30px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          {scanResult.isRare ? "🎉 희귀 동전 발견!" : "평범한 동전이에요"}
          <div style={{ fontSize:22, fontWeight:900, marginTop:10 }}>{scanResult.year}년 동전</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={() => doShare(scanResult.isRare)} style={{ width:"100%", height:56, borderRadius:16, background:"#F2F4F6", border:"none", color:"#4E5968", fontWeight:700 }}>
            친구에게 공유하기
          </button>
          <button onClick={() => setScanResult(null)} style={{ width:"100%", height:56, borderRadius:16, background:"#191F28", color:"#fff", border:"none", fontWeight:700 }}>
            {scanResult.isRare ? "컬렉션에 추가" : "다시 시도"}
          </button>
        </div>
      </div>
    </div>
  )}

  <style>{`
    @keyframes coinSpin { from{transform:rotateY(0deg)} to{transform:rotateY(360deg)} }
  `}</style>
</div>
);
}
