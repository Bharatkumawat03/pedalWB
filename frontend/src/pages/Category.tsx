import { useParams, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setCategory } from '@/store/slices/filtersSlice';
import categoryService from '@/services/categoryService';
import Shop from '@/pages/Shop';
import { Loader2 } from 'lucide-react';

const Category = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  // Fetch category and set filter when component mounts
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setIsValid(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Try to fetch category by slug
        const category = await categoryService.getCategory(categoryId);
        
        if (category && category._id) {
          // Set the category filter using the category ID or slug
          dispatch(setCategory(category._id || category.slug || categoryId));
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (err: any) {
        console.error('Error fetching category:', err);
        // If category not found, try to set filter directly with the slug
        dispatch(setCategory(categoryId));
        setIsValid(true); // Allow it to proceed even if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!isValid && !loading) {
    return <Navigate to="/categories" replace />;
  }

  // Return the Shop component which will show filtered results
  return <Shop />;
};

export default Category;