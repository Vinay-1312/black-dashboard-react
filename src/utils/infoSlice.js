import { createSlice } from "@reduxjs/toolkit";

const infoSlice = createSlice(

    {
        name:"info",
        initialState: {
           Links:[],
           Scores:[],
           position:null,
           skills :null

          
        },
        reducers:
        {
            addLinks:(state,action)=>
            {
               state.Links.push(action.payload)
            },

            addScores:(state,action)=>
            {
               state.Scores.push(action.payload)
            },
            addTitle:(state,action)=>
            {
               state.position = action.payload;
            },
            addSkills:(state,action)=>
            {
               state.skills = action.payload;
            },
            

            
          

        }
    }
)

export const {addLinks,addScores,addTitle,addSkills} = infoSlice.actions;

export default infoSlice.reducer;