#!/bin/bash

# Install missing type definitions
npm install --save-dev @types/aria-query @types/jest @types/testing-library__jest-dom @types/yargs

# Make sure all dependencies are properly installed
npm install

# Fix any audit issues
npm audit fix
