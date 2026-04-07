import { Button } from '@toss/tds-mobile';
 
const App = () => <Button>버튼</Button>;
import { colors } from '@toss/tds-colors';
 
<div style={{ width:100, height:100, backgroundColor: colors.blue500 }} />
import { useState, useRef } from "react";

import { Button } from '@toss/tds-mobile';
 
const App = () => <Button>버튼</Button>;



// ─── DB ───────────────────────────────────────────────────────────────────────
const GOLD_COLORS = {
  pastel: "#FFF9C4",     // 밝은 황금빛
  pastelDark: "#FBC02D", // 짙은 황금빛
  gradeGold: "#9A7B00"   // 텍스트/테두리용 골드
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

// ─── Share ────────────────────────────────────────────────────────────────────
const doShare = async (isSuccess) => {
  const text = isSuccess
    ? `${USER_NAME}님이 행운의 동전을 찾았어요! 지갑에 있는 가능성들을 확인해보시겠어요?`
    : `지갑에 있는 가능성들을 확인해보시겠어요?`;
  try {
    if (navigator.share) await navigator.share({ title:"화폐 아카이브", text, url:"https://toss.im/money-archive" });
    else { await navigator.clipboard.writeText(text); alert("복사되었어요!"); }
  } catch(_){}
};

// ─── Pastel Coin SVG — Front ──────────────────────────────────────────────────
const PastelFront = ({ coin, size }) => {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`pf${coin.id}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#fff" stopOpacity="0.95"/>
          <stop offset="100%" stopColor={coin.pastel} stopOpacity="1"/>
        </radialGradient>
      </defs>
      {/* 바깥 테두리 */}
      <circle cx="100" cy="100" r="96" fill={coin.pastelDark} opacity="0.45"/>
      {/* 메인 디스크 */}
      <circle cx="100" cy="100" r="88" fill={`url(#pf${coin.id})`}/>
      <circle cx="100" cy="100" r="88" fill="none" stroke={coin.pastelDark} strokeWidth="2.5" opacity="0.6"/>
      {/* 안쪽 링 */}
      <circle cx="100" cy="100" r="74" fill="none" stroke={coin.pastelDark} strokeWidth="1.5" opacity="0.35"/>
      {/* 상단 하이라이트 */}
      <ellipse cx="78" cy="62" rx="24" ry="11" fill="rgba(255,255,255,0.65)" transform="rotate(-20 78 62)"/>
      {/* 앞면 아이콘/글자 제거됨 */}
    </svg>
  );
};

// ─── Pastel Coin SVG — Back ───────────────────────────────────────────────────
const PastelBack = ({ coin, size }) => {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`pb${coin.id}`} cx="60%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#fff" stopOpacity="0.95"/>
          <stop offset="100%" stopColor={coin.pastel} stopOpacity="1"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill={coin.pastelDark} opacity="0.45"/>
      <circle cx="100" cy="100" r="88" fill={`url(#pb${coin.id})`}/>
      <circle cx="100" cy="100" r="88" fill="none" stroke={coin.pastelDark} strokeWidth="2.5" opacity="0.6"/>
      <circle cx="100" cy="100" r="74" fill="none" stroke={coin.pastelDark} strokeWidth="1.5" opacity="0.35"/>
      <ellipse cx="122" cy="62" rx="24" ry="11" fill="rgba(255,255,255,0.60)" transform="rotate(20 122 62)"/>
      {/* 뒷면 아이콘/연도 제거됨 */}
    </svg>
  );
};

// ─── 3D Coin Wrapper ──────────────────────────────────────────────────────────
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

// ─── Mini Coin (그리드) ───────────────────────────────────────────────────────
const MiniCoin = ({ coin, size=52 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:coin.pastelDark, opacity:0.5,
    display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 4px 12px rgba(0,0,0,0.07)", flexShrink:0 }}>
    <div style={{ width:size*0.82, height:size*0.82, borderRadius:"50%", background:coin.pastel,
      display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:0 }}>
      {/* 아이콘/글자 제거됨 */}
    </div>
  </div>
);

const MiniCoinFound = ({ coin, size=52 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:coin.pastelDark,
    display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 4px 12px rgba(0,0,0,0.07)", flexShrink:0 }}>
    <div style={{ width:size*0.82, height:size*0.82, borderRadius:"50%", background:coin.pastel,
      display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:0 }}>
      {/* 아이콘/글자 제거됨 */}
    </div>
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ label, color }) => (
  <span style={{ padding:"2px 8px", borderRadius:99, fontSize:10, fontWeight:700, color:"#fff", background:color }}>
    {label}
  </span>
);

// ─── Grid Item ────────────────────────────────────────────────────────────────
const GridCoin = ({ coin, found }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"12px 4px",
    opacity: found ? 1 : 0.28, filter: found ? "none" : "grayscale(1)",
    transition:"opacity 0.4s, filter 0.4s" }}>
    {found ? <MiniCoinFound coin={coin} size={52}/> : <MiniCoin coin={coin} size={52}/>}
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:11, fontWeight:700, color:"#191F28", lineHeight:1.3 }}>{coin.year}년</div>
      <div style={{ fontSize:10, color:"#8B95A1" }}>{coin.denom}원</div>
    </div>
    {found
      ? <Badge label={coin.grade} color={coin.gradeColor}/>
      : <span style={{ fontSize:13, color:"#D1D6DB" }}>🔒</span>}
  </div>
);

// ─── Share Button ─────────────────────────────────────────────────────────────
const ShareBtn = ({ isSuccess }) => (
  <button onClick={() => doShare(isSuccess)} style={{
    width:"100%", height:48, borderRadius:12, marginTop:10,
    background:"#F2F4F6", border:"none", fontSize:14, fontWeight:700,
    color:"#4E5968", cursor:"pointer", display:"flex", alignItems:"center",
    justifyContent:"center", gap:6,
  }}>
    🔗 친구에게 공유하기
  </button>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ result, onClose }) => (
  <>
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:400, animation:"fadeIn 0.2s" }}/>
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:390, background:"#fff",
      borderRadius:"24px 24px 0 0", padding:"28px 24px 44px", zIndex:500,
      animation:"sheetUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <div style={{ width:36, height:4, borderRadius:2, background:"#E5E8EB", margin:"0 auto 24px" }}/>
      {result.isRare ? (
        <>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:18, marginBottom:28 }}>
            <PastelCoin3D coin={result.coin} size={124} spinning/>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:12, fontWeight:700, color:result.coin.gradeColor, marginBottom:5, letterSpacing:0.3 }}>🎉 희귀 동전 발견!</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#191F28", letterSpacing:-0.5 }}>
                {result.coin.year}년 {result.coin.denom}원
              </div>
              <div style={{ fontSize:14, color:"#8B95A1", marginTop:6 }}>
                최대 <span style={{ color:result.coin.gradeColor, fontWeight:700 }}>{result.coin.price.toLocaleString()}원</span> 가치
              </div>
            </div>
            <Badge label={result.coin.grade} color={result.coin.gradeColor}/>
          </div>
          <button onClick={onClose} style={{ width:"100%", height:56, borderRadius:16, background:"#3182F6", border:"none", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(49,130,246,0.3)" }}>
            컬렉션에 추가하기
          </button>
          <ShareBtn isSuccess={true}/>
        </>
      ) : (
        <>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, marginBottom:28 }}>
            <div style={{ fontSize:60 }}>😅</div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:900, color:"#191F28" }}>평범한 동전이에요</div>
              <div style={{ fontSize:14, color:"#8B95A1", marginTop:6 }}>{result.year}년 · 다시 찾아볼까요?</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width:"100%", height:56, borderRadius:16, background:"#191F28", border:"none", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer" }}>
            다시 스캔하기
          </button>
          <ShareBtn isSuccess={false}/>
        </>
      )}
    </div>
  </>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MoneyArchiveDashboard() {
  const [scanning,   setScanning]   = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [foundIds,   setFoundIds]   = useState([]);
  const fileRef = useRef(null);

  const handleScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true); setScanResult(null);
    await new Promise(r => setTimeout(r, 1600));
    const year = mockOCR();
    const coin = RARE_DB[year] || null;
    const result = coin ? { isRare:true, coin, year } : { isRare:false, coin:null, year };
    setScanning(false); setScanResult(result);
    if (result.isRare) setFoundIds(p => p.includes(coin.id) ? p : [...p, coin.id]);
    e.target.value = "";
  };

  const heroCoin = COINS[0];

  return (
    <div style={{ maxWidth:390, margin:"0 auto", minHeight:"100vh", background:"#F7F8FA",
      fontFamily:"'Pretendard',system-ui,-apple-system,sans-serif", paddingBottom:104 }}>

      {/* ── Header ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"18px 22px 10px", position:"sticky", top:0, zIndex:100, background:"#F7F8FA" }}>
        <div style={{ width:36 }}/>
        <span style={{ fontSize:17, fontWeight:700, color:"#191F28", letterSpacing:-0.3 }}>희귀 동전 찾기</span>
        <button style={{ width:36, height:36, borderRadius:"50%", background:"rgba(0,0,0,0.05)",
          border:"none", cursor:"pointer", fontSize:16, color:"#191F28", fontWeight:700 }}>✕</button>
      </div>

      {/* ── Hero Card ── */}
      <div style={{ margin:"6px 16px 14px", background:"#fff", borderRadius:24,
        padding:"36px 24px 28px", display:"flex", flexDirection:"column", alignItems:"center", gap:22,
        boxShadow:"0 2px 16px rgba(0,0,0,0.05)" }}>

        {/* Coin + float shadow */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
          <PastelCoin3D coin={heroCoin} size={164} spinning/>
          <div style={{ width:72, height:12, marginTop:6,
            background:"radial-gradient(ellipse, rgba(0,0,0,0.08) 0%, transparent 70%)",
            borderRadius:"50%", animation:"shadowFloat 5s linear infinite" }}/>
        </div>

        {/* Texts */}
        <div style={{ textAlign:"center", width:"100%" }}>
          <div style={{ fontSize:12, color:"#B0B8C1", fontWeight:600, letterSpacing:0.4, marginBottom:8 }}>
            1998년 500원 현재 시세
          </div>
          <div style={{ fontSize:26, fontWeight:900, color:"#3182F6", letterSpacing:-1, lineHeight:1.2, marginBottom:8 }}>
            지갑 속에 오백만원이?
          </div>
          <div style={{ fontSize:14, color:"#8B95A1", lineHeight:1.7 }}>
            단 <strong style={{ color:"#191F28", fontWeight:800 }}>8,000개</strong>만 발행된 전설의 동전<br/>
            지금 내 지갑에 있을 수도 있어요
          </div>
        </div>

        {/* Progress pill */}
        <div style={{ background:"#F7F8FA", borderRadius:99, padding:"9px 22px",
          display:"flex", alignItems:"center", gap:6, border:"1px solid #EAECEF" }}>
          <span style={{ fontSize:13, color:"#8B95A1", fontWeight:500 }}>내 컬렉션</span>
          <span style={{ fontSize:14, fontWeight:900, color:"#191F28" }}>{foundIds.length}</span>
          <span style={{ fontSize:13, color:"#D1D6DB" }}>/</span>
          <span style={{ fontSize:13, color:"#8B95A1" }}>{COINS.length}개 해금</span>
        </div>
      </div>

      {/* ── Collection Card ── */}
      <div style={{ margin:"0 16px 14px", background:"#fff", borderRadius:24,
        padding:"22px 20px", boxShadow:"0 2px 16px rgba(0,0,0,0.05)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <span style={{ fontSize:15, fontWeight:800, color:"#191F28" }}>희귀 동전 컬렉션</span>
          <span style={{ fontSize:12, color:"#B0B8C1" }}>스캔으로 해금</span>
        </div>

        {/* 4×2 grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"4px 0" }}>
          {COINS.map(coin => <GridCoin key={coin.id} coin={coin} found={foundIds.includes(coin.id)}/>)}
        </div>

        {/* legend */}
        <div style={{ display:"flex", gap:10, marginTop:18, paddingTop:16, borderTop:"1px solid #F2F4F6" }}>
          {[["전설","#FF8A65"],["희귀","#9575CD"],["레어","#5C9BF5"],["일반","#90A4AE"]].map(([g,c])=>(
            <div key={g} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:c }}/>
              <span style={{ fontSize:11, color:"#8B95A1" }}>{g}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Rarity Info ── */}
      <div style={{ margin:"0 16px 24px", background:"#fff", borderRadius:24,
        padding:"20px 22px", boxShadow:"0 2px 16px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#191F28", marginBottom:16 }}>📊 발견 확률</div>
        {[
          { label:"1998년 500원", sub:"단 8,000개 발행",   prob:"10만분의 3",  color:"#FF8A65" },
          { label:"1966년 10원",  sub:"최초 발행 다보탑",   prob:"5,000분의 1", color:"#9575CD" },
          { label:"1970년 100원", sub:"이순신 최초 도안",   prob:"1,250분의 1", color:"#5C9BF5" },
        ].map(({ label, sub, prob, color }, i, arr) => (
          <div key={label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            paddingBottom: i<arr.length-1 ? 14 : 0, marginBottom: i<arr.length-1 ? 14 : 0,
            borderBottom: i<arr.length-1 ? "1px solid #F7F8FA" : "none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:12, background:color+"18",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                {i===0?"🪙":i===1?"🏛️":"⚓"}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#191F28" }}>{label}</div>
                <div style={{ fontSize:11, color:"#B0B8C1", marginTop:2 }}>{sub}</div>
              </div>
            </div>
            <span style={{ fontSize:12, fontWeight:700, color }}>{prob}</span>
          </div>
        ))}
      </div>

      {/* ── FAB ── */}
      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        style={{ display:"none" }} onChange={handleScan}/>

      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:390, padding:"12px 16px 34px",
        background:"linear-gradient(transparent, #F7F8FA 38%)", zIndex:200 }}>
        <button
          onClick={() => !scanning && fileRef.current?.click()}
          style={{
            width:"100%", height:56, borderRadius:16,
            background: scanning ? "#D1D6DB" : "#3182F6",
            border:"none", color:"#fff", fontSize:16, fontWeight:700,
            cursor: scanning ? "not-allowed" : "pointer",
            boxShadow: scanning ? "none" : "0 6px 20px rgba(49,130,246,0.32)",
            transition:"background 0.2s, box-shadow 0.2s",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            letterSpacing:-0.2,
          }}
          onMouseDown={e => { if(!scanning) e.currentTarget.style.background="#1B64DA"; }}
          onMouseUp={e   => { if(!scanning) e.currentTarget.style.background="#3182F6"; }}
        >
          {scanning
            ? <><span style={{ animation:"spin 0.8s linear infinite", display:"inline-block" }}>⏳</span> 스캔 중...</>
            : <><span>🔍</span> 내 동전 스캔하기</>
          }
        </button>
      </div>

      {/* ── Modal ── */}
      {scanResult && <Modal result={scanResult} onClose={() => setScanResult(null)}/>}

      <style>{`
        @keyframes coinSpin    { from{transform:rotateY(0deg)} to{transform:rotateY(360deg)} }
        @keyframes shadowFloat { 0%,100%{transform:scaleX(1);opacity:.8} 50%{transform:scaleX(.65);opacity:.4} }
        @keyframes sheetUp     { from{transform:translateX(-50%) translateY(100%)} to{transform:translateX(-50%) translateY(0)} }
        @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
        @keyframes spin        { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

