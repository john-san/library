let myLibrary = [];
const container = document.querySelector('.container');

function Book(title, author, bookCover = 'images/bc-default.jpg', read = false) {
  this.title = title;
  this.author = author;
  this.bookCover = bookCover;
  this.read = read;
}

function addBookToLibrary(book) {
  let titles = myLibrary.map(book => book.title);
  if (!titles.includes(book.title)) {
    myLibrary.push(book);
  }
}

function displayBooks() {
  myLibrary.forEach(book => {
    let bookEl = document.createElement('div');
    bookEl.classList.add('book');
    let bookDetails = document.createElement('ul');
    bookDetails.classList.add('book-details');

    for (let key in book) {
      if (key == 'bookCover') {
        let cover = document.createElement('img');
        cover.classList.add('book-cover');
        cover.setAttribute('src', book[key]);
        bookEl.appendChild(cover);
      } else {
        let detail = document.createElement('li');
        detail.classList.add('book-detail');
        detail.textContent = `${key}: ${book[key]}`;
        bookDetails.appendChild(detail);
      }
      
    }

    bookEl.appendChild(bookDetails);
    container.appendChild(bookEl);
  });
}


const form = document.getElementById('addBookForm');
const modal = new bootstrap.Modal(document.getElementById('myModal'));


form.addEventListener('submit', (e) => {
  e.preventDefault();
  // console.log(e);
  
  
  modal.hide();
  form.reset();
} );

let book1 = new Book('The Great Gatsby', 'F. Scott Fitzgerald', 'images/bc-thegreatgatsby.jpg');
let book2 = new Book('Harry Potter and the Philosopher\'s Stone', 'J. K. Rowling', 'images/bc-harrypotterandthephilosophersstone.jpg');
let book3 = new Book('Animal Farm', 'George Orwell', 'images/bc-animalfarm.jpg');
addBookToLibrary(book1);
addBookToLibrary(book2);
addBookToLibrary(book3);

displayBooks();