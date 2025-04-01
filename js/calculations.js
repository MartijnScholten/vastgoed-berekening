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
    const herinvesteerWaardestijging = document.getElementById('herinvesteerWaardestijgingVermogensgroei').checked;
    const minimaalInkomen = parseFloat(document.getElementById('minimaalInkomen').value);
    const minimaalInkomenInflatie = parseFloat(document.getElementById('minimaalInkomenInflatie').value) / 100;

    // Bereken initiële situatie
    const totaleVastgoedwaarde = startEigenVermogen / (1 - ltv);
    const hypotheek = totaleVastgoedwaarde - startEigenVermogen;
    const aantalWoningen = Math.floor(totaleVastgoedwaarde / pandwaarde);

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
    let huidigePandwaarde = pandwaarde;
    let breakEvenJaar = null;
    let comfortNiveau1Jaar = null;
    let comfortNiveau2Jaar = null;
    let comfortNiveau3Jaar = null;
    let spaarpotVoorHerinvestering = 0;
    let aantalPanden = Math.floor(totaleVastgoedwaarde / pandwaarde);

    for (let jaar = 0; jaar <= looptijd; jaar++) {
        // Update pandwaarde met waardestijging
        huidigePandwaarde *= (1 + waardestijging);

        // Bereken inkomen voor dit jaar
        let gegenereerdInkomen;
        if (isHolding) {
            const rentePrive = parseFloat(document.getElementById('rentePriveVermogensgroei').value) / 100;
            const vennootschapsbelasting = parseFloat(document.getElementById('vennootschapsbelastingVermogensgroei').value) / 100;
            const huurInkomsten = huidigePortfolioWaarde * huurrendement;
            const hypotheekRente = hypotheek * rentePercentage;
            const onderhoudskosten = huidigePortfolioWaarde * kostenPercentage;
            const vennootschapsbelastingBedrag = rentePrive * vennootschapsbelasting;
            gegenereerdInkomen = huurInkomsten - hypotheekRente - onderhoudskosten - vennootschapsbelastingBedrag;
        } else {
            const huurInkomsten = huidigePortfolioWaarde * huurrendement;
            const hypotheekRente = hypotheek * rentePercentage;
            const onderhoudskosten = huidigePortfolioWaarde * kostenPercentage;
            gegenereerdInkomen = huurInkomsten - hypotheekRente - onderhoudskosten;
        }

        // Bereken maandelijks inkomen en herinvestering
        const maandelijksInkomen = gegenereerdInkomen / 12;
        const minimaalInkomenDitJaar = minimaalInkomen * Math.pow(1 + minimaalInkomenInflatie, jaar);
        let herinvesterenBedrag = 0;

        // Bereken hoeveel er beschikbaar is voor herinvestering
        const jaarlijksMinimaalInkomen = minimaalInkomenDitJaar * 12;
        let beschikbaarVoorHerinvestering = 0;

        // Als er meer inkomen is dan het minimale inkomen, wordt het overschot gespaard
        if (gegenereerdInkomen > jaarlijksMinimaalInkomen) {
            beschikbaarVoorHerinvestering = gegenereerdInkomen - jaarlijksMinimaalInkomen;
            spaarpotVoorHerinvestering += beschikbaarVoorHerinvestering;
        }

        // Elke 3 jaar herinvesteren (vanaf jaar 3)
        if (jaar > 0 && jaar % 3 === 0) {
            if (jaar === 3) {
                console.log('Herinvestering jaar 3:');
                console.log('Spaarpot beschikbaar:', spaarpotVoorHerinvestering);
            }

            // Het gespaarde bedrag wordt gebruikt als eigen vermogen voor nieuwe investering
            const nieuwInvesteringsBedrag = spaarpotVoorHerinvestering / (1 - ltv);
            herinvesterenBedrag = nieuwInvesteringsBedrag;
            const nieuweAantalPanden = Math.floor(nieuwInvesteringsBedrag / huidigePandwaarde);
            
            if (jaar === 3) {
                console.log('Nieuw investeringsbedrag:', nieuwInvesteringsBedrag);
                console.log('Nieuwe aantal panden:', nieuweAantalPanden);
                console.log('Huidige pandwaarde:', huidigePandwaarde);
            }

            aantalPanden += nieuweAantalPanden;
            spaarpotVoorHerinvestering = 0; // Reset spaarpot na herinvestering
        }

        // Update portfolio met herinvestering en waardestijging
        const oudePortfolioWaarde = huidigePortfolioWaarde;
        
        // Voeg eerst nieuwe investering toe (als die er is)
        huidigePortfolioWaarde += herinvesterenBedrag;
        
        // Dan pas waardestijging toepassen
        const waardeVoorStijging = huidigePortfolioWaarde;
        huidigePortfolioWaarde *= (1 + waardestijging);
        const waardeStijgingBedrag = huidigePortfolioWaarde - waardeVoorStijging;

        // Als waardestijging moet worden hergeïnvesteerd, voeg de volledige waardestijging toe aan spaarpot
        if (herinvesteerWaardestijging) {
            spaarpotVoorHerinvestering += waardeStijgingBedrag;
        }
        
        const oudeEigenVermogen = huidigEigenVermogen;
        huidigEigenVermogen = huidigePortfolioWaarde * (1 - ltv);

        if (jaar === 3) {
            console.log('Portfolio update jaar 3:');
            console.log('Oude portfolio waarde:', oudePortfolioWaarde);
            console.log('Na herinvestering:', waardeVoorStijging);
            console.log('Waardestijging bedrag:', waardeStijgingBedrag);
            console.log('Nieuwe portfolio waarde:', huidigePortfolioWaarde);
            if (herinvesteerWaardestijging) {
                console.log('Waardestijging naar spaarpot:', waardeStijgingBedrag);
            }
        }

        projectie.push({
            jaar: jaar,
            vastgoedwaarde: huidigePortfolioWaarde,
            nettoInkomen: Math.min(maandelijksInkomen, minimaalInkomenDitJaar),
            eigenVermogen: huidigEigenVermogen,
            eigenVermogenStijging: jaar === 0 ? huidigEigenVermogen - startEigenVermogen : huidigEigenVermogen - projectie[jaar-1].eigenVermogen,
            aantalPanden: aantalPanden,
            beschikbaarVoorHerinvestering: spaarpotVoorHerinvestering,
            roe: jaar === 0 ? (gegenereerdInkomen / startEigenVermogen) * 100 : (gegenereerdInkomen / projectie[jaar-1].eigenVermogen) * 100,
            totaalRendement: jaar === 0 ? 
                ((gegenereerdInkomen + (huidigePortfolioWaarde * waardestijging)) / startEigenVermogen) * 100 :
                ((gegenereerdInkomen + (huidigePortfolioWaarde * waardestijging)) / projectie[jaar-1].eigenVermogen) * 100
        });

        // Check break-even punt
        if (!breakEvenJaar && gegenereerdInkomen >= startEigenVermogen) {
            breakEvenJaar = jaar;
        }

        // Check comfortniveaus
        const comfortNiveau1Bedrag = parseFloat(document.getElementById('comfortNiveau1').value);
        const comfortNiveau2Bedrag = parseFloat(document.getElementById('comfortNiveau2').value);
        const comfortNiveau3Bedrag = parseFloat(document.getElementById('comfortNiveau3').value);

        if (!comfortNiveau1Jaar && maandelijksInkomen >= comfortNiveau1Bedrag) {
            comfortNiveau1Jaar = jaar;
            if (jaar === 4) {
                console.log('Comfort niveau 1 bereikt in jaar 4:');
                console.log('Maandelijks inkomen:', maandelijksInkomen);
                console.log('Comfort niveau 1 bedrag:', comfortNiveau1Bedrag);
            }
        }
        if (!comfortNiveau2Jaar && maandelijksInkomen >= comfortNiveau2Bedrag) {
            comfortNiveau2Jaar = jaar;
            if (jaar === 4) {
                console.log('Comfort niveau 2 bereikt in jaar 4:');
                console.log('Maandelijks inkomen:', maandelijksInkomen);
                console.log('Comfort niveau 2 bedrag:', comfortNiveau2Bedrag);
            }
        }
        if (!comfortNiveau3Jaar && maandelijksInkomen >= comfortNiveau3Bedrag) {
            comfortNiveau3Jaar = jaar;
            if (jaar === 7) {
                console.log('Comfort niveau 3 bereikt in jaar 7:');
                console.log('Maandelijks inkomen:', maandelijksInkomen);
                console.log('Comfort niveau 3 bedrag:', comfortNiveau3Bedrag);
            }
        }
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
    const table = document.getElementById('vermogensgroeiTabel');
    const thead = table.querySelector('thead') || document.createElement('thead');
    const tbody = table.querySelector('tbody') || document.createElement('tbody');

    // Update thead
    thead.innerHTML = `
        <tr>
            <th>Jaar</th>
            <th>Vastgoedwaarde</th>
            <th>Netto inkomen</th>
            <th>Eigen vermogen</th>
            <th>EV stijging</th>
            <th>Spaarpot</th>
            <th>Aantal panden</th>
            <th>ROE (Totaal)</th>
        </tr>
    `;

    // Update tbody
    tbody.innerHTML = '';

    // Zorg ervoor dat thead en tbody in de tabel zitten
    if (!table.contains(thead)) table.appendChild(thead);
    if (!table.contains(tbody)) table.appendChild(tbody);

    const minimaalInkomen = parseFloat(document.getElementById('minimaalInkomen').value);
    const minimaalInkomenInflatie = parseFloat(document.getElementById('minimaalInkomenInflatie').value) / 100;

    projectie.forEach(jaar => {
        const minimaalInkomenDitJaar = minimaalInkomen * Math.pow(1 + minimaalInkomenInflatie, jaar.jaar);
        const percentageVanMinimaal = (jaar.nettoInkomen / minimaalInkomenDitJaar) * 100;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${jaar.jaar +1}</td>
            <td>${formatBedrag(jaar.vastgoedwaarde)}</td>
            <td>${formatBedrag(jaar.nettoInkomen)} van ${formatBedrag(minimaalInkomenDitJaar)} (${percentageVanMinimaal.toFixed(1)}%)</td>
            <td>${formatBedrag(jaar.eigenVermogen)}</td>
            <td>${formatBedrag(jaar.eigenVermogenStijging)}</td>
            <td>${formatBedrag(jaar.beschikbaarVoorHerinvestering)}</td>
            <td>${jaar.aantalPanden}</td>
            <td>${jaar.roe.toFixed(1)}% (${jaar.totaalRendement.toFixed(1)}%)</td>
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