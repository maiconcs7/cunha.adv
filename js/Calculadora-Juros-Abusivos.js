document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const calcularBtn = document.getElementById('calcularBtn');
    const limparBtn = document.getElementById('limparBtn');
    const resultadoDiv = document.getElementById('resultado');
    const especialistaBtn = document.getElementById('especialistaBtn');
    const modal = document.getElementById('modalAbusivo');
    const fecharModal = document.getElementById('fecharModal');

    // Função para calcular juros
    function calcularJuros() {
        // Obter valores
        const valorFinanciado = parseFloat(document.getElementById('valorFinanciado').value);
        const valorParcela = parseFloat(document.getElementById('valorParcela').value);
        const numeroParcelas = parseInt(document.getElementById('numeroParcelas').value);
        const taxaMercado = parseFloat(document.getElementById('taxaMercado').value);
        
        // Validar
        if (isNaN(valorFinanciado) || isNaN(valorParcela) || isNaN(numeroParcelas) || isNaN(taxaMercado)) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }
        
        // Cálculos
        const totalPagar = valorParcela * numeroParcelas;
        const jurosTotais = totalPagar - valorFinanciado;
        
        // Calcular taxa mensal aproximada
        let taxaMensal = 0;
        if (valorFinanciado > 0 && numeroParcelas > 0) {
            const razao = totalPagar / valorFinanciado;
            taxaMensal = (Math.pow(razao, 1/numeroParcelas) - 1) * 100;
        }
        
        // Calcular taxa anual
        const taxaAnual = (Math.pow(1 + taxaMensal/100, 12) - 1) * 100;
        
        // Verificar se é abusivo
        const isAbusivo = taxaMensal > (taxaMercado * 2);
        
        // Mostrar resultados
        document.getElementById('totalPagar').textContent = 'R$ ' + totalPagar.toLocaleString('pt-BR', {minimumFractionDigits: 2});
        document.getElementById('jurosTotais').textContent = 'R$ ' + jurosTotais.toLocaleString('pt-BR', {minimumFractionDigits: 2});
        document.getElementById('taxaMensal').textContent = taxaMensal.toFixed(2).replace('.', ',') + '%';
        document.getElementById('taxaAnual').textContent = taxaAnual.toFixed(2).replace('.', ',') + '%';
        
        const situacaoElement = document.getElementById('situacao');
        if (isAbusivo) {
            situacaoElement.textContent = 'JUROS ABUSIVOS';
            situacaoElement.className = 'result-value text-danger';
            especialistaBtn.style.display = 'block';
            modal.style.display = 'flex';
        } else {
            situacaoElement.textContent = 'Dentro do esperado';
            situacaoElement.className = 'result-value text-success';
            especialistaBtn.style.display = 'none';
        }
        
        resultadoDiv.style.display = 'block';
    }

    // Função para limpar campos
    function limparCampos() {
        // Resetar inputs
        document.getElementById('valorFinanciado').value = '';
        document.getElementById('valorParcela').value = '';
        document.getElementById('numeroParcelas').value = '';
        document.getElementById('taxaMercado').value = '';
        
        // Resetar resultados
        document.getElementById('totalPagar').textContent = 'R$ 0,00';
        document.getElementById('jurosTotais').textContent = 'R$ 0,00';
        document.getElementById('taxaMensal').textContent = '0%';
        document.getElementById('taxaAnual').textContent = '0%';
        document.getElementById('situacao').textContent = '-';
        document.getElementById('situacao').className = 'result-value';
        
        // Esconder elementos
        resultadoDiv.style.display = 'none';
        especialistaBtn.style.display = 'none';
        modal.style.display = 'none';
    }

    // Event Listeners
    calcularBtn.addEventListener('click', calcularJuros);
    limparBtn.addEventListener('click', limparCampos);
    
    // Fechar modal
    fecharModal.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => e.target === modal && (modal.style.display = 'none'));
});
