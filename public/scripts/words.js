document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('authenticatedUsername');
    const userParagraph = document.getElementById('authenticatedUser');

    if (userParagraph && username) {
        userParagraph.textContent = username;
    } else {
        console.log('Authenticated username not found.');
    }

});

var editButton = document.getElementById("editButton");
var saveChangesBtn = document.getElementById("saveChangesBtn");

fetch('Phrases.txt')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        const rows = data.trim().match(/"(\d+)":\s*{\s*"([^"]+)":\s*"([^"]+)"/g);
        if (!rows) {
            throw new Error('Invalid file format');
        }

        const tableBody = document.getElementById('tableBody');
        rows.forEach(row => {
            const matches = row.match(/"(\d+)":\s*{\s*"([^"]+)":\s*"([^"]+)"/);
            if (matches && matches.length === 4) {
                const id = matches[1];
                const key = matches[2];
                const value = matches[3];

                const tr = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = id;
                tr.appendChild(idCell);

                const keyCell = document.createElement('td');
                keyCell.textContent = key;
                tr.appendChild(keyCell);

                const valueCell = document.createElement('td');
                valueCell.textContent = value;
                tr.appendChild(valueCell);

                const actionsCell = document.createElement('td');
                actionsCell.classList.add('actionsCell');

                const editButton = document.createElement('button');
                editButton.classList.add('actionButton', 'editButton');
                editButton.innerHTML = '<i class="fas fa-edit"></i>';
                editButton.onclick = function () {
                    document.getElementById("idInput").value = id;
                    document.getElementById("keyInput").value = key;
                    document.getElementById("valueInput").value = value;
                    $('#exampleModalCenter').modal('show');
                };
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('actionButton', 'deleteButton');
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteButton.onclick = function () {
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            deleteTranslation(id);
                        } else {
                            Swal.fire({
                                text: "Your translation is safe!",
                                icon: "info",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    });
                };
                actionsCell.appendChild(deleteButton);

                tr.appendChild(actionsCell);

                tableBody.appendChild(tr);
            }
        });
    })
    .catch(error => {
        console.error('Error reading the file:', error);
    });

document.getElementById('saveChangesBtn').addEventListener('click', function () {
    const id = document.getElementById('idInput').value;
    const key = document.getElementById('keyInput').value;
    const value = document.getElementById('valueInput').value;

    console.log('Sending data to server:', { id, key, value });

    fetch(`/edit-translation/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, key, value }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Response from server:', data);
            Swal.fire({
                title: 'Success',
                text: data.message,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                allowOutsideClick: false,
            }).then(() => {
                location.reload();
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while processing your request.',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false,
                allowOutsideClick: false,
            });
        });
});

function deleteTranslation(id) {
    fetch(`/delete-translation/${id}`, {
        method: 'POST',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                location.reload();
            });
        })
        .catch(error => {
            console.error('Error deleting translation:', error);
            alert('Error deleting translation: ' + error.message);
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