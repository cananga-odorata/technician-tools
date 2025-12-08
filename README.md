# Tool Technician Dashboard

A modern, high-performance dashboard for technicians to manage fleet operations, view history logs, and perform diagnostics. Built with SolidJS, TailwindCSS, and Docker.

## Features

- **Dashboard**: Real-time overview of assigned tasks and fleet status.
- **History Log**: Detailed activity logs with filtering (date range, serial number, quick filters).
- **Vehicle Management**: View and manage fleet vehicles/products.
- **Responsive Design**: Optimized for desktop and tablet use.
- **Dark/Light Mode**: (If applicable, based on previous context)

## Tech Stack

- **Frontend Framework**: [SolidJS](https://www.solidjs.com/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [Solid Router](https://github.com/solidjs/solid-router)
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (Alpine)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn
- [Docker](https://www.docker.com/) & Docker Compose (for containerized deployment)

### Local Development

1.  **Install dependencies:**

    ```bash
    pnpm install
    ```

2.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    Open [http://localhost:5173](http://localhost:5173) to view the app.

3.  **Build for production:**

    ```bash
    pnpm build
    ```

## Docker Deployment

This project includes a production-ready Docker setup using a multi-stage build (Node.js for building, Nginx for serving).

### Running with Docker Compose

1.  **Build and start the container:**

    ```bash
    docker-compose up --build -d
    ```

2.  **Access the application:**

    Open [http://localhost:8080](http://localhost:8080) in your browser.

3.  **Stop the container:**

    ```bash
    docker-compose down
    ```

### Docker Configuration Details

- **Dockerfile**: Uses `node:20-alpine` for the build stage and `nginx:alpine` for the production image to ensure a small footprint.
- **nginx.conf**: Custom configuration to handle SPA routing (redirecting 404s to `index.html`) and enable Gzip compression for performance.
- **docker-compose.yml**: Maps container port 80 to host port 8080.

## Project Structure

```
.
├── src/                # Source code
│   ├── components/     # Reusable components
│   ├── pages/          # Page components (Dashboard, VehicleHistory, etc.)
│   ├── services/       # API services
│   └── ...
├── public/             # Static assets
├── Dockerfile          # Docker build instructions
├── docker-compose.yml  # Docker orchestration
├── nginx.conf          # Nginx configuration
└── ...
```
