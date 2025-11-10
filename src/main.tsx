import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import About from './pages/About'
import Readings from './pages/Readings'
import Resources from './pages/Resources'
import ResourceDetail from './pages/ResourceDetail';
import RecordedReading from './pages/readings/RecordedReading'
import SpiritualSession from './pages/readings/SpiritualSession'
import FourBlock from './pages/readings/FourSessionBlock'
import Talisman from './pages/readings/Talisman'
import BlogIndex from './pages/BlogIndexPublic'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import Kabbalah from './pages/Kabbalah'
import ShemAngels from './pages/ShemAngels'
import AdminNewPost from './pages/AdminNewPost'
import AdminDashboard from './pages/AdminDashboard'
import AuthCallback from './pages/AuthCallback'
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import PostsListPage from './pages/PostsListPage';
import BookingSuccess from './pages/booking/success';
import Events from './pages/events'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'readings', element: <Readings /> },
      { path: 'spiritual-resources', element: <Resources /> },
      { path: 'resources/:slug', element: <ResourceDetail />},
      { path: 'readings/recorded-reading', element: <RecordedReading /> },
      { path: 'readings/spiritual-session', element: <SpiritualSession /> },
      { path: 'readings/four-session-block', element: <FourBlock /> },
      { path: 'readings/talisman', element: <Talisman /> },
      { path: 'booking/success', element: <BookingSuccess /> },
      { path: 'events', element: <Events /> },
      { path: 'posts', element: <BlogIndex /> },
      { path: 'post/:slug', element: <BlogPost /> },
      { path: 'contact', element: <Contact /> },
      { path: 'kabbalah', element: <Kabbalah /> },
      { path: 'shem-angels', element: <ShemAngels /> },
      { path: 'auth/callback', element: <AuthCallback /> },
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
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)