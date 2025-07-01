document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. DOM ELEMENT SELECTION
    // =================================================================
    const views = document.querySelectorAll('.view');
    const homeView = document.getElementById('home-view');
    const learnView = document.getElementById('learn-view');
    const memoryView = document.getElementById('memory-view');
    const quizView = document.getElementById('quiz-view');
    const errorView = document.getElementById('error-view');
    const libraryView = document.getElementById('library-view');

    // Home View Elements
    const masteredCountEl = document.getElementById('mastered-count');
    const totalCountEl = document.getElementById('total-count');
    const progressBar = document.getElementById('progress-bar');

    // Navigation Buttons
    const navButtons = {
        learn: document.getElementById('nav-learn'),
        memory: document.getElementById('nav-memory'),
        quiz: document.getElementById('nav-quiz'),
        errors: document.getElementById('nav-errors'),
        library: document.getElementById('nav-library'),
    };
    const backButtons = document.querySelectorAll('.back-button');

    // Learn View Elements
    const learnCardCategory = document.getElementById('learn-card-category');
    const learnCardName = document.getElementById('learn-card-name');
    const learnCardContent = document.getElementById('learn-card-content');
    const learnPrevBtn = document.getElementById('learn-prev-btn');
    const learnNextBtn = document.getElementById('learn-next-btn');

    // Memory View Elements
    const memoryCard = document.getElementById('memory-card');
    const memoryCardName = document.getElementById('memory-card-name');
    const memoryCardCategory = document.getElementById('memory-card-category');
    const memoryCardNameBack = document.getElementById('memory-card-name-back');
    const memoryCardContent = document.getElementById('memory-card-content');
    const memoryPrevBtn = document.getElementById('memory-prev-btn');
    const memoryNextBtn = document.getElementById('memory-next-btn');
    const masteredBtn = document.getElementById('mastered-btn');

    // Quiz View Elements
    const quizSetup = document.getElementById('quiz-setup');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizCountInput = document.getElementById('quiz-count');
    const quizMain = document.getElementById('quiz-main');
    const currentQNumEl = document.getElementById('current-q-num');
    const totalQNumEl = document.getElementById('total-q-num');
    const questionArea = document.getElementById('question-area');
    const answerArea = document.getElementById('answer-area');
    const quizFeedback = document.getElementById('quiz-feedback');
    const submitAnswerBtn = document.getElementById('submit-answer-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');

    // Error Log View Elements
    const errorListContainer = document.getElementById('error-list-container');

    // Library View Elements
    const searchInput = document.getElementById('search-input');
    const libraryGrid = document.getElementById('library-grid');
    const detailModal = document.getElementById('detail-modal');
    const closeDetailBtn = document.getElementById('close-detail-btn');
    const detailModalCategory = document.getElementById('detail-modal-category');
    const detailModalName = document.getElementById('detail-modal-name');
    const detailModalContent = document.getElementById('detail-modal-content');

    // Settings Elements
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const resetProgressBtn = document.getElementById('reset-progress-btn');

    // =================================================================
    // 2. STATE MANAGEMENT
    // =================================================================
    let state = {
        masteredIDs: [],
        errorIDs: [],
        currentLearnIndex: 0,
        currentMemoryIndex: 0,
        quizQuestions: [],
        currentQuizIndex: -1,
        unmasteredItems: [],
    };

    const DB_KEY = 'mxbcUserProgress';
    const SETTINGS_KEY = 'mxbcUserSettings';

    function saveProgress() {
        const progress = {
            masteredIDs: state.masteredIDs,
            errorIDs: state.errorIDs
        };
        localStorage.setItem(DB_KEY, JSON.stringify(progress));
    }

    function loadProgress() {
        const progress = JSON.parse(localStorage.getItem(DB_KEY));
        if (progress) {
            state.masteredIDs = progress.masteredIDs || [];
            state.errorIDs = progress.errorIDs || [];
        }
    }
    
    function saveSettings() {
        const settings = {
            darkMode: document.body.classList.contains('dark-mode'),
            fontSize: fontSizeSlider.value
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY));
        if (settings) {
            if (settings.darkMode) {
                document.body.classList.add('dark-mode');
                darkModeToggle.checked = true;
            }
            if (settings.fontSize) {
                fontSizeSlider.value = settings.fontSize;
                document.documentElement.style.fontSize = `${settings.fontSize}%`;
                fontSizeSlider.previousElementSibling.querySelector('span').textContent = settings.fontSize;
            }
        }
    }


    // =================================================================
    // 3. VIEW/NAVIGATION LOGIC
    // =================================================================
    function showView(viewId) {
        views.forEach(view => view.classList.add('hidden'));
        document.getElementById(viewId).classList.remove('hidden');
    }

    // Navigation event listeners
    navButtons.learn.addEventListener('click', () => {
        setupLearnView();
        showView('learn-view');
    });
    navButtons.memory.addEventListener('click', () => {
        setupMemoryView();
        showView('memory-view');
    });
    navButtons.quiz.addEventListener('click', () => {
        setupQuizView();
        showView('quiz-view');
    });
    navButtons.errors.addEventListener('click', () => {
        setupErrorView();
        showView('error-view');
    });
    navButtons.library.addEventListener('click', () => {
        setupLibraryView();
        showView('library-view');
    });

    backButtons.forEach(button => {
        button.addEventListener('click', () => showView('home-view'));
    });


    // =================================================================
    // 4. HOME SCREEN LOGIC
    // =================================================================
    function updateHomeScreen() {
        const totalCount = RECIPE_DATABASE.length;
        const masteredCount = state.masteredIDs.length;
        const progress = totalCount > 0 ? (masteredCount / totalCount) * 100 : 0;

        masteredCountEl.textContent = masteredCount;
        totalCountEl.textContent = totalCount;
        progressBar.style.width = `${progress}%`;
    }


    // =================================================================
    // 5. LEARN MODE LOGIC
    // =================================================================
    function setupLearnView() {
        state.currentLearnIndex = 0;
        renderLearnCard();
    }
    
    function renderLearnCard() {
        const item = RECIPE_DATABASE[state.currentLearnIndex];
        learnCardCategory.textContent = item.category;
        learnCardName.textContent = item.name;
        // Use <pre> to preserve whitespace and line breaks from rawText
        learnCardContent.innerHTML = `<pre>${item.rawText}</pre>`;
    }

    learnPrevBtn.addEventListener('click', () => {
        state.currentLearnIndex = (state.currentLearnIndex - 1 + RECIPE_DATABASE.length) % RECIPE_DATABASE.length;
        renderLearnCard();
    });

    learnNextBtn.addEventListener('click', () => {
        state.currentLearnIndex = (state.currentLearnIndex + 1) % RECIPE_DATABASE.length;
        renderLearnCard();
    });


    // =================================================================
    // 6. MEMORY MODE LOGIC
    // =================================================================
    function setupMemoryView() {
        state.unmasteredItems = RECIPE_DATABASE.filter(item => !state.masteredIDs.includes(item.id));
        if (state.unmasteredItems.length === 0) {
            memoryCard.innerHTML = '<div class="card"><div class="card-content empty-state">恭喜！所有条目都已掌握！</div></div>';
            document.querySelector('#memory-view .view-controls').classList.add('hidden');
            return;
        }
        document.querySelector('#memory-view .view-controls').classList.remove('hidden');
        state.currentMemoryIndex = 0;
        renderMemoryCard();
    }

    function renderMemoryCard() {
        if (state.unmasteredItems.length === 0) {
            setupMemoryView(); // Re-check if everything is mastered
            return;
        }
        memoryCard.classList.remove('is-flipped');
        const item = state.unmasteredItems[state.currentMemoryIndex];
        memoryCardName.textContent = item.name;
        memoryCardCategory.textContent = item.category;
        memoryCardNameBack.textContent = item.name;
        memoryCardContent.innerHTML = `<pre>${item.rawText}</pre>`;
    }

    memoryCard.addEventListener('click', () => memoryCard.classList.toggle('is-flipped'));
    
    memoryPrevBtn.addEventListener('click', () => {
        state.currentMemoryIndex = (state.currentMemoryIndex - 1 + state.unmasteredItems.length) % state.unmasteredItems.length;
        renderMemoryCard();
    });
    
    memoryNextBtn.addEventListener('click', () => {
        state.currentMemoryIndex = (state.currentMemoryIndex + 1) % state.unmasteredItems.length;
        renderMemoryCard();
    });

    masteredBtn.addEventListener('click', () => {
        const item = state.unmasteredItems[state.currentMemoryIndex];
        if (item && !state.masteredIDs.includes(item.id)) {
            state.masteredIDs.push(item.id);
            // Remove from error log if it was there
            state.errorIDs = state.errorIDs.filter(id => id !== item.id);
            saveProgress();
            updateHomeScreen();
        }
        
        // Remove from unmastered list and re-render
        state.unmasteredItems.splice(state.currentMemoryIndex, 1);
        if (state.currentMemoryIndex >= state.unmasteredItems.length) {
            state.currentMemoryIndex = 0;
        }
        renderMemoryCard();
    });


    // =================================================================
    // 7. QUIZ MODE LOGIC
    // =================================================================
    function setupQuizView() {
        quizSetup.classList.remove('hidden');
        quizMain.classList.add('hidden');
    }

    startQuizBtn.addEventListener('click', () => {
        const count = parseInt(quizCountInput.value, 10);
        generateQuizQuestions(count);
        if (state.quizQuestions.length > 0) {
            quizSetup.classList.add('hidden');
            quizMain.classList.remove('hidden');
            state.currentQuizIndex = 0;
            renderQuestion();
        } else {
            alert('没有足够的题目来开始测验！');
        }
    });

    function generateQuizQuestions(count) {
        // Prioritize errors, then unmastered, then mastered
        let errorItems = state.errorIDs.map(id => RECIPE_DATABASE.find(r => r.id === id)).filter(Boolean);
        let unmasteredItems = RECIPE_DATABASE.filter(r => !state.masteredIDs.includes(r.id) && !state.errorIDs.includes(r.id));
        let masteredItems = RECIPE_DATABASE.filter(r => state.masteredIDs.includes(r.id) && !state.errorIDs.includes(r.id));
        
        // Shuffle each pool
        errorItems.sort(() => 0.5 - Math.random());
        unmasteredItems.sort(() => 0.5 - Math.random());
        masteredItems.sort(() => 0.5 - Math.random());
        
        const pool = [...errorItems, ...unmasteredItems, ...masteredItems];
        state.quizQuestions = pool.slice(0, count);
    }
    
    // Using a self-assessment quiz style
    function renderQuestion() {
        const question = state.quizQuestions[state.currentQuizIndex];
        currentQNumEl.textContent = state.currentQuizIndex + 1;
        totalQNumEl.textContent = state.quizQuestions.length;
        
        questionArea.innerHTML = `<h3>${question.name}</h3><p>请在心中回忆配方...</p>`;
        answerArea.innerHTML = '';
        quizFeedback.textContent = '';
        
        // Buttons for self-assessment
        submitAnswerBtn.textContent = '查看答案';
        submitAnswerBtn.classList.remove('hidden');
        nextQuestionBtn.classList.add('hidden');
        // Reset and remove old listeners
        const newSubmitBtn = submitAnswerBtn.cloneNode(true);
        submitAnswerBtn.parentNode.replaceChild(newSubmitBtn, submitAnswerBtn);
        newSubmitBtn.addEventListener('click', showAnswer);
    }

    function showAnswer() {
        const question = state.quizQuestions[state.currentQuizIndex];
        answerArea.innerHTML = `<pre>${question.rawText}</pre>`;
        
        const newSubmitBtn = document.getElementById('submit-answer-btn');
        newSubmitBtn.classList.add('hidden');

        // Show right/wrong buttons
        quizFeedback.innerHTML = `
            <p>你答对了吗？</p>
            <button id="quiz-correct-btn" class="correct-btn">我答对了</button>
            <button id="quiz-incorrect-btn" class="incorrect-btn">我答错了</button>
        `;
        document.getElementById('quiz-correct-btn').addEventListener('click', () => handleQuizResult(true));
        document.getElementById('quiz-incorrect-btn').addEventListener('click', () => handleQuizResult(false));
    }

    function handleQuizResult(isCorrect) {
        const question = state.quizQuestions[state.currentQuizIndex];
        
        if (isCorrect) {
            // If it was an error, remove it from the error log
            state.errorIDs = state.errorIDs.filter(id => id !== question.id);
        } else {
            // If wrong, add to error log (avoid duplicates)
            if (!state.errorIDs.includes(question.id)) {
                state.errorIDs.push(question.id);
            }
        }
        saveProgress();
        
        if (state.currentQuizIndex < state.quizQuestions.length - 1) {
             state.currentQuizIndex++;
             renderQuestion();
        } else {
            endQuiz();
        }
    }
    
    function endQuiz() {
        questionArea.innerHTML = '<h3>测验完成！</h3>';
        answerArea.innerHTML = '';
        quizFeedback.innerHTML = '';
        
        const newSubmitBtn = document.getElementById('submit-answer-btn');
        newSubmitBtn.classList.add('hidden');
        
        const newNextBtn = document.getElementById('next-question-btn');
        newNextBtn.classList.remove('hidden');
        newNextBtn.textContent = '返回主页';
        
        const newNextBtnClone = newNextBtn.cloneNode(true);
        newNextBtn.parentNode.replaceChild(newNextBtnClone, newNextBtn);
        newNextBtnClone.addEventListener('click', () => showView('home-view'));
    }

    // =================================================================
    // 8. ERROR LOG LOGIC
    // =================================================================
    function setupErrorView() {
        errorListContainer.innerHTML = '';
        if (state.errorIDs.length === 0) {
            errorListContainer.innerHTML = '<p class="empty-state">你太棒了，还没有错题！</p>';
            return;
        }

        const list = document.createElement('ul');
        list.className = 'error-list';
        state.errorIDs.forEach(id => {
            const item = RECIPE_DATABASE.find(r => r.id === id);
            if (item) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.name}</span>
                    <div class="error-item-controls">
                        <button class="review-btn" data-id="${id}">复习</button>
                        <button class="remove-btn" data-id="${id}">移除</button>
                    </div>
                `;
                list.appendChild(li);
            }
        });
        errorListContainer.appendChild(list);
    }
    
    errorListContainer.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;
        if (!id) return;
        
        if (target.classList.contains('review-btn')) {
            showDetailModal(id);
        } else if (target.classList.contains('remove-btn')) {
            state.errorIDs = state.errorIDs.filter(errorId => errorId !== id);
            saveProgress();
            // Remove the element from the DOM
            target.closest('li').remove();
            if (state.errorIDs.length === 0) {
                 errorListContainer.innerHTML = '<p class="empty-state">你太棒了，还没有错题！</p>';
            }
        }
    });

    // =================================================================
    // 9. LIBRARY & SEARCH LOGIC
    // =================================================================
    function setupLibraryView() {
        searchInput.value = '';
        renderLibraryGrid();
    }
    
    function renderLibraryGrid(searchTerm = '') {
        libraryGrid.innerHTML = '';
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        const filtered = RECIPE_DATABASE.filter(item => 
            item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.category.toLowerCase().includes(lowerCaseSearchTerm)
        );
        
        if (filtered.length === 0) {
            libraryGrid.innerHTML = '<p class="empty-state">未找到匹配项</p>';
            return;
        }
        
        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'library-card';
            card.textContent = item.name;
            card.dataset.id = item.id;
            libraryGrid.appendChild(card);
        });
    }
    
    searchInput.addEventListener('input', (e) => renderLibraryGrid(e.target.value));
    
    libraryGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('library-card')) {
            showDetailModal(e.target.dataset.id);
        }
    });
    
    function showDetailModal(id) {
        const item = RECIPE_DATABASE.find(r => r.id === id);
        if (item) {
            detailModalCategory.textContent = item.category;
            detailModalName.textContent = item.name;
            detailModalContent.innerHTML = `<pre>${item.rawText}</pre>`;
            detailModal.classList.remove('hidden');
        }
    }
    
    closeDetailBtn.addEventListener('click', () => detailModal.classList.add('hidden'));


    // =================================================================
    // 10. SETTINGS LOGIC
    // =================================================================
    settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
    
    darkModeToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
        saveSettings();
    });
    
    fontSizeSlider.addEventListener('input', (e) => {
        const size = e.target.value;
        document.documentElement.style.fontSize = `${size}%`;
        e.target.previousElementSibling.querySelector('span').textContent = size;
    });

    fontSizeSlider.addEventListener('change', saveSettings);
    
    resetProgressBtn.addEventListener('click', () => {
        if (confirm('警告：此操作将清空所有“已掌握”和“错题本”记录，无法恢复。确定要继续吗？')) {
            state.masteredIDs = [];
            state.errorIDs = [];
            saveProgress();
            updateHomeScreen();
            alert('所有学习进度已重置。');
        }
    });

    // Close modals on overlay click
    [settingsModal, detailModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // =================================================================
    // 11. INITIALIZATION
    // =================================================================
    function init() {
        loadProgress();
        loadSettings();
        updateHomeScreen();
        showView('home-view');
    }

    init();
});