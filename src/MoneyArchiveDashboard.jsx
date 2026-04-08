import { useState, useRef } from "react";


const COINS = [
  { id: "c1", year: 1998, denom: 500, grade: "전설", gradeColor: "#FF8A65", price: 5000000, pastel: "#FFF9C4", pastelDark: "#FBC02D", icon: "🌟", iconBack: "🦅" },
  { id: "c2", year: 1966, denom: 10, grade: "희귀", gradeColor: "#9575CD", price: 1000000, pastel: "#F3E5F5", pastelDark: "#CE93D8", icon: "🏛️", iconBack: "🕊️" },
  { id: "c3", year: 1970, denom: 100, grade: "레어", gradeColor: "#5C9BF5", price: 150000, pastel: "#E3F2FD", pastelDark: "#90CAF9", icon: "⚓", iconBack: "🌊" },
  { id: "c4", year: 1982, denom: 500, grade: "레어", gradeColor: "#5C9BF5", price: 80000, pastel: "#E8F5E9", pastelDark: "#A5D6A7", icon: "🌿", iconBack: "🍃" },
  { id: "c5", year: 2006, denom: 10, grade: "일반", gradeColor: "#90A4AE", price: 5000, pastel: "#ECEFF1", pastelDark: "#B0BEC5", icon: "⭕", iconBack: "◯" },
  { id: "c6", year: 1983, denom: 50, grade: "레어", gradeColor: "#5C9BF5", price: 30000, pastel: "#FFF8E1", pastelDark: "#FFE082", icon: "🌸", iconBack: "🌺" },
  { id: "c7", year: 1991, denom: 100, grade: "레어", gradeColor: "#5C9BF5", price: 25000, pastel: "#FCE4EC", pastelDark: "#F48FB1", icon: "🎋", iconBack: "🎍" },
  { id: "c8", year: 2001, denom: 500, grade: "일반", gradeColor: "#90A4AE", price: 3000, pastel: "#ECEFF1", pastelDark: "#CFD8DC", icon: "⭕", iconBack: "◯" },
];

const RARE_DB = { 1998: COINS[0], 1966: COINS[1], 1970: COINS[2] };

const USER_NAME = "사용자";
const doShare = async (isSuccess) => {
  const text = isSuccess
    ? `${USER_NAME}님이 행운의 동전을 찾았어요! 지갑에 있는 가능성들을 확인해보시겠어요?`
    : `지갑에 있는 가능성들을 확인해보시겠어요?`;
  try {
    if (navigator.share) await navigator.share({ title: "화폐 아카이브", text, url: window.location.href });
    else { await navigator.clipboard.writeText(text); alert("복사되었어요!"); }
  } catch (_) { }
};





// ─── 미니 동전 ───────────────────────────────────────────────────────────────
const MiniCoin = ({ coin, size = 52, isFound = false }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", background: coin.pastelDark,
    opacity: isFound ? 1 : 0.3, filter: isFound ? "none" : "grayscale(1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.07)", flexShrink: 0,
    transition: "opacity 0.4s, filter 0.4s"
  }}>
    <div style={{
      width: size * 0.82, height: size * 0.82, borderRadius: "50%", background: coin.pastel,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <span style={{ fontSize: size * 0.36 }}>{coin.icon}</span>
    </div>
  </div>
);

const Badge = ({ label, color }) => (
  <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700, color: "#fff", background: color }}>
    {label}
  </span>
);

const GridCoin = ({ coin, found }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "12px 4px" }}>
    <MiniCoin coin={coin} size={52} isFound={found} />
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: found ? "#191F28" : "#C4CDD5" }}>{coin.year}년</div>
      <div style={{ fontSize: 10, color: "#8B95A1" }}>{coin.denom}원</div>
    </div>
    {found
      ? <Badge label={coin.grade} color={coin.gradeColor} />
      : <span style={{ fontSize: 12, color: "#D1D6DB" }}>🔒</span>}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MoneyArchiveDashboard() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [foundIds, setFoundIds] = useState([]);
  const fileRef = useRef(null);

  const handleScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setScanResult(null); // 이전 결과 지우고 시작!
    try {
      // 1. 파일을 Base64 문자열로 변환 (Promise 기반)
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

      // 2. 서버 API로 분석 요청 전송
      const response = await fetch("/api/analyze-coin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) throw new Error("API 요청 실패");

      const { year } = await response.json();
      const cleanYear = year.replace(/[^0-9]/g, ''); // 숫자 말고는 다 지워버려!
      const yearNum = parseInt(cleanYear);

      // 3. 결과 처리
      if (!yearNum || yearNum === 0 || isNaN(yearNum)) {
        setScanResult({ isRare: false, coin: null, year: "인식 실패" });
      } else {
        const coin = RARE_DB[yearNum] || null;
        const result = coin ? { isRare: true, coin, year: yearNum } : { isRare: false, coin: null, year: yearNum };

        // 희귀 동전일 경우 토스 햅틱 피드백
        if (result.isRare && window.toss?.haptic) {
          window.toss.haptic("success");
        }

        setScanResult(result);
        if (result.isRare) setFoundIds((p) => (p.includes(coin.id) ? p : [...p, coin.id]));
      }
    } catch (error) {
      console.error("Scan Error:", error);
      alert("이미지 분석 중 오류가 발생했습니다.");
    } finally {
      setScanning(false);
      e.target.value = ""; // 입력창을 비워줘야 다음 스캔이 작동해!
    }
  };

  return (
    <div style={{
      maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F7F8FA",
      fontFamily: "'Pretendard',system-ui,-apple-system,sans-serif", paddingBottom: 104
    }}>

      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px 10px" }}>
        <div style={{ width: 36 }} />
        <span style={{ fontSize: 17, fontWeight: 700, color: "#191F28" }}>희귀 동전 찾기</span>
        <button style={{
          width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.05)",
          border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700
        }}>✕</button>
      </div>

      {/* 히어로 */}
      <div style={{
        margin: "6px 16px 14px", background: "#fff", borderRadius: 24,
        padding: "36px 24px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 22,
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)"
      }}>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#B0B8C1", fontWeight: 600, letterSpacing: 0.4, marginBottom: 8 }}>
            1998년 500원 현재 시세
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#3182F6", letterSpacing: -1, lineHeight: 1.2, marginBottom: 8 }}>
            지갑 속에 오백만원이?
          </div>
          <div style={{ fontSize: 14, color: "#8B95A1", lineHeight: 1.7 }}>
            단 <strong style={{ color: "#191F28", fontWeight: 800 }}>8,000개</strong>만 발행된 전설의 동전<br />
            지금 내 지갑에 있을 수도 있어요
          </div>
        </div>
        <div style={{
          background: "#F7F8FA", borderRadius: 99, padding: "9px 22px",
          display: "flex", alignItems: "center", gap: 6, border: "1px solid #EAECEF"
        }}>
          <span style={{ fontSize: 13, color: "#8B95A1", fontWeight: 500 }}>내 컬렉션</span>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#191F28" }}>{foundIds.length}</span>
          <span style={{ fontSize: 13, color: "#D1D6DB" }}>/</span>
          <span style={{ fontSize: 13, color: "#8B95A1" }}>{COINS.length}개 해금</span>
        </div>
      </div>

      {/* 컬렉션 */}
      <div style={{
        margin: "0 16px 14px", background: "#fff", borderRadius: 24, padding: "22px 20px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#191F28" }}>희귀 동전 컬렉션</span>
          {/* ✅ 스캔으로 아이템 해제 */}
          <span style={{ fontSize: 12, color: "#B0B8C1" }}>스캔으로 아이템 해제</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "4px 0" }}>
          {COINS.map(coin => <GridCoin key={coin.id} coin={coin} found={foundIds.includes(coin.id)} />)}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 18, paddingTop: 16, borderTop: "1px solid #F2F4F6" }}>
          {[["전설", "#FF8A65"], ["희귀", "#9575CD"], ["레어", "#5C9BF5"], ["일반", "#90A4AE"]].map(([g, c]) => (
            <div key={g} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
              <span style={{ fontSize: 11, color: "#8B95A1" }}>{g}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* 팁 안내 */}
      <div style={{ textAlign: "center", margin: "20px 0 10px", color: "#8B95A1", fontSize: 13, fontWeight: 500 }}>
        💡 팁: 동전의 빛 반사를 피해서 수평으로 찍어주세요.
      </div>

      {/* 이용 안내 및 주의사항 */}
      <div style={{ margin: "32px 24px 20px", color: "#ADB5BD", fontSize: 12, lineHeight: 1.8 }}>
        <div style={{ fontWeight: 700, marginBottom: 10, color: "#8B95A1", fontSize: 13 }}>이용 안내 및 주의사항</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
          <span style={{ flexShrink: 0 }}>1.</span>
          <span>탐색 범위: 본 서비스는 현재 8종의 주요 희귀 동전을 우선적으로 판별하고 있습니다.</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
          <span style={{ flexShrink: 0 }}>2.</span>
          <span>인식 정확도: AI 스캔 기술은 조명과 동전 상태에 따라 오차가 있을 수 있으므로, 참고용으로만 활용해주세요.</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ flexShrink: 0 }}>3.</span>
          <span>가치보증: 앱 내 표시된 시세는 시장 사황에 따른 참고 가격이며, 실제 가격은 보장하지 않습니다.</span>
        </div>
      </div>

      {/* FAB */}
      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        style={{ display: "none" }} onChange={handleScan} />
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 390, padding: "12px 16px 34px",
        background: "linear-gradient(transparent, #F7F8FA 38%)", zIndex: 200
      }}>
        <button
          onClick={() => !scanning && fileRef.current?.click()}
          style={{
            width: "100%", height: 56, borderRadius: 16,
            background: scanning ? "#D1D6DB" : "#3182F6", border: "none", color: "#fff",
            fontSize: 16, fontWeight: 700, cursor: scanning ? "not-allowed" : "pointer",
            boxShadow: scanning ? "none" : "0 6px 20px rgba(49,130,246,0.32)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}
          onMouseDown={e => { if (!scanning) e.currentTarget.style.background = "#1B64DA"; }}
          onMouseUp={e => { if (!scanning) e.currentTarget.style.background = "#3182F6"; }}
        >
          {scanning
            ? <><span style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}>⏳</span> 스캔 중...</>
            : <>🔍 내 동전 스캔하기</>}
        </button>
      </div>

      {/* 모달 */}
      {scanResult && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={() => setScanResult(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{
            position: "relative", width: "100%", maxWidth: 390, background: "#fff",
            borderRadius: "24px 24px 0 0", padding: "30px 24px 44px",
            animation: "sheetUp 0.35s cubic-bezier(0.34,1.56,0.64,1)"
          }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E5E8EB", margin: "0 auto 24px" }} />
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              {scanResult.isRare ? (
                <>

                  <div style={{ fontSize: 13, fontWeight: 700, color: scanResult.coin.gradeColor, marginTop: 16, marginBottom: 4 }}>
                    🎉 희귀 동전 발견!
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#191F28" }}>
                    {scanResult.year}년 {scanResult.coin.denom}원
                  </div>
                  <div style={{ fontSize: 14, color: "#8B95A1", marginTop: 6 }}>
                    최대 <span style={{ color: scanResult.coin.gradeColor, fontWeight: 700 }}>
                      {scanResult.coin.price.toLocaleString()}원
                    </span> 가치
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 56 }}>😅</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#191F28", marginTop: 12 }}>평범한 동전이에요</div>
                  <div style={{ fontSize: 14, color: "#8B95A1", marginTop: 6 }}>{scanResult.year}년 · 다시 찾아볼까요?</div>
                </>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => doShare(scanResult.isRare)}
                style={{
                  width: "100%", height: 48, borderRadius: 12, background: "#F2F4F6",
                  border: "none", color: "#4E5968", fontSize: 14, fontWeight: 700, cursor: "pointer"
                }}>
                🔗 친구에게 공유하기
              </button>
              <button onClick={() => setScanResult(null)}
                style={{
                  width: "100%", height: 56, borderRadius: 16,
                  background: scanResult.isRare ? "#3182F6" : "#191F28",
                  border: "none", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer"
                }}>
                {scanResult.isRare ? "컬렉션에 추가하기" : "다시 스캔하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`

        @keyframes sheetUp     { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes spin        { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
