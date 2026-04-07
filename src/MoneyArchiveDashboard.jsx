import React, { useState, useRef, useEffect } from "react";
import { Button } from '@toss/tds-mobile';
import { colors } from '@toss/tds-colors';

// ─── Toss Bridge Safety Layer ────────────────────────────────────────────────
const TossBridge = {
  share: async (params) => {
    try {
      if (typeof window !== 'undefined' && window.toss && window.toss.showShareSheet) {
        return await window.toss.showShareSheet(params);
      }
      if (navigator.share) {
        return await navigator.share({
          title: params.title || "화폐 아카이브",
          text: params.message,
          url: params.url
        });
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(params.message);
        alert("링크가 복사되었습니다.");
      }
    } catch (e) {
      console.error("Bridge Error:", e);
    }
  },
  onClose: () => {
    if (typeof window !== 'undefined' && window.toss && window.toss.close) {
      window.toss.close();
    }
  }
};

// ─── DB ───────────────────────────────────────────────────────────────────────
const GOLD_COLORS = {
  pastel: "#FFF9C4",
  pastelDark: "#FBC02D",
  gradeGold: "#9A7B00"
};

const COINS = [
  { id:"c1", year:1998, denom:500, grade:"전설", gradeColor:"#FF8A65", price:5000000,
    pastel: GOLD_COLORS.pastel, pastelDark: GOLD_COLORS.pastelDark, icon:"🌟", iconBack:"🦅" },
  { id:"c2", year:1966, denom:10,  grade:"희귀", gradeColor:"#9575CD", price:1000000,
    pastel: GOLD_COLORS.pastel, pastelDark: GOLD_COLORS.pastelDark, icon:"🏛️", iconBack:"🕊️" },
  { id:"c3", year:1970, denom:100, grade:"레어", gradeColor:"#5C9BF5", price:150000,
    pastel: GOLD_COLORS.pastel, pastelDark: GOLD_COLORS.pastelDark, icon:"⚓", iconBack:"🌊" },
  { id:"c4", year:1982, denom:500, grade:"레어", gradeColor:"#5C9BF5", price:80000,
    pastel: GOLD_COLORS.pastel, pastelDark: GOLD_COLORS.pastelDark, icon:"🌿", iconBack:"🍃" },
  { id:"c5", year:2006, denom:10,  grade:"일반", gradeColor:"#90A4AE", price:5000,
    pastel: GOLD_COLORS.pastel, pastelDark: GOLD_COLORS.pastelDark, icon:"⭕", iconBack:"◯"  },
  { id:"c6", year:1983, denom:50,  grade:"레어", gradeColor:"#5C9BF5", price:30000,
    pastel: GOLD_COLORS.pastel, pastelDark: GOLD_COLORS.pastelDark, icon:"🌸", iconBack:"🌺" },
  { id:"c7", year:1991, denom:100, grade:"레어", gradeColor:"#5C9BF5", price:25000,
    pastel: GOLD_COLORS.pastel, pastelDark: GOLD_COLORS.pastelDark, icon:"🎋", iconBack:"🎍" },
  { id:"c8", year:2001, denom:500, grade:"일반", gradeColor:"#90A4AE", price:3000,
    pastel: GOLD_COLORS.pastel, pastelDark: GOLD_COLORS.pastelDark, icon:"⭕", iconBack:"◯"  },
];

const RARE_DB    = { 1998: COINS[0], 1966: COINS[1], 1970: COINS[2] };
const COMMON_YRS = [2015, 2018, 2020, 2021, 2022, 2023];
const mockOCR    = () => Math.random() < 0.15
  ? [1998,1966,1970][Math.floor(Math.random()*3)]
  : COMMON_YRS[Math.floor(Math.random()*COMMON_YRS.length)];

const USER_NAME = "김토스";

// ─── Components ───────────────────────────────────────────────────────────────
const PastelFront = ({ coin, size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id={`pf${coin.id}`} cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.95"/>
        <stop offset="100%" stopColor={coin.pastel} stopOpacity="1"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="96" fill={coin.pastelDark} opacity="0.45"/>
    <circle cx="100" cy="100" r="88" fill={`url(#pf${coin.id})`}/>
    <circle cx="100" cy="100" r="88" fill="none" stroke={coin.pastelDark} strokeWidth="2.5" opacity="0.6"/>
  </svg>
);

const PastelBack = ({ coin, size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id={`pb${coin.id}`} cx="60%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.95"/>
        <stop offset="100%" stopColor={coin.pastel} stopOpacity="1"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="96" fill={coin.pastelDark} opacity="0.45"/>
    <circle cx="100" cy="100" r="88" fill={`url(#pb${coin.id})`}/>
    <circle cx="100" cy="100" r="88" fill="none" stroke={coin.pastelDark} strokeWidth="2.5" opacity="0.6"/>
  </svg>
);

const PastelCoin3D = ({ coin, size = 160, spinning = true }) => (
  <div style={{ width:size, height:size, perspective: size*5 }}>
    <div style={{
      width:"100%", height:"100%", position:"relative",
      transformStyle:"preserve-3d",
      animation: spinning ? "coinSpin 5s linear infinite" : "none",
      filter:"drop-shadow(0 8px 20px rgba(0,0,0,0.08))",
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

const GridCoin = ({ coin, found }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"12px 4px",
    opacity: found ? 1 : 0.28, filter: found ? "none" : "grayscale(1)",
    transition:"opacity 0.4s, filter 0.4s" }}>
    <div style={{ width:52, height:52, borderRadius:"50%", background:coin.pastelDark, opacity: found ? 1 : 0.5,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:42, height:42, borderRadius:"50%", background:coin.pastel }} />
    </div>
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:11, fontWeight:700, color:"#191F28" }}>{coin.year}년</div>
      <div style={{ fontSize:10, color:"#8B95A1" }}>{coin.denom}원</div>
    </div>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
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
    setScanning(false);
    setScanResult(result);
    if (result.isRare) setFoundIds(p => p.includes(coin.id) ? p : [...p, coin.id]);
    e.target.value = "";
  };

  const onShare = () => {
    const isSuccess = scanResult?.isRare;
    TossBridge.share({
      title: "희귀 동전 찾기",
      message: isSuccess ? `${USER_NAME}님이 행운의 동전을 찾았어요!` : "지갑 속 보물을 찾아보세요",
      url: "https://coin-hunter-chi.vercel.app/"
    });
  };

  return (
    <div style={{ maxWidth:390, margin:"0 auto", minHeight:"100vh", background:"#F7F8FA", paddingBottom:100 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px", sticky: "top" }}>
        <div style={{ width:36 }}/>
        <span style={{ fontSize:17, fontWeight:700 }}>희귀 동전 찾기</span>
        <button onClick={TossBridge.onClose} style={{ width:36, height:36, borderRadius:"50%", border:"none", background:"#eee" }}>✕</button>
      </div>

      {/* Hero */}
      <div style={{ margin:"16px", background:"#fff", borderRadius:24, padding:"36px 24px", textAlign:"center", boxShadow:"0 2px 16px rgba(0,0,0,0.05)" }}>
        <PastelCoin3D coin={COINS[0]} size={160} />
        <div style={{ marginTop:24 }}>
          <div style={{ fontSize:26, fontWeight:900, color:colors.blue500 }}>지갑 속 보물찾기</div>
          <p style={{ color:"#8B95A1", fontSize:14 }}>내 주머니 속 동전의 가치를 확인해보세요</p>
        </div>
      </div>

      {/* Collection Grid */}
      <div style={{ margin:"16px", background:"#fff", borderRadius:24, padding:"20px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)" }}>
          {COINS.map(coin => <GridCoin key={coin.id} coin={coin} found={foundIds.includes(coin.id)}/>)}
        </div>
      </div>

      {/* FAB */}
      <div style={{ position:"fixed", bottom:30, width:"100%", maxWidth:390, padding:"0 16px" }}>
        <Button size="large" fullWidth onClick={() => fileRef.current?.click()} loading={scanning}>
          {scanning ? "분석 중..." : "동전 스캔하기"}
        </Button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={handleScan}/>

      {/* Modal Result */}
      {scanResult && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"flex-end" }}>
          <div style={{ background:"#fff", width:"100%", borderRadius:"24px 24px 0 0", padding:"30px 24px" }}>
             <div style={{ textAlign:"center", marginBottom:20 }}>
               {scanResult.isRare ? <h2>희귀 동전 발견!</h2> : <h2>평범한 동전이에요</h2>}
               <Button onClick={onShare} variant="secondary" style={{ marginTop:10 }}>결과 공유하기</Button>
               <Button onClick={() => setScanResult(null)} style={{ marginTop:10, marginLeft:10 }}>닫기</Button>
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
