const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username&&password){
      const present = users.filter((user)=> user.username === username)
      if(present.length===0){
          users.push({"username":req.body.username,"password":req.body.password});
          return res.status(201).json({message:"User created successfully"})
      }
      else{
        return res.status(400).json({message:"User already exists"})
      }
  }
  else if(!username && !password){
    return res.status(400).json({message:"BError"})
  }
  else if(!username || !password){
    return res.status(400).json({message:"Write the username and password"})
  }  
});

// T1
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  if (books) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  } else {
    return res.status(404).json({ message: "No books found" });
  }
});

// T10

public_users.get('/', (req, res) => {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject({ message: "No books found" });
    }
  })
  .then((data) => res.status(200).json(data))
  .catch((error) => res.status(404).json(error));
});


// T2
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(200).send(JSON.stringify(books[isbn],null,4));
  }
  else{
    return res.status(404).send("No book found with ISBN "+isbn);
  }
 });
  
// T11
public_users.get('/isbn/:isbn', (req, res) => {
  let isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("No book found with ISBN " + isbn);
    }
  })
  .then((book) => res.status(200).json(book))
  .catch((error) => res.status(404).send(error));
});

// T3
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let booksByAuthor = [];
  for(let isbn in books){
    if(books[isbn].author == author){
      booksByAuthor.push(books[isbn]);
    }
  }
  if(booksByAuthor.length>0){
    return res.status(200).send(JSON.stringify(booksByAuthor,null,4));
  }
  else{
    return res.status(404).send("No book found with author "+author);
  }
});

// T12
public_users.get('/author/:author', (req, res) => {
  let author = req.params.author;

  new Promise((resolve, reject) => {
    let booksByAuthor = Object.values(books).filter(book => book.author === author);
    
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No book found with author " + author);
    }
  })
  .then(books => res.status(200).json(books))
  .catch(error => res.status(404).send(error));
});

// T4
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let booksByTitle = [];
  for(let isbn in books){
    if(books[isbn].title == title){
      booksByTitle.push(books[isbn]);
    }
  }
  if(booksByTitle.length>0){
    return res.status(200).send(JSON.stringify(booksByTitle,null,4));
  }
  else{
    return res.status(404).send("No book found with title "+title);
  }
});

// T13
public_users.get('/title/:title', (req, res) => {
  let title = req.params.title;

  new Promise((resolve, reject) => {
    let booksByTitle = Object.values(books).filter(book => book.title === title);
    
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No book found with title " + title);
    }
  })
  .then(books => res.status(200).json(books))
  .catch(error => res.status(404).send(error));
});

// T5
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(200).send(JSON.stringify(books[isbn].reviews,null,4));
  }
  else{
    return res.status(404).send("No book found with ISBN "+isbn);
  }
});

module.exports.general = public_users;