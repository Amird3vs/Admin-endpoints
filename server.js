const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/signin', (req, res) => {
    res.render('signIn');
});

app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    const accountFilePath = path.join(__dirname, 'public', 'Account.txt');

    fs.readFile(accountFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const accounts = JSON.parse(data);

            let authenticated = false;
            let authenticatedUsername = '';

            for (const user in accounts) {
                const userInfo = accounts[user];
                if ((user === username || Object.keys(userInfo)[0] === username) && userInfo[Object.keys(userInfo)[0]] === password) {
                    authenticated = true;
                    authenticatedUsername = user;
                    break;
                }
            }

            if (authenticated) {
                return res.status(200).json({ message: 'Sign-in successful', username: authenticatedUsername });
            } else {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

app.get('/', (req, res) => {
    res.render('index', { name: 'World' });
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.get('/words', (req, res) => {
    res.render('words');
})

app.get('/fileInsertion', (req, res) => {
    res.render('fileInsertion');
})

app.get('/accounttrans', (req, res) => {
    res.render('accountTrans');
})

app.post('/add-translation', (req, res) => {
    const { key, value } = req.body;
    const filePath = path.join(__dirname, 'public', 'Phrases.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const translations = JSON.parse(data);
            const lastKey = Object.keys(translations).reduce((prev, curr) => Math.max(prev, parseInt(curr)), 0);
            if (translations.hasOwnProperty(key)) {
                return res.status(400).json({ error: 'Translation key already exists.' });
            }

            translations[lastKey + 1] = { [key]: value };

            fs.writeFile(filePath, JSON.stringify(translations, null, 4), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.json({ message: 'Translation added successfully.' });
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

app.post('/edit-translation/:id', (req, res) => {
    const { id } = req.params;
    const { key, value } = req.body;
    const filePath = path.join(__dirname, 'public', 'Phrases.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const translations = JSON.parse(data);
            if (!translations[id]) {
                return res.status(404).json({ error: 'Translation not found.' });
            }

            translations[id] = { [key]: value };

            fs.writeFile(filePath, JSON.stringify(translations, null, 4), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.json({ message: 'Translation edited successfully.' });
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

app.post('/delete-translation/:id', (req, res) => {
    const { id } = req.params;
    const filePath = path.join(__dirname, 'public', 'Phrases.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const translations = JSON.parse(data);
            if (!translations[id]) {
                return res.status(404).json({ error: 'Translation not found.' });
            }

            delete translations[id];

            fs.writeFile(filePath, JSON.stringify(translations, null, 4), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.json({ message: 'Translation deleted successfully.' });
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

app.post('/add-video', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Video.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const videoData = JSON.parse(data);

            videoData.name = req.body.title;
            videoData.url = req.body.url;

            const newData = JSON.stringify(videoData, null, 4);

            fs.writeFile(filePath, newData, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(200).json({ message: 'Video data updated successfully' });
            });
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Error parsing JSON data' });
        }
    });
});

app.post('/add-pdf', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Pdf.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const pdfData = JSON.parse(data);

            pdfData.name = req.body.title;
            pdfData.url = req.body.url;

            const newData = JSON.stringify(pdfData, null, 4);

            fs.writeFile(filePath, newData, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(200).json({ message: 'PDF data updated successfully' });
            });
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Error parsing JSON data' });
        }
    });
});

app.post('/add-ppt', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Presentation.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const pptData = JSON.parse(data);

            pptData.name = req.body.title;
            pptData.url = req.body.url;

            const newData = JSON.stringify(pptData, null, 4);

            fs.writeFile(filePath, newData, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(200).json({ message: 'Ppt data updated successfully' });
            });
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Error parsing JSON data' });
        }
    });
});

app.post('/accountTransfer', (req, res) => {
    const { username, password, newusername, newemail, newpassword } = req.body;
    const accountFilePath = path.join(__dirname, 'public', 'Account.txt');

    fs.readFile(accountFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const accounts = JSON.parse(data);

            let authenticated = false;

            for (const user in accounts) {
                const userInfo = accounts[user];

                if ((user === username || Object.keys(userInfo)[0] === username) && userInfo[Object.keys(userInfo)[0]] === password) {
                    authenticated = true;
                    break;
                }
            }

            if (authenticated) {
                if (accounts.hasOwnProperty(newusername)) {
                    accounts[newusername][newemail] = newpassword;
                } else {
                    accounts[newusername] = {
                        [newemail]: newpassword
                    };
                }

                delete accounts[username];

                fs.writeFile(accountFilePath, JSON.stringify(accounts, null, 4), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    res.status(200).json({ message: 'Admin transfer successful' });
                });
            } else {
                res.status(401).json({ error: 'Authentication failed' });
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

app.post('/send-words', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Phrases.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Error reading file' });
        }

        try {
            const phrases = JSON.parse(data);
            res.json(Object.values(phrases));
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Error parsing JSON' });
        }
    });
});

app.post('/send-video', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Video.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Error reading file' });
        }
        res.send(data);
    });
});

app.post('/send-ppt', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Presentation.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Error reading file' });
        }
        res.send(data);
    });
});

app.post('/send-pdf', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Pdf.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Error reading file' });
        }
        res.send(data);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});