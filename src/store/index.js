import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

const CryptoJS = require('crypto-js');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tokenType: null,
    accessToken: null,
    refreshToken: null,
    userinfo: null,
    systemCode: null,
    userMenus: null,
    treeMenu: null,
    culture: null,
    commonCode: {
      bookingState: [],
      calcProcState: [],
      errorUpperState: [],
      errorDetailState: [],
      salesType: [],
      procState: [],
      invoiceType: [],
      sprType: [],
      taviInvoiceType: [],
      tradeType: [],
      tiiSalesType: [],
      calcDetailState: [],
      supplierType: [],
      mappingType: [],
      paymentType: [],
      payState: [],
      commissionErrorState: [],
      historyType: [],
      paymentState: [],
      saveState: []
    }
  },
  getters: {
    isAuthenticated(state) {
      state.accessToken = state.accessToken || sessionStorage.getItem('accessToken');
      state.tokenType = state.tokenType || sessionStorage.getItem('tokenType');
      const hasUnauthorization = axios.defaults.headers.common['Authorization'] === undefined || axios.defaults.headers.common['Authorization'] === null;

      if ( state.accessToken && hasUnauthorization ) {
        axios.defaults.headers.common['Authorization'] = `${state.tokenType} ${state.accessToken}`;
      }

      return state.accessToken;
    },
    getAccessToken(state) {
      return state.accessToken || sessionStorage.getItem('accessToken');
    },
    userInfo(state) {
      try {
        state.userinfo = state.userinfo || JSON.parse(sessionStorage.getItem('userInfo'));
      } catch (e) {
        sessionStorage.clear();
      }
      return state.userinfo;
    },
    userMenus(state) {
      if ( state.userMenus ) {
        return state.userMenus;
      }

      const storagemenus = sessionStorage.getItem('userMenus');

      if ( storagemenus) {
        return JSON.parse(storagemenus);
      }
    },
    treeMenu(state) {
      if ( state.treeMenu ) {
        return state.treeMenu;
      }

      const treeMenu = sessionStorage.getItem('treeMenu');

      if ( treeMenu) {
        return JSON.parse(treeMenu);
      }
    },
    culture(state) {
      state.culture = state.culture || localStorage.getItem('culture');
      return state.culture;
    },
    cultureTwoLetter(state) {
      state.culture = state.culture || localStorage.getItem('culture');
      return state.culture === null ? 'en' : state.culture.substring(0, 2);
    },
    systemCode(state) {
      return state.systemCode || sessionStorage.getItem('systemCode');
    },
    commonCode(state) {
      return state.commonCode;
    }
  },
  mutations: {
    LOGIN(state, {accessToken, tokenType, refreshToken, userInfo, systemCode}) {
      state.tokenType = tokenType;
      state.accessToken = accessToken;
      state.userinfo = userInfo;
      state.systemCode = systemCode;
      state.refreshToken = refreshToken;
      sessionStorage.setItem('tokenType', tokenType);
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      sessionStorage.setItem('systemCode', systemCode);
    },
    LOGOUT(state) {
      state.accessToken = null;
      sessionStorage.clear();
    },
    MENUS(state, {menus, treeMenu}) {
      state.userMenus = menus;
      state.treeMenu = treeMenu;
      sessionStorage.setItem('userMenus', JSON.stringify(menus));
      sessionStorage.setItem('treeMenu', JSON.stringify(treeMenu));
    },
    SETCODE(state, {bookingState, calcProcState, errorUpperState, errorDetailState, salesType, procState, invoiceType, sprType, taviInvoiceType, tradeType, tiiSalesType, calcDetailState, supplierType, mappingType, paymentType, payState, commissionErrorState, historyType, paymentState, saveState}) {
      state.commonCode = {
        bookingState,
        calcProcState,
        errorUpperState,
        errorDetailState,
        salesType,
        procState,
        invoiceType,
        sprType,
        taviInvoiceType,
        tradeType,
        tiiSalesType,
        calcDetailState,
        supplierType,
        mappingType,
        paymentType,
        payState,
        commissionErrorState,
        historyType,
        paymentState,
        saveState
      };
    }
  },
  actions: {
    LOGIN({
      commit
    }, {
      email,
      password,
      isRemember,
      systemCode,
      deptCode,
      deptName
    }) {
      deptCode = '';
      deptName = '';
      let encrypted1 = CryptoJS.AES.encrypt( email, process.env.ENCKEY);
      let encrypted2 = CryptoJS.AES.encrypt( password, process.env.ENCKEY);
      let encrypted3 = CryptoJS.AES.encrypt( systemCode, process.env.ENCKEY);
      let sendData = {
        usernameOrEmail: encrypted1.toString(),
        password: encrypted2.toString(),
        systemCode: encrypted3.toString()
      };

      let singinUrl = '/api/common/auth/signin';
      let profileUrl = '/api/common/user/profile';
      if (window.location.hostname === 'localhost') {
        singinUrl = `${process.env.CLARE_API_URL}${singinUrl}`;
        profileUrl = `${process.env.CLARE_API_URL}${profileUrl}`;
      }

      return new Promise((resolve, reject) => {
        axios.post(singinUrl, sendData, {
          headers: sendData
        }).then(({
          data
        }) => {
          const token = data;
          const encryptEmail = data.userName;
          deptCode = data.deptCode;
          deptName = data.deptName;
          axios.defaults.headers.common['Authorization'] = `${token.tokenType} ${token.accessToken}`;
          axios.get(profileUrl, {
            headers: {
              'userid': encryptEmail
            }
          }).then(({
            data
          }) => {
            token.userInfo = data;
            token.userInfo.email = email;
            token.userInfo.deptCode = deptCode;
            token.userInfo.deptName = deptName;
            token.systemCode = systemCode;
            commit('LOGIN', token);

            if (isRemember) {
              localStorage.email = email;
            } else {
              delete localStorage.email;
            }
            resolve(data);
          }).catch(error => {
            reject(error);
          });
        }).catch(error => {
          reject(error);
        });
      });
    },
    LOGOUT({
      commit
    }) {
      axios.defaults.headers.common['Authorization'] = undefined;
      commit('LOGOUT');
    },
    MENUS({
      commit
    }, {
      menus, treeMenu
    }) {
      return new Promise((resolve) => {
        commit('MENUS', { menus, treeMenu });
        resolve();
      });
    },
    SETCODE({
      commit
    }, {
      bookingState, calcProcState, errorUpperState, errorDetailState, salesType, procState, invoiceType, sprType, taviInvoiceType, tradeType, tiiSalesType, calcDetailState, supplierType, mappingType, paymentType, payState, commissionErrorState, historyType, paymentState, saveState
    }) {
      commit('SETCODE', { bookingState, calcProcState, errorUpperState, errorDetailState, salesType, procState, invoiceType, sprType, taviInvoiceType, tradeType, tiiSalesType, calcDetailState, supplierType, mappingType, paymentType, payState, commissionErrorState, historyType, paymentState, saveState });
    }
  }
});
