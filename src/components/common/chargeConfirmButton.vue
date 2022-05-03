<template>
  <fr-button type="U" size="small" @click="onHandleClick" :disabled="buttonDisable">
    담당자 확인 요청
    <el-dialog slot="dialogSlot" title="예약담당자 선택 확인 요청" width="30%" :append-to-body="true" :destroy-on-close="true" :visible.sync="isDialogPopUp" :before-close="onHandleClose" :close-on-click-modal="false">
      <div class="charge-confirm-info">
        <table>
          <colgroup>
            <col style="width:20%;" />
            <col style="width:30%;" />
            <col style="width:20%;" />
            <col style="width:30%;" />
          </colgroup>
          <tbody>
            <tr>
              <td>예약번호</td>
              <th>{{displayBookingInfo}}</th>
              <td>예약담당</td>
              <th>{{bookingInfoBookingManagerNm}}&nbsp;
                <fr-button slot="reference" size="mini" @click="managerSearchClick" v-if="this.calcType === 'P'"/>
                <el-popover class="fr" width="300" trigger="manual" ref="popOver">
                  <manager-search-form @change="handleManagerChange"/>
                </el-popover>
              </th>
            </tr>
            <tr>
              <td>전송일자</td>
              <th>{{this.$d(this.getCurrentDate())}}</th>
              <td>정산담당</td>
              <th>{{$store.getters.userInfo.userName}}</th>
            </tr>
            <tr>
              <td colspan="4">
                <el-input type="textarea" placeholder="비고" rows="3" v-model="bookingInfoMemo" maxlength="2000" ></el-input>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <fr-button type="C" @click="onHandleConfirm">확인</fr-button>
        <fr-button type="D" @click="onHandleClose">취소</fr-button>
      </span>
    </el-dialog>
  </fr-button>
</template>
<script>
import { menuServiceMixin } from '@/mixins/menuServiceMixin';
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';

export default {
  name: 'charge-confirm-button',
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
      /* bookingInfoData: {
        type: Array,
        default: null
      }, */
      bookingInfoId: '',
      bookingInfoBookingManagerNm: '',
      bookingInfoMemo: '',
      displayBookingInfo: '',
      isDialogPopUp: false,
      selectedRows: null,
      pageName: null,
      calcType: 'P',
      buttonDisable: false,
      bookingManagerId: null
    };
  },
  created() {
    this.pageName = this.getPageName();
    this.calcType = this.getCalcType(this.pageName);
  },
  mounted() {},
  watch: {
    calcProcState(code) {
      const pageName = this.pageName;
      if (!this.isEmpty(code)) {
        switch (pageName) {
          case 'psalescalc':
          case 'csalescalc':
          case 'pcancelfeecheck':
          case 'tcancelfeecheck':
            if (code === '93000001') {
              this.buttonDisable = false;
            } else {
              this.buttonDisable = true;
            }
            break;
          case 'prnpxml':
          case 'prnptavi':
          case 'pexpcom':
          case 'tavirnpinvoice':
          case 'tavirnpvcc':
          case 'tavirnpcts':
            if (code === '93000002') {
              this.buttonDisable = false;
            } else {
              this.buttonDisable = true;
            }
            break;
          default:
            break;
        }
      }
    }
  },
  methods: {
    onHandleConfirm() {
      if (this.calcType === 'P' && this.isEmpty(this.bookingManagerId) && this.isEmpty(this.bookingInfoBookingManagerNm)) {
        messageBox.show('', '선택된 담당자가 없습니다.');
        return;
      }
      messageBox
        .show('', '담당자 확인 요청을 하시겠습니까?', 'YesNo')
        .then(dialog => {
          if (dialog === 'yes') {
            this.reqManagerConfirm(
              [Number(this.bookingInfoId)],
              this.calcType,
              this.bookingInfoMemo,
              this.bookingManagerId || null
            );
            this.onHandleClose();
          }
        });
    },
    onHandleCancel() {
      this.onHandleClick();
    },
    onHandleClose(e) {
      this.isDialogPopUp = !this.isDialogPopUp;
      this.bookingInfoId = '';
      this.bookingInfoBookingManagerNm = '';
      this.bookingInfoMemo = '';
      this.displayBookingInfo = '';
      this.$refs.popOver = null;
      this.bookingManagerId = null;
      console.log(e);
    },
    onHandleClick() {
      if (this.isEmpty(this.data)) {
        messageBox.show('', '조회된 데이터가 없습니다.');
        return;
      }

      if (this.data) { // 데이터 세팅
        this.checkedRow = this.data.filterBy(x => x.isChecked, true);
        if (this.isEmpty(this.checkedRow)) {
          messageBox.show('', '선택된 항목이 없습니다.');
          return;
        }

        if (this.calcType === 'P') { // procState=> null 미조치, 93200001 확인요청, 93200002 요청접수, 93200003 재정산요청 // 이름으로 체크해도 무방/서버에서 처리시 담당자 ID 체크
          this.selectedRows = this.data.filterBy(x => x.isChecked && !this.isEmpty(x.bookingId) && (x.procState !== '93200001' && x.procState !== '93200002' && x.procState !== '93200003'), true);
        } else {
          this.selectedRows = this.data.filterBy(x => x.isChecked && !this.isEmpty(x.bookingNo) && (x.procState !== '93200001' && x.procState !== '93200002' && x.procState !== '93200003') && !this.isEmpty(x.bookingManagerNm), true);
        }
      }

      if (this.isEmpty(this.selectedRows)) {
        messageBox.show('', '기확인요청 데이터, 예약번호 또는 담당자가 존재 하지 않는 데이터는 처리되지 않습니다.');
      } else {
        if (this.selectedRows.length === 1) {
          // 팝업
          this.openPopup();
        } else {
          // 담당자 없는 예약건이 여러건 선택되었을 경우 필터
          this.selectedRows = this.selectedRows.filterBy(x => !this.isEmpty(x.bookingManagerNm), true);
          if (this.isEmpty(this.selectedRows)) {
            messageBox.show('', '기확인요청 데이터, 예약번호 또는 담당자가 존재 하지 않는 데이터는 처리되지 않습니다.');
          } else if (this.selectedRows.length === 1) {
            this.openPopup();
          } else {
            // 다이렉트
            const bookingIdList = this.selectedRows.map(item => {
              return this.calcType === 'P' ? item.bookingId : item.bookingNo;
            });
            messageBox
              .show('', '담당자 확인 요청을 하시겠습니까?<br/>(기확인요청 데이터, 예약번호 또는 담당자가 존재 하지 않는 데이터는 처리되지 않습니다.)', 'YesNo')
              .then(dialog => {
                if (dialog === 'yes') {
                  this.reqManagerConfirm(bookingIdList, this.calcType);
                }
              });
          }
        }
      }
    },
    handleManagerChange(user) { //  담당자 검색 후 선택
      this.$refs.popOver.showPopper = false;
      if (!this.isEmpty(user)) {
        this.bookingInfoBookingManagerNm = user.userName;
        this.bookingManagerId = user.userId;
      }
    },
    managerSearchClick() { // 돋보기 아이콘 클릭
      this.$refs.popOver.showPopper = !this.$refs.popOver.showPopper;
    },
    openPopup() { // 담당자확인요청 팝업
      if (this.calcType === 'P') {
        this.bookingInfoId = this.selectedRows[0].bookingId;
        this.displayBookingInfo = this.selectedRows[0].bookingCode;
      } else {
        this.bookingInfoId = this.selectedRows[0].bookingNo;
        this.displayBookingInfo = this.selectedRows[0].bookingNo;
      }

      this.bookingInfoBookingManagerNm = this.selectedRows[0].bookingManagerNm;
      this.isDialogPopUp = !this.isDialogPopUp;
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
