import { createRouter, createWebHashHistory } from 'vue-router'
import LifeView      from '../views/LifeView.vue'
import CommanderView from '../views/CommanderView.vue'
import CountersView  from '../views/CountersView.vue'
import DiceView      from '../views/DiceView.vue'
import SearchView    from '../views/SearchView.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',          component: LifeView },
    { path: '/commander', component: CommanderView },
    { path: '/counters',  component: CountersView },
    { path: '/dice',      component: DiceView },
    { path: '/search',    component: SearchView },
  ],
})
