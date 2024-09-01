(function() {
    'use strict';

    let GAME_SETTINGS = {
        BombHits: 0,
        IceHits: 0,
        flowerSkipPercentage: 0,
        minDelayMs: 2000,
        maxDelayMs: 5000,
    };

    let isGamePaused = true;

    try {
        console.log('Script started');

        let gameStats = {
            score: 0,
            bombHits: 0,
            iceHits: 0,
            flowersSkipped: 0,
            isGameOver: false,
        };

        const originalPush = Array.prototype.push;
        Array.prototype.push = function (...items) {
            if (!isGamePaused) {
                items.forEach(item => handleGameElement(item));
            }
            return originalPush.apply(this, items);
        };

        function handleGameElement(element) {
            if (!element || !element.item) return;

            const { type } = element.item;
            switch (type) {
                case "CLOVER":
                    processFlower(element);
                    break;
                case "BOMB":
                    processBomb(element);
                    break;
                case "FREEZE":
                    processIce(element);
                    break;
            }
        }

        function processFlower(element) {
            const shouldSkip = Math.random() < (GAME_SETTINGS.flowerSkipPercentage / 100);
            if (shouldSkip) {
                gameStats.flowersSkipped++;
            } else {
                gameStats.score++;
                clickElement(element);
            }
        }

        function processBomb(element) {
            if (gameStats.bombHits < GAME_SETTINGS.BombHits) {
                gameStats.score = 0;
                clickElement(element);
                gameStats.bombHits++;
            }
        }

        function processIce(element) {
            if (gameStats.iceHits < GAME_SETTINGS.IceHits) {
                clickElement(element);
                gameStats.iceHits++;
            }
        }

        function clickElement(element) {
            element.onClick(element);
            element.isExplosion = true;
            element.addedAt = performance.now();
        }

        function checkGameCompletion() {
            const rewardElement = document.querySelector('#app > div > div > div.content > div.reward');
            if (rewardElement && !gameStats.isGameOver) {
                gameStats.isGameOver = true;
                logGameStats();
                resetGameStats();
                if (window.__NUXT__.state.$s$0olocQZxou.playPasses > 0) {
                    startNewGame();
                }
            }
        }

        function logGameStats() {
            console.log(`Game Over. Stats: Score: ${gameStats.score}, Bombs: ${gameStats.bombHits}, Ice: ${gameStats.iceHits}, Flowers Skipped: ${gameStats.flowersSkipped}`);
        }

        function resetGameStats() {
            gameStats = {
                score: 0,
                bombHits: 0,
                iceHits: 0,
                flowersSkipped: 0,
                isGameOver: false,
            };
        }

        function getRandomDelay() {
            return Math.random() * (GAME_SETTINGS.maxDelayMs - GAME_SETTINGS.minDelayMs) + GAME_SETTINGS.minDelayMs;
        }

        function startNewGame() {
            setTimeout(() => {
                const newGameButton = document.querySelector("#app > div > div > div.buttons > button:nth-child(2)");
                if (newGameButton) {
                    newGameButton.click();
                }
                gameStats.isGameOver = false;
            }, getRandomDelay());
        }

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    checkGameCompletion();
                }
            }
        });

        const appElement = document.querySelector('#app');
        if (appElement) {
            observer.observe(appElement, { childList: true, subtree: true });
        }

        const controlsContainer = document.createElement('div');
        controlsContainer.style.position = 'fixed';
        controlsContainer.style.top = '0';
        controlsContainer.style.left = '50%';
        controlsContainer.style.transform = 'translateX(-50%)';
        controlsContainer.style.zIndex = '9999';
        controlsContainer.style.backgroundColor = 'black';
        controlsContainer.style.padding = '10px 20px';
        controlsContainer.style.borderRadius = '10px';
        document.body.appendChild(controlsContainer);

        function decodeBase64(encodedText) {
            return atob(encodedText);
        }

        const joinButtonText = decodeBase64('Sm9pbiBAQ1NGVEVBNzM=');
        const ownerLabelText = decodeBase64('T3duZXI6IE1yR2hvc3RYQk9U');

        const joinButton = document.createElement('button');
        joinButton.textContent = joinButtonText;
        joinButton.style.padding = '10px 20px';
        joinButton.style.backgroundColor = '#FF4500'; // Orange color
        joinButton.style.color = 'white';
        joinButton.style.border = 'none';
        joinButton.style.borderRadius = '10px';
        joinButton.style.cursor = 'pointer';
        joinButton.onclick = () => {
            window.location.href = 'https://t.me/CSFTEAM3';
        };
        controlsContainer.appendChild(joinButton);

        const ownerLabel = document.createElement('div');
        ownerLabel.textContent = ownerLabelText;
        ownerLabel.style.color = 'white';
        ownerLabel.style.marginTop = '10px';
        controlsContainer.appendChild(ownerLabel);

        const pauseButton = document.createElement('button');
        pauseButton.textContent = '▶';
        pauseButton.style.padding = '4px 8px';
        pauseButton.style.backgroundColor = '#5d2a8f';
        pauseButton.style.color = 'white';
        pauseButton.style.border = 'none';
        pauseButton.style.borderRadius = '10px';
        pauseButton.style.cursor = 'pointer';
        pauseButton.style.marginTop = '10px';
        pauseButton.onclick = toggleGamePause;
        controlsContainer.appendChild(pauseButton);

        function toggleGamePause() {
            isGamePaused = !isGamePaused;
            pauseButton.textContent = isGamePaused ? '▶' : '❚❚';
        }

    } catch (e) {
        console.log('Failed to initiate the game script', e);
    }
})();
