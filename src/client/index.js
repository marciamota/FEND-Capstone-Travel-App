import { generateMessage } from './js/app';
import { titleCase } from './js/utils';
import './styles/style.scss'

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generate').addEventListener('click', generateMessage);
    document.getElementById('date').addEventListener('change', (event) => {
        // Make sure end date is never sooner than start date
        const travelDate = new Date(document.getElementById('date').value.toUpperCase());
        const startDate = new Date(travelDate).toISOString().split('T')[0];
        document.getElementById('endDate').setAttribute('min', startDate);
        document.getElementById('endDate').disabled = false;
        document.getElementById('endDate').valueAsDate = null;
    });
});

const today = new Date().toISOString().split('T')[0];
document.getElementById('date').setAttribute('min', today);

export { titleCase }