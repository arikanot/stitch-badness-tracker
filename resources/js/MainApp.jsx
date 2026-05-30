import React, { useState, useEffect } from "react";
import StitchSvg from "./components/StitchSvg";

function MainApp() {
    const [points, setPoints] = useState(0);
    const [history, setHistory] = useState([]);
    const [description, setDescription] = useState("");
    const [pointsInput, setPointsInput] = useState(10);
    const [loading, setLoading] = useState(true);

    // Загружаем данные из Laravel API при старте страницы
    useEffect(() => {
        fetch("/api/stitch/status")
            .then((res) => res.json())
            .then((data) => {
                setPoints(data.total_points);
                setHistory(data.history);
                setLoading(false);
            })
            .catch((err) => console.error("Ошибка загрузки данных:", err));
    }, []);

    // Отправка формы на бэкенд
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description.trim()) return;

        fetch("/api/stitch/log", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                description: description,
                points: parseInt(pointsInput),
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Сервер ответил ошибкой 500");
                }
                return res.json();
            })
            .then((data) => {
                // Проверяем, что бэкенд прислал то, что нужно
                if (data && typeof data.total_points !== "undefined") {
                    setPoints(data.total_points);
                    setHistory(data.history || []);
                    setDescription("");
                }
            })
            .catch((err) => {
                console.error("Ошибка при сохранении:", err);
                alert(
                    "Ой! Бэкенд Laravel упал с ошибкой 500. Проверь логи Ларавеля!",
                );
            });
    };

    if (loading) {
        return (
            <div
                style={{
                    textAlign: "center",
                    marginTop: "50px",
                    fontFamily: "sans-serif",
                }}
            >
                Загрузка Стича...
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Stitch Badness Tracker</h1>

            <div style={styles.mainLayout}>
                {/* Левая колонка: Стич и его счетчик */}
                <div style={styles.card}>
                    <StitchSvg points={Number(points) || 0} />
                    <h2 style={styles.score}>
                        Уровень очков:{" "}
                        <span
                            style={
                                points >= 0 ? styles.goodText : styles.badText
                            }
                        >
                            {points}
                        </span>
                    </h2>
                    <p style={styles.statusLabel}>
                        {points >= 0
                            ? "😇 Стич — паинька (Good)"
                            : "👺 Стич буянит! (Bad)"}
                    </p>
                </div>

                {/* Правая колонка: Форма и История */}
                <div style={styles.sidebar}>
                    {/* Форма добавления */}
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Что натворил Стич?</h3>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <input
                                type="text"
                                placeholder="Например: Скушал тортик без разрешения..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={styles.input}
                                required
                            />
                            <div style={styles.buttonGroup}>
                                <button
                                    type="button"
                                    onClick={() => setPointsInput(10)}
                                    style={{
                                        ...styles.btn,
                                        ...styles.btnGood,
                                        opacity: pointsInput === 10 ? 1 : 0.6,
                                    }}
                                >
                                    +10 (Молодец)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPointsInput(-20)}
                                    style={{
                                        ...styles.btn,
                                        ...styles.btnBad,
                                        opacity: pointsInput === -20 ? 1 : 0.6,
                                    }}
                                >
                                    -20 (Вредничает)
                                </button>
                            </div>
                            <button type="submit" style={styles.submitBtn}>
                                Записать поступок
                            </button>
                        </form>
                    </div>

                    {/* История */}
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>История поведения</h3>
                        <div style={styles.historyList}>
                            {history.length === 0 ? (
                                <p style={{ color: "#888" }}>
                                    Пока поступков нет...
                                </p>
                            ) : (
                                history.map((log) => (
                                    <div
                                        key={log.id}
                                        style={styles.historyItem}
                                    >
                                        <span
                                            style={
                                                log.points >= 0
                                                    ? styles.badgeGood
                                                    : styles.badgeBad
                                            }
                                        >
                                            {log.points >= 0
                                                ? `+${log.points}`
                                                : log.points}
                                        </span>
                                        <span style={styles.historyText}>
                                            {log.description}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Простые встроенные стили, чтобы всё выглядело аккуратно без сторонних библиотек
const styles = {
    container: {
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "30px 15px",
        fontFamily: '"Segoe UI", Roboto, sans-serif',
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
    },
    title: { textAlign: "center", color: "#2c3e50", marginBottom: "30px" },
    mainLayout: { display: "flex", gap: "30px", flexWrap: "wrap" },
    card: {
        flex: 1,
        minWidth: "320px",
        backgroundColor: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    sidebar: {
        flex: 1.2,
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        minWidth: "320px",
    },
    score: { fontSize: "28px", margin: "15px 0 5px 0", color: "#34495e" },
    goodText: { color: "#2ecc71", fontWeight: "bold" },
    badText: { color: "#e74c3c", fontWeight: "bold" },
    statusLabel: { fontSize: "16px", color: "#7f8c8d", margin: 0 },
    cardTitle: {
        margin: "0 0 15px 0",
        alignSelf: "flex-start",
        color: "#2c3e50",
    },
    form: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "15px",
        width: "100%",
        boxSizing: "border-box",
    },
    buttonGroup: { display: "flex", gap: "10px" },
    btn: {
        flex: 1,
        padding: "10px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        color: "#fff",
        fontSize: "14px",
    },
    btnGood: { backgroundColor: "#2ecc71" },
    btnBad: { backgroundColor: "#e74c3c" },
    submitBtn: {
        padding: "12px",
        backgroundColor: "#34495e",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
    },
    historyList: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    historyItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        borderRadius: "6px",
    },
    badgeGood: {
        backgroundColor: "#e8f8f0",
        color: "#2ecc71",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "bold",
        minWidth: "35px",
        textAlign: "center",
    },
    badgeBad: {
        backgroundColor: "#fdeaea",
        color: "#e74c3c",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "bold",
        minWidth: "35px",
        textAlign: "center",
    },
    historyText: { color: "#555", fontSize: "15px" },
};

export default MainApp;
