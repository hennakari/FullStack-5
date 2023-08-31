describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Mikki Ankka',
      username: 'mankka',
      password: 'piip'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('blogs')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })

  describe('Login', function() {
    it('login succeeds with correct credentials', function() {
      cy.login({ username: 'mankka', password: 'piip' })
      cy.contains('Mikki Ankka logged in')
    })

    it('login fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('mankka')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'wrong username or password')

      cy.get('html').should('not.contain', 'Mikki Ankka logged in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mankka', password: 'piip' })
    })

    it('a new blog can be created', function() {
      cy.createBlog({
        title: 'a blog created by cypress',
        author: 'cypress',
        url: 'no url given'
      })
      cy.contains('a blog created by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another blog created by cypress',
          author: 'cypress second',
          url: 'no url given either'
        })
      })

      it('blog view can be expanded', function () {
        cy.contains('another blog created by cypress')
        cy.contains('view').click()
        cy.contains('no url given either')
      })

      it('a blog can be liked', function () {
        cy.contains('another blog created by cypress')
        cy.contains('view').click()
        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('remove button is visible for blog adder', function () {
        cy.contains('another blog created by cypress')
        cy.contains('view').click()
        cy.contains('remove')
      })

      it('a blog can be deleted by blog adder', function () {
        cy.contains('another blog created by cypress')
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.should('not.contain', 'another blog created by cypress')
      })

      it('remove button is not visible for user other than blog adder', function () {
        const secondUser = {
          name: 'Iines Hanhi',
          username: 'iihan',
          password: 'bang'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, secondUser)
        cy.contains('logout').click()
        cy.login({ username: 'iihan', password: 'bang' })

        cy.contains('another blog created by cypress')
        cy.contains('view').click()
        cy.should('not.contain', 'remove')
      })

    })

    describe('and several blogs exist', function () {
      it('blogs are sorted based on likes desc', function () {
        cy.createBlog({
          title: 'first blog added second in likes',
          author: 'cypress',
          url: 'no url'
        })
        cy.contains('first blog added second in likes cypress')
          .contains('view')
          .click()
        cy.contains('first blog added second in likes cypress').parent().find('.likeButton').click()
        cy.contains('likes 1')

        cy.createBlog({
          title: 'second blog added third in likes',
          author: 'cypress',
          url: 'no url'
        })
        cy.contains('second blog added third in likes cypress')
          .contains('view')
          .click()

        cy.createBlog({
          title: 'third blog added first in likes',
          author: 'cypress',
          url: 'no url'
        })

        cy.contains('third blog added first in likes cypress')
          .contains('view')
          .click()

        cy.contains('third blog added first in likes cypress').parent().find('.likeButton').click()
        cy.contains('likes 1')
        cy.contains('third blog added first in likes cypress').parent().find('.likeButton').click()
        cy.contains('likes 2')

        cy.get('.blog').eq(0).should('contain', 'third blog added first in likes')
        cy.get('.blog').eq(1).should('contain', 'first blog added second in likes')
        cy.get('.blog').eq(2).should('contain', 'second blog added third in likes')
      })

    })

  })

})