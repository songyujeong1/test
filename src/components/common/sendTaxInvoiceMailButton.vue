<template>
  <fr-button type="C" size="small" @click="onHandleClick" :disabled="buttonDisable">
    <!-- {{this.taxInvoiceType === 'P' ? '리스트 발송' : '세금계산서 발송'}} -->
    리스트 발송
    <div>
      <el-dialog slot="dialogSlot" title="" width="80%" :append-to-body="true" :destroy-on-close="true" :visible.sync="isDialogPopUp" :before-close="onHandleClose" :close-on-click-modal="false" style="margin-top:-75px">
        <div class="charge-confirm-info">
          <div class="panel-head row">
            <div class="col-md-4">
              <h4 slot="title">
                <!-- {{this.taxInvoiceType === 'P' ? '리스트 발송' : '세금계산서 발송'}} -->
                리스트 발송
              </h4>
            </div>
          </div>
          <table class="table-basic">
            <colgroup>
              <col style="width:15%;" />
              <col style="width:35%;" />
              <col style="width:15%;" />
              <col style="width:35%;" />
            </colgroup>
            <tbody style="text-align:center">
              <tr>
                <th class="table-head">메일 제목<span style="color:red">*</span></th>
                <td class="text-left" colspan="3"><el-input placeholder="메일제목" size="small" v-model="mailInfo.title" maxlength="50" clearable /></td>
              </tr>
              <tr>
                <th class="table-head">메일 내용</th>
                <td class="text-left" colspan="3">
                  <el-input type="textarea" placeholder="내용" rows="3" v-model="mailInfo.content" maxlength="400" ></el-input>
                </td>
              </tr>
              <tr>
                <th class="table-head">발송대상 이메일<span style="color:red">*</span></th>
                <td class="text-left" colspan="3">
                  <el-select v-model="mailInfo.emails" placeholder="선택" size="small" multiple filterable default-first-option clearable>
                    <el-option v-for="item in emailsOptions" :key="item.key" :label="item.label" :value="item.email" />
                  </el-select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="panel panel-flat" style="margin-top:20px;">
          <div class="panel-head row" style="padding-left: 0px;" v-if="taxInvoiceType === 'S'">
            <div class="col-md-4" style="padding-left: 0px;">
              <h6>인보이스 생성 목록 - {{this.$n(invoiceListCnt)}} 건</h6>
            </div>
          </div>
          <div class="panel-body" v-if="taxInvoiceType === 'S'">
            <fr-table ref="invoiceList" :data="invoiceList" :height="300" :border="true">
              <fr-table-column label="선택" prop="isChecked" type="select" :width="50" align="center" />
              <fr-table-column label="인보이스제목" prop="title" :width="250" align="center" />
              <fr-table-column label="인보이스년월" prop="calcYearMonth" :width="100" align="center" />
              <fr-table-column label="수신처(거래처명)" prop="recipient" :width="270" align="left" :show-overflow-tooltip="true" />
              <fr-table-column label="공급컴" prop="commissionWon" :width="130" align="right" type="currency" />
              <fr-table-column label="채널판매가" prop="channelSaleWon" :width="130" align="right" type="currency" />
              <fr-table-column label="비고" prop="note" :width="130" align="left" />
              <fr-table-column label="예약수" prop="bookingCnt" :width="100" align="center" />
              <fr-table-column label="등록자" prop="registorNm" :width="100" align="center" />
              <fr-table-column label="등록일" prop="registDt" :width="150" align="center" />
            </fr-table>
          </div>
        </div>
        <div class="panel panel-flat">
          <div class="panel-head row" style="padding-left: 0px;">
            <div class="col-md-4" style="padding-left: 0px;">
              <h6>예약 목록 - {{this.$n(bookingInfoListCnt)}} 건</h6>
            </div>
            <div class="col-md-0 text-right">
              <el-row>
                <fr-downloadbutton :tableRef="this.$refs.bookingInfoList" size="small" :excelSubName="'예약목록'">다운로드</fr-downloadbutton>
              </el-row>
            </div>
          </div>
          <div class="panel-body">
            <fr-table ref="bookingInfoList" :data="bookingInfoList" :height="300" :border="true">
              <template slot-scope="scope" slot="bookingNo">
                <a href @click.prevent="onHandleTaviManagementPopup(scope.row.bookingNo)" class="underline">{{(scope.row.bookingNo)}}</a>
              </template>
              <template slot-scope="scope" slot="bookingCode">
                <a href @click.prevent="onHandleBookingMasterPopup(scope.row.channelRefNo)" class="underline">{{(scope.row.channelRefNo)}}</a>
              </template>
              <template slot-scope="scope" slot="commissionRateWon">
                <div>{{scope.row.commissionRateWon}}%</div>
              </template>
              <fr-table-column label="지급유형" prop="invoiceType" :width="100" align="center" :formatter="formatHandler"/>
              <fr-table-column label="거래처명" prop="clientName" :width="250" align="left" :show-overflow-tooltip="true" />
              <fr-table-column label="Ref No" align="center" >
                <fr-table-column label="TAVI" prop="bookingNo" :width="150" align="center" slotName="bookingNo" />
                <fr-table-column label="Paragon" prop="channelRefNo" :width="150" align="center" slotName="bookingCode" />
                <fr-table-column label="시설예약번호" prop="supplierRefNo" :width="150" align="center" />
              </fr-table-column>
              <fr-table-column label="예약상태" prop="bookingState" :width="100" align="center" :formatter="formatHandler"/>
              <fr-table-column label="투숙객명" prop="bookingMemberName" :width="100" align="center" />
              <fr-table-column label="체크인" prop="checkinDate" :width="100" align="center" type="date" />
              <fr-table-column label="체크아웃" prop="checkoutDate" :width="100" align="center" type="date" />
              <fr-table-column label="박수" prop="stayCnt" :width="100" align="center" />
              <fr-table-column label="객실수" prop="roomCnt" :width="100" align="center" />
              <fr-table-column label="통화" prop="standardCurrencyCode" :width="100" align="center" />
              <fr-table-column label="원화" align="center">
                <fr-table-column label="공급원가" prop="supplyNetWon" :width="120" header-align="center" align="right" type="currency"/>
                <fr-table-column label="추가금액" prop="addFareWon" :width="120" header-align="center" align="right" type="currency"/>
                <fr-table-column label="공급컴" prop="commissionWon" :width="120" header-align="center" align="right" type="currency"/>
                <fr-table-column label="채널판매가" prop="channelSaleWon" :width="120" header-align="center" align="right" type="currency"/>
              </fr-table-column>
              <fr-table-column label="수수료율" prop="commissionRateWon" :width="100" align="center" type="currency" slotName="commissionRateWon" v-if="taxInvoiceType === 'S'" />
            </fr-table>
          </div>
        </div>
        <div class="panel panel-flat" v-show="isOpenPreView === true">
          <div class="panel-head row" style="padding-left: 0px;">
            <div class="col-md-4" style="padding-left: 0px;">
              <h6>미리 보기</h6>
            </div>
          </div>
          <div class="panel-body">
            <p v-html="preViewHtml"></p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <fr-button type="R" @click="onHandlePreViewClose" v-show="isOpenPreView === true">미리보기 닫기</fr-button>
          <fr-button type="R" @click="onHandlePreView" v-show="isOpenPreView === false">미리보기</fr-button>
          <fr-button type="C" @click="onHandleConfirm">발송</fr-button>
          <fr-button type="D" @click="onHandleClose">취소</fr-button>
        </span>
      </el-dialog>
    </div>
  </fr-button>
</template>
<script>
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';

export default {
  name: 'send-tax-invoice-mail-button',
  mixins: [actionServiceMixin, commonCodeServiceMixin],
  props: {
    data: {
      type: Array,
      default: null
    },
    notiConfirm: {
      type: Boolean,
      default: false
    },
    taxInvoiceType: {
      type: String,
      default: 'S'
    }
  },
  data() {
    return {
      selectedRows: null,
      pageName: null,
      mailInfo: {
        title: null,
        content: null,
        yearMonth: null,
        recipient: null,
        calcAmt: 0,
        note: null,
        bookingCnt: 0,
        emails: []
      },
      bookingInfoList: [],
      bookingInfoListCnt: 0,
      invoiceList: [],
      invoiceListCnt: 0,
      buttonDisable: false,
      isDialogPopUp: false,
      emailsOptions: [],
      preViewHtml: '',
      isOpenPreView: false
    };
  },
  created() {
    this.pageName = this.getPageName();
    this.mailInfo = {
      title: null,
      content: null,
      yearMonth: null,
      recipient: null,
      calcAmt: 0,
      note: null,
      bookingCnt: 0,
      emails: []
    };
    this.invoiceList = [];
    this.bookingInfoList = [];
    this.preViewHtml = '';
    this.isOpenPreView = false;
    this.buttonDisable = false;
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

      this.initializeDataList(['bookingInfoList', 'invoiceList']);

      let uniqFacilityNoList = [];
      this.bookingInfoList = this.cloneObject(this.selectedRows);
      this.bookingInfoList.forEach(data => {
        data.isChecked = false;
        if (!uniqFacilityNoList.includes(data.facilityNo)) {
          uniqFacilityNoList.push(data.facilityNo);
        }
      });
      this.bookingInfoListCnt = this.bookingInfoList.length;

      this.invoiceList = [];
      this.invoiceListCnt = 0;
      this.$nextTick(() => {
        if (this.taxInvoiceType === 'S') {
          // 매출일때만
          this.httpGet('/api/tc/salesTaxInvoice', []).then(res => {
            if (res && !this.isEmpty(res.data)) {
              res.data.forEach(data => {
                data.isChecked = false;
              });
              this.invoiceList = this.cloneObject(res.data);
              this.invoiceListCnt = this.invoiceList.length;
            }
          });
        }

        // if (this.isEmpty(this.emailsOptions)) {
        const _emailsOptions = [];
        // 정산담당자 default
        let key = 0;
        _emailsOptions.push({'key': key++, 'label': `ys.lee@tidesquare.com (TS1009)`, 'email': 'ys.lee@tidesquare.com'});
        _emailsOptions.push({'key': key++, 'label': `always4479@priviatravel.com (TS0307)`, 'email': 'always4479@priviatravel.com'});
        _emailsOptions.push({'key': key++, 'label': `khm0938@tourvis.com (TS0685)`, 'email': 'khm0938@tourvis.com'});

        this.httpGet('/api/common/code/taxEmailInfo', []).then(res => {
          if (res && !this.isEmpty(res.data)) {
            res.data.forEach(data => {
              if (!this.isEmpty(data.email1)) {
                _emailsOptions.push({'key': key++, 'label': `${data.email1} (${data.htlNameKr})`, 'email': data.email1});
                if (uniqFacilityNoList.includes(data.facilityNo) && !this.mailInfo.emails.includes(data.email1)) {
                  this.mailInfo.emails.push(data.email1);
                }
              }
              if (!this.isEmpty(data.email2)) {
                _emailsOptions.push({'key': key++, 'label': `${data.email2} (${data.htlNameKr})`, 'email': data.email2});
                if (uniqFacilityNoList.includes(data.facilityNo) && !this.mailInfo.emails.includes(data.email2)) {
                  this.mailInfo.emails.push(data.email2);
                }
              }
              if (!this.isEmpty(data.email3)) {
                _emailsOptions.push({'key': key++, 'label': `${data.email3} (${data.htlNameKr})`, 'email': data.email3});
                if (uniqFacilityNoList.includes(data.facilityNo) && !this.mailInfo.emails.includes(data.email3)) {
                  this.mailInfo.emails.push(data.email3);
                }
              }
              if (!this.isEmpty(data.email4)) {
                _emailsOptions.push({'key': key++, 'label': `${data.email4} (${data.htlNameKr})`, 'email': data.email4});
                if (uniqFacilityNoList.includes(data.facilityNo) && !this.mailInfo.emails.includes(data.email4)) {
                  this.mailInfo.emails.push(data.email4);
                }
              }
              if (!this.isEmpty(data.email5)) {
                _emailsOptions.push({'key': key++, 'label': `${data.email5} (${data.htlNameKr})`, 'email': data.email5});
                if (uniqFacilityNoList.includes(data.facilityNo) && !this.mailInfo.emails.includes(data.email5)) {
                  this.mailInfo.emails.push(data.email5);
                }
              }
            });
            this.emailsOptions = _emailsOptions;
          }
        });
        // }

        // 디폴트 이메일
        let userId = this.$store.getters.userInfo.userId;
        if (userId === 'TS1009') {
          this.mailInfo.emails = ['ys.lee@tidesquare.com'];
        } else if (userId === 'TS0307') {
          this.mailInfo.emails = ['always4479@priviatravel.com'];
        } else if (userId === 'TS0685') {
          this.mailInfo.emails = ['khm0938@tourvis.com'];
        }
      });

      this.openPopup();
    },
    openPopup() { // 정산년월 선택 팝업
      this.preViewHtml = '';
      this.onHandlePreViewClose();
      this.isDialogPopUp = !this.isDialogPopUp;
    },
    onHandlePreView() {
      let selectedInvoices = this.invoiceList.filterBy(x => x.isChecked, true);
      let length = this.isEmpty(selectedInvoices) ? 0 : selectedInvoices.length;
      if (length > 1 && length !== 0) {
        messageBox.show('', '인보이스를 하나만 선택해주세요.');
        return;
      }

      Object.assign(this.mailInfo, {invoiceInfo: length === 0 ? null : selectedInvoices[0], bookingInfoList: this.bookingInfoList});
      const request = {
        invoiceInfo: length === 0 ? null : selectedInvoices[0],
        bookingInfoList: this.bookingInfoList,
        title: this.mailInfo.title,
        content: this.mailInfo.content,
        // emails: this.mailInfo.emails.join(','),
        taxInvoiceType: this.taxInvoiceType
      };

      this.httpPost('/api/common/action/previewTaxInvoiceEmailContent', request).then(res => {
        if (res && !this.isEmpty(res.data)) {
          this.preViewHtml = res.data;
          this.isOpenPreView = true;
        }
      });
    },
    onHandlePreViewClose() {
      this.preViewHtml = '';
      this.isOpenPreView = false;
    },
    onHandleConfirm() {
      if (this.isDialogPopUp) {
        if (this.isEmpty(this.mailInfo.title)) {
          messageBox.show('', '메일 제목을 입력해 주세요.');
          return;
        }

        if (this.isEmpty(this.mailInfo.emails)) {
          messageBox.show('', '발송대상 이메일을 하나 이상 선택해주세요.');
          return;
        }

        let selectedInvoices = this.invoiceList.filterBy(x => x.isChecked, true);
        let length = this.isEmpty(selectedInvoices) ? 0 : selectedInvoices.length;
        if (length > 1 && length !== 0) {
          messageBox.show('', '인보이스를 하나만 선택해주세요.');
          return;
        }

        this.confirmMsg();
      }
    },
    onHandleClose() {
      this.mailInfo = {
        title: null,
        content: null,
        emails: []
      };
      if (this.isDialogPopUp) {
        this.isDialogPopUp = false;
      }
    },
    confirmMsg() {
      let selectedInvoices = this.invoiceList.filterBy(x => x.isChecked, true);
      let length = this.isEmpty(selectedInvoices) ? 0 : selectedInvoices.length;

      const confirmMsg = `메일을 발송하시겠습니까?<br/>메일대상자 : ${this.mailInfo.emails.length}명<br/>선택한 인보이스 : ${length === 0 ? '없음' : selectedInvoices[0].title}`;
      messageBox.show('', confirmMsg, 'YesNo').then(dialog => {
        if (dialog === 'yes') {
          Object.assign(this.mailInfo, {invoiceInfo: length === 0 ? null : selectedInvoices[0], bookingInfoList: this.bookingInfoList});
          this.sendTaxInvoiceEmail({
            invoiceInfo: length === 0 ? null : selectedInvoices[0],
            bookingInfoList: this.bookingInfoList,
            title: this.mailInfo.title,
            content: this.mailInfo.content,
            emails: this.mailInfo.emails.join(','),
            taxInvoiceType: this.taxInvoiceType
          }).then(() => {
            this.onHandleClose();
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
