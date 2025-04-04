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
        });