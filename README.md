# EasyRice Rice Inspection App

A comprehensive full-stack application for managing and calculating rice inspection results.

## 🚀 Getting Started

The easiest way to get the entire stack (Database, Backend, Frontend) running is using Docker.

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running with Docker

1.  **Clone the repository** (if you haven't already).
2.  **Configure environment variables**: Copy the base `.env` file and adjust if necessary.
3.  **Start the application**:
    ```bash
    docker-compose up --build
    ```
4.  **Access the applications**:
    - **Frontend**: [http://localhost:5173](http://localhost:5173)
    - **Backend (API)**: [http://localhost:8000](http://localhost:8000)
    - **pgAdmin (Database Admin)**: [http://localhost:8080](http://localhost:8080)
        - Email: `admin@admin.com`
        - Password: `admin`

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Validation**: `class-validator` & `class-transformer`
- **Documentation**: Swagger/OpenAPI (Access at `/api` when running)

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite + TypeScript)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Routing**: [React Router](https://reactrouter.com/)

---

## 📁 Project Structure

```text
├── backend/               # NestJS Source Code
│   ├── prisma/            # Database schema and seed data
│   ├── src/               # Application logic (modules, services, controllers)
│   └── Dockerfile         # Backend container definition
├── frontend/              # React Source Code
│   ├── src/               # Component, pages, and hooks
│   └── Dockerfile         # Frontend container definition
├── docker-compose.yml     # Multi-container orchestration
└── README.md              # Project documentation
```

---

## 🧪 Development Commands (Local)

If you'd like to run components separately for development:

### Backend
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## ✍️ Authors
- EasyRice Developer Team
- Antigravity AI Assistant
