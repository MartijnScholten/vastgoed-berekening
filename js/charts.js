    // Chart instances
        let roeChart = null;
        let maandinkomenChart = null;
        // vermogensgroeiChart en inkomenChart zijn al gedeclareerd in calculations.js

        function berekenScenarioResultaten() {
            const eigenVermogenEl = document.getElementById('eigenVermogen');
            const ltvEl = document.getElementById('ltv');
            const rentePercentageEl = document.getElementById('rentePercentage');
            const vennootschapsbelastingEl = document.getElementById('vennootschapsbelasting');
            const rentePriveEl = document.getElementById('rentePrive');
            const structuurEl = document.getElementById('structuur');
            const waardestijgingEl = document.getElementById('waardestijging');

            // Veilige waarden instellen als elementen niet bestaan
            const eigenVermogen = eigenVermogenEl ? parseFloat(eigenVermogenEl.value) || 0 : 0;
            const ltv = ltvEl ? parseFloat(ltvEl.value) / 100 || 0 : 0;
            const rentePercentage = rentePercentageEl ? parseFloat(rentePercentageEl.value) / 100 || 0 : 0;
            const vennootschapsbelasting = vennootschapsbelastingEl ? parseFloat(vennootschapsbelastingEl.value) / 100 || 0 : 0;
            const rentePrive = rentePriveEl ? parseFloat(rentePriveEl.value) / 100 || 0 : 0;
            const isHolding = structuurEl ? structuurEl.value === 'holding' : false;
            const waardestijging = waardestijgingEl ? parseFloat(waardestijgingEl.value) / 100 || 0 : 0;

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

        function updateCharts(scenarios) {
            // Update ROE Chart
            const roeChartEl = document.getElementById('roeChart');
            if (!roeChartEl) return; // Stop als het element niet bestaat
            
            const roeCtx = roeChartEl.getContext('2d');
            if (!roeCtx) return; // Stop als de context niet kan worden opgehaald
            
            if (roeChart) {
                roeChart.destroy();
            }
            
            roeChart = new Chart(roeCtx, {
                type: 'bar',
                data: {
                    labels: scenarios.map(s => `${s.huurRendement}% huur`),
                    datasets: [
                        {
                            label: 'ROE',
                            data: scenarios.map(s => s.roe),
                            backgroundColor: '#3182ce'
                        },
                        {
                            label: 'ROE + Waardestijging',
                            data: scenarios.map(s => s.roePlusWaardestijging),
                            backgroundColor: '#48bb78'
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
                                text: 'Rendement (%)'
                            }
                        }
                    }
                }
            });

            // Update Maandinkomen Chart
            const maandinkomenChartEl = document.getElementById('maandinkomenChart');
            if (!maandinkomenChartEl) return; // Stop als het element niet bestaat
            
            const maandinkomenCtx = maandinkomenChartEl.getContext('2d');
            if (!maandinkomenCtx) return; // Stop als de context niet kan worden opgehaald
            
            if (maandinkomenChart) {
                maandinkomenChart.destroy();
            }
            
            maandinkomenChart = new Chart(maandinkomenCtx, {
                type: 'bar',
                data: {
                    labels: scenarios.map(s => `${s.huurRendement}% huur`),
                    datasets: [
                        {
                            label: 'Netto Maandinkomen',
                            data: scenarios.map(s => s.nettoInkomenPerMaand),
                            backgroundColor: '#f6ad55'
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
                                text: 'Netto Maandinkomen (€)'
                            }
                        }
                    }
                }
            });
        }

        function formatBedrag(bedrag) {
            return new Intl.NumberFormat('nl-NL', { 
                style: 'currency', 
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(bedrag);
        }

        function updateScenarioTabel(scenarios) {
            const tbody = document.getElementById('scenarioTabel');
            if (!tbody) return; // Stop als het element niet bestaat
            
            tbody.innerHTML = '';

            scenarios.forEach(scenario => {
                const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${scenario.huurRendement}%</td>
                    <td>${scenario.kostenPercentage}%</td>
                    <td>${formatBedrag(scenario.huurInkomsten)}</td>
                    <td>${formatBedrag(scenario.hypotheekRente)}</td>
                    <td>${formatBedrag(scenario.onderhoudskosten)}</td>
                    <td>${formatBedrag(scenario.rentePrive)}</td>
                    <td>${formatBedrag(scenario.vennootschapsbelasting)}</td>
                    <td>${formatBedrag(scenario.nettoInkomen)}</td>
                    <td>${formatBedrag(scenario.nettoInkomenPerMaand)}</td>
                    <td>${formatBedrag(scenario.vastgoedwaarde)}</td>
                    <td>${scenario.roe.toFixed(1)}%</td>
                    <td>${scenario.roePlusWaardestijging.toFixed(1)}%</td>
                `;
                tbody.appendChild(row);
            });
        }