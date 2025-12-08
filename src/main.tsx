import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import About from './pages/About'
import BlogIndex from './pages/BlogIndexPublic'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import AdminNewPost from './pages/AdminNewPost'
import AdminDashboard from './pages/AdminDashboard'
import AuthCallback from './pages/AuthCallback'
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import PostsListPage from './pages/PostsListPage';
import Events from './pages/Events'
import EventPost from './pages/EventPost'
import CreateEvent from './pages/CreateEvent';
import EventsListPage from './pages/EventsListPage';
import EditEvent from './pages/EditEventPage';
import Exaltations from './pages/Exaltations'
import AdminMeetings from './pages/AdminMeetings'
import AdminMeetingForm from './pages/AdminMeetingForm'
import AdminRecurringMeetingForm from './pages/AdminRecurringMeetingForm'
import AdminLocations from './pages/AdminLocations'
import Membership from './pages/Membership'
import Archway from './pages/Archway'
import Mentoring from './pages/Mentoring'
import AdminFlipbooks from './pages/Adminflipbooks'
import Near1066Meetings from './pages/1066Page'
import NearBrightonMeetings from './pages/BrightonPage'
import NearChichesterMeetings from './pages/ChichesterPage'
import NearWorthingMeetings from './pages/WorthingPage'
import NearCrawleyMeetings from './pages/CrawleyPage'
import NearEastbourneMeetings from './pages/EastbournePage'
import PrivacyPolicy from './pages/PrivacyPolicy'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'events', element: <Events /> },     
      { path: 'events/:slug', element: <EventPost /> },
      { path: 'exaltations', element: <Exaltations /> },
      { path: 'posts', element: <BlogIndex /> },
      { path: 'post/:slug', element: <BlogPost /> },
      { path: 'contact', element: <Contact /> },
      { path: 'membership', element: <Membership /> },
      { path: 'archway', element: <Archway /> },
      { path: 'mentoring', element: <Mentoring /> },
      { path: '1066-royal-arch', element: <Near1066Meetings /> },
      { path: 'near-brighton-royal-arch', element: <NearBrightonMeetings /> },
      { path: 'near-chichester-royal-arch', element: <NearChichesterMeetings /> },
      { path: 'near-worthing-royal-arch', element: <NearWorthingMeetings /> },
      { path: 'near-crawley-royal-arch', element: <NearCrawleyMeetings /> },
      { path: 'near-eastbourne-royal-arch', element: <NearEastbourneMeetings /> },
      { path: 'auth/callback', element: <AuthCallback /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      // Standalone admin login page (not in AdminLayout)
      { path: 'admin/login', element: <AdminNewPost /> },
    ],
  },
  // Admin routes with persistent sidebar
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'posts', element: <PostsListPage /> },
      { path: 'posts/new', element: <CreatePostPage /> },
      { path: 'posts/:id/edit', element: <EditPostPage /> },
      { path: 'events', element: <EventsListPage /> }, 
      { path: 'events/new', element: <CreateEvent /> },
      { path: 'events/:id/edit', element: <EditEvent /> },
      { path: 'meetings', element: <AdminMeetings /> },
      { path: 'meetings/new', element: <AdminMeetingForm /> },
      { path: 'meetings/:id/edit', element: <AdminMeetingForm /> },
      { path: 'meetings/recurring/new', element: <AdminRecurringMeetingForm /> },
      { path: 'meetings/recurring/:id/edit', element: <AdminRecurringMeetingForm /> },
      { path: 'locations', element: <AdminLocations /> },
      { path: 'flipbooks', element: <AdminFlipbooks /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Analytics />
  </React.StrictMode>
)