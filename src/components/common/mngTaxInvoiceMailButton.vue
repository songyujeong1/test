<template>
  <fr-button type="C" size="small" @click="onHandleClick">
    세금계산서 이메일 설정
    <div>
      <el-dialog slot="dialogSlot" title="" width="40%" :append-to-body="true" :destroy-on-close="true" :visible.sync="isDialogPopUp" :before-close="onHandleClose" :close-on-click-modal="false" style="margin-top:-75px">
        <div class="charge-confirm-info">
          <div class="panel-head row">
            <div class="col-md-10">
              <h4>{{this.htlInfo.htlNameKr}} <font color="blue">({{this.htlInfo.facilityNo}})</font></h4>
            </div>
          </div>
          <table class="table-basic">
            <colgroup>
              <col style="width:30%;" />
              <col style="width:70%;" />
              <!-- <col style="width:15%;" />
              <col style="width:35%;" /> -->
            </colgroup>
            <tbody style="text-align:center">
              <tr>
                <th class="table-head">Email1</th>
                <td class="text-left"><el-input type="text" v-model="htlInfo.email1" maxlength="200" size="small" ></el-input></td>
              </tr>
              <tr>
                <th class="table-head">Email2</th>
                <td class="text-left"><el-input type="text" v-model="htlInfo.email2" maxlength="200" size="small" ></el-input></td>
              </tr>
              <tr>
                <th class="table-head">Email3</th>
                <td class="text-left"><el-input type="text" v-model="htlInfo.email3" maxlength="200" size="small" ></el-input></td>
              </tr>
              <tr>
                <th class="table-head">Email4</th>
                <td class="text-left"><el-input type="text" v-model="htlInfo.email4" maxlength="200" size="small" ></el-input></td>
              </tr>
              <tr>
                <th class="table-head">Email5</th>
                <td class="text-left"><el-input type="text" v-model="htlInfo.email5" maxlength="200" size="small" ></el-input></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div slot="footer" class="dialog-footer">
          <fr-button type="C" size="small" @click="onHandleConfirm">저장</fr-button>
          <fr-button type="D" size="small" @click="onHandleClose">닫기</fr-button>
        </div>
      </el-dialog>
    </div>
  </fr-button>
</template>

<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
// import store from '@/store';
// import BigNumber from 'bignumber.js';

export default {
  name: 'taxInfoPopupButton',
  mixins: [commonCodeServiceMixin, actionServiceMixin],
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      selectedRows: null,
      prevHtlInfo: {},
      htlInfo: {},
      isDialogPopUp: false
    };
  },
  created() {

  },
  watch: {

  },
  methods: {
    onHandleClick() {
      if (this.isEmpty(this.data)) {
        messageBox.show('', '조회된 데이터가 없습니다.');
        return;
      }

      this.selectedRows = this.data.filterBy(x => x.isChecked, true);

      if (this.isEmpty(this.selectedRows)) {
        messageBox.show('', '선택된 항목이 없습니다.');
        return;
      }

      if (this.selectedRows.length > 1) {
        messageBox.show('', '호텔 하나만 선택해 주세요.');
        return;
      }

      this.prevHtlInfo = this.cloneObject(this.selectedRows[0]);
      this.htlInfo = this.cloneObject(this.selectedRows[0]);
      this.openPopup();
    },
    openPopup() {
      this.isDialogPopUp = !this.isDialogPopUp;
    },
    onHandleConfirm() {
      if (this.isDialogPopUp) {
        if (this.prevHtlInfo.email1 !== this.htlInfo.email1 ||
            this.prevHtlInfo.email2 !== this.htlInfo.email2 ||
            this.prevHtlInfo.email3 !== this.htlInfo.email3 ||
            this.prevHtlInfo.email4 !== this.htlInfo.email4 ||
            this.prevHtlInfo.email5 !== this.htlInfo.email5) {
          // 변한 이메일이 있음
          this.confirmMsg();
        } else {
          messageBox.show('', '변경된 이메일이 없습니다.');
          return false;
        }
      }
    },
    onHandleClose() {
      this.selectedRows = null;
      this.prevHtlInfo = {};
      this.htlInfo = {};
      if (this.isDialogPopUp) {
        this.isDialogPopUp = false;
      }
    },
    onHandleCallback() {
      this.selectedRows = null;
      this.prevHtlInfo = {};
      this.htlInfo = {};
      if (this.isDialogPopUp) {
        this.isDialogPopUp = false;
      }
      this.$emit('callback');
    },
    confirmMsg() {
      const confirmMsg = `${this.htlInfo.htlNameKr}의 세금계산서 이메일 설정을 변경하시겠습니까?`;
      messageBox.show('', confirmMsg, 'YesNo').then(dialog => {
        if (dialog === 'yes') {
          this.httpPost('/api/common/action/insertTaxInvoiceEmail', this.htlInfo).then(() => {
            messageBox.show('', '변경 되었습니다.').then(() => {
              this.onHandleCallback();
            });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.table-basic {
  cursor: default;
  th {
    font-weight: bold;
    text-align: left;
    background: #f5f7fa;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
