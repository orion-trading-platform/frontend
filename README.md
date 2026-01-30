## 🗺️ Project Structure (Where do I work?)

We use a **Monorepo** structure. Code is split between `apps` (websites) and `packages` (shared tools).

```text
root/
├── apps/
│   ├── web_client/          <-- 🚨 MOST WORK HAPPENS HERE
│   │   ├── src/
│   │   │   ├── features/    <-- 📂 YOUR TEAM LIVES HERE, BRANCH OUT AND CREATE A FOLDER
│   │   │   │   ├── auth/       (Team A)
│   │   │   │   ├── dashboard/  (Team B)
│   │   │   │   ├── ledger/     (Team C)
│   │   │   │   └── ordering/   (Team D)
│   │   │   └── assets/      <-- Images and other assets (SVGs, etc.)
│   │   └── public/          <-- Pages allow us to combine features
│   
│
├── packages/                <-- SHARED CODE (Do not duplicate!)
│   ├── ui-kit/              <-- Generic Buttons, Inputs, Cards
│   ├── ts-types/            <-- Shared Interfaces (User, Stock, Trade)
│   └── styles/              <-- Global CSS variables & colors
```

### Developer Guide

Follow these steps to get started on developing:

### Installation

1. Find or create a directory to store the code and CD into it from your terminal

   ```bash
   cd your/directory/filepath
   ```

2. Clone this repository

   ```bash
   git clone https://github.com/COMP413-S26/comp413frontend.git
   ```

**Note:** If prompted for credentials, you may need to use a [GitHub Personal Access Token (classic)](https://github.com/settings/tokens) as your password.

3. CD into the repository

   ```bash
   cd comp413frontend
   ```

4. Install dependencies

   ```bash
   npm install
   ```

5. CD into the web app

   ```bash
   cd apps/web_client
   ```

6. Set up environment variables

   ```bash
   cp .env.example .env
   ```

  - Edit `.env` and fill in any required values

7. Start the development server

   ```bash
    npm run start
   ```
   
8. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) (or your configured port)

### Contributing

In order to contribute, you can make edits on your own development branch. To do so, create a new branch from your command line:

`git checkout -b my-new-branch`
From here, all your changes should be pushed to this branch, and not main.

When you are done working on your feature, submit a pull request through GitHub where it can be peer reviewed and tested before it is merged with main.