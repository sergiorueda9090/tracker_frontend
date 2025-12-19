import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({

  name: 'counter',
  initialState: {
    counter: 10
  },
  reducers: {
    increment: (state, action) => {
        state.counter += action.payload
      },
    decrement: (state, action) => {
        console.log( action.payload)
        state.counter -= action.payload
    },
    incrementByAmount: (state, action) => {
      state.counter += action.payload
    }
  }
  
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;