<template>
  <div class="flex-scroll-y" style="padding-right:5px;">
    <h1>
      SamplePage
    </h1>
    <section>
      <div class="panel panel-flat">
        <div class="panel-head">
          <h1 class="panel-title">버튼(Button)</h1>
        </div>
        <div class="list-group-divider"></div>
        <div class="panel-body">
          <div class="m-h-10">
            <fr-button type="R">
              조회
            </fr-button>
            <fr-button type="U">
              수정
            </fr-button>
            <fr-button type="D">
              삭제
            </fr-button>
            <fr-downloadbutton type="E">
              다운로드
            </fr-downloadbutton>
            <fr-button type="R" @click="onHandlePopUpToggle">팝업(Dialog)</fr-button>
            <el-dialog
              title="Tips"
              :visible.sync="isDialogPopUp"
              width="30%"
              :before-close="onHandleClose">
              <span>This is a message</span>
              <span slot="footer" class="dialog-footer">
                <fr-button type="R" @click="onHandlePopUpToggle">Cancel</fr-button>
                <fr-button type="R" @click="onHandlePopUpToggle">Confirm</fr-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="panel panel-flat">
        <div class="panel-head">
          <h1 class="panel-title">조회 조건</h1>
        </div>
        <div class="list-group-divider"></div>
        <div class="panel-body">
          <div class="m-h-10">
            <condition-box :conditions="conditionFix" @retrieve="onHandleRetrieve"/>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="panel panel-flat">
        <div class="panel-head">
          <div class="inblock w-100p">
            <h6 class="fl panel-title p-10">테이블 </h6>
            <div class="fr text-right" style="padding-right:35px;">
              <el-row>
                <fr-button @click="onHandleTmpDataBinding">데이터 조회</fr-button>
              </el-row>
            </div>
          </div>
        </div>
        <div class="list-group-divider"></div>
        <div class="panel-body">
          <div class="m-h-10">
            <el-table :data="tmpData" style="width: 100%" height="500" border="" row-key="idx">
              <el-table-column prop="isChecked" width="55" header-align="center" align="center">
                <template slot-scope="scope">
                 <el-checkbox v-model="scope.row.isChecked"  @change="onHandleRowCheckBoxClick"/>
                </template>
              </el-table-column>
              <el-table-column prop="idx" label="번호" width="150" header-align="center"/>
              <el-table-column prop="name" label="Name" width="120" header-align="center"/>
              <el-table-column prop="addr" label="State" :min-width="100" header-align="center"/>
              <infinite-loading v-if="canUseInfiniteLoading === true" slot="append" @infinite="onHandleInfinite" force-use-infinite-wrapper=".el-table__body-wrapper" />
            </el-table>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="panel panel-flat">
        <div class="panel-head">
          <div class="inblock w-100p">
            <h6 class="fl panel-title p-10">테이블 - 다중 선택</h6>
            <div class="fr text-right" style="padding-right:35px;">
              <el-row>
                <fr-button @click="toggleSelection([tableData[0], tableData[1]])">다중선택</fr-button>
                <fr-button @click="toggleSelection()">선택해제</fr-button>
              </el-row>
            </div>
          </div>
        </div>
        <div class="list-group-divider"></div>
        <div class="panel-body">
          <div class="m-h-10">
            <el-table ref="multipleTable" border :data="tableData" style="width: 100%" height="500" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center"/>
              <el-table-column label="Date" width="120" header-align="center">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column property="name" label="Name" width="120"  header-align="center"/>
              <el-table-column property="address" label="Address" show-overflow-tooltip  header-align="center"/>
            </el-table>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="panel panel-flat">
        <div class="panel-head">
          <h1 class="panel-title">테이블 - 그룹핑 헤드</h1>
        </div>
        <div class="list-group-divider"></div>
        <div class="panel-body">
          <div class="m-h-10">
            <el-table :data="tableData" style="width: 100%" height="500">
              <el-table-column prop="date" label="Date" width="150" header-align="center"/>
              <el-table-column label="Delivery Info" header-align="center">
                <el-table-column prop="name" label="Name" width="120" header-align="center"/>
                <el-table-column label="Address Info" header-align="center">
                </el-table-column>
              </el-table-column>
              <el-table-column label="Delivery Info" header-align="center">
                <el-table-column prop="name" label="Name" width="120" header-align="center"/>
                <el-table-column label="Address Info" header-align="center">
                  <el-table-column prop="state" label="State" width="120" header-align="center"/>
                  <el-table-column prop="city" label="City" width="120" header-align="center"/>
                  <el-table-column prop="address" label="Address" width="300" header-align="center"/>
                  <el-table-column prop="zip" label="Zip" width="120" header-align="center"/>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  data: () => ({
    conditionFix: {
      isCoustom: false,
      type: 'fixed',
      level: 4,
      canUseExpand: true
    },
    conditions: {
      isCoustom: true,
      type: '',
      canUseExpand: false,
      rows: [
        {
          fields: [
            {name: 'sprId', width: 20}
          ]
        },
        {fields: ['localeType', 'dateRange']}
      ]
    },
    isDialogPopUp: false,
    tableData: [{
      date: '2016-05-03',
      name: 'Tom',
      state: 'California',
      city: 'Los Angeles',
      address: 'No. 189, Grove St, Los Angeles',
      zip: 'CA 90036'
    }, {
      date: '2016-05-02',
      name: 'Tom',
      state: 'California',
      city: 'Los Angeles',
      address: 'No. 189, Grove St, Los Angeles',
      zip: 'CA 90036'
    }],
    // tmpData
    isAllSelect: false,
    isAllSelectIndeterminate: false,
    canUseInfiniteLoading: false,
    orgTmpData: [],
    tmpData: [],
    page: 0
  }),
  mounted() {
  },
  methods: {
    onHandleInfinite($state) {
      if ( this.orgTmpData ) {
        const begin = this.page * 50;
        const end = begin + 50;
        const appendList = this.orgTmpData.slice(begin, end);

        if ( appendList < 50 ) {
          $state.complete();
        } else {
          this.tmpData = this.tmpData.concat(appendList);
          this.page += 1;
          $state.loaded();
        }
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onHandlePopUpToggle() {
      this.isDialogPopUp = !this.isDialogPopUp;
    },
    onHandleSave(e) {
      console.log(e);
    },
    onHandleCancel(e) {
      console.log(e);
    },
    onHandleRetrieve(e) {
      alert(JSON.stringify(e.data));
      this.httpGet('/sample/test', e.data).then((res) => {
        console.log(res);
      });
    },
    onHandleClose(e) {
      console.log(e);
    },
    onHandleHeaderCheckBoxClick() {
      this.orgTmpData.forEach((item) => {
        item.isChecked = this.isAllSelect;
      });
      this.isAllSelectIndeterminate = false;
    },
    onHandleRowCheckBoxClick() {
      const checkedCount = this.orgTmpData.filterBy((x) => x.isChecked, true).length;

      if ( this.orgTmpData.length === checkedCount || checkedCount === 0 ) {
        this.isAllSelectIndeterminate = false;
      } else {
        this.isAllSelectIndeterminate = true;
      }
    },
    onHandleTmpDataBinding() {
      const _tmp = [];

      for (let i = 0; i < 10; i++) {
        _tmp.push({
          isChecked: false,
          idx: i,
          name: '홍네임' + i,
          addr: '서울시 강남구 승리빌딩 7층'
        });
      }
      this.orgTmpData = _tmp;
      this.canUseInfiniteLoading = this.orgTmpData && this.orgTmpData.length > 50;
      if ( this.canUseInfiniteLoading === false ) {
        this.tmpData = this.orgTmpData;
      }
    }
  }
};
</script>
