document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('authenticatedUsername');
    const userParagraph = document.getElementById('authenticatedUser');

    if (userParagraph && username) {
        userParagraph.textContent = username;
    } else {
        console.log('Authenticated username not found.');
    }

});

function addTranslation() {
    const key = document.getElementById('phraseInput').value;
    const value = document.getElementById('phraseInput2').value;

    fetch('/add-translation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key, value })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.error); });
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: data.message,
                timer: 1500,
                showConfirmButton: false
            });
            document.getElementById('phraseInput').value = '';
            document.getElementById('phraseInput2').value = '';
        })
        .catch(error => {
            console.error('Error adding translation:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to add translation',
                timer: 1500,
                showConfirmButton: false
            });
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