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
   - Navigate to the server directory and run: `npm install`
2. **Run Cosmos DB locally:**
   - Install and start the [Azure Cosmos DB Emulator](https://learn.microsoft.com/azure/cosmos-db/emulator) on Windows, or run the Linux emulator with Docker:
     `docker run --detach --publish 8081:8081 --publish 1234:1234 --publish 10250-10255:10250-10255 --name cosmos-emulator mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator`
   - The local emulator endpoint is `https://localhost:8081`. The Windows emulator exposes its Data Explorer at `https://localhost:8081/_explorer/index.html`.
   - For the Windows emulator, open the emulator certificate from the system tray and trust it in the current user's Trusted Root Certification Authorities store. The Docker emulator uses its own certificate; follow the emulator documentation if your client rejects the certificate.
   - `server/local.settings.json` enables the local-only `CosmosDBAllowInsecureTLS` setting for the emulator's self-signed certificate. Do not enable this setting for Azure resources; use a trusted certificate instead.
   - `server/local.settings.json` is configured with the emulator endpoint and its well-known local development key. Do not use this key for Azure resources.
   - Create the database and container expected by the function (`YourDatabase` and `YourContainer`) in Data Explorer, or change those names in `server/GetItems/index.js`.
3. **Run local Azure Functions storage:**
   - Install Azurite with `npm install --global azurite`.
   - Start it in a separate terminal with `azurite --silent --location .azurite --debug .azurite/debug.log` from the repository root. This satisfies `AzureWebJobsStorage=UseDevelopmentStorage=true` in `server/local.settings.json`.
4. **Run the local stack:**
   - Start the backend: `func start` (from the `/server` directory).
   - Start the frontend: `npm start` (from the `/client` directory).
5. **Deployment:**
    - Use the scripts/tools in the `/infrastructure` directory to provision Azure resources (Cosmos DB, Function App, etc.).
    - Deploy the client build to Azure Static Web Apps.
    - Deploy the server code to the Azure Function App (see `.github/workflows/deploy-function.yml`).

    **Backend Deployment Setup:**
    1. Generate Azure credentials for CI/CD:
       ```bash
       az ad sp create-for-rbac --scopes /subscriptions/YOUR_SUBSCRIPTION_ID --role contributor --name "GH-Actions-Function-Deploy"
       ```
    2. Add these secrets to your GitHub repository settings:
       - `AZURE_CREDENTIALS` (service principal JSON)
       - `AZURE_CLIENT_ID`
       - `AZURE_CLIENT_SECRET`
       - `AZURE_TENANT_ID`
       - `FUNCTION_APP_NAME`

    **Frontend Deployment Setup (Optional):**
    - Set up GitHub Actions workflow for frontend deployment to Azure Static Web Apps.

## 💰 Cost Guidance
This architecture is designed to be budget-friendly by leveraging Azure's Consumption Plans and Free Tiers. Always monitor usage to stay within free limits.
