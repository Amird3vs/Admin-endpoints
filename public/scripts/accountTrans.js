document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('authenticatedUsername');
    const userParagraph = document.getElementById('authenticatedUser');

    if (userParagraph && username) {
        userParagraph.textContent = username;
    } else {
        console.log('Authenticated username not found.');
    }
});

function confirmTrans() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const newusername = document.getElementById('newusername').value.trim();
    const newemail = document.getElementById('newemail').value.trim();
    const newpassword = document.getElementById('newpassword').value.trim();

    if (!username || !password || !newusername || !newemail || !newpassword) {
        swal.fire({
            title: 'Error',
            text: 'Please fill in all fields.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newemail)) {
        swal.fire({
            title: 'Error',
            text: 'Please enter a valid email address.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    const data = {
        username: username,
        password: password,
        newusername: newusername,
        newemail: newemail,
        newpassword: newpassword
    };

    fetch('/accountTransfer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(data => {
            console.log(data);
            swal.fire({
                title: data.message,
                text: ' You will be logged out shortly.',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false
            });
            setTimeout(() => {
                logout();
            }, 3000);
        })
        .catch(error => {
            console.error('Error sending data:', error);
            swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        });
}

function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
}

function logout() {
    console.log('Logout function called');
    localStorage.removeItem('authenticatedUsername');
    window.location.href = '/signin';
}
