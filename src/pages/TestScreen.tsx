import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { testsList } from "../data/testLists";

interface Question {
  question: string;
  answers: string[];
}

interface ShuffledQuestion extends Question {
  correct: string; // правильный ответ сохраняем отдельно
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function TestScreen() {
  const { slug } = useParams();
  const testName = testsList.find((t) => t.path === slug)?.name;
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  // Загружаем JSON из src/data
  useEffect(() => {
    if (!slug) return;

    import(`../data/${slug}.json`)
      .then((module) => {
        const data = Array.isArray(module.default)
          ? module.default
          : Array.isArray(module)
          ? module
          : [];

        if (data.length === 0) {
          console.error(`⚠️ Файл ${slug}.json не содержит вопросов`);
          return;
        }

        // Перемешиваем ответы и сохраняем правильный вариант
        const randomized: ShuffledQuestion[] = data.map((q: Question) => {
          const shuffled = shuffle(q.answers);
          return {
            ...q,
            answers: shuffled,
            correct: q.answers[0], // сохраняем исходный правильный вариант
          };
        });

        setQuestions(randomized);
        setSelected({});
        setFinished(false);
        setShowResult(false);
      })
      .catch((err) => console.error("Ошибка загрузки файла:", err));
  }, [slug]);

  const handleSelect = (qIndex: number, answer: string) => {
    if (finished) return;
    setSelected((prev) => ({ ...prev, [qIndex]: answer }));
  };

  const correctCount = questions.reduce(
    (acc, q, i) => acc + (selected[i] === q.correct ? 1 : 0),
    0
  );

  const handleFinish = () => {
    setFinished(true);
    setShowResult(true);
  };

  if (!questions.length)
    return <h2 style={styles.loading}>Загрузка теста...</h2>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{testName}</h1>

      {questions.map((q, i) => {
        const selectedAnswer = selected[i];

        return (
          <div key={i} style={styles.card}>
            <h2>
              {i + 1}. {q.question}
            </h2>
            <div style={styles.answers}>
              {q.answers.map((ans, j) => {
                const isCorrect = ans === q.correct;
                const isSelected = ans === selectedAnswer;

                let bg = "#f0f0f0";
                if (finished) {
                  if (isCorrect) bg = "#b6e6a0"; // зелёный — правильный
                  else if (isSelected && !isCorrect) bg = "#f5b7b1"; // красный — неправильный
                } else if (isSelected) {
                  bg = "#dcdcdc"; // выделяем выбранный ответ до завершения
                }

                return (
                  <button
                    key={j}
                    onClick={() => handleSelect(i, ans)}
                    disabled={finished}
                    style={{ ...styles.answerButton, background: bg }}
                  >
                    {ans}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!finished && (
        <button style={styles.finishButton} onClick={handleFinish}>
          Завершить тест
        </button>
      )}

      {showResult && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Результат</h2>
            <p>
              Вы ответили правильно на <b>{correctCount}</b> из{" "}
              <b>{questions.length}</b> вопросов.
            </p>
            <button
              style={styles.closeButton}
              onClick={() => setShowResult(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    padding: 20,
    fontFamily: "sans-serif",
  },
  title: { textAlign: "center", marginBottom: 30 },
  loading: { textAlign: "center", marginTop: 100 },
  card: {
    background: "#fff",
    borderRadius: 10,
    padding: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: 20,
  },
  answers: { display: "flex", flexDirection: "column", gap: 10 },
  answerButton: {
    padding: 12,
    borderRadius: 8,
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: 16,
    transition: "0.2s",
  },
  finishButton: {
    display: "block",
    margin: "20px auto",
    padding: "10px 20px",
    fontSize: 18,
    borderRadius: 8,
    background: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: 30,
    borderRadius: 12,
    width: 300,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 15,
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};
