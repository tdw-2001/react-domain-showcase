import React, { useState, useEffect, useMemo, useCallback, Suspense, useRef, lazy, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Outlet } from 'react-router-dom';
import { Domain } from './types';
import { NAV_ITEMS } from './constants';
import { generateDataInsights, generateBlogPost, generateConfiguratorDescription } from './services/geminiService';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGemini } from './hooks/useGemini';
import { ThemeContext } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Modal from './components/Modal';

// To satisfy TypeScript for the Recharts library loaded from a CDN
declare const window: any;

// LAZY LOADED DOMAIN VIEWS
const DashboardView = lazy(() => import('./views/DashboardView'));
const AnalyticsView = lazy(() => import('./views/AnalyticsView'));
const MobilePreviewView = lazy(() => import('./views/MobilePreviewView'));
const BlogView = lazy(() => import('./views/BlogView'));
const ConfiguratorView = lazy(() => import('./views/ConfiguratorView'));


// --- UTILITY/HELPER COMPONENTS ---

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`
    bg-brand-bg-light dark:bg-brand-bg-light 
    border border-brand-border-light dark:border-brand-border 
    rounded-lg shadow-lg p-6 ${className}
    text-brand-text-primary-light dark:text-brand-text-primary`}>
    {children}
  </div>
);

export const InfoBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 border-l-4 border-brand-blue rounded-r-lg text-brand-text-secondary-light dark:text-gray-300">
        <div className="flex">
            <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-brand-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="ml-3">
                <p className="text-sm">{children}</p>
            </div>
        </div>
    </div>
);

export const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
    </div>
);


// --- LAYOUT COMPONENTS ---

const Sidebar: React.FC<{ onOpenModal: () => void; }> = ({ onOpenModal }) => {
    const location = useLocation();
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <aside className="w-64 bg-brand-bg-light-accent dark:bg-brand-bg-light p-4 flex-col border-r border-brand-border-light dark:border-brand-border hidden md:flex">
            <h1 className="text-2xl font-bold text-brand-text-primary-light dark:text-white mb-8 px-2">Project Fusion</h1>
            <nav className="flex flex-col space-y-2 flex-grow">
                {NAV_ITEMS.map(item => (
                    <Link key={item.domain} to={item.path} className={`flex items-center p-3 rounded-lg text-left transition-colors ${location.pathname === item.path ? 'bg-brand-blue text-white shadow-lg' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-brand-text-secondary-light dark:text-gray-300'}`}>
                        <item.icon className="w-6 h-6 mr-3 flex-shrink-0" />
                        <span>{item.domain}</span>
                    </Link>
                ))}
            </nav>
            <div className="mt-auto space-y-2">
                 <button onClick={onOpenModal} className="w-full flex items-center p-3 rounded-lg text-left transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 text-brand-text-secondary-light dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
                    <span>About</span>
                </button>
                <button onClick={toggleTheme} className="w-full flex items-center p-3 rounded-lg text-left transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 text-brand-text-secondary-light dark:text-gray-300">
                     {theme === 'dark' ? 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
                    }
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>
        </aside>
    );
};

const Header: React.FC = () => {
    const location = useLocation();
    const activeNavItem = useMemo(() => NAV_ITEMS.find(item => item.path === location.pathname) || NAV_ITEMS[0], [location.pathname]);
    return (
        <header className="p-6 border-b border-brand-border-light dark:border-brand-border bg-brand-bg-light-main/80 dark:bg-brand-bg-dark/80 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="text-3xl font-bold text-brand-text-primary-light dark:text-white">{activeNavItem.domain}</h2>
            <p className="text-brand-text-secondary-light dark:text-gray-400 mt-1">{activeNavItem.description}</p>
        </header>
    );
}

const AppLayout: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="flex h-screen bg-brand-bg-light-main dark:bg-brand-bg-dark">
          <Sidebar onOpenModal={() => setIsModalOpen(true)} />
          <main className="flex-1 flex flex-col overflow-y-auto">
            <Header />
            <div className="p-4 sm:p-8 flex-grow">
              <ErrorBoundary>
                <Suspense fallback={<div className="w-full h-full flex justify-center items-center"><LoadingSpinner/></div>}>
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2 className="text-2xl font-bold mb-4">About Project Fusion</h2>
            <p className="text-gray-300 mb-2">This application is a comprehensive showcase of advanced React features, demonstrating how to build a modern, feature-rich web application.</p>
            <p className="text-gray-400 text-sm">Features demonstrated include: Routing, Global State (Context API), Custom Hooks, Code Splitting (Lazy Loading), Error Boundaries, and Portals.</p>
          </Modal>
        </div>
    );
}


// --- MAIN APP COMPONENT ---

export default function App() {
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<DashboardView />} />
                    <Route path="analytics" element={<AnalyticsView />} />
                    <Route path="mobile" element={<MobilePreviewView />} />
                    <Route path="blog" element={<BlogView />} />
                    <Route path="configurator" element={<ConfiguratorView />} />
                    <Route path="*" element={<DashboardView />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}
