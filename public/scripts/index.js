document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('authenticatedUsername');
    const userParagraph = document.getElementById('authenticatedUser');

    if (userParagraph && username) {
        userParagraph.textContent = username;
    } else {
        console.log('Authenticated username not found.');
    }

    countAllNumbers();
    display10first();
});

function countAllNumbers() {
    fetch('Phrases.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const regex = /"\d+":/g;
            const numbers = data.match(regex);
            const totalNumberCount = numbers ? numbers.length : 0;

            const dashboardAmount = document.querySelector('.Dashboard-amount');

            const duration = 500;

            const increment = Math.ceil(totalNumberCount / duration);

            let count = 0;
            const intervalId = setInterval(() => {
                count++;
                dashboardAmount.textContent = count;
                if (count === totalNumberCount) {
                    clearInterval(intervalId);
                }
            }, 1);
        })
        .catch(error => {
            console.error('Error reading the file:', error);
        });
}

function display10first() {
    fetch('Phrases.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const jsonData = JSON.parse(data);
            const tableBody = document.getElementById('tableBody');
            Object.keys(jsonData).slice(0, 8).forEach(key => {
                const phrase = jsonData[key];
                const keyText = Object.keys(phrase)[0];
                const valueText = phrase[keyText];

                const tr = document.createElement('tr');

                const keyCell = document.createElement('td');
                keyCell.textContent = keyText;
                tr.appendChild(keyCell);

                const valueCell = document.createElement('td');
                valueCell.textContent = valueText;
                tr.appendChild(valueCell);

                tableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error reading the file:', error);
        });
}

function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
}

function logout() {
    localStorage.removeItem('authenticatedUsername');
    window.location.href = '/signin';
}