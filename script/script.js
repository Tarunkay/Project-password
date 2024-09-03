const passwordDisplay = document.querySelector('.password-display');
const passwordCopyButton = document.querySelector('.copy-btn');
const passwordForm = document.querySelector('.password-settings');
const lengthSlider = document.querySelector('.char-length-slider');
const charCount = document.querySelector('.char-count');
const checkBoxes = document.querySelectorAll('input[type=checkbox]');
const strengthDescription = document.querySelector('.strength-rating-text');
const strengthRatingBars = document.querySelectorAll('.bar');

const CHARACTER_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '1234567890',
    symbols: '!@#$%^&*()'
};

let canCopy = false;

const updateCharCount = () => {
    charCount.textContent = lengthSlider.value;
    styleSlider();
};

const styleSlider = () => {
    const min = lengthSlider.min;
    const max = lengthSlider.max;
    const val = lengthSlider.value;
    lengthSlider.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%';
};

const resetStrengthBars = () => {
    strengthRatingBars.forEach(bar => {
        bar.style.backgroundColor = 'transparent';
        bar.style.borderColor = '#ccc';
    });
};

const setStrengthBars = (numBars, color) => {
    strengthRatingBars.forEach((bar, index) => {
        if (index < numBars) {
            bar.style.backgroundColor = color;
            bar.style.borderColor = color;
        }
    });
};

const calculateStrength = (length, poolSize) => {
    const strength = length * Math.log2(poolSize);
    if (strength < 25) return ['Too Weak!', 1, 'red'];
    if (strength < 50) return ['Weak', 2, 'orange'];
    if (strength < 75) return ['Medium', 3, 'yellow'];
    return ['Strong', 4, 'green'];
};

const generatePassword = (event) => {
    event.preventDefault();

    let charPool = '';
    let generatedPassword = '';

    checkBoxes.forEach(box => {
        if (box.checked) charPool += CHARACTER_SETS[box.value];
    });

    if (charPool.length === 0) {
        alert('Please select at least one character set.');
        return;
    }

    for (let i = 0; i < lengthSlider.value; i++) {
        generatedPassword += charPool.charAt(Math.floor(Math.random() * charPool.length));
    }

    passwordDisplay.textContent = generatedPassword;
    const [strengthText, numBars, color] = calculateStrength(lengthSlider.value, charPool.length);
    resetStrengthBars();
    setStrengthBars(numBars, color);
    strengthDescription.textContent = strengthText;
    canCopy = true;
};

const copyPassword = async () => {
    if (canCopy && passwordDisplay.textContent) {
        await navigator.clipboard.writeText(passwordDisplay.textContent);
        alert('Password copied to clipboard!');
    }
};

updateCharCount();
lengthSlider.addEventListener('input', updateCharCount);
passwordForm.addEventListener('submit', generatePassword);
passwordCopyButton.addEventListener('click', copyPassword);
