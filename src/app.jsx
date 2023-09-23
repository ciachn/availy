
import "./css/xui.css"
import "./css/main.css"

import { signal } from 'riza';
import Calendar from './calendar';

let selectedDates = signal([]);
let content = signal('');

export default () =>
    <div class="app p-fill p-4 py-5">
        <Calendar firstWeekDay={1} id="calendar" />

        <br/><br/>

        <button class="btn" onClick={ () => {
            content.set( document.getElementById('calendar').selectedDates.map(date => <div>{date.toISOString().substring(0, 10)}</div> ) );
        }}>
            <i class="fa fa-save me-1"></i>
            Save Availability
        </button>

    </div>
;
