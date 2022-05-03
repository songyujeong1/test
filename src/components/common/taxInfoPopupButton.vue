<template>
  <fr-button type="R" size="small" @click="onHandleClick">
    상세 목록
    <div>
      <el-dialog slot="dialogSlot" title="" width="90%" :append-to-body="true" :destroy-on-close="true" :visible.sync="isDialogPopUp" :before-close="onHandleClose" :close-on-click-modal="false" style="margin-top:-75px">
        <div class="charge-confirm-info">
          <div class="panel-head row">
            <div class="col-md-4">
              <h4>요청완료 상세목록 - {{this.$n(taxInfoList.length)}} 건</h4>
            </div>
            <div class="col-md-0 text-right">
              <el-row>
                <fr-downloadbutton :tableRef="this.$refs.taxInfoList" size="small" :excelSubName="'예약목록'">다운로드</fr-downloadbutton>
                <check-tax-invoice-mail-button :data="taxInfoList" :taxInvoiceType="taxInvoiceType" :checkYn="'Y'" :buttonTitle="taxInvoiceType === 'S' ? '세금계산서 발행 체크' : '증빙 수취 체크'" @callback="onHandleCallback" />
                <check-tax-invoice-mail-button :data="taxInfoList" :taxInvoiceType="taxInvoiceType" :checkYn="'N'" :buttonTitle="taxInvoiceType === 'S' ? '세금계산서 발행 체크해제' : '증빙 수취 체크해제'" @callback="onHandleCallback" />
                <init-tax-invoice-mail-button :data="taxInfoList" :taxInvoiceType="taxInvoiceType" @callback="onHandleCallback" />
              </el-row>
            </div>
          </div>
          <div style="height: 600px">
            <fr-table ref="taxInfoList" :data="taxInfoList" :height="500" :border="true">
              <template slot-scope="scope" slot="bookingNo">
                <a href @click.prevent="onHandleTaviManagementPopup(scope.row.bookingNo)" class="underline">{{(scope.row.bookingNo)}}</a>
              </template>
              <template slot-scope="scope" slot="bookingCode">
                <a href @click.prevent="onHandleBookingMasterPopup(scope.row.channelRefNo)" class="underline">{{(scope.row.channelRefNo)}}</a>
              </template>
              <template slot-scope="scope" slot="commissionRateWon">
                <div>{{scope.row.commissionRateWon}}%</div>
              </template>
              <fr-table-column label="선택" prop="isChecked" type="select" :width="50" align="center" fixed />
              <fr-table-column label="지급유형" prop="invoiceType" :width="100" align="center" :formatter="formatHandler"/>
              <fr-table-column label="국내외" prop="localeType" :width="100" align="center" :formatter="formatHandler"/>
              <fr-table-column label="시설명" prop="htlNameKr" :width="250" align="left" :show-overflow-tooltip="true" />
              <fr-table-column label="거래처코드" prop="clientCode" :width="100" align="center" />
              <fr-table-column label="거래처명" prop="clientName" :width="250" align="left" :show-overflow-tooltip="true" />
              <fr-table-column label="Ref No" align="center" >
                <fr-table-column label="TAVI" prop="bookingNo" :width="150" align="center" slotName="bookingNo" />
                <fr-table-column label="Paragon" prop="channelRefNo" :width="150" align="center" slotName="bookingCode" />
                <fr-table-column label="시설예약번호" prop="supplierRefNo" :width="150" align="center" />
              </fr-table-column>
              <fr-table-column label="예약상태" prop="bookingState" :width="100" align="center" :formatter="formatHandler"/>
              <fr-table-column label="유입채널" prop="salesType" :width="150" align="center" :formatter="formatHandler"/>
              <fr-table-column label="투숙객명" prop="bookingMemberName" :width="100" align="center" />
              <fr-table-column label="체크인" prop="checkinDate" :width="100" align="center" type="date" />
              <fr-table-column label="체크아웃" prop="checkoutDate" :width="100" align="center" type="date" />
              <fr-table-column label="박수" prop="stayCnt" :width="100" align="center" />
              <fr-table-column label="객실수" prop="roomCnt" :width="100" align="center" />
              <fr-table-column label="공급컴구분" prop="profitType" :width="150" align="center" :formatter="formatHandler" />
              <fr-table-column label="세금계산서" prop="taxInvoiceYn" :width="100" align="center" />
              <fr-table-column label="통화" prop="standardCurrencyCode" :width="100" align="center" />
              <fr-table-column label="공급원가" prop="supplyNetWon" :width="120" align="right" type="currency"/>
              <fr-table-column label="추가금액" prop="addFareWon" :width="120" align="right" type="currency"/>
              <fr-table-column label="공급컴" prop="commissionWon" :width="120" align="right" type="currency"/>
              <fr-table-column label="채널판매가" prop="channelSaleWon" :width="120" align="right" type="currency"/>
              <fr-table-column v-if="taxInvoiceType === 'S'" label="세금계산서 발행 여부" prop="checkYn" :width="140" align="center" />
              <fr-table-column v-if="taxInvoiceType === 'P'" label="증빙 수취 여부" prop="checkYn" :width="140" align="center" />
              <fr-table-column label="수수료율" prop="commissionRateWon" :width="100" align="center" type="currency" slotName="commissionRateWon" />
            </fr-table>
          </div>
        </div>
        <!-- <div slot="footer" class="dialog-footer" style="margin-top:50px;">
          <fr-button type="C" size="small" @click="onHandleConfirm">저장</fr-button>
          <fr-button type="D" size="small" @click="onHandleCancel">닫기</fr-button>
        </div> -->
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
    },
    taxInvoiceType: {
      type: String,
      default: null
    },
    callbackFunc: {
      type: Function
    }
  },
  data() {
    return {
      selectedRows: null,
      taxInfoList: [],
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

      const _taxInfoList = [];
      this.selectedRows.forEach(data => {
        if (!this.isEmpty(data.taxInfoList)) {
          const dataTaxInfoList = this.cloneObject(data.taxInfoList);
          dataTaxInfoList.forEach(data => {
            data.isChecked = false;
          });
          _taxInfoList.push(...dataTaxInfoList);
        }
      });

      this.taxInfoList = _taxInfoList;
      this.openPopup();
    },
    openPopup() {
      this.isDialogPopUp = !this.isDialogPopUp;
    },
    onHandleConfirm() {
      if (this.isDialogPopUp) {
        if (this.isEmpty(this.invoiceInfo.title)) {
          messageBox.show('', '인보이스제목을 입력해 주세요.');
          return;
        }

        if (this.isEmpty(this.invoiceInfo.recipient)) {
          messageBox.show('', '거래처명(수신처)를 입력해 주세요.');
          return;
        }

        if (this.isEmpty(this.invoiceInfo.calcYearMonth)) {
          messageBox.show('', '인보이스 년월을 입력해 주세요.');
          return;
        }

        this.confirmMsg();
      }
    },
    onHandleClose() {
      this.selectedRows = null;
      this.taxInfoList = [];
      if (this.isDialogPopUp) {
        this.isDialogPopUp = false;
      }
    },
    onHandleCallback() {
      this.selectedRows = null;
      this.taxInfoList = [];
      if (this.isDialogPopUp) {
        this.isDialogPopUp = false;
      }
      this.$emit('callback');
    },
    confirmMsg() {
      const confirmMsg = '인보이스를 생성하시겠습니까?<br/>(발송하지 않은 인보이스는 다음날 삭제됩니다.)';
      messageBox.show('', confirmMsg, 'YesNo').then(dialog => {
        if (dialog === 'yes') {
          this.saveSalesTaxInvoice(this.invoiceInfo);
          this.onHandleClose();
        }
      });
    },
    handleAssignValues() { // dateType에 따른 기간 설정
      Object.assign(this.value, {dateType: this.tmpDateType, date: this.tmpMonth, dateRange: null});
      this.$emit('change', {data: this.value});
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
