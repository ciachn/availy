
import { signal, watch, expr } from 'riza';
import './calendar.css';
import { userData } from './signals';

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
            days.push({ date: new Date(currDay), str: getDateISO(currDay) });
            currDay.setDate(currDay.getDate() + 1);
        }
    }

    return weeks;
}

/**
 * Returns a date in ISO format (YYYY-MM-DD).
 * @param {Date} date
 * @returns {string}
 */
function getDateISO(date) {
    return date.toISOString().substring(0, 10);
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
 * @param {signal<Date[]>} annotatedDates
 * @param {Date} date
 * @param {string} dateString
 */
function toggleDate (dates, annotatedDates, date, dateString) {
    if (!dateString) dateString = getDateISO(date);
    let userId = userData.get().user_id.toString();

    if (!(dateString in annotatedDates.get()))
        annotatedDates.get()[dateString] = { list: [], count: 0, total: Object.entries(annotatedDates.get())[0][1].total };

    let info = annotatedDates.get()[dateString];

    if (containsDate(dates, date)) {
        dates.set(dates.get().filter(d => !equalDates(d, date)));
        let i = info.list.indexOf(userId);
        if (i !== -1) {
            info.list.splice(i, 1);
            info.count--;
        }
    } else {
        dates.set(dates.get().concat([date]));
        info.list.push(userId);
        info.count++;
    }
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
 * Clears all selected dates.
 * @param {signal<Date[]>} selectedDates
 */
function clearSelected (selectedDates) {
    if (!confirm('Are you sure you want to clear all selected dates?'))
        return;
    selectedDates.set([]);
}


/**
 * Constructs a calendar component.
 * @param {Object} options
 * @param {signal<Date>} [options.focusDate] - Calendar focus date.
 * @param {number} [options.firstWeekDay=0] - First day of the week (0=Sunday, 1=Monday, etc.)
 * @param {signal<Date[]>} [options.selectedDates] - Array of selected dates.
 * @param {signal<Object>} [options.annotatedDates] - Object of annotated dates.
 * @param {function} [options.annotationText] - Function to generate annotation text.
 * @param {'en'|'es'|'ru'} [options.lang] - Language for the calendar (defaults to `en`).
 * @returns {HTMLElement}
 */
export default function ({ focusDate=null, firstWeekDay=0, selectedDates=null, annotatedDates=null, annotationText=null, lang="en", ...props })
{
    focusDate = focusDate || signal(new Date());
    if (focusDate.get() instanceof Date === false)
        throw new Error('`focusDate` must be a Signal<Date> object');

    if (selectedDates === null)
        selectedDates = signal([]);

    if (annotatedDates === null)
        annotatedDates = signal({});

    if (annotationText === null)
        annotationText = (info) => '';

    let activeAnnotationText = signal('');
    let pointerDownTime = Date.now();
    let pointerDownDate = null;

    function pointerDown (selectedDates, annotatedDates, date, dateString)
    {
        if (pointerDownDate === dateString) {
            if (Date.now() - pointerDownTime <= 500)
                toggleDate(selectedDates, annotatedDates, date, dateString);

            pointerDownTime = Date.now();
            return;
        }

        pointerDownDate = dateString;
        pointerDownTime = Date.now();
        activeAnnotationText.set(!(dateString in annotatedDates.get()) ? '' : annotationText(annotatedDates.get()[dateString]), true);
    }

    const monthWeeks = signal([]);
    const today = new Date();

    watch([focusDate], (focusDate) => monthWeeks.set(getMonthWeeks(focusDate, firstWeekDay)));

    watch([selectedDates, annotatedDates], () => {
        let dateString = pointerDownDate;
        activeAnnotationText.set(!(dateString in annotatedDates.get()) ? '' : annotationText(annotatedDates.get()[dateString]), true);
    });

    return <div selectedDates={selectedDates} {...props}>
        <div class="calendar">
            <table>
                <thead>
                    <tr class="tr-1">
                        <th class="th-1" colSpan="4">{ monthName[lang][$focusDate.getMonth()] } { $focusDate.getFullYear() }</th>
                        <th class="th-2" colSpan="3">
                            <div>
                                <i class="fa fa-arrow-left" title={ labels[lang]['prev'] } onClick={ () => prevMonth(focusDate) }></i>
                                <i class="fa fa-arrow-right" title={ labels[lang]['next'] } onClick={ () => nextMonth(focusDate) }></i>
                                <i class="fa fa-star" title={ labels[lang]['today'] } onClick={ () => setToday(focusDate) }></i>
                                <i class="fa fa-trash-can" title={ labels[lang]['clear'] } onClick={ () => clearSelected(selectedDates) }></i>
                            </div>
                        </th>
                    </tr>

                    <tr class="tr-2">
                        { (new Array(7).fill(0)).map((val, idx) => <th>{dayNames[lang][(idx+firstWeekDay+7)%7]}</th>) }
                    </tr>
                </thead>

                <tbody>
                    {expr([monthWeeks, selectedDates, annotatedDates],
                        (monthWeeks) =>
                            monthWeeks.map(row => <tr>
                                {row.map((day) => 
                                    <td
                                        class:is-gray={ focusDate.get().getMonth() !== day.date.getMonth() }
                                        class:is-selected={ containsDate(selectedDates, day.date) }
                                        class:is-today={ equalDates(day.date, today) }
                                        onPointerDown={ (evt) => [evt.stopPropagation(), pointerDown(selectedDates, annotatedDates, day.date, day.str)] }
                                    >
                                        { day.date.getDate() }
                                        {
                                            !(day.str in annotatedDates.get()) || !annotatedDates.get()[day.str].count ? '' : 
                                                <em><em style:width={100*(annotatedDates.get()[day.str].count / annotatedDates.get()[day.str].total)+'%'}></em></em>
                                        }
                                    </td>
                                )}
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>

        {
            $activeAnnotationText.length == '' 
                ? <div style="font-size: 0.8rem; padding: 0.8rem; background: #1c1c25; margin: 0.5rem 0; border-radius: 0.3rem;">Tap on a date to view people available. Double tap to toggle your availability.</div>
                : <div class="mt-2">
                    <span class="person-title">{ monthName[lang][-1 + ~~pointerDownDate.substring(5, 7)] + ' ' + pointerDownDate.substring(8, 10) }</span>
                    {$activeAnnotationText.split('\n').map(v => <span class="person">{v}</span>)}
                  </div>
        }
    </div>
};
