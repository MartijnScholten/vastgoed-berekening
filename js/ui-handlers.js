  document.addEventListener('DOMContentLoaded', function () {
            // Input elementen selecteren
            const eigenVermogenInput = document.getElementById('eigenVermogen');
            const ltvInput = document.getElementById('ltv');
            const rentePercentageInput = document.getElementById('rentePercentage');
            const vennootschapsbelastingInput = document.getElementById('vennootschapsbelasting');
            const rentePriveInput = document.getElementById('rentePrive');
            const structuurSelect = document.getElementById('structuur');
            const holdingInstellingen = document.getElementById('holdingInstellingen');

            // Vermogensgroei input elementen
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
            const inkomenHerinvesteringInput = document.getElementById('inkomenHerinvestering');
            const inkomenHerinvesteringValue = document.getElementById('inkomenHerinvesteringValue');
            const herinvesteerWaardestijgingVermogensgroeiInput = document.getElementById('herinvesteerWaardestijgingVermogensgroei');
            const comfortNiveau1Input = document.getElementById('comfortNiveau1');
            const comfortNiveau2Input = document.getElementById('comfortNiveau2');
            const comfortNiveau3Input = document.getElementById('comfortNiveau3');
            const rentePriveVermogensgroeiInput = document.getElementById('rentePriveVermogensgroei');
            const vennootschapsbelastingVermogensgroeiInput = document.getElementById('vennootschapsbelastingVermogensgroei');
            const minimaalInkomenInput = document.getElementById('minimaalInkomen');
            const minimaalInkomenInflatieInput = document.getElementById('minimaalInkomenInflatie');

            // Laad opgeslagen waarden voor scenario tab
            const scenarioWaarden = JSON.parse(localStorage.getItem('scenarioWaarden') || '{}');
            if (scenarioWaarden.eigenVermogen) eigenVermogenInput.value = scenarioWaarden.eigenVermogen;
            if (scenarioWaarden.ltv) ltvInput.value = scenarioWaarden.ltv;
            if (scenarioWaarden.rentePercentage) rentePercentageInput.value = scenarioWaarden.rentePercentage;
            if (scenarioWaarden.vennootschapsbelasting) vennootschapsbelastingInput.value = scenarioWaarden.vennootschapsbelasting;
            if (scenarioWaarden.rentePrive) rentePriveInput.value = scenarioWaarden.rentePrive;
            if (scenarioWaarden.structuur) structuurSelect.value = scenarioWaarden.structuur;
            if (scenarioWaarden.waardestijging) document.getElementById('waardestijging').value = scenarioWaarden.waardestijging;

            // Laad opgeslagen waarden voor vermogensgroei tab
            const vermogensgroeiWaarden = JSON.parse(localStorage.getItem('vermogensgroeiWaarden') || '{}');
            if (vermogensgroeiWaarden.startEigenVermogen) startEigenVermogenInput.value = vermogensgroeiWaarden.startEigenVermogen;
            if (vermogensgroeiWaarden.pandwaarde) pandwaardeInput.value = vermogensgroeiWaarden.pandwaarde;
            if (vermogensgroeiWaarden.looptijd) looptijdVermogensgroeiInput.value = vermogensgroeiWaarden.looptijd;
            if (vermogensgroeiWaarden.structuur) structuurVermogensgroeiSelect.value = vermogensgroeiWaarden.structuur;
            if (vermogensgroeiWaarden.ltv) ltvVermogensgroeiInput.value = vermogensgroeiWaarden.ltv;
            if (vermogensgroeiWaarden.rentePercentage) rentePercentageVermogensgroeiInput.value = vermogensgroeiWaarden.rentePercentage;
            if (vermogensgroeiWaarden.huurrendement) huurrendementVermogensgroeiInput.value = vermogensgroeiWaarden.huurrendement;
            if (vermogensgroeiWaarden.huurstijging) huurstijgingVermogensgroeiInput.value = vermogensgroeiWaarden.huurstijging;
            if (vermogensgroeiWaarden.kostenPercentage) kostenPercentageVermogensgroeiInput.value = vermogensgroeiWaarden.kostenPercentage;
            if (vermogensgroeiWaarden.waardestijging) waardestijgingVermogensgroeiInput.value = vermogensgroeiWaarden.waardestijging;
            if (vermogensgroeiWaarden.inkomenHerinvestering) {
                inkomenHerinvesteringInput.value = vermogensgroeiWaarden.inkomenHerinvestering;
                inkomenHerinvesteringValue.textContent = `${vermogensgroeiWaarden.inkomenHerinvestering}%`;
            }
            if (vermogensgroeiWaarden.herinvesteerWaardestijging !== undefined) {
                herinvesteerWaardestijgingVermogensgroeiInput.checked = vermogensgroeiWaarden.herinvesteerWaardestijging;
            }
            if (vermogensgroeiWaarden.comfortNiveau1) comfortNiveau1Input.value = vermogensgroeiWaarden.comfortNiveau1;
            if (vermogensgroeiWaarden.comfortNiveau2) comfortNiveau2Input.value = vermogensgroeiWaarden.comfortNiveau2;
            if (vermogensgroeiWaarden.comfortNiveau3) comfortNiveau3Input.value = vermogensgroeiWaarden.comfortNiveau3;
            if (vermogensgroeiWaarden.rentePrive) rentePriveVermogensgroeiInput.value = vermogensgroeiWaarden.rentePrive;
            if (vermogensgroeiWaarden.vennootschapsbelasting) vennootschapsbelastingVermogensgroeiInput.value = vermogensgroeiWaarden.vennootschapsbelasting;
            if (vermogensgroeiWaarden.minimaalInkomen) minimaalInkomenInput.value = vermogensgroeiWaarden.minimaalInkomen;
            if (vermogensgroeiWaarden.minimaalInkomenInflatie) minimaalInkomenInflatieInput.value = vermogensgroeiWaarden.minimaalInkomenInflatie;

            // Laad laatste actieve tab
            const laatsteTab = localStorage.getItem('laatsteTab') || 'scenario';
            document.querySelectorAll('.tab-button').forEach(button => {
                if (button.dataset.tab === laatsteTab) {
                    button.classList.add('active');
                    document.getElementById(`${button.dataset.tab}Tab`).classList.add('active');
                } else {
                    button.classList.remove('active');
                    document.getElementById(`${button.dataset.tab}Tab`).classList.remove('active');
                }
            });

            // Initialiseer holding instellingen
            holdingInstellingen.style.display = 'none';
            holdingInstellingenVermogensgroei.style.display = 'none';

            // Tab navigatie
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContents = document.querySelectorAll('.tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    button.classList.add('active');
                    document.getElementById(`${button.dataset.tab}Tab`).classList.add('active');
                    localStorage.setItem('laatsteTab', button.dataset.tab);
                });
            });

            // Event listeners voor scenario inputs
            [eigenVermogenInput, ltvInput, rentePercentageInput, vennootschapsbelastingInput, rentePriveInput, document.getElementById('waardestijging')].forEach(input => {
                input.addEventListener('input', () => {
                    const resultaten = berekenScenarioResultaten();
                    updateCharts(resultaten);
                    updateScenarioTabel(resultaten);
                    localStorage.setItem('scenarioWaarden', JSON.stringify({
                        eigenVermogen: eigenVermogenInput.value,
                        ltv: ltvInput.value,
                        rentePercentage: rentePercentageInput.value,
                        vennootschapsbelasting: vennootschapsbelastingInput.value,
                        rentePrive: rentePriveInput.value,
                        structuur: structuurSelect.value,
                        waardestijging: document.getElementById('waardestijging').value
                    }));
                });
            });

            // Event listeners voor vermogensgroei inputs
            [startEigenVermogenInput, pandwaardeInput, looptijdVermogensgroeiInput,
             ltvVermogensgroeiInput, rentePercentageVermogensgroeiInput, huurrendementVermogensgroeiInput,
             huurstijgingVermogensgroeiInput, kostenPercentageVermogensgroeiInput, waardestijgingVermogensgroeiInput,
             herinvesteerWaardestijgingVermogensgroeiInput, comfortNiveau1Input, comfortNiveau2Input,
             comfortNiveau3Input, rentePriveVermogensgroeiInput, vennootschapsbelastingVermogensgroeiInput,
             minimaalInkomenInput, minimaalInkomenInflatieInput].forEach(input => {
                input.addEventListener('input', () => {
                    berekenVermogensgroei();
                    localStorage.setItem('vermogensgroeiWaarden', JSON.stringify({
                        startEigenVermogen: startEigenVermogenInput.value,
                        pandwaarde: pandwaardeInput.value,
                        looptijd: looptijdVermogensgroeiInput.value,
                        structuur: structuurVermogensgroeiSelect.value,
                        ltv: ltvVermogensgroeiInput.value,
                        rentePercentage: rentePercentageVermogensgroeiInput.value,
                        huurrendement: huurrendementVermogensgroeiInput.value,
                        huurstijging: huurstijgingVermogensgroeiInput.value,
                        kostenPercentage: kostenPercentageVermogensgroeiInput.value,
                        waardestijging: waardestijgingVermogensgroeiInput.value,
                        inkomenHerinvestering: inkomenHerinvesteringInput.value,
                        herinvesteerWaardestijging: herinvesteerWaardestijgingVermogensgroeiInput.checked,
                        comfortNiveau1: comfortNiveau1Input.value,
                        comfortNiveau2: comfortNiveau2Input.value,
                        comfortNiveau3: comfortNiveau3Input.value,
                        rentePrive: rentePriveVermogensgroeiInput.value,
                        vennootschapsbelasting: vennootschapsbelastingVermogensgroeiInput.value,
                        minimaalInkomen: minimaalInkomenInput.value,
                        minimaalInkomenInflatie: minimaalInkomenInflatieInput.value
                    }));
                });
            });

            // Update slider waarde display
            inkomenHerinvesteringInput.addEventListener('input', () => {
                inkomenHerinvesteringValue.textContent = `${inkomenHerinvesteringInput.value}%`;
                berekenVermogensgroei();
            });

            // Structuur wijziging handlers
            structuurSelect.addEventListener('change', () => {
                holdingInstellingen.style.display = structuurSelect.value === 'holding' ? 'block' : 'none';
                const resultaten = berekenScenarioResultaten();
                updateCharts(resultaten);
                updateScenarioTabel(resultaten);
            });

            structuurVermogensgroeiSelect.addEventListener('change', () => {
                holdingInstellingenVermogensgroei.style.display = structuurVermogensgroeiSelect.value === 'holding' ? 'block' : 'none';
                berekenVermogensgroei();
            });
      
        // Initialiseer berekeningen
            const resultaten = berekenScenarioResultaten();
            updateCharts(resultaten);
            updateScenarioTabel(resultaten);
            berekenVermogensgroei();
        });