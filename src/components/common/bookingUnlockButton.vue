<template>
  <fr-button type="K" size="small" @click="onHandleClick" :disabled="buttonDisable">예약 잠금 해제</fr-button>
</template>
<script>
import { menuServiceMixin } from '@/mixins/menuServiceMixin';
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';

export default {
  name: 'bookingUnlockButton',
  mixins: [menuServiceMixin, actionServiceMixin, commonCodeServiceMixin],
  props: {
    domRef: {
      type: Object,
      default: null
    },
    data: {
      type: Array,
      default: null
    },
    calcType: {
      required: false,
      default: null
    }
  },
  data() {
    return {
      selectedRows: null,
      cantUnlockRows: null,
      buttonDisable: false
    };
  },
  created() {
    this.pageName = this.getPageName();
  },
  mounted() {},
  /* watch: {
    calcProcState(code) {
      const pageName = this.pageName;
      if (!this.isEmpty(code)) {
        switch (pageName) {
          case 'bookinglockmng':
            if (code === '93000003') {
              this.buttonDisable = false;
            } else {
              this.buttonDisable = true;
            }
            break;
          default:
            this.buttonDisable = true;
            break;
        }
      }
    }
  }, */
  methods: {
    onHandleConfirm() {
      messageBox
        .show('', `${this.selectedRows.length}건의 예약을 <span style="color:red">잠금 해제</span> 하시겠습니까?<br/>`, 'YesNo')
        .then(dialog => {
          if (dialog === 'yes') {
            this.bookingLockChangeProcess(this.calcType, 'Y', this.selectedRows.map((item) => { return item.bookingId; }));
          }
        });
    },
    onHandleClick() {
      if (this.isEmpty(this.data)) {
        messageBox.show('', '조회된 데이터가 없습니다.');
        return;
      } else {
        this.selectedRows = this.data.filterBy(x => x.isChecked && x.calcModYn === 'N', true);
        this.cantUnlockRows = this.data.filterBy(x => x.isChecked && x.calcModYn !== 'N', true);
      }
      if (this.isEmpty(this.selectedRows) && !this.isEmpty(this.cantUnlockRows)) {
        messageBox.show('', '잠기지 않은 예약건은 잠금 해제 할 수 없습니다.');
        return;
      }
      if (this.isEmpty(this.selectedRows) && this.isEmpty(this.cantUnlockRows)) {
        messageBox.show('', '선택된 항목이 없습니다.');
        return;
      }
      this.onHandleConfirm();
    }
  }
};
</script>

<style lang="scss" scoped>
.charge-confirm-info {
  cursor: default;
  font-size: 14px;
  td {
    text-align: left;
    padding: 5px 15px;
  }
  th {
    font-weight: bold;
    text-align: left;
    padding: 5px 15px;
  }
}
</style>
