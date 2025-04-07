import './styles/main.scss';
import './styles/normalize.scss';
import { render } from '@/App';

window.addEventListener('popstate', render);
window.addEventListener('DOMContentLoaded', render);
