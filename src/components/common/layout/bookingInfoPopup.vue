<template>
<el-dialog :visible.sync="dialogVisible" width="70%" min-height="400" @close="initializeComponent" :close-on-click-modal="false" style="margin-top:-75px">
  <div>
    <h4 slot="title">ONP 이력 확인 {{this.bookingCodeText}}</h4>
    <el-table :data="memoInfoData" :border="true" :max-height="400">
      <el-table-column label="내용" prop="title" :min-width="500" header-align="center" align="left" show-overflow-tooltip/>
      <!-- <el-table-column label="내용" prop="cont" :min-width="300" header-align="center" align="left" /> -->
      <el-table-column label="작성자" prop="registorName" :min-width="100" align="center" />
      <el-table-column label="작성일" :min-width="90" align="center">
        <template slot-scope="scope">{{$dNull(scope.row.registDt)}}</template>
      </el-table-column>
    </el-table>
  </div>
  <div style="margin-top:30px">
    <h4>담당자 확인요청 이력</h4>
    <el-table :data="managerConfirmList" :border="true">
      <el-table-column label="정산 담당자" align="center">
        <el-table-column label="요청메모" prop="reqMemo" :min-width="350" :min-height="100" align="center" show-overflow-tooltip/>
        <el-table-column label="정산 담당자" :min-width="120" align="center">
          <template slot-scope="scope">{{scope.row.calcManagerNm}} {{scope.row.calcManagerId}}</template>
        </el-table-column>
        <el-table-column label="확인요청일" :min-width="100" align="center">
        <template slot-scope="scope">{{$dNull(scope.row.registDt)}}</template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="예약 담당자" :min-width="120" align="center" class="fl">
        <el-table-column label="응답메모" prop="resMemo" :min-width="350" :min-height="100" align="center" show-overflow-tooltip/>
        <el-table-column label="예약 담당자" :min-width="150" align="center">
          <template slot-scope="scope">{{scope.row.bookingManagerNm}} {{scope.row.bookingManagerId}}</template>
        </el-table-column>
        <el-table-column label="재정산요청일" :min-width="100" align="center">
          <template slot-scope="scope">{{$dNull(scope.row.responseDt)}}</template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
  <div style="margin-top:30px;">
    <h4>매출정산 특이사항</h4>
    <el-form label-width="120px">
      <el-select v-model="calcProcMemoList.scMemoType" style="width: 20%;" >
        <el-option v-for="item in scOptions" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode"/>
      </el-select>
      <el-input style="width: 30%;" v-model="scModifierInfo" disabled />
      <fr-button type="U" size="small" @click="onHandleSaveMemo('SC')" class="fr">저장</fr-button>
      <el-form-item label=" ">
        <el-input type="textarea" v-model="calcProcMemoList.scMemo" style="width: 100%;"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <div style="margin-top:30px;">
    <h4>수불정산 특이사항</h4>
    <el-form label-width="120px">
      <el-select v-model="calcProcMemoList.pcMemoType" style="width: 20%;" >
        <el-option v-for="item in pcOptions" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode"/>
      </el-select>
      <el-input style="width: 30%;" v-model="pcModifierInfo" disabled />
      <fr-button type="U" size="small" @click="onHandleSaveMemo('PC')" class="fr">저장</fr-button>
      <el-form-item label=" ">
        <el-input type="textarea" v-model="calcProcMemoList.pcMemo" style="width: 100%;"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer" style="margin-top:300px;">
    <fr-button type="D" size="small" @click="dialogVisible = false">닫기</fr-button>
  </span>
</el-dialog>
</template>

<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';

export default {
  name: 'bookingInfoPopup',
  mixins: [commonCodeServiceMixin],
  data() {
    return {
      dialogVisible: false,
      memoInfoData: [],
      managerConfirmList: [],
      bookingCode: '',
      isErrorTable: false,
      calcType: null,
      bookingId: null,
      calcProcMemoList: {
        memoId: '',
        scMemo: '',
        scMemoType: '',
        scRegistorId: '',
        scRegistDt: '',
        scModifierId: '',
        scModifiedDt: '',
        pcMemo: '',
        pcMemoType: '',
        pcRegistorId: '',
        pcRegistDt: '',
        pcModifierId: '',
        pcModifiedDt: ''
      },
      scOptions: [],
      pcOptions: [],
      scModifierInfo: '',
      pcModifierInfo: ''
    };
  },
  created() {
    this.initializeComponent();
  },
  mounted() {
  },
  methods: {
    initializeComponent() {
      this.memoInfoData = [];
      this.managerConfirmList = [];
      this.bookingCode = '';
      this.bookingCodeText = '';
      this.isErrorTable = false;
      this.calcProcMemoList = [];
      this.getDetailCodeList('9360').then((payload) => {
        this.scOptions = payload.data;
      });
      this.getDetailCodeList('9370').then((payload) => {
        this.pcOptions = payload.data;
      });
      this.scModifierInfo = '';
      this.pcModifierInfo = '';
    },
    handleVisible(row, isTavi) { // 팝업시 기본 로딩
      let bookingCode = '';
      let bookingId = '';
      let calcType = '';

      if (isTavi === 'isTavi') {
        if (this.isEmpty(row.channelRefNo)) return;
        bookingCode = row.channelRefNo;
        bookingId = row.bookingNo;
        calcType = 'T';
      } else if (isTavi === 'T') { // 예약잠금 관리 파라곤변수사용
        if (this.isEmpty(row.bookingCode)) return;
        bookingCode = row.bookingCode;
        bookingId = row.bookingId;
        calcType = 'T';
      } else {
        if (this.isEmpty(row.bookingCode)) return;
        bookingCode = row.bookingCode;
        bookingId = row.bookingId;
        calcType = 'P';
      }
      this.bookingId = bookingId;
      this.calcType = calcType;
      const confirmUrl = `/api/common/managerConfirmList/${bookingCode}`;
      this.httpGet(confirmUrl).then(res => { //  담당자 확인요청 이력
        if (!this.isEmpty(res.data)) {
          this.managerConfirmList = res.data;
        }
      });
      const procMemoUrl = `/api/common/calcProcMemo/${bookingCode}`;
      this.httpGet(procMemoUrl ).then(res => {
        if (!this.isEmpty(res.data)) {
          this.calcProcMemoList = res.data[0];
        }
      });
      const onpUrl = `/api/common/onpList/${bookingCode}`;
      this.httpGet(onpUrl).then(res => {
        if (!this.isEmpty(res.data)) {
          this.memoInfoData = res.data;
        }
        this.bookingCode = bookingCode;
        this.bookingCodeText = `( 파라곤 예약번호 : ${bookingCode} )`;
        this.dialogVisible = true;
        this.handleDisplayInfo();
      });
    },
    onHandleSaveMemo(type) { // 특이사항 메모 저장시
      if (!this.validationNullCheck(type)) {
        return;
      }
      let calcProcMemoList = {};
      if (type === 'SC') {
        Object.assign(calcProcMemoList, {
          memoId: this.calcProcMemoList.memoId,
          calcType: this.calcType,
          bookingId: this.bookingId,
          scMemo: this.calcProcMemoList.scMemo,
          scMemoType: this.calcProcMemoList.scMemoType
        });
      } else if (type === 'PC') {
        Object.assign(calcProcMemoList, {
          memoId: this.calcProcMemoList.memoId,
          calcType: this.calcType,
          bookingId: this.bookingId,
          pcMemo: this.calcProcMemoList.pcMemo,
          pcMemoType: this.calcProcMemoList.pcMemoType
        });
      }
      this.httpPost(`/api/common/calcProcMemo`, calcProcMemoList).then(() => {
        messageBox.show('', '저장 되었습니다.').then(this.onHandleReloadMemo(type));
      });
    },
    validationNullCheck(type) { //  특이사항 카테고리 선택
      if (type === 'SC') {
        if (this.isEmpty(this.calcProcMemoList.scMemoType)) {
          messageBox.show('', '매출정산 메모 분류를 선택해주세요.');
          return false;
        }
      } else if (type === 'PC') {
        if (this.isEmpty(this.calcProcMemoList.pcMemoType)) {
          messageBox.show('', '수불정산 메모 분류를 선택해주세요.');
          return false;
        }
      }
      return true;
    },
    onHandleReloadMemo(type) { // 저장후 팝업 리로드
      const procMemoUrl = `/api/common/calcProcMemo/${this.bookingCode}`;
      this.httpGet(procMemoUrl).then(res => {
        if (!this.isEmpty(res.data)) {
          this.handleDisplayInfo(res.data[0], type);
        }
      });
    },
    handleDisplayInfo(res, type) { // 화면 표시되는 최종수정자 및 저장 용 메모ID 세팅
      const data = this.isEmpty(res) ? this.calcProcMemoList : res;
      if (type === 'SC') {
        this.scModifierInfo = this.isEmpty(data.scModifierId) ? '' : `최종수정자 : ${data.scModifierId} (${this.$dNull(data.scModifiedDt)})`;
      } else if (type === 'PC') {
        this.pcModifierInfo = this.isEmpty(data.pcModifierId) ? '' : `최종수정자 : ${data.pcModifierId} (${this.$dNull(data.pcModifiedDt)})`;
      } else {
        this.scModifierInfo = this.isEmpty(data.scModifierId) ? '' : `최종수정자 : ${data.scModifierId} (${this.$dNull(data.scModifiedDt)})`;
        this.pcModifierInfo = this.isEmpty(data.pcModifierId) ? '' : `최종수정자 : ${data.pcModifierId} (${this.$dNull(data.pcModifiedDt)})`;
      }
      if (!this.isEmpty(data.memoId)) {
        this.calcProcMemoList.memoId = data.memoId;
      }
    }
  }
};
</script>
