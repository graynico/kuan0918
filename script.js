document.addEventListener("DOMContentLoaded", function () {
    const areaContainer = document.getElementById("area-container");
    const addAreaBtn = document.getElementById("add-btn");
    const clearAllBtn = document.getElementById("clear-btn");
    const totalFormula = document.getElementById("formula");
    const totalAreaDisplay = document.getElementById("total-area");
    const copyFormulaBtn = document.getElementById("copy-btn");

    let areaBlocks = [];

    function calculateArea(block) {
        let shape = block.querySelector(".shape-select").value;
        let quantity = parseFloat(block.querySelector(".quantity").value) || 1;
        let inputs = block.querySelectorAll(".dimension");
        let area = 0;
        let baseFormula = "";

        switch (shape) {
            case "rectangle":
                let length = parseFloat(inputs[0].value) || 0;
                let width = parseFloat(inputs[1].value) || 0;
                baseFormula = `${length} × ${width}`;
                area = length * width;
                break;

            case "triangle":
                let base = parseFloat(inputs[0].value) || 0;
                let height = parseFloat(inputs[1].value) || 0;
                baseFormula = `${base} × ${height} ÷ 2`;
                area = (base * height) / 2;
                break;

            case "circle":
                let radius = parseFloat(inputs[0].value) || 0;
                baseFormula = `3.14 × ${radius}²`;
                area = 3.14 * radius ** 2;
                break;

            case "sector":
                let radiusSector = parseFloat(inputs[0].value) || 0;
                let angle = parseFloat(inputs[1].value) || 0;
                baseFormula = `3.14 × ${radiusSector}² × ${angle} ÷ 360`;
                area = (3.14 * radiusSector ** 2 * angle) / 360;
                break;

            case "trapezoid":
                let base1 = parseFloat(inputs[0].value) || 0;
                let base2 = parseFloat(inputs[1].value) || 0;
                let heightT = parseFloat(inputs[2].value) || 0;
                baseFormula = `(${base1} + ${base2}) × ${heightT} ÷ 2`;
                area = ((base1 + base2) * heightT) / 2;
                break;
        }

        const singleArea = area;
        const areaPerPing = singleArea * 0.3025;
        const totalArea = area * quantity;
        const totalAreaInPing = totalArea * 0.3025;

        if (quantity > 1) {
            baseFormula += ` × ${quantity}`;
        }

block.querySelector(".area-result-m2").textContent = singleArea.toFixed(2);
block.querySelector(".area-result-ping").textContent = areaPerPing.toFixed(2);
block.querySelector(".total-area-m2").textContent = totalArea.toFixed(2);
block.querySelector(".total-area-ping").textContent = totalAreaInPing.toFixed(2);


        block.setAttribute("data-formula", baseFormula);
        block.setAttribute("data-raw-area", totalArea);

        updateTotal();
    }

    function updateTotal() {
        let totalPing = 0;
        let totalRawArea = 0;
        let formulaParts = [];

        areaBlocks.forEach((block) => {
            let areaPing = parseFloat(block.querySelector(".total-area-ping").textContent) || 0;
            let rawArea = parseFloat(block.getAttribute("data-raw-area")) || 0;
            let formula = block.getAttribute("data-formula");

            if (areaPing > 0 && formula) {
                formulaParts.push(formula);
                totalPing += areaPing;
                totalRawArea += rawArea;
            }
        });

        totalPing = Math.round(totalPing * 100) / 100;
        totalRawArea = Math.round(totalRawArea * 100) / 100;

        totalAreaDisplay.textContent = `總坪數：${totalPing.toFixed(2)} 坪`;
        totalFormula.textContent = formulaParts.length > 0
            ? `計算式：${formulaParts.join(" + ")} = ${totalRawArea.toFixed(2)}m² = ${totalPing.toFixed(2)}`
            : "";
    }

    function addAreaBlock() {
        let blockIndex = areaBlocks.length + 1;
        let block = document.createElement("div");
        block.classList.add("area-block");
        block.innerHTML = `
            <button class="delete-area">✖</button>
            <h4>計算區塊 ${blockIndex}</h4>
            <select class="shape-select">
                <option value="rectangle">矩形</option>
                <option value="triangle">三角形</option>
                <option value="circle">圓形</option>
                <option value="sector">扇形</option>
                <option value="trapezoid">梯形</option>
            </select>
            <div class="input-fields"></div>
            <label>數量：</label><input type="number" class="quantity" min="1" max="10" value="1" inputmode="decimal">
            <div class="area-row">
                <p>單個面積(m²)：<span class="area-result-m2">0.00</span></p>
                <p>單個面積(坪)：<span class="area-result-ping">0.00</span></p>
            </div>
            <div class="area-row">
                <p>合計面積(m²)：<span class="total-area-m2">0.00</span></p>
                <p>合計面積(坪)：<span class="total-area-ping">0.00</span></p>
            </div>
        `;

        areaContainer.appendChild(block);
        areaBlocks.push(block);

        updateInputFields(block);
        block.querySelector(".shape-select").addEventListener("change", () => updateInputFields(block));
        block.querySelector(".quantity").addEventListener("input", () => calculateArea(block));
        block.querySelector(".delete-area").addEventListener("click", () => removeBlock(block));
        block.addEventListener("input", () => calculateArea(block));
    }

    function removeBlock(block) {
        areaBlocks = areaBlocks.filter(b => b !== block);
        block.remove();
        updateTotal();
    }

    function clearAll() {
        areaBlocks.forEach(block => block.remove());
        areaBlocks = [];
        updateTotal();
    }

    function copyFormula() {
        if (totalFormula.textContent) {
            navigator.clipboard.writeText(totalFormula.textContent).then(() => {
                alert("計算式已複製！");
            });
        }
    }

    function updateInputFields(block) {
        let shape = block.querySelector(".shape-select").value;
        let inputFields = block.querySelector(".input-fields");
        inputFields.innerHTML = "";

        let inputsHTML = {
            rectangle: '<input type="number" class="dimension" placeholder="長" inputmode="decimal"> <input type="number" class="dimension" placeholder="寬" inputmode="decimal">',
            triangle: '<input type="number" class="dimension" placeholder="底" inputmode="decimal"> <input type="number" class="dimension" placeholder="高" inputmode="decimal">',
            circle: '<input type="number" class="dimension" placeholder="半徑" inputmode="decimal">',
            sector: '<input type="number" class="dimension" placeholder="半徑" inputmode="decimal"> <input type="number" class="dimension" placeholder="角度" inputmode="decimal">',
            trapezoid: '<input type="number" class="dimension" placeholder="上底" inputmode="decimal"> <input type="number" class="dimension" placeholder="下底" inputmode="decimal"> <input type="number" class="dimension" placeholder="高" inputmode="decimal">'
        };

        inputFields.innerHTML = inputsHTML[shape];
        block.querySelectorAll(".dimension").forEach(input => input.addEventListener("input", () => calculateArea(block)));
    }

    addAreaBtn.addEventListener("click", addAreaBlock);
    clearAllBtn.addEventListener("click", clearAll);
    copyFormulaBtn.addEventListener("click", copyFormula);
});
