document.addEventListener('DOMContentLoaded', function() {
    const calcularBtn = document.getElementById('calcularBtn');
    const limparBtn = document.getElementById('limparBtn');
    const inputs = document.querySelectorAll('input[type="number"]');

    // Função para sanitizar inputs
    function sanitizarInput(valor) {
        return parseFloat(valor.replace(',', '.')) || 0;
    }

    // Validar inputs em tempo real
    inputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const valor = e.target.value.replace(/[^0-9.,]/g, '');
            e.target.value = valor.replace(',', '.');
        });
    });

    function calcularTaxaJuros(valorFinanciado, valorParcela, numParcelas) {
        let taxa = 0.1;
        const precisao = 0.000001;
        const maxIteracoes = 100;

        for (let i = 0; i < maxIteracoes; i++) {
            const f = valorFinanciado * Math.pow(1 + taxa, numParcelas) - 
                    valorParcela * (Math.pow(1 + taxa, numParcelas) - 1) / taxa;
            
            const fPrime = numParcelas * valorFinanciado * Math.pow(1 + taxa, numParcelas - 1) -
                         valorParcela * ((numParcelas * taxa * Math.pow(1 + taxa, numParcelas) - 
                         (Math.pow(1 + taxa, numParcelas) - 1)) / Math.pow(taxa, 2);
            
            const novaTaxa = taxa - f / fPrime;
            
            if (Math.abs(novaTaxa - taxa) < precisao) break;
            
            taxa = novaTaxa;
        }
        
        return taxa * 100;
    }

    function calcularJuros() {
        const valorFinanciado = sanitizarInput(document.getElementById('valorFinanciado').value);
        const valorParcela = sanitizarInput(document.getElementById('valorParcela').value);
        const numeroParcelas = parseInt(document.getElementById('numeroParcelas').value);
        const taxaMercado = sanitizarInput(document.getElementById('taxaMercado').value);

        if ([valorFinanciado, valorParcela, numeroParcelas, taxaMercado].some(v => v <= 0)) {
            alert('Preencha todos os campos com valores válidos e positivos');
            return;
        }

        const taxaMensal = calcularTaxaJuros(valorFinanciado, valorParcela, numeroParcelas);
        const taxaAnual = (Math.pow(1 + taxaMensal/100, 12) - 1) * 100;
        const isAbusivo = taxaMensal > (taxaMercado * 2);

        atualizarResultados({
            totalPagar: valorParcela * numeroParcelas,
            jurosTotais: (valorParcela * numeroParcelas) - valorFinanciado,
            taxaMensal,
            taxaAnual,
            isAbusivo
        });
    }

    function atualizarResultados({totalPagar, jurosTotais, taxaMensal, taxaAnual, isAbusivo}) {
        const formatarMoeda = valor => `R$ ${valor.toFixed(2).replace('.', ',')}`;
        const formatarPorcentagem = valor => `${valor.toFixed(2).replace('.', ',')}%`;

        document.getElementById('totalPagar').textContent = formatarMoeda(totalPagar);
        document.getElementById('jurosTotais').textContent = formatarMoeda(jurosTotais);
        document.getElementById('taxaMensal').textContent = formatarPorcentagem(taxaMensal);
        document.getElementById('taxaAnual').textContent = formatarPorcentagem(taxaAnual);

        const situacaoElement = document.getElementById('situacao');
        situacaoElement.textContent = isAbusivo ? 'JUROS ABUSIVOS' : 'Dentro do esperado';
        situacaoElement.className = `result-value ${isAbusivo ? 'text-danger' : 'text-success'}`;

        document.getElementById('especialistaBtn').style.display = isAbusivo ? 'block' : 'none';
        document.getElementById('modalAbusivo').style.display = isAbusivo ? 'flex' : 'none';
    }

    function limparCampos() {
        document.querySelectorAll('input').forEach(input => input.value = '');
        document.getElementById('resultado').style.display = 'none';
        document.querySelectorAll('.result-value').forEach(el => {
            el.textContent = '-';
            el.className = 'result-value';
        });
    }

    calcularBtn.addEventListener('click', calcularJuros);
    limparBtn.addEventListener('click', limparCampos);
});
