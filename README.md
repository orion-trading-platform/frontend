## 🗺️ Project Structure (Where do I work?)

We use a **Monorepo** structure. Code is split between `apps` (websites) and `packages` (shared tools).

```text
root/
├── apps/
│   ├── web_client/          <-- 🚨 MOST WORK HAPPENS HERE
│   │   ├── src/
│   │   │   ├── features/    <-- 📂 YOUR TEAM LIVES HERE, BRANCH OUT AND CREATE A FOLDER
│   │   │   │   ├── dashboard/  (Team A)
│   │   │   │   ├── ledger/     (Team B)
│   │   │   │   └── ordering/   (Team C)
│   │   │   └── public/       <-- Pages allow us to combine features
│   
│
├── packages/                <-- SHARED CODE (Do not duplicate!)
│   ├── ui-kit/              <-- Generic Buttons, Inputs, Cards
│   ├── ts-types/            <-- Shared Interfaces (User, Stock, Trade)
│   └── styles/              <-- Global CSS variables & colors