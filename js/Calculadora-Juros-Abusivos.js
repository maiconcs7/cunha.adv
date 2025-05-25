// Calculadora de Juros Abusivos
document.addEventListener('DOMContentLoaded', function() {
    const calcularBtn = document.getElementById('calcularBtn');
    const resultadoDiv = document.getElementById('resultado');
    const especialistaBtn = document.getElementById('especialistaBtn');
    const modal = document.getElementById('modalAbusivo');
    const fecharModal = document.getElementById('fecharModal');

    function calcularJuros() {
        const valorFinanciado = parseFloat(document.getElementById('valorFinanciado').value);
        const valorParcela = parseFloat(document.getElementById('valorParcela').value);
        const numeroParcelas = parseInt(document.getElementById('numeroParcelas').value);
        const taxaMercado = parseFloat(document.getElementById('taxaMercado').value);

        if (isNaN(valorFinanciado) || isNaN(valorParcela) || isNaN(numeroParcelas) || isNaN(taxaMercado)) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const totalPagar = valorParcela * numeroParcelas;
        const jurosTotais = totalPagar - valorFinanciado;
        let taxaMensal = 0;

        if (valorFinanciado > 0 && numeroParcelas > 0) {
            const razao = totalPagar / valorFinanciado;
            taxaMensal = (Math.pow(razao, 1/numeroParcelas) - 1) * 100;
        }

        const taxaAnual = (Math.pow(1 + taxaMensal/100, 12) - 1) * 100;
        const isAbusivo = taxaMensal > (taxaMercado * 2);

        // Atualizar UI
        document.getElementById('totalPagar').textContent = `R$ ${totalPagar.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        document.getElementById('jurosTotais').textContent = `R$ ${jurosTotais.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        document.getElementById('taxaMensal').textContent = `${taxaMensal.toFixed(2).replace('.', ',')}%`;
        document.getElementById('taxaAnual').textContent = `${taxaAnual.toFixed(2).replace('.', ',')}%`;

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

    // Event Listeners
    calcularBtn.addEventListener('click', calcularJuros);
    fecharModal.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => e.target === modal && (modal.style.display = 'none'));
});
