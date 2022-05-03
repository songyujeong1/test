# 파라곤 정산 시스템 - 프론트

## 개발도구 - Visual Studio Code

## 확장도구

1. Insert GUID
1. Korean Language Pack for Visual Studio Code
1. Prettier - Code formatter
1. Vetur
1. Beautify
1. ESLint

## 정적분석 도구
[Download SonarScanner](http://paragon.polarium.tech:8090/sonar-scanner.7z)


### Installation
- Expand the downloaded file into the directory of 'c:\sonar-scanner'.
- Add the c:\sonar-scanner\bin directory to your path.

### Use
- Run the following command from the project base directory to launch the analysis:
sonar-scanner

## VUE 설치

``` bash
# 최신 안정화 버전
$ npm install vue

# vue-cli 설치
$ npm install --global vue-cli
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# production depoly build
npm run build prod

```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Production 배포후 새로고침시 NotFound

[Stackoverflow](https://stackoverflow.com/questions/47879936/vue-router-hosting-on-apache2)

## 개발 가이드

## 출력포멧

```javascript
  <template>
  // 숫자 포멧
  {{$n(totalCheckinCount)}}
  // 통화 포멧
  {{$c(totalCheckinCount, monetaryUnit)}}
  // percent
  {{$n(totalCheckinCount, 'percent')}}
  // 날자형식
  {{ $d(noticeDate, 'd') }} -> 년/월/일
  {{ $d(noticeDate, 'G') }} -> 년/월/일 시:분:초
  </template>
```

## 문자열 서식

```javascript
  #Named formatting
  const messages = {
    en: {
      message: {
        hello: '{msg} world'
      }
    }
  }
  <span>{{ $t('message.hello', { msg: 'hello' }) }}</span>

  #List formatting
  const messages = {
    en: {
      message: {
        hello: '{0} world'
      }
    }
  }
  <span>{{ $t('message.hello', ['hello']) }}</span>
```

## 문자열 처리

```javascript
// 지정된 형식에 따른 문자열 변환
{
  {
    stringFormat('ddd{0},{1}', 'a', 'b');
  }
}
```

## 바인딩

```javascript
# 데이타 Two-wey 바인딩
v-model

#엘리먼트 속성 바인딩
<div id="app-2">
  <span v-bind:title="message">
    내 위에 잠시 마우스를 올리면 동적으로 바인딩 된 title을 볼 수 있습니다!
  </span>
</div>
let app2 = new Vue({
  el: '#app-2',
  data: {
    message: '이 페이지는 ' + new Date() + ' 에 로드 되었습니다'
  }
})
```

## 감시된 속성

```javascript
let vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function(val) {
      this.fullName = val + ' ' + this.lastName;
    },
    lastName: function(val) {
      this.fullName = this.firstName + ' ' + val;
    }
  }
});
```

## 메시지 박스

```javascript
messageBoxButton = [ 'Ok' | 'OKCancel' | 'YesNo' | 'YesNoCancel' ]
icon = [ 'success' | 'error' | 'info' | 'warning' ]

messageBox.show(title, message, messageBoxButton, icon)

messageBox.show('알림', 'Hello, Vue.js!', 'YesNoCancel').then((dialog) =>
{
  alert(dialog);
})

messageBox.show('알림', 'Hello, Vue.js!', 'YesNoCancel', 'warning').then((dialog) =>
{
  alert(dialog);
})
```

## RESTful API 서비스 호출

```javascript
this.httpGet('/test', this.blockConfig, {base}).then(result => {
  console.log(result.data);
});
this.httpPost('/test', this.blockConfig).then(result => {
  console.log(result.data);
});
this.httpPut('/test', this.blockConfig).then(result => {
  console.log(result.data);
});
this.httpDelete('/test', this.blockConfig).then(result => {
  console.log(result.data);
});
```

## Vue

```Javascript
# 다음 DOM 업데이트 사이클 이후 실행하는 콜백을 연기합니다. DOM 업데이트를 기다리기 위해 일부 데이터를 변경한 직후 사용해야 합니다.
this.$nextTick(function() {
  this.isAmountByFacility = true;
});
```

## 사용자 정보 조회

```Javascript
userInfo : {
  email: '',
  displayName: '',
  roleCd: '',
  roleNo: '',
  facilityNo: '',
  groupNo: '',
  groupType: ''
}
{{$store.getters.userInfo.email}}
this.$store.getters.userInfo.facilityNo
```

## Script

```javascript
# Json 객체 복사
Object Clone
Object.assign({}, obj);

#지역 변수 선언
let
const

# Sort by price high to low
homes.sort(this.compareBy({
  name : 'price',
  reverse : true,
  primer : parseInt
}));

#Sort by city, case-insensitive, A-Z
homes.sort(this.compareBy({
  name : 'city',
  reverse : false,
  primer : function(a){return a.toUpperCase()}
}));

# sort an array of objects by multiple fields
homes.sort(this.compareBy({
    name : 'isIonicPhoto',
    reverse : true
  },
  {
    name: 'id',
    primer: parseInt,
    reverse: false
  }
));

# array of foreach & filter
const _self = this ;
this.packageList.forEach(function(x) {
  x.roomList = _self.roomList.filterBy(x => x.packageNo, x.packageNo);
});

```

## JSON to Excel for VUE 2

```handlebars
<fr-excelbutton buttonType="primary" size="small" :data="detailList" :fields="exportFields" fileName="finance.xls">
  {{$t('엑셀저장')}}
</fr-excelbutton>
```

```javascript
this.exportFields = {};
this.exportFields['RefNo')] = 'bookingNo' ;
this.exportFields['CheckinDate'] =  {
  field : 'checkinDate',
  callback: (value) => {
    return this.$d(value, 'd')
  }
} ;
this.exportFields['ReservedDate'] = {
  field : 'reservedDate',
  callback: (value) => {
    return this.$d(value, 'd')
  }
};
this.exportFields['정산금액'] = {
  field : 'sellingPrice',
  callback: (value, item) => {
    return this.roomchargeCalculate(item);
  }
};
this.exportFields['숙박요금'] = 'sellingPrice' ;
this.exportFields['추가요금'] = 'additionalFee' ;
this.exportFields['취소 수수료'] = 'cancelFee' ;
```

## element-ui

### el-input
``` handlebars
<!-- <el-input> -->
<!-- 1. Enter Event -->
<el-input v-model="modelName" @keyup.enter.native="eventName" />
```

### el-table

```
<el-table ref="grdCity" :data="cityStatiticsList" height="200" style="width:100%">
  <el-table-column prop="cityName" :label="$l('M0398')" :width="grdRegionColumns.colA" />
  <el-table-column prop="normal" :label="$l('M1794', '총 예약')" :width="grdRegionColumns.colB" />
  <el-table-column prop="normal" :label="$l('M1795', '정상')" :width="grdRegionColumns.colC" />
  <el-table-column prop="cancel" :label="$l('M0030', '취소')" :width="grdRegionColumns.colD"/>
</el-table>
```
```
 mounted() {
    this.calcColumnWidths(this.$refs.grdbyDate, this.grdByDateColumns);
  }
}
```



[가이드](https://kr.vuejs.org/v2/guide/index.html)
