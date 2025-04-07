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
            0.07, // default huurrendement
            0, // minimaalInkomen
            0, // minimaalInkomenInflatie
            true // herfinancieringActief
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

    const kostenPercentageEl = document.getElementById('kostenPercentageVermogensgroei');
    const kostenPercentage = kostenPercentageEl ? parseFloat(kostenPercentageEl.value || 2) / 100 : 0.02;

    const aankoopfrequentieEl = document.getElementById('aankoopFrequentie');
    const aankoopfrequentie = aankoopfrequentieEl ? parseInt(aankoopfrequentieEl.value || 3) : 3;

    // Update de aankoopfrequentie display in de uitleg
    const aankoopFrequentieDisplayEl = document.getElementById('aankoopFrequentieDisplay');
    if (aankoopFrequentieDisplayEl) {
        aankoopFrequentieDisplayEl.textContent = aankoopfrequentie;
    }

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

    // Herfinanciering instelling uitlezen (standaard aan)
    const herfinancieringActiefEl = document.getElementById('herfinancieringActief');
    const herfinancieringActief = herfinancieringActiefEl ? herfinancieringActiefEl.checked !== false : true;

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
        kostenPercentage,
        aankoopfrequentie,
        extraJaren,
        extraBedrag,
        laatsteAankoopjaar,
        huurrendement,
        minimaalInkomen,
        minimaalInkomenInflatie,
        herfinancieringActief
    );

    // Maak de projectie globaal beschikbaar voor de PDF export
    window.huidigeProjectie = projectie;

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
            <th>Inkomen - Minimum</th>
            <th>ROE</th>
            <th>Totaal rendement</th>
        `;
    }

    // Haal minimaal inkomen op voor berekeningen
    const minimaalInkomenEl = document.getElementById('minimaalInkomen');
    const minimaalInkomen = minimaalInkomenEl ? parseFloat(minimaalInkomenEl.value || 0) : 0;

    const minimaalInkomenInflatieEl = document.getElementById('minimaalInkomenInflatie');
    const minimaalInkomenInflatie = minimaalInkomenInflatieEl ? parseFloat(minimaalInkomenInflatieEl.value || 0) / 100 : 0;

    // Haal ook andere parameters op voor de tooltips
    const huurrendementEl = document.getElementById('huurrendementVermogensgroei');
    const huurrendement = huurrendementEl ? parseFloat(huurrendementEl.value || 0) / 100 : 0.07;
    
    const huurstijgingEl = document.getElementById('huurstijgingVermogensgroei');
    const huurstijging = huurstijgingEl ? parseFloat(huurstijgingEl.value || 0) / 100 : 0;
    
    const kostenPercentageEl = document.getElementById('kostenPercentageVermogensgroei');
    const kostenPercentage = kostenPercentageEl ? parseFloat(kostenPercentageEl.value || 0) / 100 : 0;
    
    const rentePercentageEl = document.getElementById('rentePercentageVermogensgroei');
    const rentePercentage = rentePercentageEl ? parseFloat(rentePercentageEl.value || 0) / 100 : 0;
    
    const waardestijgingEl = document.getElementById('waardestijgingVermogensgroei');
    const waardestijging = waardestijgingEl ? parseFloat(waardestijgingEl.value || 0) / 100 : 0;

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
                <td>
                    <span title="Startkapitaal: Het initiële eigen vermogen dat je investeert">
                        ${formatBedrag(jaar.inleg || 0)}
                    </span>
                </td>
                <td>
                    <span title="Formule: Aantal panden × Gemiddelde pandwaarde\n= ${jaar.aantalPanden || 0} × ${formatBedrag(jaar.vastgoedwaarde / (jaar.aantalPanden || 1))}\n= ${formatBedrag(jaar.vastgoedwaarde || 0)}">
                        ${formatBedrag(jaar.vastgoedwaarde || 0)} (${formatBedrag(jaar.eigenVermogen || 0)})
                    </span>
                </td>
                <td>
                    <span title="Formule: Vastgoedwaarde × LTV%\n= ${formatBedrag(jaar.vastgoedwaarde || 0)} × ${(jaar.hypotheek / jaar.vastgoedwaarde * 100).toFixed(0)}%\n= ${formatBedrag(jaar.hypotheek || 0)}">
                        ${formatBedrag(jaar.hypotheek || 0)}
                    </span>
                </td>
                <td>
                    <span title="Aantal aangekochte panden bij de start">
                        ${jaar.aantalPanden || 0}
                    </span>
                </td>
                <td>-</td>
                <td>
                    <span title="Formule: Vastgoedwaarde - Hypotheek\n= ${formatBedrag(jaar.vastgoedwaarde || 0)} - ${formatBedrag(jaar.hypotheek || 0)}\n= ${formatBedrag(eigenInVastgoed || 0)}">
                        ${formatBedrag(eigenInVastgoed || 0)}
                    </span>
                </td>
                <td>
                    <span title="Startkapitaal: Het bedrag waarmee je begint">
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

            // Bereken jaarlijks minimaal inkomen
            const jaarlijksMinimaalInkomen = minimaalInkomenDitJaar * 12;

            row.innerHTML = `
                <td>${jaar.jaar}</td>
                <td>
                    <span title="Extra inleg in dit jaar">
                        ${formatBedrag(jaar.inleg || 0)}
                    </span>
                </td>
                <td>
                    <span title="Formule: Vorige vastgoedwaarde + Waardestijging + Eventuele nieuwe panden\n= ${formatBedrag(jaar.vastgoedwaarde - jaar.overwaarde || 0)} + ${formatBedrag(jaar.overwaarde || 0)}\n= ${formatBedrag(jaar.vastgoedwaarde || 0)}\n\nWaardestijging wordt elk jaar opnieuw berekend over de actuele vastgoedwaarde van dat moment (rente-op-rente-effect): ${(waardestijging * 100).toFixed(1)}% × ${formatBedrag(jaar.vastgoedwaarde - jaar.overwaarde || 0)} = ${formatBedrag(jaar.overwaarde || 0)}\n\nLET OP: De waardestijging kan gedeeltelijk (75%) worden vrijgemaakt via herfinanciering voor nieuwe aankopen. Dit verhoogt dan wel de hypotheek.">
                        ${formatBedrag(jaar.vastgoedwaarde || 0)} (+${formatBedrag(jaar.overwaarde || 0)})
                    </span>
                </td>
                <td>
                    <span title="Formule: Vorige hypotheek + Hypotheek van nieuwe panden\nNa een aankoop: ${formatBedrag(jaar.hypotheek || 0)}${jaar.overwaardeGebruiktVoorVastgoed > 0 ? `\nInclusief herfinanciering: ${formatBedrag(jaar.overwaardeGebruiktVoorVastgoed)}` : ''}">
                        ${formatBedrag(jaar.hypotheek || 0)}
                    </span>
                </td>
                <td>
                    <span title="Totaal aantal panden in bezit">
                        ${jaar.aantalPanden || 0}
                    </span>
                </td>
                <td>
                    <span title="Formule: (Huur - Kosten - Hypotheekrente) / 12 maanden\n\nHuurberekening: Vastgoedwaarde × Huurrendement ${jaar.jaar > 1 ? `× (1 + Huurstijging)^(jaar-1)` : ``}\n= ${formatBedrag(jaar.vastgoedwaarde || 0)} × ${(huurrendement * 100).toFixed(1)}% ${jaar.jaar > 1 ? `× ${Math.pow(1 + huurstijging, jaar.jaar - 1).toFixed(4)}` : ``}\n= ${formatBedrag(jaar.vastgoedwaarde * huurrendement * (jaar.jaar > 1 ? Math.pow(1 + huurstijging, jaar.jaar - 1) : 1) || 0)} per jaar\n\nOnderhoudskosten: ${formatBedrag(jaar.vastgoedwaarde * kostenPercentage || 0)} (${(kostenPercentage * 100).toFixed(1)}%)\nHypotheeklast: ${formatBedrag(jaar.hypotheek * rentePercentage || 0)} (${(rentePercentage * 100).toFixed(1)}%)\n\nNetto inkomen per jaar: ${formatBedrag(jaar.nettoInkomen || 0)}\nNetto inkomen per maand: ${formatBedrag(nettoInkomenPerMaand || 0)}\n\nMinimaal benodigde inkomen (maandelijks): ${formatBedrag(minimaalInkomenDitJaar)}">
                        ${jaar.nettoInkomen ? formatBedrag(nettoInkomenPerMaand) + ' / ' + formatBedrag(minimaalInkomenDitJaar) : '-'}
                    </span>
                </td>
                <td>
                    <span title="Formule: Vastgoedwaarde - Hypotheek\n= ${formatBedrag(jaar.vastgoedwaarde || 0)} - ${formatBedrag(jaar.hypotheek || 0)}\n= ${formatBedrag(eigenInVastgoed || 0)}">
                        ${formatBedrag(eigenInVastgoed || 0)}
                    </span>
                </td>
                <td>
                    <span title="${jaar.eigenVermogen ?
                    `Formule: Vastgoedwaarde - Hypotheek + Niet-gebruikte cashflow + Niet-geïnvesteerde extra inleg\n\nVastgoedwaarde: ${formatBedrag(jaar.vastgoedwaarde || 0)}\nMin Hypotheek: ${formatBedrag(jaar.hypotheek || 0)}\nEigen in vastgoed: ${formatBedrag(jaar.vastgoedwaarde - jaar.hypotheek || 0)}${jaar.cumulatieveExtraInleg > 0 ?
                        `\nPlus Nog niet geïnvesteerde extra inleg: ${formatBedrag(jaar.cumulatieveExtraInleg)}` :
                        ''
                    }${jaar.nietGebruikteCashflow > 0 ?
                        `\nPlus Niet gebruikte cashflow: ${formatBedrag(jaar.nietGebruikteCashflow)}` :
                        ''
                    }${(index > 1 && projectie.slice(1, index).some(j => j.cashflowGebruiktVoorVastgoed > 0)) ?
                        `\n\nTotaal cashflow gebruikt voor vastgoed: ${formatBedrag(projectie.slice(1, index + 1).reduce((sum, j) => sum + (j.cashflowGebruiktVoorVastgoed || 0), 0))}` :
                        ''
                    }\n= ${formatBedrag(jaar.eigenVermogen || 0)}\n\nLET OP: Bij aankoopmomenten worden beschikbare fondsen (cashflow, extra inleg en herfinanciering) gebruikt om nieuwe panden te kopen. Via herfinanciering kan 75% van de opgebouwde overwaarde worden gebruikt, wat de hypotheek verhoogt.` :
                    'Startkapitaal'
                }">
                        ${formatBedrag(jaar.eigenVermogen || 0)}
                    </span>
                </td>
                <td>
                    <span title="${index > 1 ?
                    `Formule: Eigen vermogen nu - Eigen vermogen vorig jaar - Extra inleg\n= ${formatBedrag(jaar.eigenVermogen || 0)} - ${formatBedrag(projectie[index - 1].eigenVermogen || 0)} - ${formatBedrag(jaar.inleg || 0)}\n= ${formatBedrag(vermogensgroei)}` :
                    `In jaar 1 is de vermogensgroei gelijk aan de overwaarde: ${formatBedrag(jaar.overwaarde || 0)}`}">
                        ${formatBedrag(vermogensgroei)}
                    </span>
                </td>
                <td>
                    <span title="Formule: Netto inkomen - Minimaal inkomen (voor dit jaar)\n\nNetto inkomen (jaarlijks): ${formatBedrag(jaar.nettoInkomen || 0)}\nMinimaal inkomen (jaarlijks): ${formatBedrag(jaarlijksMinimaalInkomen)}\nVerschil dit jaar: ${formatBedrag(jaar.cashflowDitJaar || 0)}${jaar.cashflowGebruiktVoorVastgoed > 0 ?
                    `\n\nHiervan gebruikt voor aankoop vastgoed: ${formatBedrag(jaar.cashflowGebruiktVoorVastgoed || 0)}` :
                    ''
                }${jaar.overwaardeGebruiktVoorVastgoed > 0 ?
                    `\n\nHerfinanciering gebruikt voor aankoop: ${formatBedrag(jaar.overwaardeGebruiktVoorVastgoed || 0)}` :
                    ''
                }${(index > 1 && projectie.slice(1, index).some(j => j.cashflowGebruiktVoorVastgoed > 0 || j.overwaardeGebruiktVoorVastgoed > 0)) ?
                    `\n\nTotaal gebruikt voor vastgoed (cumulatief): ${formatBedrag(projectie.slice(1, index + 1).reduce((sum, j) => sum + (j.cashflowGebruiktVoorVastgoed || 0) + (j.overwaardeGebruiktVoorVastgoed || 0), 0))}` :
                    ''
                }">
                        ${jaar.cashflowDitJaar ? formatBedrag(jaar.cashflowDitJaar) : '-'}
                    </span>
                </td>
                <td>
                    <span title="Formule: (Netto inkomen / Eigen vermogen vorig jaar) × 100%\n= (${formatBedrag(jaar.nettoInkomen || 0)} / ${formatBedrag(projectie[index - 1].eigenVermogen || 1)}) × 100%\n= ${jaar.roe ? jaar.roe.toFixed(1) : 0}%">
                        ${jaar.roe ? `${jaar.roe.toFixed(1)}%` : '-'}
                    </span>
                </td>
                <td>
                    <span title="Formule: ROE + Waardestijging %\n= ${jaar.roe ? jaar.roe.toFixed(1) : 0}% + ${(waardestijging * 100).toFixed(1)}%\n= ${jaar.totaalRendement ? jaar.totaalRendement.toFixed(1) : 0}%">
                        ${jaar.totaalRendement ? `${jaar.totaalRendement.toFixed(1)}%` : '-'}
                    </span>
                </td>
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
                        callback: function (value) {
                                    return formatBedrag(value);
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                        label: function (context) {
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
                        callback: function (value) {
                                    return formatBedrag(value);
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                        label: function (context) {
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
    kostenPercentage,
    aankoopfrequentie = 3,
    extraJaren = 0,
    extraBedrag = 0,
    laatsteAankoopjaar = 30,
    huurrendement = 0.07,
    minimaalInkomen = 0,
    minimaalInkomenInflatie = 0,
    herfinancieringActief = true
) {
    // BELANGRIJKE OPMERKING:
    // cumulatieveOverwaarde houdt bij hoeveel waardestijging de panden hebben opgebouwd.
    // Deze overwaarde kan op twee manieren worden benut:
    // 1. Blijft in het vastgoed zitten als "eigen vermogen in vastgoed"
    // 2. Via herfinanciering kan 75% van de overwaarde worden vrijgemaakt voor nieuwe aankopen
    //    (dit verhoogt dan wel de hypotheek)
    // Het model biedt beide mogelijkheden, en de gebruiker kan kiezen via de herfinancieringActief parameter.
    
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
    let huidigeKosten = huidigeVastgoedwaarde * kostenPercentage;
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
        nietGebruikteCashflow: 0,
        cashflowGebruiktVoorVastgoed: 0
    });

    // Bereken netto inkomen voor jaar 1
    const huur = huidigeVastgoedwaarde * huurrendement;
    const kosten = huidigeVastgoedwaarde * kostenPercentage;
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
    let cashflowDitJaar = 0;
    if (effectiefNettoInkomen > minimaalInkomenJaar1) {
        const cashflowToevoegingJaar1 = (effectiefNettoInkomen - minimaalInkomenJaar1);
        huidigNietGebruikteCashflow += cashflowToevoegingJaar1;
        cashflowDitJaar = cashflowToevoegingJaar1;
        console.log(`Jaar 1: Netto inkomen €${formatNumberWithPoints(effectiefNettoInkomen)}, Minimaal inkomen €${formatNumberWithPoints(minimaalInkomenJaar1)}, Toegevoegd aan cashflow: €${formatNumberWithPoints(cashflowToevoegingJaar1)}`);
    } else {
        console.log(`Jaar 1: Netto inkomen €${formatNumberWithPoints(effectiefNettoInkomen)} is niet hoger dan minimaal inkomen €${formatNumberWithPoints(minimaalInkomenJaar1)}, niets toegevoegd`);
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
        cashflowDitJaar: cashflowDitJaar,
        cashflowGebruiktVoorVastgoed: 0,
        overwaardeGebruiktVoorVastgoed: 0,
        roe: roe,
        totaalRendement: totaalRendement,
        inleg: extraInlegDitJaar,
        cumulatieveExtraInleg: cumulatieveExtraInleg
    });

    // Bereken voor jaar 2 en verder
    for (let jaar = 2; jaar <= aantalJaren; jaar++) {
        // Initialiseer variabelen voor gebruik in de gehele loop
        let cashflowGebruiktVoorVastgoed = 0;
        let overwaardeGebruiktVoorVastgoed = 0;
        
        // Bereken nieuwe huurinkomsten met huurstijging
        const huur = huidigeVastgoedwaarde * huurrendement * Math.pow(1 + huurstijging, jaar - 1);
        const kosten = huidigeVastgoedwaarde * kostenPercentage;
        const rente = huidigHypotheek * rentePercentage;
        const jaarNettoInkomen = Math.round(huur - kosten - rente);
        
        // Log gedetailleerde berekening van huur en netto inkomen
        console.log(`Jaar ${jaar} - Gedetailleerde huurberekening:`, {
            "Vastgoedwaarde": formatBedrag(huidigeVastgoedwaarde),
            "Huurrendement (basis)": (huurrendement * 100).toFixed(1) + "%",
            "Huurstijging factor": `${(huurstijging * 100).toFixed(1)}% per jaar, cumulatief: ${(Math.pow(1 + huurstijging, jaar - 1) * 100).toFixed(2)}%`,
            "Formule": `Vastgoedwaarde × Huurrendement × (1 + Huurstijging)^(jaar-1)`,
            "Berekening": `${formatBedrag(huidigeVastgoedwaarde)} × ${(huurrendement * 100).toFixed(1)}% × ${Math.pow(1 + huurstijging, jaar - 1).toFixed(4)} = ${formatBedrag(huur)}`,
            "Huur totaal": formatBedrag(huur),
            "Onderhoudskosten": formatBedrag(kosten),
            "Hypotheekrente": formatBedrag(rente),
            "Netto inkomen": formatBedrag(jaarNettoInkomen)
        });
        
        // Bereken waardestijging voor dit jaar (op basis van de huidige vastgoedwaarde)
        const waardestijgingBedrag = Math.round(huidigeVastgoedwaarde * waardestijging);
        
        // Log gedetailleerde berekening van waardestijging
        console.log(`Jaar ${jaar} - Waardestijging berekening:`, {
            "Vastgoedwaarde begin jaar": formatBedrag(huidigeVastgoedwaarde),
            "Waardestijgingspercentage": (waardestijging * 100).toFixed(1) + "%",
            "Waardestijging bedrag": formatBedrag(waardestijgingBedrag)
        });
        
        // Verhoog vastgoedwaarde met waardestijging
        huidigeVastgoedwaarde += waardestijgingBedrag;
        cumulatieveOverwaarde += waardestijgingBedrag;

        // Bepaal het minimaal inkomen voor dit jaar (met inflatie)
        const minimaalInkomenDitJaar = minimaalInkomen * Math.pow(1 + minimaalInkomenInflatie, jaar - 1);
        const minimaalInkomenJaar = minimaalInkomenDitJaar * 12; // Jaarlijks minimaal inkomen

        // Alleen overschot aan inkomen toevoegen aan niet-gebruikte cashflow als het boven het minimale inkomen ligt
        let cashflowDitJaar = 0;
        if (jaarNettoInkomen > minimaalInkomenJaar) {
            const cashflowToevoeging = (jaarNettoInkomen - minimaalInkomenJaar);
            huidigNietGebruikteCashflow += cashflowToevoeging;
            cashflowDitJaar = cashflowToevoeging;
            console.log(`Jaar ${jaar}: Netto inkomen €${formatNumberWithPoints(jaarNettoInkomen)}, Minimaal inkomen €${formatNumberWithPoints(minimaalInkomenJaar)}, Toegevoegd aan cashflow: €${formatNumberWithPoints(cashflowToevoeging)}`);
        } else {
            console.log(`Jaar ${jaar}: Netto inkomen €${formatNumberWithPoints(jaarNettoInkomen)} is niet hoger dan minimaal inkomen €${formatNumberWithPoints(minimaalInkomenJaar)}, niets toegevoegd`);
        }

        // Beginnend bij jaar 1, niet bij START (dus jaar - 1)
        const maandenSindsStart = (jaar - 1) * 12;
        const isAankoopMoment = maandenSindsStart % aankoopfrequentie === 0 && maandenSindsStart > 0;

        let nieuweHuur = huur;
        let nieuweKosten = kosten;
        let nieuweRente = rente;
        let nieuwNettoInkomen = jaarNettoInkomen;
        let aankoopbedrag = 0;

        // Herfinanciering: maak een deel van de overwaarde beschikbaar voor nieuwe aankopen
        // Hierbij wordt een nieuwe hypotheek genomen op de bestaande panden
        const herfinancieringsPercentage = 0.75; // 75% van de overwaarde kan worden vrijgemaakt
        const beschikbareOverwaarde = herfinancieringActief ? cumulatieveOverwaarde * herfinancieringsPercentage : 0;
        
        // Beschikbaar kapitaal voor investeringen bestaat uit:
        // 1. Liquide kapitaal (niet gebruikte cashflow en extra inleg)
        // 2. Vrijgemaakte overwaarde via herfinanciering (indien actief)
        const beschikbaarVoorInvestering = huidigNietGebruikteCashflow + cumulatieveExtraInleg + beschikbareOverwaarde;
        const benodigdEigenVermogenPerPand = gemiddeldePandwaarde * (1 - ltv);

        // ====== AANKOOP REGELS ======
        //
        // 1. REGULIERE AANKOPEN:
        //    - Een aankoop vindt plaats om de 'aankoopfrequentie' maanden (standaard elke 3 maanden)
        //    - Er moet voldoende beschikbaar kapitaal zijn (minimaal het benodigde eigen vermogen voor 1 pand)
        //    - Het jaar mag niet hoger zijn dan het 'laatsteAankoopjaar'
        //
        // 2. GEFORCEERDE AANKOPEN:
        //    - Als er nog ongebruikte extra inleg is na de extra inleg jaren, wordt een aankoop geforceerd
        //    - Als er meer dan 125% van het benodigde kapitaal beschikbaar is, kan er ook buiten de normale momenten
        //      een aankoop plaatsvinden (efficiënter gebruik van kapitaal)
        //    - Als er meer dan 150% van het benodigde kapitaal beschikbaar is, wordt een aankoop geforceerd
        //    - Geforceerde aankopen gebeuren alleen als het jaar niet hoger is dan het 'laatsteAankoopjaar'
        //
        // 3. LIMIETEN:
        //    - Per aankoopmoment worden maximaal 10 panden gekocht om extreme investeringen te voorkomen
        //    - Er wordt altijd zoveel mogelijk panden gekocht binnen de limiet als er voldoende kapitaal is
        //
        // 4. VERDELING VAN RESTERENDE FONDSEN:
        //    - Na een aankoop wordt het resterende bedrag proportioneel verdeeld
        //    - Indien herfinanciering is gebruikt, stijgt de hypotheek
        //
        // 5. HERFINANCIERING (nieuw):
        //    - Een percentage van de overwaarde kan worden vrijgemaakt via herfinanciering voor nieuwe aankopen
        //    - Bij gebruik van overwaarde wordt de hypotheek verhoogd
        //    - De herfinanciering verhoogt de LTV ratio niet boven de oorspronkelijke limiet
        //
        // 6. NA HET LAATSTE AANKOOPJAAR:
        //    - Na het 'laatsteAankoopjaar' worden geen nieuwe panden meer gekocht
        //    - Overwaarde blijft in het vastgoed zitten en wordt beschouwd als "eigen in vastgoed"
        //    - Niet-gebruikte cashflow (verschil tussen netto inkomen en minimaal inkomen) blijft beschikbaar

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
            (forceerGebruikExtraInleg && kanNogKopen && beschikbaarVoorInvestering >= benodigdEigenVermogenPerPand)) {

            console.log(`Jaar ${jaar}: Nieuwe panden aankopen!${forceerGebruikExtraInleg ? ' (Geforceerde investering)' : ''}`);
            console.log(`Beschikbaar kapitaal: €${Math.round(beschikbaarVoorInvestering)} (Cashflow: €${Math.round(huidigNietGebruikteCashflow)}, Extra inleg: €${Math.round(cumulatieveExtraInleg)}, Herfinancierde overwaarde: €${Math.round(beschikbareOverwaarde)})`);

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
            huidigHypotheek += nieuweInvestering * ltv; // Hypotheek voor nieuwe panden
            huidigAantalPanden += aantalNieuwePanden;

            // Reset cumulatieven en behoud eventueel resterende fondsen
            const resterendBedrag = beschikbaarVoorInvestering - gebruiktInvesteringsbedrag;

            // Bereken hoeveel van elke bron is gebruikt voor vastgoed op basis van proporties
            const totaalBeschikbaar = huidigNietGebruikteCashflow + cumulatieveExtraInleg + beschikbareOverwaarde;
            const proportieNietGebruikteCashflow = totaalBeschikbaar > 0 ? huidigNietGebruikteCashflow / totaalBeschikbaar : 0;
            const proportieExtraInleg = totaalBeschikbaar > 0 ? cumulatieveExtraInleg / totaalBeschikbaar : 0;
            const proportieOverwaarde = totaalBeschikbaar > 0 ? beschikbareOverwaarde / totaalBeschikbaar : 0;

            // Bereken hoeveel van elke bron is gebruikt voor de aankoop
            cashflowGebruiktVoorVastgoed = Math.round(gebruiktInvesteringsbedrag * proportieNietGebruikteCashflow);
            const extraInlegGebruiktVoorVastgoed = Math.round(gebruiktInvesteringsbedrag * proportieExtraInleg);
            overwaardeGebruiktVoorVastgoed = Math.round(gebruiktInvesteringsbedrag * proportieOverwaarde);

            // Verdeel de resterende bedragen en pas de hypotheek aan voor herfinanciering
            huidigNietGebruikteCashflow = Math.round(resterendBedrag * proportieNietGebruikteCashflow);
            cumulatieveExtraInleg = Math.round(resterendBedrag * proportieExtraInleg);
            
            // Verhoog de hypotheek op bestaande panden als we overwaarde hebben gebruikt
            if (overwaardeGebruiktVoorVastgoed > 0) {
                // De hypotheek wordt verhoogd met het gebruikte deel van de overwaarde
                huidigHypotheek += overwaardeGebruiktVoorVastgoed;
                
                // Verminder de beschikbare cumulatieve overwaarde met wat is gebruikt
                // Omzetten naar 100% (was slechts gedeeltelijk beschikbaar via herfinancieringsPercentage)
                cumulatieveOverwaarde -= overwaardeGebruiktVoorVastgoed / herfinancieringsPercentage;
                
                console.log(`Jaar ${jaar}: Herfinanciering gebruikt: €${Math.round(overwaardeGebruiktVoorVastgoed)}, nieuwe hypotheek: €${Math.round(huidigHypotheek)}`);
            }

            // Gedetailleerde logging van de aankoop
            console.log(`Jaar ${jaar}: Aankoop details:
            - Aangekocht: ${aantalNieuwePanden} panden voor €${Math.round(gebruiktInvesteringsbedrag)}
            - Gebruikt uit cashflow: €${cashflowGebruiktVoorVastgoed}
            - Gebruikt uit extra inleg: €${extraInlegGebruiktVoorVastgoed}
            - Gebruikt uit herfinanciering: €${overwaardeGebruiktVoorVastgoed}
            - Resterend: €${Math.round(resterendBedrag)} (waarvan €${Math.round(cumulatieveExtraInleg)} extra inleg)
            - Overwaarde na herfinanciering: €${Math.round(cumulatieveOverwaarde)}`);

            // Herbereken inkomen met nieuwe panden
            nieuweHuur = huidigeVastgoedwaarde * huurrendement * Math.pow(1 + huurstijging, jaar - 1);
            nieuweKosten = huidigeVastgoedwaarde * kostenPercentage;
            nieuweRente = huidigHypotheek * rentePercentage;
            nieuwNettoInkomen = Math.round(nieuweHuur - nieuweKosten - nieuweRente);
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

            // Geen cashflow gebruikt voor vastgoed in dit jaar
            cashflowGebruiktVoorVastgoed = 0;
            // Ook geen overwaarde gebruikt
            overwaardeGebruiktVoorVastgoed = 0;
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
            cashflowDitJaar: cashflowDitJaar,
            cashflowGebruiktVoorVastgoed: cashflowGebruiktVoorVastgoed || 0,
            overwaardeGebruiktVoorVastgoed: overwaardeGebruiktVoorVastgoed || 0,
            roe: roe,
            totaalRendement: totaalRendement,
            inleg: extraInlegDitJaar,
            cumulatieveExtraInleg: cumulatieveExtraInleg
        });
    }

    return projectie;
}