/**
 * API Gateway Entry Point
 * 
 * Purpose:
 * This is the main entry point for the API Gateway application. It serves as a minimal
 * startup file that delegates to the modular code structure in the src/ directory.
 * 
 * Usage:
 * - This file is the target of the "npm start" command
 * - It imports and executes the server module which contains the actual startup logic
 * - Keeping this file minimal allows for a cleaner separation of concerns
 * 
 * Role in the system:
 * - Entry point for the application
 * - Delegates to the modular code structure
 */
require('./src/server');
