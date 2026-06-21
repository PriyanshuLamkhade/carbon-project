# 🌿 Carbon Credit Platform

A full-stack decentralized platform for managing blue carbon credits — enabling landowners to register mangrove/forest projects, get them validated on-chain, earn **C2 tokens** as carbon credits, and trade them in a peer-to-peer marketplace. Industries can purchase and retire these tokens to offset their carbon footprint and receive verifiable certificates.

---

## 📦 Project Structure

```
Carbon-project/
├── client/          # Next.js frontend (TypeScript + Tailwind)
├── server/          # Express.js backend (TypeScript + Prisma + PostgreSQL)
└── contracts/       # Solidity smart contracts (Ethereum / Sepolia testnet)
    ├── C2Token.sol                  # ERC-20 carbon credit token
    ├── BlueCarbonRegistory.sol      # On-chain monitoring record registry
    └── MarketPlace.sol              # P2P token marketplace
```

---

## 🔑 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, ethers.js |
| Backend | Express.js 5, TypeScript, Prisma ORM, PostgreSQL |
| Blockchain | Solidity ^0.8.20, Ethereum Sepolia Testnet |
| Storage | Cloudinary (images) |
| Auth | JWT, Google OAuth 2.0 |
| AI | Groq SDK, OpenAI |
| Maps | Leaflet.js, Turf.js |

---

## ✅ Prerequisites

Make sure the following are installed on your machine before proceeding:

- **Node.js** v18+ — [Download](https://nodejs.org)
- **pnpm** — `npm install -g pnpm`
- **Git** — [Download](https://git-scm.com)
- A **MetaMask** wallet (browser extension) with Sepolia ETH
- A **PostgreSQL** database (local or cloud — [Neon](https://neon.tech) recommended)

---

## 🚀 Step-by-Step Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/carbon-project.git
cd carbon-project
```

---

### Step 2 — Gather API Keys

You will need the following API keys/credentials before proceeding. Collect them all before configuring any `.env` files.

#### 🐘 PostgreSQL / Neon Database

1. Go to [https://neon.tech](https://neon.tech) and create a free account.
2. Create a new project and copy the **Connection String** (starts with `postgresql://...`).

#### 🔐 Google OAuth Credentials

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com).
2. Create a new project (or use an existing one).
3. Navigate to **APIs & Services → Credentials**.
4. Click **Create Credentials → OAuth 2.0 Client ID**.
5. Set Application type to **Web application**.
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000` (for development)
7. Copy the **Client ID** and **Client Secret**.

#### ☁️ Cloudinary (Image Storage)

1. Sign up at [https://cloudinary.com](https://cloudinary.com).
2. From your dashboard, copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

#### ⛓️ Ethereum / Alchemy RPC (Sepolia Testnet)

1. Go to [https://www.alchemy.com](https://www.alchemy.com) and create an account.
2. Create a new app → select **Ethereum** → **Sepolia** network.
3. Copy the **HTTPS URL** (e.g., `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`).
4. Export your deployer wallet's **private key** from MetaMask:
   - MetaMask → Account Details → **Show private key** → enter your MetaMask password → copy the 64-character hex string.
   - ⚠️ **Never share or commit your private key.**
5. Fund your deployer wallet with Sepolia ETH from [https://sepoliafaucet.com](https://sepoliafaucet.com).

#### 🤖 Groq API Key (AI features)

1. Sign up at [https://console.groq.com](https://console.groq.com).
2. Go to **API Keys** and create a new key.
3. Copy the key (starts with `gsk_...`).

---

### Step 3 — Deploy the Smart Contracts

The contracts are standard Solidity files. Use [Remix IDE](https://remix.ethereum.org) for the easiest deployment.

#### 3.1 — Open Remix IDE

1. Go to [https://remix.ethereum.org](https://remix.ethereum.org).
2. Create a new workspace or use the default one.

#### 3.2 — Add Contract Files

1. In the **File Explorer** panel, create the following files and paste in the content from the `contracts/` folder:
   - `C2Token.sol`
   - `BlueCarbonRegistory.sol`
   - `MarketPlace.sol`

#### 3.3 — Compile the Contracts

1. Click the **Solidity Compiler** tab (second icon on the left).
2. Set compiler version to **0.8.20** or higher.
3. Compile **C2Token.sol** first, then **BlueCarbonRegistory.sol**, then **MarketPlace.sol**.

#### 3.4 — Connect MetaMask to Sepolia

1. Open MetaMask and switch network to **Sepolia Testnet**.
2. Make sure your wallet has Sepolia ETH (use the faucet from Step 2 if needed).

#### 3.5 — Deploy C2Token

1. Click the **Deploy & Run Transactions** tab (fourth icon).
2. Set **Environment** to **Injected Provider - MetaMask**.
3. Select **C2Token** from the contract dropdown.
4. Click **Deploy** and confirm in MetaMask.
5. Copy the deployed contract address — this is your `TOKEN_ADDRESS`.

#### 3.6 — Deploy BlueCarbonRegistory (Monitoring Contract)

1. Select **CarbonMonitoringRegistry** from the contract dropdown.
2. Click **Deploy** and confirm in MetaMask.
3. Copy the deployed address — this is your `MONITORING_CONTRACT`.

#### 3.7 — Deploy MarketPlace

1. Select **C2Marketplace** from the contract dropdown.
2. In the constructor input field, paste your `TOKEN_ADDRESS` from Step 3.5.
3. Click **Deploy** and confirm in MetaMask.
4. Copy this address — it's your marketplace contract address (used in the frontend).

#### 3.8 — Grant MINTER_ROLE to the Server Wallet

The backend server mints tokens on behalf of the platform. You need to give the server wallet minting permissions.

1. Under **Deployed Contracts**, expand **C2TOKEN**.
2. Find the `grantRole` function.
3. Fill in the two fields:
   - **`role`**: paste exactly this value:
     ```
     0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6
     ```
     *(this is the keccak256 hash of `"MINTER_ROLE"` — do not change it)*
   - **`account`**: paste the **public address** of the wallet whose private key you'll use as `PRIVATE_KEY`.
4. Click **transact** and confirm in MetaMask.

---

### Step 4 — Configure the Server

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in all values:

```env
# PostgreSQL connection string (from Step 2)
DATABASE_URL='postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require'

# JWT secrets — use any long random strings
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_USER_SECRET="your_user_jwt_secret"
JWT_ADMIN_SECRET="your_admin_jwt_secret"
JWT_INDUSTRY_SECRET="your_industry_jwt_secret"

# Google OAuth (from Step 2)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary (from Step 2)
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_SECRET_KEY=your_cloudinary_api_secret

# Alchemy RPC URL for Sepolia (from Step 2)
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Private key of the server wallet (from Step 2)
# ✅ Correct:  e7ba2029cefa32efdb420773dd88891101bfa0e35fe95053887bfff4022f4b7b
# ❌ Wrong:    0xe7ba2029...   ← no 0x prefix
# ❌ Wrong:    "e7ba2029..."   ← no quotes
PRIVATE_KEY=your_64_character_hex_private_key

# Contract addresses from Remix deployment (from Step 3)
TOKEN_ADDRESS=0xYourDeployedC2TokenAddress
MONITORING_CONTRACT=0xYourDeployedMonitoringContractAddress

# Groq AI (from Step 2)
GROQ_API_KEY=gsk_your_groq_api_key
```

#### Install dependencies

```bash
pnpm install
```

#### Run Prisma migrations

```bash
# Generate the Prisma client (always run this first)
pnpm prisma generate

# First-time setup — creates all tables from scratch
pnpm prisma migrate dev

# OR if re-deploying on an existing database
pnpm prisma migrate deploy
```

#### Start the server

```bash
pnpm dev
```

The server will start at `http://localhost:4000`.

---

### Step 5 — Configure the Client

Open a new terminal window:

```bash
cd client
cp .env.example .env
```

Open `client/.env` and fill in:

```env
# URL of your running backend server
NEXT_PUBLIC_API_URL=http://localhost:4000

# Google OAuth Client ID (same as server — only the ID, not the secret)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Deployed contract addresses (from Step 3)
NEXT_PUBLIC_TOKEN_ADDRESS=0xYourDeployedC2TokenAddress
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0xYourDeployedMarketplaceAddress
NEXT_PUBLIC_MONITORING_CONTRACT=0xYourDeployedMonitoringContractAddress
```

> **Note:** All client-side env variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

#### Install dependencies

```bash
pnpm install
```

#### Start the development server

```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000`.

---

## 🗄️ Database Management

### View your database visually

```bash
cd server
pnpm prisma studio
```

This opens Prisma Studio at `http://localhost:5555` — a visual interface for your database.

### Reset database (⚠️ deletes all data)

```bash
pnpm prisma migrate reset
```

### Create a new migration after schema changes

```bash
pnpm prisma migrate dev --name your_migration_name
```

---

## 🏗️ Build for Production

### Server

```bash
cd server
pnpm build    # compiles TypeScript to dist/
pnpm start    # runs the compiled output
```

### Client

```bash
cd client
pnpm build    # creates optimized Next.js production build
pnpm start    # serves the production build
```

---

## 🧩 How It All Connects

```
Browser (Next.js)
    │
    ├── REST API calls ──────────────► Express Server (port 4000)
    │                                       │
    │                                       ├── PostgreSQL (via Prisma)
    │                                       ├── Cloudinary (image uploads)
    │                                       ├── Google OAuth
    │                                       ├── Groq AI
    │                                       └── Ethereum RPC (minting tokens)
    │
    └── Direct on-chain calls ──────► Ethereum Sepolia
                                           ├── C2Token.sol (ERC-20)
                                           ├── BlueCarbonRegistory.sol
                                           └── MarketPlace.sol
```

---

## ❓ Common Issues

| Problem | Solution |
|---------|----------|
| `prisma migrate` fails | Check that `DATABASE_URL` is correct and the DB is reachable |
| MetaMask not connecting | Make sure MetaMask is set to **Sepolia** network |
| Token minting fails | Verify the server wallet has `MINTER_ROLE` (Step 3.8) and `PRIVATE_KEY` has no `0x` prefix |
| CORS errors in browser | Ensure `NEXT_PUBLIC_API_URL` points to `http://localhost:4000` |
| Google login not working | Check that `http://localhost:3000` is in your OAuth redirect URIs |
| `pnpm install` fails | Run `node -v` to confirm Node 18+; try deleting `node_modules` and retry |
| Image uploads not working | Check all three `CLOUD_*` variables in `server/.env` |

---

## 📄 License

MIT
