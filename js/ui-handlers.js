// Functie om bedragen te formatteren
function formatBedrag(bedrag) {
    return new Intl.NumberFormat('nl-NL', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(bedrag);
}

document.addEventListener('DOMContentLoaded', function () {
            // Input elementen selecteren met veilige null-checks
            const eigenVermogenInput = document.getElementById('eigenVermogen');
            const ltvInput = document.getElementById('ltv');
            const rentePercentageInput = document.getElementById('rentePercentage');
            const vennootschapsbelastingInput = 0.198;
            const rentePriveInput = rentePercentageInput;
            const structuurSelect = document.getElementById('structuur');
            const holdingInstellingen = document.getElementById('holdingInstellingen');

            // Vermogensgroei input elementen met veilige null-checks
            const startEigenVermogenInput = document.getElementById('startEigenVermogen');
            const pandwaardeInput = document.getElementById('pandwaarde');
            const looptijdVermogensgroeiInput = document.getElementById('looptijdVermogensgroei');
            const structuurVermogensgroeiSelect = document.getElementById('structuurVermogensgroei');
            const holdingInstellingenVermogensgroei = document.getElementById('holdingInstellingenVermogensgroei');
            const ltvVermogensgroeiInput = document.getElementById('ltvVermogensgroei');
            const rentePercentageVermogensgroeiInput = document.getElementById('rentePercentageVermogensgroei');
            const huurrendementVermogensgroeiInput = document.getElementById('huurrendementVermogensgroei');
            const huurstijgingVermogensgroeiInput = document.getElementById('huurstijgingVermogensgroei');
            const kostenPercentageVermogensgroeiInput = document.getElementById('kostenPercentageVermogensgroei');
            const waardestijgingVermogensgroeiInput = document.getElementById('waardestijgingVermogensgroei');
            const herinvesteerWaardestijgingVermogensgroeiInput = document.getElementById('herinvesteerWaardestijgingVermogensgroei');
            const comfortNiveau1Input = document.getElementById('comfortNiveau1');
            const comfortNiveau2Input = document.getElementById('comfortNiveau2');
            const comfortNiveau3Input = document.getElementById('comfortNiveau3');
            const minimaalInkomenInput = document.getElementById('minimaalInkomen');
            const minimaalInkomenInflatieInput = document.getElementById('minimaalInkomenInflatie');
            const aankoopFrequentieInput = document.getElementById('aankoopFrequentie');
            const extraInlegJarenInput = document.getElementById('extraInlegJaren');
            const extraInlegBedragInput = document.getElementById('extraInlegBedrag');
            const laatsteAankoopJaarInput = document.getElementById('laatsteAankoopJaar');

            // Functie om vermogensgroei waardes op te slaan
            function saveVermogensgroeiWaarden() {
                const waarden = {
                    startEigenVermogen: startEigenVermogenInput?.value,
                    pandwaarde: pandwaardeInput?.value,
                    looptijd: looptijdVermogensgroeiInput?.value,
                    structuur: structuurVermogensgroeiSelect?.value,
                    ltv: ltvVermogensgroeiInput?.value,
                    rentePercentage: rentePercentageVermogensgroeiInput?.value,
                    huurrendement: huurrendementVermogensgroeiInput?.value,
                    huurstijging: huurstijgingVermogensgroeiInput?.value,
                    kostenPercentage: kostenPercentageVermogensgroeiInput?.value,
                    waardestijging: waardestijgingVermogensgroeiInput?.value,
                    herinvesteerWaardestijging: herinvesteerWaardestijgingVermogensgroeiInput?.checked,
                    comfortNiveau1: comfortNiveau1Input?.value,
                    comfortNiveau2: comfortNiveau2Input?.value,
                    comfortNiveau3: comfortNiveau3Input?.value,
                    minimaalInkomen: minimaalInkomenInput?.value,
                    minimaalInkomenInflatie: minimaalInkomenInflatieInput?.value,
                    aankoopFrequentie: aankoopFrequentieInput?.value,
                    extraInlegJaren: extraInlegJarenInput?.value,
                    extraInlegBedrag: extraInlegBedragInput?.value,
                    laatsteAankoopJaar: laatsteAankoopJaarInput?.value,
                };
                localStorage.setItem('vermogensgroeiWaarden', JSON.stringify(waarden));
            }

            // Functie om scenario waardes op te slaan
            function saveScenarioWaarden() {
                const waarden = {
                    eigenVermogen: eigenVermogenInput?.value,
                    ltv: ltvInput?.value,
                    rentePercentage: rentePercentageInput?.value,
                    structuur: structuurSelect?.value,
                    waardestijging: document.getElementById('waardestijging')?.value
                };
                localStorage.setItem('scenarioWaarden', JSON.stringify(waarden));
            }

            // Laad opgeslagen waarden voor scenario tab
            const scenarioWaarden = JSON.parse(localStorage.getItem('scenarioWaarden') || '{}');
            if (scenarioWaarden.eigenVermogen && eigenVermogenInput) eigenVermogenInput.value = scenarioWaarden.eigenVermogen;
            if (scenarioWaarden.ltv && ltvInput) ltvInput.value = scenarioWaarden.ltv;
            if (scenarioWaarden.rentePercentage && rentePercentageInput) rentePercentageInput.value = scenarioWaarden.rentePercentage;
            if (scenarioWaarden.vennootschapsbelasting) vennootschapsbelastingInput.value = scenarioWaarden.vennootschapsbelasting;
            if (scenarioWaarden.rentePrive) rentePriveInput.value = scenarioWaarden.rentePrive;
            if (scenarioWaarden.structuur && structuurSelect) structuurSelect.value = scenarioWaarden.structuur;
            
            const waardestijgingEl = document.getElementById('waardestijging');
            if (scenarioWaarden.waardestijging && waardestijgingEl) waardestijgingEl.value = scenarioWaarden.waardestijging;

            // Laad opgeslagen waarden voor vermogensgroei tab
            const vermogensgroeiWaarden = JSON.parse(localStorage.getItem('vermogensgroeiWaarden') || '{}');
            if (vermogensgroeiWaarden.startEigenVermogen && startEigenVermogenInput) startEigenVermogenInput.value = vermogensgroeiWaarden.startEigenVermogen;
            if (vermogensgroeiWaarden.pandwaarde && pandwaardeInput) pandwaardeInput.value = vermogensgroeiWaarden.pandwaarde;
            if (vermogensgroeiWaarden.looptijd && looptijdVermogensgroeiInput) looptijdVermogensgroeiInput.value = vermogensgroeiWaarden.looptijd;
            if (vermogensgroeiWaarden.structuur && structuurVermogensgroeiSelect) structuurVermogensgroeiSelect.value = vermogensgroeiWaarden.structuur;
            if (vermogensgroeiWaarden.ltv && ltvVermogensgroeiInput) ltvVermogensgroeiInput.value = vermogensgroeiWaarden.ltv;
            if (vermogensgroeiWaarden.rentePercentage && rentePercentageVermogensgroeiInput) rentePercentageVermogensgroeiInput.value = vermogensgroeiWaarden.rentePercentage;
            if (vermogensgroeiWaarden.huurrendement && huurrendementVermogensgroeiInput) huurrendementVermogensgroeiInput.value = vermogensgroeiWaarden.huurrendement;
            if (vermogensgroeiWaarden.huurstijging && huurstijgingVermogensgroeiInput) huurstijgingVermogensgroeiInput.value = vermogensgroeiWaarden.huurstijging;
            if (vermogensgroeiWaarden.kostenPercentage && kostenPercentageVermogensgroeiInput) kostenPercentageVermogensgroeiInput.value = vermogensgroeiWaarden.kostenPercentage;
            if (vermogensgroeiWaarden.waardestijging && waardestijgingVermogensgroeiInput) waardestijgingVermogensgroeiInput.value = vermogensgroeiWaarden.waardestijging;
            if (vermogensgroeiWaarden.herinvesteerWaardestijging !== undefined && herinvesteerWaardestijgingVermogensgroeiInput) {
                herinvesteerWaardestijgingVermogensgroeiInput.checked = vermogensgroeiWaarden.herinvesteerWaardestijging;
            }
            if (vermogensgroeiWaarden.comfortNiveau1 && comfortNiveau1Input) comfortNiveau1Input.value = vermogensgroeiWaarden.comfortNiveau1;
            if (vermogensgroeiWaarden.comfortNiveau2 && comfortNiveau2Input) comfortNiveau2Input.value = vermogensgroeiWaarden.comfortNiveau2;
            if (vermogensgroeiWaarden.comfortNiveau3 && comfortNiveau3Input) comfortNiveau3Input.value = vermogensgroeiWaarden.comfortNiveau3;
            
            if (vermogensgroeiWaarden.minimaalInkomen && minimaalInkomenInput) minimaalInkomenInput.value = vermogensgroeiWaarden.minimaalInkomen;
            if (vermogensgroeiWaarden.minimaalInkomenInflatie && minimaalInkomenInflatieInput) minimaalInkomenInflatieInput.value = vermogensgroeiWaarden.minimaalInkomenInflatie;
            if (vermogensgroeiWaarden.aankoopFrequentie && aankoopFrequentieInput) aankoopFrequentieInput.value = vermogensgroeiWaarden.aankoopFrequentie;
            if (vermogensgroeiWaarden.extraInlegJaren && extraInlegJarenInput) extraInlegJarenInput.value = vermogensgroeiWaarden.extraInlegJaren;
            if (vermogensgroeiWaarden.extraInlegBedrag && extraInlegBedragInput) extraInlegBedragInput.value = vermogensgroeiWaarden.extraInlegBedrag;
            if (vermogensgroeiWaarden.laatsteAankoopJaar && laatsteAankoopJaarInput) laatsteAankoopJaarInput.value = vermogensgroeiWaarden.laatsteAankoopJaar;

            // Functie om hefboomfactor te berekenen
            function updateHefboomFactor() {
                const ltvValue = parseFloat(ltvVermogensgroeiInput?.value || 0) / 100;
                const hefboomFactor = (1 / (1 - ltvValue)).toFixed(1);
                const hefboomSpan = document.getElementById('hefboomFactor');
                if (hefboomSpan) {
                    hefboomSpan.textContent = `(x${hefboomFactor} hefboom)`;
                }
            }
            
            // Update hefboomfactor bij laden en bij wijziging
            updateHefboomFactor();
            if (ltvVermogensgroeiInput) {
                ltvVermogensgroeiInput.addEventListener('input', updateHefboomFactor);
            }

            // Event listeners voor scenario inputs met veilige null-checks
            const scenarioInputs = [eigenVermogenInput, ltvInput, rentePercentageInput, document.getElementById('waardestijging')].filter(Boolean);
            scenarioInputs.forEach(input => {
                input.addEventListener('change', () => {
                    const resultaten = berekenScenarioResultaten();
                    if (typeof updateCharts === 'function') {
                        updateCharts(resultaten);
                    }
                    if (typeof updateScenarioTabel === 'function') {
                        updateScenarioTabel(resultaten);
                    }
                    saveScenarioWaarden();
                });
            });

            // Event listeners voor vermogensgroei inputs met veilige null-checks
            const vermogensgroeiInputs = [
                startEigenVermogenInput, pandwaardeInput, looptijdVermogensgroeiInput,
                ltvVermogensgroeiInput, rentePercentageVermogensgroeiInput, huurrendementVermogensgroeiInput,
                huurstijgingVermogensgroeiInput, kostenPercentageVermogensgroeiInput, waardestijgingVermogensgroeiInput,
                herinvesteerWaardestijgingVermogensgroeiInput, comfortNiveau1Input, comfortNiveau2Input,
                comfortNiveau3Input, minimaalInkomenInput, minimaalInkomenInflatieInput, aankoopFrequentieInput,
                extraInlegJarenInput, extraInlegBedragInput
            ].filter(Boolean);

            vermogensgroeiInputs.forEach(input => {
                input.addEventListener('change', () => {
                    berekenVermogensgroei();
                    saveVermogensgroeiWaarden();
                });
            });

            // Structuur wijziging handlers
            if (structuurSelect && holdingInstellingen) {
                structuurSelect.addEventListener('change', () => {
                    holdingInstellingen.style.display = structuurSelect.value === 'holding' ? 'block' : 'none';
                    const resultaten = berekenScenarioResultaten();
                    if (typeof updateCharts === 'function') {
                        updateCharts(resultaten);
                    }
                    if (typeof updateScenarioTabel === 'function') {
                        updateScenarioTabel(resultaten);
                    }
                    saveScenarioWaarden();
                });
            }

            if (structuurVermogensgroeiSelect && holdingInstellingenVermogensgroei) {
                structuurVermogensgroeiSelect.addEventListener('change', () => {
                    holdingInstellingenVermogensgroei.style.display = structuurVermogensgroeiSelect.value === 'holding' ? 'block' : 'none';
                    berekenVermogensgroei();
                    saveVermogensgroeiWaarden();
                });
            }

            // Tab navigatie
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContents = document.querySelectorAll('.tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    button.classList.add('active');
                    const tabContent = document.getElementById(`${button.dataset.tab}Tab`);
                    if (tabContent) {
                        tabContent.classList.add('active');
                    }
                    localStorage.setItem('laatsteTab', button.dataset.tab);
                });
            });

            // Laad laatste actieve tab
            const laatsteTab = localStorage.getItem('laatsteTab') || 'scenario';
            document.querySelectorAll('.tab-button').forEach(button => {
                if (button.dataset.tab === laatsteTab) {
                    button.classList.add('active');
                    const tabContent = document.getElementById(`${button.dataset.tab}Tab`);
                    if (tabContent) {
                        tabContent.classList.add('active');
                    }
                } else {
                    button.classList.remove('active');
                    const tabContent = document.getElementById(`${button.dataset.tab}Tab`);
                    if (tabContent) {
                        tabContent.classList.remove('active');
                    }
                }
            });

            // Initialiseer berekeningen
            const resultaten = berekenScenarioResultaten();
            if (typeof updateCharts === 'function') {
                updateCharts(resultaten);
            }
            if (typeof updateScenarioTabel === 'function') {
                updateScenarioTabel(resultaten);
            }
            berekenVermogensgroei();

            // Zorg dat het laatsteAankoopJaar veld ook een event listener krijgt
            if (laatsteAankoopJaarInput) {
                laatsteAankoopJaarInput.addEventListener('change', function() {
                    saveVermogensgroeiWaarden();
                    berekenVermogensgroei();
                });
            }

            // PDF export functionaliteit
            const exportPdfBtn = document.getElementById('exportPdfBtn');
            if (exportPdfBtn) {
                exportPdfBtn.addEventListener('click', function() {
                    exportToPdf();
                });
            }

            function exportToPdf() {
                // Verberg de export knop tijdens het maken van de PDF
                if (exportPdfBtn) exportPdfBtn.style.display = 'none';
                
                // Maak een tijdelijke container voor de printbare content
                const printContainer = document.createElement('div');
                printContainer.className = 'pdf-container';
                printContainer.style.padding = '20px';
                
                // Voeg titel toe
                const title = document.createElement('h1');
                title.textContent = 'Vastgoed Investeringen - Gedetailleerde Projectie';
                title.style.textAlign = 'center';
                title.style.marginBottom = '20px';
                printContainer.appendChild(title);
                
                // Voeg datum en tijd toe
                const datumTijd = document.createElement('p');
                datumTijd.textContent = 'Rapport gegenereerd op: ' + new Date().toLocaleString('nl-NL');
                datumTijd.style.textAlign = 'center';
                datumTijd.style.marginBottom = '30px';
                printContainer.appendChild(datumTijd);
                
                // Voeg parameteroverzicht toe
                const parametersDiv = document.createElement('div');
                parametersDiv.style.marginBottom = '30px';
                parametersDiv.style.padding = '15px';
                parametersDiv.style.border = '1px solid #ccc';
                parametersDiv.style.borderRadius = '5px';
                
                parametersDiv.innerHTML = `
                    <h2 style="margin-bottom: 10px;">Ingestelde parameters</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <p><strong>Start eigen vermogen:</strong> ${formatBedrag(parseFloat(startEigenVermogenInput?.value || 0))}</p>
                            <p><strong>Pandwaarde:</strong> ${formatBedrag(parseFloat(pandwaardeInput?.value || 0))}</p>
                            <p><strong>Looptijd:</strong> ${looptijdVermogensgroeiInput?.value || 0} jaar</p>
                            <p><strong>LTV:</strong> ${ltvVermogensgroeiInput?.value || 0}%</p>
                            <p><strong>Rente:</strong> ${rentePercentageVermogensgroeiInput?.value || 0}%</p>
                        </div>
                        <div>
                            <p><strong>Huurrendement:</strong> ${huurrendementVermogensgroeiInput?.value || 0}%</p>
                            <p><strong>Huurstijging:</strong> ${huurstijgingVermogensgroeiInput?.value || 0}%</p>
                            <p><strong>Kosten:</strong> ${kostenPercentageVermogensgroeiInput?.value || 0}%</p>
                            <p><strong>Waardestijging:</strong> ${waardestijgingVermogensgroeiInput?.value || 0}%</p>
                            <p><strong>Extra inleg:</strong> ${formatBedrag(parseFloat(extraInlegBedragInput?.value || 0))} per jaar voor ${extraInlegJarenInput?.value || 0} jaar</p>
                            <p><strong>Aankoop frequentie:</strong> Elke ${aankoopFrequentieInput?.value || 3} maanden</p>
                            <p><strong>Laatste aankoop jaar:</strong> ${laatsteAankoopJaarInput?.value || 'Niet ingesteld'}</p>
                        </div>
                    </div>
                `;
                printContainer.appendChild(parametersDiv);
                
                // Haal de projectiedata op
                const projectie = window.huidigeProjectie || [];
                if (!projectie || projectie.length === 0) {
                    const errorDiv = document.createElement('div');
                    errorDiv.innerHTML = '<p style="color: red;">Geen projectiedata beschikbaar. Genereer eerst een projectie.</p>';
                    printContainer.appendChild(errorDiv);
                } else {
                    // Voeg de tabel met kolomkoppen toe
                    const tableSection = document.createElement('div');
                    tableSection.style.marginBottom = '30px';
                    
                    const tableTitle = document.createElement('h2');
                    tableTitle.textContent = 'Projectie overzicht';
                    tableTitle.style.marginBottom = '10px';
                    tableSection.appendChild(tableTitle);
                    
                    // Maak de tabel
                    const table = document.createElement('table');
                    table.style.width = '100%';
                    table.style.borderCollapse = 'collapse';
                    table.style.fontSize = '10px';
                    
                    // Voeg de tabelkoppen toe
                    const thead = document.createElement('thead');
                    thead.innerHTML = `
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" rowspan="2">Jaar</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" rowspan="2">Inleg</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" rowspan="2">Vastgoedwaarde</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" rowspan="2">Hypotheek</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" rowspan="2">Aantal panden</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #d1ecc0;" colspan="4">Inkomsten, Kosten & Cashflow (per maand)</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" rowspan="2">Eigen in vastgoed</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" rowspan="2">Eigen vermogen</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" rowspan="2">Vermogensgroei</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" rowspan="2">ROE</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" rowspan="2">Totaal rendement</th>
                        </tr>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #e2f4d5;">Huurinkomsten</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #f9d9d9;">Kosten</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #d1e0f0;">Netto</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #ffeeba;">Cashflow</th>
                        </tr>
                    `;
                    table.appendChild(thead);
                    
                    // Parameters ophalen voor berekeningen
                    const startEigenVermogen = parseFloat(startEigenVermogenInput?.value || 0);
                    const pandwaarde = parseFloat(pandwaardeInput?.value || 0);
                    const ltv = parseFloat(ltvVermogensgroeiInput?.value || 0) / 100;
                    const rentePercentage = parseFloat(rentePercentageVermogensgroeiInput?.value || 0) / 100;
                    const huurrendement = parseFloat(huurrendementVermogensgroeiInput?.value || 0) / 100;
                    const huurstijging = parseFloat(huurstijgingVermogensgroeiInput?.value || 0) / 100;
                    const kostenPercentage = parseFloat(kostenPercentageVermogensgroeiInput?.value || 0) / 100;
                    const waardestijging = parseFloat(waardestijgingVermogensgroeiInput?.value || 0) / 100;
                    const extraInlegBedrag = parseFloat(extraInlegBedragInput?.value || 0);
                    const extraInlegJaren = parseInt(extraInlegJarenInput?.value || 0);
                    const aankoopFrequentie = parseInt(aankoopFrequentieInput?.value || 3);
                    const minimaalInkomen = parseFloat(minimaalInkomenInput?.value || 0);
                    const minimaalInkomenInflatie = parseFloat(minimaalInkomenInflatieInput?.value || 0) / 100;
                    
                    // Voeg de tabeldata toe
                    const tbody = document.createElement('tbody');
                    projectie.forEach((jaar, index) => {
                        const row = document.createElement('tr');
                        if (jaar.jaar !== "START" && jaar.jaar % 3 === 0) {
                            row.style.backgroundColor = '#f9f9f9';
                        }
                        
                        // Bereken het eigen vermogen in vastgoed
                        const eigenInVastgoed = jaar.vastgoedwaarde - jaar.hypotheek;
                        
                        // Bereken vermogensgroei
                        let vermogensgroei = 0;
                        if (index === 1) {
                            vermogensgroei = jaar.overwaarde || 0;
                        } else if (index > 1) {
                            vermogensgroei = jaar.eigenVermogen - projectie[index - 1].eigenVermogen - jaar.inleg;
                        }
                        
                        // Bereken minimaal inkomen voor dit jaar
                        const minimaalInkomenDitJaar = jaar.jaar === 1 ? 
                            minimaalInkomen : 
                            minimaalInkomen * Math.pow(1 + minimaalInkomenInflatie, jaar.jaar - 1);
                        
                        const nettoInkomenPerMaand = jaar.nettoInkomen ? Math.round(jaar.nettoInkomen / 12) : 0;
                        
                        // Bereken de waarden voor de tabel
                        const huurStijgingFactor = jaar.jaar === 1 ? 1 : Math.pow(1 + huurstijging, jaar.jaar - 1);
                        const huurInkomstenPerJaar = jaar.vastgoedwaarde * huurrendement * huurStijgingFactor;
                        const huurInkomstenPerMaand = huurInkomstenPerJaar / 12;
                        const kostenPerJaar = (jaar.vastgoedwaarde * kostenPercentage) + (jaar.hypotheek * rentePercentage);
                        const kostenPerMaand = kostenPerJaar / 12;

                        // Bereken minimaal inkomen voor maandelijkse cashflow berekening
                        const minimaalInkomenPerMaand = minimaalInkomenDitJaar;
                        const cashflowPerMaand = jaar.jaar !== "START" && jaar.nettoInkomen ? 
                            Math.round(jaar.nettoInkomen / 12) - minimaalInkomenPerMaand : 0;

                        // Opmaak voor de rij
                        row.innerHTML = `
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${jaar.jaar}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatBedrag(jaar.inleg || 0)}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatBedrag(jaar.vastgoedwaarde || 0)}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatBedrag(jaar.hypotheek || 0)}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${jaar.aantalPanden || 0}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right; background-color: #e2f4d5;">${jaar.jaar !== "START" ? formatBedrag(huurInkomstenPerMaand) : '-'}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right; background-color: #f9d9d9;">${jaar.jaar !== "START" ? formatBedrag(kostenPerMaand) : '-'}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right; background-color: #d1e0f0; font-weight: bold;">${jaar.nettoInkomen ? formatBedrag(nettoInkomenPerMaand) : '-'}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right; background-color: #ffeeba; font-weight: bold;">${jaar.jaar !== "START" ? cashflowPerMaand > 0 ? formatBedrag(cashflowPerMaand) : formatBedrag(0) : '-'}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatBedrag(eigenInVastgoed || 0)}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatBedrag(jaar.eigenVermogen || 0)}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${index > 0 ? formatBedrag(vermogensgroei) : '-'}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${jaar.roe ? `${jaar.roe.toFixed(1)}%` : '-'}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${jaar.totaalRendement ? `${jaar.totaalRendement.toFixed(1)}%` : '-'}</td>
                        `;
                        
                        tbody.appendChild(row);
                    });
                    
                    table.appendChild(tbody);
                    tableSection.appendChild(table);
                    printContainer.appendChild(tableSection);
                    
                    // Voeg per jaar gedetailleerde uitleg toe
                    const jaarDetailsSection = document.createElement('div');
                    jaarDetailsSection.style.marginTop = '40px';
                    jaarDetailsSection.style.pageBreakBefore = 'always';
                    
                    const jaarDetailsTitle = document.createElement('h2');
                    jaarDetailsTitle.textContent = 'Gedetailleerde uitleg per jaar';
                    jaarDetailsTitle.style.marginBottom = '20px';
                    jaarDetailsSection.appendChild(jaarDetailsTitle);
                    
                    // Voeg uitleg toe voor elk jaar
                    projectie.forEach((jaar, index) => {
                        // Sla "START" over bij sommige berekeningen
                        if (index > 0 || jaar.jaar === "START") {
                            const jaarDetail = document.createElement('div');
                            jaarDetail.style.marginBottom = '30px';
                            jaarDetail.style.padding = '15px';
                            jaarDetail.style.border = '1px solid #ccc';
                            jaarDetail.style.borderRadius = '5px';
                            jaarDetail.style.pageBreakInside = 'avoid';
                            
                            // Titel voor het jaar
                            const jaarTitle = document.createElement('h3');
                            jaarTitle.textContent = `Jaar: ${jaar.jaar}`;
                            jaarTitle.style.marginBottom = '10px';
                            jaarDetail.appendChild(jaarTitle);
                            
                            let beschrijving = '';
                            
                            if (jaar.jaar === "START") {
                                beschrijving = `
                                    <p><strong>Uitgangssituatie:</strong></p>
                                    <ul>
                                        <li>Je begint met een eigen vermogen van ${formatBedrag(startEigenVermogen)}</li>
                                        <li>Bij een LTV van ${(ltv * 100).toFixed(0)}% kun je vastgoed kopen met een waarde van ${formatBedrag(jaar.vastgoedwaarde || 0)}</li>
                                        <li>Berekening: Eigen vermogen / (1 - LTV) = ${formatBedrag(startEigenVermogen)} / (1 - ${ltv}) = ${formatBedrag(jaar.vastgoedwaarde || 0)}</li>
                                        <li>Hypotheek: ${formatBedrag(jaar.hypotheek || 0)} (${(ltv * 100).toFixed(0)}% van de vastgoedwaarde)</li>
                                        <li>Aantal panden: ${jaar.aantalPanden || 0} (Vastgoedwaarde / Gemiddelde pandwaarde = ${formatBedrag(jaar.vastgoedwaarde || 0)} / ${formatBedrag(pandwaarde)})</li>
                                    </ul>
                                `;
                            } else {
                                // Controle of dit een aankoopmoment was
                                const isAankoopmoment = jaar.jaar > 0 && ((jaar.jaar - 1) * 12) % aankoopFrequentie === 0;
                                const pandwaardeMetStijging = pandwaarde * Math.pow(1 + waardestijging, jaar.jaar);
                                const vorigJaar = projectie[index - 1];
                                
                                // Bepaal of er nieuwe panden zijn gekocht
                                const nieuwePanden = jaar.aantalPanden - vorigJaar.aantalPanden;
                                const extraHypotheek = jaar.hypotheek - vorigJaar.hypotheek;
                                
                                // Berekeningen voor inkomsten en kosten
                                const huurStijgingFactor = jaar.jaar === 1 ? 1 : Math.pow(1 + huurstijging, jaar.jaar - 1);
                                const huurPerPand = pandwaarde * huurrendement * huurStijgingFactor;
                                const kostenPerPand = pandwaarde * kostenPercentage;
                                const hypotheekLastenPerPand = (pandwaarde * ltv) * rentePercentage;
                                const nettoPerPand = huurPerPand - kostenPerPand - hypotheekLastenPerPand;
                                
                                // Berekening voor minimaal inkomen
                                const minimaalInkomenDitJaar = jaar.jaar === 1 ? 
                                    minimaalInkomen : 
                                    minimaalInkomen * Math.pow(1 + minimaalInkomenInflatie, jaar.jaar - 1);
                                
                                beschrijving = `
                                    <p><strong>Jaar ${jaar.jaar} - Overzicht:</strong></p>
                                    
                                    ${jaar.inleg > 0 ? `<p>In dit jaar is er een extra inleg van ${formatBedrag(jaar.inleg)}.</p>` : ''}
                                    
                                    <p><strong>Vastgoedportefeuille:</strong></p>
                                    <ul>
                                        <li>Aankoopmoment: ${isAankoopmoment ? 'Ja' : 'Nee'}</li>
                                        <li>Aantal panden: ${jaar.aantalPanden} ${nieuwePanden > 0 ? `(+${nieuwePanden} nieuwe panden)` : ''}</li>
                                        <li>Gemiddelde pandwaarde: ${formatBedrag(pandwaardeMetStijging)} (stijging van ${(waardestijging*100).toFixed(1)}%)</li>
                                        <li>Totale vastgoedwaarde: ${formatBedrag(jaar.vastgoedwaarde)} (vorig jaar: ${formatBedrag(vorigJaar.vastgoedwaarde)})</li>
                                        <li>Waardestijging dit jaar: ${formatBedrag(jaar.overwaarde || 0)}</li>
                                    </ul>
                                    
                                    <p><strong>Hypotheek en vermogen:</strong></p>
                                    <ul>
                                        <li>Totale hypotheek: ${formatBedrag(jaar.hypotheek)} ${extraHypotheek > 0 ? `(+${formatBedrag(extraHypotheek)} voor nieuwe panden)` : ''}</li>
                                        <li>Eigen vermogen in vastgoed: ${formatBedrag(jaar.vastgoedwaarde - jaar.hypotheek)}</li>
                                        ${jaar.cumulatieveExtraInleg > 0 ? `<li>Nog niet geïnvesteerde extra inleg: ${formatBedrag(jaar.cumulatieveExtraInleg)}</li>` : ''}
                                        ${jaar.nietGebruikteCashflow > 0 ? `<li>Niet-gebruikte cashflow: ${formatBedrag(jaar.nietGebruikteCashflow)}</li>` : ''}
                                        <li>Totaal eigen vermogen: ${formatBedrag(jaar.eigenVermogen)}</li>
                                    </ul>
                                    
                                    <p><strong>Inkomsten, kosten en cashflow berekening:</strong></p>
                                    
                                    <p><u>1. INKOMSTEN (Huur)</u></p>
                                    <ul>
                                        ${jaar.jaar > 1 ? 
                                        `<li>Huurstijgingsfactor: ${(huurstijging * 100).toFixed(1)}% per jaar, cumulatief na ${jaar.jaar-1} jaar: ${(huurStijgingFactor * 100).toFixed(2)}%</li>
                                        <li>Formule: Vastgoedwaarde × Huurrendement × (1 + Huurstijging)^(jaar-1)</li>` :
                                        `<li>In jaar 1 is er nog geen cumulatieve huurstijging, dus factor = 1</li>
                                        <li>Formule: Vastgoedwaarde × Huurrendement</li>`}
                                        <li>Berekening: ${formatBedrag(jaar.vastgoedwaarde)} × ${(huurrendement * 100).toFixed(1)}% ${jaar.jaar > 1 ? `× ${huurStijgingFactor.toFixed(4)}` : ''} = ${formatBedrag(jaar.vastgoedwaarde * huurrendement * huurStijgingFactor)}</li>
                                        <li><strong>Totale huurinkomsten: ${formatBedrag(jaar.vastgoedwaarde * huurrendement * huurStijgingFactor)} per jaar</strong></li>
                                    </ul>
                                    
                                    <p><u>2. KOSTEN</u></p>
                                    <ul>
                                        <li>Onderhoudskosten: ${formatBedrag(jaar.vastgoedwaarde * kostenPercentage)} per jaar (${(kostenPercentage * 100).toFixed(1)}% van vastgoedwaarde)</li>
                                        <li>Hypotheeklasten: ${formatBedrag(jaar.hypotheek * rentePercentage)} per jaar (${(rentePercentage * 100).toFixed(1)}% rente)</li>
                                        <li><strong>Totale kosten: ${formatBedrag((jaar.vastgoedwaarde * kostenPercentage) + (jaar.hypotheek * rentePercentage))} per jaar</strong></li>
                                    </ul>
                                    
                                    <p><u>3. NETTO INKOMEN (Inkomsten - Kosten)</u></p>
                                    <ul>
                                        <li>Formule: Huurinkomsten - Onderhoudskosten - Hypotheeklasten</li>
                                        <li>Berekening: ${formatBedrag(jaar.vastgoedwaarde * huurrendement * huurStijgingFactor)} - ${formatBedrag(jaar.vastgoedwaarde * kostenPercentage)} - ${formatBedrag(jaar.hypotheek * rentePercentage)} = ${formatBedrag(jaar.nettoInkomen || 0)}</li>
                                        <li><strong>Netto inkomen: ${formatBedrag(jaar.nettoInkomen || 0)} per jaar (${formatBedrag(jaar.nettoInkomen / 12)} per maand)</strong></li>
                                    </ul>
                                    
                                    <p><u>4. CASHFLOW (Netto Inkomen - Minimaal benodigd inkomen)</u></p>
                                    <ul>
                                        <li>Minimaal benodigd inkomen: ${formatBedrag(minimaalInkomenDitJaar * 12)} per jaar (${formatBedrag(minimaalInkomenDitJaar)} per maand)</li>
                                        <li>Formule: Netto inkomen - Minimaal benodigd inkomen</li>
                                        <li>Berekening: ${formatBedrag(jaar.nettoInkomen || 0)} - ${formatBedrag(minimaalInkomenDitJaar * 12)} = ${formatBedrag(jaar.cashflowDitJaar || 0)}</li>
                                        <li><strong>Beschikbare cashflow: ${formatBedrag(jaar.cashflowDitJaar || 0)} per jaar</strong></li>
                                        ${jaar.cashflowGebruiktVoorVastgoed > 0 ? `<li>Hiervan is ${formatBedrag(jaar.cashflowGebruiktVoorVastgoed)} gebruikt voor de aankoop van vastgoed</li>` : ''}
                                        ${jaar.overwaardeGebruiktVoorVastgoed > 0 ? `<li>Daarnaast is ${formatBedrag(jaar.overwaardeGebruiktVoorVastgoed)} aan overwaarde vrijgemaakt via herfinanciering voor vastgoedaankoop</li>` : ''}
                                    </ul>
                                    
                                    <p><strong>Rendement:</strong></p>
                                    <ul>
                                        <li>ROE (Return on Equity): ${jaar.roe ? `${jaar.roe.toFixed(1)}%` : '-'}</li>
                                        <li>Totaal rendement (incl. waardestijging): ${jaar.totaalRendement ? `${jaar.totaalRendement.toFixed(1)}%` : '-'}</li>
                                    </ul>
                                    
                                    ${nieuwePanden > 0 ? `
                                    <p><strong>Toelichting aankoop nieuwe panden:</strong></p>
                                    <ul>
                                        <li>Aangekocht: ${nieuwePanden} nieuwe panden voor in totaal ${formatBedrag(nieuwePanden * pandwaardeMetStijging)}</li>
                                        <li>Gefinancierd met:</li>
                                        <ul>
                                            <li>Hypotheek: ${formatBedrag(extraHypotheek)} (${(ltv * 100).toFixed(0)}%)</li>
                                            <li>Eigen vermogen: ${formatBedrag(nieuwePanden * pandwaardeMetStijging - extraHypotheek)}</li>
                                            ${jaar.cashflowGebruiktVoorVastgoed > 0 ? `<li>Waarvan uit cashflow: ${formatBedrag(jaar.cashflowGebruiktVoorVastgoed)}</li>` : ''}
                                            ${jaar.inleg > 0 ? `<li>Waarvan uit extra inleg: ${formatBedrag(jaar.inleg)}</li>` : ''}
                                            ${jaar.overwaarde > 0 ? `<li>Waarvan uit overwaarde: ${formatBedrag(jaar.overwaarde)}</li>` : ''}
                                        </ul>
                                    </ul>
                                    ` : ''}
                                `;
                            }
                            
                            jaarDetail.innerHTML += beschrijving;
                            jaarDetailsSection.appendChild(jaarDetail);
                        }
                    });
                    
                    printContainer.appendChild(jaarDetailsSection);
                    
                    // Voeg de grafieken toe
                    const chartSection = document.createElement('div');
                    chartSection.style.marginBottom = '30px';
                    chartSection.style.pageBreakBefore = 'always';
                    
                    const chartTitle = document.createElement('h2');
                    chartTitle.textContent = 'Grafieken';
                    chartTitle.style.marginBottom = '10px';
                    chartSection.appendChild(chartTitle);
                    
                    // Kopieer de grafiekcontainer
                    const chartContainer = document.createElement('div');
                    chartContainer.style.display = 'flex';
                    chartContainer.style.flexDirection = 'column';
                    chartContainer.style.gap = '20px';
                    
                    // Haal canvas elementen op
                    const vermogensgroeiCanvas = document.getElementById('vermogensgroeiChart');
                    const inkomenCanvas = document.getElementById('inkomenChart');
                    
                    if (vermogensgroeiCanvas) {
                        const vermogensgroeiWrapper = document.createElement('div');
                        vermogensgroeiWrapper.style.marginBottom = '20px';
                        
                        const vermogensgroeiTitle = document.createElement('h3');
                        vermogensgroeiTitle.textContent = 'Vermogensgroei';
                        vermogensgroeiTitle.style.marginBottom = '10px';
                        vermogensgroeiWrapper.appendChild(vermogensgroeiTitle);
                        
                        // Creëer een afbeelding van de grafiek
                        const vermogensgroeiImg = document.createElement('img');
                        vermogensgroeiImg.src = vermogensgroeiCanvas.toDataURL('image/png');
                        vermogensgroeiImg.style.width = '100%';
                        vermogensgroeiImg.style.maxHeight = '300px';
                        vermogensgroeiWrapper.appendChild(vermogensgroeiImg);
                        
                        chartContainer.appendChild(vermogensgroeiWrapper);
                    }
                    
                    if (inkomenCanvas) {
                        const inkomenWrapper = document.createElement('div');
                        inkomenWrapper.style.marginBottom = '20px';
                        
                        const inkomenTitle = document.createElement('h3');
                        inkomenTitle.textContent = 'Netto Maandinkomen';
                        inkomenTitle.style.marginBottom = '10px';
                        inkomenWrapper.appendChild(inkomenTitle);
                        
                        // Creëer een afbeelding van de grafiek
                        const inkomenImg = document.createElement('img');
                        inkomenImg.src = inkomenCanvas.toDataURL('image/png');
                        inkomenImg.style.width = '100%';
                        inkomenImg.style.maxHeight = '300px';
                        inkomenWrapper.appendChild(inkomenImg);
                        
                        chartContainer.appendChild(inkomenWrapper);
                    }
                    
                    chartSection.appendChild(chartContainer);
                    printContainer.appendChild(chartSection);
                }
                
                // Plaats de printcontainer in het document
                document.body.appendChild(printContainer);
                
                // Configuratie voor html2pdf
                const pdfOptions = {
                    margin: 10,
                    filename: 'vastgoed-projectie-rapport.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
                };
                
                // Genereer de PDF
                html2pdf().from(printContainer).set(pdfOptions).save().then(() => {
                    // Verwijder de tijdelijke container en toon de export knop weer
                    document.body.removeChild(printContainer);
                    if (exportPdfBtn) exportPdfBtn.style.display = 'block';
                });
            }
        });