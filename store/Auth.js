import {create} from "zustand";
import { immer} from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export const useAuthStore= create()(persist(
    immer((set, get) => ({
        user:null,
        hydrated:false,
        jwt:null,
        setHydrated(){
            set({hydrated:true})
        },

        setUser(user){
            set({user:user})
        },
    async logout(){

    }

    })), 
    {name:"auth",
    onRehydrateStorage(){
        return(state,error)=>{
            if(!error) state?.setHydrated( )
        }


    }
    }));