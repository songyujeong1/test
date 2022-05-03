<template>
<el-dialog title="업로드 정보 확인" :visible.sync="dialogVisible" width="90%" min-height="200">
  <fr-table :data="uploadInfoData" :border="true" v-if="pageName === 'csalescalc'">
    <fr-table-column label="사이트명" prop="siteName" :width="150" align="center"/>
    <fr-table-column label="승인일시" prop="approvalDt" :width="90" align="center" type="date"/>
    <fr-table-column label="주문번호" prop="orderId" :width="120" align="center" />
    <fr-table-column label="주문자" prop="orderName" :width="150" align="center"/>
    <fr-table-column label="거래금액" prop="transferAmt" :width="90" align="center" type="currency"/>
    <fr-table-column label="일반수수료" prop="commonFeeAmt" :width="100" header-align="center" align="right" type="currency" />
    <fr-table-column label="부가세" prop="vat" :width="100" header-align="center" align="right" type="currency"/>
    <fr-table-column label="거래상태" prop="transferState" :width="90" align="center" />
    <fr-table-column label="거래번호" prop="transferNo" :width="130" align="center" />
    <fr-table-column label="마감일자" prop="closeDt" :width="90" align="center" type="date"/>
    <fr-table-column label="정산일자" prop="calcDt" :width="90" align="center" type="date"/>
    <fr-table-column label="서비스회사" prop="serviceCompany" :width="100" align="center" />
    <fr-table-column label="상품명" prop="productName" :width="500" header-align="center"/>
    <fr-table-column label="정산예정금액" prop="calcExpectedAmt" :width="100" header-align="center" align="right" type="currency" />
    <fr-table-column label="등록자" prop="registorId" :width="100" align="center" />
    <fr-table-column label="등록일" prop="registDt" :width="90" align="center" type="date"/>
  </fr-table>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">취소</el-button>
    <el-button type="primary" @click="dialogVisible = false">확인</el-button>
  </span>
</el-dialog>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';

export default {
  mixins: [commonCodeServiceMixin],
  name: 'uploadInfoPopup',
  data() {
    return {
      dialogVisible: false,
      pageName: '',
      uploadInfoData: []
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
    handleVisible(key) {
      this.pageName = this.getPageName();
      let callUrl = '';
      switch (this.pageName) {
        case 'csalescalc': //  유입채널별 매출정산 - 매출정산 데이터(유입채널))
          callUrl = `/api/common/kcpUploadInfo/${key}`; // orderId 보다 transferNo가 유니크한 정보이기 때문에 해당 데이터 사용
          break;
        default:
          break;
      }
      if (!this.isEmpty(callUrl)) {
        this.httpGet(callUrl).then(res => {
          if (!this.isEmpty(res)) {
            this.uploadInfoData = res.data[`${this.pageName}List`];
          }
          this.dialogVisible = true;
        });
      }
    }
  }
};
</script>
