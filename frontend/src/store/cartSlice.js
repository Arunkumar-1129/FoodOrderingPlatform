import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import toast from 'react-hot-toast';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/cart');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ menuItemId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/cart/add', { menuItemId, quantity });
    toast.success('Added to cart');
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to add to cart');
    return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ menuItemId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.put('/api/cart/update', { menuItemId, quantity });
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update cart');
    return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/api/cart/remove/${itemId}`);
    toast.success('Removed from cart');
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to remove from cart');
    return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/api/cart/clear');
    return null;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
  }
});

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

const handleFulfilledCart = (state, action) => {
  state.isLoading = false;
  if (action.payload) {
    state.items = action.payload.items || [];
    state.totalItems = action.payload.totalItems || 0;
    state.totalPrice = action.payload.totalPrice || 0;
  } else {
    state.items = [];
    state.totalItems = 0;
    state.totalPrice = 0;
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    }
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCart.pending, (state) => { state.isLoading = true; });
    builder.addCase(fetchCart.fulfilled, handleFulfilledCart);
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Add to Cart
    builder.addCase(addToCart.fulfilled, handleFulfilledCart);
    
    // Update Cart
    builder.addCase(updateCartItem.fulfilled, handleFulfilledCart);

    // Remove from Cart
    builder.addCase(removeFromCart.fulfilled, handleFulfilledCart);

    // Clear Cart
    builder.addCase(clearCart.fulfilled, (state) => {
       state.items = [];
       state.totalItems = 0;
       state.totalPrice = 0;
    });
  },
});

export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;
