const INSERT_QUERY = `INSERT INTO favorite_books SET ?`;

db.query(INSERT_QUERY, {book_name: "Anthony's books"}, (err, result) =>{
  console.log(err);
  console.log(result);
});