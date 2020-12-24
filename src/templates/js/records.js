
document.querySelector('#back-btn').addEventListener('click', () => {
    ipcRenderer.send('back:clicked');
});

ipcRenderer.on('records:data', (event, data) => {
    const tbody = document.querySelector('tbody');

    for (let i = 0; i < data.length; i++) {
        let row = document.createElement('tr');

        let num = document.createElement('td');
        if (i in [0, 1, 2]) {
            let svg = document.createElement('object');
            
            svg.type = "image/svg+xml";
            svg.width = 20;
            svg.height = 20;
            
            if (i == 0) {
                svg.data = "./images/gold.svg";
            } else if (i == 1) {
                svg.data = "./images/silver.svg";
            } else {
                svg.data = "./images/bronze.svg";
            }

            num.appendChild(svg);
        } else {
            num.innerText = i + 1;
        }
        row.appendChild(num);

        let nickname = document.createElement('td');
        nickname.innerText = data[i].nickname;
        row.appendChild(nickname);

        let difficulty = document.createElement('td');
        difficulty.innerText = data[i].difficulty == 0 ? "Easy" : "Hard";
        row.appendChild(difficulty);

        let score = document.createElement('td');
        score.innerText = data[i].score;
        row.appendChild(score);

        tbody.appendChild(row);
    }
});