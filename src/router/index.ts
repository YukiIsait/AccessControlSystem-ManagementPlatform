import {
    createRouter,
    createWebHashHistory,
    RouteRecordRaw,
    Router
} from 'vue-router'
import Login from '@/pages/Login.vue'
import Home from '@/pages/Home.vue'
import UserManager from '@/pages/UserManager.vue'
import DeviceManager from '@/pages/DeviceManager.vue'
import AccessInfoManager from '@/pages/AccessInfoManager.vue'
import CardEditor from '@/pages/CardEditor.vue'

const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
        path: '/home', name: 'home', component: Home, children: [
            { path: '', name: 'index', redirect: '/home/user-manager' },
            { path: 'user-manager', name: 'user-manager', component: UserManager },
            { path: 'device-manager', name: 'device-manager', component: DeviceManager },
            { path: 'access-info-manager', name: 'access-info-manager', component: AccessInfoManager },
            { path: 'card-editor/:id?', name: 'card-editor', component: CardEditor, props: true }
        ]
    }
]

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
