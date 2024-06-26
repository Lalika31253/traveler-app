import { selectClasses } from "@mui/material";
import prisma from "./prisma";

const fetchAccountDetails = async (userId) => {
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: parseInt(userId)
      }
    });

    return data;
  } catch (error) {
    throw new Error("Failed to retrieve account details");
  }
}

const fetchPublicRoutes = async () => {
  try {
    const data = await prisma.route.findMany({
      select: {
        id: true,
        route_name: true,
        description: true,
        location: {
          select: {
            location: {
              select: {
                image: true
              }
            }
          }
        }
      },
      where: {
        is_public: true
      }
    });
    return data;
  } catch (error) {
    throw new Error("Failed to retrieve routes");
  }
};

const fetchPopularRoutes = async () => {
  try {
    const data = await prisma.route.findMany({
      select: {
        id: true,
        route_name: true,
        description: true,
        location: {
          select: {
            location: {
              select: {
                image: true
              }
            }
          }
        }
      }
    });
    return data;
  } catch (error) {
    throw new Error("Failed to retrieve routes");
  }
};

const fetchRouteDetails = async (routeId) => {

  try {
    const data = await prisma.route.findUnique({
      where: {
        id: parseInt(routeId)
      },
      include: {
        location: {
          include: {
            location: true
          }
        },
        ratings: {
          include: {
            user: {
              select: {
                username: true
              }
            }
          }
        }
      }
    });

    console.log(data);

    return data;
  } catch (error) {
    throw new Error("Failed to retrieve route details");
  }
};

const fetchLocation = async () => {
  try {
    const locations = await prisma.location.findMany();

    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error.message);
    console.trace(error);
    throw new Error("Failed to retrieve locations");
  }
    
};


const fetchLocationDetails = async (locationId) => {
  try {
    const location = await prisma.location.findUnique({
      relationLoadStrategy: 'join',
      where: {
        id: parseInt(locationId)
      },
      include: {
        city: true, 
        country: true,
        locationRatings: true
      }
    });

        if (!location) {
          throw new Error("Location not found");
        }
    
        return location;
    
      } catch (error) {
        console.error("Error fetching location details:", error);
        throw new Error("Failed to retrieve location details");
      }
};




export const fetchFilteredLocations = async (category, minRating, city) => {
  if (category === 'All') {
    category = undefined;
  }
  if (city === 'All') {
    city = undefined;
  }
  const locations = await prisma.location.findMany({
    where: {
      category: category || undefined,
      city_id: parseInt(city) || undefined,
      locationRatings: minRating ? {
        some: {
          rating: {
            gte: parseInt(minRating),
          },
        },
      } : undefined,
    },
    include: {
      city: true,
      country: true,
      locationRatings: true, 
    },
  });

  return locations;

};






const fetchCities = async () => {
  try {
    const cities = await prisma.city.findMany();
    const images = [];
    for (let index = 1; index < cities.length+1; index++) {
      const location = await prisma.location.findFirst({
        where: {
          city_id: index
        }
      })
      images.push(location.image)
    }
    return {cities, images};
  } catch (error) {
    throw new Error("Failed to retrieve locations");
  }
};

const fetchLocationDetailsByCity = async (cityId) => {
  try {
    const locations = await prisma.location.findMany({

      relationLoadStrategy: 'join',
      where: {
        city_id: parseInt(cityId)
      },
      include: {
        city: true, 
        country: true,
        locationRatings: {
          include: {
            user: {
              select: {
                username: true
              }
            }
          }
        }
      }
    });
    return locations;
  } catch (error) {
    throw new Error("Failed to retrieve locations");
  }
}



const fetchFavoriteLocations = async (userId) => {
    const favoriteLocations = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    include: {
      userLocations: true, 
    },
    })
    return favoriteLocations;
  }


const fetchUserRoutes = async (userId) => {
  try {
    const routes = await prisma.route.findMany({
      where: {
        user_id: userId,
      },
      include: {
        origin: true,
        location: {
          include: {
            location: true,
          },
        },
        ratings: true,
      },
    });
    return routes;
  } catch (error) {
    throw new Error("Failed to retrieve routes");
  }
}


export { 
  fetchAccountDetails, 
  fetchPublicRoutes, 
  fetchPopularRoutes,
  fetchRouteDetails, 
  fetchLocation, 
  fetchLocationDetails, 
  fetchCities, 
  fetchLocationDetailsByCity,
  fetchUserRoutes,
  fetchFavoriteLocations
};