import {Box, Fade} from '@mui/material';
import React from 'react';

interface Props {
    isCorrect: boolean | null;
}

const FADE_ENTER_MS = 80;
const FADE_EXIT_CORRECT_MS = 300;
const FADE_EXIT_WRONG_MS = 400;

export default function ResultFeedback({isCorrect}: Props) {
    return (
        <>
            <Fade in={isCorrect === true} timeout={{enter: FADE_ENTER_MS, exit: FADE_EXIT_CORRECT_MS}}>
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        zIndex: 10,
                        bgcolor: 'rgba(72, 199, 116, 0.18)',
                        border: '3px solid rgba(72, 199, 116, 0.7)',
                    }}
                />
            </Fade>
            <Fade in={isCorrect === false} timeout={{enter: FADE_ENTER_MS, exit: FADE_EXIT_WRONG_MS}}>
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        zIndex: 10,
                        bgcolor: 'rgba(240, 82, 82, 0.15)',
                        border: '3px solid rgba(240, 82, 82, 0.7)',
                    }}
                />
            </Fade>
        </>
    );
}
