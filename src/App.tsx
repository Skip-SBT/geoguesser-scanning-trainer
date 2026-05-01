import './styles/index.scss';
import HomePage from './pages/HomePage';
import ScanningTrainerPage from './pages/ScanningTrainerPage';
import TimedGamePage from './pages/TimedGamePage';
import theme from './theme';
import {ThemeProvider} from '@mui/material';
import React from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/trainer" element={<ScanningTrainerPage />} />
                    <Route path="/game" element={<TimedGamePage />} />
                </Routes>
            </HashRouter>
        </ThemeProvider>
    );
}
