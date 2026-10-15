import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { NextUpPage } from '@/features/feed/NextUpPage'
import { PlacePage } from '@/features/places/PlacePage'
import { WishlistPage } from '@/features/wishlist/WishlistPage'
import { PassportPage } from '@/features/passport/PassportPage'
import { QuestPage } from '@/features/quests/QuestPage'
import { OnboardingPage } from '@/features/onboarding/OnboardingPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { AuthGate } from '@/features/auth/AuthGate'
import { LoginPage } from '@/features/auth/LoginPage'
import { LogRoute } from './LogRoute'

export const router = createBrowserRouter([
  { path: 'login', element: <LoginPage /> },
  {
    element: <AuthGate />,
    children: [
      { path: 'log', element: <LogRoute /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      {
        element: <AppShell />,
        children: [
          { index: true, element: <NextUpPage /> },
          { path: 'wishlist', element: <WishlistPage /> },
          { path: 'passport', element: <PassportPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'places/:id', element: <PlacePage /> },
          { path: 'quests/:id', element: <QuestPage /> },
        ],
      },
    ],
  },
])
