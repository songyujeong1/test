<template>
  <fr-button type="D" size="small" @click="onHandleClick">업로드삭제</fr-button>
</template>
<script>
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { uniq, has, filter } from 'lodash';

export default {
  name: 'upload-delete-button',
  mixins: [actionServiceMixin],
  props: {
    domRef: {
      type: Object,
      default: null
    },
    data: {
      type: Array,
      default: null
    },
    isBundle: {
      type: Boolean,
      default: false
    },
    notiConfirm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedRows: null,
      pageName: null,
      targetColumn: '',
      targetColumn2: '',
      targetUrl: ''
    };
  },
  created() {
    this.pageName = this.getPageName();
  },
  methods: {
    onHandleClick() {
      if (
        this.isEmpty(this.data) &&
        (this.isEmpty(this.domRef) || this.isEmpty(this.domRef.data))
      ) {
        messageBox.show('', '조회된 데이터가 없습니다.');
        return;
      }

      this.getDeleteObjectByPage();
      const targetColumn = this.targetColumn;
      const targetColumn2 = this.targetColumn2;

      let filterRow = [];
      if (this.isBundle === false) {
        if (this.data) {
          this.selectedRows = this.data.filterBy(x => x.isChecked, true);
        } else {
          this.selectedRows = this.domRef.selection;
        }

        if (this.isEmpty(this.selectedRows)) {
          messageBox.show('', '선택된 항목이 없습니다.');
          return;
        }

        if (this.isEmpty(targetColumn2)) {
          filterRow = filter(this.selectedRows, function(o) { return has(o, targetColumn); });
        } else {
          filterRow = filter(this.selectedRows, function(o) { return (has(o, targetColumn) && has(o, targetColumn2)); });
        }
      } else {
        if (this.data) {
          if (this.isEmpty(targetColumn2)) {
            filterRow = filter(this.data, function(o) { return has(o, targetColumn); });
          } else {
            filterRow = filter(this.data, function(o) { return (has(o, targetColumn) && has(o, targetColumn2)); });
          }
        } else {
          if (this.isEmpty(targetColumn2)) {
            filterRow = filter(this.domRef.data, function(o) { return has(o, targetColumn); });
          } else {
            filterRow = filter(this.domRef.data, function(o) { return (has(o, targetColumn) && has(o, targetColumn2)); });
          }
        }
      }

      if (this.isEmpty(filterRow)) {
        messageBox.show('', '처리할 데이터가 없습니다.');
        return;
      }

      let uploadInfoList = [];
      filterRow.map(item => {
        if (this.isEmpty(targetColumn2)) {
          if (has(item, targetColumn) && !this.isEmpty(item[targetColumn])) {
            uploadInfoList.push({[targetColumn]: item[targetColumn]});
          }
        } else {
          if (has(item, targetColumn) && !this.isEmpty(item[targetColumn]) && has(item, targetColumn2) && !this.isEmpty(item[targetColumn2])) {
            uploadInfoList.push({
              [targetColumn]: item[targetColumn],
              [targetColumn2]: item[targetColumn2]
            });
          }
        }
      });

      if (this.isEmpty(uploadInfoList)) {
        messageBox.show('', '처리할 데이터가 없습니다.');
        return;
      }
      const confirmMsg = '<span style="color:red">업로드 데이터를 삭제 하시겠습니까?</span>';
      messageBox.show('', confirmMsg, 'YesNo').then(dialog => {
        if (dialog === 'yes') {
          this.uploadDelete(this.targetUrl, uniq(uploadInfoList));
        }
      });
    },
    getDeleteObjectByPage() {
      switch (this.pageName) {
        case 'csalescalc':
          this.targetColumn = '';
          this.targetColumn2 = '';
          this.targetUrl = '';
          break;
        default:
          break;
      }
    }
  }
};
</script>
