
// Menambahkan buku
function addBook(title, author, year, isComplete) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const isBookExist = books.some(book =>
        book.title === title && book.author === author && book.year === year
    );

    if (isBookExist) {
        alert('Buku dengan judul, penulis, dan tahun yang sama sudah ada.');
        return;
    }
    const book = {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
        coverURL: document.getElementById('coverURL').value
    };

    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));

    refreshBookshelf();
}

//Memindahkan buku antar rak
function moveBook(id, targetRak) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
        books[bookIndex].isComplete = targetRak === 'finished';
        localStorage.setItem('books', JSON.stringify(books));

        refreshBookshelf();
    }
}

//Menghapus buku
function deleteBook(id) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const updatedBooks = books.filter(book => book.id !== id);
    localStorage.setItem('books', JSON.stringify(updatedBooks));

    refreshBookshelf();
}

//Mengedit buku
function editBook(id) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const bookToEdit = books.find(book => book.id === id);

    if (!bookToEdit) {
        alert('Buku tidak ditemukan.');
        return;
    }

    const newCoverURL = prompt('Edit URL Cover Buku:', bookToEdit.coverURL);
    const newTitle = prompt('Edit Judul:', bookToEdit.title);
    const newAuthor = prompt('Edit Penulis:', bookToEdit.author);
    const newYear = prompt('Edit Tahun:', bookToEdit.year);

    if (newTitle !== null && newAuthor !== null && newYear !== null) {
        bookToEdit.coverURL = newCoverURL;
        bookToEdit.title = newTitle;
        bookToEdit.author = newAuthor;
        bookToEdit.year = parseInt(newYear);

        localStorage.setItem('books', JSON.stringify(books));
        refreshBookshelf();
    }
}

//Menampilkan alert konfirmasi penghapusan buku
function confirmDeleteBook(id) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const bookToDelete = books.find(book => book.id === id);

    if (!bookToDelete) {
        alert('Buku tidak ditemukan.');
        return;
    }

    const confirmDelete = confirm(`Anda yakin ingin menghapus buku "${bookToDelete.title}"?`);

    if (confirmDelete) {
        deleteBook(id);
    }
}

//Mengganti status buku "Selesai" atau "Belum Selesai"
function toggleReadStatus(id) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const bookToToggle = books.find(book => book.id === id);

    if (!bookToToggle) {
        alert('Buku tidak ditemukan.');
        return;
    }

    bookToToggle.isComplete = !bookToToggle.isComplete;

    localStorage.setItem('books', JSON.stringify(books));
    refreshBookshelf();
}

//Pencarian
function filterBooks(keyword) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const unfinishedBooksTable = document.getElementById('unfinishedBooksTable');
    const finishedBooksTable = document.getElementById('finishedBooksTable');

    const unfinishedTbody = unfinishedBooksTable.querySelector('tbody');
    const finishedTbody = finishedBooksTable.querySelector('tbody');

    unfinishedTbody.innerHTML = '';
    finishedTbody.innerHTML = '';

    books.forEach(book => {
        const bookTitle = book.title.toLowerCase();
        const bookAuthor = book.author.toLowerCase();
        const bookYear = book.year.toString();

        if (bookTitle.includes(keyword) || bookAuthor.includes(keyword) || bookYear.includes(keyword)) {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>
                <img src="${book.coverURL}" alt="Cover Buku">
            </td>
            <td>${book.title}</>
            <td>${book.author}</>
            <td>${book.year}</>
            <td>
            <button class="complete" onclick="toggleReadStatus(${book.id})">${book.isComplete ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>'}</button>
                <button class="edit" onclick="editBook(${book.id})"><i class="fas fa-pen"></i></button>
                <button class="delete" onclick="confirmDeleteBook(${book.id})"><i class="fas fa-trash"></i></button>
            </td>
            `;

            if (!book.isComplete) {
                finishedTbody.appendChild(row);
            } else {
                unfinishedTbody.appendChild(row);
            }
        }
    });
}

//Mengambil dan menampilkan data buku
function refreshBookshelf() {
    const books = JSON.parse(localStorage.getItem('books')) || [];

    const unfinishedBooksTable = document.getElementById('unfinishedBooksTable');
    const finishedBooksTable = document.getElementById('finishedBooksTable');
    const unfinishedTbody = unfinishedBooksTable.querySelector('tbody');
    const finishedTbody = finishedBooksTable.querySelector('tbody');

    unfinishedTbody.innerHTML = '';
    finishedTbody.innerHTML = '';

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${book.coverURL}" alt="Cover Buku">
            </td>
            <td>${book.title}</>
            <td>${book.author}</>
            <td>${book.year}</>
            <td>
                <button class="complete" onclick="toggleReadStatus(${book.id})">${book.isComplete ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>'}</button>
                <button class="edit" onclick="editBook(${book.id})"><i class="fas fa-pen"></i></button>
                <button class="delete" onclick="confirmDeleteBook(${book.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;

        if (!book.isComplete) {
            finishedTbody.appendChild(row);
        } else {
            unfinishedTbody.appendChild(row);
        }
    });
}

//Inisialisasi aplikasi
document.getElementById('bookForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value);
    const isComplete = document.getElementById('isComplete').checked;

    addBook(title, author, year, isComplete);

    // Bersihkan input form
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('year').value = '';
    document.getElementById('isComplete').checked = false;
});

// Event listener untuk input pencarian
document.getElementById('searchInput').addEventListener('input', function () {
    const searchKeyword = this.value.toLowerCase();
    filterBooks(searchKeyword);
});

refreshBookshelf();