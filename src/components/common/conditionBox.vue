<template>
  <fieldset class="fieldset-box">
    <legend>조회조건</legend>
    <div v-if="conditions.isCoustom === true">
      <div v-for="(row, index) in conditions.rows" class="row m-v-10" :key="index">
        <component v-for="(field, fieldIndex) in row.fields" :key="fieldIndex" :isTavi="isTavi" :is="field.name ? field.name : field" :field="typeof field === 'string' ? {} : field" :value="formData" @change="onHandleDataChange" />
        <retrieve-button v-if="index === 0" @retrieve="onHandleRetrieve">
        </retrieve-button>
      </div>
    </div>
    <div v-if="conditions.isCoustom === false && conditions.type === 'fixed' && expandState > 0" class="row m-v-10" >
      <select-date-range :value="formData" @change="onHandleDataChange" />
      <spr-id :value="formData" @change="onHandleDataChange" />
    </div>
  </fieldset>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import dateRange from './condition/dateRange';
import selectDateRange from './condition/selectDateRange';
import sprId from './condition/sprId';
export default {
  name: 'conditionBox',
  components: {
    dateRange,
    selectDateRange,
    sprId
  },
  mixins: [commonCodeServiceMixin],
  props: {
    conditions: {
      default: null,
      required: true,
      type: Object
    },
    isTavi: {
      default: false,
      required: false,
      type: Boolean
    },
    srchCondition: {
      required: false,
      default: null
    },
    rootPage: {
      required: false,
      default: false
    }
  },
  data() {
    return {
      expandState: 1,
      formData: {
        date: null,
        dateRangeType: null,
        dateRange: null,
        dateType: null,
        sprId: null
      },
      pageName: null
    };
  },
  computed: {
    classObject: function() {
      return {
        'el-icon-caret-bottom hovering': this.expandState === 1,
        'el-icon-caret-top hovering': this.expandState !== 1
      };
    }
  },
  created() {
    this.pageName = this.getPageName();
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit('loaded', { data: this.formData });
    });
  },
  methods: {
    onHandleRetrieve() {
      this.$emit('retrieve', { data: this.formData });
    },
    onHandleDataChange(e) {
      this.$emit('change', e);
    },
    onHandleExpandToggle() {
      if (this.expandState === 1) {
        this.expandState = this.conditions.level;
      } else if (this.expandState === this.conditions.level) {
        this.expandState = 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.demo-block {
  margin-top: 8px;
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
}

.demo-block.hover {
  box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);
}

.demo-block .demo-block-control {
  border-top: 1px solid #eaeefb;
  height: 22px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  text-align: center;
  margin-top: -1px;
  color: #d3dce6;
  cursor: pointer;
  position: relative;
}

.demo-block .demo-block-control i {
  font-size: 16px;
  line-height: 22px;
  transition: 0.3s;
}

.demo-block .demo-block-control > span {
  display: none;
}

.demo-block .demo-block-control i.hovering {
  transform: translateX(-40px);
}

.demo-block .demo-block-control:hover > span {
  position: absolute;
  transform: translateX(-30px);
  font-size: 14px;
  transition: 0.3s;
  display: inline-block;
}

.demo-block .demo-block-control:hover {
  color: #409eff;
  background-color: #f9fafc;
}
</style>
