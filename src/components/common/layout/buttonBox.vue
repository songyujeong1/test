<template>
  <div class="row m-v-10 m-h-10 over-h">
    <div class="col-md-4">
      <!-- 검색 조건 JSON 확인용: {{data}} -->
    </div>
    <div class="col-md-8 text-right">
    </div>
  </div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';

export default {
  name: 'compButtons',
  mixins: [commonCodeServiceMixin],
  props: {
    srchCondition: {
      required: false,
      default: null
    },
    domRef: {
      type: Object,
      default: null
    },
    callbackFunc: {
      type: Function
    },
    data: {
      type: Array,
      default: null
    },
    uploadConditions: {
      required: false,
      default: null
    },
    uploadFormData: {
      required: false,
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
    console.log(':::: created -> this.pageName', this.pageName);
  },
  methods: {
    downloadData(downCode) {
      const _condition = this.srchCondition;
      this.httpDownload(
        `/api/common/action/excelDonwload/${this.pageName}/${downCode}`,
        _condition
      );
    },
    // onHandleParagonCtsMappingPopup() {
    //   this.$emit('ctsMappingPopup');
    // },
    onHandleTaviCtsMappingPopup() {
      //  타비 CTS 매핑 팝업
      this.$emit('ctsMappingPopup');
    }
  }
};
</script>
