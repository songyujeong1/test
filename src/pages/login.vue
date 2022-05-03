<template>
  <div class="login-align" style="height:100%;">
    <div class="page-container">
      <form id="m-loginForm" class="m-loginForm"  @submit.prevent="onSubmit(email, password, isRemember)">
        <div class="panel panel-body login-box">
          <Header :title="title" />
           <div class="text-center m-v-30">
            <img src="/static/images/tidesquarelogo.png" style="width:300px;" alt="Paragon.">
          </div>
          <div class="form-group has-feedback has-feedback-left mb-10">
            <input type="text" ref="Username" class="form-control" autocomple="off" v-model="email" placeholder="Username">
            <div class="form-control-feedback">
              <i class="icon-user text-muted"></i>
            </div>
          </div>
          <div class="form-group has-feedback has-feedback-left mb-10">
            <input type="password" ref="Password" class="form-control" autocomple="off" v-model="password" placeholder="Password">
            <div class="form-control-feedback">
              <i class="icon-lock2 text-muted"></i>
            </div>
          </div>
          <div class="form-group login-options mb-10">
            <label class="checkbox-inline">
              <input type="checkbox" class="styled" checked="checked" v-model="isRemember">
              Remember ID
            </label>
          </div>
          <div class="form-group">
            <submit-button  type="submit" >Login</submit-button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Header from './inputs/Header.vue';
import AnimatedInput from './inputs/AnimatedInput.vue';
import CustomCheckbox from './inputs/CustomCheckbox.vue';
import LinkButton from './buttons/LinkButton.vue';
import SubmitButton from './buttons/SubmitButton.vue';

export default {
  data() {
    return {
      email: null,
      password: null,
      msg: null,
      isRemember: false
    };
  },
  components: {
    Header,
    AnimatedInput,
    CustomCheckbox,
    LinkButton,
    SubmitButton
  },
    props: {
    title: String
  },
  created() {
    if (this.$store.getters.isAuthenticated) {
      this.$router.push('/');
    }

    this.isDevSystem = process.env.SYSTEM === '';

    if (!this.isEmpty(localStorage.email)) {
      this.isRemember = true;
      this.email = localStorage.email;
    }
  },
  mounted() {
    if (!this.isEmpty(this.email)) {
      this.$refs.Password.focus();
    } else {
      this.$refs.Username.focus();
    }
  },
  methods: {
    onSubmit(email, password, isRemember) {
      if (this.isEmpty(email) || this.isEmpty(password)) {
        alert('사용자 ID 또는 비밀번호가 비어 있습니다.');
        return;
      }

      const systemCode = 'S01';
      const message = '일치하는 사용자를 찾을 수 없습니다.';

      this.$store
        .dispatch('LOGIN', { email, password, isRemember, systemCode })
        .then((userInfo) => {
          this.httpGet(`/api/common/menu/${userInfo.userId}`).then(result => {
            const usermenus = result.data;
            let treeMenu = null;
            if ( usermenus && usermenus.length > 0) {
              treeMenu = usermenus.ToHierarchicalData(null, 'parentMenuNo', 'menuNo');
            }
            this.$store.dispatch('MENUS', { menus: usermenus, treeMenu }).then(() => {
              this.redirect();
            });
          }).catch((err) => {
            if ( err.request.status === 423) {
              messageBox.show('', '로그인 실패 횟수 초과로 계정이 사용 중지 되었습니다. 관리자에게 문의 하여 주시기 바랍니다.');
            } else {
              messageBox.show('', message);
            }
          });
        })
        .catch((err) => {
          if ( err.request.status === 423) {
            messageBox.show('', '로그인 실패 횟수 초과로 계정이 사용 중지 되었습니다. 관리자에게 문의 하여 주시기 바랍니다.');
          } else {
            messageBox.show('', message);
          }
        });
    },
    redirect() {
      const { search } = window.location;
      const tokens = search.replace(/^\?/, '').split('&');
      const { returnPath } = tokens.reduce((qs, tkn) => {
        const pair = tkn.split('=');
        qs[pair[0]] = decodeURIComponent(pair[1]);
        return qs;
      }, {});

      if (this.isEmpty(returnPath)) {
        this.$router.push('/home');
      } else {
        this.$router.push(returnPath);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/scss/components/forms/_loginForm.scss";

</style>
