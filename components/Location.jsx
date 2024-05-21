"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Grid, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';
import { useSession } from 'next-auth/react';


const Location = ({ location }) => {
  const averageRating = location.locationRatings?.length
    ? location.locationRatings.reduce((sum, rating) => sum + rating.rating, 0) / location.locationRatings.length
    : "No ratings";

  const { data: session } = useSession();
  const user_id = session?.user?.id;

  const [isFavorite, setIsFavorite] = useState(location.isFavorite);

  useEffect(() => {
    setIsFavorite(location.isFavorite);
  }, [location.isFavorite]);

  const handleFavoriteClick = async (event) => {
    event.preventDefault();
    if (!user_id) return;

    try {
      const response = await axios.post('/api/favorites', {
        user_id: user_id,
        location_id: location.id,
      });

      if (response.data.message === 'Location favorited') {
        setIsFavorite(true);
      } else if (response.data.message === 'Location unfavorited') {
        setIsFavorite(false);
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };


  return (
    <Grid display='flex' item xs={12} sm={6} md={4} justifyContent={'center'}>
      <Card elevation={4} sx={{ maxWidth: '350px', marginTop: 3, padding: 1 }}>
        {location.image && (
          <CardMedia
            component="img"
            sx={{ width: '100%', height: 200, objectFit: 'cover' }}
            image={location.image}
            alt={location.name}
          />  
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {location.name}

            <IconButton onClick={handleFavoriteClick} sx={{ float: 'right' }}>
              {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>

          </Typography>
          <Typography variant="body2" color="text.secondary">
            Description: {location.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {location.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Days of Operation: {location.days_of_operation}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            City: {location.city?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Country: {location.country?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rating: {averageRating}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Location;