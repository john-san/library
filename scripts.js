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
  console.log(`Removed ${this.title} from the library`);
  myLibrary.splice(idx, 1);
  resetDataAttributes();
}

Book.prototype.toggleReadStatus = function() {
  this.read = !this.read;
  console.log(`Updated ${this.title}'s status to ${this.read}`);
}

function addBookToLibrary(book) {
  const titles = myLibrary.map(book => book.title);
  if (!titles.includes(book.title)) {
    myLibrary.push(book);
    appendBookToContainer(book);
  }
  console.log(`Added ${book.title} to the library`);
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
      bookEl.appendChild(createBookCover(book[key]));
    } else {

      if (typeof book[key] != 'function') {
        const detail = document.createElement('li');
        detail.classList.add('book-detail');

        if (key == 'read') {
          detail.textContent = `${capitalized(key)}: `
          detail.appendChild(createReadIcon(book));
        } else {
          detail.textContent = `${capitalized(key)}: ${book[key]}`;
        }  

        bookDetails.appendChild(detail);
      }

    }
  }

  bookEl.prepend(createDeleteBtn());
  bookEl.appendChild(bookDetails);
  container.appendChild(bookEl);
}

function createBookCover(src) {
  const cover = document.createElement('img');
  cover.classList.add('book-cover');
  cover.setAttribute('src', src);
  return cover;
}

function createReadIcon(book) {
  let i = document.createElement('i');
  if (book['read']) {
    i.classList.add('fas', 'fa-check', 'read-status');
  } else {
    i.classList.add('fas', 'fa-times', 'read-status');
  }
  i.addEventListener('click', (e) => {
    const idx = e.target.parentNode.parentNode.parentNode.getAttribute('data-attribute');
    myLibrary[idx].toggleReadStatus();
    
    if ([...e.target.classList].includes('fa-check')) {
      e.target.classList.remove('fa-check');
      e.target.classList.add('fa-times');
    } else {
      e.target.classList.remove('fa-times');
      e.target.classList.add('fa-check');
    }
  });

  return i;
}

function createDeleteBtn() {
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('btn', 'btn-danger');
  deleteBtn.textContent = 'x';
  deleteBtn.addEventListener('click', (e) => {
    const idx = parseInt((e.target.parentNode.getAttribute('data-attribute')));
    myLibrary[idx].removeSelf();
  });
  return deleteBtn;
}

function resetDataAttributes() {
  const bookEls = [...document.querySelectorAll('.book')];

  bookEls.forEach((el, idx) => {
    el.setAttribute('data-attribute', idx);
  })
}


function capitalized(str) {
  const arr = str.split('');
  arr[0] = arr[0].toUpperCase();
  return arr.join('');
}

/* Form */
const form = document.getElementById('addBookForm');
const modal = new bootstrap.Modal(document.getElementById('myModal'));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (validateBookTitle()) {
    createBookFromForm();
    modal.hide();
    form.reset();
    if (document.querySelector('.invalid-feedback')) {
      clearInvalidFeedbackMsgs();
    }
  }
} );

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

// Initialize
const book1 = new Book('The Great Gatsby', 'F. Scott Fitzgerald', false, 'images/bc-thegreatgatsby.jpg');
const book2 = new Book('Harry Potter and the Philosopher\'s Stone', 'J. K. Rowling', false, 'images/bc-harrypotterandthephilosophersstone.jpg');
const book3 = new Book('Animal Farm', 'George Orwell', false, 'images/bc-animalfarm.jpg');
addBookToLibrary(book1);
addBookToLibrary(book2);
addBookToLibrary(book3);
displayBooks();