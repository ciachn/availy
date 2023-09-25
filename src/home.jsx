
import { Api, Router, signal } from 'riza';
import Calendar from './calendar';
import { signOut } from './actions';

export default () =>
{
    const selectedDates = signal([]);
    const annotatedDates = signal([]);
    let users = null;

    function load()
    {
        Api.fetch('account/availability/load-summary').then(r => {
            if (r.response != 200)
                return;

            let group = Object.values(r.groups);
            if (!group.length) return;

            if (Object.values(group).length > 1) {
                let val = prompt('Which group do you want to show?\n' + Object.keys(r.groups).join('\n'));
                if (!val || !(val in r.groups)) return;
                group = r.groups[val];
            }
            else {
                group = group[0];
            }

            Object.entries(group.dates).forEach(e => {
                e[1].total = group.count;
            });

            annotatedDates.set(group.dates);
            users = group.users;
        });

        Api.fetch('account/availability/load').then(r => {
            if (r.response == 200 && r.data) {
                selectedDates.set(r.data.map(val => new Date(val+'T00:00:00')));
            }
        });
    }

    function annotationText (info) {
        return info.list.map(i => users[i].name).join('\n');
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
            <Calendar firstWeekDay={1} selectedDates={ selectedDates } annotatedDates={ annotatedDates } annotationText={ annotationText } />

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
