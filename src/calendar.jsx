
import { signal, watch, expr } from 'riza';
import './calendar.css';

/**
 * Month names.
 */
export const monthName = {
    'en': [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October', 'November', 'December' ],
    'es': [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto','Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
    'ru': [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь','Июль', 'Август', 'Сентябрь', 'Октябрь','Ноябрь', 'Декабрь' ],
};

/**
 * Day names (short).
 */
export const dayNames = {
    'en': [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ],
    'es': [ 'Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa' ],
    'ru': [ 'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ],
};

/**
 * Labels for the calendar.
 */
export const labels = {
    'en': {
        'prev': 'Previous Month',
        'today': 'Today',
        'next': 'Next Month',
        'clear': 'Clear',
    },

    'es': {
        'prev': 'Mes Anterior',
        'today': 'Hoy',
        'next': 'Mes Siguiente',
        'clear': 'Limpiar',
    },

    'ru': {
        'prev': 'Предыдущий Месяц',
        'today': 'Сегодня',
        'next': 'Следующий Месяц',
        'clear': 'Очистить',
    },
};

/**
 * Returns the weeks of a month.
 * @param {Date} activeDate
 * @param {number} [firstWeekDay=0] - First day of the week (0=Sunday, 1=Monday, etc.)
 * @returns {Date[][]} weeks
 */
function getMonthWeeks (activeDate, firstWeekDay=0)
{
    const currDay = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1);
    currDay.setDate(currDay.getDate() + (firstWeekDay - currDay.getDay() - 7) % 7);

    const weeks = [];
    while (weeks.length < 6) {
        const days = [];
        weeks.push(days);
        while (days.length < 7) {
            days.push(new Date(currDay));
            currDay.setDate(currDay.getDate() + 1);
        }
    }

    return weeks;
}

/**
 * Returns true if two dates are equal.
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
function equalDates (a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * Returns true if a date is contained in an array of dates.
 * @param {signal<Date[]>} dates
 * @param {Date} date
 * @returns {boolean}
 */
function containsDate (dates, date) {
    return dates.get().some(d => equalDates(d, date));
}

/**
 * Adds or removes a date from an array of dates.
 * @param {signal<Date[]>} dates
 * @param {Date} date
 */
function toggleDate (dates, date) {
    if (containsDate(dates, date))
        dates.set(dates.get().filter(d => !equalDates(d, date)));
    else
        dates.set(dates.get().concat([date]));
}

/**
 * Sets the active date to the previous month.
 * @param {signal<Date>} $activeDate
 */
function prevMonth ($activeDate) {
    $activeDate.set(new Date($activeDate.get().getFullYear(), $activeDate.get().getMonth() - 1, 1));
};

/**
 * Sets the active date to the next month.
 * @param {signal<Date>} $activeDate
 */
function nextMonth ($activeDate) {
    $activeDate.set(new Date($activeDate.get().getFullYear(), $activeDate.get().getMonth() + 1, 1));
};

/**
 * Sets the active date to today.
 * @param {signal<Date>} $activeDate
 */
function setToday ($activeDate) {
    $activeDate.set(new Date());
};

/**
 * Constructs a calendar component.
 * @param {Object} options
 * @param {signal<Date>} [options.focusDate] - Calendar focus date.
 * @param {number} [options.firstWeekDay=0] - First day of the week (0=Sunday, 1=Monday, etc.)
 * @param {signal<Date[]>} [options.selectedDates] - Array of selected dates.
 * @param {'en'|'es'|'ru'} [options.lang] - Language for the calendar (defaults to `en`).
 * @returns {HTMLElement}
 */
export default function ({ focusDate=null, firstWeekDay=0, selectedDates=null, lang="en", ...props })
{
    focusDate = focusDate || signal(new Date());
    if (focusDate.get() instanceof Date === false)
        throw new Error('`focusDate` must be a Signal<Date> object');

    if (selectedDates === null)
        selectedDates = signal([]);

    const monthWeeks = signal([]);
    const today = new Date();

    watch([focusDate], (focusDate) => monthWeeks.set(getMonthWeeks(focusDate, firstWeekDay)));

    return <div class="calendar" selectedDates={selectedDates} {...props}>
        <table>
            <thead>
                <tr class="tr-1">
                    <th class="th-1" colSpan="4">{ monthName[lang][$focusDate.getMonth()] } { $focusDate.getFullYear() }</th>
                    <th class="th-2" colSpan="3">
                        <div>
                            <i class="fa fa-arrow-left" title={ labels[lang]['prev'] } onClick={ () => prevMonth(focusDate) }></i>
                            <i class="fa fa-arrow-right" title={ labels[lang]['next'] } onClick={ () => nextMonth(focusDate) }></i>
                            <i class="fa fa-star" title={ labels[lang]['today'] } onClick={ () => setToday(focusDate) }></i>
                            <i class="fa fa-trash-can" title={ labels[lang]['clear'] } onClick={ () => selectedDates.set([]) }></i>
                        </div>
                    </th>
                </tr>

                <tr class="tr-2">
                    { (new Array(7).fill(0)).map((val, idx) => <th>{dayNames[lang][(idx+firstWeekDay+7)%7]}</th>) }
                </tr>
            </thead>

            <tbody>
                {expr([monthWeeks, selectedDates],
                    (monthWeeks) =>
                        monthWeeks.map(row => <tr>
                            {row.map(day => 
                                <td 
                                    class:is-gray={ focusDate.get().getMonth() !== day.getMonth() }
                                    class:is-selected={ containsDate(selectedDates, day) }
                                    class:is-today={ equalDates(day, today) }
                                    onClick={ () => toggleDate(selectedDates, day) }
                                >
                                    { day.getDate() }
                                </td>
                            )}
                        </tr>
                    )
                )}
            </tbody>
        </table>
    </div>
};
