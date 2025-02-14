document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const removeHeartsBtn = document.getElementById('removeHeartsBtn');
    const letter = document.getElementById('letter');
    const sorryBtn = document.getElementById('sorryBtn');
    const survey1 = document.getElementById('survey1');
    const survey2 = document.getElementById('survey2');
    let hearts = [];
    let currentSurvey = 1;

    // Función para crear un corazón
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        
        // Área segura para evitar que los corazones estén cerca de los botones
        const safeZone = 100;
        const minDistance = 120;
        const startBtnRect = startBtn.getBoundingClientRect();
        const removeHeartsBtnRect = removeHeartsBtn.getBoundingClientRect();
    
        let x, y;
        let isPositionValid = false;
    
        // Generar posiciones aleatorias hasta que estén fuera de la zona segura
        while (!isPositionValid) {
            x = Math.random() * (window.innerWidth - 100);
            y = Math.random() * (window.innerHeight - 100);
    
            // Verificar que el corazón no esté cerca de los botones
            const isNearStartBtn = x + 50 > startBtnRect.left - safeZone &&
                                   x - 50 < startBtnRect.right + safeZone &&
                                   y + 50 > startBtnRect.top - safeZone &&
                                   y - 50 < startBtnRect.bottom + safeZone;
    
            const isNearRemoveHeartsBtn = x + 50 > removeHeartsBtnRect.left - safeZone &&
                                          x - 50 < removeHeartsBtnRect.right + safeZone &&
                                          y + 50 > removeHeartsBtnRect.top - safeZone &&
                                          y - 50 < removeHeartsBtnRect.bottom + safeZone;
    
            // Verificar que el corazón no esté demasiado cerca de los bordes
            const isNearEdge = x < safeZone || x > window.innerWidth - safeZone ||
                               y < safeZone || y > window.innerHeight - safeZone;
    
            // Verificar que el corazón no esté demasiado cerca de otros corazones
            let isTooClose = false;
            hearts.forEach(h => {
                const hRect = h.getBoundingClientRect();
                const distance = Math.sqrt((x - hRect.left) ** 2 + (y - hRect.top) ** 2);
                if (distance < minDistance) {
                    isTooClose = true;
                }
            });
    
            isPositionValid = !isNearStartBtn && !isNearRemoveHeartsBtn && !isNearEdge && !isTooClose;
        }
    
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        
        // Tamaño aleatorio para los corazones
        const size = Math.random() * 40 + 30;
        heart.style.width = size + 'px';
        heart.style.height = size + 'px';
        
        // Rotación aleatoria para distorsionar los corazones
        const rotation = Math.random() * 360;
        heart.style.transform = `rotate(${rotation}deg)`;
        
        // Evento de click para el corazón
        heart.addEventListener('click', () => {
            heart.remove();
            hearts = hearts.filter(h => h !== heart);
            createHeart();
        });
        
        document.body.appendChild(heart);
        hearts.push(heart);
    }

    // Crear corazones iniciales
    for (let i = 0; i < 11; i++) {
        createHeart();
    }

    // Evento del botón empezar
    startBtn.addEventListener('click', () => {
        startBtn.classList.add('hide');
        removeHeartsBtn.style.display = 'none';
    
        setTimeout(() => {
            startBtn.style.display = 'none';
            survey1.style.display = 'block';
            setTimeout(() => {
                survey1.classList.add('show');
            }, 50);
        }, 500);
    });

    // Evento del botón quitar corazones
    removeHeartsBtn.addEventListener('click', () => {
        startBtn.classList.add('hide');
        removeHeartsBtn.style.display = 'none';
        setTimeout(() => {
            startBtn.style.display = 'none';
            letter.style.display = 'block';
            setTimeout(() => {
                letter.classList.add('show');
            }, 50);
        }, 300);
    });

    // Evento del botón sorry
    sorryBtn.addEventListener('click', () => {
        letter.classList.remove('show');
        setTimeout(() => {
            letter.style.display = 'none';
            startBtn.style.display = 'block';
            removeHeartsBtn.style.display = 'block';
            setTimeout(() => {
                startBtn.classList.remove('hide');
            }, 50);
        }, 300);
    });

    // Eventos para los botones de las encuestas
    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', () => {
            const isCorrect = button.getAttribute('data-correct') === 'true';
            const message = button.getAttribute('data-message');
            showResult(isCorrect, message);
        });
    });

    function showResult(isCorrect, message) {
        console.log("showResult called", isCorrect, message);
    
        const currentSurveyEl = document.getElementById(`survey${currentSurvey}`);
        currentSurveyEl.style.display = 'none';
        
        // Crear la tarjeta de resultado
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        resultCard.innerHTML = `
            <h2>${isCorrect ? '¡Correcto!' : '¡Incorrecto!'}</h2>
            <hr class="result-line"> <!-- Línea decorativa -->
            <p>${message.replace('|', '<br>')}</p>
            <div class="result-buttons">
                <button class="back-btn">${message.includes("Ya te fregaste") ? "Volver👍" : "Volver"}</button>
                ${isCorrect ? '<button class="next-btn">Siguiente</button>' : ''}
            </div>
        `;
        
        // Añadir la tarjeta de resultado al cuerpo del documento
        document.body.appendChild(resultCard);
        
        // Añadir la clase 'show' para animar la aparición de la tarjeta
        setTimeout(() => {
            resultCard.classList.add('show');
        }, 50);
        
        // Evento del botón volver
        const backBtn = resultCard.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                resultCard.classList.remove('show');
                setTimeout(() => {
                    resultCard.remove();
                    if (message.includes("Ya te fregaste")) {
                        // Volver al inicio (botón "Empezar")
                        const startBtn = document.getElementById('startBtn');
                        const removeHeartsBtn = document.getElementById('removeHeartsBtn');
                        startBtn.style.display = 'block';
                        removeHeartsBtn.style.display = 'block';
                        startBtn.classList.remove('hide');
                        currentSurvey = 1; // Reiniciar a la primera pregunta
                    } else {
                        // Volver a la encuesta actual
                        currentSurveyEl.style.display = 'block';
                        setTimeout(() => {
                            currentSurveyEl.classList.add('show');
                        }, 50);
                    }
                }, 300);
            });
        }
        
        // Evento del botón siguiente
        const nextBtn = resultCard.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                resultCard.classList.remove('show');
                setTimeout(() => {
                    resultCard.remove();
                    if (currentSurvey === 1) {
                        currentSurvey = 2; // Cambia a la segunda pregunta
                        const survey2 = document.getElementById('survey2');
                        survey2.style.display = 'block';
                        setTimeout(() => {
                            survey2.classList.add('show');
                        }, 50);
                    } else if (currentSurvey === 2) {
                        currentSurvey = 3; // Cambia a la tercera pregunta
                        const survey3 = document.getElementById('survey3');
                        survey3.style.display = 'block';
                        setTimeout(() => {
                            survey3.classList.add('show');
                        }, 50);
                    } else if (currentSurvey === 3) {
                        currentSurvey = 4; // Cambia a la cuarta pregunta
                        const survey4 = document.getElementById('survey4');
                        survey4.style.display = 'block';
                        setTimeout(() => {
                            survey4.classList.add('show');
                        }, 50);
                    } else if (currentSurvey === 4) {
                        currentSurvey = 5; // Cambia a la quinta pregunta
                        const survey5 = document.getElementById('survey5');
                        survey5.style.display = 'block';
                        setTimeout(() => {
                            survey5.classList.add('show');
                        }, 50);
                    } else if (currentSurvey === 5) {
                        currentSurvey = 6; // Cambia a la sexta pregunta
                        const survey6 = document.getElementById('survey6');
                        survey6.style.display = 'block';
                        setTimeout(() => {
                            survey6.classList.add('show');
                        }, 50);
                    } else if (currentSurvey === 6) {
                        currentSurvey = 7; // Cambia a la séptima pregunta
                        const survey7 = document.getElementById('survey7');
                        survey7.style.display = 'block';
                        setTimeout(() => {
                            survey7.classList.add('show');
                        }, 50);
                    } else if (currentSurvey === 7) {
                        currentSurvey = 8; // Cambia a la octava pregunta
                        const survey8 = document.getElementById('survey8');
                        survey8.style.display = 'block';
                        setTimeout(() => {
                            survey8.classList.add('show');
                        }, 50);
                    } else if (currentSurvey === 8) {
                        currentSurvey = 9; // Cambia a la novena pregunta
                        const survey9 = document.getElementById('survey9');
                        survey9.style.display = 'block';
                        setTimeout(() => {
                            survey9.classList.add('show');
                        }, 50);
                    } else if (currentSurvey === 9) {
                        currentSurvey = 10; // Cambia a la décima pregunta
                        const survey10 = document.getElementById('survey10');
                        survey10.style.display = 'block';
                        setTimeout(() => {
                            survey10.classList.add('show');
                        }, 50);
                    } else if (currentSurvey === 10) {
                        currentSurvey = 11; // Cambia a la undécima pregunta
                        const survey11 = document.getElementById('survey11');
                        survey11.style.display = 'block';
                        setTimeout(() => {
                            survey11.classList.add('show');
                        }, 50);
                    } else if (currentSurvey === 11) {
                        currentSurvey = 12; // Cambia a la duodécima pregunta
                        const survey12 = document.getElementById('survey12');
                        survey12.style.display = 'block';
                        setTimeout(() => {
                            survey12.classList.add('show');
                        }, 50);
                    } else if (currentSurvey === 12) {
                        const finalCard = document.getElementById('finalCard');
                        finalCard.style.display = 'block';
                        setTimeout(() => {
                            finalCard.classList.add('show');
                        }, 50);
                    }
                }, 300);
            });
        }
    }
});