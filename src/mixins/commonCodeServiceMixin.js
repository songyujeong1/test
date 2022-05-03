import store from '@/store';
import { spanRow } from '@/utils/spanRow';
import { isEmpty } from 'lodash';

export const commonCodeServiceMixin = {
  data() {
    return {
    };
  },
  methods: {
    async getCodeGroupsAsync() {
      let response = await this.httpGetAsync('/api/common/code/groupCodeList');

      return response.data;
    },
    getCodeGroups() {
      return this.httpGet('/api/common/code/groupCodeList');
    },
    async getCountrysAsync() {
      const response = await this.httpGetAsync(`/api/common/code/country`);

      const rtn = [
        {nationCode: '', nationNameKr: '선택'}
      ];

      return rtn.concat(response.data);
    },
    async getDetailCodeListAsync(grpCode, parentCode = null, useYn = 'ALL') {
      let response = null;
      if ( parentCode ) {
        response = await this.httpGetAsync(`/api/common/code/detailCodeList/${grpCode}/${parentCode}/${useYn}`);
      } else {
        response = await this.httpGetAsync(`/api/common/code/detailCodeList/${grpCode}/${useYn}`);
      }

      return response.data;
    },
    getDetailCodeList(grpCode, parentCode = null, useYn = 'ALL') {
      if (parentCode) {
        return this.httpGet(`/api/common/code/detailCodeList/${grpCode}/${parentCode}/${useYn}`);
      }
      return this.httpGet(`/api/common/code/detailCodeList/${grpCode}/${useYn}`);
    },
    getMultiDetailCodeList(grpCodes) {
      return this.httpGet(`/api/common/code/multiDetailCodeList`, {grpCodes: grpCodes});
    },
    // getTaxEmailInfoList() {
    //   return this.httpGet(`/api/common/code/taxEmailInfo`, {});
    // },
    removeGroupCode(obj, arr) { // 해당 그룹코드 삭제
      arr.forEach(code => {
        const tmpIdx = obj.find(function(item) {
          return item.detailCode === code;
        });
        const delIdx = obj.indexOf(tmpIdx);
        if (delIdx > -1) obj.splice(delIdx, 1);
      });
    },
    selectGroupCode(obj, arr) { // 해당 코드만 선택
      const _obj = [];

      if (!isEmpty(obj) && !isEmpty(arr)) {
        arr.forEach(code => {
          obj.find(function(item) {
            if (item.detailCode === code) {
              _obj.push(item);
            }
          });
        });

        return _obj;
      } else {
        return obj;
      }
    },
    disableCode(obj, arr) { // 해당 그룹코드 비활성화
      arr.forEach(code => {
        obj.find(function(item) {
          if (item.detailCode === code) {
            item.disabled = true;
          }
        });
      });
    },
    getLocaleType(useAll = true) {
      const rtn = [];

      if (useAll) {
      //  rtn.push({detailCode: '', detailCodeNameKr: '전체'});
      }

      rtn.push({detailCode: 'DOM', detailCodeNameKr: '국내'});
      rtn.push({detailCode: 'INT', detailCodeNameKr: '해외'});

      return rtn;
    },
    getUpperClientCode() {
      const rtn = [];

      rtn.push({detailCode: 'CHI0000001', detailCodeNameKr: '소노'});
      rtn.push({detailCode: 'CHI0000002', detailCodeNameKr: '이랜드파크'});

      return rtn;
    },
    async getSupplierinfoAsync(taviYn = 'N') {
      const sprListResponse = await this.httpGetAsync(`/api/common/code/supplierinfo${taviYn === 'Y' ? '?taviYn=Y' : ''}`);
      return sprListResponse.data;
    },
    async getCidInfoAsync() {
      const cidResponse = await this.httpGetAsync(`/api/common/code/cidInfo`);
      return cidResponse.data;
    },
    getCurrentDate(days) {
      if (this.isEmpty(days)) days = 0;
      let currentTime = this.getCurrentTime();

      return new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + days, 0, 0, 0);
    },
    getCurrentTime() {
      return new Date();
    },
    getVccCardNm(vccCardNum) {
      if (!this.isEmpty(vccCardNum)) {
        if (vccCardNum === 'B001630354') {
          return '신한 Virtual_2759';
        } else if (vccCardNum === 'B002122760') {
          return '신한 VCC_4919';
        } else if (vccCardNum === '00015') {
          return '현대카드 vcc_0301';
        } else if (vccCardNum === 'B002382614') {
          return '신한 VCC_4882';
        }
      }

      return vccCardNum;
    },
    formatHandler(row, code) { //  테이블 각 컬럼의 코드 포매터..전체코드 정의 되면 로직 재정의
      const _column = code.property || code.prop;
      let rtn = row[_column];

      switch (_column) {
        case 'bookingState':
        case 'salesType':
        case 'calcProcState':
        case 'errorUpperState':
        case 'errorDetailState':
        case 'invoiceType':
        case 'sprType':
        case 'taviInvoiceType':
        case 'tradeType':
        case 'tiiSalesType':
        case 'calcDetailState':
        case 'supplierType':
        case 'mappingType':
        case 'paymentType':
        case 'payState':
        case 'commissionErrorState':
        case 'historyType':
        case 'paymentState':
        case 'saveState':
          const item = store.getters.commonCode[_column].findValue((x) => x.detailCode, row[_column]);
          if ( item && item.detailCodeNameKr ) {
            rtn = item.detailCodeNameKr;
          } else {
            if (_column === 'errorUpperState') {
              rtn = '대사 정보 불일치';
            } else if (_column === 'errorDetailState' || _column === 'commissionErrorState') {
              rtn = '대사 정보 누락';
            }
          }
          break;
        case 'procState':
          if (!row[_column]) {
            rtn = '미조치';
          } else {
            const procItem = store.getters.commonCode[_column].findValue((x) => x.detailCode, row[_column]);
            if ( procItem && procItem.detailCodeNameKr ) {
              rtn = procItem.detailCodeNameKr;
            }
          }
          break;
        case 'pgCompareErrorYn':
          if (row[_column] === 'Y') {
            rtn = '불일치';
          } else if (row[_column] === 'N') {
            rtn = '일치';
          }
          break;
        case 'error':
          if (row[_column]) {
            rtn = '오류/불일치';
          } else {
            rtn = '정상';
          }
          break;
        case 'dealType':
        case 'tciDealType':
        case 'bfpDealType':
          if (row[_column] === 'A') {
            rtn = '승인';
          } else if (row[_column] === 'C') {
            rtn = '취소';
          } else if (row[_column] === 'R') {
            rtn = '환불';
          }
          break;
        case 'localeType':
          if (row[_column] === 'INT') {
            rtn = '해외';
          } else if (row[_column] === 'DOM') {
            rtn = '국내';
          }
          break;
        case 'prevCalcYet':
          if (row[_column]) {
            rtn = '이월';
          } else {
            rtn = '당월';
          }
          break;
        case 'cancelChargeYn':
          if (row[_column] === 'Y') {
            rtn = '발생';
          } else {
            rtn = '미발생';
          }
          break;
        case 'calcType':
          if (row[_column] === 'T') {
            rtn = 'TAVI';
          } else {
            rtn = '파라곤';
          }
          break;
        case 'calcModYn':
          if (row[_column] === 'N') {
            rtn = 'Y'; // N이 예약 잠김
          } else {
            rtn = 'N';
          }
          break;
        case 'payMastState':
          const payMastStateCode = store.getters.commonCode['payState'].findValue((x) => x.detailCode, row['payMastState']);
          if (payMastStateCode && payMastStateCode.detailCodeNameKr) {
            rtn = payMastStateCode.detailCodeNameKr;
          }
          break;
        case 'payDetailState':
          const payDetailStateCode = store.getters.commonCode['payState'].findValue((x) => x.detailCode, row['payDetailState']);
          if (payDetailStateCode && payDetailStateCode.detailCodeNameKr) {
            rtn = payDetailStateCode.detailCodeNameKr;
          }
          break;
        case 'prePaymentYn':
          if (row[_column] === 'Y') {
            rtn = '선지급';
          } else {
            rtn = '비선지급';
          }
          break;
        case 'closeYn':
          if (row[_column] === 'Y') {
            rtn = '마감';
          } else {
            rtn = '미마감';
          }
          break;
        case 'calcRevenueYearMonth':
          if (!this.isEmpty(row[_column])) {
            rtn = row[_column].substring(0, 4) + '-' + row[_column].substring(4, 6);
          } else {
            rtn = '';
          }
          break;
        case 'eviCardNum':
        case 'vccCardNum':
          if (!this.isEmpty(row[_column])) {
            rtn = this.getVccCardNm(row[_column]);
          } else {
            rtn = '';
          }
          break;
        case 'feeCalcState':
          const feeCalcStateCode = store.getters.commonCode['calcProcState'].findValue((x) => x.detailCode, row['feeCalcState']);
          if (feeCalcStateCode && feeCalcStateCode.detailCodeNameKr) {
            rtn = feeCalcStateCode.detailCodeNameKr;
          }
          break;
        case 'profitType':
          const profitTypeCodes = [
            {detailCode: 'CPT01', detailCodeNameKr: '입금가'},
            {detailCode: 'CPT02', detailCodeNameKr: '판매가(공급컴 제외)'},
            {detailCode: 'CPT03', detailCodeNameKr: '판매가(공급컴 포함)'},
            {detailCode: 'CPT04', detailCodeNameKr: '입금가/판매가'}
          ];
          const profitTypeCode = profitTypeCodes.findValue((x) => x.detailCode, row['profitType']);
          if (profitTypeCode && profitTypeCode.detailCodeNameKr) {
            rtn = profitTypeCode.detailCodeNameKr;
          }
          break;
      }

      return rtn;
    },
    getAlertColor(value, checkType, value2, value3) { // 테이블속의 데이터 스타일 하이라이트
      let fontColor = 'black';
      switch (checkType) {
        case 'dealType':
          if (value === 'C') fontColor = 'red';
          break;
        case 'minusCheck':
          if (value < 0) fontColor = 'red';
          break;
        case 'pairCheck':
          if (this.isEmpty(value) || (this.isEmpty(value2) && this.isEmpty(value3))) {
            fontColor = 'red';
          }
          break;
        case 'intCheck':
          if (!Number.isInteger(Number(value))) fontColor = 'red';
          break;
        case 'zeroCheck':
          if (Number(value) !== 0) fontColor = 'red';
          break;
        case 'errorCheck':
          if (value) fontColor = 'red';
          break;
        case 'cancelCheck':
          if (value === 'Y') fontColor = 'red';
          break;
      }
      return {
        color: fontColor
      };
    },
    onHandleBookingMasterPopup(row) { // 예약번호 클릭시 부킹마스터 팝업 호출
      const bookingCode = row.bookingCode ? row.bookingCode : row;
      const url = `${process.env.PARAGON_POPUP_URL}?bookingCode=${bookingCode}`;
      if (bookingCode) {
        let _window = window.open('', 'booking_master', 'top=50, left=100, width=1200, height=900');
        _window.opener = null;
        _window.location = url;
      }
    },
    onHandleTaviManagementPopup(row) { // 예약번호 클릭시 타비 예약정보 팝업 호출
      const bookingNo = this.isEmpty(row.bookingNo) ? row.bookingId : row.bookingNo;
      const cid = row.cid;
      const url = `${process.env.TAVI_POPUP_URL}?bookingNo=${bookingNo}&cid=${cid}`;
      if (bookingNo && cid) {
        messageBox.show('', 'TAVI 보안 정책상 새창으로 팝업 되는 화면에서 로그인 하신 후 상단의 주소창에 붙여넣기(Ctrl + V)하고 조회 해주시기 바랍니다.', 'Ok').then(dialog => {
          if (dialog === 'ok') {
            this.copyStringToClipboard(url);
            let _window = window.open('', 'tavi_management');
            _window.opener = null;
            _window.location = url;
          }
        });
      }
    },
    onHandleExternalPageOpen() { // 외부 페이지 링크
      const page = this.getPageName();
      let url;
      switch (page) {
        case 'csalescalc':
          url = 'https://admin8.kcp.co.kr/assist/login.LoginAction.do';
          break;
        default:
          break;
      }
      if (url) {
        let _window = window.open('', '');
        _window.opener = null;
        _window.location = url;
      }
    },
    copyStringToClipboard (str) { // 클립보드에 복사
      var el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style = {position: 'absolute', left: '-9999px'};
      document.body.appendChild(el);
      el.select();
      el.setSelectionRange(0, 99999);
      document.execCommand('copy');
      document.body.removeChild(el);
    },
    dateValidCheck(conditions) { // 검색시 기간 필수값 확인
      const { dateType } = conditions;
      if (dateType === 'CM' || dateType === 'CEM' || dateType === 'SM' || dateType === 'SEM' || dateType === 'CY' || dateType === 'WM' || dateType === 'CFM') {
        if (this.isEmpty(this.searchCondition.date)) { // 월간 검색
          messageBox.show('', '기간 조건은 필수 입니다.');
          return false;
        }
      } else {
        if (this.isEmpty(this.searchCondition.dateRange)) { // 일자 검색
          messageBox.show('', '기간 조건은 필수 입니다.');
          return false;
        }
      }
      return true;
    },
    onHandleUploadDataPopup(key) { // 업로드한 데이터 확인용 팝업 화면
      this.$refs.uploadPopup.handleVisible(key);
    },
    onHandleBookingMemoPopup(row, isTavi, isErrorTable) { // OP메모 클릭시 팝업 화면
      this.$refs.bookingPopup.handleVisible(row, isTavi, isErrorTable);
    },
    // onHandlePayRequestPopup(row) { // 공급사 지급요청 거래처별 팝업
    //   this.$refs.payRequestPopup.handleVisible(row);
    // },
    initializeDataList(arr) { //  데이터 초기화
      arr.forEach(list => {
        this[`${list}Data`] = [];
        this[`${list}Cnt`] = 0;
      });
    },
    spanMethodByBookingCode({ row, column, rowIndex, columnIndex }) { //  예약정보로 rowspan
      return spanRow(
        { row, column, rowIndex, columnIndex },
        this.compareListData,
        this.spanOption
      );
    },
    onHandleExcelUpload(data) { // TODO 기능재정의_업로드 버튼
      let mappingType;
      let uploadUrl;
      let fileUploadTemplate;
      const pageName = this.getPageName();
      switch (pageName) { //  9400 매핑용 코드 사용
        case 'csalescalc':
          mappingType = '94000002';
          uploadUrl = '/api/sc/kcpUpload';
          fileUploadTemplate = 'sample_csalescalc_B';
          break;
      }
      const tmpSprManager = 'testManager(test@test.com)'; //  공급사 하나씩 업로드가 아니라 단일파일로 코드명 구분해서 업로드시 발신 담당자와 발행처는?
      Object.assign(data, {
        uploadCondition: {
          fileUploadPage: pageName,
          fileUploadTemplate: fileUploadTemplate, // TODO 업로드 양식 수정시 해당 번호 동기화 해주는 로직필요. 실제 파일이 아닌, JSON 형식으로 내용만 저장하여 해당 번호의 템플릿과 동기화
          fileType: 'xlsx', // FADEOUT 파일타입 엑셀만 처리
          sprManager: tmpSprManager, // TODO 호텔명 매핑된 데이터의 공급사 담당자 정보 사용 또는 업로드시 수기입력
          mappingType: mappingType
        }
      });

      const res = this.uploadPost(uploadUrl, JSON.stringify(data));
      res.then(ok => {
        console.log(ok);
        messageBox.show('', '업로드가 완료 되었습니다.').then(this.$emit('callback'));
      }).catch(err => {
        console.log(err);
        this.$emit('callback');
      });
    }
  }
};
