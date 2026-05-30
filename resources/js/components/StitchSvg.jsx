import React from "react";

function StitchSvg({ points }) {
    const safePoints = Number(points) || 0;
    const maxPoints = 100;

    const currentAbsolute = Math.min(Math.abs(safePoints), maxPoints);
    const fillPercent = (currentAbsolute / maxPoints) * 100;
    const fillOffset = 100 - fillPercent;

    const fillColor = safePoints < 0 ? "#ff4d4d" : "#1abc9c";

    return (
        <div
            style={{
                width: "250px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* ТЕХНИЧЕСКИЙ СЧЕТЧИК ДЛЯ ПРОВЕРКИ */}
            <div
                style={{
                    backgroundColor: "#2c3e50",
                    color: "#fff",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                <div>📊 Входящие очки: {points}</div>
                <div>🛡 Безопасные очки: {safePoints}</div>
                <div>📈 Процент заливки: {fillPercent}%</div>
                <div>📉 Смещение (Offset): {fillOffset}%</div>
                <div>
                    🎨 Текущий цвет:{" "}
                    <span style={{ color: fillColor, fontWeight: "bold" }}>
                        {fillColor}
                    </span>
                </div>
            </div>

            <svg viewBox="0 0 200 200" width="100%" height="250px">
                <defs>
                    <linearGradient
                        id="stitch-gradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop offset={`${fillOffset}%`} stopColor="#f0f0f0" />
                        <stop offset={`${fillOffset}%`} stopColor={fillColor} />
                    </linearGradient>
                </defs>

                <g
                    fill="url(#stitch-gradient)"
                    stroke="#2c3e50"
                    strokeWidth="4"
                    strokeLinejoin="round"
                >
                    {/* Левое ухо */}
                    <path d="M 60,60 C 20,40 10,10 30,30 C 50,50 60,70 70,80 Z" />
                    {/* Правое ухо */}
                    <path d="M 140,60 C 180,40 190,10 170,30 C 150,50 140,70 130,80 Z" />
                    {/* Тело */}
                    <rect x="75" y="120" width="50" height="50" rx="15" />
                    {/* Голова */}
                    <circle cx="100" cy="90" r="40" />
                    {/* Левая лапа */}
                    <line
                        x1="75"
                        y1="130"
                        x2="50"
                        y2="140"
                        stroke="#2c3e50"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    {/* Правая лапа */}
                    <line
                        x1="125"
                        y1="130"
                        x2="150"
                        y2="140"
                        stroke="#2c3e50"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    {/* Ножки */}
                    <circle cx="85" cy="175" r="10" />
                    <circle cx="115" cy="175" r="10" />
                </g>

                {/* Лицо */}
                <g fill="none" stroke="#2c3e50" strokeWidth="3">
                    <circle cx="85" cy="85" r="6" fill="#fff" />
                    <circle cx="115" cy="85" r="6" fill="#fff" />
                    <path
                        d="M 80,105 Q 100,115 120,105"
                        strokeLinecap="round"
                    />
                    <path d="M 90,108 L 93,105 M 100,110 L 100,105 M 110,108 L 107,105" />
                </g>
            </svg>
        </div>
    );
}

export default StitchSvg;
