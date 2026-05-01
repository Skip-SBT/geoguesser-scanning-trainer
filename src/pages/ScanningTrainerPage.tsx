import {Box} from '@mui/material';
import MapView from 'components/scanning-trainer/MapView';
import ResultFeedback from 'components/scanning-trainer/ResultFeedback';
import ScorePanel from 'components/scanning-trainer/ScorePanel';
import TargetDisplay from 'components/scanning-trainer/TargetDisplay';
import {CITIES} from 'data/cities';
import {getDifficultyConfig, useGameEngine} from 'hooks/useGameEngine';
import React, {useMemo} from 'react';

export default function ScanningTrainerPage() {
    const {session, targetCity, currentCountry, guessesInCountry, difficultyLevel, elapsedMs, handleCityClick, isCorrect} = useGameEngine();

    const {visibleMax} = getDifficultyConfig(difficultyLevel);

    const countryCities = useMemo(() => CITIES.filter((c) => c.countryId === currentCountry.id && c.importance <= visibleMax), [currentCountry.id, visibleMax]);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#0a1220'}}>
            <TargetDisplay
                targetCity={targetCity}
                currentCountry={currentCountry}
                guessesInCountry={guessesInCountry}
                difficultyLevel={difficultyLevel}
                elapsedMs={elapsedMs}
            />
            <Box sx={{display: 'flex', flex: 1, overflow: 'hidden'}}>
                <Box sx={{flex: 1, position: 'relative'}}>
                    <ResultFeedback isCorrect={isCorrect} />
                    <MapView cities={countryCities} country={currentCountry} onCityClick={handleCityClick} />
                </Box>
                <ScorePanel session={session} difficultyLevel={difficultyLevel} />
            </Box>
        </Box>
    );
}
