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
        let formula = "";

        switch (shape) {
            case "rectangle":
                let length = parseFloat(inputs[0].value) || 0;
                let width = parseFloat(inputs[1].value) || 0;
                area = length * width * 0.3025;
                formula = `(${length} × ${width}`;
                break;

            case "triangle":
                let base = parseFloat(inputs[0].value) || 0;
                let height = parseFloat(inputs[1].value) || 0;
                area = (base * height * 0.5) * 0.3025;
                formula = `(${base} × ${height} ÷ 2`;
                break;

            case "circle":
                let radius = parseFloat(inputs[0].value) || 0;
                area = (3.14 * radius ** 2) * 0.3025;
                formula = `(3.14 × ${radius}²`;
                break;

            case "sector":
                let radiusSector = parseFloat(inputs[0].value) || 0;
                let angle = parseFloat(inputs[1].value) || 0;
                area = ((3.14 * radiusSector ** 2 * angle) / 360) * 0.3025;
                formula = `(3.14 × ${radiusSector}² × ${angle} ÷ 360`;
                break;

            case "trapezoid":
                let base1 = parseFloat(inputs[0].value) || 0;
                let base2 = parseFloat(inputs[1].value) || 0;
                let heightT = parseFloat(inputs[2].value) || 0;
                area = (((base1 + base2) * heightT) / 2) * 0.3025;
                formula = `(${base1} + ${base2}) × ${heightT} ÷ 2`;
                break;
        }

        // 加入數量到公式中
        if (quantity > 1) {
            formula += ` × ${quantity}`;
        }

        formula += ` × 0.3025)`;

        area = Math.round(area * 1000) / 1000;
        let totalBlockArea = area * quantity;

        block.querySelector(".area-result").textContent = area.toFixed(2);
        block.querySelector(".total-area-result").textContent = totalBlockArea.toFixed(2);

        block.setAttribute("data-formula", formula);

        updateTotal();
    }

    function updateTotal() {
        let totalArea = 0;
        let formulas = [];

        areaBlocks.forEach((block) => {
            let area = parseFloat(block.querySelector(".total-area-result").textContent) || 0;
            if (area > 0) {
                let formula = block.getAttribute("data-formula");
                formulas.push(formula);
                totalArea += area;
            }
        });

        totalArea = Math.round(totalArea * 100) / 100;
        totalAreaDisplay.textContent = `總坪數：${totalArea.toFixed(2)} 坪`;
        totalFormula.textContent = formulas.length > 0 ? `計算式：${formulas.join(" + ")} = ${totalArea.toFixed(2)}` : "";
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
            <p>單個面積：<span class="area-result">0.00</span></p>
            <p>合計面積：<span class="total-area-result">0.00</span></p>
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
