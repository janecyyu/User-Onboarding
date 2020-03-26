describe("test sign up form", function() {
  beforeEach(function() {
    cy.visit("http://localhost:3002");
  });
  it("add test up input and submit", function() {
    cy.get('input[name="name"]')
      .type("Jojo")
      .should("have.value", "Jojo");
    cy.get('input[name="email"]')
      .type("email@mail.com")
      .should("have.value", "email@mail.com");
    cy.get('input[name="password"]')
      .type("password123")
      .should("have.value", "password123");
    cy.get('[type="checkbox"]').check().should("be.checked");
    cy.get('[data-cy=submit]').click();
  });
});
