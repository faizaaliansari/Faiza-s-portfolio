const formulaInfo = {
  sum: {
    formula: '=SUM(A1:A5)',
    calc: (nums) => nums.reduce((a, b) => a + b, 0),
    explain: (nums, result) => `SUM adds all the numbers together. Example: ${nums.join(' + ')} = ${result}`
  },
  average: {
    formula: '=AVERAGE(A1:A5)',
    calc: (nums) => nums.reduce((a, b) => a + b, 0) / nums.length,
    explain: (nums, result) => `AVERAGE calculates the mean. Example: (${nums.join(' + ')}) ÷ ${nums.length} = ${result.toFixed(2)}`
  },
  max: {
    formula: '=MAX(A1:A5)',
    calc: (nums) => Math.max(...nums),
    explain: (nums, result) => `MAX returns the largest number. Largest of [${nums.join(', ')}] = ${result}`
  },
  min: {
    formula: '=MIN(A1:A5)',
    calc: (nums) => Math.min(...nums),
    explain: (nums, result) => `MIN returns the smallest number. Smallest of [${nums.join(', ')}] = ${result}`
  },
  count: {
    formula: '=COUNT(A1:A5)',
    calc: (nums) => nums.length,
    explain: (nums, result) => `COUNT counts how many numbers are in the list. Total numbers: ${result}`
  }
};

let currentFormula = 'sum';

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFormula = tab.dataset.formula;
    document.getElementById('formulaText').textContent = formulaInfo[currentFormula].formula;
    calculate();
  });
});

function calculate() {
  const input = document.getElementById('numberInput').value.trim();
  if (!input) { document.getElementById('resultValue').textContent = '0'; return; }
  const nums = input.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  if (nums.length === 0) {
    document.getElementById('resultValue').textContent = 'Invalid';
    document.getElementById('explanationText').textContent = 'Please enter valid numbers separated by commas.';
    return;
  }
  const info = formulaInfo[currentFormula];
  const result = info.calc(nums);
  const formatted = Number.isInteger(result) ? result : result.toFixed(2);
  document.getElementById('resultValue').textContent = formatted;
  document.getElementById('formulaText').textContent = info.formula;
  document.getElementById('explanationText').textContent = info.explain(nums, result);
  const resultEl = document.getElementById('resultValue');
  resultEl.style.animation = 'none';
  setTimeout(() => { resultEl.style.animation = 'popIn 0.5s ease'; }, 10);
}

document.getElementById('calculateBtn').addEventListener('click', calculate);
document.getElementById('numberInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') calculate(); });
function loadExample(numbers) { document.getElementById('numberInput').value = numbers; calculate(); }
calculate();