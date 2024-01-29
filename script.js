const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const colorName = document.getElementById('colorName');

const colors = {
    'rgb(255, 0, 0)': 'Vermelho',
    'rgb(0, 255, 0)': 'Verde',
    'rgb(0, 0, 255)': 'Azul',
    'rgb(255, 255, 0)': 'Amarelo',
    'rgb(255, 0, 255)': 'Rosa',
    'rgb(0, 255, 255)': 'Ciano',
    'rgb(128, 0, 0)': 'Marrom',
    'rgb(128, 0, 128)': 'Roxo',
    'rgb(128, 128, 0)': 'Verde Oliva',
    'rgb(0, 128, 0)': 'Verde Escuro',
    'rgb(255, 165, 0)': 'Laranja',
    'rgb(0, 0, 0)': 'Preto',
    'rgb(255, 255, 255)': 'Branco',
};

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
}

async function takeSnapshot() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const areaSize = 20;
    const imageData = context.getImageData(centerX - areaSize / 2, centerY - areaSize / 2, areaSize, areaSize);
    const detectedColor = detectColor(imageData);

    if (colors[detectedColor]) {
        colorName.innerText = `A cor identificada é ${colors[detectedColor]}`;
        speakColor(colors[detectedColor]);
    } else {
        colorName.innerText = 'Cor desconhecida';
    }
}

function speakColor(color) {
    const speech = new SpeechSynthesisUtterance(color);
    window.speechSynthesis.speak(speech);
}

function detectColor(imageData) {
    let closestColor = null;
    let minDiff = Infinity;

    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        for (const color in colors) {
            const colorValue = color.substring(4, color.length - 1).split(',').map(Number);
            const rDiff = colorValue[0] - r;
            const gDiff = colorValue[1] - g;
            const bDiff = colorValue[2] - b;
            const totalDiff = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);

            if (totalDiff < minDiff) {
                minDiff = totalDiff;
                closestColor = color;
            }
        }
    }

    return closestColor;
}

setupCamera();

captureButton.addEventListener('click', takeSnapshot);