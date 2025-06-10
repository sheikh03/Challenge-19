// ***********************************************************
// This file is processed and loaded automatically before your test files.
// You can change the location of this file or turn off processing by setting
// the "supportFile" to false.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Import Cypress React
import { mount } from 'cypress/react18';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

// Add the mount command
Cypress.Commands.add('mount', mount);

// Add Testing Library commands
import '@testing-library/cypress/add-commands';