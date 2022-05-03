<template>
  <fr-button type="D" size="small" @click="onHandleClick" :disabled="buttonDisable">요청취소</fr-button>
</template>
<script>
import { menuServiceMixin } from '@/mixins/menuServiceMixin';
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';

export default {
  name: 'payCancelButton',
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
    calcProcState: {
      required: false,
      default: null
    }
  },
  data() {
    return {
      payReqData: {
        type: Array,
        default: null
      },
      selectedRows: null,
      alreadyRequestRows: null,
      buttonDisable: false
    };
  },
  created() {
    this.pageName = this.getPageName();
  },
  mounted() {},
  watch: {
    calcProcState(code) {
      const pageName = this.pageName;
      if (!this.isEmpty(code)) {
        switch (pageName) {
          case 'sprpayrequest':
            if (code === '93000004') {
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
  },
  methods: {
    onHandleClick() {
      if (this.isEmpty(this.data)) {
        messageBox.show('', '조회된 데이터가 없습니다.');
        return;
      } else {
        // TODO 기안작성여부도 체크해야함...
        this.selectedRows = this.data.filterBy(x => x.isChecked && x.calcProcState === '93000004' && (x.payMastState === '93400001' || x.payMastState === '93400004'), true);
        this.cantCancelRows = this.data.filterBy(x => x.isChecked && x.payMastState !== '93400001' && x.payMastState !== '93400004', true);
      }

      if (!this.isEmpty(this.cantCancelRows)) {
        messageBox.show('', '기안상신대기와 기안반려건만 취소 할 수 있습니다.');
        return;
      }

      if (this.isEmpty(this.selectedRows)) {
        messageBox.show('', '취소가능한 항목이 없습니다.');
        return;
      }

      let payMastIdList = [];
      this.selectedRows.map(item => {
        if (!this.isEmpty(item.payMastId) && item.payMastId !== 0) {
          payMastIdList.push(item.payMastId);
        }
      });

      messageBox
        .show('', `<span style="color:red">선택한 공급사와 같이 지급요청 한 전체 공급사 항목이 취소됩니다.</span>
                  <br/><span style="color:red">[기안반려] 상태건은 그룹웨어 재상신을 자제해주세요.</span>
                  <br/>취소요청을 하시겠습니까?`, 'YesNo')
        .then(dialog => {
          if (dialog === 'yes') {
            this.payReqCancelProcess(payMastIdList);
          }
        });
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
