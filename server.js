const express = require('express');
const cors = require('cors'); 
const path = require('path'); // Added so the internet can read your HTML file

const app = express();
// Added so Render can automatically assign a web port
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 

// Tells the server to host your HTML and Images on the internet
app.use(express.static(__dirname));

// MASSIVE BOOK DATABASE
const libraryDatabase = [
    { title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction", img: "https://covers.openlibrary.org/b/id/8259441-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1342/pg1342.txt", price: 499, rentPrice: 149 },
    { title: "A Tale of Two Cities", author: "Charles Dickens", category: "Fiction", img: "https://covers.openlibrary.org/b/id/10582234-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/98/pg98.txt", price: 399, rentPrice: 99 },
    { title: "Jane Eyre", author: "Charlotte Brontë", category: "Fiction", img: "https://covers.openlibrary.org/b/id/10609363-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1260/pg1260.txt", price: 599, rentPrice: 149 },
    { title: "Crime and Punishment", author: "Fyodor Dostoevsky", category: "Fiction", img: "https://covers.openlibrary.org/b/id/14418641-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/2554/pg2554.txt", price: 799, rentPrice: 249 },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde", category: "Fiction", img: "https://covers.openlibrary.org/b/id/14389656-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/174/pg174.txt", price: 599, rentPrice: 149 },
    { title: "Dracula", author: "Bram Stoker", category: "Sci-Fi & Fantasy", img: "https://covers.openlibrary.org/b/id/14414502-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/345/pg345.txt", price: 699, rentPrice: 199 },
    { title: "The Art of War", author: "Sun Tzu", category: "Science & History", img: "https://covers.openlibrary.org/b/id/12711679-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/132/pg132.txt", price: 599, rentPrice: 149 },
    { title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", category: "Mystery & Thriller", img: "https://covers.openlibrary.org/b/id/10515152-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1661/pg1661.txt", price: 799, rentPrice: 249 },
    { title: "Romeo and Juliet", author: "William Shakespeare", category: "Romance & Drama", img: "https://covers.openlibrary.org/b/id/12613615-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1112/pg1112.txt", price: 399, rentPrice: 99 }
];

const users = [];
const bookCache = {};

// When someone clicks your link, this sends them the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Index.html'));
});

app.get('/api/read', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).json({ error: "Missing book URL" });

    if (bookCache[targetUrl]) {
        return res.send(bookCache[targetUrl]);
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); 

        const response = await fetch(targetUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Failed to fetch from Gutenberg");
        const text = await response.text();
        
        bookCache[targetUrl] = text;
        res.send(text);
    } catch (err) {
        res.status(500).json({ error: "Failed to load book content." });
    }
});

app.get('/api/books', (req, res) => {
    res.json(libraryDatabase);
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password are required." });
    
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: "Username already exists." });
    }

    users.push({ username, password, library: [], favorites: [], wishlist: [] });
    res.status(201).json({ message: "Registration successful!" });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({ message: "Login successful!", username: user.username, library: user.library, favorites: user.favorites || [], wishlist: user.wishlist || [] });
    } else {
        res.status(401).json({ error: "Invalid username or password." });
    }
});

app.post('/api/checkout', (req, res) => {
    const { username, items } = req.body; 
    let user = users.find(u => u.username === username);
    
    if (!user) {
        user = { username: username, password: "auto-restored", library: [], favorites: [], wishlist: [] };
        users.push(user);
    }

    items.forEach(item => {
        const existingBookIndex = user.library.findIndex(b => b.title === item.title || b === item.title);
        if (existingBookIndex === -1) {
            user.library.push({ title: item.title, type: item.type });
        } else {
            if (item.type === 'buy') {
                user.library[existingBookIndex] = { title: item.title, type: 'buy' };
            }
        }
    });

    res.json({ message: "Checkout successful!", library: user.library });
});

app.post('/api/favorite', (req, res) => {
    const { username, title } = req.body; 
    let user = users.find(u => u.username === username);
    
    if (!user) {
        user = { username: username, password: "auto-restored", library: [], favorites: [], wishlist: [] };
        users.push(user);
    }
    
    if (!user.favorites) user.favorites = [];
    
    const index = user.favorites.indexOf(title);
    if (index === -1) {
        user.favorites.push(title);
    } else {
        user.favorites.splice(index, 1);
    }
    
    res.json({ message: "Favorites updated", favorites: user.favorites });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
