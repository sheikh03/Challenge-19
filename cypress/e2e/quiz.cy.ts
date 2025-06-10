describe("Tech Knowledge Assessment E2E Testing Suite", () => {
  beforeEach(() => {
    // Set up mock API responses
    cy.fixture("questions.json").then((questionData) => {
      cy.intercept("GET", "/api/questions/random", {
        statusCode: 200,
        body: questionData,
      }).as("loadQuestions");
    });

    // Navigate to application
    cy.visit("/");
  });

  it("completes full assessment workflow successfully", () => {
    // Verify welcome screen
    cy.contains("h1", "Tech Knowledge Assessment").should("be.visible");
    cy.contains("button", "Begin Assessment").should("exist");

    // Start assessment
    cy.contains("button", "Begin Assessment").click();

    // Wait for questions to load
    cy.wait("@loadQuestions");

    // Verify first question
    cy.contains("What does CSS stand for?").should("be.visible");

    // Check all options are displayed
    cy.contains("Computer Style Sheets").should("exist");
    cy.contains("Cascading Style Sheets").should("exist");
    cy.contains("Creative Style Sheets").should("exist");
    cy.contains("Colorful Style Sheets").should("exist");

    // Select correct answer (B - Cascading Style Sheets)
    cy.get(".choice-btn").eq(1).click();

    // Second question
    cy.contains("Which company developed React?").should("be.visible");
    cy.get(".choice-btn").eq(2).click(); // C - Facebook (Meta)

    // Third question
    cy.contains("What is the correct HTML tag for the largest heading?").should("be.visible");
    cy.get(".choice-btn").eq(1).click(); // B - <h1>

    // Verify completion
    cy.contains("Assessment Complete!").should("be.visible");
    cy.contains("Final Score: 3 out of 3").should("be.visible");
    cy.contains("Try Another Assessment").should("be.visible");
  });

  it("tracks score correctly with incorrect answers", () => {
    // Begin assessment
    cy.contains("button", "Begin Assessment").click();
    cy.wait("@loadQuestions");

    // Answer all questions incorrectly (first option)
    for (let i = 0; i < 3; i++) {
      cy.get(".choice-btn").first().click();
    }

    // Check final score
    cy.contains("Final Score: 0 out of 3").should("be.visible");
    cy.contains("Keep practicing!").should("be.visible");
  });

  it("allows multiple assessment attempts", () => {
    // First attempt
    cy.contains("button", "Begin Assessment").click();
    cy.wait("@loadQuestions");

    // Quick completion
    for (let i = 0; i < 3; i++) {
      cy.get(".choice-btn").eq(i).click();
    }

    // Start new attempt
    cy.contains("button", "Try Another Assessment").click();
    cy.wait("@loadQuestions");

    // Verify reset to first question
    cy.contains("What does CSS stand for?").should("be.visible");
    cy.contains("Question 1 of 3").should("be.visible");
  });

  it("shows progress indicator during assessment", () => {
    cy.contains("button", "Begin Assessment").click();
    cy.wait("@loadQuestions");

    // Check initial progress
    cy.get(".progress-bar").should("contain", "Question 1 of 3");

    // Answer and check progress updates
    cy.get(".choice-btn").first().click();
    cy.get(".progress-bar").should("contain", "Question 2 of 3");

    cy.get(".choice-btn").first().click();
    cy.get(".progress-bar").should("contain", "Question 3 of 3");
  });

  it("handles API failures gracefully", () => {
    // Override with error response
    cy.intercept("GET", "/api/questions/random", {
      statusCode: 500,
      body: { error: "Server Error" },
    }).as("failedRequest");

    // Attempt to start
    cy.contains("button", "Begin Assessment").click();

    // Wait for failed request
    cy.wait("@failedRequest");

    // Should show error message (not spinner)
    cy.get(".alert-danger").should("be.visible");
    cy.contains("Failed to load questions").should("be.visible");
    cy.get("button").contains("Refresh Page").should("be.visible");
  });
});