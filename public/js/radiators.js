// Script específico para a página de todos os radiadores
        document.addEventListener('DOMContentLoaded', async () => {
            const radiadoresContainer = document.getElementById('todos-radiadores');
            
            try {
                // Buscar todos os radiadores da API
                const response = await fetch('/api/radiadores');
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }
                
                const radiadores = await response.json();
                
                // Verificar se há radiadores
                if (!radiadores || radiadores.length === 0) {
                    radiadoresContainer.innerHTML = '<p class="no-results">Nenhum radiador cadastrado no sistema.</p>';
                    return;
                }
                
                // Limpar container
                radiadoresContainer.innerHTML = '';
                
                // Adicionar cada radiador
                radiadores.forEach(radiador => {
                    const radiadorCard = document.createElement('div');
                    radiadorCard.className = 'radiador-card';
                    
                    // Título do radiador
                    const titulo = document.createElement('h3');
                    titulo.textContent = `${radiador.marca_nome} - ${radiador.modelo_nome}`;
                    radiadorCard.appendChild(titulo);
                    
                    // Número da peça
                    const numeroPeca = document.createElement('p');
                    numeroPeca.textContent = `Número da peça: ${radiador.numero_peca}`;
                    radiadorCard.appendChild(numeroPeca);
                    
                    // Preço
                    const preco = document.createElement('p');
                    preco.className = 'preco';
                    preco.textContent = `Preço: ${radiador.preco.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}`;
                    radiadorCard.appendChild(preco);
                    
                    // Estoque
                    const estoque = document.createElement('p');
                    estoque.textContent = `Estoque: ${radiador.quantidade_estoque} unidades`;
                    radiadorCard.appendChild(estoque);
                    
                    // Botão de compra
                    const btnComprar = document.createElement('a');
                    btnComprar.href = '#';
                    btnComprar.className = 'btn btn-primary';
                    btnComprar.textContent = 'Comprar';
                    btnComprar.dataset.id = radiador.id;
                    
                    btnComprar.addEventListener('click', (e) => {
                        e.preventDefault();
                        alert(`Entre em contato para comprar: (XX) XXXX-XXXX`);
                    });
                    
                    radiadorCard.appendChild(btnComprar);
                    radiadoresContainer.appendChild(radiadorCard);
                });
            } catch (error) {
                console.error('Erro ao carregar radiadores:', error);
                radiadoresContainer.innerHTML = '<p class="error">Erro ao carregar radiadores. Por favor, tente novamente mais tarde.</p>';
            }
        });