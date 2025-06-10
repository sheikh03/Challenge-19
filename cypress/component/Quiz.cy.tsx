import QuizApp from "../../client/src/components/Quiz";
import mockQuestions from "../fixtures/questions.json";

describe("Quiz Application Component Tests", () => {
  beforeEach(() => {
    // Intercept API calls with mock data
    cy.intercept("GET", "/api/questions/random", {
      statusCode: 200,
      body: mockQuestions,
    }).as("fetchQuestions");
  });

  it("renders the welcome screen with start button", () => {
    cy.mount(<QuizApp />);
    cy.contains("h1", "Tech Knowledge Assessment").should("be.visible");
    cy.get("button").contains("Begin Assessment").should("exist");
  });

  it("loads questions when assessment begins", () => {
    cy.mount(<QuizApp />);

    // Start the assessment
    cy.get("button").contains("Begin Assessment").click();

    // Verify API call
    cy.wait("@fetchQuestions");

    // Verify first question appears
    cy.contains(mockQuestions[0].question).should("be.visible");

    // Verify answer buttons exist
    cy.get(".choice-btn").should("have.length", 4);
  });

  it("advances through questions when options are selected", () => {
    cy.mount(<QuizApp />);

    // Begin quiz
    cy.get("button").contains("Begin Assessment").click();
    cy.wait("@fetchQuestions");

    // Answer first question
    cy.contains(mockQuestions[0].question).should("exist");
    cy.get(".choice-btn").first().click();

    // Verify second question
    cy.contains(mockQuestions[1].question).should("be.visible");

    // Continue answering
    cy.get(".choice-btn").first().click();

    // Verify third question
    cy.contains(mockQuestions[2].question).should("be.visible");
  });

  it("displays results after completing all questions", () => {
    cy.mount(<QuizApp />);

    // Start assessment
    cy.get("button").contains("Begin Assessment").click();
    cy.wait("@fetchQuestions");

    // Answer all questions (selecting correct answers)
    cy.get(".choice-btn").eq(1).click(); // Correct: Cascading Style Sheets
    cy.get(".choice-btn").eq(2).click(); // Correct: Facebook (Meta)
    cy.get(".choice-btn").eq(1).click(); // Correct: <h1>

    // Verify completion screen
    cy.contains("Assessment Complete!").should("be.visible");
    cy.contains("Final Score: 3 out of 3").should("be.visible");
    cy.contains("Excellent work!").should("be.visible");
    cy.get("button").contains("Try Another Assessment").should("exist");
  });

  it("allows restarting the assessment after completion", () => {
    cy.mount(<QuizApp />);

    // Complete quiz quickly
    cy.get("button").contains("Begin Assessment").click();
    cy.wait("@fetchQuestions");

    // Answer all questions
    for (let i = 0; i < 3; i++) {
      cy.get(".choice-btn").first().click();
    }

    // Restart assessment
    cy.get("button").contains("Try Another Assessment").click();
    cy.wait("@fetchQuestions");

    // Verify back at first question
    cy.contains(mockQuestions[0].question).should("be.visible");
  });
});