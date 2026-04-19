# 📋 Smart Job Tracker Dashboard

> React app to manage and analyse job applications — with pipeline tracking, analytics charts, search, filters, and persistent local storage.

---

## 🖼️ Overview

Smart Job Tracker is a single-page React application that helps job seekers centralise and manage all their job applications in one place. Instead of juggling spreadsheets, you can track every application's status, monitor upcoming interviews, search and filter your pipeline, and visualise your progress with charts.

---

## ✨ Features

- **Add & Manage Applications** — Track company, role, location, salary, platform, status, dates, and notes
- **Pipeline Tabs** — Quickly view applications by stage: Applied, Interviewing, Offer, Rejected
- **Debounced Search** — Search by company name or role with a 500ms debounce for performance
- **Filters** — Filter by status, platform, and location type
- **Sorting** — Sort by applied date, salary, or company name
- **Bookmark System** — Save important applications to a dedicated Bookmarks page
- **Analytics Dashboard** — Pie chart of status breakdown, monthly bar chart, interview rate, offer rate, and average salary
- **Local Persistence** — All data is saved to localStorage and survives page refresh
- **Company Logos** — Automatically fetched via the Clearbit Logo API
- **Toast Notifications** — Non-blocking feedback on all add, edit, and delete actions

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Routing | React Router DOM |
| Global State | Context API + useReducer |
| Form Handling | react-hook-form |
| Validation | Yup + @hookform/resolvers |
| Charts | Recharts |
| HTTP Client | Axios |
| Notifications | React Toastify |
| Icons | React Icons (Remix Icons) |
| Date Utilities | date-fns |
| Fonts | DM Serif Display, Outfit, JetBrains Mono |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Navbar/           # Sticky top navigation bar
│   ├── JobCard/          # Table row for each application
│   ├── SearchBar/        # Search input component
│   ├── Filters/          # Status, platform, location filters
│   ├── Charts/           # Pie chart and bar chart (Recharts)
│   └── ApplicationForm/  # Add/Edit modal form
│
├── pages/
│   ├── Dashboard/        # Overview with stats and charts
│   ├── Applications/     # Full application list with search/filter/sort
│   ├── AddApplication/   # Standalone add form page
│   ├── EditApplication/  # Edit form page (/applications/:id)
│   ├── Analytics/        # Detailed metrics and breakdowns
│   └── Bookmarks/        # Saved/bookmarked applications
│
├── context/
│   └── ApplicationContext.jsx  # Global state — useReducer + localStorage
│
├── hooks/
│   └── index.js          # useApplications, useDebounce, useLocalStorage
│
├── services/
│   └── api.js            # Axios — dummyjson API + Clearbit logo API
│
└── utils/
    └── helpers.js        # formatDate, formatSalary, status helpers, constants
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v8 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/job-tracker.git

# 2. Navigate into the project
cd job-tracker

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## 📄 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Redirect | Redirects to `/dashboard` |
| `/dashboard` | Dashboard | Stats cards, charts, upcoming interviews |
| `/applications` | Applications | Full list with search, filter, sort, tabs |
| `/applications/new` | Add Application | Form to add a new application |
| `/applications/:id` | Edit Application | Pre-filled form to edit an existing one |
| `/analytics` | Analytics | Detailed metrics and progress bars |
| `/bookmarks` | Bookmarks | All bookmarked applications |

---

## 🗂️ Data Model

Each application is stored as an object with the following shape:

```js
{
  id:            string,   // auto-generated
  company:       string,   // e.g. "Google"
  role:          string,   // e.g. "Frontend Engineer"
  location:      string,   // "Remote" | "On-site" | "Hybrid"
  salary:        number,   // annual salary in ₹
  platform:      string,   // e.g. "LinkedIn"
  status:        string,   // "Applied" | "Interviewing" | "Offer" | "Rejected"
  appliedDate:   string,   // ISO date string
  interviewDate: string,   // ISO date string (optional)
  notes:         string,   // free text (optional)
  bookmarked:    boolean
}
```

---

## ⚙️ Key Implementation Details

### Local Persistence (no data loss on refresh)

Data is read from `localStorage` **synchronously** before the first render using `useReducer`'s initializer function — not inside a `useEffect`. This prevents the race condition where an empty state would overwrite saved data before the load effect could run.

```js
const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);
```

A `useRef` flag skips the save effect on the very first render, ensuring the loaded data is never immediately overwritten.

### Debounced Search

A custom `useDebounce` hook delays the search computation by 500ms after the user stops typing, preventing unnecessary re-filtering on every keystroke.

```js
const debouncedSearch = useDebounce(searchQuery, 500);
```

### Memoised Filtering

The filtering, searching, and sorting logic in the Applications page is wrapped in `useMemo`, so it only recalculates when its actual inputs change — not on every render.

---

## 📦 NPM Packages Used

```bash
npm install react-router-dom axios react-icons react-toastify recharts react-hook-form yup @hookform/resolvers date-fns framer-motion
```

---

## 🌐 External APIs

| API | Purpose |
|---|---|
| `https://dummyjson.com/products` | Mock job listings data |
| `https://logo.clearbit.com/{domain}` | Company logo images |

---

## 📊 Evaluation Criteria

| Criteria | Weight |
|---|---|
| React Architecture | 25% |
| Feature Completeness | 25% |
| State Management | 20% |
| UI/UX Quality | 15% |
| Code Quality | 15% |

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
