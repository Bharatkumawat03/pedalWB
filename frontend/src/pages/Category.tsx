import { useParams, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/store/store';
import { setCategory } from '@/store/slices/filtersSlice';
import Shop from '@/pages/Shop';

const Category = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  // Valid category slugs from footer
  const validCategories = ['drivetrain', 'wheels', 'brakes', 'accessories'];
  
  if (!categoryId || !validCategories.includes(categoryId)) {
    return <Navigate to="/categories" replace />;
  }

  // Set the category filter when component mounts
  useEffect(() => {
    // Map URL slugs to category IDs used in the shop
    const categoryMap: Record<string, string> = {
      'drivetrain': 'drivetrain',
      'wheels': 'wheels-tires',
      'brakes': 'brakes',
      'accessories': 'accessories'
    };
    
    const mappedCategory = categoryMap[categoryId];
    if (mappedCategory) {
      dispatch(setCategory(mappedCategory));
    }
  }, [categoryId, dispatch]);

  // Return the Shop component which will show filtered results
  return <Shop />;
};

export default Category;