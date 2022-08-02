import { createStore } from "vuex"
import { query, collection, where, getDocs } from 'firebase/firestore'
import { projectFirestore } from "../firebase/config"


const store = createStore({
    state:{
        user: null,
        authIsReady: false,
        userDoc: { role: null, suborg: null, org: null }
    },
    mutations:{
        setUser(state, payload) {
            state.user = payload
            console.log('user state changed:', state.user)
        },
        setUserDoc(state, payload) {
            state.userDoc = payload
            console.log('userDoc changed to', state.userDoc)
        },
        setAuthIsReady(state, payload){
            state.authIsReady = payload
        }
    },
    getters:{
        user: (state) => state.user,
        userDoc: (state) => state.userDoc
    },
    actions: {
        async fetchUserDoc(context, userID) {
            try {
                const q = query(collection(projectFirestore, 'users'), where('userID', '==', userID))
                const querySnapshot = await getDocs(q) 
                if(querySnapshot.empty) {
                    context.commit('setUserDoc',{role: null, org: null, suborg: null})
                } else {
                    const document = querySnapshot.docs.at(0).data();
                    context.commit('setUserDoc', {role: document.role, org: document.org, suborg: document.suborg})
                }
            } catch (error) {
                console.log('Could not fetch user doc', error)
                store.commit('setUserDoc',{role: null, org: null, suborg: null})
            }
        }
    }
})

export default store