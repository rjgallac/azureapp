# Project Workflow Guide: Todo Application

This document outlines the standard, repeatable workflow for developing and deploying the Todo application.

## 📂 Project Structure Overview

*   **`client/`**: Contains the React frontend source code.
*   **`server/`**: Contains the Node.js backend logic (Azure Functions).
*   **`infrastructure/`**: Contains the Bicep templates for defining and deploying Azure resources.
*   **`README.md`**: General project documentation.

## 🛠️ Development Workflow (The "One Command" Goal)

The deployment process must be executed in the following sequence:

### Step 1: Install Dependencies (Client & Server)
**Goal:** Ensure all packages are installed for both frontend and backend.
1.  **Client:** Navigate to the `client/` directory and run:
    ```bash
    npm install
    ```
2.  **Server:** Navigate to the `server/` directory and run:
    ```bash
    npm install
    ```

### Step 2: Build Frontend
**Goal:** Compile the React source code into static assets.
1.  Navigate to the `client/` directory.
2.  Run the build command:
    ```bash
    npm run build
    ```
    *Output assets will be placed in `client/build/`.*

### Step 3: Deploy Infrastructure (Bicep)
**Goal:** Provision all necessary Azure resources (Resource Group, Cosmos DB, Function App, Static Web App).
1.  Ensure the `infrastructure/main.bicep` file is up-to-date.
2.  Run the deployment command from the root directory, targeting the subscription scope:
    ```bash
    az deployment group create --resource-group <TARGET_RG_NAME> --template-file infrastructure/main.bicep --parameters location=uksouth
    ```
    *Note: The `main.bicep` template is now structured to create the Resource Group first, and then deploy all other resources into it. The `--resource-group` parameter in the command should ideally point to a pre-existing group, or you should adjust the command to deploy at the subscription level if the template is designed to create the RG.*

### Step 4: Update Code & Deploy Backend
**Goal:** Connect the backend code to the newly provisioned Cosmos DB.
1.  **Update Credentials:** Manually retrieve the connection string and update the placeholder values in `infrastructure/main.bicep` (or use a separate parameter file).
2.  **Update Code:** Modify the function logic in `server/GetItems/index.js` to use the correct connection string.
3.  **Deploy Code:** Deploy the updated function code to the Function App.

### Step 5: Finalize Frontend Deployment
**Goal:** Point the Static Web App to the correct build output.
1.  (This is often handled automatically by the deployment tool, but if manual steps are needed, ensure the `client/build` folder is correctly linked.)

### Step 4: Update Code & Deploy Backend
**Goal:** Connect the backend code to the newly provisioned Cosmos DB.
1.  **Update Credentials:** Manually retrieve the connection string and update the placeholder values in `infrastructure/main.bicep` (or use a separate parameter file).
2.  **Update Code:** Modify the function logic in `server/GetItems/index.js` to use the correct connection string.
3.  **Deploy Code:** Deploy the updated function code to the Function App.

### Step 5: Finalize Frontend Deployment
**Goal:** Point the Static Web App to the correct build output.
1.  (This is often handled automatically by the deployment tool, but if manual steps are needed, ensure the `client/build` folder is correctly linked.)

---
**Key Takeaway:** The infrastructure deployment (Step 3) creates the *scaffolding*. The code deployment (Step 4) fills the scaffolding with *logic* and *credentials*.

azurite --silent --location .azurite --debug .azurite/debug.log