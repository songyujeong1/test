import axios from 'axios';
import router from '@/router';
import { Loading } from 'element-ui';
import { split, includes } from 'lodash';
import { push, pop } from './dimmStack';

const CryptoJS = require('crypto-js');

const prototypeExtend = {
  install(Vue) {
    Vue.mixin({
      methods: {
        $can: function(permission) {
          const menuInfo = this.getCurrentMenu();
          if (this.isEmpty(menuInfo)) {
            return false;
          }

          if ((permission === 'C' || permission === 'U' || permission === 'D') && menuInfo.writeYn === 'Y') {
            return true;
          } else if (permission === 'R' && (menuInfo.readYn === 'Y' || menuInfo.writeYn === 'Y')) {
            return true;
          }

          return false;
        },
        $c: function(value, unit) {
          let culture = unit;
          switch (unit) {
            case 'USD':
              culture = 'en';
              break;
            case 'KRW':
              culture = 'ko';
              break;
            case 'JPY':
              culture = 'ja';
              break;
          }
          return this.$n(value, 'currency', culture);
        },
        $nNaN: function(value) {
          // 임시 - 넘어오는 데이터가 없는 숫자 출력 용
          if (this.isEmpty(value)) value = 0;
          return this.$n(value);
        },
        $nMinus: function(...value) {
          //  넘어오는 데이터가 없는 숫자들 차감 연산용
          let calNum = 0;
          let tmpNum = 0;
          for (let i = 0; i < value.length; i++) {
            if (!this.isEmpty(value[i]) && i === 0) calNum = value[0];
            if (!this.isEmpty(value[i]) && i > 0) tmpNum = value[i];
            calNum -= tmpNum;
          }
          return this.$n(calNum);
        },
        $nPlus: function(...value) {
          //  넘어오는 데이터가 없는 숫자들 합산 연산용
          let calNum = 0;
          let tmpNum = 0;
          for (let i = 0; i < value.length; i++) {
            if (!this.isEmpty(value[i]) && i === 0) calNum = value[0];
            if (!this.isEmpty(value[i]) && i > 0) tmpNum = value[i];
            calNum += tmpNum;
          }
          return this.$n(calNum);
        },
        $nDiv: function(value1, value2) {
          //  수익율 계산용 {{$n(totalCheckinCount, 'percent')}}
          if (value1 === 0 && value2 === 0) return 0;
          else return (((value1 - value2) / value1) * 100).toFixed(2);
        },
        $dNull: function(value) {
          // 임시 - 넘어오는 날짜가 없는 데이터 변환 용
          if (this.isEmpty(value)) return null;
          //  빈값이 오늘 날짜로 바인딩되는거 처리
          else return this.$d(value, 'd');
        },
        columnWidthToPixel(element, width) {
          if (element && element.$el && width) {
            const tableWidth = element.$el.clientWidth;

            return width * (tableWidth / 100);
          }

          return width;
        },
        calcColumnWidths(element, columnInfo) {
          if (element && element.$el && columnInfo) {
            const tableWidth = element.$el.clientWidth;
            for (let column of Object.keys(columnInfo)) {
              columnInfo[column] = columnInfo[column] * (tableWidth / 100);
            }
          }
        },
        elTablScrollBottom(element) {
          const gridDom = element.$el;
          const container = gridDom.querySelector('.el-table__body-wrapper');
          container.scrollTop = container.scrollHeight;
        },
        compareBy() {
          let fields = [].slice.call(arguments);
          let fieldLength = fields.length;

          return function(A, B) {
            let a;
            let b;
            let field;
            let key;
            let reverse;
            let result;
            // let primer;
            for (let i = 0, l = fieldLength; i < l; i++) {
              result = 0;
              field = fields[i];

              key = typeof field === 'string' ? field : field.name;

              a = A[key];
              b = B[key];

              if (typeof field.primer !== 'undefined') {
                a = field.primer(a);
                b = field.primer(b);
              }

              reverse = field.reverse ? -1 : 1;

              if (a < b) result = reverse * -1;
              if (a > b) result = reverse * 1;
              if (result !== 0) break;
            }
            return result;
          };
        },
        dateToString(value) {
          if (this.isEmpty(value)) {
            return '';
          }

          return value.toStandardDateString();
        },
        dateDiff(date1, date2) {
          let timeDiff = Math.abs(date2.getTime() - date1.getTime());
          let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

          return diffDays;
        },
        detectIE: function() {
          const ua = window.navigator.userAgent;

          // Test values; Uncomment to check result …

          // IE 10
          // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

          // IE 11
          // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

          // Edge 12 (Spartan)
          // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

          // Edge 13
          // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

          var msie = ua.indexOf('MSIE ');
          if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
          }

          var trident = ua.indexOf('Trident/');
          if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
          }

          var edge = ua.indexOf('Edge/');
          if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
          }
          // other browser
          return false;
        },
        exceptionHandler(err, httpMethod, url, data, options, config, loadingInstance, resolve, reject) {
          if (loadingInstance != null) {
            loadingInstance.close();
          }

          if (err.request) {
            if (err.request.status === 412) {
              return this.updateToken(httpMethod, url, data, options, config, loadingInstance, resolve, reject);
            }

            if (err.request.status === 403) {
              messageBox.show('', '현재 페이지에 대한 권한이 없습니다.');
              return;
            }

            if (err.request.status === 401) {
              messageBox.show('', '인증이 만료 되었거나 다른 곳에서 접속되어 현재 더 이상 사용 할 수 없습니다.');
              return;
            }

            if (err.request.status === 500 && !this.isEmpty(err.response.data.message)) {
              messageBox.show('', err.response.data.message);
              return;
            } else if (err.request.status === 500 && !this.isEmpty(err.response.data)) {
              try {
                // arraybuffer 에러 메시지 처리
                const decoder = new TextDecoder('utf8');
                const obj = JSON.parse(decoder.decode(err.response.data));
                const message = obj['message'];

                if (!this.isEmpty(message)) {
                  messageBox.show('', message);
                  return;
                }
              } catch (error) {}
            }

            if (!this.isEmpty(options) && options.isThrow === true) {
              if (reject) {
                reject(err);
              }
            } else {
              messageBox.show(process.env.NODE_ENV !== 'production' ? err.request.responseURL : '', err.message, '', 'error');
            }
          } else {
            messageBox.show('', '시스템 사용중 에러가 발생했습니다. 담당자에게 문의 바랍니다.', '', 'error');
          }
        },
        uploadExceptionHandler(err, httpMethod, url, data, options, config, loadingInstance) {
          if (loadingInstance != null) {
            loadingInstance.close();
          }

          if (err.request && err.response && err.response.data && err.request.status === 500 && !this.isEmpty(err.response.data.message)) {
            messageBox.show('', err.response.data.message);
          } else {
            messageBox.show('', '업로드 중 오류가 발생했습니다.');
          }
        },
        expiredToken() {
          const token = this.parseJwt(this.$store.getters.getAccessToken);

          if (token.exp < Date.now() / 1000) {
            return true;
          }

          return false;
        },
        getCurrentMenu: function() {
          if (this.isEmpty(this.$store.getters.userMenus)) {
            return null;
          }

          let path = this.$router.currentRoute.path;

          if ( path === '/' || path === '/home') {
            // path = '/mp/calc-stat';
            // 20220422 yj
            path = '/sc/psalescalc';
          }

          return this.$store.getters.userMenus.findBy(x => x.menuPath, path);
        },
        lineBreakRenderHeader(h, { column }) {
          const label = column.label || '';

          if (label.indexOf('\\n') < 0) {
            return label;
          }

          const words = label.split('\\n');
          const arr = [];

          words.forEach((word, idx) => {
            arr.push(h('span', word));
            if (idx < words.length) {
              arr.push(h('br'));
            }
          });

          return h(
            'div',
            {
              style: {
                lineHeight: 1.7
              }
            },
            arr
          );
        },
        async httpGetAsync(url, data, options) {
          const config = this._getRequestConfig(options);
          const callUrl = this.makeQueryParamURL(url, data);
          let response = null;
          if (this.isEmpty(options) || (!this.isEmpty(options) && options.isLoading !== false)) {
            push();
          }

          try {
            response = await axios.get(callUrl, config);
          } catch (ex) {
            response = {
              data: null,
              exception: ex
            };
            if (ex && ex.request && ex.request.status !== 412) {
              this.exceptionHandler(ex, 'get', url, null, options, config, null, null, null);
            }
          }
          pop();

          return response;
        },
        httpGet(url, data, options) {
          const config = this._getRequestConfig(options);
          const callUrl = this.makeQueryParamURL(url, data);
          if (options && options.cancelToken) {
            config.cancelToken = options.cancelToken;
          }

          if (this.isEmpty(options) || (!this.isEmpty(options) && options.isLoading !== false)) {
            push();
          }
          return new Promise((resolve, reject) => {
            axios
              .get(callUrl, config)
              .then(response => {
                resolve(response);
                pop();
              })
              .catch(err => {
                pop();
                this.exceptionHandler(err, 'get', url, null, options, config, null, resolve, reject);
              });
          });
        },
        httpGetLoadingControl(url, data, options, onHandleLoding, loadingInstance) {
          const config = this._getRequestConfig(options);
          const callUrl = this.makeQueryParamURL(url, data);
          if (options && options.cancelToken) {
            config.cancelToken = options.cancelToken;
          }

          if (this.isEmpty(options) || (!this.isEmpty(options) && options.isLoading !== false)) {
            push();
          }
          return new Promise((resolve, reject) => {
            axios
              .get(callUrl, config)
              .then(response => {
                resolve(response);
                pop();
              })
              .catch(err => {
                pop();
                this.exceptionHandler(err, 'get', url, null, options, config, null, resolve, reject);
                onHandleLoding(loadingInstance);
              });
          });
        },
        httpDownload(url, data, options) {
          const config = this._getRequestConfig(options);
          config.responseType = 'arraybuffer';
          const callUrl = this.makeQueryParamURL(url, data);
          if (options && options.cancelToken) {
            config.cancelToken = options.cancelToken;
          }
          let loadingInstance = null;

          if (this.isEmpty(options) || (!this.isEmpty(options) && options.isLoading !== false)) {
            loadingInstance = Loading.service({
              fullscreen: true,
              background: 'rgba(0, 0, 0, 0.7)'
            });
          }
          axios
            .get(callUrl, config)
            .then(function(response) {
              const blob = new Blob([response.data], {
                type: response.headers['content-type']
              });
              const contentDisposition = response.headers['content-disposition'];
              let fileName = '';

              if (contentDisposition) {
                fileName = contentDisposition
                  .split(';')
                  .filter(ele => {
                    return ele.indexOf('filename') > -1;
                  })
                  .map(ele => {
                    return ele.replace(/"/g, '').split('=')[1];
                  });

                if (fileName.length > 0) {
                  fileName = fileName[0];
                }

                fileName = decodeURI(fileName); // 파일명 디코딩 (프로젝트에 따라 사용여부 옵션)
              } else {
                fileName = options ? options.fileName || `excel_${new Date().yyyymmddhhmm()}.xlsx` : `excel_${new Date().yyyymmddhhmm()}.xlsx`;
              }

              if (loadingInstance != null) {
                loadingInstance.close();
              }

              if (window.navigator.msSaveOrOpenBlob) {
                // IE 10+
                window.navigator.msSaveOrOpenBlob(blob, fileName);
              } else {
                // not IE
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.target = '_self';
                if (fileName) {
                  link.download = fileName;
                }
                link.click();
              }
            })
            .catch(err => {
              this.exceptionHandler(err, 'get', url, null, options, config, loadingInstance, null, null);
            });
        },
        httpPostDownload(url, data, options) {
          const config = this._getRequestConfig(options);
          config.responseType = 'arraybuffer';
          // const callUrl = this.makeQueryParamURL(url, data);
          if (options && options.cancelToken) {
            config.cancelToken = options.cancelToken;
          }
          let loadingInstance = null;

          if (this.isEmpty(options) || (!this.isEmpty(options) && options.isLoading !== false)) {
            loadingInstance = Loading.service({
              fullscreen: true,
              background: 'rgba(0, 0, 0, 0.7)'
            });
          }
          axios
            .post(url, data, config)
            .then(function(response) {
              const blob = new Blob([response.data], {
                type: response.headers['content-type']
              });
              const contentDisposition = response.headers['content-disposition'];
              let fileName = '';

              if (contentDisposition) {
                fileName = contentDisposition
                  .split(';')
                  .filter(ele => {
                    return ele.indexOf('filename') > -1;
                  })
                  .map(ele => {
                    return ele.replace(/"/g, '').split('=')[1];
                  });

                if (fileName.length > 0) {
                  fileName = fileName[0];
                }

                fileName = decodeURI(fileName); // 파일명 디코딩 (프로젝트에 따라 사용여부 옵션)
              } else {
                fileName = options ? options.fileName || `excel_${new Date().yyyymmddhhmm()}.xlsx` : `excel_${new Date().yyyymmddhhmm()}.xlsx`;
              }

              if (loadingInstance != null) {
                loadingInstance.close();
              }

              if (window.navigator.msSaveOrOpenBlob) {
                // IE 10+
                window.navigator.msSaveOrOpenBlob(blob, fileName);
              } else {
                // not IE
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.target = '_self';
                if (fileName) {
                  link.download = fileName;
                }
                link.click();
              }
            })
            .catch(err => {
              this.exceptionHandler(err, 'post', url, null, options, config, loadingInstance, null, null);
            });
        },
        httpPostAnonymous(url, data, options) {
          const config = this._getRequestConfig(options);
          config.headers.authority = CryptoJS.AES.encrypt('Y', process.env.ENCKEY).toString();
          return new Promise((resolve, reject) => {
            axios
              .post(url, data, config)
              .then(response => {
                resolve(response);
              })
              .catch(err => {
                if (options && options.isRethrow !== false) {
                  this.exceptionHandler(err, 'post', url, data, options, config, null, resolve, reject);
                }
              });
          });
        },
        httpPutAnonymous(url, data, options) {
          const config = this._getRequestConfig(options);
          config.headers.authority = CryptoJS.AES.encrypt('Y', process.env.ENCKEY).toString();
          return new Promise((resolve, reject) => {
            axios
              .put(url, data, config)
              .then(response => {
                resolve(response);
              })
              .catch(err => {
                this.exceptionHandler(err, 'put', url, data, options, config, null, resolve, reject);
              });
          });
        },
        httpPost(url, data, options) {
          const config = this._getRequestConfig(options);
          let loadingInstance = null;
          if (this.isEmpty(options) || (!this.isEmpty(options) && options.isLoading !== false)) {
            loadingInstance = Loading.service({
              fullscreen: true,
              background: 'rgba(0, 0, 0, 0.7)'
            });
          }
          return new Promise((resolve, reject) => {
            axios
              .post(url, data, config)
              .then(response => {
                if (loadingInstance != null) {
                  loadingInstance.close();
                }
                resolve(response);
              })
              .catch(err => {
                this.exceptionHandler(err, 'post', url, data, options, config, loadingInstance, resolve, reject);
              });
          });
        },
        httpPatch(url, data, options) {
          const config = this._getRequestConfig(options);
          let loadingInstance = null;
          if (this.isEmpty(options) || (!this.isEmpty(options) && options.isLoading !== false)) {
            loadingInstance = Loading.service({
              fullscreen: true,
              background: 'rgba(0, 0, 0, 0.7)'
            });
          }
          return new Promise((resolve, reject) => {
            axios
              .patch(url, data, config)
              .then(response => {
                if (loadingInstance != null) {
                  loadingInstance.close();
                }
                resolve(response);
              })
              .catch(err => {
                this.exceptionHandler(err, 'patch', url, data, options, config, loadingInstance, resolve, reject);
              });
          });
        },
        httpPut(url, data, options) {
          const config = this._getRequestConfig(options);
          //  let loadingInstance = null;
          if (this.isEmpty(options) || (!this.isEmpty(options) && options.isLoading !== false)) {
            push();
          }

          return new Promise((resolve, reject) => {
            axios
              .put(url, data, config)
              .then(response => {
                resolve(response);
                pop();
              })
              .catch(err => {
                pop();
                this.exceptionHandler(err, 'put', url, data, options, config, null, resolve, reject);
              });
          });
        },
        httpDelete(url, options) {
          const config = this._getRequestConfig(options);
          let loadingInstance = null;
          if (this.isEmpty(options) || (!this.isEmpty(options) && options.isLoading !== false)) {
            loadingInstance = Loading.service({
              fullscreen: true,
              background: 'rgba(0, 0, 0, 0.7)'
            });
          }
          return new Promise((resolve, reject) => {
            axios
              .delete(url, config)
              .then(response => {
                if (loadingInstance != null) {
                  loadingInstance.close();
                }
                resolve(response);
              })
              .catch(err => {
                this.exceptionHandler(err, 'delete', url, null, options, config, loadingInstance, resolve, reject);
              });
          });
        },
        makeQueryParamURL(url, queryParams) {
          let callUrl = url;

          if (this.isEmpty(url) === false) {
            if (this.isEmpty(queryParams) === false) {
              let queryString = '';

              Object.keys(queryParams).forEach(param => {
                if (!this.isEmpty(queryParams[param])) {
                  queryString = queryString + param + '=' + queryParams[param] + '&';
                }
              });
              queryString = queryString.substr(0, queryString.length - 1);

              if (!this.isEmpty(queryString)) {
                callUrl = url + '?' + queryString;
              }
            }
          }

          return callUrl;
        },
        padLeft: function(value, n, str) {
          let txt = null;

          if (this.isEmpty(value)) {
            txt = '';
          } else {
            txt = value.toString();
          }

          if (txt.length >= n) {
            return txt;
          }

          return Array(n - txt.length + 1).join(str || '0') + txt;
        },
        routeGo(n) {
          router.go(n);
        },
        routePush(path, params) {
          if (typeof path === 'string') {
            let menuInfo = this.$store.getters.userMenus.findBy(x => x.viewName, path);
            if (menuInfo) {
              router.push({
                name: menuInfo.viewName,
                params: this.isEmpty(params) ? {} : params
              });
            } else {
              router.push({
                name: 'error.404'
              });
            }
          } else {
            router.push(path);
          }
        },
        stringFormat: function() {
          let s = arguments[0];
          for (let i = 0; i < arguments.length - 1; i++) {
            let reg = new RegExp('\\{' + i + '\\}', 'gm');
            s = s.replace(reg, arguments[i + 1]);
          }

          return s;
        },
        uploadPost(url, data, options) {
          let config = this._getRequestConfig(options, process.env.API_UPLOAD_URL);
          let loadingInstance = null;
          if (this.isEmpty(options) || (!this.isEmpty(options) && options.isLoading !== false)) {
            loadingInstance = Loading.service({
              fullscreen: true,
              background: 'rgba(0, 0, 0, 0.7)'
            });
          }

          return new Promise((resolve, reject) => {
            axios
              .post(url, data, config)
              .then(response => {
                if (loadingInstance != null) {
                  loadingInstance.close();
                }
                resolve(response);
              })
              .catch(err => {
                reject(new Error(err));
                this.uploadExceptionHandler(err, 'post', url, data, options, config, loadingInstance);
              });
          });
        },
        updateToken(httpMethod, url, data, options, config, loadingInstance, resolve, reject) {
          let encryptedUserNameOrEmail = CryptoJS.AES.encrypt(this.$store.getters.userInfo.email, process.env.ENCKEY);
          let encryptedRefreshToken = CryptoJS.AES.encrypt(this.$store.getters.getRefreshToken, process.env.ENCKEY);
          let encryptedSystemCode = CryptoJS.AES.encrypt(this.$store.getters.getSystemCode, process.env.ENCKEY);

          const tokenData = {
            systemCode: encryptedSystemCode.toString(),
            usernameOrEmail: encryptedUserNameOrEmail.toString(),
            password: encryptedRefreshToken.toString()
          };

          const updatTokenConfig = this._getRequestConfig({
            customHeader: {
              refreshToken: this.$store.getters.getRefreshToken,
              authority: CryptoJS.AES.encrypt('Y', process.env.ENCKEY).toString()
            }
          });

          const assignConfig = Object.assign(
            {
              url: url,
              data: data,
              method: httpMethod
            },
            config
          );

          let returnValue;

          axios
            .put('/api/common/user/updateToken', tokenData, updatTokenConfig)
            .then(response => {
              if (response.status === 200) {
                axios.defaults.headers.common['Authorization'] = `${response.data.tokenType} ${response.data.accessToken}`;

                this.$store.dispatch('UPDATETOKEN', {
                  accessToken: response.data.accessToken
                });

                axios
                  .request(assignConfig)
                  .then(res => {
                    if (loadingInstance != null) {
                      loadingInstance.close();
                    }
                    returnValue = res;

                    if (resolve) {
                      resolve(res);
                    }
                  })
                  .catch(err => {
                    if (options != null && options !== undefined && options.isThrow === true) {
                      reject(err);
                    } else {
                      messageBox.show('', err.message, '', 'error');
                    }
                  });
              }
            })
            .catch(err => {
              if (loadingInstance != null) {
                loadingInstance.close();
              }

              if (err.request.status === 404) {
                setTimeout(function() {
                  axios
                    .request(assignConfig)
                    .then(res => {
                      if (loadingInstance != null) {
                        loadingInstance.close();
                      }

                      returnValue = res;

                      if (resolve) {
                        resolve(res);
                      }
                    })
                    .catch(err => {
                      if (options != null && options !== undefined && options.isThrow === true) {
                        reject(err);
                      } else {
                        messageBox.show('', 'reCall -' + err.message, '', 'error');
                      }
                    });
                }, 500);
              }
            });
          return returnValue;
        },
        wait() {
          return new Promise(function(resolve) {
            setTimeout(function() {
              resolve();
            }, 500);
          });
        },
        _getRequestConfig(options, defaultUrl) {
          const queryString = require('query-string');

          let currentMenu = this.getCurrentMenu();

          let headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'x-requestid': this.$uuid.v4(),
            userid: this.$store.getters.userInfo ? this.$store.getters.userInfo.email : '',
            deptCode: this.$store.getters.userInfo ? CryptoJS.AES.encrypt(this.$store.getters.userInfo.deptCode, process.env.ENCKEY).toString() : '',
            deptName: this.$store.getters.userInfo ? CryptoJS.AES.encrypt(this.$store.getters.userInfo.deptName, process.env.ENCKEY).toString() : '',
            viewId: this.isEmpty(currentMenu) ? '' : currentMenu.viewName,
            systemcode: this.$store.getters.systemCode,
            roleNo: this.$store.getters.userInfo ? this.$store.getters.userInfo.roleNo : '',
            menuNo: this.isEmpty(currentMenu) ? '' : currentMenu.menuNo,
            authority: this.isEmpty(currentMenu) ? '' : CryptoJS.AES.encrypt(currentMenu.writeYn, process.env.ENCKEY).toString(),
            culture: this.$store.getters.cultureTwoLetter,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          };

          if (options && options.customHeader) {
            headers = Object.assign(headers, options.customHeader);
          }

          return {
            baseURL: defaultUrl || process.env.CLARE_API_URL,
            headers: headers,
            params: !this.isEmpty(options) && !this.isEmpty(options.params) ? options.params : null,
            paramsSerializer: function(params) {
              return queryString.stringify(params, {
                encode: options.encode
              });
            }
          };
        },
        getProcStatCode: function() {
          // TODO: 쓸까말까 고민중..
          const currentPath = this.$router.currentRoute.path;

          switch (currentPath) {
            case currentPath.startsWith('/sc'):
              return '93000001';
            case currentPath.startsWith('/pc'):
              return '93000002';
            case currentPath.startsWith('/tc'):
              return '93000002';
            case currentPath.startsWith('/sr'):
              return '93000003';
            default:
              return '93000001';
          }
        },
        getPageName: function() {
          const routePath = split(this.$router.currentRoute.path, '/');
          return routePath[routePath.length - 1];
        },
        getCalcType: function(pageName) {
          let calcType = 'P';
          const taviMenu = ['tavirnp', 'tavirnpinvoice', 'tavirnpvcc', 'tavirnpcts', 'salesTaxInvoice', 'purchaseTaxInvoice', 'tcancelfeecheck', 'derby', 'tllincoln', 'tripanzee', 'siteminder', 'sanha'];

          if (includes(taviMenu, pageName)) {
            calcType = 'T';
          }
          return calcType;
        }
      }
    });

    Vue.prototype.conainHangul = function(text) {
      const hangulRegEx = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
      return hangulRegEx.test(text);
    };

    Vue.prototype.MaxDate = function(allDates) {
      let maxdt = allDates[0];
      let maxdtObj = new Date(allDates[0]);
      allDates.forEach(function(dt) {
        if (new Date(dt) > maxdtObj) {
          maxdt = dt;
          maxdtObj = new Date(dt);
        }
      });
      return maxdt;
    };

    Vue.prototype.isEmpty = function(obj) {
      if (obj === null || obj === undefined || obj === '' || obj === 'undefined') {
        return true;
      }

      if (Array.isArray(obj) && obj.length === 0) {
        return true;
      }

      if (typeof obj === 'string') {
        let blankPattern = /^\s+|\s+$/g;

        if (obj.replace(blankPattern, '') === '') {
          return true;
        }
      } else if (Object.keys(obj).length === 0 && obj.constructor === Object) {
        return true;
      }

      return false;
    };

    Vue.prototype.cloneObject = function(obj) {
      return JSON.parse(JSON.stringify(obj));
    };

    Vue.prototype.isNumber = function(obj) {
      obj += ''; // 문자열로 변환
      obj = obj.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거

      if (obj === '' || isNaN(obj)) {
        return false;
      }

      return true;
    };

    Vue.prototype.ltrim = function(value) {
      return value.replace(/^\s+/, '');
    };

    Vue.prototype.rtrim = function(value) {
      return value.replace(/\s+$/, '');
    };

    Vue.prototype.toUTCISOString = function(text) {
      return JSON.stringify(text).replace(/"/g, '');
    };

    Vue.prototype.isValidateAlpha = function(text) {
      let re = /^[A-Za-z]*$/;

      return re.test(text);
    };

    Vue.prototype.isValidateIpAddress = function(text) {
      let ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

      if (text.match(ipformat)) {
        return true;
      } else {
        return false;
      }
    };

    Vue.prototype.isValidateAlphaNumber = function(text) {
      let re = /^[A-Za-z0-9]*$/;

      return re.test(text);
    };

    Vue.prototype.isValidateNumber = function(text) {
      let re = /^[0-9]*$/;

      return re.test(text);
    };

    Vue.prototype.isValidateEngName = function(text) {
      let re = /^[A-za-z]/g;

      return re.test(text);
    };

    Vue.prototype.isValidateAlphaName = function(text) {
      let re = /^[A-Za-z0-9 -]*$/;

      return re.test(text);
    };

    Vue.prototype.isValidateEmail = function(email) {
      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return re.test(email);
    };

    Vue.prototype.bytesToSize = function(bytes) {
      if (bytes === 0) {
        return '0 Byte';
      }

      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      const k = Math.pow(1024, i);
      const size = bytes / k;

      return `${Math.round(size, 2)} ${sizes[i]}`;
    };

    Vue.prototype.base64DecodeUnicode = function(str) {
      return decodeURIComponent(Array.prototype.map.call(atob(str), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    };

    Vue.prototype.parseJwt = function(token) {
      return JSON.parse(
        this.base64DecodeUnicode(
          token
            .split('.')[1]
            .replace('-', '+')
            .replace('_', '/')
        )
      );
    };

    Date.prototype.addDays = function(days) {
      let dat = new Date(this.valueOf());
      dat.setDate(dat.getDate() + days);
      return dat;
    };

    Date.prototype.addMonths = function(months) {
      let dat = new Date(this.getFullYear(), this.getMonth(), 1, this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
      dat.setMonth(this.getMonth() + months);

      let lastDate = new Date(dat.getFullYear(), dat.getMonth() + 1, 0).getDate();

      if (this.getDate() > lastDate) {
        dat.setDate(lastDate);
      } else {
        dat.setDate(this.getDate());
      }

      return dat;
    };

    Date.prototype.addYears = function(years) {
      let dat = new Date(this.getFullYear() + years, this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
      return dat;
    };

    Date.prototype.addHours = function(hour) {
      let newValue = new Date(this);

      newValue.setTime(newValue.getTime() + hour * 60 * 60 * 1000);

      return newValue;
    };

    Date.prototype.addMinutes = function(minute) {
      let newValue = new Date(this);

      newValue.setTime(newValue.getTime() + minute * 60 * 1000);

      return newValue;
    };

    Date.prototype.Equals = function(compareValue) {
      return this.toStandardDateString() === compareValue.toStandardDateString();
    };

    Date.prototype.getDisplayMonth = function() {
      return this.getMonth() + 1;
    };

    Date.prototype.getFirstDate = function() {
      return new Date(this.getFullYear(), this.getMonth(), 1, 0, 0, 0);
    };

    Date.prototype.getLastDate = function() {
      return new Date(this.getFullYear(), this.getMonth() + 1, 0, 0, 0, 0);
    };

    Date.prototype.toAge = function(today) {
      let diff = today.getTime() - this.getTime();
      let daysPast = Math.floor(diff / (1000 * 60 * 60 * 24));
      return Math.floor(daysPast / 365.25);
    };

    Date.prototype.toStandardDateString = function() {
      return (
        this.getFullYear() +
        '-' +
        (this.getMonth() + 1).toString().padLeft(2, '0') +
        '-' +
        this.getDate()
          .toString()
          .padLeft(2, '0')
      );
    };

    Date.prototype.toJSON = function(propertyName) {
      if (
        propertyName === 'registrationDate' ||
        propertyName === 'modificationDate' ||
        propertyName === 'passwordChangeDate' ||
        propertyName === 'reservedDate' ||
        propertyName === 'calculateDate' ||
        propertyName === 'exchangeRateUPD'
      ) {
        return null;
      }

      return this.toStandardDateString();
    };

    Date.prototype.Subtract = function(date1, unit) {
      let diff = (this.getTime() - date1.getTime()) / 1000;

      switch (unit) {
        case 'minute':
          return Math.abs(Math.round(diff / 60));
        default:
          break;
      }

      return Math.abs(diff);
    };

    Date.prototype.yyyymmdd = function() {
      var mm = this.getMonth() + 1;
      var dd = this.getDate();

      return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
    };

    Date.prototype.hhmmss = function() {
      var hh = this.getHours();
      var mm = this.getMinutes();
      var ss = this.getSeconds();

      return [(hh > 9 ? '' : '0') + hh, (mm > 9 ? '' : '0') + mm, (ss > 9 ? '' : '0') + ss].join('');
    };

    Date.prototype.yyyymmddhhmm = function() {
      return (this.yyyymmdd() + this.hhmmss()).substring(0, 12);
    };

    Date.prototype.yyyymmddhhmmss = function() {
      return this.yyyymmdd() + this.hhmmss();
    };

    String.prototype.padLeft = function(n, str) {
      return Array(n - this.length + 1).join(str || '0') + this;
    };

    String.prototype.padRight = function(n, str) {
      return this + Array(n - this.length + 1).join(str || '0');
    };

    String.prototype.startsWith = function(prefix) {
      return this.indexOf(prefix) === 0;
    };

    String.prototype.endsWith = function(suffix) {
      return this.match(suffix + '$') === suffix;
    };

    Array.prototype.dateFindBy = function(propertyName, value) {
      return this.find(function(x) {
        return x[propertyName].toStandardDateString() === value.toStandardDateString();
      });
    };

    Array.prototype.getIndex = function(keyGetter, item) {
      return this.findIndex(function(x) {
        return keyGetter(x) === keyGetter(item);
      });
    };

    Array.prototype.changeBy = function(keyGetter, item) {
      const foundIndex = this.getIndex(keyGetter, item);

      this.splice(foundIndex, 1, item);
    };

    Array.prototype.findBy = function(keyGetter, value) {
      let findItem = this.find(function(x) {
        return keyGetter(x) === value;
      });

      if (findItem === undefined) {
        return null;
      }

      return findItem;
    };

    Array.prototype.findValue = function(keyGetter, value) {
      let findItem = this.find(function(x) {
        return keyGetter(x) === value;
      });

      if (findItem === undefined) {
        return value;
      }

      return findItem;
    };

    Array.prototype.groupBy = function(keyGetter) {
      const map = new Map();
      this.forEach(item => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });
      return map;
    };

    Array.prototype.filterBy = function(keyGetter, value) {
      return this.filter(x => keyGetter(x) === value);
    };

    Array.prototype.removeObject = function(keyGetter, item) {
      let index = this.findIndex(x => keyGetter(x) === keyGetter(item));
      this.splice(index, 1);
    };

    Array.prototype.ToHierarchicalData = function(rootId, parentMembetPath, idMemberPath) {
      let originalSource = Object.assign([], this);
      let rootNodes = [];
      let traverse = function(nodes, item, index) {
        if (nodes instanceof Array) {
          return nodes.some(function(node) {
            if (node[idMemberPath] === item[parentMembetPath]) {
              node.children = node.children || [];
              return node.children.push(originalSource.splice(index, 1)[0]);
            }

            return traverse(node.children, item, index);
          });
        }
      };

      const maxloop = originalSource.length;
      let currentLoop = 0;
      while (originalSource.length > 0) {
        if (currentLoop > maxloop) {
          return rootNodes;
        }

        currentLoop++;

        originalSource.some(function(item, index) {
          if (item[parentMembetPath] === undefined || item[parentMembetPath] === rootId) {
            return rootNodes.push(originalSource.splice(index, 1)[0]);
          }

          return traverse(rootNodes, item, index);
        });
      }

      return rootNodes;
    };

    String.prototype.firstLetterToUpperCase = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };
  }
};

export default prototypeExtend;
