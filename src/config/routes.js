import Home from '../pages/Home';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Upload',
    component: Home
  }
};

export const routeArray = Object.values(routes);