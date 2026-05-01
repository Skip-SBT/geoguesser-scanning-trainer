import {Box, Paper, Typography} from '@mui/material';
import React from 'react';
import {Link as RouterLink} from 'react-router-dom';

interface ModeCardProps {
    title: string;
    description: string;
    detail: string;
    accentColor: string;
    borderColor: string;
    to: string;
    label: string;
}

function ModeCard({title, description, detail, accentColor, borderColor, to, label}: ModeCardProps) {
    return (
        <Paper
            component={RouterLink}
            to={to}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 4,
                width: 280,
                bgcolor: '#0d1621',
                border: `1px solid ${borderColor}`,
                borderRadius: 2,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.15s',
                '&:hover': {borderColor: accentColor, transform: 'translateY(-2px)'},
            }}
        >
            <Typography variant="h5" sx={{color: accentColor, fontWeight: 700}}>
                {title}
            </Typography>
            <Typography variant="body2" sx={{color: '#c8d8e8', lineHeight: 1.7}}>
                {description}
            </Typography>
            <Typography variant="caption" sx={{color: '#8899aa', lineHeight: 1.6}}>
                {detail}
            </Typography>
            <Typography
                variant="button"
                sx={{
                    mt: 'auto',
                    color: accentColor,
                    fontWeight: 700,
                    letterSpacing: 1,
                    borderTop: `1px solid ${borderColor}`,
                    pt: 2,
                }}
            >
                {label} →
            </Typography>
        </Paper>
    );
}

export default function HomePage() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#0a1220',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
            }}
        >
            <Typography variant="h3" sx={{color: '#e8f0ff', fontWeight: 800, letterSpacing: 0.5, textAlign: 'center'}}>
                GeoGuessr Scanning Trainer
            </Typography>
            <Typography variant="body1" sx={{color: '#8899aa', mb: 6, textAlign: 'center'}}>
                Train your visual search speed — find cities on real maps.
            </Typography>

            <Box sx={{display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center'}}>
                <ModeCard
                    title="Training Mode"
                    description="Find target cities with no time pressure. Difficulty increases automatically as you improve."
                    detail="Starts with major cities only — zooming in reveals smaller ones. Switch countries every 3 finds."
                    accentColor="#4fc3f7"
                    borderColor="#1e3a56"
                    to="/trainer"
                    label="Start Training"
                />
                <ModeCard
                    title="Time Attack"
                    description="Race against a countdown. Find each city before the clock hits zero."
                    detail="Each correct answer shortens the next time limit. How long can you survive?"
                    accentColor="#ef5350"
                    borderColor="#5a1e1e"
                    to="/game"
                    label="Start Game"
                />
            </Box>
        </Box>
    );
}
