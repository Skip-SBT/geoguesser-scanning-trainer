import {Box, Paper, Typography} from '@mui/material';
import {City} from 'data/cities';
import {Country} from 'data/countries';
import {DifficultyLevel} from 'hooks/useGameEngine';
import React from 'react';

interface Props {
    targetCity: City;
    currentCountry: Country;
    guessesInCountry: number;
    difficultyLevel: DifficultyLevel;
    elapsedMs: number;
}

function formatTime(ms: number): string {
    const totalTenths = Math.floor(ms / 100);
    const seconds = Math.floor(totalTenths / 10);
    const tenths = totalTenths % 10;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
        return `${mins}:${String(secs).padStart(2, '0')}.${tenths}`;
    }
    return `${secs}.${tenths}s`;
}

const GUESSES_PER_COUNTRY = 3;

const LEVEL_COLORS: Record<DifficultyLevel, string> = {1: '#4fc3f7', 2: '#ffb74d', 3: '#ef5350'};
const LEVEL_LABELS: Record<DifficultyLevel, string> = {1: 'Easy', 2: 'Medium', 3: 'Hard'};

export default function TargetDisplay({targetCity, currentCountry, guessesInCountry, difficultyLevel, elapsedMs}: Props) {
    const levelColor = LEVEL_COLORS[difficultyLevel];
    return (
        <Paper
            elevation={3}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
                py: 1.5,
                borderRadius: 0,
                bgcolor: '#0d1621',
                flexShrink: 0,
            }}
        >
            <Box>
                <Typography variant="caption" sx={{color: '#8899aa', display: 'block', lineHeight: 1.2}}>
                    {currentCountry.name}
                </Typography>
                <Typography variant="h5" component="span" sx={{color: '#e8f0ff', fontWeight: 700, letterSpacing: 0.5}}>
                    {targetCity.name}
                </Typography>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 3}}>
                <Box sx={{textAlign: 'center'}}>
                    <Typography variant="caption" sx={{color: '#8899aa', display: 'block', lineHeight: 1.2}}>
                        level
                    </Typography>
                    <Typography variant="h6" sx={{color: levelColor, fontWeight: 700, lineHeight: 1}}>
                        {LEVEL_LABELS[difficultyLevel]}
                    </Typography>
                </Box>
                <Box sx={{textAlign: 'center'}}>
                    <Typography variant="caption" sx={{color: '#8899aa', display: 'block', lineHeight: 1.2}}>
                        progress
                    </Typography>
                    <Typography variant="h6" sx={{color: '#4fc3f7', fontWeight: 600, lineHeight: 1}}>
                        {guessesInCountry}&thinsp;/&thinsp;{GUESSES_PER_COUNTRY}
                    </Typography>
                </Box>
                <Box sx={{textAlign: 'right'}}>
                    <Typography variant="caption" sx={{color: '#8899aa', display: 'block', lineHeight: 1.2}}>
                        time
                    </Typography>
                    <Typography variant="h5" sx={{color: '#c8d8e8', fontFamily: 'monospace', fontWeight: 600, lineHeight: 1}}>
                        {formatTime(elapsedMs)}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}
