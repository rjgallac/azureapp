# Simple Scalable Web App

This project implements a modern, serverless web application architecture using a React frontend and an Azure Functions backend.

## 🚀 Architecture Overview
The application follows a monorepo structure:
- `/client`: The static React Single Page Application (SPA) frontend.
- `/server`: The Azure Function App backend (API layer).
- `/infrastructure`: Infrastructure-as-Code (Bicep/Terraform) for resource provisioning.

## ⚙️ Setup Instructions
1. **Install Dependencies:**
   - Navigate to the client directory and run: `npm install`
   - Navigate to the server directory and install function dependencies (e.g., `npm install @azure/cosmos`).
2. **Local Run:**
   - Start the backend: `func start` (in the `/server` directory).
   - Start the frontend: `npm start` (in the `/client` directory).
3. **Deployment:**
   - Use the scripts/tools in the `/infrastructure` directory to provision Azure resources (Cosmos DB, Function App, etc.).
   - Deploy the client build to Azure Static Web Apps.
   - Deploy the server code to the Azure Function App.

## 💰 Cost Guidance
This architecture is designed to be budget-friendly by leveraging Azure's Consumption Plans and Free Tiers. Always monitor usage to stay within free limits.
