// Berekeningsfuncties voor de vastgoed calculator

// Globale chart variabelen
let vermogensgroeiChart = null;
let inkomenChart = null;

function berekenScenarioResultaten() {
    // Haal de instellingen op uit de UI met veilige elementcontroles
    const eigenVermogen = parseFloat(document.getElementById('eigenVermogen')?.value || 0);
    const gemiddeldePandwaarde = parseFloat(document.getElementById('gemiddeldePandwaarde')?.value || 100000);
    const ltv = parseFloat(document.getElementById('ltv')?.value || 70) / 100;
    const rentePercentage = parseFloat(document.getElementById('rentePercentage')?.value || 3.5) / 100;
    const isHolding = document.getElementById('isHolding')?.checked || false;
    const aantalJaren = parseInt(document.getElementById('aantalJaren')?.value || 30);
    
    // Bereken de resultaten voor 3 scenario's: pessimistisch, neutraal, optimistisch
    const scenarios = {
        pessimistisch: { waardestijging: 1, huurstijging: 2, kostenstijging: 3 },
        neutraal: { waardestijging: 2, huurstijging: 3, kostenstijging: 2 },
        optimistisch: { waardestijging: 3, huurstijging: 4, kostenstijging: 1 }
    };
    
    // Bereken en update de resultaten voor elk scenario
    for (const [scenario, percentages] of Object.entries(scenarios)) {
        // Update de UI waarden met veilige null-checks
        const waardestijgingEl = document.getElementById(`${scenario}Waardestijging`);
        if (waardestijgingEl) waardestijgingEl.textContent = `${percentages.waardestijging}%`;
        
        const huurstijgingEl = document.getElementById(`${scenario}Huurstijging`);
        if (huurstijgingEl) huurstijgingEl.textContent = `${percentages.huurstijging}%`;
        
        const kostenstijgingEl = document.getElementById(`${scenario}Kostenstijging`);
        if (kostenstijgingEl) kostenstijgingEl.textContent = `${percentages.kostenstijging}%`;
        
        // Bereken de resultaten gebaseerd op deze percentages
        const projectie = berekenProjectie(
            eigenVermogen,
            gemiddeldePandwaarde,
            ltv,
            rentePercentage,
            isHolding,
            aantalJaren,
            percentages.waardestijging / 100,
            percentages.huurstijging / 100,
            percentages.kostenstijging / 100,
            3, // default aankoopfrequentie
            0, // geen extra inleg
            0, // geen extra bedrag
            20, // default laatste aankoopjaar
            0.07 // default huurrendement
        );
        
        // Update de resultaten in de UI
        if (projectie.length > 0) {
            const laatsteJaar = projectie[projectie.length - 1];
            const pandenEl = document.getElementById(`${scenario}Panden`);
            if (pandenEl) pandenEl.textContent = laatsteJaar.aantalPanden;
            
            const waardeEl = document.getElementById(`${scenario}Waarde`);
            if (waardeEl) waardeEl.textContent = formatBedrag(laatsteJaar.vastgoedwaarde);
            
            const nettoInkomenEl = document.getElementById(`${scenario}NettoInkomen`);
            if (nettoInkomenEl) nettoInkomenEl.textContent = formatBedrag(laatsteJaar.nettoInkomen);
            
            const totaalVermogenEl = document.getElementById(`${scenario}TotaalVermogen`);
            if (totaalVermogenEl) totaalVermogenEl.textContent = formatBedrag(laatsteJaar.eigenVermogen);
        }
    }
    
    // Toon resultaten sectie
    const resultatenEl = document.getElementById('resultaten');
    if (resultatenEl) resultatenEl.classList.remove('hidden');
}

function berekenVermogensgroei() {
    // Haal waarden op uit het formulier met veilige verwijzingen
    const eigenVermogenEl = document.getElementById('startEigenVermogen');
    const eigenVermogen = eigenVermogenEl ? parseFloat(eigenVermogenEl.value) || 0 : 0;
    
    const gemiddeldePandwaardeEl = document.getElementById('pandwaarde');
    const gemiddeldePandwaarde = gemiddeldePandwaardeEl ? parseFloat(gemiddeldePandwaardeEl.value) || 100000 : 100000;
    
    const ltvEl = document.getElementById('ltvVermogensgroei');
    const ltv = ltvEl ? parseFloat(ltvEl.value || 70) / 100 : 0.7;
    
    const rentePercentageEl = document.getElementById('rentePercentageVermogensgroei');
    const rentePercentage = rentePercentageEl ? parseFloat(rentePercentageEl.value || 3.5) / 100 : 0.035;
    
    const isHoldingEl = document.getElementById('structuurVermogensgroei');
    const isHolding = isHoldingEl ? isHoldingEl.value === 'holding' : false;
    
    const aantalJarenEl = document.getElementById('looptijdVermogensgroei');
    const aantalJaren = aantalJarenEl ? parseInt(aantalJarenEl.value || 30) : 30;
    
    const waardestijgingEl = document.getElementById('waardestijgingVermogensgroei');
    const waardestijging = waardestijgingEl ? parseFloat(waardestijgingEl.value || 2) / 100 : 0.02;
    
    const huurstijgingEl = document.getElementById('huurstijgingVermogensgroei');
    const huurstijging = huurstijgingEl ? parseFloat(huurstijgingEl.value || 3) / 100 : 0.03;
    
    const kostenstijgingEl = document.getElementById('kostenPercentageVermogensgroei');
    const kostenstijging = kostenstijgingEl ? parseFloat(kostenstijgingEl.value || 2) / 100 : 0.02;
    
    const aankoopfrequentieEl = document.getElementById('aankoopFrequentie');
    const aankoopfrequentie = aankoopfrequentieEl ? parseInt(aankoopfrequentieEl.value || 3) : 3;
    
    const extraJarenEl = document.getElementById('extraInlegJaren');
    const extraJaren = extraJarenEl ? parseInt(extraJarenEl.value || 0) : 0;
    
    const extraBedragEl = document.getElementById('extraInlegBedrag');
    const extraBedrag = extraBedragEl ? parseFloat(extraBedragEl.value || 0) : 0;
    
    const laatsteAankoopjaarEl = document.getElementById('laatsteAankoopJaar');
    const laatsteAankoopjaar = laatsteAankoopjaarEl ? parseInt(laatsteAankoopjaarEl.value || 30) : 30;
    
    const minimaalInkomenEl = document.getElementById('minimaalInkomen');
    const minimaalInkomen = minimaalInkomenEl ? parseFloat(minimaalInkomenEl.value || 0) : 0;
    
    const minimaalInkomenInflatieEl = document.getElementById('minimaalInkomenInflatie');
    const minimaalInkomenInflatie = minimaalInkomenInflatieEl ? parseFloat(minimaalInkomenInflatieEl.value || 0) / 100 : 0;
    
    // Ook haalwaarde van huurrendement op
    const huurrendementEl = document.getElementById('huurrendementVermogensgroei');
    const huurrendement = huurrendementEl ? parseFloat(huurrendementEl.value || 7) / 100 : 0.07;
    
    // Gebruik direct de berekenProjectie functie om alles consistent te houden
    const projectie = berekenProjectie(
        eigenVermogen,
        gemiddeldePandwaarde,
        ltv,
        rentePercentage,
        isHolding,
        aantalJaren,
        waardestijging,
        huurstijging,
        kostenstijging,
        aankoopfrequentie,
        extraJaren,
        extraBedrag,
        laatsteAankoopjaar,
        huurrendement
    );

    // Update de UI met de resultaten
    updateVermogensgroeiTabel(projectie);
    updateVermogensgroeiGrafieken(projectie);
    
    return projectie;
}

function updateVermogensgroeiUI(projectie) {
    const laatsteJaar = projectie[projectie.length - 1];
    
    // Update samenvatting met veilige element-checks
    const totaleVastgoedwaardeEl = document.getElementById('totaleVastgoedwaardeVermogensgroei');
    if (totaleVastgoedwaardeEl) totaleVastgoedwaardeEl.textContent = formatBedrag(laatsteJaar.vastgoedwaarde);
    
    const aantalWoningenEl = document.getElementById('aantalWoningenVermogensgroei');
    if (aantalWoningenEl) aantalWoningenEl.textContent = laatsteJaar.aantalPanden;
    
    const eigenVermogenEl = document.getElementById('eigenVermogenVermogensgroei');
    if (eigenVermogenEl) eigenVermogenEl.textContent = formatBedrag(laatsteJaar.eigenVermogen);
    
    // Bereken en update inkomen
    const initieelNettoInkomen = projectie[1].nettoInkomen;
    const laatsteNettoInkomen = laatsteJaar.nettoInkomen;
    
    const initieelNettoInkomenEl = document.getElementById('initieelNettoInkomen');
    if (initieelNettoInkomenEl) initieelNettoInkomenEl.textContent = formatBedrag(initieelNettoInkomen);
    
    const eindNettoInkomenEl = document.getElementById('eindNettoInkomen');
    if (eindNettoInkomenEl) eindNettoInkomenEl.textContent = formatBedrag(laatsteNettoInkomen);
    
    // Bereken break-even punt (wanneer netto inkomen >= aanvankelijke investering / 12)
    const eigenVermogenInputEl = document.getElementById('eigenVermogen');
    const eigenVermogen = eigenVermogenInputEl ? parseFloat(eigenVermogenInputEl.value || 0) : 0;
    const breakEvenJaar = projectie.findIndex(p => p.nettoInkomen >= eigenVermogen / 12);
    
    const breakEvenPuntEl = document.getElementById('breakEvenPunt');
    if (breakEvenPuntEl) breakEvenPuntEl.textContent = breakEvenJaar !== -1 ? breakEvenJaar : 'N/A';
    
    // Bereken rendement per €100k geïnvesteerd
    const rendementPer100k = (laatsteJaar.eigenVermogen / eigenVermogen) * 100000;
    
    const rendementPer100kEl = document.getElementById('rendementPer100k');
    if (rendementPer100kEl) rendementPer100kEl.textContent = formatBedrag(rendementPer100k);
    
    // Update comfort levels
    const minimaalInkomenEl = document.getElementById('minimaalInkomen');
    const minimaalInkomenValue = minimaalInkomenEl ? parseFloat(minimaalInkomenEl.value || 0) : 0;
    const passiefInkomenRatio = laatsteNettoInkomen / minimaalInkomenValue;
    
    const comfortEl = document.getElementById('comfortLevel');
    if (comfortEl) {
        if (passiefInkomenRatio >= 3) {
            comfortEl.textContent = 'Zeer Hoog';
            comfortEl.className = 'text-green-600 font-bold';
        } else if (passiefInkomenRatio >= 2) {
            comfortEl.textContent = 'Hoog';
            comfortEl.className = 'text-green-500 font-bold';
        } else if (passiefInkomenRatio >= 1.5) {
            comfortEl.textContent = 'Goed';
            comfortEl.className = 'text-blue-500 font-bold';
        } else if (passiefInkomenRatio >= 1) {
            comfortEl.textContent = 'Voldoende';
            comfortEl.className = 'text-yellow-500 font-bold';
        } else if (passiefInkomenRatio >= 0.5) {
            comfortEl.textContent = 'Matig';
            comfortEl.className = 'text-orange-500 font-bold';
        } else {
            comfortEl.textContent = 'Onvoldoende';
            comfortEl.className = 'text-red-500 font-bold';
        }
    }
    
    // Update tabellen en grafieken
    updateVermogensgroeiTabel(projectie);
    updateVermogensgroeiGrafieken(projectie);
    
    // Toon de grafieken sectie
    const chartsSection = document.getElementById('charts');
    if (chartsSection) {
        chartsSection.classList.remove('hidden');
    }
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
    const tabelBody = document.getElementById('vermogensgroeiTabel');
    if (!tabelBody) return; // Stop als het element niet bestaat
    
    tabelBody.innerHTML = '';
    
    // Update de tabel headers (thead) om de nieuwe kolom toe te voegen
    const tabelHeader = document.querySelector('#vermogensgroeiTabel-header');
    if (tabelHeader) {
        tabelHeader.innerHTML = `
            <th>Jaar</th>
            <th>Inleg</th>
            <th>Vastgoedwaarde</th>
            <th>Hypotheek</th>
            <th>Aantal panden</th>
            <th>Netto inkomen/mnd</th>
            <th>Eigen in vastgoed</th>
            <th>Eigen vermogen</th>
            <th>Vermogensgroei</th>
            <th>Niet-gebruikt cashflow</th>
            <th>ROE</th>
            <th>Totaal rendement</th>
        `;
    }

    // Haal minimaal inkomen op voor berekeningen
    const minimaalInkomenEl = document.getElementById('minimaalInkomen');
    const minimaalInkomen = minimaalInkomenEl ? parseFloat(minimaalInkomenEl.value || 0) : 0;
    
    const minimaalInkomenInflatieEl = document.getElementById('minimaalInkomenInflatie');
    const minimaalInkomenInflatie = minimaalInkomenInflatieEl ? parseFloat(minimaalInkomenInflatieEl.value || 0) / 100 : 0;
    
    projectie.forEach((jaar, index) => {
        // Nieuw table row element aanmaken
        const row = document.createElement('tr');
        
        // Voeg de highlight-row class toe aan elke derde rij (maar niet START)
        if (jaar.jaar !== "START" && jaar.jaar % 3 === 0) {
            row.classList.add('highlight-row');
        }
        
        // Bereken het 'echte' eigen vermogen (zonder niet-gebruikte inleg)
        // Dit is vastgoedwaarde - hypotheek
        const eigenInVastgoed = jaar.vastgoedwaarde - jaar.hypotheek;
        
        // Voor STARTpunt speciale weergave (alleen vastgoedwaarde en eigen vermogen)
        if (jaar.jaar === "START") {
            row.innerHTML = `
                <td>${jaar.jaar}</td>
                <td>${formatBedrag(jaar.inleg || 0)}</td>
                <td>${formatBedrag(jaar.vastgoedwaarde || 0)} (${formatBedrag(jaar.eigenVermogen || 0)})</td>
                <td>${formatBedrag(jaar.hypotheek || 0)}</td>
                <td>${jaar.aantalPanden || 0}</td>
                <td>-</td>
                <td>${formatBedrag(eigenInVastgoed || 0)}</td>
                <td>
                    <span title="Startkapitaal">
                        ${formatBedrag(jaar.eigenVermogen || 0)}
                    </span>
                </td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            `;
        } else {
            // Bereken minimaal inkomen voor dit jaar (met inflatie)
            const minimaalInkomenDitJaar = jaar.jaar === 1 ? 
                minimaalInkomen : 
                minimaalInkomen * Math.pow(1 + minimaalInkomenInflatie, jaar.jaar - 1);
                
            // Toon nettoInkomen per maand
            const nettoInkomenPerMaand = jaar.nettoInkomen ? Math.round(jaar.nettoInkomen / 12) : 0;
            
            // Bereken vermogensgroei
            let vermogensgroei = 0;
            if (index === 1) {
                // In jaar 1 is de vermogensgroei gelijk aan de overwaarde
                vermogensgroei = jaar.overwaarde || 0;
            } else if (index > 1) {
                // Voor latere jaren, neem verschil in eigenVermogen en corrigeer voor extra inleg
                vermogensgroei = jaar.eigenVermogen - projectie[index - 1].eigenVermogen - jaar.inleg;
            }
            
            row.innerHTML = `
                <td>${jaar.jaar}</td>
                <td>${formatBedrag(jaar.inleg || 0)}</td>
                <td>${formatBedrag(jaar.vastgoedwaarde || 0)} (+${formatBedrag(jaar.overwaarde || 0)})</td>
                <td>${formatBedrag(jaar.hypotheek || 0)}</td>
                <td>${jaar.aantalPanden || 0}</td>
                <td>${jaar.nettoInkomen ? formatBedrag(nettoInkomenPerMaand) + ' / ' + formatBedrag(minimaalInkomenDitJaar) : '-'}</td>
                <td>${formatBedrag(eigenInVastgoed || 0)}</td>
                <td>
                    <span title="${jaar.eigenVermogen ? 
                        `Eigendom: ${formatBedrag(jaar.vastgoedwaarde || 0)}\nMin Hypotheek: ${formatBedrag(jaar.hypotheek || 0)}${
                            jaar.cumulatieveExtraInleg > 0 ? 
                            `\nPlus Nog niet geïnvesteerde extra inleg: ${formatBedrag(jaar.cumulatieveExtraInleg)}` : 
                            ''
                        }${
                            jaar.nietGebruikteCashflow > 0 ? 
                            `\nPlus Niet gebruikte cashflow: ${formatBedrag(jaar.nietGebruikteCashflow)}` : 
                            ''
                        }` : 
                        'Startkapitaal'
                    }">
                        ${formatBedrag(jaar.eigenVermogen || 0)}
                    </span>
                </td>
                <td>${formatBedrag(vermogensgroei)}</td>
                <td>
                    <span title="Dit is de opgespaarde cashflow die ontstaat uit het verschil tussen je netto inkomen en je minimale inkomensbehoefte">
                        ${jaar.nietGebruikteCashflow ? formatBedrag(jaar.nietGebruikteCashflow) : '-'}
                    </span>
                </td>
                <td>${jaar.roe ? `${jaar.roe.toFixed(1)}%` : '-'}</td>
                <td>${jaar.totaalRendement ? `${jaar.totaalRendement.toFixed(1)}%` : '-'}</td>
            `;
        }
        
        tabelBody.appendChild(row);
    });
    
    // Toon de tabel sectie
    const tabelSection = document.getElementById('tabelSection');
    if (tabelSection) {
        tabelSection.classList.remove('hidden');
    }
        }

        function updateVermogensgroeiGrafieken(projectie) {
    const minimaalInkomenEl = document.getElementById('minimaalInkomen');
    const minimaalInkomen = minimaalInkomenEl ? parseFloat(minimaalInkomenEl.value || 0) : 0;
    
    const minimaalInkomenInflatieEl = document.getElementById('minimaalInkomenInflatie');
    const minimaalInkomenInflatie = minimaalInkomenInflatieEl ? parseFloat(minimaalInkomenInflatieEl.value || 0) / 100 : 0;

            // Update vermogensgroei grafiek
            if (vermogensgroeiChart) {
                vermogensgroeiChart.destroy();
            }

    const vermogensgroeiCtx = document.getElementById('vermogensgroeiChart');
    if (!vermogensgroeiCtx) return; // Als het element niet bestaat, stop dan
    
    const ctx = vermogensgroeiCtx.getContext('2d');
    if (!ctx) return; // Als de context niet kan worden opgehaald, stop dan
    
    vermogensgroeiChart = new Chart(ctx, {
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

    const inkomenCtx = document.getElementById('inkomenChart');
    if (!inkomenCtx) return; // Als het element niet bestaat, stop dan
    
    const inkomenContext = inkomenCtx.getContext('2d');
    if (!inkomenContext) return; // Als de context niet kan worden opgehaald, stop dan
    
    inkomenChart = new Chart(inkomenContext, {
                type: 'line',
                data: {
                    labels: projectie.map(p => p.jaar),
                    datasets: [
                        {
                            label: 'Netto Inkomen per Maand',
                    data: projectie.map(p => p.nettoInkomen ? p.nettoInkomen / 12 : null),
                            borderColor: '#f6ad55',
                            backgroundColor: 'rgba(246, 173, 85, 0.1)',
                            fill: true
                        },
                        {
                            label: 'Minimaal Inkomen',
                    data: projectie.map(p => {
                        if (p.jaar === "START") return null;
                        return minimaalInkomen * Math.pow(1 + minimaalInkomenInflatie, typeof p.jaar === 'number' ? p.jaar - 1 : 0);
                    }),
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

function eigenVermogenTooltip(eigenVermogen, vorigEigenVermogen, overwaarde, nettoInkomen, cumulatieveExtraInleg, nietGebruikteCashflow, aankoopKosten) {
    const eigenVermogenTooltip = `
        <strong>Eigen vermogen</strong><br>
        Eigen vermogen aan het begin: €${formatNumberWithPoints(vorigEigenVermogen)}<br>
        + Waardestijging: €${formatNumberWithPoints(overwaarde)}<br>
        + Netto inkomsten: €${formatNumberWithPoints(nettoInkomen)}
        ${cumulatieveExtraInleg > 0 ? `<br>+ Nog niet geïnvesteerde extra inleg: €${formatNumberWithPoints(cumulatieveExtraInleg)}` : ``}
        ${nietGebruikteCashflow > 0 ? `<br>+ Niet gebruikte cashflow: €${formatNumberWithPoints(nietGebruikteCashflow)}` : ``}
        ${aankoopKosten > 0 ? `<br>- Investering: €${formatNumberWithPoints(aankoopKosten)}` : ``}
        <br>= €${formatNumberWithPoints(eigenVermogen)}
    `;
    return eigenVermogenTooltip;
}

function formatNumberWithPoints(bedrag) {
    return new Intl.NumberFormat('nl-NL', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(bedrag);
}

function berekenProjectie(
    startEigenVermogen,
    gemiddeldePandwaarde,
    ltv,
    rentePercentage,
    isHolding,
    aantalJaren,
    waardestijging,
    huurstijging,
    kostenstijging,
    aankoopfrequentie = 3,
    extraJaren = 0,
    extraBedrag = 0,
    laatsteAankoopjaar = 30,
    huurrendement = 0.07
) {
    // Bereken initiële waardes op basis van eigenVermogen en pandwaarde
    const pandInitieleAankoop = Math.floor(startEigenVermogen / (gemiddeldePandwaarde * (1 - ltv)));
    const aantalStartPanden = pandInitieleAankoop > 0 ? pandInitieleAankoop : 1;
    
    // Log de berekening van het aantal startpanden
    console.log("ProjectieBerekening - Initiële berekening:", {
        startEigenVermogen,
        gemiddeldePandwaarde,
        ltv,
        "benodigdEigenVermogenPerPand": gemiddeldePandwaarde * (1 - ltv),
        pandInitieleAankoop,
        aantalStartPanden
    });
    
    let huidigeVastgoedwaarde = aantalStartPanden * gemiddeldePandwaarde;
    let huidigeHuur = huidigeVastgoedwaarde * huurrendement;
    let huidigeKosten = huidigeVastgoedwaarde * kostenstijging;
    let huidigHypotheek = huidigeVastgoedwaarde * ltv;
    let huidigeRente = huidigHypotheek * rentePercentage;
    let huidigEigenVermogen = huidigeVastgoedwaarde - huidigHypotheek;
    let huidigAantalPanden = aantalStartPanden;
    
    // Eventueel resterend eigen vermogen wat niet is geïnvesteerd
    let resterendEigenVermogen = startEigenVermogen - huidigEigenVermogen;
    if (resterendEigenVermogen > 0) {
        huidigEigenVermogen += resterendEigenVermogen;
    }
    
    // Log de berekende initiële waarden
    console.log("ProjectieBerekening - Initiële waarden:", {
        huidigeVastgoedwaarde,
        huidigHypotheek,
        huidigEigenVermogen,
        "eigenVermogen (input)": startEigenVermogen,
        resterendEigenVermogen,
        "aantalPanden": huidigAantalPanden
    });
    
    let huidigNietGebruikteCashflow = 0;
    let cumulatieveOverwaarde = 0;
    let cumulatieveExtraInleg = 0;

    // Array om resultaten in op te slaan
    const projectie = [];
    
    // Voeg START toe als eerste jaar
    projectie.push({
        jaar: "START",
        vastgoedwaarde: huidigeVastgoedwaarde,
        hypotheek: huidigHypotheek,
        eigenVermogen: huidigEigenVermogen,
        aantalPanden: huidigAantalPanden,
        inleg: startEigenVermogen,
        cumulatieveExtraInleg: cumulatieveExtraInleg,
        overwaarde: 0,
        nietGebruikteCashflow: 0
    });

    // Bereken netto inkomen voor jaar 1
    const huur = huidigeVastgoedwaarde * huurrendement;
    const kosten = huidigeVastgoedwaarde * kostenstijging;
    const rente = huidigHypotheek * rentePercentage;
    const effectiefNettoInkomen = Math.round(huur - kosten - rente);
    
    // Bereken waardestijging voor jaar 1
    const waardestijgingBedrag = Math.round(huidigeVastgoedwaarde * waardestijging);
    
    // Verhoog vastgoedwaarde met waardestijging
    huidigeVastgoedwaarde += waardestijgingBedrag;
    cumulatieveOverwaarde += waardestijgingBedrag;
    
    // Bepaal het minimaal inkomen voor jaar 1
    const minimaalInkomenJaar1 = minimaalInkomen * 12; // Jaarlijks minimaal inkomen
    
    // Alleen overschot aan inkomen toevoegen aan niet-gebruikte cashflow als het boven het minimale inkomen ligt
    if (effectiefNettoInkomen > minimaalInkomenJaar1) {
        huidigNietGebruikteCashflow += (effectiefNettoInkomen - minimaalInkomenJaar1);
    }
    
    // Extra inleg voor dit jaar - wordt aan het EINDE van jaar 1 toegevoegd
    let extraInlegDitJaar = 0;
    if (extraJaren >= 1) {
        extraInlegDitJaar = extraBedrag;
    }
    
    cumulatieveExtraInleg += extraInlegDitJaar;
    
    // Bereken eigen vermogen: vastgoedwaarde - hypotheek + niet-gebruikte cashflow + extra inleg
    // De hypotheek blijft ongewijzigd door extra inleg, die wordt alleen gebruikt voor nieuwe panden
    huidigEigenVermogen = huidigeVastgoedwaarde - huidigHypotheek + huidigNietGebruikteCashflow + cumulatieveExtraInleg;
    
    // ROE berekenen (Return on Equity)
    // Gebruik het eigen vermogen van START
    const vorigEigenVermogen = projectie[0].eigenVermogen;
    const roe = Math.round((effectiefNettoInkomen / vorigEigenVermogen) * 100 * 10) / 10;
    
    // Totaal rendement berekenen (ROE + waardestijging %)
    const totaalRendement = Math.round((roe + waardestijging * 100) * 10) / 10;
    
    // Voeg resultaten toe voor jaar 1
    projectie.push({
        jaar: 1,
        vastgoedwaarde: huidigeVastgoedwaarde,
        hypotheek: huidigHypotheek,
        eigenVermogen: huidigEigenVermogen,
        aantalPanden: huidigAantalPanden,
        nettoInkomen: effectiefNettoInkomen,
        overwaarde: waardestijgingBedrag,
        nietGebruikteCashflow: huidigNietGebruikteCashflow,
        roe: roe,
        totaalRendement: totaalRendement,
        inleg: extraInlegDitJaar,
        cumulatieveExtraInleg: cumulatieveExtraInleg
    });

    // Bereken voor jaar 2 en verder
    for (let jaar = 2; jaar <= aantalJaren; jaar++) {
        // Update waardes met inflatie
        const waardestijgingBedrag = Math.round(huidigeVastgoedwaarde * waardestijging);
        
        // Bereken nieuwe huurinkomsten met huurstijging
        const huur = huidigeVastgoedwaarde * huurrendement * Math.pow(1 + huurstijging, jaar - 1);
        const kosten = huidigeVastgoedwaarde * kostenstijging;
        const rente = huidigHypotheek * rentePercentage;
        const jaarNettoInkomen = Math.round(huur - kosten - rente);
        
        // Verhoog vastgoedwaarde met waardestijging
        huidigeVastgoedwaarde += waardestijgingBedrag;
        
        // Update cumulatieven
        cumulatieveOverwaarde += waardestijgingBedrag;
        
        // Bepaal het minimaal inkomen voor dit jaar (met inflatie)
        const minimaalInkomenDitJaar = minimaalInkomen * Math.pow(1 + huurstijging, jaar - 1);
        const minimaalInkomenJaar = minimaalInkomenDitJaar * 12; // Jaarlijks minimaal inkomen
        
        // Alleen overschot aan inkomen toevoegen aan niet-gebruikte cashflow als het boven het minimale inkomen ligt
        if (jaarNettoInkomen > minimaalInkomenJaar) {
            huidigNietGebruikteCashflow += (jaarNettoInkomen - minimaalInkomenJaar);
        }
        
        // Beginnend bij jaar 1, niet bij START (dus jaar - 1)
        const maandenSindsStart = (jaar - 1) * 12;
        const isAankoopMoment = maandenSindsStart % aankoopfrequentie === 0 && maandenSindsStart > 0;
        
        let nieuweHuur = huur;
        let nieuweKosten = kosten;
        let nieuweRente = rente;
        let nieuwNettoInkomen = jaarNettoInkomen;
        let aankoopbedrag = 0;
        
        // Hier nemen we de cumulatieve extra inleg mee als beschikbaar kapitaal
        const beschikbaarVoorInvestering = huidigNietGebruikteCashflow + cumulatieveOverwaarde + cumulatieveExtraInleg;
        const benodigdEigenVermogenPerPand = gemiddeldePandwaarde * (1 - ltv);
        
        // Bepaal of we het gebruik van extra inleg moeten forceren (als we voorbij de extra inleg jaren zijn
        // maar nog steeds cumulatieve extra inleg over hebben)
        let forceerGebruikExtraInleg = false;
        
        // Forceer investeringen als:
        // 1. We voorbij de extra inleg jaren zijn en nog steeds cumulatieve extra inleg hebben
        // 2. OF er genoeg beschikbaar kapitaal is voor minimaal 1 pand + 25% extra buffer
        // EN we zijn niet voorbij het laatste aankoopjaar
        const kanNogKopen = jaar <= laatsteAankoopjaar;
        const heeftGenoegVoorPand = beschikbaarVoorInvestering >= benodigdEigenVermogenPerPand * 1.25;
        
        if (jaar > extraJaren && cumulatieveExtraInleg > 0 && kanNogKopen) {
            forceerGebruikExtraInleg = true;
            console.log(`Jaar ${jaar}: Forceer gebruik van resterende extra inleg: €${Math.round(cumulatieveExtraInleg)}`);
        }
        // Als er ruim genoeg kapitaal is voor een nieuw pand, ook forceren
        else if (heeftGenoegVoorPand && kanNogKopen && beschikbaarVoorInvestering > benodigdEigenVermogenPerPand * 1.5) {
            forceerGebruikExtraInleg = true;
            console.log(`Jaar ${jaar}: Forceer aankoop wegens ruim voldoende kapitaal: €${Math.round(beschikbaarVoorInvestering)}`);
        }
        
        // Alleen investeren als het een aankoopmoment is EN er genoeg kapitaal is
        // EN het jaar is niet hoger dan het laatsteAankoopjaar
        // OF als we het gebruik van extra inleg forceren
        if ((isAankoopMoment && beschikbaarVoorInvestering >= benodigdEigenVermogenPerPand && kanNogKopen) || 
            (forceerGebruikExtraInleg && kanNogKopen)) {
            
            console.log(`Jaar ${jaar}: Nieuwe panden aankopen!${forceerGebruikExtraInleg ? ' (Geforceerde investering)' : ''}`);
            
            // Zorg dat we minimaal 1 pand kopen als we forceren, en maximaal 10 per keer
            // maar wel zoveel mogelijk binnen die limiet als er voldoende kapitaal is
            const aantalNieuwePanden = Math.min(10, Math.floor(beschikbaarVoorInvestering / benodigdEigenVermogenPerPand));
            
            // Bereken hoeveel nieuwe panden we kunnen kopen
            const gebruiktInvesteringsbedrag = aantalNieuwePanden * benodigdEigenVermogenPerPand;
            const nieuweInvestering = aantalNieuwePanden * gemiddeldePandwaarde;
            
            // Definieer één keer het aankoopbedrag voor gebruik in arrays en logs
            aankoopbedrag = gebruiktInvesteringsbedrag;
            
            // Voeg nieuwe panden toe
            huidigeVastgoedwaarde += nieuweInvestering;
            huidigHypotheek += nieuweInvestering * ltv; // Verhoog hypotheek ALLEEN bij nieuwe aankopen
            huidigAantalPanden += aantalNieuwePanden;
            
            // Reset cumulatieven en behoud eventueel resterende fondsen
            const resterendBedrag = beschikbaarVoorInvestering - gebruiktInvesteringsbedrag;
            
            // Verdeel het resterende bedrag proportioneel tussen overwaarde en niet-gebruikte cashflow
            const proportieOverwaarde = cumulatieveOverwaarde / beschikbaarVoorInvestering;
            const proportieNietGebruikteCashflow = huidigNietGebruikteCashflow / beschikbaarVoorInvestering;
            const proportieExtraInleg = cumulatieveExtraInleg / beschikbaarVoorInvestering;
            
            cumulatieveOverwaarde = Math.round(resterendBedrag * proportieOverwaarde);
            huidigNietGebruikteCashflow = Math.round(resterendBedrag * proportieNietGebruikteCashflow);
            cumulatieveExtraInleg = Math.round(resterendBedrag * proportieExtraInleg);
            
            // Herbereken inkomen met nieuwe panden
            nieuweHuur = huidigeVastgoedwaarde * huurrendement * Math.pow(1 + huurstijging, jaar - 1);
            nieuweKosten = huidigeVastgoedwaarde * kostenstijging;
            nieuweRente = huidigHypotheek * rentePercentage;
            nieuwNettoInkomen = Math.round(nieuweHuur - nieuweKosten - nieuweRente);
            
            console.log(`Jaar ${jaar}: Aangekocht: ${aantalNieuwePanden} panden voor €${Math.round(gebruiktInvesteringsbedrag)}. Resterend: €${Math.round(resterendBedrag)} (waarvan €${Math.round(cumulatieveExtraInleg)} extra inleg)`);
        } else {
            // Als we geen aankoop doen, check of we voorbij het laatste aankoopjaar zijn
            if (jaar > laatsteAankoopjaar) {
                // Als we voorbij het laatste aankoopjaar zijn, voegen we de overwaarde NIET meer toe aan de niet-gebruikte cashflow
                // De overwaarde blijft in de vastgoedwaarde zitten en komt daarmee in "eigen vermogen in vastgoed" terecht
                // cumulatieveOverwaarde blijft gewoon bestaan, maar wordt niet meer gebruikt voor aankopen
                console.log(`Jaar ${jaar}: Na laatste aankoopjaar. Overwaarde (€${Math.round(waardestijgingBedrag)}) blijft in vastgoed.`);
            }
            
            // De hypotheek blijft gelijk als er geen nieuwe aankopen zijn
            // (huidigHypotheek wijzigt niet)
        }
        
        // Extra inleg voor dit jaar - wordt aan het EINDE van het jaar toegevoegd
        extraInlegDitJaar = 0;
        if (jaar <= extraJaren) {
            extraInlegDitJaar = extraBedrag;
        }

        cumulatieveExtraInleg += extraInlegDitJaar;
        
        // Update eigen vermogen met overwaarde, niet-gebruikte cashflow, en cumulatieve extra inleg
        // De hypotheek wordt niet verlaagd door extra inleg, die wordt alleen gebruikt voor nieuwe panden
        huidigEigenVermogen = huidigeVastgoedwaarde - huidigHypotheek + huidigNietGebruikteCashflow + cumulatieveExtraInleg;
        
        // ROE berekenen (Return on Equity)
        // We gebruiken het eigen vermogen van het vorige jaar uit de projectie array
        // Haal het meest recente element op uit de array (projectie.length - 1 geeft de 0-based index van het laatste item)
        const vorigJaarIndex = projectie.length - 1;
        const vorigEigenVermogen = projectie[vorigJaarIndex].eigenVermogen;
        const roe = Math.round((nieuwNettoInkomen / vorigEigenVermogen) * 100 * 10) / 10;
        
        // Totaal rendement berekenen (ROE + waardestijging %)
        const totaalRendement = Math.round((roe + waardestijging * 100) * 10) / 10;
        
        // Voeg resultaten toe voor dit jaar
        projectie.push({
            jaar: jaar,
            vastgoedwaarde: huidigeVastgoedwaarde,
            hypotheek: huidigHypotheek,
            eigenVermogen: huidigEigenVermogen,
            aantalPanden: huidigAantalPanden,
            nettoInkomen: nieuwNettoInkomen,
            overwaarde: waardestijgingBedrag,
            nietGebruikteCashflow: huidigNietGebruikteCashflow,
            roe: roe,
            totaalRendement: totaalRendement,
            inleg: extraInlegDitJaar,
            cumulatieveExtraInleg: cumulatieveExtraInleg
        });
    }
    
    return projectie;
}