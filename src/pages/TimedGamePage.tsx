import {Box, Button, LinearProgress, Paper, Typography} from '@mui/material';
import MapView from 'components/scanning-trainer/MapView';
import ResultFeedback from 'components/scanning-trainer/ResultFeedback';
import {CITIES} from 'data/cities';
import {useTimedGame} from 'hooks/useTimedGame';
import React, {useMemo} from 'react';
import {Link as RouterLink} from 'react-router-dom';

const TIMER_HIGH_PCT = 0.5;
const TIMER_MED_PCT = 0.25;
const LOW_TIME_MS = 3000;
const CRITICAL_TIME_MS = 1500;
const PULSE_SLOW = '0.9s';
const PULSE_FAST = '0.45s';

function timerColor(pct: number): string {
    if (pct > TIMER_HIGH_PCT) return '#4fc3f7';
    if (pct > TIMER_MED_PCT) return '#ffb74d';
    return '#ef5350';
}

export default function TimedGamePage() {
    const {gameOver, score, timeLimit, elapsedMs, currentCountry, targetCity, isCorrect, handleCityClick, restart} = useTimedGame();

    const remaining = Math.max(0, timeLimit - elapsedMs);
    const pct = remaining / timeLimit;
    const color = timerColor(pct);
    const isLow = remaining < LOW_TIME_MS && !gameOver;
    const isCritical = remaining < CRITICAL_TIME_MS && !gameOver;

    const countryCities = useMemo(() => CITIES.filter((c) => c.countryId === currentCountry.id), [currentCountry.id]);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#0a1220'}}>
            {/* Header */}
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
                    <Typography variant="h5" sx={{color: '#e8f0ff', fontWeight: 700, letterSpacing: 0.5}}>
                        {targetCity.name}
                    </Typography>
                </Box>

                <Box sx={{display: 'flex', alignItems: 'center', gap: 4}}>
                    {/* Countdown */}
                    <Box sx={{width: 160, textAlign: 'right'}}>
                        <Typography variant="caption" sx={{color: '#8899aa', display: 'block', lineHeight: 1.2}}>
                            time
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                color,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                lineHeight: 1,
                                transition: 'color 0.3s',
                                display: 'inline-block',
                                ...(isLow && {
                                    '@keyframes timer-pulse': {
                                        '0%, 100%': {transform: 'scale(1)'},
                                        '50%': {transform: 'scale(1.12)'},
                                    },
                                    animation: 'timer-pulse ease-in-out infinite',
                                    animationDuration: isCritical ? PULSE_FAST : PULSE_SLOW,
                                }),
                            }}
                        >
                            {(remaining / 1000).toFixed(1)}s
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={pct * 100}
                            sx={{
                                mt: 0.5,
                                height: 3,
                                borderRadius: 2,
                                bgcolor: '#1e2d40',
                                '& .MuiLinearProgress-bar': {bgcolor: color, transition: 'background-color 0.3s'},
                            }}
                        />
                    </Box>

                    {/* Score */}
                    <Box sx={{textAlign: 'right'}}>
                        <Typography variant="caption" sx={{color: '#8899aa', display: 'block', lineHeight: 1.2}}>
                            score
                        </Typography>
                        <Typography variant="h4" sx={{color: '#ffcc00', fontWeight: 700, lineHeight: 1}}>
                            {score}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Map */}
            <Box sx={{flex: 1, position: 'relative'}}>
                <ResultFeedback isCorrect={isCorrect} />
                <MapView cities={countryCities} country={currentCountry} onCityClick={handleCityClick} maxImportance={3} />

                {/* Low-time vignette */}
                {isLow && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            zIndex: 5,
                            boxShadow: 'inset 0 0 140px rgba(239,83,80,0.65)',
                            '@keyframes vignette-pulse': {
                                '0%, 100%': {opacity: 0.25},
                                '50%': {opacity: 1},
                            },
                            animation: 'vignette-pulse ease-in-out infinite',
                            animationDuration: isCritical ? PULSE_FAST : PULSE_SLOW,
                        }}
                    />
                )}

                {/* Game Over overlay */}
                {gameOver && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            bgcolor: 'rgba(10,18,32,0.92)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                        }}
                    >
                        <Typography variant="h2" sx={{color: '#ef5350', fontWeight: 800, letterSpacing: 1, mb: 3}}>
                            Time&apos;s Up!
                        </Typography>
                        <Typography variant="caption" sx={{color: '#8899aa', letterSpacing: 2, textTransform: 'uppercase'}}>
                            Final Score
                        </Typography>
                        <Typography sx={{color: '#ffcc00', fontWeight: 800, lineHeight: 1, fontSize: '8rem', mb: 5}}>{score}</Typography>
                        <Box sx={{display: 'flex', gap: 2}}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={restart}
                                sx={{bgcolor: '#1a3a5c', color: '#4fc3f7', fontWeight: 700, px: 4, '&:hover': {bgcolor: '#1e4a70'}}}
                            >
                                Play Again
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/"
                                variant="outlined"
                                size="large"
                                sx={{borderColor: '#2d3a4a', color: '#8899aa', fontWeight: 700, px: 4}}
                            >
                                Main Menu
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
