
### Installation Instructions for vite and react using node.js

1. **Ensure Node.js is installed**:
   You need Node.js installed on your machine. If Node.js is not already installed, download and install the latest version from [nodejs.org](https://nodejs.org/).

   Verify the installation by running:

   ```bash
   node -v
   npm -v
   ```

   Optionally, if you prefer to use Yarn instead of npm, install Yarn globally:

   ```bash
   npm install -g yarn
   ```

   Verify Yarn installation:

   ```bash
   yarn -v
   ```

2. **Clone the repository**:
   Navigate to the directory where you want to install the project and clone the repository:

   ```bash
   git clone https://github.com/yourusername/presale-dapp.git
   ```

   Then, change to the project directory:

   ```bash
   cd presale-dapp
   ```

3. **Install project dependencies**:
   After navigating to the project directory, install the required dependencies.

   Using Yarn:

   ```bash
   yarn install
   ```

   Using npm:

   ```bash
   npm install
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory of your project (if it doesn't already exist) and add any necessary environment variables. For example:

   ```bash
   VITE_PROJECT_ID=your-project-id-here
   ```

   Replace `your-project-id-here` with the actual project ID for your Reown app.

5. **Start the development server**:
   Once the dependencies are installed, start the development server.

   Using Yarn:

   ```bash
   yarn dev
   ```

   Using npm:

   ```bash
   npm run dev
   ```

   This will start the development server, and your app should be accessible at `http://localhost:3000` (or another specified port).

---

Let me know if you need more help with the installation steps!
