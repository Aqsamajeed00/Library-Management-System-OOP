#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

class Book {
  title: string;
  author: string;

  constructor(title: string, author: string) {
    this.title = title;
    this.author = author;
  }
}

class Member {
  name: string;
  borrowedBooks: Book[] = [];

  constructor(name: string) {
    this.name = name;
  }

  borrowBook(book: Book) {
    this.borrowedBooks.push(book);
  }
}

class Librarian {
  name: string;
  library: Library;

  constructor(name: string, library: Library) {
    this.name = name;
    this.library = library;
  }

  addBook(book: Book) {
    this.library.books.push(book);
  }
}

class Library {
  books: Book[] = [];
  members: Member[] = [];
  librarians: Librarian[] = [];

  addMember(member: Member) {
    this.members.push(member);
  }

  addLibrarian(librarian: Librarian) {
    this.librarians.push(librarian);
  }

  findBook(title: string): Book | undefined {
    return this.books.find((book) => book.title === title);
  }
}

const library = new Library();

const programStart = async (library: Library) => {
  do {
    console.log(chalk.bold.italic.bgYellow("\n\tWelcome to Aqsa's - Library Management System 📚 \n\t"));
    const ans = await inquirer.prompt([
      {
        name: "select",
        type: "list",
        message: "Who are you?",
        choices: ["Librarian", "Member", "Exit"],
      },
    ]);

    if (ans.select === "Librarian") {
      const librarianAns = await inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "Enter your name:",
        },
        {
          name: "action",
          type: "list",
          message: "What would you like to do?",
          choices: ["Add Book", "View Books"],
        },
      ]);

      let librarian = library.librarians.find(
        (lib) => lib.name === librarianAns.name
      );

      if (!librarian) {
        librarian = new Librarian(librarianAns.name, library);
        library.addLibrarian(librarian);
      }

      if (librarianAns.action === "Add Book") {
        const bookAns = await inquirer.prompt([
          {
            name: "title",
            type: "input",
            message: "Enter book title:",
          },
          {
            name: "author",
            type: "input",
            message: "Enter book author:",
          },
        ]);

        const newBook = new Book(bookAns.title, bookAns.author);
        librarian.addBook(newBook);
        console.log(chalk.bold.bgBlueBright("\n\tBook added successfully. 📕 \n"));
      } else if (librarianAns.action === "View Books") {
        console.log(chalk.bold.bgGreenBright("\n\tBooks in the library: 📚 \n"));
        console.log(library.books);
      }
    } else if (ans.select === "Member") {
      const memberAns = await inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "Enter your name:",
        },
        {
          name: "action",
          type: "list",
          message: "What would you like to do?",
          choices: ["Borrow Book", "View Borrowed Books"],
        },
      ]);

      let member = library.members.find((mem) => mem.name === memberAns.name);

      if (!member) {
        member = new Member(memberAns.name);
        library.addMember(member);
      }

      if (memberAns.action === "Borrow Book") {
        const bookAns = await inquirer.prompt([
          {
            name: "title",
            type: "input",
            message: "Enter book title:",
          },
        ]);

        const book = library.findBook(bookAns.title);

        if (book) {
          member.borrowBook(book);
          console.log(chalk.bold.bgCyanBright("\n\tBook borrowed successfully. ⚡ \n"));
        } else {
          console.log(chalk.bgRedBright.bold("\n\tBook not found. 😶  \n"));
        }
      } else if (memberAns.action === "View Borrowed Books") {
        console.log(chalk.bold.bgMagentaBright("\n\tBorrowed Books: 🚀  \n"));
        console.log(member.borrowedBooks);
      }
    } else if (ans.select === "Exit") {
      console.log(chalk.bgRed("\n\tThank you for using the Library Management System. 💖  \n"));
      process.exit();
    }
  } while (true);
};

programStart(library);