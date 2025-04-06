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
    let m2Formula = "";

    switch (shape) {
        case "rectangle":
            let length = parseFloat(inputs[0].value) || 0;
            let width = parseFloat(inputs[1].value) || 0;
            area = length * width;
            m2Formula = `${length} × ${width}`;
            break;

        case "triangle":
            let base = parseFloat(inputs[0].value) || 0;
            let height = parseFloat(inputs[1].value) || 0;
            area = (base * height) / 2;
            m2Formula = `${base} × ${height} ÷ 2`;
            break;

        case "circle":
            let radius = parseFloat(inputs[0].value) || 0;
            area = 3.14 * radius ** 2;
            m2Formula = `3.14 × ${radius}²`;
            break;

        case "sector":
            let r = parseFloat(inputs[0].value) || 0;
            let angle = parseFloat(inputs[1].value) || 0;
            area = (3.14 * r ** 2 * angle) / 360;
            m2Formula = `3.14 × ${r}² × ${angle} ÷ 360`;
            break;

        case "trapezoid":
            let base1 = parseFloat(inputs[0].value) || 0;
            let base2 = parseFloat(inputs[1].value) || 0;
            let heightT = parseFloat(inputs[2].value) || 0;
            area = ((base1 + base2) * heightT) / 2;
            m2Formula = `(${base1} + ${base2}) × ${heightT} ÷ 2`;
            break;
    }

    // 加入數量到公式中
    if (quantity > 1) {
        m2Formula += ` × ${quantity}`;
    }

    let totalM2 = area * quantity;
    let totalPing = totalM2 * 0.3025;

    // 顯示單個面積（m²）和合計面積（坪）
    block.querySelector(".area-result").textContent = area.toFixed(2);
    block.querySelector(".total-area-result").textContent = totalPing.toFixed(2);

    // 儲存公式
    block.setAttribute("data-formula", m2Formula);
    block.setAttribute("data-m2", totalM2.toFixed(2));

    updateTotal();
}

 function updateTotal() {
    let totalPing = 0;
    let totalM2 = 0;
    let formulas = [];

    areaBlocks.forEach((block) => {
        let blockPing = parseFloat(block.querySelector(".total-area-result").textContent) || 0;
        let blockM2 = parseFloat(block.getAttribute("data-m2")) || 0;
        if (blockPing > 0) {
            let formula = block.getAttribute("data-formula");
            formulas.push(formula);
            totalPing += blockPing;
            totalM2 += blockM2;
        }
    });

    totalPing = Math.round(totalPing * 100) / 100;
    totalM2 = Math.round(totalM2 * 100) / 100;

    totalAreaDisplay.textContent = `總坪數：${totalPing.toFixed(2)} 坪`;
    totalFormula.textContent = formulas.length > 0
        ? `計算式：${formulas.join(" + ")} = ${totalM2.toFixed(2)}m² = ${totalPing.toFixed(2)}`
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
