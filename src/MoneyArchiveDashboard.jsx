import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";

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

const RARE_DB = COINS.reduce((acc, coin) => ({ ...acc, [coin.year]: coin }), {});

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

// ─── 파스텔 동전 앞면 (아이콘만, 숫자 없음) ──────────────────────────────────
const PastelFront = ({ coin, size }) => (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id={`pf${coin.id}`} cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
                <stop offset="100%" stopColor={coin.pastel} stopOpacity="1" />
            </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="96" fill={coin.pastelDark} opacity="0.45" />
        <circle cx="100" cy="100" r="88" fill={`url(#pf${coin.id})`} />
        <circle cx="100" cy="100" r="88" fill="none" stroke={coin.pastelDark} strokeWidth="2.5" opacity="0.6" />
        <circle cx="100" cy="100" r="74" fill="none" stroke={coin.pastelDark} strokeWidth="1.5" opacity="0.35" />
        <ellipse cx="78" cy="62" rx="24" ry="11" fill="rgba(255,255,255,0.65)" transform="rotate(-20 78 62)" />
        {/* 아이콘만, 숫자 없음 */}
        <text x="100" y="105" textAnchor="middle" fontSize="64" dominantBaseline="middle">{coin.icon}</text>
    </svg>
);

// ─── 파스텔 동전 뒷면 ────────────────────────────────────────────────────────
const PastelBack = ({ coin, size }) => (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id={`pb${coin.id}`} cx="60%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
                <stop offset="100%" stopColor={coin.pastel} stopOpacity="1" />
            </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="96" fill={coin.pastelDark} opacity="0.45" />
        <circle cx="100" cy="100" r="88" fill={`url(#pb${coin.id})`} />
        <circle cx="100" cy="100" r="88" fill="none" stroke={coin.pastelDark} strokeWidth="2.5" opacity="0.6" />
        <circle cx="100" cy="100" r="74" fill="none" stroke={coin.pastelDark} strokeWidth="1.5" opacity="0.35" />
        <ellipse cx="122" cy="62" rx="24" ry="11" fill="rgba(255,255,255,0.60)" transform="rotate(20 122 62)" />
        <text x="100" y="105" textAnchor="middle" fontSize="64" dominantBaseline="middle">{coin.iconBack}</text>
        <text x="100" y="162" textAnchor="middle" fontSize="16" fontWeight="700" letterSpacing="2"
            fontFamily="'Pretendard',system-ui,sans-serif" fill={coin.gradeColor} opacity="0.5">{coin.year}</text>
    </svg>
);

// ─── 3D 회전 래퍼 ────────────────────────────────────────────────────────────
const PastelCoin3D = ({ coin, size = 160, spinning = true }) => (
    <div style={{ width: size, height: size, perspective: size * 5 }}>
        <div style={{
            width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d",
            animation: spinning ? "coinSpin 5s linear infinite" : "none",
            filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.08))"
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
    const [foundIds, setFoundIds] = useState(() => {
        const saved = localStorage.getItem("found_coin_ids");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("found_coin_ids", JSON.stringify(foundIds));
    }, [foundIds]);
    const fileRef = useRef(null);

    const handleScan = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setScanning(true);
        try {
            // Tesseract.js를 사용하여 실제 OCR 수행
            const { data: { text } } = await Tesseract.recognize(file, "eng", {
                tessedit_char_whitelist: "0123456789",
            });

            // 4자리 숫자(연도) 추출 (1950~2025년 사이의 값 우선)
            const years = text.match(/\d{4}/g);
            const year = years ? parseInt(years.find(y => parseInt(y) >= 1950 && parseInt(y) <= 2025) || years[0]) : null;

            if (!year) {
                setScanResult({ isRare: false, coin: null, year: "알 수 없음" });
            } else {
                const coin = RARE_DB[year] || null;
                const result = coin ? { isRare: true, coin, year } : { isRare: false, coin: null, year };
                setScanResult(result);
                if (result.isRare) setFoundIds(p => p.includes(coin.id) ? p : [...p, coin.id]);
            }
        } catch (error) {
            console.error("OCR Error:", error);
            alert("이미지 분석 중 오류가 발생했습니다.");
        } finally {
            setScanning(false);
            e.target.value = "";
        }
    };

    return (
        <div style={{
            maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#F7F8FA",
            fontFamily: "'Pretendard',system-ui,-apple-system,sans-serif", paddingBottom: 104
        }}>

            {/* 헤더 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px 10px" }}>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.05)",
                        border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700
                    }}>✕</button>
                <span style={{ fontSize: 17, fontWeight: 700, color: "#191F28" }}>희귀 동전 찾기</span>
                <div style={{ width: 36 }} />
            </div>

            {/* 히어로 */}
            <div style={{
                margin: "6px 16px 14px", background: "#fff", borderRadius: 24,
                padding: "36px 24px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 22,
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)"
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <PastelCoin3D coin={COINS[0]} size={164} spinning />
                    <div style={{
                        width: 72, height: 12, marginTop: 6,
                        background: "radial-gradient(ellipse, rgba(0,0,0,0.08) 0%, transparent 70%)",
                        borderRadius: "50%", animation: "shadowFloat 5s linear infinite"
                    }} />
                </div>
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
                    <span style={{ fontSize: 13, color: "#8B95A1" }}>{COINS.length}개 코인</span>
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
        @keyframes coinSpin    { from{transform:rotateY(0deg)} to{transform:rotateY(360deg)} }
        @keyframes shadowFloat { 0%,100%{transform:scaleX(1);opacity:.8} 50%{transform:scaleX(.65);opacity:.4} }
        @keyframes sheetUp     { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes spin        { to{transform:rotate(360deg)} }
      `}</style>
        </div>
    );
}
