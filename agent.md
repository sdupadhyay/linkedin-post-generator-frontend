# Developer Hand-Off Guide: AI LinkedIn Post Generator Frontend

This document outlines the architecture, visual system, state workflows, and future integration blueprints for the frontend of the **AI LinkedIn Post Generator**.

---

## 1. Project Specifications

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (latest stable) using CSS-first customizations in [src/index.css](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/index.css)
- **Icons**: [lucide-react](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/package.json)
- **Local Dev Server**: Runs on [http://localhost:5174/](http://localhost:5174/) (default fallback if 5173 is in use)

---

## 2. Design System & Theme variables

The interface is styled in a **warm light mode theme** using a **Sand, Cream & Espresso** color palette. All theme properties are defined in [src/index.css](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/index.css) inside `@theme`:

- **Background**: `--color-warm-bg` (`#fdfbf7`) — Ivory cream base
- **Cards**: `--color-warm-card` (`#ffffff`) — Pure white with subtle borders
- **Borders**: `--color-warm-border` (`rgba(74, 55, 40, 0.07)`) — Soft mocha borders
- **Text (Primary)**: `--color-text-main` (`#231b15`) — Deep charcoal-brown
- **Text (Secondary)**: `--color-text-dim` (`#786a60`) — Warm clay
- **Tailwind Mappings**: Utility color channels (like `indigo` and `purple`) are mapped directly to `brand-espresso` (`#4a3728`) and `brand-caramel` (`#b45309`) to ensure design alignment with minimal code modifications.

---

## 3. Directory & Component Structure

All UI layouts reside under [src/components/](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/components):

| Component File | Role / Responsibility |
| :--- | :--- |
| [App.tsx](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/App.tsx) | Orchestrator & router state-machine; runs local heuristics for profile classification and manages `localStorage`. |
| [Auth.tsx](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/components/Auth.tsx) | Credentials login form validation and mock Google OAuth hooks. |
| [Onboarding.tsx](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/components/Onboarding.tsx) | Expansive card inputs, validation rules (min 5 posts with 50+ chars), character counters, and sample preloads. |
| [Loader.tsx](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/components/Loader.tsx) | Pulser orb loading indicator with rotating AI statuses for hook, tone, and spacing parsing. |
| [ProfileDashboard.tsx](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/components/ProfileDashboard.tsx) | Transforms profile DNA JSON schema metrics into interactive gauges, sliders, and badges with inline saving. |
| [TopicGenerator.tsx](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/components/TopicGenerator.tsx) | Category tiles, topic description matrices, regeneration loops, and selected states. |

---

## 4. State Machine & LocalStorage Schema

Application navigation views follow: `AUTH` ➔ `ONBOARDING` ➔ `LOADING` ➔ `DASHBOARD` ➔ `TOPIC_GENERATION`.

### LocalStorage Keys:
- **`lpg_user_email`**: Holds the currently logged-in user email. Used for retrieving profiles on reload.
- **`lpg_profile_${email}`**: Stores the generated writing DNA profile as a serialized JSON object.

*Persistence Rule*: On application initialization, if `lpg_user_email` and `lpg_profile_${email}` exist, the onboarding flow is skipped, launching the user directly into the dashboard.

---

## 5. API Integration Blueprint (Phase 2 Roadmap)

When connecting the real backend APIs, replace the following mock handlers:

### A. Authentication
- **Location**: [src/components/Auth.tsx](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/components/Auth.tsx) (in `handleSubmit` and `handleGoogleLogin`)
- **Integration**:
  - Replace the `setTimeout` simulation with a call to your auth endpoints: `POST /api/v1/auth/login` or your OAuth provider callback.
  - Return the authenticated user object/JWT token and call `onLoginSuccess(email)`.

### B. Uploading Posts & Profile Generation
- **Location**: [src/App.tsx](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/App.tsx) (in `handleLoaderComplete` and `handleOnboardingSubmit`)
- **Integration**:
  - Instead of computing dynamic DNA heuristics locally, send a `POST` request to the backend:
    ```typescript
    // POST /api/v1/profile/generate
    const response = await fetch('/api/v1/profile/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ posts: temporaryPosts })
    });
    const profileData = await response.json();
    setProfile(profileData);
    ```

### C. Live Profile Modification
- **Location**: [src/components/ProfileDashboard.tsx](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/components/ProfileDashboard.tsx) (in `handleSave`)
- **Integration**:
  - When the user edits and saves style characteristics, push updates to the backend: `PUT /api/v1/profile/update` sending the modified schema, then invoke `onUpdateProfile(updated)`.

### D. Topic Generation
- **Location**: [src/components/TopicGenerator.tsx](file:///Users/hexahealth/Documents/Personal/linkedin-post-generator-frontend/src/components/TopicGenerator.tsx) (in `handleGenerate`)
- **Integration**:
  - Replace the static `MOCK_TOPICS` list with an HTTP call:
    ```typescript
    // GET /api/v1/topics?profileId=xxx
    const response = await fetch(`/api/v1/topics?profileId=${profileId}`);
    const data = await response.json();
    setTopics(data.topics);
    ```
