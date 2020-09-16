const BookDAO = require('../infra/book-dao')
const db = require('../../config/database')


module.exports = (app) => {

  const listTemplate = require('../views/books/list/list.marko')
  const bookDAO = new BookDAO(db);

  app.get('/', function (req, res) {
    res.send(" OK ")
  });

  app.get('/books', function (req, res) {

    bookDAO.listAll()
      .then(books => res.marko(listTemplate,
        { books: books }
      ))
      .catch(err => console.log(`Erro ao listar os livros ${err}`))
  });
}
