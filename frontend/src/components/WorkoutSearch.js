import React, {useEffect, useState} from "react";
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';

const WorkoutSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const options = {
                method: "GET",
                url: `https://exercisedb.p.rapidapi.com/exercises/name/${searchQuery}`,
                headers: {
                    "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY || "01d1f11b81msh5671f3cade53b1cp1b67d1jsndb51befa7618",
                    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
                },
            };

            const response = await axios.request(options);
            setExercises(response.data);
        } catch (error) {
            setError('Failed to fetch exercises. Please try again.');
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return(
        <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
            <Typography fontWeight={700} sx={{ fontSize: { lg: '32px', xs: '24px' } }} mb="49px" textAlign="center">
                Search for exercises you wish to add to your routine<br />
            </Typography>
            <Box position="relative" mb="72px">
                <TextField
                    height="76px"
                    sx={{ 
                        input: { fontWeight: '700', border: 'none', borderRadius: '4px' }, 
                        width: { lg: '900px', xs: '350px' }, 
                        backgroundColor: '#fff', 
                        borderRadius: '40px' 
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search Exercises"
                    type="text"
                />
                <Button 
                    className="search-btn" 
                    onClick={handleSearch}
                    disabled={loading}
                    sx={{ 
                        bgcolor: '#FF2625', 
                        color: '#fff', 
                        textTransform: 'none', 
                        width: { lg: '173px', xs: '80px' }, 
                        height: '48px', 
                        position: 'absolute', 
                        right: '0px', 
                        fontSize: { lg: '20px', xs: '14px' },
                        '&:disabled': {
                            bgcolor: '#FF9999'
                        }
                    }}
                >
                    {loading ? 'Searching...' : 'Search'}
                </Button>
            </Box>
            
            {error && (
                <Typography color="error" mb={2}>
                    {error}
                </Typography>
            )}
            
            {exercises.length > 0 && (
                <Box sx={{ width: '100%', maxWidth: '900px' }}>
                    {exercises.map((exercise) => (
                        <Box 
                            key={exercise.id} 
                            sx={{ 
                                mb: 2, 
                                p: 2, 
                                border: '1px solid #e0e0e0', 
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <img 
                                src={exercise.gifUrl} 
                                alt={exercise.name}
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                            <Box>
                                <Typography variant="h6">{exercise.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Target: {exercise.target}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Equipment: {exercise.equipment}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Stack>
    );
}

export default WorkoutSearch;