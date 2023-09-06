describe('Note app', function () {
  beforeEach(function() {
    cy.request('POST',`${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Monte Yoon',
      username: 'MonteYoon',
      password: 'Water123'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

  it('login form can be opened', function () {
    cy.contains('log in').click()
    cy.get('#username').type('MonteYoon')
    cy.get('#password').type('Water123')
    cy.get('#login-button').click()
    cy.contains('Monte Yoon logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'MonteYoon', password: 'Water123' })
    })

    it('a new note can be created', function() {
      cy.get('#showToggle').click()
      cy.get('input').type('testing123')
      cy.contains('Add').click()
      cy.contains('testing123')
    })

    describe('and a note exists', function () {
      beforeEach(function() {
        cy.createNote({
          content: 'another note cypress',
          important: true
        })
      })

      it('it can be made not important', function() {
        cy.contains('another note cypress').parent()
          .contains('make not important').click()

        cy.contains('another note cypress').parent()
          .contains('make important')
      })
    })

    describe('and several notes exist', function () {
      beforeEach(function () {
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })

      it('one of those can be made important', function () {
        cy.contains('second note').parent().find('button').click()
        cy.contains('second note').parent().find('button')
          .should('contain', 'make not important')
      })
    })
  })

  it('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type('MonteYoon')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()
    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Monte Yoon logged in')
  })
})