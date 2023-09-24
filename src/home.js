
import { Api, Router, signal } from 'riza';
import Calendar from './calendar';
import { signOut } from './actions';

export default () =>
{
    const selectedDates = signal([]);

    function load()
    {
        Api.fetch('account/availability/load').then(r => {
            if (r.response == 200)
                selectedDates.set(r.data.map(val => new Date(val)));
        });
    }

    function save()
    {
        Api.fetch('account/availability/save', JSON.stringify(
            selectedDates.get().map(val => val.toISOString().substr(0, 10))
        ))
        .then(r => {
            if (r.response == 200)
                alert('Your availability has been saved.');
            else
                alert('Error: ' + r.error);
        });
    }
    
    return <r-panel data-route="/home/" class="s-fill f-col" onPanelShown={ load }>

        <div class="pt-6">
            <Calendar firstWeekDay={1} selectedDates={ selectedDates } />

            <br/><br/>

            <button class="btn" onClick={ save }>
                <i class="fa fa-save me-1"></i>
                Save Availability
            </button>

            <button class="btn alt-1 mt-2" onClick={ signOut }>
                <i class="fa fa-sign-out me-1"></i>
                Sign Out
            </button>
        </div>

    </r-panel>
};
