describe('Bidder Login Flow', () => {
    
    beforeEach(() => {
        cy.visit('/bidder_login')
    })
    
    it('TC-006: Shows an error when logging in with invalid credentials', () => {
        // Mock the backend API call to instantly return a 401 Unauthorized
        cy.intercept('POST', 'http://localhost:8080/api/auth/login', {
            statusCode: 401,
            body: { message: "Unauthorized" }
        }).as('loginRequest');

        // 1. Find the email input and type an invalid email
        cy.get('input[type="email"]').type('invalid_user@example.com')
        
        // 2. Find the password input and type an invalid password
        cy.get('input[type="password"]').type('wrongpassword')
        
        // 3. Find the submit button and click it
        cy.get('button[type="submit"]').click()
        
        // Wait for the mocked request to complete before checking the UI
        cy.wait('@loginRequest')
        
        // 4. Validate that the UI displays the error state
        cy.get('.error-text')
          .should('be.visible')
          .and('contain', 'Invalid email or password')
    })
})