const express = require('express');
const cors = require('cors'); 
const path = require('path'); // NEW: Helps find your HTML file

const app = express();
// NEW: Allows the cloud server to assign a port, or uses 3000 on your computer
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 

// NEW: Tells the server to host your images (qrcode.jpg) and HTML files
app.use(express.static(__dirname));

// MASSIVE 60-BOOK DATABASE
const libraryDatabase = [
    // --- CATEGORY 1: FICTION ---
    { title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction", img: "https://covers.openlibrary.org/b/id/8259441-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1342/pg1342.txt", price: 499, rentPrice: 149 },
    { title: "A Tale of Two Cities", author: "Charles Dickens", category: "Fiction", img: "https://covers.openlibrary.org/b/id/10582234-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/98/pg98.txt", price: 399, rentPrice: 99 },
    { title: "Jane Eyre", author: "Charlotte Brontë", category: "Fiction", img: "https://covers.openlibrary.org/b/id/10609363-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1260/pg1260.txt", price: 599, rentPrice: 149 },
    { title: "Crime and Punishment", author: "Fyodor Dostoevsky", category: "Fiction", img: "https://covers.openlibrary.org/b/id/14418641-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/2554/pg2554.txt", price: 799, rentPrice: 249 },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde", category: "Fiction", img: "https://covers.openlibrary.org/b/id/14389656-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/174/pg174.txt", price: 599, rentPrice: 149 },
    { title: "Heart of Darkness", author: "Joseph Conrad", category: "Fiction", img: "https://covers.openlibrary.org/b/id/12591605-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/219/pg219.txt", price: 399, rentPrice: 99 },
    { title: "Wuthering Heights", author: "Emily Brontë", category: "Fiction", img: "https://covers.openlibrary.org/b/id/10582238-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/768/pg768.txt", price: 499, rentPrice: 149 },
    { title: "Moby Dick", author: "Herman Melville", category: "Fiction", img: "https://covers.openlibrary.org/b/id/12613589-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/2701/pg2701.txt", price: 699, rentPrice: 199 },
    { title: "Les Misérables", author: "Victor Hugo", category: "Fiction", img: "https://covers.openlibrary.org/b/id/14421118-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/135/pg135.txt", price: 899, rentPrice: 299 },
    { title: "Great Expectations", author: "Charles Dickens", category: "Fiction", img: "https://covers.openlibrary.org/b/id/12586225-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1400/pg1400.txt", price: 599, rentPrice: 149 },

    // --- CATEGORY 2: SCI-FI & FANTASY ---
    { title: "Dracula", author: "Bram Stoker", category: "Sci-Fi & Fantasy", img: "https://covers.openlibrary.org/b/id/14414502-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/345/pg345.txt", price: 699, rentPrice: 199 },
    { title: "Frankenstein", author: "Mary W. Shelley", category: "Sci-Fi & Fantasy", img: "https://covers.openlibrary.org/b/isbn/9780486282114-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/84/pg84.txt", price: 599, rentPrice: 149 },
    { title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", category: "Sci-Fi & Fantasy", img: "https://covers.openlibrary.org/b/id/12866952-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/11/pg11.txt", price: 299, rentPrice: 99 },
    { title: "The Time Machine", author: "H. G. Wells", category: "Sci-Fi & Fantasy", img: "https://covers.openlibrary.org/b/id/12613583-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/35/pg35.txt", price: 499, rentPrice: 149 },
    { title: "Grimms' Fairy Tales", author: "Brothers Grimm", category: "Sci-Fi & Fantasy", img: "https://covers.openlibrary.org/b/id/12586222-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/2591/pg2591.txt", price: 699, rentPrice: 199 },
    { title: "Peter Pan", author: "J. M. Barrie", category: "Sci-Fi & Fantasy", img: "https://covers.openlibrary.org/b/id/12618991-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/16/pg16.txt", price: 499, rentPrice: 149 },
    { title: "Metamorphosis", author: "Franz Kafka", category: "Sci-Fi & Fantasy", img: "https://covers.openlibrary.org/b/id/13247493-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/5200/pg5200.txt", price: 399, rentPrice: 99 },
    { title: "The War of the Worlds", author: "H. G. Wells", category: "Sci-Fi & Fantasy", img: "https://covers.openlibrary.org/b/id/12613590-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/36/pg36.txt", price: 499, rentPrice: 149 },
    { title: "A Princess of Mars", author: "Edgar Rice Burroughs", category: "Sci-Fi & Fantasy", img: "https://covers.openlibrary.org/b/id/12586230-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/62/pg62.txt", price: 399, rentPrice: 99 },
    { title: "The Wonderful Wizard of Oz", author: "L. Frank Baum", category: "Sci-Fi & Fantasy", img: "https://covers.openlibrary.org/b/id/14421120-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/55/pg55.txt", price: 499, rentPrice: 149 },

    // --- CATEGORY 3: PHILOSOPHY ---
    { title: "The Prince", author: "Niccolò Machiavelli", category: "Philosophy", img: "https://covers.openlibrary.org/b/id/12596486-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1232/pg1232.txt", price: 599, rentPrice: 149 },
    { title: "Meditations", author: "Marcus Aurelius", category: "Philosophy", img: "https://covers.openlibrary.org/b/id/14421115-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/2680/pg2680.txt", price: 799, rentPrice: 249 },
    { title: "The Republic", author: "Plato", category: "Philosophy", img: "https://covers.openlibrary.org/b/isbn/9780140455113-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1497/pg1497.txt", price: 899, rentPrice: 299 },
    { title: "Beyond Good and Evil", author: "Friedrich Nietzsche", category: "Philosophy", img: "https://covers.openlibrary.org/b/isbn/9780140449235-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/4363/pg4363.txt", price: 799, rentPrice: 249 },
    { title: "Leviathan", author: "Thomas Hobbes", category: "Philosophy", img: "https://covers.openlibrary.org/b/isbn/9780140431957-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/3207/pg3207.txt", price: 999, rentPrice: 299 },
    { title: "Thus Spake Zarathustra", author: "Friedrich Nietzsche", category: "Philosophy", img: "https://covers.openlibrary.org/b/id/12613595-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1998/pg1998.txt", price: 699, rentPrice: 199 },
    { title: "Critique of Pure Reason", author: "Immanuel Kant", category: "Philosophy", img: "https://covers.openlibrary.org/b/id/12586235-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/4280/pg4280.txt", price: 899, rentPrice: 299 },
    { title: "The Social Contract", author: "Jean-Jacques Rousseau", category: "Philosophy", img: "https://covers.openlibrary.org/b/id/14421125-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/46333/pg46333.txt", price: 599, rentPrice: 149 },
    { title: "Apology", author: "Plato", category: "Philosophy", img: "https://covers.openlibrary.org/b/id/12596490-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1656/pg1656.txt", price: 399, rentPrice: 99 },
    { title: "Utilitarianism", author: "John Stuart Mill", category: "Philosophy", img: "https://covers.openlibrary.org/b/id/14421130-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/11224/pg11224.txt", price: 499, rentPrice: 149 },

    // --- CATEGORY 4: SCIENCE & HISTORY ---
    { title: "The Art of War", author: "Sun Tzu", category: "Science & History", img: "https://covers.openlibrary.org/b/id/12711679-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/132/pg132.txt", price: 599, rentPrice: 149 },
    { title: "On the Origin of Species", author: "Charles Darwin", category: "Science & History", img: "https://covers.openlibrary.org/b/isbn/9780451529060-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1228/pg1228.txt", price: 699, rentPrice: 199 },
    { title: "The Voyage of the Beagle", author: "Charles Darwin", category: "Science & History", img: "https://covers.openlibrary.org/b/isbn/9780140432688-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/944/pg944.txt", price: 599, rentPrice: 149 },
    { title: "Autobiography of Benjamin Franklin", author: "Benjamin Franklin", category: "Science & History", img: "https://covers.openlibrary.org/b/isbn/9780486290737-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/148/pg148.txt", price: 499, rentPrice: 149 },
    { title: "Relativity", author: "Albert Einstein", category: "Science & History", img: "https://covers.openlibrary.org/b/id/12613600-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/30155/pg30155.txt", price: 799, rentPrice: 249 },
    { title: "Decline and Fall of the Roman Empire", author: "Edward Gibbon", category: "Science & History", img: "https://covers.openlibrary.org/b/id/12586240-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/25717/pg25717.txt", price: 999, rentPrice: 299 },
    { title: "Utopia", author: "Thomas More", category: "Science & History", img: "https://covers.openlibrary.org/b/id/14421135-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/2130/pg2130.txt", price: 499, rentPrice: 149 },
    { title: "History of the Peloponnesian War", author: "Thucydides", category: "Science & History", img: "https://covers.openlibrary.org/b/id/12596495-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/7142/pg7142.txt", price: 699, rentPrice: 199 },
    { title: "Wealth of Nations", author: "Adam Smith", category: "Science & History", img: "https://covers.openlibrary.org/b/id/14421140-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/3300/pg3300.txt", price: 899, rentPrice: 299 },
    { title: "The Communist Manifesto", author: "Karl Marx", category: "Science & History", img: "https://covers.openlibrary.org/b/id/12613605-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/61/pg61.txt", price: 399, rentPrice: 99 },

    // --- CATEGORY 5: MYSTERY & THRILLER ---
    { title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", category: "Mystery & Thriller", img: "https://covers.openlibrary.org/b/id/10515152-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1661/pg1661.txt", price: 799, rentPrice: 249 },
    { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", category: "Mystery & Thriller", img: "https://covers.openlibrary.org/b/id/12586245-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/2852/pg2852.txt", price: 599, rentPrice: 149 },
    { title: "The Sign of the Four", author: "Arthur Conan Doyle", category: "Mystery & Thriller", img: "https://covers.openlibrary.org/b/id/14421145-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/2097/pg2097.txt", price: 499, rentPrice: 149 },
    { title: "A Study in Scarlet", author: "Arthur Conan Doyle", category: "Mystery & Thriller", img: "https://covers.openlibrary.org/b/id/12596500-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/244/pg244.txt", price: 499, rentPrice: 149 },
    { title: "The Mysterious Affair at Styles", author: "Agatha Christie", category: "Mystery & Thriller", img: "https://covers.openlibrary.org/b/id/14421150-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/863/pg863.txt", price: 699, rentPrice: 199 },
    { title: "The Secret Adversary", author: "Agatha Christie", category: "Mystery & Thriller", img: "https://covers.openlibrary.org/b/id/12613610-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1155/pg1155.txt", price: 599, rentPrice: 149 },
    { title: "The Murder on the Links", author: "Agatha Christie", category: "Mystery & Thriller", img: "https://covers.openlibrary.org/b/id/12586250-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/58866/pg58866.txt", price: 699, rentPrice: 199 },
    { title: "The Woman in White", author: "Wilkie Collins", category: "Mystery & Thriller", img: "https://covers.openlibrary.org/b/id/14421155-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/583/pg583.txt", price: 599, rentPrice: 149 },
    { title: "The Moonstone", author: "Wilkie Collins", category: "Mystery & Thriller", img: "https://covers.openlibrary.org/b/id/12596505-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/155/pg155.txt", price: 599, rentPrice: 149 },
    { title: "The Phantom of the Opera", author: "Gaston Leroux", category: "Mystery & Thriller", img: "https://covers.openlibrary.org/b/id/14421160-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/175/pg175.txt", price: 499, rentPrice: 149 },

    // --- CATEGORY 6: ROMANCE & DRAMA ---
    { title: "Romeo and Juliet", author: "William Shakespeare", category: "Romance & Drama", img: "https://covers.openlibrary.org/b/id/12613615-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1112/pg1112.txt", price: 399, rentPrice: 99 },
    { title: "Sense and Sensibility", author: "Jane Austen", category: "Romance & Drama", img: "https://covers.openlibrary.org/b/id/12586255-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/161/pg161.txt", price: 499, rentPrice: 149 },
    { title: "Emma", author: "Jane Austen", category: "Romance & Drama", img: "https://covers.openlibrary.org/b/id/14421165-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/158/pg158.txt", price: 599, rentPrice: 149 },
    { title: "Persuasion", author: "Jane Austen", category: "Romance & Drama", img: "https://covers.openlibrary.org/b/id/12596510-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/105/pg105.txt", price: 499, rentPrice: 149 },
    { title: "Macbeth", author: "William Shakespeare", category: "Romance & Drama", img: "https://covers.openlibrary.org/b/id/14421170-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1533/pg1533.txt", price: 399, rentPrice: 99 },
    { title: "Hamlet", author: "William Shakespeare", category: "Romance & Drama", img: "https://covers.openlibrary.org/b/id/12613620-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1524/pg1524.txt", price: 399, rentPrice: 99 },
    { title: "Othello", author: "William Shakespeare", category: "Romance & Drama", img: "https://covers.openlibrary.org/b/id/12586260-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1531/pg1531.txt", price: 399, rentPrice: 99 },
    { title: "Anna Karenina", author: "Leo Tolstoy", category: "Romance & Drama", img: "https://covers.openlibrary.org/b/id/14421175-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/1399/pg1399.txt", price: 899, rentPrice: 299 },
    { title: "Madame Bovary", author: "Gustave Flaubert", category: "Romance & Drama", img: "https://covers.openlibrary.org/b/id/12596515-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/2413/pg2413.txt", price: 699, rentPrice: 199 },
    { title: "Little Women", author: "Louisa May Alcott", category: "Romance & Drama", img: "https://covers.openlibrary.org/b/id/14421180-L.jpg", fileUrl: "https://www.gutenberg.org/cache/epub/514/pg514.txt", price: 599, rentPrice: 149 }
];

const users = [];

// --- CACHING FOR READ SPEED ---
const bookCache = {};

app.get('/api/read', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).json({ error: "Missing book URL" });

    // Tell browser to cache this for 1 day
    res.set('Cache-Control', 'public, max-age=86400');

    // Return from Server RAM if we've already fetched it before
    if (bookCache[targetUrl]) {
        console.log(`[FAST] Served ${targetUrl} from Server RAM Cache`);
        return res.send(bookCache[targetUrl]);
    }

    try {
        console.log(`[NETWORK] Fetching ${targetUrl} from Gutenberg...`);
        
        // Timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); 

        const response = await fetch(targetUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Failed to fetch from Gutenberg");
        
        const text = await response.text();
        
        // Save to Server RAM for the next person
        bookCache[targetUrl] = text;
        
        res.send(text);
    } catch (err) {
        console.error("Error fetching book:", err.message);
        res.status(500).json({ error: "Failed to load book content." });
    }
});

app.get('/api/books', (req, res) => {
    res.json(libraryDatabase);
});

// NEW: Show the UI when someone visits the main link
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Index.html'));
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password are required." });
    
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: "Username already exists." });
    }

    users.push({ username, password, library: [], favorites: [] });
    res.status(201).json({ message: "Registration successful!" });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({ message: "Login successful!", username: user.username, library: user.library, favorites: user.favorites || [] });
    } else {
        res.status(401).json({ error: "Invalid username or password." });
    }
});

app.post('/api/checkout', (req, res) => {
    const { username, items } = req.body; 
    let user = users.find(u => u.username === username);
    
    if (!user) {
        user = { username: username, password: "auto-restored", library: [], favorites: [] };
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

    console.log(`User ${username} checked out ${items.length} items.`);
    res.json({ message: "Checkout successful!", library: user.library });
});

app.post('/api/favorite', (req, res) => {
    const { username, title } = req.body; 
    let user = users.find(u => u.username === username);
    
    if (!user) {
        user = { username: username, password: "auto-restored", library: [], favorites: [] };
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
    console.log(`Server running on http://localhost:${PORT}`);
});