import {Box, Divider, List, ListItem, Paper, Typography} from '@mui/material';
import {DifficultyLevel} from 'hooks/useGameEngine';
import React from 'react';
import {GameSession} from 'types/game';

interface Props {
    session: GameSession;
    difficultyLevel: DifficultyLevel;
}

function formatMs(ms: number): string {
    const s = (ms / 1000).toFixed(1);
    return `${s}s`;
}

const LEVEL_COLORS: Record<DifficultyLevel, string> = {1: '#4fc3f7', 2: '#ffb74d', 3: '#ef5350'};
const LEVEL_LABELS: Record<DifficultyLevel, string> = {1: 'Easy', 2: 'Medium', 3: 'Hard'};

export default function ScorePanel({session, difficultyLevel}: Props) {
    const bestTime = session.results.length > 0 ? Math.min(...session.results.map((r) => r.timeMs)) : null;

    return (
        <Paper
            elevation={3}
            sx={{
                width: 220,
                flexShrink: 0,
                display: {xs: 'none', md: 'flex'},
                flexDirection: 'column',
                bgcolor: '#0d1621',
                borderRadius: 0,
                borderLeft: '1px solid #1e2d40',
            }}
        >
            <Box sx={{px: 2, py: 2}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1}}>
                    <Typography variant="subtitle2" sx={{color: '#8899aa'}}>
                        Score
                    </Typography>
                    <Typography variant="caption" sx={{color: LEVEL_COLORS[difficultyLevel], fontWeight: 700}}>
                        {LEVEL_LABELS[difficultyLevel]}
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Box>
                        <Typography variant="caption" sx={{color: '#8899aa'}}>
                            Streak
                        </Typography>
                        <Typography variant="h5" sx={{color: '#ffcc00', fontWeight: 700}}>
                            {session.streak}
                        </Typography>
                    </Box>
                    <Box sx={{textAlign: 'right'}}>
                        <Typography variant="caption" sx={{color: '#8899aa'}}>
                            Best
                        </Typography>
                        <Typography variant="h5" sx={{color: '#4fc3f7', fontWeight: 700}}>
                            {bestTime !== null ? formatMs(bestTime) : '—'}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Divider sx={{borderColor: '#1e2d40'}} />
            <List dense disablePadding sx={{overflowY: 'auto', flex: 1}}>
                {session.results.map((result, i) => (
                    <ListItem
                        key={`${result.city.id}-${result.timestamp}`}
                        sx={{
                            px: 2,
                            py: 0.5,
                            bgcolor: i === 0 ? '#1a2a3a' : 'transparent',
                        }}
                    >
                        <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                            <Typography variant="caption" sx={{color: '#c8d8e8'}}>
                                {result.city.name}
                            </Typography>
                            <Typography variant="caption" sx={{color: '#4fc3f7', fontFamily: 'monospace'}}>
                                {formatMs(result.timeMs)}
                            </Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}
