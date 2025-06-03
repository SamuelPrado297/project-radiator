/**
 * Sistema de Estoque de Radiadores
 * Arquivo JavaScript principal
 */

// URLs da API
const API_URL = {
    marcas: '/api/marcas',
    modelos: '/api/modelos',
    radiadores: '/api/radiadores',
    radiadorPorMarca: '/api/radiadores/marca'
};

// Funções de utilidade
const utils = {
    // Função para fazer requisições à API
    async fetchAPI(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao acessar a API:', error);
            return null;
        }
    },

    // Função para criar elementos HTML
    createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        // Adicionar atributos
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        // Adicionar conteúdo de texto
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    },

    // Formatar preço em reais
    formatarPreco(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    },

    // Exibir mensagem de erro
    mostrarErro(mensagem) {
        alert(mensagem);
    }
};

// Funções para a página inicial
const paginaInicial = {
    // Carregar marcas na página inicial
    async carregarMarcas() {
        const marcasContainer = document.getElementById('marcas-container');
        if (!marcasContainer) return;

        try {
            const marcas = await utils.fetchAPI(API_URL.marcas);
            if (!marcas || marcas.length === 0) return;

            // Limpar container
            marcasContainer.innerHTML = '';

            // Adicionar cada marca
            marcas.forEach(marca => {
                const marcaItem = utils.createElement('div', { class: 'marca-item' });
                const link = utils.createElement('a', { href: `../pages/busca.html?marca=${marca.id}` });
                const img = utils.createElement('img', { 
                    src: `img/${marca.logo || 'placeholder.png'}`, 
                    alt: marca.nome 
                });

                link.appendChild(img);
                marcaItem.appendChild(link);
                marcasContainer.appendChild(marcaItem);
            });
        } catch (error) {
            console.error('Erro ao carregar marcas:', error);
        }
    },

    // Inicializar página inicial
    init() {
        this.carregarMarcas();
    }
};

// Funções para a página de busca
const paginaBusca = {
    // Carregar marcas no select
    async carregarMarcas() {
        const marcaSelect = document.getElementById('marca-select');
        if (!marcaSelect) return;

        try {
            const marcas = await utils.fetchAPI(API_URL.marcas);
            if (!marcas || marcas.length === 0) return;

            // Adicionar opção padrão
            marcaSelect.innerHTML = '<option value="">Selecione a marca</option>';

            // Adicionar cada marca
            marcas.forEach(marca => {
                const option = utils.createElement('option', { value: marca.id }, marca.nome);
                marcaSelect.appendChild(option);
            });

            // Verificar se há uma marca na URL
            const urlParams = new URLSearchParams(window.location.search);
            const marcaId = urlParams.get('marca');
            if (marcaId) {
                marcaSelect.value = marcaId;
                this.carregarModelos(marcaId);
                this.carregarRadiadores(marcaId);
            }

            // Adicionar evento de mudança
            marcaSelect.addEventListener('change', () => {
                const selectedMarcaId = marcaSelect.value;
                if (selectedMarcaId) {
                    this.carregarModelos(selectedMarcaId);
                    this.carregarRadiadores(selectedMarcaId);
                } else {
                    document.getElementById('modelo-select').innerHTML = '<option value="">Selecione a marca primeiro</option>';
                    document.getElementById('radiadores-container').innerHTML = '';
                }
            });
        } catch (error) {
            console.error('Erro ao carregar marcas:', error);
        }
    },

    // Carregar modelos por marca
    async carregarModelos(marcaId) {
        const modeloSelect = document.getElementById('modelo-select');
        if (!modeloSelect) return;

        try {
            const modelos = await utils.fetchAPI(`${API_URL.modelos}/${marcaId}`);
            
            // Adicionar opção padrão
            modeloSelect.innerHTML = '<option value="">Todos os modelos</option>';

            // Adicionar cada modelo
            if (modelos && modelos.length > 0) {
                modelos.forEach(modelo => {
                    const option = utils.createElement('option', { value: modelo.id }, modelo.nome);
                    modeloSelect.appendChild(option);
                });
            }

            // Adicionar evento de mudança
            modeloSelect.addEventListener('change', () => {
                const selectedModeloId = modeloSelect.value;
                this.filtrarRadiadoresPorModelo(selectedModeloId);
            });
        } catch (error) {
            console.error('Erro ao carregar modelos:', error);
        }
    },

    // Carregar radiadores por marca
    async carregarRadiadores(marcaId) {
        const radiadoresContainer = document.getElementById('radiadores-container');
        if (!radiadoresContainer) return;

        try {
            const radiadores = await utils.fetchAPI(`${API_URL.radiadorPorMarca}/${marcaId}`);
            
            // Armazenar radiadores para filtragem
            this.radiadores = radiadores || [];
            
            // Exibir radiadores
            this.exibirRadiadores(this.radiadores);
        } catch (error) {
            console.error('Erro ao carregar radiadores:', error);
        }
    },

    // Filtrar radiadores por modelo
    filtrarRadiadoresPorModelo(modeloId) {
        if (!modeloId) {
            // Se nenhum modelo selecionado, mostrar todos da marca
            this.exibirRadiadores(this.radiadores);
            return;
        }

        // Filtrar por modelo
        const radiadoresFiltrados = this.radiadores.filter(radiador => 
            radiador.modelo_id.toString() === modeloId
        );

        // Exibir radiadores filtrados
        this.exibirRadiadores(radiadoresFiltrados);
    },

    // Exibir radiadores na interface
    exibirRadiadores(radiadores) {
        const radiadoresContainer = document.getElementById('radiadores-container');
        if (!radiadoresContainer) return;

        // Limpar container
        radiadoresContainer.innerHTML = '';

        // Verificar se há radiadores
        if (!radiadores || radiadores.length === 0) {
            radiadoresContainer.innerHTML = '<p class="no-results">Nenhum radiador encontrado para esta seleção.</p>';
            return;
        }

        // Adicionar cada radiador
        radiadores.forEach(radiador => {
            const radiadorCard = utils.createElement('div', { class: 'radiador-card' });
            
            // Título do radiador
            const titulo = utils.createElement('h3', {}, `${radiador.marca_nome} - ${radiador.modelo_nome}`);
            radiadorCard.appendChild(titulo);
            
            // Número da peça
            const numeroPeca = utils.createElement('p', {}, `Número da peça: ${radiador.numero_peca}`);
            radiadorCard.appendChild(numeroPeca);
            
            // Preço
            const preco = utils.createElement('p', { class: 'preco' }, `Preço: ${utils.formatarPreco(radiador.preco)}`);
            radiadorCard.appendChild(preco);
            
            // Estoque
            const estoque = utils.createElement('p', {}, `Estoque: ${radiador.quantidade_estoque} unidades`);
            radiadorCard.appendChild(estoque);
            
            // Botão de compra
            const btnComprar = utils.createElement('a', { 
                href: `#`, 
                class: 'btn btn-primary',
                'data-id': radiador.id
            }, 'Entre em contato');
            
            btnComprar.addEventListener('click', (e) => {
                e.preventDefault();
                alert(`Entre em contato para comprar: (XX) XXXX-XXXX`);
            });
            
            radiadorCard.appendChild(btnComprar);
            radiadoresContainer.appendChild(radiadorCard);
        });
    },

    // Inicializar página de busca
    init() {
        this.carregarMarcas();
    }
};

// Funções para a página de cadastro
const paginaCadastro = {
    // Carregar marcas no select
    async carregarMarcas() {
        const marcaSelect = document.getElementById('marca');
        if (!marcaSelect) return;

        try {
            const marcas = await utils.fetchAPI(API_URL.marcas);
            if (!marcas || marcas.length === 0) return;

            // Adicionar opção padrão
            marcaSelect.innerHTML = '<option value="">Selecione a marca</option>';

            // Adicionar cada marca
            marcas.forEach(marca => {
                const option = utils.createElement('option', { value: marca.id }, marca.nome);
                marcaSelect.appendChild(option);
            });

            // Adicionar evento de mudança
            marcaSelect.addEventListener('change', () => {
                const selectedMarcaId = marcaSelect.value;
                if (selectedMarcaId) {
                    this.carregarModelos(selectedMarcaId);
                } else {
                    document.getElementById('modelo').innerHTML = '<option value="">Selecione a marca primeiro</option>';
                }
            });
        } catch (error) {
            console.error('Erro ao carregar marcas:', error);
        }
    },

    // Carregar modelos por marca
    async carregarModelos(marcaId) {
        const modeloSelect = document.getElementById('modelo');
        if (!modeloSelect) return;

        try {
            const modelos = await utils.fetchAPI(`${API_URL.modelos}/${marcaId}`);
            
            // Adicionar opção padrão
            modeloSelect.innerHTML = '<option value="">Selecione o modelo</option>';

            // Adicionar cada modelo
            if (modelos && modelos.length > 0) {
                modelos.forEach(modelo => {
                    const option = utils.createElement('option', { value: modelo.id }, modelo.nome);
                    modeloSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar modelos:', error);
        }
    },

    // Configurar formulário de cadastro
    configurarFormulario() {
        const form = document.getElementById('cadastro-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Obter dados do formulário
            const formData = new FormData(form);
            const radiador = {
                numero_peca: formData.get('numero_peca'),
                marca_id: parseInt(formData.get('marca')),
                modelo_id: parseInt(formData.get('modelo')),
                descricao: formData.get('descricao'),
                preco: parseFloat(formData.get('preco')),
                quantidade_estoque: parseInt(formData.get('quantidade_estoque'))
            };

            try {
                // Enviar dados para a API
                const response = await utils.fetchAPI(API_URL.radiadores, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(radiador)
                });

                if (response && response.id) {
                    alert('Radiador cadastrado com sucesso!');
                    form.reset();
                }
            } catch (error) {
                console.error('Erro ao cadastrar radiador:', error);
                utils.mostrarErro('Erro ao cadastrar radiador. Verifique os dados e tente novamente.');
            }
        });
    },

    // Inicializar página de cadastro
    init() {
        this.carregarMarcas();
        this.configurarFormulario();
    }
};

// Inicializar a página correta com base na URL atual
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('busca.html')) {
        paginaBusca.init();
    } else if (currentPage.includes('cadastro.html')) {
        paginaCadastro.init();
    } else if (currentPage.includes('radiadores.html')) {
        // Inicializar página de todos os radiadores
    } else {
        // Página inicial
        paginaInicial.init();
    }
});