/* global describe, beforeEach, it, cy, expect*/ 

describe('MyPortfolio Sign-In E2E Test', () => {

    beforeEach(() => {
        cy.visit('/signin');
    });

    it('successfully signs in with valid credentials', () => {
        cy.env(['TEST_EMAIL', 'TEST_PASSWORD']).then(
            ({ TEST_EMAIL, TEST_PASSWORD }) => {

            expect(Boolean(TEST_EMAIL), 'test email to be set').to.be.true;
            expect(Boolean(TEST_PASSWORD), 'test password to be set').to.be.true;

            cy.contains('h2', 'Sign In').should('be.visible');

            cy.get('input[name="email"]')
                .should('be.visible')
                .type(TEST_EMAIL);

            cy.get('input[name="password"]')
                .should('be.visible')
                .type(TEST_PASSWORD, { log: false });

            cy.get('button[type="submit"]').click(); 

            cy.get('[role="status"]').should('contain.text', 'Login successful!');

            cy.contains('Welcome,').should('be.visible');

            cy.window().then((window) => {
                
                expect(window.localStorage.getItem('token')).to.be.a('string').and.not.be.empty;

                const storedUser = JSON.parse(window.localStorage.getItem('user'));

                expect(storedUser).to.have.property('name').that.is.a('string').and.not.be.empty;
                expect(storedUser).to.have.property('role').that.is.a('string').and.not.be.empty;
            });
        });
    });
});