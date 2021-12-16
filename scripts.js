let myLibrary = [];
const container = document.querySelector('.container');

function Book(title, author, read = false, bookCover = 'images/bc-default.jpg') {
  this.title = title;
  this.author = author;
  this.read = read;
  this.bookCover = bookCover;
}

Book.prototype.getIndex = function() {
  const titles = myLibrary.map(book => book.title);
  return titles.findIndex(title => title == this.title);
}

Book.prototype.removeSelf = function() {
  const idx = this.getIndex();
  const el = document.querySelector(`[data-attribute='${idx}']`);
  el.remove();
  myLibrary.splice(idx, 1);
  resetDataAttributes();
}

function addBookToLibrary(book) {
  const titles = myLibrary.map(book => book.title);
  if (!titles.includes(book.title)) {
    myLibrary.push(book);
    appendBookToContainer(book);
  }
}

function displayBooks() {
  if (container.children) {
    container.replaceChildren();
  }
  myLibrary.forEach(book => {
   appendBookToContainer(book); 
  });
}

function appendBookToContainer(book) {
  const bookEl = document.createElement('div');
  bookEl.setAttribute('data-attribute', book.getIndex());
  bookEl.classList.add('book');
  const bookDetails = document.createElement('ul');
  bookDetails.classList.add('book-details');

  for (let key in book) {
    if (key == 'bookCover') {
      const cover = document.createElement('img');
      cover.classList.add('book-cover');
      cover.setAttribute('src', book[key]);
      bookEl.appendChild(cover);
    } else {
      if (typeof book[key] != 'function') {
        const detail = document.createElement('li');
        detail.classList.add('book-detail');
        detail.textContent = `${key}: ${book[key]}`;
        bookDetails.appendChild(detail);
      }
    }
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('btn', 'btn-danger');
  deleteBtn.textContent = 'x';
  deleteBtn.addEventListener('click', (e) => {
    const idx = parseInt((e.target.parentNode.getAttribute('data-attribute')));
    myLibrary[idx].removeSelf();
  })
  bookEl.prepend(deleteBtn);

  bookEl.appendChild(bookDetails);
  container.appendChild(bookEl);
}

const form = document.getElementById('addBookForm');
const modal = new bootstrap.Modal(document.getElementById('myModal'));


form.addEventListener('submit', (e) => {
  e.preventDefault();
  // console.log(e);
  
  if (validateBookTitle()) {
    createBookFromForm();
    modal.hide();
    form.reset();
    if (document.querySelector('.invalid-feedback')) {
      clearInvalidFeedbackMsgs();
    }
  }
} );

let book1 = new Book('The Great Gatsby', 'F. Scott Fitzgerald', false, 'images/bc-thegreatgatsby.jpg');
let book2 = new Book('Harry Potter and the Philosopher\'s Stone', 'J. K. Rowling', false, 'images/bc-harrypotterandthephilosophersstone.jpg');
let book3 = new Book('Animal Farm', 'George Orwell', false, 'images/bc-animalfarm.jpg');
addBookToLibrary(book1);
addBookToLibrary(book2);
addBookToLibrary(book3);

displayBooks();

function createBookFromForm() {
  const bookTitle = document.getElementById('title').value;  
  const bookAuthor = document.getElementById('author').value;
  const readStatus = document.getElementById('inlineRadio1').checked == true ? true : false;
  
  const bookCoverSrc = getObjectUrl(document.getElementById('bookCoverInput').files[0]);
  const newBook = new Book(bookTitle, bookAuthor, readStatus, bookCoverSrc);
  addBookToLibrary(newBook);
}

function getObjectUrl(file) {
  return file ? URL.createObjectURL(file) : 'images/bc-default.jpg'
}

function validateBookTitle() {
  const bookTitle = document.getElementById('title').value.toLowerCase();  
  const titles = myLibrary.map(book => book.title.toLowerCase());
  if (titles.includes(bookTitle)) {
    const errorEl = document.createElement('div')
    errorEl.classList.add('invalid-feedback');
    errorEl.textContent = 'Book title must be unique';
    const titleInputArea = document.getElementById('addBookForm').children[0];
    if (!titleInputArea.querySelector('.invalid-feedback')) {
      titleInputArea.appendChild(errorEl);
    }
    return false;
  } else {
    return true;
  }
}

function clearInvalidFeedbackMsgs() {
  const arr = [...document.querySelectorAll('.invalid-feedback')];
  arr.forEach(el => el.remove());
}

function resetDataAttributes() {
  const bookEls = [...document.querySelectorAll('.book')];

  bookEls.forEach((el, idx) => {
    el.setAttribute('data-attribute', idx);
  })
}