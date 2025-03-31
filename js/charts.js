    // Chart instances
        let roeChart = null;
        let maandinkomenChart = null;
        let vermogensgroeiChart = null;
        let inkomenChart = null;

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

        function updateCharts(scenarios) {
            // Update ROE Chart
            const roeCtx = document.getElementById('roeChart').getContext('2d');
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
            const maandinkomenCtx = document.getElementById('maandinkomenChart').getContext('2d');
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

        function updateScenarioTabel(scenarios) {
            const tbody = document.getElementById('scenarioTabel');
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