# Kontent.ai Smart Link React Demo

This is a React + TypeScript + Vite application demonstrating Kontent.ai Smart Link functionality for live preview and in-context editing.

## Getting Started

### 1. Install Dependencies

First, install the project dependencies:

```bash
npm ci
```

### 2. Import Project Data

Import the project structure and content from the backup using npx:

```bash
npx @kontent-ai/data-ops@latest environment restore -e <env-id> -k <mapi-key> --fileName=backup/project.zip
```

### 3. Configure Environment Variables

1. Create a `.env` file in the project root
2. Copy the following template and fill in your actual values:

```env
# Kontent.ai Environment Configuration
VITE_KONTENT_ENV_ID=your-environment-id-here
VITE_KONTENT_DELIVERY_KEY=your-delivery-api-key-here
```

**Where to find these values:**
- **Environment ID**: Go to your Kontent.ai project → Environment settings → API keys
- **Delivery API Key**: Use your Preview API key for live preview functionality

### 4. Run the Development Server

Start the development server:

```bash
npm run dev
```

The application will start on `https://localhost:5173` (note: HTTPS is required for Smart Link functionality).

### 5. Test in Kontent.ai Live Preview

1. In your Kontent.ai project, go to the content item you want to preview
2. Click the "Preview" button 
3. Set up your Live Preview URL to point to: `https://localhost:5173?preview=true`
4. You should now see the Smart Link overlays and be able to edit content in context


## Development Notes

- The app uses Vite with basic SSL to serve HTTPS locally (required for Smart Link)
- Content models are auto-generated using `@kontent-ai/model-generator`
- Smart Link is initialized in the `SmartLinkContext` provider
