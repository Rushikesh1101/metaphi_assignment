# Task Management Application

This project is a **Task Management Application** built using **Django** for the backend, **React** for the frontend, along with **Redux Toolkit** for state management, and **Tailwind CSS** and **Material-UI (MUI)** for styling.

---

## Basic Instructions

### Clone the Repository
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/Rushikesh1101/metaphi_assignment.git
   cd metaphi_assignment
   ```

### Run the Application

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd task_tracker
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```

---

## License
This project is licensed under the MIT License.

