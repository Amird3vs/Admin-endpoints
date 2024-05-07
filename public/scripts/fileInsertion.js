document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('authenticatedUsername');
    const userParagraph = document.getElementById('authenticatedUser');

    if (userParagraph && username) {
        userParagraph.textContent = username;
    } else {
        console.log('Authenticated username not found.');
    }

});

function addVideo() {
    const title = document.getElementById('videoInput').value.trim();
    const url = document.getElementById('videoInput2').value.trim();

    if (!title || !url) {
        swal.fire({
            title: 'Error',
            text: 'Please enter both title and preview link.',
            icon: 'error',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    fetch('/add-video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, url })
    })
        .then(response => {
            if (response.ok) {
                swal.fire({
                    title: 'Success',
                    text: 'Video added successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                document.getElementById('videoInput').value = '';
                document.getElementById('videoInput2').value = '';
            } else {
                swal.fire({
                    title: 'Error',
                    text: 'Failed to add video. Please try again.',
                    icon: 'error',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        })
        .catch(error => {
            console.error('Error adding video:', error);
            swal.fire({
                title: 'Error',
                text: 'An error occurred while adding the video. Please try again later.',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false
            });
        });
}

function addPDF() {
    const title = document.getElementById('pdfInput').value.trim();
    const url = document.getElementById('pdfInput2').value.trim();

    if (!title || !url) {
        swal.fire({
            title: 'Error',
            text: 'Please enter both title and preview link.',
            icon: 'error',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    fetch('/add-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, url })
    })
        .then(response => {
            if (response.ok) {
                swal.fire({
                    title: 'Success',
                    text: 'PDF added successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                document.getElementById('pdfInput').value = '';
                document.getElementById('pdfInput2').value = '';
            } else {
                swal.fire({
                    title: 'Error',
                    text: 'Failed to add PDF. Please try again.',
                    icon: 'error',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        })
        .catch(error => {
            console.error('Error adding PDF:', error);
            swal.fire({
                title: 'Error',
                text: 'An error occurred while adding the PDF. Please try again later.',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false
            });
        });
}

function addPPT() {
    const title = document.getElementById('pptInput').value.trim();
    const url = document.getElementById('pptInput2').value.trim();

    if (!title || !url) {
        swal.fire({
            title: 'Error',
            text: 'Please enter both title and preview link.',
            icon: 'error',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    fetch('/add-ppt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, url })
    })
        .then(response => {
            if (response.ok) {
                swal.fire({
                    title: 'Success',
                    text: 'PPT added successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                document.getElementById('pptInput').value = '';
                document.getElementById('pptInput2').value = '';
            } else {
                swal.fire({
                    title: 'Error',
                    text: 'Failed to add PPT. Please try again.',
                    icon: 'error',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        })
        .catch(error => {
            console.error('Error adding PDF:', error);
            swal.fire({
                title: 'Error',
                text: 'An error occurred while adding the PPT. Please try again later.',
                icon: 'error',
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