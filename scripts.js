const container = document.querySelector('.container');

class Library {
	constructor() {
		this.state = [];
	}

	getBookIndex(book) {
		const titles = this.state.map((book) => book.title);
		return titles.findIndex((title) => title == book.title);
	}

	removeBook(book) {
		const idx = this.getBookIndex(book);
		const el = document.querySelector(`[data-attribute='${idx}']`);
		el.remove();
		console.log(`Removed ${book.title} from the library`);
		this.state.splice(idx, 1);
		this.resetDataAttributes();
	}

	toggleBookReadStatus(book) {
		const idx = this.getBookIndex(book);
		this.state[idx].read = !this.state[idx].read;
		console.log(`Updated ${book.title}'s read status to ${book.read}`);
	}

	addBookToLibrary(book) {
		const titles = this.state.map((book) => book.title);
		if (!titles.includes(book.title)) {
			this.state.push(book);
			this.appendBookToContainer(book);
		}
		console.log(`Added ${book.title} to the library`);
	}

	displayBooks() {
		if (container.children) {
			container.replaceChildren();
		}
		this.state.forEach((book) => this.appendBookToContainer(book));
	}

	appendBookToContainer(book) {
		const createBookCover = (src) => {
			const cover = document.createElement('img');
			cover.classList.add('book-cover');
			cover.setAttribute('src', src);
			return cover;
		};

		const createReadIcon = (book) => {
			let i = document.createElement('i');
			if (book['read']) {
				i.classList.add('fas', 'fa-check', 'read-status');
			} else {
				i.classList.add('fas', 'fa-times', 'read-status');
			}
			i.addEventListener('click', (e) => {
				myLibrary.toggleBookReadStatus(book);

				if ([...e.target.classList].includes('fa-check')) {
					e.target.classList.remove('fa-check');
					e.target.classList.add('fa-times');
				} else {
					e.target.classList.remove('fa-times');
					e.target.classList.add('fa-check');
				}
			});

			return i;
		};

		const createDeleteBtn = () => {
			const deleteBtn = document.createElement('button');
			deleteBtn.classList.add('btn', 'btn-danger');
			const i = document.createElement('i');
			i.classList.add('fas', 'fa-times');
			// deleteBtn.textContent = 'x';
			deleteBtn.appendChild(i);
			deleteBtn.addEventListener('click', (e) => {
				const answer = confirm('Are you sure you want to remove this book?');
				if (answer == true) {
					const idx = parseInt(
						deleteBtn.parentNode.getAttribute('data-attribute')
					);
					myLibrary.removeBook(myLibrary.state[idx]);
				}
			});
			return deleteBtn;
		};

		const capitalized = (str) => {
			const arr = str.split('');
			arr[0] = arr[0].toUpperCase();
			return arr.join('');
		};

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
						detail.textContent = `${capitalized(key)}: `;
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

	resetDataAttributes() {
		const bookEls = [...document.querySelectorAll('.book')];
		bookEls.forEach((el, idx) => el.setAttribute('data-attribute', idx));
	}
}

const myLibrary = new Library();

class Book {
	constructor(
		title,
		author,
		read = false,
		bookCover = 'images/bc-default.jpg'
	) {
		this.title = title;
		this.author = author;
		this.read = read;
		this.bookCover = bookCover;
	}

	getIndex() {
		return myLibrary.getBookIndex(this);
	}

	removeSelf() {
		myLibrary.removeBook(this);
	}

	toggleReadStatus() {
		this.read = !this.read;
		console.log(`Updated ${this.title}'s read status to ${this.read}`);
	}
}

/* Form */
const form = document.getElementById('addBookForm');
const modal = new bootstrap.Modal(document.getElementById('myModal'));

const createBookFromForm = () => {
	const getObjectUrl = (file) =>
		file ? URL.createObjectURL(file) : 'images/bc-default.jpg';

	const bookTitle = document.getElementById('title').value;
	const bookAuthor = document.getElementById('author').value;
	const readStatus =
		document.getElementById('inlineRadio1').checked == true ? true : false;

	const bookCoverSrc = getObjectUrl(
		document.getElementById('bookCoverInput').files[0]
	);
	const newBook = new Book(bookTitle, bookAuthor, readStatus, bookCoverSrc);
	myLibrary.addBookToLibrary(newBook);
};

const validateBookTitle = () => {
	const bookTitle = document.getElementById('title').value.toLowerCase();
	const titles = myLibrary.state.map((book) => book.title.toLowerCase());
	if (titles.includes(bookTitle)) {
		const errorEl = document.createElement('div');
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
};

const clearInvalidFeedbackMsgs = () => {
	const arr = [...document.querySelectorAll('.invalid-feedback')];
	arr.forEach((el) => el.remove());
};

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
});

// Initialize
const book1 = new Book(
	'The Great Gatsby',
	'F. Scott Fitzgerald',
	true,
	'images/bc-thegreatgatsby.jpg'
);
const book2 = new Book(
	"Harry Potter and the Philosopher's Stone",
	'J. K. Rowling',
	false,
	'images/bc-harrypotterandthephilosophersstone.jpg'
);
const book3 = new Book(
	'Animal Farm',
	'George Orwell',
	false,
	'images/bc-animalfarm.jpg'
);
const book4 = new Book(
	'The Grapes of Wrath',
	'John Steinbeck',
	true,
	'images/bc-thegrapesofwrath.jpg'
);
const book5 = new Book(
	'Invisible Man',
	'Ralph Ellison',
	true,
	'images/bc-invisibleman.jpg'
);
myLibrary.addBookToLibrary(book1);
myLibrary.addBookToLibrary(book2);
myLibrary.addBookToLibrary(book3);
myLibrary.addBookToLibrary(book4);
myLibrary.addBookToLibrary(book5);
myLibrary.displayBooks();
