document.addEventListener("DOMContentLoaded", function () {
    const areaContainer = document.getElementById("area-container");
    const addAreaBtn = document.getElementById("add-btn");
    const clearAllBtn = document.getElementById("clear-btn");
    const totalFormula = document.getElementById("formula");
    const totalAreaDisplay = document.getElementById("total-area");
    const copyFormulaBtn = document.getElementById("copy-btn");

    let areaBlocks = [];

    function calculateArea(block) {
        const shape = block.querySelector(".shape-select").value;
        const quantity = parseFloat(block.querySelector(".quantity").value) || 1;
        const inputs = block.querySelectorAll(".dimension");
        let area = 0;
        let formula = "";

        switch (shape) {
            case "rectangle":
                const length = parseFloat(inputs[0].value) || 0;
                const width = parseFloat(inputs[1].value) || 0;
                area = length * width;
                formula = `${length} × ${width}`;
                break;

            case "triangle":
                const base = parseFloat(inputs[0].value) || 0;
                const height = parseFloat(inputs[1].value) || 0;
                area = (base * height) / 2;
                formula = `${base} × ${height} ÷ 2`;
                break;

            case "circle":
                const radius = parseFloat(inputs[0].value) || 0;
                area = 3.14 * radius ** 2;
                formula = `3.14 × ${radius}²`;
                break;

            case "sector":
                const radiusSector = parseFloat(inputs[0].value) || 0;
                const angle = parseFloat(inputs[1].value) || 0;
                area = (3.14 * radiusSector ** 2 * angle) / 360;
                formula = `3.14 × ${radiusSector}² × ${angle} ÷ 360`;
                break;

            case "trapezoid":
                const base1 = parseFloat(inputs[0].value) || 0;
                const base2 = parseFloat(inputs[1].value) || 0;
                const heightT = parseFloat(inputs[2].value) || 0;
                area = ((base1 + base2) * heightT) / 2;
                formula = `(${base1} + ${base2}) × ${heightT} ÷ 2`;
                break;
        }

        if (quantity > 1) {
            formula += ` × ${quantity}`;
        }

        const totalM2 = area * quantity;
        const totalPing = totalM2 * 0.3025;

        block.querySelector(".area-result-m2").textContent = area.toFixed(2);
        block.querySelector(".area-result-ping").textContent = (area * 0.3025).toFixed(2);
        block.querySelector(".total-area-m2").textContent = totalM2.toFixed(2);
        block.querySelector(".total-area-ping").textContent = totalPing.toFixed(2);

        block.setAttribute("data-formula", formula);
        block.setAttribute("data-m2", totalM2);

        updateTotal();
    }

    function updateTotal() {
        let totalPing = 0;
        let totalM2 = 0;
        const formulas = [];

        areaBlocks.forEach(block => {
            const blockPing = parseFloat(block.querySelector(".total-area-ping").textContent) || 0;
            const blockM2 = parseFloat(block.getAttribute("data-m2")) || 0;
            const formula = block.getAttribute("data-formula");

            if (blockPing > 0 && formula) {
                formulas.push(formula);
                totalPing += blockPing;
                totalM2 += blockM2;
            }
        });

        totalPing = Math.round(totalPing * 100) / 100;
        totalM2 = Math.round(totalM2 * 100) / 100;

        totalAreaDisplay.textContent = `總坪數：${totalPing.toFixed(2)} 坪`;
        totalFormula.textContent = formulas.length > 0
            ? `計算式：${formulas.join(" + ")} = ${totalM2.toFixed(2)} m² = ${totalPing.toFixed(2)} 坪`
            : "";
    }

    function addAreaBlock() {
        const block = document.createElement("div");
        block.classList.add("area-block");

        block.innerHTML = `
            <button class="delete-area">✖</button>
            <h4 class="block-title"></h4>
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
        updateBlockTitles();

        block.querySelector(".shape-select").addEventListener("change", () => updateInputFields(block));
        block.querySelector(".quantity").addEventListener("input", () => calculateArea(block));
        block.querySelector(".delete-area").addEventListener("click", () => {
            block.remove();
            areaBlocks = areaBlocks.filter(b => b !== block);
            updateBlockTitles();
            updateTotal();
        });

        block.addEventListener("input", () => calculateArea(block));
    }

    function updateBlockTitles() {
        areaBlocks.forEach((block, index) => {
            const title = block.querySelector(".block-title");
            title.textContent = `計算區塊 ${index + 1}`;
        });
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
        const shape = block.querySelector(".shape-select").value;
        const inputFields = block.querySelector(".input-fields");
        inputFields.innerHTML = "";

        const shapeInputs = {
            rectangle: ['長', '寬'],
            triangle: ['底', '高'],
            circle: ['半徑'],
            sector: ['半徑', '角度'],
            trapezoid: ['上底', '下底', '高']
        };

        shapeInputs[shape].forEach(placeholder => {
            const input = document.createElement("input");
            input.type = "number";
            input.className = "dimension";
            input.placeholder = placeholder;
            input.inputMode = "decimal";
            input.addEventListener("input", () => calculateArea(block));
            inputFields.appendChild(input);
        });

        calculateArea(block);
    }

    // 初始化按鈕事件
    addAreaBtn.addEventListener("click", addAreaBlock);
    clearAllBtn.addEventListener("click", clearAll);
    copyFormulaBtn.addEventListener("click", copyFormula);
});
