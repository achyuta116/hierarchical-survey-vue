import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SingleForm from '../views/SingleForm.vue'
import AddUsers from '../views/AddUsers.vue'
import Reports from '../views/Reports.vue'
import CreateForm from '../views/CreateForm.vue'
import Response from '../views/Response.vue'
import Login from '../views/Login.vue'
import SingleResponse from '../views/SingleResponse.vue'
import NotFound from '../views/NotFound.vue'
import Profile from '../views/Profile.vue'
import store from '../store/index'

const requireAuth = (to, from, next) => {
  const user = store.getters.user
  const userDoc = store.getters.userDoc
  if(!user) next({ name: 'Login'})
  else if(!userDoc.role) next({ name: 'Login' })
  else next()
}

const isAdmin = async (to, from, next) => {
  const user = store.getters.user
  const userDoc = store.getters.userDoc

  if(!user) next({ name: 'Login' })
  else if(!userDoc.role) next({ name: 'Login' })
  if(userDoc.role == 'admin' || userDoc.role == 'super') next()
  else next({ name: 'Home' })
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: requireAuth
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/response/:id',
    name: 'Response',
    component: Response,
    props: true,
    beforeEnter: requireAuth
  },
  {
    path: '/form/:id',
    name: 'SingleForm',
    component: SingleForm,
    props: true,
    beforeEnter: isAdmin
  },
  {
    path: '/view/:id',
    name: 'SingleResponse',
    component: SingleResponse,
    props: true,
    beforeEnter: isAdmin
  },
  {
    path: '/create',
    name: 'CreateForm',
    component: CreateForm,
    beforeEnter: isAdmin
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    beforeEnter: isAdmin
  },
  {
    path: '/add-user',
    name: 'AddUsers',
    component: AddUsers,
    beforeEnter: isAdmin
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: requireAuth
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
