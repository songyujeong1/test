import frAutoComplete from './share/fr-autoComplete';
import frButton from './share/fr-button';
import frCalendar from './share/fr-calendar';
import frCheckBox from './share/fr-checkbox';
import frCityNameSuggest from './share/fr-cityNameSuggest';
import frDownloadButton from './share/fr-downloadButton';
import frEditableCell from './share/fr-editable-cell';
import frInputNumber from './share/fr-inputnumber';
import frRadioButton from './share/fr-radioButton';
import frTable from './share/fr-table';
import frTableColumn from './share/table/table-column';
import frTableCheckBoxColumn from './share/table/table-checkbox-column';
import frToggleButton from './share/fr-togglebutton';
import frUploadButton from './share/fr-uploadButton';

import chargeConfirmButton from './common/chargeConfirmButton';
import clacProcButton from './common/calcProcButton';
import calcCancelButton from './common/calcCancelButton';
import calcCompareButton from './common/calcCompareButton';
import conditionBox from './common/conditionBox';
import excelDownload from './common/excelDownload';
import payRequestButton from './common/payRequestButton';
import payCancelButton from './common/payCancelButton';
import payRequestMergeButton from './common/payRequestMergeButton';
import bookingLockButton from './common/bookingLockButton';
import bookingUnlockButton from './common/bookingUnlockButton';
import uploadDeleteButton from './common/uploadDeleteButton';
import compButtonBox from './common/layout/buttonBox';
import bookingInfoPopup from './common/layout/bookingInfoPopup';
import uploadInfoPopup from './common/layout/uploadInfoPopup';
import taviCtsMapping from './common/layout/taviCtsMapping';
import deptCode from './common/condition/deptCode';
import domBankCode from './common/condition/domBankCode';
import draftNo from './common/condition/draftNo';
import managerSearchForm from './common/managerSearchForm';
import benefitCloseButton from './common/benefitCloseButton';
import benefitOpenButton from './common/benefitOpenButton';
import feeClacProcButton from './common/feeCalcProcButton';
import createInvoiceButton from './common/createInvoiceButton';
import sendTaxInvoiceMailButton from './common/sendTaxInvoiceMailButton';
import initTaxInvoiceMailButton from './common/initTaxInvoiceMailButton';
import checkTaxInvoiceMailButton from './common/checkTaxInvoiceMailButton';
import mngTaxInvoiceMailButton from './common/mngTaxInvoiceMailButton';
import taxInfoPopupButton from './common/taxInfoPopupButton';

export default {
  install(Vue) {
    Vue.component('fr-autocomplete', frAutoComplete);
    Vue.component('fr-button', frButton);
    Vue.component('fr-calendar', frCalendar);
    Vue.component('fr-checkbox', frCheckBox);
    Vue.component('fr-city-name-suggest', frCityNameSuggest);
    Vue.component('fr-downloadbutton', frDownloadButton);
    Vue.component('fr-editable-cell', frEditableCell);
    Vue.component('fr-input-number', frInputNumber);
    Vue.component('fr-radiobutton', frRadioButton);
    Vue.component('fr-table', frTable);
    Vue.component('fr-table-column', frTableColumn);
    Vue.component('fr-table-checkbox-column', frTableCheckBoxColumn);
    Vue.component('fr-togglebutton', frToggleButton);
    Vue.component('fr-uploadbutton', frUploadButton);
    Vue.component('charge-confirm-button', chargeConfirmButton);
    Vue.component('calc-proc-button', clacProcButton);
    Vue.component('calc-cancel-button', calcCancelButton);
    Vue.component('calc-compare-button', calcCompareButton);
    Vue.component('condition-box', conditionBox);
    Vue.component('excel-download', excelDownload);
    Vue.component('comp-button-box', compButtonBox);
    Vue.component('booking-info-popup', bookingInfoPopup);
    Vue.component('upload-info-popup', uploadInfoPopup);
    Vue.component('tax-info-popup-button', taxInfoPopupButton);
    Vue.component('tavi-cts-mapping', taviCtsMapping);
    Vue.component('pay-request-button', payRequestButton);
    Vue.component('pay-cancel-button', payCancelButton);
    Vue.component('pay-merge-button', payRequestMergeButton);
    Vue.component('booking-lock-button', bookingLockButton);
    Vue.component('booking-unlock-button', bookingUnlockButton);
    Vue.component('upload-delete-button', uploadDeleteButton);
    Vue.component('manager-search-form', managerSearchForm);
    Vue.component('dept-code', deptCode);
    Vue.component('dom-bank-code', domBankCode);
    Vue.component('draft-no', draftNo);
    Vue.component('benefit-close-button', benefitCloseButton);
    Vue.component('benefit-open-button', benefitOpenButton);
    Vue.component('fee-calc-proc-button', feeClacProcButton);
    Vue.component('create-invoice-button', createInvoiceButton);
    Vue.component('send-tax-invoice-mail-button', sendTaxInvoiceMailButton);
    Vue.component('init-tax-invoice-mail-button', initTaxInvoiceMailButton);
    Vue.component('check-tax-invoice-mail-button', checkTaxInvoiceMailButton);
    Vue.component('mng-tax-invoice-mail-button', mngTaxInvoiceMailButton);
  }
};

export {
  frAutoComplete,
  frButton,
  frCalendar,
  frCheckBox,
  frCityNameSuggest,
  frDownloadButton,
  frEditableCell,
  frInputNumber,
  frRadioButton,
  frTableColumn,
  frTableCheckBoxColumn,
  frTable,
  frToggleButton,
  frUploadButton,
  chargeConfirmButton,
  calcCompareButton,
  conditionBox,
  compButtonBox,
  bookingInfoPopup,
  uploadInfoPopup,
  taviCtsMapping,
  payRequestButton,
  payCancelButton,
  payRequestMergeButton,
  bookingLockButton,
  bookingUnlockButton,
  uploadDeleteButton,
  managerSearchForm,
  deptCode,
  domBankCode,
  draftNo,
  benefitCloseButton,
  benefitOpenButton,
  createInvoiceButton,
  sendTaxInvoiceMailButton,
  initTaxInvoiceMailButton,
  checkTaxInvoiceMailButton,
  mngTaxInvoiceMailButton,
  taxInfoPopupButton
};
