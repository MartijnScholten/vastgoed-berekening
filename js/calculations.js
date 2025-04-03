// Berekeningsfuncties voor de vastgoed calculator

function berekenScenarioResultaten() {
    const eigenVermogen = parseFloat(document.getElementById('eigenVermogen').value);
    const gemiddeldePandwaarde = parseFloat(document.getElementById('pandwaarde').value);
    const ltv = parseFloat(document.getElementById('ltv').value) / 100;
    const rentePercentage = parseFloat(document.getElementById('rentePercentage').value) / 100;
    const vennootschapsbelasting = 0.198;
    const rentePrive = rentePercentage;
    const isHolding = document.getElementById('structuur').value === 'holding';
    const waardestijging = parseFloat(document.getElementById('waardestijging').value) / 100;

    // Bereken initiële situatie
    const totaleVastgoedwaarde = eigenVermogen / (1 - ltv);
    const hypotheek = totaleVastgoedwaarde - eigenVermogen;
    const aantalWoningen = Math.floor(totaleVastgoedwaarde / gemiddeldePandwaarde);

    // Bereken verschillende scenario's
    const scenarios = [];
    const huurRendementen = [4, 5, 6, 7, 8];
    const kostenPercentages = [1, 1.5, 2];

    huurRendementen.forEach(huurRendement => {
        kostenPercentages.forEach(kostenPercentage => {
            const huurInkomsten = totaleVastgoedwaarde * (huurRendement / 100);
            const hypotheekRente = hypotheek * rentePercentage;
            const onderhoudskosten = totaleVastgoedwaarde * (kostenPercentage / 100);
            let nettoInkomen;

            if (isHolding) {
                const vennootschapsbelastingBedrag = rentePrive * vennootschapsbelasting;
                nettoInkomen = huurInkomsten - hypotheekRente - onderhoudskosten - vennootschapsbelastingBedrag;
            } else {
                nettoInkomen = huurInkomsten - hypotheekRente - onderhoudskosten;
            }

            const roe = (nettoInkomen / eigenVermogen) * 100;
            const roePlusWaardestijging = roe + (waardestijging * 100);

            scenarios.push({
                huurRendement,
                kostenPercentage,
                huurInkomsten,
                hypotheekRente,
                onderhoudskosten,
                rentePrive,
                vennootschapsbelasting: isHolding ? rentePrive * vennootschapsbelasting : 0,
                nettoInkomen,
                nettoInkomenPerMaand: nettoInkomen / 12,
                vastgoedwaarde: totaleVastgoedwaarde,
                roe,
                roePlusWaardestijging
            });
        });
    });

    return scenarios;
}

function berekenVermogensgroei() {
    // Haal waarden op uit de input velden
    const startEigenVermogen = parseFloat(document.getElementById('startEigenVermogen')?.value || 0);
    const pandwaarde = parseFloat(document.getElementById('pandwaarde')?.value || 0);
    const looptijd = parseInt(document.getElementById('looptijdVermogensgroei')?.value || 0);
    const ltv = parseFloat(document.getElementById('ltvVermogensgroei')?.value || 0) / 100;
    const rentePercentage = parseFloat(document.getElementById('rentePercentageVermogensgroei')?.value || 0) / 100;
    const huurrendement = parseFloat(document.getElementById('huurrendementVermogensgroei')?.value || 0) / 100;
    const huurstijging = parseFloat(document.getElementById('huurstijgingVermogensgroei')?.value || 0) / 100;
    const kostenPercentage = parseFloat(document.getElementById('kostenPercentageVermogensgroei')?.value || 0) / 100;
    const waardestijging = parseFloat(document.getElementById('waardestijgingVermogensgroei')?.value || 0) / 100;
    const minimaalInkomen = parseFloat(document.getElementById('minimaalInkomen')?.value || 0);
    const minimaalInkomenInflatie = parseFloat(document.getElementById('minimaalInkomenInflatie')?.value || 0) / 100;
    const aankoopFrequentie = parseInt(document.getElementById('aankoopFrequentie')?.value || 12); // Nieuwe invoer: frequentie in maanden

    // Initialiseer arrays voor de resultaten
    const jaren = [];
    const vastgoedwaarden = [];
    const nettoInkomens = [];
    const eigenVermogens = [];
    const overwaardes = [];
    const nietGebruikteCashflows = [];
    const roes = [];
    const totaalRendementen = [];
    const aantalPanden = [];
    const minimaalInkomens = [];
    const minimaalInkomensJaar = [];

    // Bereken initiële waardes
    let huidigeVastgoedwaarde = startEigenVermogen / (1 - ltv);
    let huidigEigenVermogen = startEigenVermogen;
    let huidigHypotheek = huidigeVastgoedwaarde - startEigenVermogen;
    let huidigOverwaarde = 0;
    let huidigNietGebruikteCashflow = 0;
    let cumulatieveOverwaarde = 0;
    let huidigAantalPanden = Math.ceil(huidigeVastgoedwaarde / pandwaarde);
    
    if (huidigAantalPanden < 1) huidigAantalPanden = 1;
    
    huidigeVastgoedwaarde = huidigAantalPanden * pandwaarde;
    huidigHypotheek = huidigeVastgoedwaarde * ltv;

    // Update initiële resultaten (alleen vastgoedwaarde en eigen vermogen)
    jaren.push('START');
    vastgoedwaarden.push(Math.round(huidigeVastgoedwaarde));
    eigenVermogens.push(Math.round(huidigEigenVermogen));
    aantalPanden.push(huidigAantalPanden);
    
    // Overige waardes zijn nog niet relevant bij start
    nettoInkomens.push(null);
    overwaardes.push(null);
    nietGebruikteCashflows.push(null);
    roes.push(null);
    totaalRendementen.push(null);
    minimaalInkomens.push(null);
    minimaalInkomensJaar.push(null);

    // Berekeningen voor jaar 1
    // Update waardes met inflatie (cumulatief)
    const minimaalInkomenDitJaar = minimaalInkomen;  // In jaar 1 nog geen inflatie
    const minimaalInkomenJaar = minimaalInkomenDitJaar * 12; // Jaar inkomen
    
    // Bereken waardestijging voor jaar 1
    const waardestijgingBedrag = Math.round(huidigeVastgoedwaarde * waardestijging);
    huidigeVastgoedwaarde += waardestijgingBedrag;
    
    // Bereken netto inkomen voor jaar 1
    const huur = huidigeVastgoedwaarde * huurrendement;
    const kosten = huidigeVastgoedwaarde * kostenPercentage;
    const rente = huidigHypotheek * rentePercentage;
    const huidigNettoInkomen = Math.round(huur - kosten - rente);
    
    // Controleer of het inkomen voldoende is t.o.v. minimaal inkomen
    let effectiefNettoInkomen = huidigNettoInkomen;
    
    // Bereken overwaarde voor jaar 1 (cumulatief)
    huidigOverwaarde = waardestijgingBedrag;
    cumulatieveOverwaarde = waardestijgingBedrag;
    
    // Bereken niet-gebruikte cashflow voor jaar 1
    let nietGebruikteCashflow = 0;
    if (huidigNettoInkomen > minimaalInkomenJaar) {
        nietGebruikteCashflow = Math.round(huidigNettoInkomen - minimaalInkomenJaar);
    }
    
    // Update eigen vermogen voor jaar 1 (vastgoedwaarde - hypotheek)
    huidigEigenVermogen = Math.round(huidigeVastgoedwaarde - huidigHypotheek);
    
    // Bereken ROE en totaal rendement voor jaar 1
    const roe = (huidigNettoInkomen / huidigEigenVermogen) * 100;
    const totaalRendement = roe + (waardestijging * 100);
    
    // Voeg jaar 1 resultaten toe
    jaren.push(1);
    vastgoedwaarden.push(Math.round(huidigeVastgoedwaarde));
    nettoInkomens.push(Math.round(effectiefNettoInkomen));
    eigenVermogens.push(Math.round(huidigEigenVermogen));
    overwaardes.push(Math.round(cumulatieveOverwaarde));  // Gebruik cumulatieve overwaarde
    nietGebruikteCashflows.push(Math.round(nietGebruikteCashflow));
    roes.push(roe);
    totaalRendementen.push(totaalRendement);
    aantalPanden.push(huidigAantalPanden);
    minimaalInkomens.push(Math.round(minimaalInkomenDitJaar));
    minimaalInkomensJaar.push(Math.round(minimaalInkomenJaar));

    // Bereken voor jaar 2 en verder
    for (let jaar = 2; jaar <= looptijd; jaar++) {
        // Update waardes met inflatie (cumulatief)
        const minimaalInkomenDitJaar = minimaalInkomen * Math.pow(1 + minimaalInkomenInflatie, jaar);
        const minimaalInkomenJaar = minimaalInkomenDitJaar * 12; // Jaar inkomen
        
        minimaalInkomens.push(Math.round(minimaalInkomenDitJaar));
        minimaalInkomensJaar.push(Math.round(minimaalInkomenJaar));

        // Bereken waardestijging
        const waardestijgingBedrag = Math.round(huidigeVastgoedwaarde * waardestijging);
        huidigeVastgoedwaarde += waardestijgingBedrag;
        
        // Bereken nieuwe huurinkomsten met huurstijging (cumulatief)
        const huur = huidigeVastgoedwaarde * huurrendement * Math.pow(1 + huurstijging, jaar - 1);
        const kosten = huidigeVastgoedwaarde * kostenPercentage;
        const rente = huidigHypotheek * rentePercentage;
        const huidigNettoInkomen = Math.round(huur - kosten - rente);
        
        // Bereken niet-gebruikte cashflow en overwaarde
        cumulatieveOverwaarde += waardestijgingBedrag;
        
        // Niet-gebruikte cashflow alleen als er inkomen over is
        let huidigNietGebruikteCashflow = 0;
        if (huidigNettoInkomen > minimaalInkomenJaar) {
            huidigNietGebruikteCashflow = Math.round(huidigNettoInkomen - minimaalInkomenJaar);
        }

        // Check of het tijd is om een nieuw pand te kopen (op basis van aankoopfrequentie)
        const maandenSindsStart = (jaar - 1) * 12;
        const isAankoopMoment = maandenSindsStart % aankoopFrequentie === 0 && maandenSindsStart > 0;
        
        let nieuweHuur = huur;
        let nieuweKosten = kosten;
        let nieuweRente = rente;
        let nieuwNettoInkomen = huidigNettoInkomen;
        
        // Bereken nieuwe investeringen met beschikbaar kapitaal
        const beschikbaarVoorInvestering = huidigNietGebruikteCashflow + cumulatieveOverwaarde;
        const benodigdEigenVermogenPerPand = pandwaarde * (1 - ltv);
        
        // Alleen investeren als het een aankoopmoment is EN er genoeg kapitaal is
        if (isAankoopMoment && beschikbaarVoorInvestering >= benodigdEigenVermogenPerPand) {
            const aantalNieuwePanden = Math.floor(beschikbaarVoorInvestering / benodigdEigenVermogenPerPand);
            const gebruiktInvesteringsbedrag = aantalNieuwePanden * benodigdEigenVermogenPerPand;
            const nieuweInvestering = aantalNieuwePanden * pandwaarde;
            
            // Voeg nieuwe panden toe
            huidigeVastgoedwaarde += nieuweInvestering;
            huidigHypotheek += nieuweInvestering * ltv;
            huidigAantalPanden += aantalNieuwePanden;
            
            // Herbereken inkomen met nieuwe panden
            nieuweHuur = huidigeVastgoedwaarde * huurrendement * Math.pow(1 + huurstijging, jaar - 1);
            nieuweKosten = huidigeVastgoedwaarde * kostenPercentage;
            nieuweRente = huidigHypotheek * rentePercentage;
            nieuwNettoInkomen = Math.round(nieuweHuur - nieuweKosten - nieuweRente);
            
            // Reset cumulatieve overwaarde na investering
            cumulatieveOverwaarde = beschikbaarVoorInvestering - gebruiktInvesteringsbedrag;
            
            // Herbereken niet-gebruikte cashflow met nieuwe inkomen
            if (nieuwNettoInkomen > minimaalInkomenJaar) {
                huidigNietGebruikteCashflow = Math.round(nieuwNettoInkomen - minimaalInkomenJaar);
            } else {
                huidigNietGebruikteCashflow = 0;
            }
        }

        // Update eigen vermogen (vastgoedwaarde - hypotheek)
        huidigEigenVermogen = Math.round(huidigeVastgoedwaarde - huidigHypotheek);

        // Bereken ROE en totaal rendement
        const huidigeRoe = (nieuwNettoInkomen / huidigEigenVermogen) * 100;
        const huidigTotaalRendement = huidigeRoe + (waardestijging * 100);

        // Update resultaten
        jaren.push(jaar);
        vastgoedwaarden.push(Math.round(huidigeVastgoedwaarde));
        nettoInkomens.push(Math.round(nieuwNettoInkomen));
        eigenVermogens.push(Math.round(huidigEigenVermogen));
        overwaardes.push(Math.round(cumulatieveOverwaarde));  // Gebruik cumulatieve overwaarde
        nietGebruikteCashflows.push(Math.round(huidigNietGebruikteCashflow));
        roes.push(huidigeRoe);
        totaalRendementen.push(huidigTotaalRendement);
        aantalPanden.push(huidigAantalPanden);

        // Console logging voor debugging
        console.log(`Jaar ${jaar} details:`, {
            minimaalInkomenDitJaar: Math.round(minimaalInkomenDitJaar),
            minimaalInkomenJaar: Math.round(minimaalInkomenJaar),
            huidigNettoInkomen: Math.round(nieuwNettoInkomen),
            huidigNietGebruikteCashflow: Math.round(huidigNietGebruikteCashflow),
            waardestijgingBedrag: Math.round(waardestijgingBedrag),
            cumulatieveOverwaarde: Math.round(cumulatieveOverwaarde),
            isAankoopMoment: isAankoopMoment,
            beschikbaarVoorInvestering: Math.round(beschikbaarVoorInvestering),
            huidigeVastgoedwaarde: Math.round(huidigeVastgoedwaarde),
            huidigEigenVermogen: Math.round(huidigEigenVermogen),
            huidigAantalPanden,
            huur: Math.round(nieuweHuur),
            kosten: Math.round(nieuweKosten),
            rente: Math.round(nieuweRente),
            'Verschil met minimaal inkomen': Math.round(nieuwNettoInkomen - minimaalInkomenJaar)
        });
    }

    // Update de UI met de resultaten
    updateVermogensgroeiTabel(jaren, vastgoedwaarden, nettoInkomens, eigenVermogens, overwaardes, nietGebruikteCashflows, roes, totaalRendementen, aantalPanden, minimaalInkomensJaar);
    updateVermogensgroeiChart(jaren, vastgoedwaarden, eigenVermogens, overwaardes, nietGebruikteCashflows);
    updateInkomenChart(jaren, nettoInkomens, minimaalInkomen, minimaalInkomenInflatie);
}

function updateVermogensgroeiUI(
    totaleVastgoedwaarde,
    aantalWoningen,
    initieelNettoInkomen,
    breakEvenJaar,
    projectie,
    comfortNiveau1Jaar,
    comfortNiveau2Jaar,
    comfortNiveau3Jaar,
    rendementPer100k,
    rendementPercentage
) {
    // Update samenvatting
    document.getElementById('totaleVastgoedwaardeVermogensgroei').textContent = formatBedrag(totaleVastgoedwaarde);
    document.getElementById('aantalWoningenVermogensgroei').textContent = aantalWoningen;
    document.getElementById('initieelNettoInkomen').textContent = formatBedrag(initieelNettoInkomen);
    document.getElementById('breakEvenPunt').textContent = breakEvenJaar ? `${breakEvenJaar} jaar` : '-';
    document.getElementById('rendementPer100k').textContent = `${formatBedrag(rendementPer100k)} (${rendementPercentage.toFixed(1)}%)`;
    document.getElementById('totalePortfolioWaarde').textContent = formatBedrag(projectie[projectie.length - 1].eigenVermogen);

    // Update comfortniveaus
    document.getElementById('comfortNiveau1Jaar').textContent = comfortNiveau1Jaar ? `${comfortNiveau1Jaar} jaar` : '-';
    document.getElementById('comfortNiveau2Jaar').textContent = comfortNiveau2Jaar ? `${comfortNiveau2Jaar} jaar` : '-';
    document.getElementById('comfortNiveau3Jaar').textContent = comfortNiveau3Jaar ? `${comfortNiveau3Jaar} jaar` : '-';

    // Update tabellen
    updateVermogensgroeiTabel(projectie);

    // Update grafieken
    updateVermogensgroeiGrafieken(projectie);
}

function formatBedrag(bedrag) {
    return new Intl.NumberFormat('nl-NL', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(bedrag);
}

function updateVermogensgroeiTabel(jaren, vastgoedwaarden, nettoInkomens, eigenVermogens, overwaardes, nietGebruikteCashflows, roes, totaalRendementen, aantalPanden, minimaalInkomensJaar) {
    const tabel = document.getElementById('vermogensgroeiTabel')?.parentElement;
    if (!tabel) return;

    // Voeg tabelkop toe
    const thead = tabel.querySelector('thead') || document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Jaar</th>
            <th>Vastgoedwaarde (Overwaarde)</th>
            <th>Netto inkomen/maand</th>
            <th>Eigen vermogen</th>
            <th>Vermogensgroei</th>
            <th>Niet-gebruikte cashflow</th>
            <th>Aantal panden</th>
            <th>ROE</th>
            <th>Totaal rendement</th>
        </tr>
    `;
    if (!tabel.querySelector('thead')) {
        tabel.insertBefore(thead, tabel.firstChild);
    }

    // Update stats bovenaan
    const minimaalInkomen = parseFloat(document.getElementById('minimaalInkomen')?.value || 0);
    
    // Veilig bijwerken van statistieken
    const updateElement = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    // Update alle statistieken bovenaan de pagina
    updateElement('totaleVastgoedwaarde', formatBedrag(vastgoedwaarden[0]));
    updateElement('totaleVastgoedwaardeVermogensgroei', formatBedrag(vastgoedwaarden[0]));
    updateElement('aantalWoningen', aantalPanden[0]);
    updateElement('aantalWoningenVermogensgroei', aantalPanden[0]);
    
    // Gebruik nettoInkomens[1] voor het eerste jaar inkomen (per maand)
    updateElement('initieelNettoInkomen', formatBedrag(nettoInkomens[1] ? nettoInkomens[1] / 12 : 0));
    
    // Bereken break-even punt
    const breakEvenJaar = jaren.findIndex((jaar, i) => 
        i > 0 && 
        nettoInkomens[i] >= (minimaalInkomensJaar?.[i] || minimaalInkomen * 12)
    );
    updateElement('breakEvenPunt', breakEvenJaar >= 0 ? breakEvenJaar : '-');
    
    // Bereken rendement per €100k voor jaar 1
    let rendementPer100k = 0;
    let rendementPercentage = 0;
    if (nettoInkomens[1] && eigenVermogens[0]) {
        rendementPer100k = (nettoInkomens[1] / eigenVermogens[0]) * 100000;
        rendementPercentage = (rendementPer100k / 100000) * 100;
    }
    const rendementFormatted = `${formatBedrag(rendementPer100k)} (${rendementPercentage.toFixed(1)}%)`;
    updateElement('rendementJaar1Per100k', rendementFormatted);
    updateElement('rendementPer100k', rendementFormatted);
    
    // Update eindvermogen statistieken
    updateElement('eigenVermogenEindeLooptijd', formatBedrag(eigenVermogens[eigenVermogens.length - 1]));
    updateElement('totalePortfolioWaarde', formatBedrag(eigenVermogens[eigenVermogens.length - 1]));

    // Update tabelinhoud
    const tbody = document.getElementById('vermogensgroeiTabel');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    jaren.forEach((jaar, index) => {
        // Console logging voor debugging
        console.log(`Jaar ${jaar}:`, {
            vastgoedwaarde: vastgoedwaarden[index],
            overwaarde: overwaardes[index],
            nettoInkomen: nettoInkomens[index],
            nettoInkomenPerMaand: nettoInkomens[index] ? Math.round(nettoInkomens[index] / 12) : null,
            eigenVermogen: eigenVermogens[index],
            vermogensgroei: index === 0 ? 0 : eigenVermogens[index] - eigenVermogens[index - 1],
            nietGebruikteCashflow: nietGebruikteCashflows[index],
            aantalPanden: aantalPanden[index],
            roe: roes[index],
            totaalRendement: totaalRendementen[index],
            minimaalInkomenPerMaand: minimaalInkomensJaar && minimaalInkomensJaar[index] ? Math.round(minimaalInkomensJaar[index] / 12) : minimaalInkomen
        });

        const row = document.createElement('tr');
        
        // Voor STARTpunt speciale weergave (alleen vastgoedwaarde en eigen vermogen)
        if (jaar === 'START') {
            row.innerHTML = `
                <td>${jaar}</td>
                <td>${formatBedrag(vastgoedwaarden[index])}</td>
                <td>-</td>
                <td>${formatBedrag(eigenVermogens[index])}</td>
                <td>-</td>
                <td>-</td>
                <td>${aantalPanden[index]}</td>
                <td>-</td>
                <td>-</td>
            `;
        } else {
            // Toon cumulatieve overwaarde
            const nettoInkomenPerMaand = nettoInkomens[index] ? Math.round(nettoInkomens[index] / 12) : 0;
            // Minimaal inkomen aangepast met inflatie per maand
            const minimaalInkomenDisplay = minimaalInkomensJaar && minimaalInkomensJaar[index] ? 
                Math.round(minimaalInkomensJaar[index] / 12) : minimaalInkomen;
                
            row.innerHTML = `
                <td>${jaar}</td>
                <td>${formatBedrag(vastgoedwaarden[index])} (${formatBedrag(overwaardes[index])})</td>
                <td>${formatBedrag(nettoInkomenPerMaand)} / ${formatBedrag(minimaalInkomenDisplay)}</td>
                <td>${formatBedrag(eigenVermogens[index])}</td>
                <td>${formatBedrag(eigenVermogens[index] - eigenVermogens[index - 1])}</td>
                <td>${formatBedrag(nietGebruikteCashflows[index])}</td>
                <td>${aantalPanden[index]}</td>
                <td>${roes[index] ? roes[index].toFixed(1) + '%' : '-'}</td>
                <td>${totaalRendementen[index] ? totaalRendementen[index].toFixed(1) + '%' : '-'}</td>
            `;
        }
        
        tbody.appendChild(row);
    });
}

function updateVermogensgroeiChart(jaren, vastgoedwaarden, eigenVermogens, overwaardes, nietGebruikteCashflows) {
    const ctx = document.getElementById('vermogensgroeiChart');
    if (!ctx) return;

    // Verwijder bestaande chart als die er is
    if (window.vermogensgroeiChart instanceof Chart) {
        window.vermogensgroeiChart.destroy();
    }

    window.vermogensgroeiChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: jaren,
            datasets: [
                {
                    label: 'Vastgoedwaarde',
                    data: vastgoedwaarden,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'Eigen vermogen',
                    data: eigenVermogens,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                },
                {
                    label: 'Niet-gebruikte cashflow',
                    data: nietGebruikteCashflows,
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatBedrag(value);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatBedrag(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function updateVermogensgroeiGrafieken(projectie) {
    const minimaalInkomen = parseFloat(document.getElementById('minimaalInkomen').value);
    const minimaalInkomenInflatie = parseFloat(document.getElementById('minimaalInkomenInflatie').value) / 100;

    // Update vermogensgroei grafiek
    if (vermogensgroeiChart) {
        vermogensgroeiChart.destroy();
    }

    const vermogensgroeiCtx = document.getElementById('vermogensgroeiChart').getContext('2d');
    vermogensgroeiChart = new Chart(vermogensgroeiCtx, {
        type: 'line',
        data: {
            labels: projectie.map(p => p.jaar),
            datasets: [
                {
                    label: 'Eigen Vermogen',
                    data: projectie.map(p => p.eigenVermogen),
                    borderColor: '#3182ce',
                    backgroundColor: 'rgba(49, 130, 206, 0.1)',
                    fill: true
                },
                {
                    label: 'Vastgoedwaarde',
                    data: projectie.map(p => p.vastgoedwaarde),
                    borderColor: '#48bb78',
                    backgroundColor: 'rgba(72, 187, 120, 0.1)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatBedrag(value);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatBedrag(context.raw)}`;
                        }
                    }
                }
            }
        }
    });

    // Update inkomen grafiek
    if (inkomenChart) {
        inkomenChart.destroy();
    }

    const inkomenCtx = document.getElementById('inkomenChart').getContext('2d');
    inkomenChart = new Chart(inkomenCtx, {
        type: 'line',
        data: {
            labels: projectie.map(p => p.jaar),
            datasets: [
                {
                    label: 'Netto Inkomen per Maand',
                    data: projectie.map(p => p.nettoInkomen),
                    borderColor: '#f6ad55',
                    backgroundColor: 'rgba(246, 173, 85, 0.1)',
                    fill: true
                },
                {
                    label: 'Minimaal Inkomen',
                    data: projectie.map(p => minimaalInkomen * Math.pow(1 + minimaalInkomenInflatie, p.jaar)),
                    borderColor: '#e53e3e',
                    backgroundColor: 'rgba(229, 62, 62, 0.1)',
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Netto Inkomen per Maand (€)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatBedrag(value);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatBedrag(context.raw)}`;
                        }
                    }
                }
            }
        }
    });
}

function updateInkomenChart(jaren, nettoInkomens, minimaalInkomen, minimaalInkomenInflatie) {
    const ctx = document.getElementById('inkomenChart');
    if (!ctx) return;

    // Verwijder bestaande chart als die er is
    if (window.inkomenChart instanceof Chart) {
        window.inkomenChart.destroy();
    }

    // Bereken minimaal inkomen met cumulatieve inflatie
    const minimaalInkomens = jaren.map((jaar, index) => {
        if (jaar === 'START') return null;
        
        // Jaar 1 heeft nog geen inflatie
        if (index === 1) return minimaalInkomen;
        
        // Vanaf jaar 2 wel inflatie
        return minimaalInkomen * Math.pow(1 + minimaalInkomenInflatie, index - 1);
    });

    window.inkomenChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: jaren,
            datasets: [
                {
                    label: 'Netto inkomen per maand',
                    data: nettoInkomens.map(inkomen => inkomen ? inkomen / 12 : null),
                    borderColor: 'rgb(153, 102, 255)',
                    tension: 0.1
                },
                {
                    label: 'Minimaal inkomen',
                    data: minimaalInkomens,
                    borderColor: 'rgb(255, 99, 132)',
                    borderDash: [5, 5],
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatBedrag(value);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatBedrag(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}