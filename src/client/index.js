import { generateMessage } from './js/app';
import { titleCase } from './js/utils';
import './styles/style.scss'

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generate').addEventListener('click', generateMessage);
});

const today = new Date().toISOString().split('T')[0];
document.getElementById('date').setAttribute('min', today);

export { titleCase }