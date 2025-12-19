import React from 'react';
import { Grid } from '@mui/material';
import CategoryCard from './CategoryCard';

const MainGrid = ({ categories, onEdit, onMenuOpen }) => {
  return (
    <Grid container spacing={3}>
      {categories.map((category) => (
        <Grid item xs={12} sm={6} md={4} key={category.id}>
          <CategoryCard
            category={category}
            onEdit={onEdit}
            onMenuOpen={onMenuOpen}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryGrid;