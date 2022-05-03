<template>
  <transition name="modal">
    <div>
      <div v-if="isShowModal" class="v-modal" tabindex="0" style="z-index: 3009;"></div>
      <div v-if="isShowModal" tabindex="-1" role="dialog" aria-modal="true" aria-label="Confirm"  class="el-message-box__wrapper" style="z-index:3010;">
        <div class="el-message-box">
          <div class="el-message-box__header">
            <div class="el-message-box__title">
              <span>{{title}}</span>
            </div>
            <button type="button" aria-label="Close" class="el-message-box__headerbtn" @click="onCancel">
              <i class="el-message-box__close el-icon-close"></i>
            </button>
          </div>
          <div class="el-message-box__content">
            <div v-if="icon === 'success'" class="el-message-box__status el-icon-success"></div>
            <div v-if="icon === 'error'" class="el-message-box__status el-icon-error"></div>
            <div v-if="icon === 'info'" class="el-message-box__status el-icon-info"></div>
            <div v-if="icon === 'warning'" class="el-message-box__status el-icon-warning"></div>
            <div class="el-message-box__message">
              <div v-html="message"></div>
            </div>
          </div>
          <div class="el-message-box__btns">
            <button ref="btnCancel" type="button" v-if="isCancel === true" class="messagebox-button" @click="onCancel">Cancel</button>
            <button ref="btnOk" type="button" class="messagebox-button primary" v-if="isOk === true"  @click="onOk">Ok</button>
            <button ref="btnNo" type="button" v-if="isNo === true" class="messagebox-button" @click="onNo">No</button>
            <button ref="btnYes" type="button" class="messagebox-button primary" v-if="isYes === true" @click="onYes">Yes</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    onCancel: function() {
      this.isShowModal = false;
      this.promiseResolver('cancel');
    },
    onOk: function() {
      this.isShowModal = false;
      this.promiseResolver('ok');
    },
    onYes: function() {
      this.isShowModal = false;
      this.promiseResolver('yes');
    },
    onNo: function() {
      if (this.isEmpty(this.buttons)) {
      }

      this.isShowModal = false;
      this.promiseResolver('no');
    }
  },
  computed: {
    isYes: function() {
      if (this.isEmpty(this.buttons)) {
        return false;
      }
      return this.buttons === 'YesNoCancel' || this.buttons === 'YesNo';
    },
    isNo: function() {
      if (this.isEmpty(this.buttons)) {
        return false;
      }
      return this.buttons === 'YesNoCancel' || this.buttons === 'YesNo';
    },
    isCancel: function() {
      if (this.isEmpty(this.buttons)) {
        return false;
      }
      return this.buttons === 'YesNoCancel' || this.buttons === 'OKCancel';
    },
    isOk: function() {
      if (this.isEmpty(this.buttons)) {
        return true;
      }
      return this.buttons === 'Ok' || this.buttons === 'OKCancel';
    }
  },
  data() {
    return {
      isShowModal: false,
      title: '',
      message: '',
      buttons: null,
      icon: null
    };
  },
  watch: {
    isShowModal: function(newValue) {
      if (newValue) {
        this.$nextTick(function() {
          if (this.buttons === 'YesNoCancel') {
            this.$refs.btnYes.focus();
          } else if (this.buttons === 'YesNo') {
            this.$refs.btnYes.focus();
          } else {
            this.$refs.btnOk.focus();
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.messagebox-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  width: 60px;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
  &:focus {
    border: 1px solid #606266;
  }
}
.primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  &:focus {
    border: 1px solid #197adb;
  }
}
</style>
