import React, { useState, useRef } from "react";

// --- 디자인 가이드 ---
const STYLES = {
  bg: "#F7F8FA",
  blue: "#3182F6",
  white: "#FFFFFF",
  grayText: "#8B95A1",
  mainText: "#191F28"
};

export default function App() {
  const [scanning, setScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef(null);

  const startScan = async () => {
    setScanning(true);
    await new Promise(r => setTimeout(r, 1500));
    setScanning(false);
    setShowModal(true);
  };

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", background: STYLES.bg, minHeight: "100vh", fontFamily: "sans-serif", position: "relative" }}>
      {/* 헤더 */}
      <div style={{ padding: "20px", textAlign: "center", fontWeight: "700", fontSize: "17px", color: STYLES.mainText }}>희귀 동전 찾기</div>
      
      {/* 메인 카드 */}
      <div style={{ margin: "16px", padding: "40px 20px", background: STYLES.white, borderRadius: "24px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "70px", marginBottom: "20px" }}>🪙</div>
        <h1 style={{ fontSize: "24px", fontWeight: "900", color: STYLES.blue, margin: "0 0 10px 0" }}>지갑 속 보물찾기</h1>
        <p style={{ color: STYLES.grayText, fontSize: "14px", lineHeight: "1.5" }}>내 동전의 숨겨진 가치를<br/>지금 바로 확인해보세요</p>
      </div>

      {/* 컬렉션 (토스 스타일 그리드) */}
      <div style={{ margin: "16px", padding: "20px", background: STYLES.white, borderRadius: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
          {[1998, 1966, 1970, 1982].map(year => (
            <div key={year} style={{ textAlign: "center", opacity: 0.3 }}>
              <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: "50%", background: "#eee", marginBottom: "8px" }} />
              <div style={{ fontSize: "11px", color: STYLES.grayText }}>{year}년</div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ position: "fixed", bottom: "30px", width: "100%", maxWidth: "390px", padding: "0 20px", boxSizing: "border-box" }}>
        <button 
          onClick={() => !scanning && fileRef.current?.click()}
          style={{ width: "100%", height: "56px", background: STYLES.blue, color: "#fff", border: "none", borderRadius: "16px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
        >
          {scanning ? "분석 중..." : "동전 스캔하기"}
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={startScan} />

      {/* 결과 모달 */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "30px", borderRadius: "24px", textAlign: "center", width: "80%", maxWidth: "300px" }}>
            <div style={{ fontSize: "40px" }}>😅</div>
            <h3 style={{ marginTop: "15px", color: STYLES.mainText }}>평범한 동전이에요</h3>
            <p style={{ color: STYLES.grayText, fontSize: "14px", marginTop: "8px" }}>아쉽지만 희귀 연도는 아니네요.</p>
            <button onClick={() => setShowModal(false)} style={{ marginTop: "24px", width: "100%", height: "48px", background: STYLES.mainText, color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700" }}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
