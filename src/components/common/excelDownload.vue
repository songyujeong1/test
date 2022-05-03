<template>
  <fr-button :type="buttonType" :size="size" @click="onHandleClick">
    <i v-if="iconVisible" class="icon-file-excel button-icon"></i>
    <slot />
  </fr-button>
</template>
<script>
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { has, filter } from 'lodash';

export default {
  name: 'excel-download',
  mixins: [actionServiceMixin],
  props: {
    srchCondition: {
      required: false,
      default: null
    },
    iconVisible: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    buttonType: {
      type: String,
      default: 'E'
    },
    downCode: {
      required: true,
      type: String,
      default: ''
    },
    historyId: { // 대사용으로 업로드한 엑셀 다운로드 시 사용
      required: false,
      type: String,
      default: ''
    },
    isUploadHistory: { // 대사용으로 업로드한 엑셀 다운로드 시 사용
      required: false,
      type: Boolean,
      default: false
    },
    rootPage: {
      required: false,
      default: false
    },
    tableRef: { // 리스트에서 선택한 예약다운로드 시 사용(XML, INVOICE)
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageName: null
    };
  },
  created() {
    this.pageName = this.getPageName();
  },
  methods: {
    onHandleClick() {
      if (!this.isEmpty(this.tableRef)) {
        if (this.isEmpty(this.tableRef.data)) {
          messageBox.show('', '선택된 데이터가 없습니다.');
          return;
        }

        const selectedRows = this.tableRef.data.filterBy(x => x.isChecked, true);
        if (this.isEmpty(selectedRows)) {
          messageBox.show('', '선택된 데이터가 없습니다.');
          return;
        }

        const fileterRow = filter(selectedRows, function(o) { return has(o, 'bookingId') || has(o, 'bookingNo'); });
        if (this.isEmpty(fileterRow)) {
          messageBox.show('', '처리할 데이터가 없습니다.');
          return;
        }

        let bookingIdList = [];
        let bookingNoList = [];
        fileterRow.map(item => {
          if (has(item, 'bookingId') && !this.isEmpty(item.bookingId)) {
            bookingIdList.push(item.bookingId);
          } else if (has(item, 'bookingNo') && !this.isEmpty(item.bookingNo)) {
            bookingNoList.push(item.bookingNo);
          }
        });

        const _condition = {bookingIdList: bookingIdList, bookingNoList: bookingNoList};
        this.httpPostDownload(
          `/api/common/action/excelDonwload/${this.pageName}/${this.downCode}`,
          _condition
        );
      } else {
        if (this.isEmpty(this.pageName) && this.rootPage) {
          this.pageName = 'calc-stat';
        }
        // if (!this.isUploadHistory) {
        //   if ((this.pageName === 'calc-stat' && this.downCode === 'A') || (this.pageName === 'prnpxml' && this.downCode === 'A')) {
        //     messageBox.show('', '정의된 엑셀 다운로드가 아닙니다.');
        //     return;
        //   }

        //   const _condition = this.srchCondition;
        //   this.httpDownload(
        //     `/api/common/action/excelDonwload/${this.pageName}/${this.downCode}`,
        //     _condition
        //   );
        // } else { // 대사용으로 업로드한 엑셀 다운로드 시 => 대사정보 등록이력 조회 화면
        //   this.httpDownload(
        //     `/api/common/action/uploadHistoryDownload/${this.historyId}`
        //   );
        // }
      }
    }
  }
};
</script>
