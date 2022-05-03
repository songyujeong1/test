<template>
<div aria-haspopup="listbox" role="combobox" class="el-autocomplete" >
  <div class="el-input el-input--suffix el-input--small" ref="inputRef">
    <input type="text" v-model="inputValue" @focus="onInputFoucs" @blur="onInputBlur" autocomplete="off" :placeholder="placeholder" @keydown="onInputKeyDown" @input="onInputChange" class="el-input__inner" />
    <span class="el-input__suffix">
      <span class="el-input__suffix-inner">
        <i class="el-input__icon el-icon-circle-close el-input__clear" @click="onHandleClear"></i>
      </span>
    </span>
  </div>

  <div role="region" :class="regionClass" :style="regionStyle" x-placement="bottom-start">
    <div class="el-scrollbar">
      <div class="el-autocomplete-suggestion__wrap el-scrollbar__wrap">
        <ul class="el-scrollbar__view el-autocomplete-suggestion__list" role="listbox" style="max-height:210px;" @mousemove="onHandleMouseMove">
          <li v-if="isLoading === true && isEmpty(suggestionResults)"><i class="el-icon-loading"></i></li>
          <auto-complete-item v-for="(child, index) in suggestionResults" :key="index" :dataContext="child" :displayMemberPath="displayMemberPath" class="el-select-dropdown__item" :class="{'hover' : child.isHover === true}" @click="onSuggestionResultClick" />
        </ul>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { debounce } from 'lodash';
import autoCompleteItem from './fr-autoCompleteItem';

export default {
  components: {
    autoCompleteItem
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    displayMemberPath: {
      default: null,
      required: false
    },
    fetchSuggestions: {
      default: null,
      required: false
    },
    debounce: {
      default: null,
      required: false,
      type: Number
    },
    triggerOnFocus: {
      default: null,
      required: false,
      type: Boolean
    },
    hideLoading: {
      default: null,
      required: false,
      type: Boolean
    },
    placeholder: {
      default: null,
      required: false,
      type: String
    },
    selectedItem: {
      default: null,
      required: false,
      type: Object
    },
    valueMemberPath: {
      default: null,
      required: false,
      type: String
    },
    value: {
      default: null,
      required: false,
      type: String
    }
  },
  data() {
    return {
      inputValue: '',
      isInput: false,
      isLoading: false,
      regionStyle: {
        transformOrigin: 'center top',
        zIndex: 2018,
        width: '100%',
        position: 'absolute',
        display: 'none'
      },
      suggestionResults: null
    };
  },
  computed: {
    regionClass: function () {
      return {
        'el-autocomplete-suggestion': true,
        'el-popper': true,
        'is-loading': this.isLoading === true && this.isEmpty(this.suggestionResults) === true
      };
    }
  },
  mounted() {
    if ( this.selectedItem && this.selectedItem.hasOwnProperty(this.displayMemberPath) ) {
      const tmp = this.selectedItem[this.displayMemberPath];
      if ( tmp ) {
        this.inputValue = tmp;
      }
    }
  },
  methods: {
    onDropDownClose() {
      this.isLoading = false;
      this.suggestionResults = null;
      this.regionStyle = Object.assign(this.regionStyle, {display: 'none'});
    },
    onDropDownOpen() {
      this.isLoading = true;
      this.regionStyle = Object.assign(this.regionStyle, {display: 'block'});
    },
    onInputFoucs() {
      // this.onDropDownOpen();
    },
    onInputBlur(e) {
      if ( this.$refs.inputRef.contains(e.currentTarget)) {
        return;
      }
      this.onDropDownClose();
    },
    onHandleClear() {
      this.inputValue = '';
      this.$emit('input', '');
      this.$emit('select', null);
      this.onDropDownClose();
    },
    onInputChange(e) {
      this.$emit('input', e.target.value);
      this.onDebounceInput(e.target.value);
      if ( this.isEmpty(e.target.value) ) {
        this.onDropDownClose();
      }
    },
    onInputKeyDown(e) {
      this.onDropDownOpen();

      if (this.isEmpty(e.target.value)) {
        this.onDropDownClose();
        return;
      }

      if ( this.isLoading === true && e && (e.keyCode === 40 || e.keyCode === 38)) {
        if (!this.isEmpty(this.suggestionResults)) {
          const focusIndex = this.suggestionResults.findIndex((x) => x.isHover === true);
          let nextIndex = focusIndex + (e.keyCode === 40 ? 1 : -1);

          if ( nextIndex < 0 ) {
            nextIndex = this.suggestionResults.length - 1;
          } else if ( nextIndex >= this.suggestionResults.length) {
            nextIndex = 0;
          }

          this.suggestionResults.forEach((item, index) => {
            if ( index === nextIndex) {
              item.isHover = true;
            } else {
              item.isHover = false;
            }
          });
        }
      } else if ( this.isLoading === true && e && e.keyCode === 13 && this.suggestionResults ) {
        const item = this.suggestionResults.findBy((x) => x.isHover, true);

        if ( item ) {
          this.fireSelected(item);
          this.onDropDownClose();
        }
      }
    },
    onDebounceInput: debounce(function (text) {
      if ( this.fetchSuggestions) {
        this.fetchSuggestions(text, this.fetchSuggestionsCallBack);
      }
    }, 500),
    onSuggestionResultClick(e, item) {
      this.fireSelected(item);
      this.onDropDownClose();
    },
    fetchSuggestionsCallBack(result) {
      if (!this.isEmpty(result)) {
        this.suggestionResults = result.map((item) => {
          return Object.assign(item, {isHover: false});
        });
      } else {
        this.onDropDownClose();
      }
    },
    fireSelected(item) {
      if ( item ) {
        this.inputValue = item[this.displayMemberPath];
        this.$emit('select', item);
        this.isLoading = false;
      }
    },
    onHandleMouseMove() {
      if (this.suggestionResults) {
        const isExist = this.suggestionResults.findBy((x) => x.isHover, true);
        if ( isExist ) {
          this.suggestionResults = this.suggestionResults.map((item) => {
            return Object.assign(item, {isHover: false});
          });
        }
      }
    }
  }
};
</script>
