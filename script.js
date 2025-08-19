// Função para alternar visibilidade da senha
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.classList.remove('fa-eye');
        passwordIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        passwordIcon.classList.remove('fa-eye-slash');
        passwordIcon.classList.add('fa-eye');
    }
}

// Função para atualizar navegação ativa (sidebar e bottom nav)
function updateNavigationActive(screen) {
    // Atualizar sidebar
    const sidebarItems = document.querySelectorAll('.sidebar .menu-items li');
    sidebarItems.forEach(item => item.classList.remove('active'));
    
    // Atualizar bottom navigation
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    bottomNavItems.forEach(item => item.classList.remove('active'));
    
    // Definir item ativo baseado na tela
    if (screen === 'generateQuestions') {
        const sidebarItem = document.querySelector('.sidebar .menu-items li:first-child');
        const bottomNavItem = document.querySelector('.bottom-nav-item:first-child');
        if (sidebarItem) sidebarItem.classList.add('active');
        if (bottomNavItem) bottomNavItem.classList.add('active');
    } else if (screen === 'provas') {
        const sidebarItem = document.querySelector('.sidebar .menu-items li:nth-child(2)');
        const bottomNavItem = document.querySelector('.bottom-nav-item:nth-child(2)');
        if (sidebarItem) sidebarItem.classList.add('active');
        if (bottomNavItem) bottomNavItem.classList.add('active');
    }
}

// Função para detectar se é dispositivo móvel
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Função para mostrar/ocultar elementos baseado no dispositivo
function toggleMobileElements() {
    const sidebar = document.querySelector('.sidebar');
    const bottomNav = document.querySelector('.bottom-nav');
    
    // Se estiver na tela de login, ocultar ambos os menus
    if (currentScreen === 'login') {
        if (sidebar) sidebar.style.display = 'none';
        if (bottomNav) bottomNav.style.display = 'none';
        return;
    }
    
    if (isMobileDevice()) {
        if (sidebar) sidebar.style.display = 'none';
        if (bottomNav) bottomNav.style.display = 'flex';
    } else {
        if (sidebar) sidebar.style.display = 'block';
        if (bottomNav) bottomNav.style.display = 'none';
    }
}

// Event listener para redimensionamento da janela
window.addEventListener('resize', function() {
    toggleMobileElements();
    updateNavigationActive(currentScreen);
});

// Dados das perguntas por categoria
const questionBank = {
    geral: [
        "Cite os níveis e o uso progressivo da força.",
        "Quantas viaturas são permitidas em um acompanhamento com efetivo mínimo?",
        "O que é insubordinação, desacato e corrupção?",
        "Quando a ROTA foi criada e qual o contexto do termo \"ROTA\"? (nome completo por extenso).",
        "O que é considerado uma ronda ostensiva?",
        "Você está ciente de que, ao ingressar na ROTA, terá até 5 dias para concluir os cursos básicos e apresentar o laudo médico?"
    ],
    modulacoes: [
        "Simule uma modulação de abordagem de Código 2 dentro do estacionamento vermelho.",
        "Simule uma modulação de abordagem de Código 3 em um pinote no Banco Central",
        "Simule uma modulação de acompanhamento de um R34 tripulado por dois indivíduos em uma QRU de drogas no píer.",
        "Qual modulação deve ser feita em um acompanhamento a pé e como o indivíduo deve ser detido?"
    ],
    "codigos-q": [
        "Cite 6 códigos Q e seus respectivos significados.",
        "O que significa QSJ?",
        "O que significa QSM?",
        "O que significa QRX?",
        "O que significa QRT?"
    ],
    "codigos-ptr": [
        "Quando o Código 5 pode ser liberado?",
        "Em quais situações é feito um QTA de um acompanhamento em rede? Cite exemplos.",
        "Quais são os códigos de modulação de 0 a 6 e em quais situações são aplicados?"
    ],
    situacoes: [
        "Como deve ser realizada a revista em uma pessoa do sexo oposto?",
        "Realize uma simulação de uma situação de Código 2 (Tráfico de drogas).",
        "Realize uma simulação de uma situação de QRU de disparo de arma de fogo.",
        "Qual seria sua reação e como agiria se, durante um pinote, sua viatura colidisse com um civil e este viesse a desmaiar?",
        "Qual seria sua reação e como agiria se um superior hierárquico lhe desse uma ordem controversa?",
        "Na capital, o que ocorre quando um indivíduo em um pinote lança o veículo em direção ao mar permanecendo dentro dele?",
        "Qual seria seu comportamento e sua ação ao presenciar um indivíduo proferindo palavras de baixo calão enquanto seu radar acusa QRUs de drogas e disparos de arma de fogo?",
        "Qual seria sua reação ao ser abordado por um veículo blindado com quatro indivíduos fortemente armados, estando você acompanhado apenas de um parceiro de farda?"
    ]
};

// Função para obter todas as perguntas disponíveis no banco
function getAllQuestions() {
    let allQuestions = [];
    for (let category in questionBank) {
        allQuestions = allQuestions.concat(questionBank[category]);
    }
    return allQuestions;
}

// Estado da aplicação
let selectedQuestions = [];
let currentTab = 'geral';
let provas = [];
let currentScreen = 'login';
let isLoggedIn = false;

// Configuração da API
const API_BASE_URL = window.location.origin + '/api';

// Funções para comunicação com a API
async function loadProvasFromServer() {
    try {
        showLoadingIndicator(true);
        const response = await fetch(`${API_BASE_URL}/provas`);
        if (response.ok) {
            provas = await response.json();
            updateProvasList();
            showConnectionStatus(true);
        } else {
            console.error('Erro ao carregar provas do servidor');
            showNotification('Erro ao carregar provas do servidor', 'error');
            showConnectionStatus(false);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        showNotification('Erro de conexão com o servidor', 'error');
        showConnectionStatus(false);
    } finally {
        showLoadingIndicator(false);
    }
}

async function saveProvaToServer(prova) {
    try {
        const response = await fetch(`${API_BASE_URL}/provas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prova)
        });
        
        if (response.ok) {
            const result = await response.json();
            showNotification('Prova salva com sucesso no servidor!');
            return true;
        } else {
            console.error('Erro ao salvar prova no servidor');
            showNotification('Erro ao salvar prova no servidor', 'error');
            return false;
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        showNotification('Erro de conexão com o servidor', 'error');
        return false;
    }
}

async function deleteProvaFromServer(provaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/provas?id=${provaId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Prova deletada com sucesso do servidor!');
            return true;
        } else {
            console.error('Erro ao deletar prova do servidor');
            showNotification('Erro ao deletar prova do servidor', 'error');
            return false;
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        showNotification('Erro de conexão com o servidor', 'error');
        return false;
    }
}

// Funções de UI para indicadores de status
function showLoadingIndicator(show) {
    const syncBtn = document.querySelector('.sync-btn');
    if (syncBtn) {
        const icon = syncBtn.querySelector('i');
        if (show) {
            icon.classList.remove('fa-sync-alt');
            icon.classList.add('fa-spinner', 'fa-spin');
            syncBtn.disabled = true;
        } else {
            icon.classList.remove('fa-spinner', 'fa-spin');
            icon.classList.add('fa-sync-alt');
            syncBtn.disabled = false;
        }
    }
}

function showConnectionStatus(isConnected) {
    // Remover indicador anterior se existir
    const existingStatus = document.querySelector('.connection-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    if (!isConnected) {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'connection-status offline';
        statusDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>Modo offline - Provas podem não estar sincronizadas</span>
        `;
        
        const header = document.querySelector('.header');
        if (header) {
            header.appendChild(statusDiv);
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    initializeLoginForm();
    initializeTabs();
    loadQuestions(currentTab);
    updateSelectedQuestionsDisplay();
    loadProvasFromServer();
    toggleMobileElements(); // Chamar ao carregar a página
});

// Verificar status de login
function checkLoginStatus() {
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
        isLoggedIn = true;
        showMainApp();
    } else {
        showLoginScreen();
    }
}

// Mostrar tela de login
function showLoginScreen() {
    document.body.classList.add('login-mode');
    hideAllScreens();
    document.getElementById('loginScreen').classList.add('active');
    currentScreen = 'login';
    toggleMobileElements(); // Ocultar menus na tela de login
}

// Mostrar aplicação principal
function showMainApp() {
    document.body.classList.remove('login-mode');
    hideAllScreens();
    document.getElementById('generateQuestionsScreen').classList.add('active');
    currentScreen = 'generateQuestions';
    updateNavigationActive('generateQuestions');
    toggleMobileElements(); // Mostrar menus apropriados
}

// Inicializar formulário de login
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Função de login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Credenciais padrão (em um sistema real, isso seria validado no servidor)
    if (username === 'rotaadm' && password === 'r0t4@1970') {
        localStorage.setItem('isLoggedIn', 'true');
        isLoggedIn = true;
        showMainApp();
        showNotification('Login realizado com sucesso!', 'success');
    } else {
        showNotification('Usuário ou senha incorretos!', 'error');
        document.getElementById('password').value = '';
    }
}

// Função de logout
function handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('isLoggedIn');
        isLoggedIn = false;
        showLoginScreen();
        showNotification('Logout realizado com sucesso!', 'success');
    }
}

// Inicializar tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao tab clicado
            this.classList.add('active');
            
            // Carregar perguntas da categoria selecionada
            const tabName = this.getAttribute('data-tab');
            currentTab = tabName;
            loadQuestions(tabName);
        });
    });
}

// Carregar perguntas da categoria selecionada
function loadQuestions(category) {
    const questionsList = document.getElementById('questionsList');
    const questions = questionBank[category] || [];
    
    questionsList.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-option';
        questionDiv.innerHTML = `
            <input type="checkbox" id="question-${index}" onchange="toggleQuestion('${question}', this.checked)">
            <label for="question-${index}">${index + 1}: ${question}</label>
        `;
        questionsList.appendChild(questionDiv);
    });
}

// Alternar seleção de pergunta
function toggleQuestion(question, isChecked) {
    if (isChecked) {
        if (!selectedQuestions.includes(question)) {
            selectedQuestions.push(question);
        }
    } else {
        selectedQuestions = selectedQuestions.filter(q => q !== question);
    }
    updateSelectedQuestionsDisplay();
}

// Gerar perguntas aleatórias
function generateRandomQuestions() {
    const allQuestions = getAllQuestions();
    const numQuestions = 10; // Sempre 10 perguntas
    
    // Embaralhar todas as perguntas disponíveis
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const newQuestions = shuffled.slice(0, numQuestions);
    
    // Substituir as perguntas selecionadas (ao invés de adicionar)
    selectedQuestions = newQuestions;
    
    updateSelectedQuestionsDisplay();
    
    // Mostrar mensagem de sucesso
    showNotification(`${numQuestions} perguntas foram geradas automaticamente do banco de questões!`);
}

// Atualizar display das perguntas selecionadas
function updateSelectedQuestionsDisplay() {
    const selectedQuestionsDiv = document.getElementById('selectedQuestions');
    
    if (selectedQuestions.length === 0) {
        selectedQuestionsDiv.innerHTML = '<p style="color: #999; text-align: center; margin-top: 50px;">Nenhuma pergunta selecionada</p>';
        return;
    }
    
    selectedQuestionsDiv.innerHTML = '';
    
    selectedQuestions.forEach((question, index) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        questionItem.innerHTML = `
            <span>${question}</span>
            <button class="remove-btn" onclick="removeQuestion(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        selectedQuestionsDiv.appendChild(questionItem);
    });
}

// Remover pergunta selecionada
function removeQuestion(index) {
    selectedQuestions.splice(index, 1);
    updateSelectedQuestionsDisplay();
    
    // Atualizar checkboxes
    updateCheckboxes();
}

// Atualizar estado dos checkboxes
function updateCheckboxes() {
    const checkboxes = document.querySelectorAll('.question-option input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        const questionText = checkbox.nextElementSibling.textContent.split(': ')[1];
        checkbox.checked = selectedQuestions.includes(questionText);
    });
}

// Limpar seleção
function clearSelection() {
    selectedQuestions = [];
    updateSelectedQuestionsDisplay();
    
    // Desmarcar todos os checkboxes
    const checkboxes = document.querySelectorAll('.question-option input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    showNotification('Seleção limpa com sucesso!');
}

// Gerar prova
async function generateTest() {
    if (selectedQuestions.length === 0) {
        showNotification('Selecione pelo menos uma pergunta antes de gerar a prova!', 'error');
        return;
    }
    
    // Obter nomes do conscrito e instrutor
    const conscriptName = document.getElementById('conscriptName').value.trim();
    const instructorName = document.getElementById('instructorName').value.trim();
    
    if (!conscriptName) {
        showNotification('Por favor, digite o nome do conscrito!', 'error');
        return;
    }
    
    if (!instructorName) {
        showNotification('Por favor, digite o nome do instrutor!', 'error');
        return;
    }
    
    // Criar prova
    const prova = {
        id: Date.now(),
        title: `Prova de Recrutamento - ${conscriptName} - ${new Date().toLocaleDateString('pt-BR')}`,
        conscriptName: conscriptName,
        instructorName: instructorName,
        questions: [...selectedQuestions],
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR')
    };
    
    // Salvar no servidor
    const success = await saveProvaToServer(prova);
    
    if (success) {
        // Adicionar à lista local
        provas.unshift(prova);
        
        // Atualizar lista de provas
        updateProvasList();
        
        // Navegar para a tela de provas
        showProvas();
        
        showNotification(`Prova gerada com ${selectedQuestions.length} perguntas!`);
    }
}

// Gerar conteúdo da prova
function generateTestContent() {
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Prova de Recrutamento - G GOODFOOD</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px;
                    line-height: 1.6;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    border-bottom: 2px solid #007bff;
                    padding-bottom: 20px;
                }
                .header h1 {
                    color: #007bff;
                    margin-bottom: 10px;
                }
                .question {
                    margin-bottom: 30px;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #007bff;
                }
                .question-number {
                    font-weight: bold;
                    color: #007bff;
                    margin-bottom: 10px;
                }
                .answer-space {
                    margin-top: 15px;
                    padding: 20px;
                    border: 1px dashed #ccc;
                    background-color: white;
                    min-height: 100px;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>G GOODFOOD</h1>
                <h2>Prova de Recrutamento</h2>
                <p>Data: ${currentDate}</p>
            </div>
            
            ${selectedQuestions.map((question, index) => `
                <div class="question">
                    <div class="question-number">Questão ${index + 1}:</div>
                    <div class="question-text">${question}</div>
                    <div class="answer-space">
                        <em>Espaço para resposta:</em>
                    </div>
                </div>
            `).join('')}
            
            <div class="footer">
                <p>Prova gerada automaticamente pelo sistema G GOODFOOD</p>
                <p>Total de questões: ${selectedQuestions.length}</p>
            </div>
        </body>
        </html>
    `;
}

// Mostrar notificação
function showNotification(message, type = 'success') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background-color: ${type === 'error' ? '#dc3545' : '#28a745'};
    `;
    notification.textContent = message;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Navegação entre telas
function showGenerateQuestions() {
    if (!isLoggedIn) {
        showNotification('Faça login para acessar o sistema!', 'error');
        return;
    }
    hideAllScreens();
    document.getElementById('generateQuestionsScreen').classList.add('active');
    currentScreen = 'generateQuestions';
    updateNavigationActive('generateQuestions');
}

async function showProvas() {
    if (!isLoggedIn) {
        showNotification('Faça login para acessar o sistema!', 'error');
        return;
    }
    hideAllScreens();
    document.getElementById('provasScreen').classList.add('active');
    currentScreen = 'provas';
    updateNavigationActive('provas');
    
    // Recarregar provas do servidor
    await loadProvasFromServer();
}

function showProvaDetail(provaId) {
    hideAllScreens();
    document.getElementById('provaDetailScreen').classList.add('active');
    currentScreen = 'provaDetail';
    
    const prova = provas.find(p => p.id === provaId);
    if (prova) {
        document.getElementById('provaDetailTitle').textContent = prova.title;
        displayProvaDetail(prova);
    }
}

function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
}



// Gerenciamento de provas
function updateProvasList() {
    const provasList = document.getElementById('provasList');
    
    // Calcular estatísticas
    const totalProvas = provas.length;
    const provasAvaliadas = provas.filter(p => p.evaluation).length;
    const aprovados = provas.filter(p => p.evaluation && p.evaluation.isApproved).length;
    const reprovados = provas.filter(p => p.evaluation && !p.evaluation.isApproved).length;
    
    // Atualizar contador no header
    const header = document.querySelector('#provasScreen .header h1');
    if (header) {
        header.textContent = `PROVAS GERADAS (${totalProvas})`;
    }
    
    // Adicionar estatísticas
    const statsDiv = document.querySelector('#provasScreen .stats');
    if (!statsDiv) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats';
        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-number">${totalProvas}</span>
                <span class="stat-label">Total</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${provasAvaliadas}</span>
                <span class="stat-label">Avaliadas</span>
            </div>
            <div class="stat-item approved">
                <span class="stat-number">${aprovados}</span>
                <span class="stat-label">Aprovados</span>
            </div>
            <div class="stat-item rejected">
                <span class="stat-number">${reprovados}</span>
                <span class="stat-label">Reprovados</span>
            </div>
        `;
        
        const provasContent = document.querySelector('#provasScreen .provas-content');
        if (provasContent) {
            provasContent.insertBefore(statsContainer, provasContent.firstChild);
        }
    } else {
        statsDiv.innerHTML = `
            <div class="stat-item">
                <span class="stat-number">${totalProvas}</span>
                <span class="stat-label">Total</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${provasAvaliadas}</span>
                <span class="stat-label">Avaliadas</span>
            </div>
            <div class="stat-item approved">
                <span class="stat-number">${aprovados}</span>
                <span class="stat-label">Aprovados</span>
            </div>
            <div class="stat-item rejected">
                <span class="stat-number">${reprovados}</span>
                <span class="stat-label">Reprovados</span>
            </div>
        `;
    }
    
    if (provas.length === 0) {
        provasList.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">Nenhuma prova gerada ainda</p>';
        return;
    }
    
    provasList.innerHTML = '';
    
    provas.forEach(prova => {
        const provaItem = document.createElement('div');
        provaItem.className = 'prova-item';
        
        const evaluationStatus = prova.evaluation 
            ? `<div class="evaluation-status ${prova.evaluation.isApproved ? 'approved' : 'rejected'}">
                 <i class="fas ${prova.evaluation.isApproved ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                 ${prova.evaluation.score}/${prova.questions.length} - ${prova.evaluation.isApproved ? 'APROVADO' : 'REPROVADO'}
               </div>`
            : '<div class="evaluation-status pending"><i class="fas fa-clock"></i> Pendente</div>';
        
        provaItem.innerHTML = `
            <div class="prova-content" onclick="showProvaDetail(${prova.id})">
                <h3>${prova.title}</h3>
                <p><strong>Questões:</strong> ${prova.questions.length}</p>
                <p><strong>Data:</strong> ${prova.date}</p>
                <p class="prova-date"><strong>Hora:</strong> ${prova.time}</p>
                ${evaluationStatus}
            </div>
            <div class="prova-actions">
                ${prova.evaluation ? `
                    <button class="action-btn download-btn" onclick="downloadProvaPDF(${prova.id})" title="Baixar Resultado PDF">
                        <i class="fas fa-download"></i>
                    </button>
                ` : ''}
                <button class="action-btn delete-btn" onclick="deleteProva(${prova.id})" title="Excluir Prova">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        provasList.appendChild(provaItem);
    });
}

function displayProvaDetail(prova) {
    const content = document.getElementById('provaDetailContent');
    
    // Carregar avaliações existentes se houver
    if (prova.evaluation && prova.evaluation.evaluations) {
        currentEvaluations[prova.id] = prova.evaluation.evaluations;
    }
    
    let questionsHTML = '';
    prova.questions.forEach((question, index) => {
        const isEvaluated = currentEvaluations[prova.id] && currentEvaluations[prova.id][index] !== undefined;
        const isCorrect = isEvaluated ? currentEvaluations[prova.id][index] : null;
        
        questionsHTML += `
            <div class="question">
                <div class="question-number">Questão ${index + 1}:</div>
                <div class="question-text">${question}</div>
                <div class="evaluation-section">
                    <p class="evaluation-label">Avaliação:</p>
                    <div class="evaluation-buttons">
                        <button class="eval-btn correct ${isCorrect === true ? 'selected' : ''}" onclick="evaluateQuestion(${prova.id}, ${index}, true)">
                            <i class="fas fa-check"></i> Correto
                        </button>
                        <button class="eval-btn incorrect ${isCorrect === false ? 'selected' : ''}" onclick="evaluateQuestion(${prova.id}, ${index}, false)">
                            <i class="fas fa-times"></i> Incorreto
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    content.innerHTML = `
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
            <p><strong>Nome do Conscrito:</strong> ${prova.conscriptName || 'Não informado'}</p>
            <p><strong>Nome do Instrutor:</strong> ${prova.instructorName || 'Não informado'}</p>
            <p><strong>Total de questões:</strong> ${prova.questions.length}</p>
            <p><strong>Data de criação:</strong> ${prova.date} às ${prova.time}</p>
            <p><strong>Pontuação necessária para aprovação:</strong> 8 pontos (mínimo)</p>
            ${prova.evaluation ? `<p><strong>Última avaliação:</strong> ${prova.evaluation.evaluatedAt}</p>` : ''}
        </div>
        ${questionsHTML}
        <div class="final-evaluation">
            <button class="calculate-btn" onclick="calculateFinalScore(${prova.id})">
                <i class="fas fa-calculator"></i> ${prova.evaluation ? 'Recalcular Resultado' : 'Calcular Resultado Final'}
            </button>
            <div id="finalResult" class="final-result">
                ${prova.evaluation ? `
                    <div class="result-card ${prova.evaluation.isApproved ? 'approved' : 'rejected'}">
                        <h3>RESULTADO FINAL</h3>
                        <div class="score-display">
                            <span class="score-number">${prova.evaluation.score}</span>
                            <span class="score-total">/ ${prova.evaluation.totalQuestions}</span>
                        </div>
                        <div class="percentage">${((prova.evaluation.score / prova.evaluation.totalQuestions) * 100).toFixed(1)}%</div>
                        <div class="status ${prova.evaluation.isApproved ? 'approved' : 'rejected'}">
                            <i class="fas ${prova.evaluation.isApproved ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                            ${prova.evaluation.isApproved ? 'APROVADO' : 'REPROVADO'}
                        </div>
                        <p class="result-message">
                            ${prova.evaluation.isApproved 
                                ? 'Parabéns! O recruta foi aprovado com sucesso.' 
                                : 'O recruta não atingiu a pontuação mínima necessária (8 pontos).'
                            }
                        </p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Sistema de avaliação
let currentEvaluations = {};

// Excluir prova
async function deleteProva(provaId) {
    if (confirm('Tem certeza que deseja excluir esta prova? Esta ação não pode ser desfeita.')) {
        const success = await deleteProvaFromServer(provaId);
        
        if (success) {
            provas = provas.filter(p => p.id !== provaId);
            updateProvasList();
        }
    }
}

// Baixar resultado em PDF
function downloadProvaPDF(provaId) {
    const prova = provas.find(p => p.id === provaId);
    if (!prova || !prova.evaluation) {
        showNotification('Prova não avaliada ainda!', 'error');
        return;
    }
    
    // Usar jsPDF para gerar o PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurar fonte e tamanho
    doc.setFont('helvetica');
    doc.setFontSize(16);
    
    // Título
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ROTA - Resultado da Prova', 105, 20, { align: 'center' });
    
    // Informações da prova
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nome do Conscrito: ${prova.conscriptName || 'Não informado'}`, 20, 40);
    doc.text(`Nome do Instrutor: ${prova.instructorName || 'Não informado'}`, 20, 50);
    doc.text(`Prova: ${prova.title}`, 20, 60);
    doc.text(`Data: ${prova.date} às ${prova.time}`, 20, 70);
    doc.text(`Total de questões: ${prova.questions.length}`, 20, 80);
    
    // Resultado
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('RESULTADO FINAL', 105, 100, { align: 'center' });
    
    // Pontuação
    doc.setFontSize(24);
    doc.text(`${prova.evaluation.score}/${prova.evaluation.totalQuestions}`, 105, 120, { align: 'center' });
    
    // Percentual
    const percentage = ((prova.evaluation.score / prova.evaluation.totalQuestions) * 100).toFixed(1);
    doc.setFontSize(14);
    doc.text(`${percentage}%`, 105, 135, { align: 'center' });
    
    // Status
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const statusText = prova.evaluation.isApproved ? 'APROVADO' : 'REPROVADO';
    const statusColor = prova.evaluation.isApproved ? [40, 167, 69] : [220, 53, 69];
    doc.setTextColor(...statusColor);
    doc.text(statusText, 105, 145, { align: 'center' });
    
    // Resetar cor
    doc.setTextColor(0, 0, 0);
    
    // Mensagem
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const message = prova.evaluation.isApproved 
        ? 'Parabéns! O recruta foi aprovado com sucesso.'
        : 'O recruta não atingiu a pontuação mínima necessária (8 pontos).';
    
    // Quebrar texto em múltiplas linhas se necessário
    const splitMessage = doc.splitTextToSize(message, 170);
    doc.text(splitMessage, 20, 165);
    
    // Se reprovado, adicionar questões erradas
    if (!prova.evaluation.isApproved && prova.evaluation.evaluations) {
        let yPosition = 190;
        
        // Título da seção de questões erradas
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('QUESTÕES INCORRETAS:', 20, yPosition);
        yPosition += 15;
        
        // Listar questões erradas
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        let questionNumber = 1;
        prova.questions.forEach((question, index) => {
            if (prova.evaluation.evaluations[index] === false) {
                // Número da questão
                doc.setFont('helvetica', 'bold');
                doc.text(`Questão ${index + 1}:`, 20, yPosition);
                yPosition += 8;
                
                // Texto da questão (quebrar em múltiplas linhas se necessário)
                doc.setFont('helvetica', 'normal');
                const questionLines = doc.splitTextToSize(question, 170);
                doc.text(questionLines, 25, yPosition);
                yPosition += (questionLines.length * 6) + 5;
                
                // Verificar se precisa de nova página
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }
            }
        });
        
        // Critério de aprovação na nova posição
        yPosition += 10;
        doc.setFontSize(10);
        doc.text('Critério de aprovação: Mínimo 8 pontos', 20, yPosition);
        yPosition += 8;
        doc.text(`Avaliado em: ${prova.evaluation.evaluatedAt}`, 20, yPosition);
    } else {
        // Critério de aprovação para aprovados
        doc.setFontSize(10);
        doc.text('Critério de aprovação: Mínimo 8 pontos', 20, 190);
        doc.text(`Avaliado em: ${prova.evaluation.evaluatedAt}`, 20, 200);
    }
    
    // Salvar PDF
    const fileName = `prova_${prova.date.replace(/\//g, '-')}_${prova.evaluation.isApproved ? 'aprovado' : 'reprovado'}.pdf`;
    doc.save(fileName);
    
    showNotification('PDF baixado com sucesso!');
}

function generatePDFContent(prova) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1 style="text-align: center; color: #007bff;">G GOODFOOD - Resultado da Prova</h1>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Nome do Conscrito:</strong> ${prova.conscriptName || 'Não informado'}</p>
                <p><strong>Nome do Instrutor:</strong> ${prova.instructorName || 'Não informado'}</p>
                <p><strong>Prova:</strong> ${prova.title}</p>
                <p><strong>Data:</strong> ${prova.date} às ${prova.time}</p>
                <p><strong>Total de questões:</strong> ${prova.questions.length}</p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <h2>RESULTADO FINAL</h2>
                <div style="font-size: 48px; font-weight: bold; color: #007bff;">
                    ${prova.evaluation.score}/${prova.evaluation.totalQuestions}
                </div>
                <div style="font-size: 24px; color: #666;">
                    ${((prova.evaluation.score / prova.evaluation.totalQuestions) * 100).toFixed(1)}%
                </div>
                <div style="font-size: 20px; font-weight: bold; color: ${prova.evaluation.isApproved ? '#28a745' : '#dc3545'};">
                    ${prova.evaluation.isApproved ? 'APROVADO' : 'REPROVADO'}
                </div>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <p>${prova.evaluation.isApproved 
                    ? 'Parabéns! O recruta foi aprovado com sucesso.' 
                    : 'O recruta não atingiu a pontuação mínima necessária (8 pontos).'
                }</p>
            </div>
            
            <div style="font-size: 12px; color: #666; text-align: center; margin-top: 40px;">
                <p><strong>Critério de aprovação:</strong> Mínimo 8 pontos</p>
                <p><strong>Avaliado em:</strong> ${prova.evaluation.evaluatedAt}</p>
            </div>
        </div>
    `;
}

function evaluateQuestion(provaId, questionIndex, isCorrect) {
    if (!currentEvaluations[provaId]) {
        currentEvaluations[provaId] = {};
    }
    
    currentEvaluations[provaId][questionIndex] = isCorrect;
    
    // Atualizar visual dos botões
    const questionElement = document.querySelector(`[onclick="evaluateQuestion(${provaId}, ${questionIndex}, true)"]`).closest('.question');
    const correctBtn = questionElement.querySelector('.eval-btn.correct');
    const incorrectBtn = questionElement.querySelector('.eval-btn.incorrect');
    
    // Resetar todos os botões da questão
    correctBtn.classList.remove('selected');
    incorrectBtn.classList.remove('selected');
    
    // Marcar o botão selecionado
    if (isCorrect) {
        correctBtn.classList.add('selected');
    } else {
        incorrectBtn.classList.add('selected');
    }
    
    showNotification(`Questão ${questionIndex + 1} avaliada como ${isCorrect ? 'correta' : 'incorreta'}!`);
}

async function calculateFinalScore(provaId) {
    if (!currentEvaluations[provaId]) {
        showNotification('Avalie todas as questões antes de calcular o resultado!', 'error');
        return;
    }
    
    const prova = provas.find(p => p.id === provaId);
    if (!prova) return;
    
    const evaluations = currentEvaluations[provaId];
    const totalQuestions = prova.questions.length;
    const answeredQuestions = Object.keys(evaluations).length;
    
    if (answeredQuestions < totalQuestions) {
        showNotification(`Avalie todas as ${totalQuestions} questões antes de calcular o resultado!`, 'error');
        return;
    }
    
    // Calcular pontuação
    let correctAnswers = 0;
    for (let i = 0; i < totalQuestions; i++) {
        if (evaluations[i] === true) {
            correctAnswers++;
        }
    }
    
    const score = correctAnswers;
    const isApproved = score >= 8;
    
    // Salvar resultado na prova
    prova.evaluation = {
        score: score,
        totalQuestions: totalQuestions,
        isApproved: isApproved,
        evaluations: evaluations,
        evaluatedAt: new Date().toLocaleString('pt-BR')
    };
    
    // Salvar no servidor
    const success = await saveProvaToServer(prova);
    
    if (success) {
        // Mostrar resultado
        displayFinalResult(score, totalQuestions, isApproved);
        
        showNotification(`Resultado calculado! Pontuação: ${score}/${totalQuestions} - ${isApproved ? 'APROVADO' : 'REPROVADO'}`);
    }
}

function displayFinalResult(score, totalQuestions, isApproved) {
    const resultDiv = document.getElementById('finalResult');
    const percentage = ((score / totalQuestions) * 100).toFixed(1);
    
    resultDiv.innerHTML = `
        <div class="result-card ${isApproved ? 'approved' : 'rejected'}">
            <h3>RESULTADO FINAL</h3>
            <div class="score-display">
                <span class="score-number">${score}</span>
                <span class="score-total">/ ${totalQuestions}</span>
            </div>
            <div class="percentage">${percentage}%</div>
            <div class="status ${isApproved ? 'approved' : 'rejected'}">
                <i class="fas ${isApproved ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                ${isApproved ? 'APROVADO' : 'REPROVADO'}
            </div>
            <p class="result-message">
                ${isApproved 
                    ? 'Parabéns! O recruta foi aprovado com sucesso.' 
                    : 'O recruta não atingiu a pontuação mínima necessária (8 pontos).'
                }
            </p>
        </div>
    `;
}

// Adicionar estilos de animação para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Função para baixar planilha com todos os resultados
function downloadSpreadsheet() {
    if (provas.length === 0) {
        showNotification('Não há provas para exportar!', 'error');
        return;
    }
    
    // Criar cabeçalho do CSV
    const headers = ['Nome do Conscrito', 'Nome do Instrutor', 'Status', 'Pontuação', 'Data'];
    let csvContent = headers.join(',') + '\n';
    
    // Adicionar dados de cada prova
    provas.forEach(prova => {
        const conscriptName = prova.conscriptName || 'Não informado';
        const instructorName = prova.instructorName || 'Não informado';
        const date = prova.date || 'Data não disponível';
        
        let status = 'Pendente';
        let score = 'N/A';
        
        if (prova.evaluation) {
            status = prova.evaluation.isApproved ? 'Aprovado' : 'Reprovado';
            score = `${prova.evaluation.score}/${prova.evaluation.totalQuestions}`;
        }
        
        // Escapar vírgulas e aspas no conteúdo
        const escapedConscriptName = `"${conscriptName.replace(/"/g, '""')}"`;
        const escapedInstructorName = `"${instructorName.replace(/"/g, '""')}"`;
        const escapedStatus = `"${status}"`;
        const escapedScore = `"${score}"`;
        const escapedDate = `"${date}"`;
        
        csvContent += `${escapedConscriptName},${escapedInstructorName},${escapedStatus},${escapedScore},${escapedDate}\n`;
    });
    
    // Criar blob e download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `resultados_provas_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    showNotification('Planilha baixada com sucesso!', 'success');
} 