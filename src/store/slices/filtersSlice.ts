import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  category: string;
  priceRange: [number, number];
  brands: string[];
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating' | 'newest';
  search: string;
}

const initialState: FilterState = {
  category: 'all',
  priceRange: [0, 250000],
  brands: [],
  sortBy: 'newest',
  search: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    toggleBrand: (state, action: PayloadAction<string>) => {
      const brand = action.payload;
      if (state.brands.includes(brand)) {
        state.brands = state.brands.filter(b => b !== brand);
      } else {
        state.brands.push(brand);
      }
    },
    setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const { 
  setCategory, 
  setPriceRange, 
  toggleBrand, 
  setSortBy, 
  setSearch, 
  resetFilters 
} = filtersSlice.actions;
export default filtersSlice.reducer;