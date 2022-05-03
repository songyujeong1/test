<template>
<fr-calendar headerAlign="left" datePropertyPath="basicDate"
  :bodyHeight="bodyHeight"
  :data="scheduleSource"
  :displayDate.sync="displayDate"
  :headerHeight="28"
  :holidays="holidays"
  :navigatorVisibility="true"
  @displayDateChanged="onHandleDisplayDateChanged">
  <template slot="post-header">
    <slot></slot>
  </template>
  <template slot-scope="scope">
    <div v-if="scope.hasHoliday || (showMark === true && scope.dataItem && scope.dataItem.list && scope.dataItem.list.length > 0)" class="triangle" :style="getTaskClass(scope.dataItem.list, scope.hasHoliday)" :title="getTitle(scope.dataItem.list, scope.holidayInfo)">
    </div>
    <ul v-if="showMark === false && scope.dataItem && scope.dataItem.list" class="schedule-task-ul">
      <li v-for="item in scope.dataItem.list" :key="item.scheduleIdx" @click="() => onHandleRowSelected(item)" class="schedule-task-li" :style="'background-color:'+getTaskColor(item.calcType)" />
    </ul>
  </template>
</fr-calendar>
</template>

<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { scheduerMixin } from '@/mixins/scheduerMixin';
import { stringToDate } from '@/utils/commonUtils';

export default {
  name: 'calcScheduler',
  mixins: [commonCodeServiceMixin, scheduerMixin],
  props: {
    bodyHeight: {
      type: Number,
      default: 110,
      required: false
    },
    checkedCalcType: {
      type: Array,
      required: false
    },
    showMark: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      displayDate: null,
      holidays: [],
      scheduleOriginal: null,
      scheduleSource: null,
      searchDate: null,
      toDay: null
    };
  },
  mounted() {
    this.initilizeComponent();
  },
  methods: {
    async initilizeComponent() {
      const payload = await this.httpGetAsync('/api/common/holidayinfo');
      this.holidays = payload.data;
      this.toDay = this.getCurrentDate();
      this.displayDate = this.toDay.getFirstDate();
      this.searchDate = [this.displayDate.toStandardDateString(), this.displayDate.getLastDate().toStandardDateString()];
      this.loadSchedule(true);
    },
    bindSchedule(isInit = false) {
      const _data = [];
      const _toDayTask = [];

      let currentDate = this.displayDate;
      while (currentDate <= this.displayDate.addMonths(1)) {
        const _source = {
          basicDate: currentDate,
          list: []
        };

        this.scheduleOriginal.forEach((item) => {
          if (isInit === true || this.checkedCalcType === undefined || this.checkedCalcType.indexOf(item.calcType) > -1 ) {
            if ( this.toDay.toStandardDateString() === currentDate.toStandardDateString() ) {
              _toDayTask.push(item);
            }

            if (item.freqType === '1' && currentDate.toStandardDateString() === item.fromDate.toStandardDateString()) {
              _source.list.push(item);
            } else if (item.freqType === '4' && currentDate >= item.fromDate) {
              _source.list.push(item);
            } else if (item.freqType === '8' && currentDate.getDay().toString() === item.freqInterval) {
              _source.list.push(item);
            } else if (item.freqType === '16' && currentDate.getDate().toString() === item.freqInterval) {
              _source.list.push(item);
            }
          }
        });

        _data.push(_source);

        currentDate = currentDate.addDays(1);
      }

      this.scheduleSource = _data;
      this.toDayTask = _toDayTask;
    },
    getTitle(list, holidayinfo) {
      let tmp = '';

      if (holidayinfo) {
        tmp = holidayinfo.memo + '\n\r';
      }

      return tmp + (list || []).map((item) => {
        return item.title;
      }).join('\n\r');
    },
    loadSchedule(isInit = false) {
      this.httpGet('/api/common/schedule/scheduleList', {
        startDate: this.searchDate[0],
        endDate: this.searchDate[1]
      }).then((res) => {
        const _tmp = res.data;

        _tmp.forEach((item) => {
          const _start = stringToDate(item.startDate);
          const _end = stringToDate(item.endDate);
          Object.assign(item, {
            fromDate: new Date(_start.getFullYear(), _start.getMonth(), _start.getDate(), 0, 0, 0),
            toDate: item.endDate ? new Date(_end.getFullYear(), _end.getMonth(), _end.getDate(), 0, 0, 0) : new Date(2999, 11, 31)
          });
        });

        this.scheduleOriginal = _tmp;
        this.bindSchedule(isInit);
      });
    },
    onHandleDisplayDateChanged(e) {
      this.searchDate = [e.displayDate.toStandardDateString(), e.displayDate.getLastDate().toStandardDateString()];
      this.loadSchedule();
    },
    onHandleRowSelected(data) {
      this.$emit('onSelectedScheduler', {data: data});
    }
  }
};
</script>

<style lang="scss" scoped>
.schedule-task-ul {
  padding: 0px;
  .schedule-task-li {
    cursor: pointer;
    height:8px;
    margin-top: 2px;
    margin-bottom: 3px;
  }
}
</style>
