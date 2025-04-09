import ForumView from '../views/ForumView.vue';
import ThreadView from '../views/ThreadView.vue';
import CreateThreadView from '../views/CreateThreadView.vue';

export default [
  { path: '/', component: ForumView },
  { path: '/thread/:id', component: ThreadView },
  { path: '/new-thread', component: CreateThreadView }
];
