<template>
  <div>
    <table class="fr-calendar">
      <tbody>
        <tr v-for="row in calendars" :key="row.rowId">
          <td v-for="month in row.months" :key="month.displayDate">
            <div>
              <div>
                <div v-if="navigatorVisibility === true" style="position:relative;">
                  <div class='calendar-nav-in' :style="'text-align:' + headerAlign">
                    <span class='calendar-nav-pre' @click="onPrevMonth">◀</span>
                    <span class='month-now'>
                      {{ $d(month.month, 'Y') }}
                    </span>
                    <span class='calendar-nav-next' @click="onNextMonth">▶</span>
                  </div>
                  <div style="position: absolute;right: 0px;top: 0px;">
                    <slot name="post-header"></slot>
                  </div>
                </div>
                <div class="calendar-cell">
                  <table>
                    <colgroup>
                      <col style='width:15%'>
                      <col span='5' style='width:14%'>
                      <col style='width:15%'>
                    </colgroup>
                    <thead v-if="dayOfWeekHeaderVisibility === true" >
                      <tr v-bind:style="{height : headerHeight + 'px'}">
                        <th v-for="weekday in month.weekdays" :key="weekday.name" scope='col' :class="{sat : weekday.dayOfWeek === 6, sun: weekday.dayOfWeek === 0}" >
                          <slot v-if="hasHeaderSlot === true" name="header" v-bind:weekday="weekday"></slot>
                          <span>
                            {{ $t(`weekdayShortName.${weekday.name}`) }}
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="week in month.weeks" :key="week.name">
                        <td v-for="day in week.days" :key="day.day" v-bind:class="{ 'active': isCellSelected(day) }" @click="onSelectedDateChanged(day.date, day.dataItem)" >
                          <div v-if="isShowDate === true" class="calendar-item" :class="{sat : day.dayOfWeek === 6, sun: day.dayOfWeek === 0, holiday: day.hasHoliday === true}" :style="{height : bodyHeight + 'px'}">
                            <div v-if="day.hasThisMonth === true" >
                              <div class="day-badge"><strong>{{ day.day }}</strong></div>
                              <div style="padding-top:3px;"  class="calendar-item-slot">
                                <slot v-bind:date="day.date" v-bind:dataItem="day.dataItem" v-bind:hasHoliday="day.hasHoliday" v-bind:holidayInfo="day.holidayInfo" />
                              </div>
                            </div>
                          </div>
                          <div v-else  class="calendar-item" :class="{sat : day.dayOfWeek === 6, sun: day.dayOfWeek === 0}">
                            <div v-if="day.hasThisMonth === true" class="calendar-item-slot">
                              <slot v-bind:date="day.date" v-bind:dataItem="day.dataItem" v-bind:hasHoliday="day.hasHoliday" v-bind:holidayInfo="day.holidayInfo" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'fr-calendar',
  components: {},
  props: {
    bodyHeight: {
      default: 40,
      type: Number,
      required: false
    },
    cols: {
      default: 1,
      type: Number,
      required: false
    },
    dayOfWeekHeaderVisibility: {
      default: true,
      type: Boolean,
      required: false
    },
    data: {
      type: Array,
      required: false
    },
    dayOfWeek: {
      default: 'sunday',
      type: String,
      required: false
    },
    datePropertyPath: {
      default: 'date',
      type: String,
      required: false
    },
    defaultSelectionDate: {
      type: Date,
      required: false
    },
    displayDate: {
      type: Date,
      required: false
    },
    holidays: {
      default: null,
      required: false,
      type: Array
    },
    headerAlign: {
      default: 'center',
      type: String,
      required: false
    },
    headerHeight: {
      default: 30,
      type: Number,
      required: false
    },
    isShowDate: {
      default: true,
      type: Boolean,
      required: false
    },
    navigatorVisibility: {
      default: true,
      type: Boolean,
      required: false
    },
    rows: {
      default: 1,
      type: Number,
      required: false
    },
    selectedDate: {
      type: Date,
      required: false
    },
    selectionDisplayDate: {
      default: 1,
      type: Number,
      required: false
    },
    useFullName: {
      default: true,
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      calendars: null,
      internalDisplayDate: null,
      internalSelectedDay: null,
      internalSelectedDate: null
    };
  },
  computed: {
    hasHeaderSlot: function() {
      return this.$slots['header'];
    }
  },
  watch: {
    displayDate: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.internalDisplayDate = newVal;
        this.onDisplayDateUpdate();
      }
    },
    data: function() {
      this.onDisplayDateUpdate();
    },
    defaultSelectionDate: function() {
      if ( !this.isEmpty(this.defaultSelectionDate)) {
        this.internalSelectedDay = this.defaultSelectionDate.toStandardDateString();
        this.internalSelectedDate = this.defaultSelectionDate;
        this.onDisplayDateUpdate();
      }
    }
  },
  created() {
    this.onDisplayDateUpdate();
  },
  methods: {
    isCellSelected: function(day) {
      if (this.selectionDisplayDate === 1 && this.internalSelectedDay === day.day) {
        return true;
      } else if ( !this.isEmpty(this.internalSelectedDate) && day.hasThisMonth && this.selectionDisplayDate > 1 && this.internalSelectedDate <= day.date && this.internalSelectedDate.addDays(this.selectionDisplayDate) >= day.date ) {
        return true;
      }

      return false;
    },
    onDisplayDateUpdate() {
      if (this.isEmpty(this.internalDisplayDate)) {
        if (this.isEmpty(this.displayDate)) {
          this.internalDisplayDate = new Date();
        } else {
          this.internalDisplayDate = this.displayDate;
        }
      }

      const tmps = [];

      let index = 0;

      for (let row = 0; row < this.rows; row++) {
        const months = [];

        for (let col = 0; col < this.cols; col++) {
          const month = this.getMonthDays(
            this.internalDisplayDate.addMonths(index)
          );

          months.push(month);

          index++;
        }

        const calendar = {
          rowId: row,
          months: months
        };

        tmps.push(calendar);
      }

      this.calendars = tmps;
    },
    getStartDay(monthDayofWeek) {
      const startDayofWeek = this.getStartDayofWeek();
      let addDay = 0;

      for (let k = 0; k < 7; k++) {
        let _index = startDayofWeek + k;

        if (_index > 6) {
          _index = _index - 7;
        }

        if (_index === monthDayofWeek) {
          addDay = k * -1;
          break;
        }
      }

      return addDay;
    },
    getStartDayofWeek() {
      switch (this.dayOfWeek) {
        case 'monday':
          return 1;
        case 'tuesday':
          return 2;
        case 'wednesday':
          return 3;
        case 'thursday':
          return 4;
        case 'friday':
          return 5;
        case 'saturday':
          return 6;
        default:
          return 0;
      }
    },
    getWeekDays() {
      const dayNames = ['sun', 'mon', 'tue', 'web', 'thu', 'fri', 'sat'];
      const rtn = [];
      const startdayofWeek = this.getStartDayofWeek();

      for (let i = 0; i < dayNames.length; i++) {
        const index = startdayofWeek + parseInt(i, 10);

        if (index > 6) {
          rtn.push({ name: dayNames[index - 7], dayOfWeek: index - 7 });
        } else {
          rtn.push({ name: dayNames[index], dayOfWeek: index });
        }
      }

      return rtn;
    },
    getMonthDays(thisMonth) {
      const weeks = [];

      const weekdays = this.getWeekDays();
      const thisDate = {
        year: thisMonth.getFullYear(),
        month: thisMonth.getMonth(),
        firstDate: thisMonth.getFirstDate(),
        lastDate: thisMonth.getLastDate()
      };
      const addDay = this.getStartDay(thisDate.firstDate.getDay());

      let displayday = null;
      let dataItem = null;
      let holidayItem = null;
      let date = new Date(thisDate.year, thisDate.month, 1).addDays(addDay);

      for (let week = 0; week <= 6; week++) {
        const days = [];

        for (let dw = 0; dw < 7; dw++) {
          displayday = date.toStandardDateString();
          holidayItem = this.holidays ? this.holidays.findBy(x => x.solarDate.toStandardDateString(), displayday) : null;

          if (!this.isEmpty(this.data)) {
            dataItem = this.data.find(x => {
              return (
                x[this.datePropertyPath].toStandardDateString() === displayday
              );
            });
          }

          const day = {
            hasThisMonth: date.getMonth() === thisDate.month,
            hasHoliday: !this.isEmpty(holidayItem),
            displayday: displayday,
            day: date.getDate(),
            dayOfWeek: date.getDay(),
            date: date,
            dataItem: dataItem || {},
            holidayInfo: holidayItem || null
          };

          days.push(day);
          date = date.addDays(1);
        }

        if ((days[0].date.getMonth() > thisDate.month &&
          days[0].date.getFullYear() === thisDate.year) ||
          days[0].date.getFullYear() > thisDate.year) {
          break;
        }
        const rows = {
          days: days
        };
        weeks.push(rows);
      }

      return {
        year: thisMonth.getFullYear(),
        month: thisDate.firstDate,
        weekdays: weekdays,
        weeks: weeks
      };
    },
    onPrevMonth() {
      const newDate = this.internalDisplayDate.addMonths(-1);
      this.onDisplayDateChanged(newDate);
    },
    onNextMonth() {
      const newDate = this.internalDisplayDate.addMonths(1);
      this.onDisplayDateChanged(newDate);
    },
    onDisplayDateChanged(newDate) {
      this.$emit('update:displayDate', newDate);
      this.$emit('displayDateChanged', { displayDate: newDate });
      this.onDisplayDateUpdate();
    },
    onSelectedDateChanged(date, dataItem) {
      this.internalSelectedDay = date.toStandardDateString();
      this.internalSelectedDate = date;
      this.$emit('selectedDateChanged', {
        selectedDate: date,
        dataItem: dataItem
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.fr-calendar {
  .calendar-nav-in {
    text-align: center;
    padding: 10px 6px;
    font-size: 16px;
    font-weight: 600;
    .calendar-nav-pre {
      cursor: pointer;
    }
    .calendar-nav-next {
      cursor: pointer;
    }
  }

  .calendar-cell {
    th {
      border-top: 1px solid #edf0f6;
      border-bottom: 1px solid #edf0f6;
      border-left: 1px solid #edf0f6;
      text-align: center;
      &.sat {
        color: #2c5ade !important;
      }
      &.sun {
        color: #ff3333 !important;
      }
    }
    tr th:last-child {
      border-right: 1px solid #edf0f6;
    }
    td {
      border-left: 1px solid #edf0f6;
      border-bottom: 1px solid #edf0f6;
      padding: 0px;
      vertical-align: top;
      .calendar-item {
        position: relative;
        padding: 3px 6px;
        overflow: hidden;
        &.sat {
          color: #2c5ade !important;
          .day-badge {
            color: #2c5ade !important;
          }
        }
        &.sun {
          color: #ff3333 !important;
          .day-badge {
            color: #ff3333 !important;
          }
        }
        &.holiday {
          .day-badge {
            color: #ff0000 !important;
          }
        }
        .day-badge {
          font-size: 12px;
          width: 20px;
          border-radius: 3em;
          padding: 3px 0.6px;
          line-height: 12px;
          color: #747272;
          display: inline-block;
          text-align: center;
        }

        .calendar-item-slot {
          overflow: hidden;
        }
      }
    }
    tr td:last-child {
      border-right: 1px solid #edf0f6;
    }
    td:hover {
      background: #f0f0f0;
    }
    .active {
      background: #f0f0f0;
    }
    .triangle {
      position: absolute;
      top:0px;
      right: 0px;
      display: inline-block;
      margin: 0px;
      vertical-align: middle;
      width: 14px;
      height: 14px;
      border-bottom: solid 7px transparent;
      border-right: solid 7px #66a3ff;
      border-left: solid 7px transparent;
      border-top: solid 7px #66a3ff;
    }
  }
}
</style>
