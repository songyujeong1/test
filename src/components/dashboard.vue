<template>
  <div class="flex-scroll-y" style="padding-right:5px;">
    <booking-info-popup ref="bookingPopup" />
    <div class="panel panel-flat">
      <div class="panel-head">
        <h1 class="panel-title">정산업무 현황판</h1>
      </div>
      <div class="list-group-divider"></div>
      <div class="panel-body">
        <div class="m-h-10 over-h">
          <condition-box :conditions="conditions" :srchCondition="searchCondition" :rootPage="true" @loaded="onHandleRetrieve" @retrieve="onHandleRetrieve"/>
          <div class="col-md-4">
            <h6 class="panel-title p-10">정산상태 집계 현황</h6>
          </div>
          <div class="col-md-8 text-right m-v-10">
            현재 일시 : {{$d(toDay, 'long')}}, 집계 일시 : {{$d(toDay.addDays(-1), 'd')}} 24:00
          </div>
        </div>
      </div>
      <div class="row m-v-10" style="border:1px solid #eee;">
        <div class="col-md-8">
          <sales-summary :data="dashBoardDataSc"/>
          <div style="height:5px" />
          <pay-summary :data="dashBoardDataPc"/>
        </div>
        <div class="col-md-4">
          <calc-scheduler ref="calcScheduler" :bodyHeight="40" :showMark="true"/>
        </div>
      </div>
    </div>
    <div class="m-t-20">
    <div class="panel panel-flat">
      <div class="panel-head bg-grey-light row">
        <div class="col-md-4">
          <h6 class="panel-title p-10">정산오류 및 불일치 정보 내역 화면 - {{this.$n(errorListCnt)}} 건</h6>
        </div>
        <div class="col-md-8 text-right">
          <el-row>
            <fr-downloadbutton :tableRef="this.$refs.grdList" size="small">다운로드</fr-downloadbutton>
            <charge-confirm-button :domRef="this.$refs.grdList" :data="errorListData" @callback="onHandleRetrieve"/>
          </el-row>
        </div>
      </div>
      <div class="panel-body">
        <div class="m-h-10">
          <fr-table ref="grdList" :data="errorListData" height="500" :border="true" style="width:100%;">
            <template slot-scope="scope" slot="bookingCodeSlot">
              <a href @click.prevent="onHandleBookingMasterPopup(scope.row.bookingCode)" class="underline">{{(scope.row.bookingCode)}}</a>
            </template>
            <fr-table-column label="선택" prop="isChecked" type="select" :width="50" align="center" fixed />
            <fr-table-column label="정산상태" prop="calcProcState" :width="100" align="center" :formatter="formatHandler"/>
            <fr-table-column label="예약상태" prop="bookingState" :width="100" align="center" :formatter="formatHandler"/>
            <fr-table-column label="예약번호" prop="bookingCode" :width="120" align="center" slotName="bookingCodeSlot" />
            <fr-table-column label="오류/불일치" header-align="center">
              <fr-table-column label="담당자명" prop="bookingManagerNm" :width="100" align="center"/>
              <fr-table-column label="오류처리상태" prop="procState" :width="100" align="center" :formatter="formatHandler"/>
              <fr-table-column label="오류/불일치 유형" prop="errorUpperState" :width="150" align="center" :formatter="formatHandler" type="hightlight"/>
              <fr-table-column label="오류/불일치 상세" prop="errorDetailState" :width="200" align="center" :formatter="formatHandler" type="hightlight"/>
            </fr-table-column>
            <fr-table-column label="예약정보" header-align="center">
              <fr-table-column label="예약자명" prop="bookingMemberName" :width="100" align="center"/>
              <fr-table-column label="고객ID" prop="bookingId" :width="100" align="center"/>
              <fr-table-column label="호텔명" prop="htlNameKr" :width="250" />
              <fr-table-column label="고객사 예약번호" prop="sprBookingNo" :width="120" align="center"/>
              <fr-table-column label="체크인" prop="checkinDate" :width="100" align="center" type="date" />
              <fr-table-column label="체크아웃" prop="checkoutDate" :width="100" align="center" type="date" />
              <fr-table-column label="공급사" prop="sprNameKr" :width="100" align="center"/>
              <fr-table-column label="유입채널" prop="salesType" :width="100" align="center" :formatter="formatHandler"/>
            </fr-table-column>
            <fr-table-column label="판매정보" header-align="center">
              <fr-table-column label="취급액(판매가)" prop="totalSaleFare" :width="150" header-align="center" align="right" type="currency" />
            </fr-table-column>
            <fr-table-column label="매입정보" header-align="center">
              <fr-table-column label="공급원가(원화)" prop="supplyNetWon" :width="150" header-align="center" align="right" type="currency" />
              <fr-table-column label="추가금액(원화)" prop="addFareWon" :width="150" header-align="center" align="right" type="currency" />
              <fr-table-column label="공급컴(외화)" prop="commissionWon" :width="150" header-align="center" align="right" type="currency" />
              <fr-table-column label="M/U(원화)" prop="markupFare" :width="150" header-align="center" align="right" type="currency" />
              <fr-table-column label="정산통화" prop="standardCurrencyCode" :width="150" align="center"/>
              <fr-table-column label="판매시점 원화환율" prop="exchangeCost" :width="150" header-align="center" align="right" type="currency" />
              <fr-table-column label="공급원가(외화)" prop="supplyNetInt" :width="150" header-align="center" align="right" type="currency" />
              <fr-table-column label="추가금액(외화)" prop="addFareInt" :width="150" header-align="center" align="right" type="currency" />
              <fr-table-column label="공급컴(외화)" prop="commissionInt" :width="150" header-align="center" align="right" type="currency" />
            </fr-table-column>
            <fr-table-column label="할인정보" header-align="center">
              <fr-table-column label="할인" prop="discountFare" :width="100" header-align="center" align="right" type="currency" />
              <fr-table-column label="특가할인" prop="tsSalesPrice" :width="100" header-align="center" align="right" type="currency" />
              <fr-table-column label="기타할인" prop="etcDiscPrice" :width="100" header-align="center"  align="right" type="currency" />
            </fr-table-column>
            <fr-table-column label="결제정보" header-align="center">
              <fr-table-column label="주결제" header-align="center">
                <fr-table-column label="카드결제" prop="cardAmt"  :width="100" header-align="center" align="right" type="currency" />
                <fr-table-column label="현금결제" prop="virtualAmt"  :width="100" header-align="center" align="right" type="currency" />
                <fr-table-column label="KCP" prop="bpAmt"  :width="100" header-align="center" align="right" type="currency" />
              </fr-table-column>
              <fr-table-column label="보조결제" header-align="center">
                <fr-table-column label="M포인트" prop="" :width="100" header-align="center" align="right"/>
                <fr-table-column label="HCC선할인" prop="hccDiscountAmt" :width="100" header-align="center" align="right" type="currency" />
                <fr-table-column label="패밀리할인" prop="familyDiscountAmt" :width="100" header-align="center" align="right" type="currency" />
                <fr-table-column label="HCC이용권" prop="hccUseAmt" :width="100" header-align="center" align="right" type="currency" />
                <fr-table-column label="P리워드" prop="pupleRwardAmt" :width="100" header-align="center" align="right" type="currency" />
                <fr-table-column label="W리워드" prop="pupleWAmt" :width="100" header-align="center" align="right" type="currency" />
                <fr-table-column label="그린바우처" prop="greenVoucherAmt" :width="100" header-align="center" align="right" type="currency" />
                <fr-table-column label="레드바우처" prop="redVoucherAmt" :width="100" header-align="center" align="right" type="currency" />
                <fr-table-column label="PRIVIA 회원할인" prop="priviaDiscountAmt" :width="130" header-align="center" align="right" type="currency" />
                <fr-table-column label="TS이용권" prop="tideUseAmt" :width="100" header-align="center" align="right" type="currency" />
                <fr-table-column label="PRIVIA쿠폰" :width="100" header-align="center" align="right" :formatter="getCouponAmt" />
                <fr-table-column label="할인번호" :width="200" align="center" :formatter="getCouponNames" />
              </fr-table-column>
            </fr-table-column>
            <fr-table-column label="업체지급액(원화)" prop="supplyPaymentWon" :width="150" header-align="center" align="right" type="currency" />
            <fr-table-column label="지급예정일" prop="" :width="100" align="center"/>
            <fr-table-column label="정산년월" prop="calcRevenueMonth" :width="100" align="center"/>
            <fr-table-column label="비고" :width="10" align="center"/>
          </fr-table>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { handleFormatMixin } from '@/mixins/handleFormatMixin';

export default {
  name: 'dashboard',
  components: {
    // salesSummary,
    // paySummary,
    calcScheduler
  },
  mixins: [commonCodeServiceMixin, handleFormatMixin],
  data() {
    return {
      conditions: null,
      dashBoardDataSc: {},
      dashBoardDataPc: {},
      toDay: null,
      searchCondition: [],
      errorListData: [],
      selectedMisMatchRows: [],
      errorListCnt: 0
    };
  },
  created() {
    this.toDay = this.getCurrentTime();
    this.conditions = {
      isCoustom: true,
      type: '',
      canUseExpand: false,
      rows: [
        {
          fields: [
            {name: 'selectDateRange'},
            { name: 'salesType' },
            { name: 'localeType' },
            { name: 'bookingState' }
          ]
        }
      ]
    };
  },
  mounted() {
    this.initializeComponent();
  },
  methods: {
    async initializeComponent() {
    },
    onHandleRetrieve(e) { //  일괄조회 클릭
      if (e) {
        this.searchCondition = e.data;
      }
      if (!this.dateValidCheck(this.searchCondition)) {
        return;
      }
      this.initializeDataList(['errorList']);
      this.httpGet('/api/mp/dashBoard', this.searchCondition).then(res => {
        if (!this.isEmpty(res)) {
          this.dashBoardDataSc = res.data.scDashBoardList;
          this.dashBoardDataPc = res.data.pcDashBoardList;
        }
      });
      // 대시보드 데이터
      this.httpGet('/api/mp/errorList', this.searchCondition).then(res => {
        if (!this.isEmpty(res)) {
          res.data.errorList.forEach(data => {
            data.isChecked = false;
          });
          this.errorListData = res.data.errorList;
          this.errorListCnt = res.data.request.totalRowCnt;
        }
      }); // 불일치 데이터
    }
  }
};
</script>
