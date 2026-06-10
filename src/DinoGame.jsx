import { useCallback, useEffect, useRef, useState } from "react";

const CACTUS_VARIANTS = ["single", "double", "triple"];
const CACTUS_VIEW_BOXES = {
    single: "0 0 15 30",
    double: "0 0 26 30",
    triple: "0 0 38 30",
};
const HIGH_SCORE_STORAGE_KEY = "portfolio-dino-high-score";

function getSavedHighScore() {
    if (typeof window === "undefined") return 0;

    const savedHighScore = Number(
        window.localStorage.getItem(HIGH_SCORE_STORAGE_KEY)
    );

    return Number.isFinite(savedHighScore) ? savedHighScore : 0;
}

function DinoGame() {
    const [isJumping, setIsJumping] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [scores, setScores] = useState(() => ({
        score: 0,
        highScore: getSavedHighScore(),
    }));
    const [cactusVariantIndex, setCactusVariantIndex] = useState(0);

    const dinoRef = useRef(null);
    const cactusRef = useRef(null);
    const cactusVariant = CACTUS_VARIANTS[cactusVariantIndex];
    const cactusViewBox = CACTUS_VIEW_BOXES[cactusVariant];
    const { score, highScore } = scores;

    const resetGame = useCallback(() => {
        setGameStarted(false);
        setGameOver(false);
        setScores((currentScores) => ({
            ...currentScores,
            score: 0,
        }));
        setIsJumping(false);
        setCactusVariantIndex(0);
    }, []);

    const jump = useCallback(() => {
        if (gameOver) {
            resetGame();
            return;
        }

        if (!gameStarted) {
            setGameStarted(true);
            setScores((currentScores) => ({
                ...currentScores,
                score: 0,
            }));
        }

        if (!isJumping) {
            setIsJumping(true);

            setTimeout(() => {
                setIsJumping(false);
            }, 620);
        }
    }, [gameOver, gameStarted, isJumping, resetGame]);

    const changeCactusVariant = useCallback(() => {
        setCactusVariantIndex((currentVariant) => (
            (currentVariant + 1) % CACTUS_VARIANTS.length
        ));
    }, []);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.code === "Space" || event.code === "ArrowUp") {
                event.preventDefault();
                jump();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [jump]);

    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const scoreTimer = setInterval(() => {
            setScores((currentScores) => {
                const nextScore = currentScores.score + 1;

                return {
                    score: nextScore,
                    highScore: Math.max(currentScores.highScore, nextScore),
                };
            });
        }, 100);

        return () => clearInterval(scoreTimer);
    }, [gameStarted, gameOver]);

    useEffect(() => {
        try {
            window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(highScore));
        } catch {
            // Ignore storage failures; the live high score still works.
        }
    }, [highScore]);

    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const collisionTimer = setInterval(() => {
            const dino = dinoRef.current;
            const cactus = cactusRef.current;

            if (!dino || !cactus) return;

            const dinoBox = dino.getBoundingClientRect();
            const cactusBox = cactus.getBoundingClientRect();

            const collision =
                dinoBox.right > cactusBox.left + 10 &&
                dinoBox.left < cactusBox.right - 10 &&
                dinoBox.bottom > cactusBox.top + 8;

            if (collision) {
                setGameOver(true);
                setGameStarted(false);
            }
        }, 20);

        return () => clearInterval(collisionTimer);
    }, [gameStarted, gameOver]);

    return (
        <section className="section dino-section">
            <p className="command">
                <span className="prompt">$</span> ./play-dino
            </p>

            <div
                className={`dino-game ${gameStarted ? "running" : ""} ${
                    gameOver ? "ended" : ""
                }`}
                onClick={jump}
            >
                <div className="game-screen">
                    <div className="score-board">
                        <span>HI {String(highScore).padStart(5, "0")}</span>
                        <span>{String(score).padStart(5, "0")}</span>
                    </div>

                    {!gameStarted && !gameOver && (
                        <div className="game-message">PRESS TO START</div>
                    )}

                    {gameOver && <div className="game-message">GAME OVER</div>}

                    <svg
                        className="cloud cloud-one"
                        viewBox="0 0 56 20"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path
                            className="cloud-pixel"
                            d="M1 14H4M7 13H10V11H13V10H16V8H20V6H24V4H31V5H35V7H39V8H43V10H47V12H51V14H55M8 15H55"
                        />
                    </svg>
                    <svg
                        className="cloud cloud-two"
                        viewBox="0 0 56 20"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path
                            className="cloud-pixel"
                            d="M1 14H4M7 13H10V11H13V10H16V8H20V6H24V4H31V5H35V7H39V8H43V10H47V12H51V14H55M8 15H55"
                        />
                    </svg>
                    <svg
                        className="cloud cloud-three"
                        viewBox="0 0 56 20"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path
                            className="cloud-pixel"
                            d="M1 14H4M7 13H10V11H13V10H16V8H20V6H24V4H31V5H35V7H39V8H43V10H47V12H51V14H55M8 15H55"
                        />
                    </svg>

                    <svg
                        ref={dinoRef}
                        className={`chrome-dino ${isJumping ? "jump" : ""} ${
                            gameStarted ? "run" : ""
                        }`}
                        viewBox="0 0 22 24"
                        aria-hidden="true"
                        focusable="false"
                        preserveAspectRatio="xMinYMax meet"
                    >
                        <path
                            className="dino-fill"
                            d="M12 0H20V1H21V5H16V6H20V7H15V9H17V11H16V10H15V14H14V16H13V18H12V19H10V18H8V17H5V16H4V15H3V14H2V13H1V12H0V8H1V11H2V12H3V13H5V12H6V11H7V10H8V9H9V8H10V2H11V1H12Z"
                        />
                        <rect className="dino-cutout" x="13" y="2" width="1" height="1" />
                        <rect className="dino-cutout" x="16" y="5" width="5" height="1" />
                        <rect className="dino-cutout" x="15" y="8" width="2" height="2" />
                        <rect className="dino-fill" x="15" y="9" width="1" height="1" />

                        <g className="dino-leg leg-back">
                            <g className="leg-frame leg-extended">
                                <rect x="5" y="17" width="2" height="1" />
                                <rect x="5" y="18" width="1" height="5" />
                            </g>
                            <g className="leg-frame leg-tucked">
                                <rect x="6" y="17" width="2" height="2" />
                                <rect x="5" y="19" width="2" height="1" />
                                <rect x="5" y="20" width="1" height="2" />
                            </g>
                        </g>
                        <g className="dino-leg leg-front">
                            <g className="leg-frame leg-extended">
                                <rect x="10" y="18" width="2" height="1" />
                                <rect x="10" y="19" width="1" height="4" />
                            </g>
                            <g className="leg-frame leg-tucked">
                                <rect x="9" y="18" width="2" height="2" />
                                <rect x="8" y="20" width="2" height="1" />
                                <rect x="7" y="21" width="2" height="1" />
                            </g>
                        </g>
                    </svg>

                    <svg
                        ref={cactusRef}
                        className={`chrome-cactus cactus-${cactusVariant} ${
                            gameStarted ? "move" : ""
                        }`}
                        viewBox={cactusViewBox}
                        aria-hidden="true"
                        focusable="false"
                        preserveAspectRatio="xMidYMax meet"
                        onAnimationIteration={changeCactusVariant}
                    >
                        {cactusVariant === "single" && (
                            <g className="cactus-fill">
                                <rect x="6" y="2" width="3" height="26" />
                                <rect x="5" y="28" width="5" height="1" />
                                <rect x="1" y="10" width="2" height="9" />
                                <rect x="2" y="17" width="5" height="2" />
                                <rect x="11" y="7" width="2" height="10" />
                                <rect x="8" y="15" width="5" height="2" />
                            </g>
                        )}

                        {cactusVariant === "double" && (
                            <g className="cactus-fill">
                                <rect x="4" y="3" width="3" height="25" />
                                <rect x="3" y="28" width="5" height="1" />
                                <rect x="0" y="12" width="2" height="8" />
                                <rect x="1" y="18" width="4" height="2" />
                                <rect x="9" y="8" width="2" height="9" />
                                <rect x="6" y="15" width="5" height="2" />
                                <rect x="18" y="8" width="3" height="20" />
                                <rect x="17" y="28" width="5" height="1" />
                                <rect x="14" y="16" width="2" height="7" />
                                <rect x="15" y="21" width="4" height="2" />
                                <rect x="23" y="13" width="2" height="8" />
                                <rect x="20" y="19" width="5" height="2" />
                            </g>
                        )}

                        {cactusVariant === "triple" && (
                            <g className="cactus-fill">
                                <rect x="2" y="8" width="3" height="20" />
                                <rect x="1" y="28" width="5" height="1" />
                                <rect x="7" y="15" width="2" height="7" />
                                <rect x="4" y="20" width="5" height="2" />
                                <rect x="15" y="2" width="3" height="26" />
                                <rect x="14" y="28" width="5" height="1" />
                                <rect x="10" y="12" width="2" height="8" />
                                <rect x="11" y="18" width="5" height="2" />
                                <rect x="20" y="8" width="2" height="10" />
                                <rect x="17" y="16" width="5" height="2" />
                                <rect x="29" y="6" width="3" height="22" />
                                <rect x="28" y="28" width="5" height="1" />
                                <rect x="25" y="14" width="2" height="8" />
                                <rect x="26" y="20" width="4" height="2" />
                                <rect x="34" y="11" width="2" height="8" />
                                <rect x="31" y="17" width="5" height="2" />
                            </g>
                        )}
                    </svg>

                    <div className="ground"></div>
                    <div className={`ground-dots ${gameStarted ? "move" : ""}`}></div>
                </div>
            </div>
        </section>
    );
}

export default DinoGame;
