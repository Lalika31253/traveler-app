"use client"; 

import { useRouter } from 'next/navigation';
import FavoriteLocations from '@/components/FavoriteLocations';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

const FavoritesPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
 
  const [favoriteLocations, setFavoriteLocations] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (session?.user?.id) {
          const response = await axios.get(`/api/favorite-locations?user_id=${session.user.id}`);
          setFavoriteLocations(response.data);
        }
      } catch (error) {
        console.error('Error fetching favorite locations:', error);
      }
    };

    fetchFavorites();
  }, [session]);

  const handleFavoriteToggle = (locationId) => {
    // Filter out the location with the given ID from favoriteLocations
    setFavoriteLocations((prevLocations) =>
      prevLocations.filter((location) => location.id !== locationId)
    );
  };

  return (
    <Box display='flex' flexDirection='row' width='100%' justifyContent='space-between' marginTop={10}>
      <Box display='flex' minWidth='200px' maxWidth='200px' flexDirection='column'>
        <Stack position='fixed' direction="column" spacing={2} component="div" padding={2}>
          <Button variant='outlined' href="/dashboard">My Routes</Button>
          <Button variant='contained'>My Locations</Button>
          <Button variant='outlined' href="/published">Published Routes</Button>
        </Stack>
      </Box>
      <Box display='flex' flexGrow='1' flexDirection='column' alignItems={'center'} margin={2}>
        <Box display='flex' direction='row' width='100%' justifyContent={"space-between"}>
          <Typography variant='h5'>
             MY FAVOIRTE LOCATIONS
          </Typography>         
        </Box>
        <Grid container columnSpacing={1} rowSpacing={5}>
          {favoriteLocations.map(location => (
            <FavoriteLocations key={location.id} location={location} onFavoriteToggle={handleFavoriteToggle}/>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};  

export default FavoritesPage;
