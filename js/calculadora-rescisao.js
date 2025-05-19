// Arquivo: /home/ubuntu/juridico-site/js/calculadora-rescisao.js

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calculadoraRescisaoForm");
    const resultadoDiv = document.getElementById("resultadoRescisao");
    const detalhesResultadoDiv = document.getElementById("detalhesResultado");
    const avisoPrevioSelect = document.getElementById("avisoPrevio");
    const diasAvisoTrabalhadoGroup = document.getElementById("diasAvisoTrabalhadoGroup");

    if (avisoPrevioSelect) {
        avisoPrevioSelect.addEventListener("change", function() {
            if (this.value === "trabalhado") {
                diasAvisoTrabalhadoGroup.style.display = "block";
            } else {
                diasAvisoTrabalhadoGroup.style.display = "none";
            }
        });
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            calcularRescisao();
        });

        form.addEventListener("reset", function() {
            resultadoDiv.style.display = "none";
            detalhesResultadoDiv.innerHTML = "";
            if (diasAvisoTrabalhadoGroup) diasAvisoTrabalhadoGroup.style.display = "none";
        });
    }

    function calcularRescisao() {
        // Coleta de dados do formulário
        const dataAdmissao = new Date(document.getElementById("dataAdmissao").value + "T00:00:00"); // Adiciona T00:00:00 para evitar problemas de fuso
        const dataDemissao = new Date(document.getElementById("dataDemissao").value + "T00:00:00");
        const ultimoSalarioBruto = parseFloat(document.getElementById("ultimoSalarioBruto").value);
        const motivoRescisao = document.getElementById("motivoRescisao").value;
        const tipoAvisoPrevio = avisoPrevioSelect ? avisoPrevioSelect.value : "nao_aplicavel";
        const diasAvisoTrabalhado = parseInt(document.getElementById("diasAvisoTrabalhado").value) || 0;
        const feriasVencidas = document.getElementById("feriasVencidas").value;
        // const diasFeriasVendidas = parseInt(document.getElementById("diasFeriasVendidas").value) || 0; // Lógica de abono não implementada nesta versão simplificada
        const saldoFgtsInformado = parseFloat(document.getElementById("saldoFgts").value) || 0;
        // const dependentesIrrf = parseInt(document.getElementById("dependentesIrrf").value) || 0; // IRRF não implementado nesta versão

        if (isNaN(dataAdmissao.getTime()) || isNaN(dataDemissao.getTime()) || isNaN(ultimoSalarioBruto)) {
            detalhesResultadoDiv.innerHTML = "<p class=\"error\">Por favor, preencha todas as datas e o salário corretamente.</p>";
            resultadoDiv.style.display = "block";
            return;
        }

        if (dataDemissao < dataAdmissao) {
            detalhesResultadoDiv.innerHTML = "<p class=\"error\">A data de demissão não pode ser anterior à data de admissão.</p>";
            resultadoDiv.style.display = "block";
            return;
        }

        let htmlResultado = "<h4>Verbas Rescisórias Estimadas:</h4><ul>";
        let totalRescisao = 0;
        let totalDescontos = 0;

        // --- Cálculos --- 

        // 1. Saldo de Salário
        const diasTrabalhadosNoMesDemissao = dataDemissao.getDate(); // Considera o dia da demissão
        const salarioPorDia = ultimoSalarioBruto / 30;
        const saldoSalario = salarioPorDia * diasTrabalhadosNoMesDemissao;
        htmlResultado += `<li>Saldo de Salário (${diasTrabalhadosNoMesDemissao} dias): R$ ${saldoSalario.toFixed(2)}</li>`;
        totalRescisao += saldoSalario;

        // 2. Aviso Prévio
        let valorAvisoPrevio = 0;
        let diasAvisoPrevioCalculado = 30;
        const anosTrabalhados = Math.floor((dataDemissao - dataAdmissao) / (365.25 * 24 * 60 * 60 * 1000));
        if (anosTrabalhados >= 1) {
            diasAvisoPrevioCalculado += Math.min(anosTrabalhados * 3, 60); // Acréscimo de 3 dias por ano, limitado a 90 dias no total (30 + 60)
        }

        if (motivoRescisao === "sem_justa_causa_empregador" || motivoRescisao === "rescisao_indireta") {
            if (tipoAvisoPrevio === "indenizado_empregador") {
                valorAvisoPrevio = salarioPorDia * diasAvisoPrevioCalculado;
                htmlResultado += `<li>Aviso Prévio Indenizado (${diasAvisoPrevioCalculado} dias): R$ ${valorAvisoPrevio.toFixed(2)}</li>`;
                totalRescisao += valorAvisoPrevio;
            } else if (tipoAvisoPrevio === "trabalhado") {
                 // O salário dos dias trabalhados no aviso já está coberto pelo pagamento normal do mês ou saldo.
                 // Se o aviso for maior que 30 dias, pode haver indenização dos dias excedentes.
                 if(diasAvisoPrevioCalculado > diasAvisoTrabalhado && diasAvisoTrabalhado > 0){
                    const diasIndenizar = diasAvisoPrevioCalculado - diasAvisoTrabalhado;
                    valorAvisoPrevio = salarioPorDia * diasIndenizar;
                    htmlResultado += `<li>Aviso Prévio Indenizado (dias excedentes ${diasIndenizar}): R$ ${valorAvisoPrevio.toFixed(2)}</li>`;
                    totalRescisao += valorAvisoPrevio;
                 } else if (diasAvisoTrabalhado === 0) { // Não cumpriu aviso trabalhado, mas era para ser
                    valorAvisoPrevio = salarioPorDia * diasAvisoPrevioCalculado;
                    htmlResultado += `<li>Aviso Prévio Indenizado (não cumprido ${diasAvisoPrevioCalculado} dias): R$ ${valorAvisoPrevio.toFixed(2)}</li>`;
                    totalRescisao += valorAvisoPrevio;
                 }
            }
        } else if (motivoRescisao === "pedido_demissao" && tipoAvisoPrevio === "indenizado_empregado") {
            valorAvisoPrevio = ultimoSalarioBruto; // Desconto de 1 salário
            htmlResultado += `<li>Desconto Aviso Prévio (não cumprido): R$ -${valorAvisoPrevio.toFixed(2)}</li>`;
            totalDescontos += valorAvisoPrevio;
        }

        // 3. Férias Vencidas + 1/3 (Simplificado)
        let valorFeriasVencidas = 0;
        if (feriasVencidas === "sim_um_periodo") {
            valorFeriasVencidas = ultimoSalarioBruto + (ultimoSalarioBruto / 3);
            htmlResultado += `<li>Férias Vencidas (1 período) + 1/3: R$ ${valorFeriasVencidas.toFixed(2)}</li>`;
            totalRescisao += valorFeriasVencidas;
        } else if (feriasVencidas === "sim_dois_periodos") {
            valorFeriasVencidas = (ultimoSalarioBruto + (ultimoSalarioBruto / 3)) * 2;
            htmlResultado += `<li>Férias Vencidas (2 períodos, em dobro) + 1/3: R$ ${valorFeriasVencidas.toFixed(2)}</li>`; // Cálculo da dobra não implementado em detalhe
            totalRescisao += valorFeriasVencidas;
        }

        // 4. Férias Proporcionais + 1/3
        let mesesTrabalhadosPeriodoAquisitivo = 0;
        // Calcula meses desde o início do último período aquisitivo até a demissão
        // Esta é uma simplificação. O cálculo correto do período aquisitivo é mais complexo.
        const diaAdmissao = dataAdmissao.getDate();
        const mesAdmissao = dataAdmissao.getMonth();
        const anoAdmissao = dataAdmissao.getFullYear();

        const diaDemissao = dataDemissao.getDate();
        const mesDemissao = dataDemissao.getMonth();
        const anoDemissao = dataDemissao.getFullYear();

        let ultimoAniversarioContrato = new Date(anoDemissao, mesAdmissao, diaAdmissao);
        if (ultimoAniversarioContrato > dataDemissao) {
            ultimoAniversarioContrato.setFullYear(ultimoAniversarioContrato.getFullYear() - 1);
        }
        
        // Contagem de meses para férias proporcionais
        let mesesParaFeriaProporcional = 0;
        let tempDate = new Date(ultimoAniversarioContrato);
        while(tempDate <= dataDemissao){
            if(tempDate.getDate() >= diaAdmissao || (tempDate.getMonth() === mesDemissao && tempDate.getFullYear() === anoDemissao)){
                 // Considera fração > 14 dias como mês integral
                if(dataDemissao.getDate() > 14 && tempDate.getMonth() === dataDemissao.getMonth() && tempDate.getFullYear() === dataDemissao.getFullYear()){
                     mesesParaFeriaProporcional++;
                } else if (tempDate.getMonth() !== dataDemissao.getMonth() || tempDate.getFullYear() !== dataDemissao.getFullYear()){ // se não for o mês da demissão
                     mesesParaFeriaProporcional++;
                }
            }
            tempDate.setMonth(tempDate.getMonth() + 1);
            if (tempDate > dataDemissao && dataDemissao.getDate() > 14 && (tempDate.getMonth()-1) === dataDemissao.getMonth() && (tempDate.getFullYear()) === dataDemissao.getFullYear()){
                 // Caso especial para o último mês se a demissão for depois do dia 14
            } else if (tempDate > dataDemissao) {
                break;
            }
        }
        // Correção para o caso de demissão no mesmo mês do aniversário do contrato, mas antes do dia
        if (mesDemissao === mesAdmissao && diaDemissao < diaAdmissao && mesesParaFeriaProporcional > 0) {
             // mesesParaFeriaProporcional--; // Não deve ter férias proporcionais se não completou o mês
        } else if (mesDemissao === mesAdmissao && diaDemissao >= diaAdmissao && mesesParaFeriaProporcional === 0 && (dataDemissao.getFullYear() > dataAdmissao.getFullYear() || dataDemissao.getMonth() > dataAdmissao.getMonth() )) {
            // Demissão no mês de aniversário, após o dia, mas cálculo deu 0 meses.
            // Isso pode indicar que o período aquisitivo acabou de virar, então as férias seriam vencidas.
            // Para simplificar, se deu 0 e não é o primeiro ano, consideramos 0.
        }

        // Adiciona projeção do aviso prévio indenizado para férias proporcionais
        if (motivoRescisao === "sem_justa_causa_empregador" && tipoAvisoPrevio === "indenizado_empregador") {
            const diasAvisoParaFerias = diasAvisoPrevioCalculado;
            mesesParaFeriaProporcional += Math.floor(diasAvisoParaFerias / 30); 
            // Lógica de fração > 14 dias para aviso não implementada aqui para simplificar
        }
        mesesParaFeriaProporcional = Math.min(mesesParaFeriaProporcional, 12); // Limita a 12/12 avos

        if (motivoRescisao !== "justa_causa_empregador" && mesesParaFeriaProporcional > 0) {
            const feriasProporcionais = (ultimoSalarioBruto / 12) * mesesParaFeriaProporcional;
            const umTercoFeriasProporcionais = feriasProporcionais / 3;
            const totalFeriasProporcionais = feriasProporcionais + umTercoFeriasProporcionais;
            htmlResultado += `<li>Férias Proporcionais (${mesesParaFeriaProporcional}/12 avos) + 1/3: R$ ${totalFeriasProporcionais.toFixed(2)}</li>`;
            totalRescisao += totalFeriasProporcionais;
        }

        // 5. 13º Salário Proporcional
        let mesesTrabalhadosAno = 0;
        // Contagem de meses para 13º
        // Considera-se mês trabalhado se houve mais de 14 dias de trabalho no mês.
        let dataInicioContagem13 = new Date(dataDemissao.getFullYear(), 0, 1); // 1º de Janeiro do ano da demissão
        if (dataAdmissao.getFullYear() === dataDemissao.getFullYear()) { // Se admitido no mesmo ano da demissão
            dataInicioContagem13 = new Date(dataAdmissao);
        }

        for (let m = dataInicioContagem13.getMonth(); m <= dataDemissao.getMonth(); m++) {
            if (dataDemissao.getFullYear() === dataInicioContagem13.getFullYear()) {
                if (m === dataInicioContagem13.getMonth() && dataInicioContagem13.getDate() > 15) {
                    // não conta o primeiro mês se começou depois do dia 15
                } else if (m === dataDemissao.getMonth() && dataDemissao.getDate() < 15) {
                    // não conta o último mês se saiu antes do dia 15
                } else {
                    mesesTrabalhadosAno++;
                }
            }
        }
        
        // Adiciona projeção do aviso prévio indenizado para 13º
        if (motivoRescisao === "sem_justa_causa_empregador" && tipoAvisoPrevio === "indenizado_empregador") {
            const dataProjetadaDemissao = new Date(dataDemissao);
            dataProjetadaDemissao.setDate(dataProjetadaDemissao.getDate() + diasAvisoPrevioCalculado);
            if (dataProjetadaDemissao.getFullYear() > dataDemissao.getFullYear()) {
                // Se o aviso projetado virar o ano, recalcula os meses do ano da demissão e adiciona os do próximo
                // Esta parte é complexa e simplificada aqui.
                // Para simplificar, se o aviso vira o ano, adicionamos os meses correspondentes do aviso no ano seguinte.
                let mesesAvisoNoAnoSeguinte = Math.floor( (diasAvisoPrevioCalculado - (new Date(dataDemissao.getFullYear(),11,31) - dataDemissao)/(1000 * 60 * 60 * 24) ) /30 );
                // Esta lógica de projeção de 13o para aviso que vira o ano é complexa e pode não estar 100% precisa na simplificação.
            } else {
                 // Se o aviso não virar o ano, mas a projeção aumentar os dias no mês da demissão para > 14
                if (dataDemissao.getDate() < 15 && dataProjetadaDemissao.getDate() >=15 && dataProjetadaDemissao.getMonth() === dataDemissao.getMonth()){
                    // Se o aviso fez o mês da demissão contar, e não estava contando antes
                    let contavaMesDemissaoAntes = false;
                    if (dataInicioContagem13.getMonth() === dataDemissao.getMonth() && dataInicioContagem13.getDate() <= 15 && dataDemissao.getDate() >=15){
                        contavaMesDemissaoAntes = true;
                    }
                    if(!contavaMesDemissaoAntes) mesesTrabalhadosAno++;
                }
                // Adiciona 1/12 avos para cada 30 dias de aviso
                mesesTrabalhadosAno += Math.floor(diasAvisoPrevioCalculado / 30); 
            }
        }
        mesesTrabalhadosAno = Math.min(mesesTrabalhadosAno, 12);

        if (motivoRescisao !== "justa_causa_empregador" && mesesTrabalhadosAno > 0) {
            const decimoTerceiroProporcional = (ultimoSalarioBruto / 12) * mesesTrabalhadosAno;
            htmlResultado += `<li>13º Salário Proporcional (${mesesTrabalhadosAno}/12 avos): R$ ${decimoTerceiroProporcional.toFixed(2)}</li>`;
            totalRescisao += decimoTerceiroProporcional;
        }

        // 6. FGTS (Saque e Multa)
        let multaFgts = 0;
        if (motivoRescisao === "sem_justa_causa_empregador" || motivoRescisao === "rescisao_indireta") {
            htmlResultado += `<li>Saque do FGTS (saldo total depositado): Liberado (valor depende dos depósitos)</li>`;
            if (saldoFgtsInformado > 0) {
                multaFgts = saldoFgtsInformado * 0.40;
                htmlResultado += `<li>Multa de 40% sobre o Saldo do FGTS: R$ ${multaFgts.toFixed(2)} (calculado sobre R$ ${saldoFgtsInformado.toFixed(2)})</li>`;
                totalRescisao += multaFgts;
            }
        } else if (motivoRescisao === "acordo_comum") {
            htmlResultado += `<li>Saque de 80% do Saldo do FGTS: Liberado (valor depende dos depósitos)</li>`;
            if (saldoFgtsInformado > 0) {
                multaFgts = saldoFgtsInformado * 0.20;
                htmlResultado += `<li>Multa de 20% sobre o Saldo do FGTS: R$ ${multaFgts.toFixed(2)} (calculado sobre R$ ${saldoFgtsInformado.toFixed(2)})</li>`;
                totalRescisao += multaFgts;
            }
        }

        // 7. Descontos (INSS e IRRF - Simplificado, IRRF não calculado)
        // INSS sobre Saldo de Salário
        let inssSaldoSalario = calcularINSS(saldoSalario);
        htmlResultado += `<li>Desconto INSS sobre Saldo de Salário: R$ -${inssSaldoSalario.toFixed(2)}</li>`;
        totalDescontos += inssSaldoSalario;

        // INSS sobre 13º Salário
        if (motivoRescisao !== "justa_causa_empregador" && mesesTrabalhadosAno > 0) {
            const decimoTerceiroParaInss = (ultimoSalarioBruto / 12) * mesesTrabalhadosAno;
            let inssDecimoTerceiro = calcularINSS(decimoTerceiroParaInss);
            htmlResultado += `<li>Desconto INSS sobre 13º Salário: R$ -${inssDecimoTerceiro.toFixed(2)}</li>`;
            totalDescontos += inssDecimoTerceiro;
        }
        // IRRF não será calculado nesta versão simplificada.

        htmlResultado += "</ul>";
        htmlResultado += `<hr><h4>Total Bruto Estimado: R$ ${totalRescisao.toFixed(2)}</h4>`;
        htmlResultado += `<h4>Total de Descontos Estimado: R$ ${totalDescontos.toFixed(2)}</h4>`;
        htmlResultado += `<h3>Valor Líquido Estimado a Receber: R$ ${(totalRescisao - totalDescontos).toFixed(2)}</h3>`;

        detalhesResultadoDiv.innerHTML = htmlResultado;
        resultadoDiv.style.display = "block";
    }

    function calcularINSS(baseCalculo) {
        let inss = 0;
        // Tabela INSS 2024 (Exemplo - USAR TABELA ATUALIZADA)
        if (baseCalculo <= 1412.00) {
            inss = baseCalculo * 0.075;
        } else if (baseCalculo <= 2666.68) {
            inss = (baseCalculo * 0.09) - 21.18; // 1412 * 0.075 + (base - 1412) * 0.09
        } else if (baseCalculo <= 4000.03) {
            inss = (baseCalculo * 0.12) - 101.18; // ... dedução acumulada
        } else if (baseCalculo <= 7786.02) { // Teto 2024
            inss = (baseCalculo * 0.14) - 181.18;
        } else {
            inss = (7786.02 * 0.14) - 181.18; // Contribuição sobre o teto
            // Ou fixo: 908.86 (valor teto 2024)
        }
        return Math.max(0, inss); // Garante que não seja negativo
    }
});
