function Huffman() {
    const inputText = document.getElementById('inputText').value;

    if (!inputText.trim()) {
        alert('Please enter your text before submit.');
        return;
    }

    if (/^([a-zA-Z])\1*$/.test(inputText)) {
        alert("Text with only one character cannot be Huffman encoded.");
        return;
    }

    const { huffmanCode, freqCodeTable } = generateHuffmanCode(inputText);

    document.getElementById('output').innerText = `Your output: ${huffmanCode}`;
    displayFreqCodeTable(freqCodeTable);
}

function generateHuffmanCode(text) {
    const frequencyMap = {};
    for (const char of text) {
        frequencyMap[char] = (frequencyMap[char] || 0) + 1;
    }
    
    const priorityQueue = Object.entries(frequencyMap).map(([char, freq]) => ({ char, freq }));
    priorityQueue.sort((a, b) => a.freq - b.freq);
    
    while (priorityQueue.length > 1) {
        const [first, second] = priorityQueue.splice(0, 2);
        const newNode = { char: null, freq: first.freq + second.freq, left: first, right: second };
        priorityQueue.push(newNode);
        priorityQueue.sort((a, b) => a.freq - b.freq);
    }
    
    const huffmanTree = priorityQueue[0];
    
    const huffmanCodes = {};
    generateCodes(huffmanTree, '', huffmanCodes);
    
    const encodedText = text.split('').map(char => huffmanCodes[char]).join('');
    
    const freqCodeTable = Object.entries(frequencyMap).map(([char, freq]) => ({ char, freq, code: huffmanCodes[char] }));
    
    return { huffmanCode: encodedText, freqCodeTable };
}
    
function generateCodes(node, currentCode, codes) {
    if (node.char !== null) {
        codes[node.char] = currentCode;
        return;
    }
    
    generateCodes(node.left, currentCode + '0', codes);
    generateCodes(node.right, currentCode + '1', codes);
    }
    
function displayFreqCodeTable(tableData) {
    const tableBody = document.getElementById('freqCodeTable').getElementsByTagName('tbody')[0];
    const tableHead = document.getElementById('freqCodeTable').getElementsByTagName('thead')[0];
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    const headerRow = tableHead.insertRow();
    const headerCell1 = document.createElement('th');
    const headerCell2 = document.createElement('th');
    const headerCell3 = document.createElement('th');
    headerCell1.textContent = 'Character';
    headerCell2.textContent = 'Frequency';
    headerCell3.textContent = 'Code';
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);
    
    tableData.forEach(({ char, freq, code }) => {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.textContent = char;
        cell2.textContent = freq;
        cell3.textContent = code;
    });
}