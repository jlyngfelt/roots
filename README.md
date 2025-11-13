# Roots 🌱

A React Native plant-sharing community app built with React Native, Firebase, Expo and TypeScript. Share and swap plant cuttings with people in your area—completely free.

## Overview

Roots enables plant enthusiasts to give away or trade plant cuttings within their community. Users can browse available plants nearby, chat with other growers, and earn credits for successful plant adoptions.

**Key Features:**

- Browse plants by location and category
- Real-time messaging between users
- Credit system for tracking successful adoptions
- QR code-based plant transfer verification
- Favorites system to save plants
- User profiles with postal code-based location tracking

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based routing)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **UI Libraries:** Tamagui, React Native Elements
- **Testing:** Jest, React Native Testing Library

## Project Structure

```
├── app/                          # Expo Router pages
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── explore.tsx          # Browse plants
│   │   ├── messages.tsx         # Chat list
│   │   ├── upload.tsx           # Create new plant listing
│   │   ├── favourites.tsx       # Favorited plants
│   │   ├── index.tsx            # User profile
│   │   ├── settings.tsx         # App settings
│   │   └── view-plant/          # Plant detail views
│   └── auth/                    # Authentication screens
├── components/                   # Reusable UI components
│   ├── ui/                      # Atomic components
│   ├── GiveAwayPlant.tsx        # QR code generation
│   └── ScanTransferCode.tsx     # QR code scanning
├── services/                     # Firebase & external services
├── contexts/                     # React Context (AuthContext)
├── constants/                    # Design system & config
├── utils/                        # Helper functions
└── interfaces/                   # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd roots
```

2. Install dependencies:

```bash
npm install
```

3. Configure Firebase:

   - Update `firebaseConfig.js` with your Firebase project credentials
   - Ensure Firestore collections are set up (users, plants, categories, chats, transfers)

4. Start development:

```bash
npm start
```

Then open the app in:

- iOS Simulator: `i`
- Android Emulator: `a`
- Expo Go: Scan QR code on your phone

## Key Features

### Plant Discovery & Browsing

- Filter by category and adoption status
- Sort by distance, name, or date
- Search plants and users
- Real-time distance calculations based on postal codes

### Messaging

- Real-time chat with other users
- Unread message counts
- Message timestamps and date headers
- Notification badges

### Plant Adoption Workflow

1. Plant owner marks plant as "ready to adopt"
2. Interested user contacts via messaging
3. Owner generates 5-digit code or QR code
4. Buyer scans code to verify transfer
5. Owner receives 100 credits

### User Profiles

- Customizable username, bio, and profile picture
- Credits display
- Plant listing showcase
- Location-based on postal code

## Architecture

### Authentication Flow

- Firebase Authentication with email verification
- Persistent auth state using AsyncStorage
- Protected routes in AuthContext

### Data Structure

- **Users:** profiles, posts, favorites, credits
- **Plants:** listings with multi-image support, categories
- **Chats:** real-time messaging with unread counts
- **Transfers:** plant adoption verification codes

### State Management

- AuthContext for user state
- Local component state with hooks
- Firebase real-time listeners for data updates

## Testing

Run tests:

```bash
npm test
```

Current test coverage includes:

- Button component behavior
- Distance calculations
- Form validation utilities

## Configuration

### Design System

All styling uses constants defined in `constants/design-system.ts`:

- **Colors:** Primary, secondary, accent, text, warning, etc.
- **Typography:** Poppins font family with predefined sizes and weights
- **Spacing:** Consistent spacing scale (xs to 4xl)
- **Border Radius:** Reusable border radius values

### Firebase Collections

- `users/` - User profiles and settings
- `plants/` - Plant listings
- `categories/` - Plant categories
- `chats/{chatId}/messages` - Real-time messaging
- `transfers/` - Plant adoption codes

## Deployment

### Build for iOS/Android

```bash
# Build locally
eas build --platform ios
eas build --platform android

# Or use Expo Go for development
npx expo start
```

See [Expo documentation](https://docs.expo.dev) for detailed deployment instructions.

## Future Enhancements

- Plant care tips and guides
- Advanced search with radius filtering
- Plant species recognition via ML
- Community forums/discussions
- Badge/achievement system

## License

MIT License - See LICENSE file for details

## Authors

**Anna Dahlberg**
**Julia Lyngfelt**

---
