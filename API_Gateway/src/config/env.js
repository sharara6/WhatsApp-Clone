/**
 * Environment Configuration Module
 * 
 * Purpose:
 * This module validates and exports environment variables used throughout the application.
 * It ensures all required variables are present and correctly formatted before the app starts.
 * 
 * Usage:
 * - Imported by many other modules that need access to environment variables
 * - Validates all environment variables at startup time
 * - Exits the process with an error if validation fails
 * 
 * Key responsibilities:
 * - Load variables from .env file
 * - Define validation schema using Joi
 * - Validate and export environment variables
 * - Provide early failure if configuration is incorrect
 * 
 * Role in the system:
 * - Single source of truth for environment variables
 * - Ensures consistent access to validated configuration
 * - Prevents runtime errors due to missing or invalid configuration
 */
const Joi = require('joi');
require('dotenv').config();

// Environment validation schema
const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  REDIS_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  RATE_LIMIT: Joi.number().default(20),
  RATE_LIMIT_WINDOW: Joi.number().default(60),
  AUTH_SERVICE_URL: Joi.string().required(),
  USERS_SERVICE_URL: Joi.string().required(),
  CHATS_SERVICE_URL: Joi.string().required(),
  MESSAGE_SERVICE_URL: Joi.string().required(),
  MEDIA_SERVICE_URL: Joi.string().required(),
  ALLOWED_ORIGINS: Joi.string().required(),
}).unknown();

// Validate and export environment variables
const { error, value: env } = envSchema.validate(process.env);
if (error) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}

module.exports = env; 