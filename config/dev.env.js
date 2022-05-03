'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SYSTEM: '""',
  CLARE_API_URL : "'http://localhost:9091'",
  ADMIN_API_URL : "'http://dparagon.tidesquare.com/jsp/main.jsp'",
  TAVIS_API_URL : "'https://dtavibe.tidesquare.com'",
  ENCKEY: "'clare@polarium.co.kr'",
  TITLE: "'TOACT 정산 - 개발'",
  FAVICON: "'/static/icon/favicon.ico'",
  PARAGON_POPUP_URL : "'http://dparagon.tidesquare.com/jsp/booking/newbookingMastPopup.jsp'",
  TAVI_POPUP_URL : "'https://dtavi.tidesquare.com/bookingmanagement/reserveManagement'"
})
