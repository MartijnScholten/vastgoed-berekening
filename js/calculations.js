// Berekeningsfuncties voor de vastgoed calculator

function berekenScenarioResultaten() {
    const eigenVermogen = parseFloat(document.getElementById('eigenVermogen').value);
    const ltv = parseFloat(document.getElementById('ltv').value) / 100;
    const rentePercentage = parseFloat(document.getElementById('rentePercentage').value) / 100;
    const vennootschapsbelasting = parseFloat(document.getElementById('vennootschapsbelasting').value) / 100;
    const rentePrive = parseFloat(document.getElementById('rentePrive').value) / 100;
    const isHolding = document.getElementById('structuur').value === 'holding';
    const waardestijging = parseFloat(document.getElementById('waardestijging').value) / 100;

    // Bereken initiële situatie
    const totaleVastgoedwaarde = eigenVermogen / (1 - ltv);
    const hypotheek = totaleVastgoedwaarde - eigenVermogen;
    const aantalWoningen = Math.ceil(totaleVastgoedwaarde / 400000);

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
    const startEigenVermogen = parseFloat(document.getElementById('startEigenVermogen').value);
    const pandwaarde = parseFloat(document.getElementById('pandwaarde').value);
    const looptijd = parseInt(document.getElementById('looptijdVermogensgroei').value);
    const isHolding = document.getElementById('structuurVermogensgroei').value === 'holding';
    const ltv = parseFloat(document.getElementById('ltvVermogensgroei').value) / 100;
    const rentePercentage = parseFloat(document.getElementById('rentePercentageVermogensgroei').value) / 100;
    const huurrendement = parseFloat(document.getElementById('huurrendementVermogensgroei').value) / 100;
    const huurstijging = parseFloat(document.getElementById('huurstijgingVermogensgroei').value) / 100;
    const kostenPercentage = parseFloat(document.getElementById('kostenPercentageVermogensgroei').value) / 100;
    const waardestijging = parseFloat(document.getElementById('waardestijgingVermogensgroei').value) / 100;
    const inkomenHerinvesteringPercentage = parseFloat(document.getElementById('inkomenHerinvestering').value) / 100;
    const herinvesteerWaardestijging = document.getElementById('herinvesteerWaardestijgingVermogensgroei').checked;
    const minimaalInkomen = parseFloat(document.getElementById('minimaalInkomen').value);
    const minimaalInkomenInflatie = parseFloat(document.getElementById('minimaalInkomenInflatie').value) / 100;

    // Bereken initiële situatie
    const totaleVastgoedwaarde = startEigenVermogen / (1 - ltv);
    const hypotheek = totaleVastgoedwaarde - startEigenVermogen;
    const aantalWoningen = Math.ceil(totaleVastgoedwaarde / pandwaarde);

    // Bereken initieel netto inkomen
    let initieelNettoInkomen;
    if (isHolding) {
        const rentePrive = parseFloat(document.getElementById('rentePriveVermogensgroei').value) / 100;
        const vennootschapsbelasting = parseFloat(document.getElementById('vennootschapsbelastingVermogensgroei').value) / 100;
        const huurInkomsten = totaleVastgoedwaarde * huurrendement;
        const hypotheekRente = hypotheek * rentePercentage;
        const onderhoudskosten = totaleVastgoedwaarde * kostenPercentage;
        const vennootschapsbelastingBedrag = rentePrive * vennootschapsbelasting;
        initieelNettoInkomen = huurInkomsten - hypotheekRente - onderhoudskosten - vennootschapsbelastingBedrag;
    } else {
        const huurInkomsten = totaleVastgoedwaarde * huurrendement;
        const hypotheekRente = hypotheek * rentePercentage;
        const onderhoudskosten = totaleVastgoedwaarde * kostenPercentage;
        initieelNettoInkomen = huurInkomsten - hypotheekRente - onderhoudskosten;
    }

    // Bereken rendement per 100k eigen vermogen
    const rendementPer100k = (initieelNettoInkomen / startEigenVermogen) * 100000;
    const rendementPercentage = (initieelNettoInkomen / startEigenVermogen) * 100;

    // Bereken projectie per jaar
    const projectie = [];
    let huidigePortfolioWaarde = totaleVastgoedwaarde;
    let huidigEigenVermogen = startEigenVermogen;
    let breakEvenJaar = null;
    let comfortNiveau1Jaar = null;
    let comfortNiveau2Jaar = null;
    let comfortNiveau3Jaar = null;

    for (let jaar = 0; jaar <= looptijd; jaar++) {
        // Bereken inkomen voor dit jaar
        let gegenereerdInkomen;
        if (isHolding) {
            const rentePrive = parseFloat(document.getElementById('rentePriveVermogensgroei').value) / 100;
            const vennootschapsbelasting = parseFloat(document.getElementById('vennootschapsbelastingVermogensgroei').value) / 100;
            const huurInkomsten = huidigePortfolioWaarde * huurrendement * Math.pow(1 + huurstijging, jaar);
            const hypotheekRente = hypotheek * rentePercentage;
            const onderhoudskosten = huidigePortfolioWaarde * kostenPercentage * Math.pow(1 + huurstijging, jaar);
            const vennootschapsbelastingBedrag = rentePrive * vennootschapsbelasting;
            gegenereerdInkomen = huurInkomsten - hypotheekRente - onderhoudskosten - vennootschapsbelastingBedrag;
        } else {
            const huurInkomsten = huidigePortfolioWaarde * huurrendement * Math.pow(1 + huurstijging, jaar);
            const hypotheekRente = hypotheek * rentePercentage;
            const onderhoudskosten = huidigePortfolioWaarde * kostenPercentage * Math.pow(1 + huurstijging, jaar);
            gegenereerdInkomen = huurInkomsten - hypotheekRente - onderhoudskosten;
        }

        // Bereken maandelijks inkomen en herinvestering
        const maandelijksInkomen = gegenereerdInkomen / 12;
        const minimaalInkomenDitJaar = minimaalInkomen * Math.pow(1 + minimaalInkomenInflatie, jaar);
        let herinvesterenBedrag = 0;

        // Als het maandelijks inkomen hoger is dan het minimale inkomen
        if (maandelijksInkomen > minimaalInkomenDitJaar) {
            // Herinvesteer het verschil volgens het percentage
            herinvesterenBedrag += (maandelijksInkomen - minimaalInkomenDitJaar) * 12 * inkomenHerinvesteringPercentage;
        }

        // Als waardestijging moet worden hergeïnvesteerd
        if (herinvesteerWaardestijging) {
            herinvesterenBedrag += huidigePortfolioWaarde * waardestijging;
        }

        // Update portfolio
        huidigePortfolioWaarde *= (1 + waardestijging);
        huidigEigenVermogen = huidigePortfolioWaarde * (1 - ltv) + herinvesterenBedrag;

        // Check break-even punt
        if (!breakEvenJaar && gegenereerdInkomen >= startEigenVermogen) {
            breakEvenJaar = jaar;
        }

        // Check comfortniveaus
        if (!comfortNiveau1Jaar && maandelijksInkomen >= 5000) {
            comfortNiveau1Jaar = jaar;
        }
        if (!comfortNiveau2Jaar && maandelijksInkomen >= 10000) {
            comfortNiveau2Jaar = jaar;
        }
        if (!comfortNiveau3Jaar && maandelijksInkomen >= 20000) {
            comfortNiveau3Jaar = jaar;
        }

     projectie.push({
                    jaar,
                    vastgoedwaarde: huidigePortfolioWaarde,
                    nettoInkomen: Math.min(maandelijksInkomen, minimaalInkomenDitJaar) + 
                                (maandelijksInkomen > minimaalInkomenDitJaar ? 
                                (maandelijksInkomen - minimaalInkomenDitJaar) * (1 - inkomenHerinvesteringPercentage) : 0),
                    eigenVermogen: huidigEigenVermogen,
                    eigenVermogenStijging: jaar > 0 ? huidigEigenVermogen - projectie[jaar-1].eigenVermogen : 0,
                    aantalPanden: Math.ceil(huidigePortfolioWaarde / pandwaarde),
                    roe: (gegenereerdInkomen / huidigEigenVermogen) * 100
                });
            }

            // Update UI
            updateVermogensgroeiUI(
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
            );
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

        function updateVermogensgroeiTabel(projectie) {
            const tbody = document.getElementById('vermogensgroeiTabel');
            tbody.innerHTML = '';
            const minimaalInkomen = parseFloat(document.getElementById('minimaalInkomen').value);
            const minimaalInkomenInflatie = parseFloat(document.getElementById('minimaalInkomenInflatie').value) / 100;

            projectie.forEach(jaar => {
                const minimaalInkomenDitJaar = minimaalInkomen * Math.pow(1 + minimaalInkomenInflatie, jaar.jaar);
                const percentageVanMinimaal = (jaar.nettoInkomen / minimaalInkomenDitJaar) * 100;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${jaar.jaar}</td>
                    <td>${formatBedrag(jaar.vastgoedwaarde)}</td>
                    <td>${formatBedrag(jaar.nettoInkomen)} van ${formatBedrag(minimaalInkomenDitJaar)} (${percentageVanMinimaal.toFixed(1)}%)</td>
                    <td>${formatBedrag(jaar.eigenVermogen)}</td>
                    <td>${formatBedrag(jaar.eigenVermogenStijging)}</td>
                    <td>${jaar.aantalPanden}</td>
                    <td>${jaar.roe.toFixed(1)}%</td>
                `;
                tbody.appendChild(row);
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