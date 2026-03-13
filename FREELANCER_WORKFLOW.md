# Nexus Freelancer Workflow & Bidding System

## 1. Overview
Nexus is a high-performance freelance ecosystem where Freelancers (Talent) connect with Organizations (Clients) through a real-time, 3D-visualized marketplace. The interaction model is designed to be low-friction and data-driven.

## 2. Freelancer Interaction Flow

### Phase A: Authentication & Role Selection
*   **Entry**: Users land on the `LoginPage`.
*   **Role Identification**: Users must select the "FREELANCER" role to access the talent-specific HUD and tools.
*   **Session Management**: Auth is handled via Supabase GoTrue. Once logged in, the `userStore` (Zustand) persists the session and role globally.

### Phase B: Discovery & The Nexus Core
*   **Visual Exploration**: Freelancers interact with the `NexusConstellations` (3D Starfield). Each "star" represents an active mission/project.
*   **Filtering**: The `AI Interface` allows freelancers to find missions by tech stack (e.g., "Show me React projects").
*   **Inspection**: Hovering over a project star pulls metadata into the HUD (Title, Category, Budget).

### Phase C: Bidding (The Mission Lifecycle)
*   **Bidding Editor**: When a mission is selected, the `BiddingEditor` component activates in the HUD.
*   **Input**: The freelancer enters a bid amount in INR (₹) and a brief professional message.
*   **Submission**: Bids are inserted into the `bids` table in Supabase, linked to the freelancer's `profile_id` and the `mission_id`.
*   **RLS Security**: Row Level Security ensures that freelancers can only see their own bids, while mission owners (Organizations) can see all bids for their projects.

## 3. The Bidding Mechanism (Technical Logic)
1.  **Selection**: `useExploreStore` tracks the currently selected mission.
2.  **Validation**: The system checks if the user is authenticated as a freelancer. 
3.  **Transmission**: A `POST` request (via Supabase client) sends the bid data.
4.  **Feedback**: `sonner` notifications confirm successful bid placement or intercept errors (e.g., duplicate bids).
5.  **Organization Review**: Organizations see incoming bids in their management HUD and can initiate "Connections" for negotiation.

## 4. Key Components
*   `SceneWrapper.tsx`: Isolation for the 3D interaction layer.
*   `BiddingEditor.tsx`: The primary interface for bid placement.
*   `NexusConstellations.tsx`: The navigational logic for mission discovery.
*   `userStore.ts`: Tracks state and permissions.
