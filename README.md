# SmartSim Frontend

The **React** web interface for SmartSim: upload an image collection, search it by **text** or by **image**, and explore **clusters** of visually similar pictures. Built with Vite, Tailwind CSS, and Radix UI, and powered by the [SmartSim Backend](https://github.com/SifeYassine/smartsim-backend) (FastAPI + CLIP).

## Features

### 🔍 Search tab
- **Folder upload**: pick a whole directory of images to index in one go
- **Text search**: describe what you're looking for in natural language
- **Image search**: upload a query image (with preview) and find look-alikes
- Adjustable **number of results** and **similarity threshold**
- Result grid with similarity scores

### 🧩 Cluster tab
- Group the indexed images by **max number of clusters** or by **similarity threshold**
- Optional **min / max images per cluster** filters
- Browse clusters one at a time with **previous / next** navigation

### General
- **Light / dark theme** toggle (remembered in `localStorage`)
- Toast notifications for uploads, searches, and errors
- Responsive layout

## Tech Stack

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/) + `tailwindcss-animate`
- [Radix UI](https://www.radix-ui.com/) primitives, `class-variance-authority`, `tailwind-merge`
- [lucide-react](https://lucide.dev/) icons
- [Axios](https://axios-http.com/) for API calls

## Project Structure

```
smartsim-frontend/
├── src/
│   ├── App.jsx                     # Tabs + theme handling
│   ├── main.jsx
│   ├── components/
│   │   ├── Header.jsx              # Title, tab switcher, theme toggle
│   │   ├── SearchTab.jsx           # Folder upload, text & image search
│   │   ├── SearchResults.jsx
│   │   ├── ClusterTab.jsx          # Clustering parameters
│   │   ├── ClusterResults.jsx      # Cluster navigation
│   │   ├── ImageGrid.jsx
│   │   └── NotificationToast.jsx
│   ├── context/
│   │   └── NotificationProvider.jsx
│   └── lib/
│       ├── api.js                  # Axios instance (API base URL)
│       └── utils.js                # cn() helper, theme toggle
├── index.html
├── vite.config.js                  # Dev server on port 3000, "@" alias
└── tailwind.config.js
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- The [SmartSim Backend](https://github.com/SifeYassine/smartsim-backend) running on `http://127.0.0.1:8000`

### Installation

```bash
git clone https://github.com/SifeYassine/smartsim-frontend.git
cd smartsim-frontend
npm install
```

### Configuration

The API URL is set in `src/lib/api.js`:

```js
export const API_BASE_URL = "http://127.0.0.1:8000";
```

Change it if your backend runs elsewhere.

### Run

```bash
npm run dev
```

Open <http://localhost:3000>.

### Build for production

```bash
npm run build
npm run preview
```

## Usage

1. Start the backend, then the frontend.
2. In the **Search** tab, upload a folder of images to index them.
3. Search by typing a description, or upload a query image.
4. Switch to the **Cluster** tab, set either a cluster count or a similarity threshold, and browse the resulting groups.

## Related Repositories

- [smartsim-backend](https://github.com/SifeYassine/smartsim-backend): FastAPI + CLIP + sqlite-vec API
- [smartsim](https://github.com/SifeYassine/smartsim): original desktop (CustomTkinter) version

## Author

**Sifeddine Yassine** · [@SifeYassine](https://github.com/SifeYassine)
