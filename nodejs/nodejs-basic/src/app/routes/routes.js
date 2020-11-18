const { body, validationResult } = require('express-validator');

const BookDAO = require('../infra/book-dao')
const db = require('../../config/database')


module.exports = (app) => {

  const listTemplate = require('../views/books/list/list.marko')
  const bookTemplate = require('../views/books/form/form.marko')
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

  // BUSCANDO LIVRO POR ID
  app.get('/books/form/:id', function (req, res) {
    bookDAO.findById(req.params.id)
      .then(book => {
        //console.log(`\n\n\n`, book)
        //console.log(`\n\n\n`, book[0].description)
        res.marko(bookTemplate,
          { book: book }
        )
      })
      .catch(erro => console.log(erro));

  });

  // FORM PARA CADASTRO
  app.get('/books/form', function (req, res) {
    res.marko(bookTemplate, { book: {} })
  });

  //SALVANDO OS LIVROS
  app.post('/books',
    [
      body('title').isLength({ min: 5 }),
      body('price').isCurrency()
    ],
    function (req, res) {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //return res.status(400).json({ errors: errors.array() });
        
        res.redirect('/books/form')
      }

      if (!req.body.id) {
        bookDAO.save(req.body)
          .then(res.redirect('/books'))
          .catch(err => console.log(`Erro ao salvar o livro ${err}`))

      } else {
        bookDAO.update(req.body)
          .then(res.redirect('/books'))
          .catch(err => console.log(`Erro ao atualizar o livro ${err}`))
      }
    });

  // DELETANDO UM LIVRO PELO ID
  app.delete('/books/:id', function (req, res) {
    const bookId = req.params.id;

    bookDAO.remove(bookId)
      .then(() => {
        res.status(200).end()
      })
      .catch(erro => console.log(erro))
  });
}

