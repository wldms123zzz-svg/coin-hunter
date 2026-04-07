import { useState, useRef } from “react”;

// ─── DB ───────────────────────────────────────────────────────────────────────
const COINS = [
{
id: “c1”, year: 1998, denom: 500, grade: “전설”, gradeColor: “#FF8A65”,
price: 5000000, avgPrice: 3200000, recentPrice: 4100000,
pastel: “#FFF3E0”, pastelDark: “#FFCC80”, icon: “🌟”, iconBack: “🦅”,
issued: 8000, probText: “10만분의 3”,
priceNote: “한국조폐공사 발행 기록 및 국내 경매 낙찰가 기준 추정”,
market: [
{ platform: “번개장터”, price: 4200000, condition: “미사용”,       ago: “3일 전” },
{ platform: “중고나라”, price: 3800000, condition: “상태 양호”,    ago: “1주 전” },
{ platform: “옥션”,    price: 4900000, condition: “미사용(봉투)”, ago: “2주 전” },
],
},
{
id: “c2”, year: 1966, denom: 10, grade: “희귀”, gradeColor: “#9575CD”,
price: 1000000, avgPrice: 750000, recentPrice: 820000,
pastel: “#F3E5F5”, pastelDark: “#CE93D8”, icon: “🏛️”, iconBack: “🕊️”,
issued: 50000, probText: “5,000분의 1”,
priceNote: “국내 화폐 경매 및 수집가 커뮤니티 거래 사례 기준 추정”,
market: [
{ platform: “번개장터”, price: 850000, condition: “미사용”,       ago: “5일 전” },
{ platform: “중고나라”, price: 720000, condition: “상태 양호”,    ago: “2주 전” },
{ platform: “옥션”,    price: 980000, condition: “등급 판정본”,  ago: “1개월 전” },
],
},
{
id: “c3”, year: 1970, denom: 100, grade: “레어”, gradeColor: “#5C9BF5”,
price: 150000, avgPrice: 110000, recentPrice: 125000,
pastel: “#E3F2FD”, pastelDark: “#90CAF9”, icon: “⚓”, iconBack: “🌊”,
issued: 200000, probText: “1,250분의 1”,
priceNote: “수집 커뮤니티 거래 사례 기준 추정가이며 상태에 따라 차이가 있어요”,
market: [
{ platform: “번개장터”, price: 130000, condition: “상태 양호”,  ago: “1일 전” },
{ platform: “중고나라”, price: 105000, condition: “사용감 있음”, ago: “4일 전” },
{ platform: “옥션”,    price: 148000, condition: “미사용”,      ago: “1주 전” },
],
},
{
id: “c4”, year: 1982, denom: 500, grade: “레어”, gradeColor: “#5C9BF5”,
price: 80000, avgPrice: 55000, recentPrice: 62000,
pastel: “#E8F5E9”, pastelDark: “#A5D6A7”, icon: “🌿”, iconBack: “🍃”,
issued: 500000, probText: “2,000분의 1”,
priceNote: “수집 커뮤니티 거래 사례 기준 추정가”,
market: [
{ platform: “번개장터”, price: 65000, condition: “상태 양호”,  ago: “2일 전” },
{ platform: “중고나라”, price: 50000, condition: “사용감 있음”, ago: “1주 전” },
{ platform: “옥션”,    price: 78000, condition: “미사용”,      ago: “3주 전” },
],
},
{
id: “c5”, year: 2006, denom: 10, grade: “일반”, gradeColor: “#90A4AE”,
price: 5000, avgPrice: 3000, recentPrice: 3500,
pastel: “#ECEFF1”, pastelDark: “#B0BEC5”, icon: “⭕”, iconBack: “◯”,
issued: 50000000, probText: “흔함”,
priceNote: “일반 유통 동전으로 액면가에 준하는 수준”,
market: [],
},
{
id: “c6”, year: 1983, denom: 50, grade: “레어”, gradeColor: “#5C9BF5”,
price: 30000, avgPrice: 20000, recentPrice: 24000,
pastel: “#FFF8E1”, pastelDark: “#FFE082”, icon: “🌸”, iconBack: “🌺”,
issued: 800000, probText: “5,000분의 3”,
priceNote: “수집 커뮤니티 거래 사례 기준 추정가”,
market: [
{ platform: “번개장터”, price: 25000, condition: “상태 양호”,  ago: “3일 전” },
{ platform: “중고나라”, price: 19000, condition: “사용감 있음”, ago: “2주 전” },
],
},
{
id: “c7”, year: 1991, denom: 100, grade: “레어”, gradeColor: “#5C9BF5”,
price: 25000, avgPrice: 16000, recentPrice: 18000,
pastel: “#FCE4EC”, pastelDark: “#F48FB1”, icon: “🎋”, iconBack: “🎍”,
issued: 1000000, probText: “3,000분의 1”,
priceNote: “수집 커뮤니티 거래 사례 기준 추정가”,
market: [
{ platform: “번개장터”, price: 19000, condition: “상태 양호”,  ago: “6일 전” },
{ platform: “중고나라”, price: 15000, condition: “사용감 있음”, ago: “3주 전” },
],
},
{
id: “c8”, year: 2001, denom: 500, grade: “일반”, gradeColor: “#90A4AE”,
price: 3000, avgPrice: 2000, recentPrice: 2200,
pastel: “#ECEFF1”, pastelDark: “#CFD8DC”, icon: “⭕”, iconBack: “◯”,
issued: 30000000, probText: “흔함”,
priceNote: “일반 유통 동전으로 액면가에 준하는 수준”,
market: [],
},
];

const RARE_DB    = { 1998: COINS[0], 1966: COINS[1], 1970: COINS[2] };
const COMMON_YRS = [2015, 2018, 2020, 2021, 2022, 2023];
const mockOCR    = () =>
Math.random() < 0.45
? [1998, 1966, 1970][Math.floor(Math.random() * 3)]
: COMMON_YRS[Math.floor(Math.random() * COMMON_YRS.length)];

const MAX_SCANS = 3;
const fmt = (n) => n.toLocaleString(“ko-KR”) + “원”;
const Divider = () => <div style={{ height: 1, background: “#F2F4F6” }} />;

// ─── SVG Coin ─────────────────────────────────────────────────────────────────
const PastelFront = ({ coin, size }) => (
<svg width={size} height={size} viewBox="0 0 200 200" fill="none">
<defs>
<radialGradient id={`pf${coin.id}`} cx=“40%” cy=“35%” r=“65%”>
<stop offset="0%" stopColor="hsl(53,96%,58%)" stopOpacity="0.95" />
<stop offset="100%" stopColor={coin.pastel} stopOpacity="1" />
</radialGradient>
</defs>
<circle cx="100" cy="100" r="96" fill={coin.pastelDark} opacity="0.45" />
<circle cx=“100” cy=“100” r=“88” fill={`url(#pf${coin.id})`} />
<circle cx="100" cy="100" r="88" fill="none" stroke={coin.pastelDark} strokeWidth="2.5" opacity="0.6" />
<circle cx="100" cy="100" r="74" fill="none" stroke={coin.pastelDark} strokeWidth="1.5" opacity="0.35" />
<text x="100" y="88" textAnchor="middle" fontSize="38" dominantBaseline="middle">{coin.icon}</text>
<text x="100" y="130" textAnchor="middle" fontSize="40" fontWeight="900"
fontFamily="'Pretendard',system-ui,sans-serif" fill={coin.gradeColor} opacity="0.9">{coin.denom}</text>
<text x="100" y="158" textAnchor="middle" fontSize="13" fontWeight="600" letterSpacing="2"
fontFamily="'Pretendard',system-ui,sans-serif" fill={coin.gradeColor} opacity="0.5">원</text>
</svg>
);

const PastelBack = ({ coin, size }) => (
<svg width={size} height={size} viewBox="0 0 200 200" fill="none">
<defs>
<radialGradient id={`pb${coin.id}`} cx=“60%” cy=“35%” r=“65%”>
<stop offset="0%" stopColor="rgb(255,208,1)" stopOpacity="0.95" />
<stop offset="100%" stopColor={coin.pastel} stopOpacity="1" />
</radialGradient>
</defs>
<circle cx="100" cy="100" r="96" fill={coin.pastelDark} opacity="0.45" />
<circle cx=“100” cy=“100” r=“88” fill={`url(#pb${coin.id})`} />
<circle cx="100" cy="100" r="88" fill="none" stroke={coin.pastelDark} strokeWidth="2.5" opacity="0.6" />
<circle cx="100" cy="100" r="74" fill="none" stroke={coin.pastelDark} strokeWidth="1.5" opacity="0.35" />
<ellipse cx="122" cy="62" rx="24" ry="11" fill="rgba(255,255,255,0.60)" transform="rotate(20 122 62)" />
<text x="100" y="105" textAnchor="middle" fontSize="64" dominantBaseline="middle">{coin.iconBack}</text>
<text x="100" y="162" textAnchor="middle" fontSize="16" fontWeight="700" letterSpacing="2"
fontFamily="'Pretendard',system-ui,sans-serif" fill={coin.gradeColor} opacity="0.5">{coin.year}</text>
</svg>
);

const Coin3D = ({ coin, size = 160, spin = true }) => (

  <div style={{ width: size, height: size, perspective: size * 5 }}>
    <div style={{
      width: "100%", height: "100%", position: "relative",
      transformStyle: "preserve-3d",
      animation: spin ? "coinSpin 5s linear infinite" : "none",
      filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.08))",
    }}>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
        <PastelFront coin={coin} size={size} />
      </div>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
        <PastelBack coin={coin} size={size} />
      </div>
    </div>
  </div>
);

const MiniCoin = ({ coin, size = 52, found = true }) => (

  <div style={{
    width: size, height: size, borderRadius: "50%", background: coin.pastelDark,
    opacity: found ? 1 : 0.28, filter: found ? "none" : "grayscale(1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: found ? "0 4px 12px rgba(0,0,0,0.07)" : "none", flexShrink: 0,
    transition: "all 0.4s",
  }}>
    <div style={{
      width: size * 0.82, height: size * 0.82, borderRadius: "50%", background: coin.pastel,
      display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
    }}>
      <span style={{ fontSize: size * 0.3 }}>{coin.icon}</span>
      <span style={{ fontSize: size * 0.22, fontWeight: 900, color: coin.gradeColor, lineHeight: 1 }}>{coin.denom}</span>
    </div>
  </div>
);

const Badge = ({ label, color, small }) => (
<span style={{
padding: small ? “2px 7px” : “3px 10px”, borderRadius: 99,
fontSize: small ? 10 : 11, fontWeight: 700, color: “#fff”, background: color,
}}>{label}</span>
);

// ─── Info Tab ─────────────────────────────────────────────────────────────────
const InfoTab = ({ coin: c }) => (

  <div style={{ background: "#F8F9FA", borderRadius: 16, overflow: "hidden" }}>
    {[
      ["최근 거래가", fmt(c.recentPrice), c.gradeColor],
      ["평균 시세",   fmt(c.avgPrice),    "#191F28"],
      ["최고 기록가", fmt(c.price),       "#191F28"],
      ["발행 수량",   `${c.issued.toLocaleString()}개`, "#191F28"],
      ["발견 확률",   c.probText,         c.gradeColor],
    ].map(([label, value, color], i, arr) => (
      <div key={label}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px" }}>
          <span style={{ fontSize: 13, color: "#8B95A1" }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
        </div>
        {i < arr.length - 1 && <Divider />}
      </div>
    ))}
    <div style={{ padding: "12px 16px", background: "#EEF4FF", borderTop: "1px solid #DDEAFF" }}>
      <p style={{ margin: 0, fontSize: 11, color: "#5A7FCB", lineHeight: 1.6 }}>ℹ️ {c.priceNote}</p>
    </div>
  </div>
);

// ─── Market Tab ───────────────────────────────────────────────────────────────
const MarketTab = ({ coin: c }) => (
c.market.length === 0 ? (
<div style={{ textAlign: “center”, padding: “32px 0”, color: “#B0B8C1”, fontSize: 14 }}>
거래 사례가 없어요
</div>
) : (
<div style={{ background: “#F8F9FA”, borderRadius: 16, overflow: “hidden” }}>
{c.market.map((m, i) => (
<div key={i}>
<div style={{ display: “flex”, alignItems: “center”, justifyContent: “space-between”, padding: “14px 16px” }}>
<div>
<div style={{ fontSize: 13, fontWeight: 700, color: “#191F28” }}>{m.platform}</div>
<div style={{ fontSize: 11, color: “#B0B8C1”, marginTop: 2 }}>{m.condition} · {m.ago}</div>
</div>
<span style={{ fontSize: 14, fontWeight: 800, color: c.gradeColor }}>{m.price.toLocaleString()}원</span>
</div>
{i < c.market.length - 1 && <Divider />}
</div>
))}
<div style={{ padding: “12px 16px”, background: “#EEF4FF”, borderTop: “1px solid #DDEAFF” }}>
<p style={{ margin: 0, fontSize: 11, color: “#5A7FCB”, lineHeight: 1.6 }}>
ℹ️ 실제 거래 연결이 아닌 참고용 시세예요. 실제 판매는 해당 플랫폼을 이용해 주세요.
</p>
</div>
</div>
)
);

// ─── Share ────────────────────────────────────────────────────────────────────
const doShare = async (isSuccess) => {
const text = isSuccess
? “지갑 속 희귀 동전을 발견했어요! 나도 확인해볼까요?”
: “지갑 속에 숨은 자산이 있을 수 있어요. 같이 찾아봐요!”;
try {
if (navigator.share) await navigator.share({ title: “희귀 동전 찾기”, text, url: “https://coin-hunter-chi.vercel.app” });
else { await navigator.clipboard.writeText(text); alert(“링크가 복사됐어요!”); }
} catch (_) {}
};

// ─── Result Sheet ─────────────────────────────────────────────────────────────
const ResultSheet = ({ result, onClose, onSave, alreadySaved }) => {
const [tab, setTab] = useState(“info”);
// ✅ FIX 1: coin이 null일 때 빈 객체로 fallback
const c = result.coin || {};

return (
<>
<div onClick={onClose}
style={{ position: “fixed”, inset: 0, background: “rgba(0,0,0,0.4)”, zIndex: 400, animation: “fadeIn 0.2s” }} />
<div style={{
position: “fixed”, bottom: 0, left: “50%”, transform: “translateX(-50%)”,
width: “100%”, maxWidth: 390, background: “#fff”,
borderRadius: “24px 24px 0 0”, zIndex: 500,
animation: “sheetUp 0.35s cubic-bezier(0.34,1.56,0.64,1)”,
maxHeight: “90vh”, overflowY: “auto”,
}}>
<div style={{ padding: “16px 24px 0”, display: “flex”, justifyContent: “center” }}>
<div style={{ width: 36, height: 4, borderRadius: 2, background: “#E5E8EB” }} />
</div>

```
    {result.isRare ? (
      <div style={{ padding: "20px 22px 44px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <Coin3D coin={c} size={120} spin />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c.gradeColor, marginBottom: 4 }}>🎉 희귀 동전 발견!</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#191F28", letterSpacing: -0.5 }}>
              {c.year}년 {c.denom}원
            </div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
              <Badge label={c.grade} color={c.gradeColor} />
              <span style={{ fontSize: 12, color: "#8B95A1" }}>발행 {c.issued.toLocaleString()}개</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", background: "#F2F4F6", borderRadius: 12, padding: 4, marginBottom: 18, gap: 4 }}>
          {[["info", "동전 정보"], ["market", "시세 / 거래"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              flex: 1, height: 36, borderRadius: 9, border: "none", cursor: "pointer",
              background: tab === k ? "#fff" : "transparent",
              color: tab === k ? "#191F28" : "#8B95A1",
              fontSize: 13, fontWeight: 700,
              boxShadow: tab === k ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.18s",
            }}>{l}</button>
          ))}
        </div>

        {tab === "info" ? <InfoTab coin={c} /> : <MarketTab coin={c} />}

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
          <button onClick={onSave} style={{
            width: "100%", height: 54, borderRadius: 14,
            background: alreadySaved ? "#F2F4F6" : "#3182F6",
            border: "none", color: alreadySaved ? "#8B95A1" : "#fff",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            boxShadow: alreadySaved ? "none" : "0 4px 16px rgba(49,130,246,0.28)",
          }}>
            {alreadySaved ? "✅ 컬렉션에 저장됨" : "컬렉션에 저장하기"}
          </button>
          <button onClick={() => doShare(true)} style={{
            width: "100%", height: 48, borderRadius: 12,
            background: "#F2F4F6", border: "none", color: "#4E5968",
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>🔗 친구에게 공유하기</button>
        </div>
      </div>
    ) : (
      <div style={{ padding: "20px 22px 44px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 56 }}>😅</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#191F28" }}>평범한 동전이에요</div>
          <div style={{ fontSize: 14, color: "#8B95A1", marginTop: 6 }}>
            {result.year}년 동전 · 희귀 동전을 계속 찾아보세요!
          </div>
        </div>
        <button onClick={onClose} style={{
          width: "100%", height: 54, borderRadius: 14, background: "#191F28",
          border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8,
        }}>다시 스캔하기</button>
        <button onClick={() => doShare(false)} style={{
          width: "100%", height: 48, borderRadius: 12, background: "#F2F4F6",
          border: "none", color: "#4E5968", fontSize: 14, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>🔗 친구에게 공유하기</button>
      </div>
    )}
  </div>
</>
```

);
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function MoneyArchiveDashboard() {
const [scansLeft,  setScansLeft]  = useState(MAX_SCANS);
const [streak,     setStreak]     = useState(2);
const [scanning,   setScanning]   = useState(false);
const [scanResult, setScanResult] = useState(null);
const [foundIds,   setFoundIds]   = useState([]);
const [tab,        setTab]        = useState(“home”);
const fileRef = useRef(null);

const totalValue = foundIds.reduce((sum, id) => {
const c = COINS.find(x => x.id === id);
return sum + (c?.recentPrice || 0);
}, 0);

const handleScan = async (e) => {
const file = e.target.files?.[0];
if (!file || scansLeft <= 0) return;
setScanning(true); setScanResult(null);
await new Promise(r => setTimeout(r, 1800));
const year = mockOCR();
const coin = RARE_DB[year] || null;
setScanResult(coin ? { isRare: true, coin, year } : { isRare: false, coin: null, year });
setScansLeft(p => Math.max(0, p - 1));
setScanning(false);
e.target.value = “”;
};

const handleSave = () => {
if (!scanResult?.isRare) return;
const id = scanResult.coin.id;
// ✅ FIX 2: … (말줄임표) → … (스프레드 연산자)
setFoundIds(p => p.includes(id) ? p : […p, id]);
};

const alreadySaved = scanResult?.isRare && foundIds.includes(scanResult.coin.id);
const heroCoin = COINS[0];

return (
<div style={{
maxWidth: 390, margin: “0 auto”, minHeight: “100vh”,
background: “#F7F8FA”, fontFamily: “‘Pretendard’,system-ui,-apple-system,sans-serif”,
paddingBottom: 110,
}}>
<style>{`@keyframes coinSpin { from{transform:rotateY(0deg)} to{transform:rotateY(360deg)} } @keyframes sheetUp  { from{transform:translateX(-50%) translateY(100%)} to{transform:translateX(-50%) translateY(0)} } @keyframes fadeIn   { from{opacity:0} to{opacity:1} } @keyframes spin     { to{transform:rotate(360deg)} }`}</style>

```
  {/* Header */}
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 22px 10px", position: "sticky", top: 0, zIndex: 100, background: "#F7F8FA",
  }}>
    <div style={{ width: 36 }} />
    <span style={{ fontSize: 17, fontWeight: 700, color: "#191F28" }}>희귀 동전 찾기</span>
    <button style={{
      width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.05)",
      border: "none", cursor: "pointer", fontSize: 16, color: "#191F28", fontWeight: 700,
    }}>✕</button>
  </div>

  {/* Nav Tab */}
  <div style={{ display: "flex", margin: "0 16px 14px", background: "#EAECEF", borderRadius: 12, padding: 4, gap: 4 }}>
    {[["home", "홈"], ["collection", "내 컬렉션"]].map(([k, l]) => (
      <button key={k} onClick={() => setTab(k)} style={{
        flex: 1, height: 36, borderRadius: 9, border: "none", cursor: "pointer",
        background: tab === k ? "#fff" : "transparent",
        color: tab === k ? "#191F28" : "#8B95A1",
        fontSize: 13, fontWeight: 700,
        boxShadow: tab === k ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.18s",
      }}>{l}</button>
    ))}
  </div>

  {tab === "home" ? (
    <>
      {/* 자산 요약 */}
      <div style={{
        margin: "0 16px 12px",
        background: "linear-gradient(135deg,#1A2340 0%,#0F3460 100%)",
        borderRadius: 20, padding: "20px 22px",
      }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>내 컬렉션 추정 자산</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>
          {totalValue > 0 ? fmt(totalValue) : "—"}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
          {foundIds.length}개 수집 · 최근 거래가 기준 추정
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 3 }}>🔥 연속 스캔</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#FFD54F" }}>{streak}일째</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 3 }}>오늘 스캔</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: scansLeft > 0 ? "#80CBC4" : "#EF9A9A" }}>
              {scansLeft}/{MAX_SCANS} 남음
            </div>
          </div>
        </div>
      </div>

      {/* 오늘의 주목 동전 */}
      <div style={{
        margin: "0 16px 12px", background: "#fff", borderRadius: 20,
        padding: "22px 22px 20px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#B0B8C1", marginBottom: 14 }}>오늘의 주목 동전</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Coin3D coin={heroCoin} size={90} spin />
          <div style={{ flex: 1 }}>
            <Badge label={heroCoin.grade} color={heroCoin.gradeColor} small />
            <div style={{ fontSize: 17, fontWeight: 900, color: "#191F28", marginTop: 6 }}>
              {heroCoin.year}년 {heroCoin.denom}원
            </div>
            <div style={{ fontSize: 13, color: "#8B95A1", marginTop: 3 }}>
              단 {heroCoin.issued.toLocaleString()}개 발행
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: heroCoin.gradeColor, marginTop: 5 }}>
              최근 거래가 {fmt(heroCoin.recentPrice)}
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 14, padding: "10px 14px", background: "#F8F9FA", borderRadius: 10,
          fontSize: 11, color: "#8B95A1", lineHeight: 1.6,
        }}>
          ℹ️ {heroCoin.priceNote}
        </div>
      </div>

      {/* 발견 확률 */}
      <div style={{
        margin: "0 16px 12px", background: "#fff", borderRadius: 20,
        padding: "20px 22px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#191F28", marginBottom: 16 }}>📊 발견 확률</div>
        {COINS.filter(c => c.grade !== "일반").slice(0, 3).map((c, i, arr) => (
          <div key={c.id}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <MiniCoin coin={c} size={40} found />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#191F28" }}>{c.year}년 {c.denom}원</div>
                  <div style={{ fontSize: 11, color: "#B0B8C1", marginTop: 1 }}>발행 {c.issued.toLocaleString()}개</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: c.gradeColor }}>{c.probText}</div>
                <div style={{ fontSize: 11, color: "#B0B8C1", marginTop: 1 }}>{fmt(c.recentPrice)}</div>
              </div>
            </div>
            {i < arr.length - 1 && <Divider />}
          </div>
        ))}
      </div>

      {/* 스트릭 보상 */}
      <div style={{
        margin: "0 16px 12px", background: "#FFFDE7", borderRadius: 16,
        padding: "16px 18px", border: "1px solid #FFE082",
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#F59E0B", marginBottom: 10 }}>🔥 연속 스캔 보상</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ day: 1, label: "1일", reward: "기본" }, { day: 3, label: "3일", reward: "희귀↑" }, { day: 7, label: "7일", reward: "전설↑↑" }].map(s => (
            <div key={s.day} style={{
              flex: 1, textAlign: "center", padding: "10px 4px", borderRadius: 10,
              background: streak >= s.day ? "#FFF8E1" : "#fff",
              border: `1.5px solid ${streak >= s.day ? "#FFD54F" : "#E5E8EB"}`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: streak >= s.day ? "#F59E0B" : "#B0B8C1" }}>{s.label}</div>
              <div style={{ fontSize: 10, color: "#8B95A1", marginTop: 2 }}>{s.reward}</div>
              <div style={{ fontSize: 14, marginTop: 3 }}>{streak >= s.day ? "✅" : "🔒"}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  ) : (
    <div style={{ margin: "0 16px" }}>
      {/* 자산 요약 */}
      <div style={{
        background: "#fff", borderRadius: 20, padding: "20px 22px",
        marginBottom: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
      }}>
        <div style={{ fontSize: 13, color: "#8B95A1", marginBottom: 6 }}>컬렉션 추정 자산</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#3182F6", letterSpacing: -1 }}>
          {totalValue > 0 ? fmt(totalValue) : "—"}
        </div>
        <div style={{ fontSize: 12, color: "#B0B8C1", marginTop: 4 }}>최근 거래가 기준 · 실제 판매가와 다를 수 있어요</div>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#8B95A1" }}>도감 진행도</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#3182F6" }}>{foundIds.length}/{COINS.length}</span>
          </div>
          <div style={{ height: 6, background: "#F2F4F6", borderRadius: 99 }}>
            <div style={{
              height: "100%", width: `${(foundIds.length / COINS.length) * 100}%`,
              background: "linear-gradient(90deg,#3182F6,#5CC8FF)",
              borderRadius: 99, transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      </div>

      {/* 수집한 동전 리스트 */}
      {foundIds.length > 0 && (
        <div style={{
          background: "#fff", borderRadius: 20, padding: "20px 22px",
          marginBottom: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#191F28", marginBottom: 14 }}>수집한 동전</div>
          {foundIds.map((id, i) => {
            const c = COINS.find(x => x.id === id);
            if (!c) return null;
            return (
              <div key={id}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0" }}>
                  <MiniCoin coin={c} size={48} found />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#191F28" }}>{c.year}년 {c.denom}원</div>
                    <div style={{ fontSize: 12, color: "#B0B8C1", marginTop: 2 }}>발행 {c.issued.toLocaleString()}개</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Badge label={c.grade} color={c.gradeColor} small />
                    <div style={{ fontSize: 13, fontWeight: 800, color: c.gradeColor, marginTop: 4 }}>
                      {fmt(c.recentPrice)}
                    </div>
                  </div>
                </div>
                {i < foundIds.length - 1 && <Divider />}
              </div>
            );
          })}
        </div>
      )}

      {/* 전체 도감 그리드 */}
      <div style={{
        background: "#fff", borderRadius: 20, padding: "20px",
        marginBottom: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#191F28" }}>희귀 동전 도감</span>
          <span style={{ fontSize: 12, color: "#B0B8C1" }}>스캔으로 해금</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px 0" }}>
          {COINS.map(coin => {
            const found = foundIds.includes(coin.id);
            return (
              <div key={coin.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 2px" }}>
                <MiniCoin coin={coin} size={52} found={found} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: found ? "#191F28" : "#B0B8C1" }}>{coin.year}년</div>
                  <div style={{ fontSize: 10, color: "#B0B8C1" }}>{coin.denom}원</div>
                </div>
                {found ? <Badge label={coin.grade} color={coin.gradeColor} small /> : <span style={{ fontSize: 13 }}>🔒</span>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16, paddingTop: 14, borderTop: "1px solid #F2F4F6", flexWrap: "wrap" }}>
          {[["전설", "#FF8A65"], ["희귀", "#9575CD"], ["레어", "#5C9BF5"], ["일반", "#90A4AE"]].map(([g, c]) => (
            <div key={g} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
              <span style={{ fontSize: 11, color: "#8B95A1" }}>{g}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}

  {/* FAB */}
  <input ref={fileRef} type="file" accept="image/*" capture="environment"
    style={{ display: "none" }} onChange={handleScan} />
  <div style={{
    position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
    width: "100%", maxWidth: 390, padding: "12px 16px 34px",
    background: "linear-gradient(transparent, #F7F8FA 40%)", zIndex: 200,
  }}>
    {scansLeft <= 0 ? (
      <div style={{
        width: "100%", height: 54, borderRadius: 14, background: "#F2F4F6",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 700, color: "#8B95A1",
      }}>오늘 스캔 횟수를 모두 사용했어요 🌙</div>
    ) : (
      <button
        onClick={() => !scanning && fileRef.current?.click()}
        disabled={scanning}
        style={{
          width: "100%", height: 54, borderRadius: 14,
          background: scanning ? "#D1D6DB" : "#3182F6",
          border: "none", color: "#fff", fontSize: 16, fontWeight: 700,
          cursor: scanning ? "not-allowed" : "pointer",
          boxShadow: scanning ? "none" : "0 6px 20px rgba(49,130,246,0.32)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "background 0.2s",
        }}
      >
        {scanning
          ? <><span style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}>⏳</span> 스캔 중...</>
          : <><span>🔍</span> 내 동전 스캔하기 ({scansLeft}회 남음)</>}
      </button>
    )}
  </div>

  {/* Result Sheet */}
  {scanResult && (
    <ResultSheet
      result={scanResult}
      onClose={() => setScanResult(null)}
      onSave={handleSave}
      alreadySaved={alreadySaved}
    />
  )}
</div>
```

);
}
import { Button } from '@toss/tds-mobile';
 
const App = () => <Button>버튼</Button>;
