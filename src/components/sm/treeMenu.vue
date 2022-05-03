<template>
<table class="table-summary">
  <colgroup>
    <col />
    <col style="width:200px;"/>
  </colgroup>
  <thead>
    <tr>
      <th>
        메뉴명
      </th>
      <th>
        권한
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2">
        <div class="el-tree-grid">
          <el-tree
            ref="elTree"
            :data="data"
            node-key="menuNo"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="custom-tree-content-area" @click="onHandleNodeClick">{{data.menuName}}</span>
              <tree-menu-item :data="data" @click="onHandlePermissionClick"/>
            </span>
          </el-tree>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</template>

<script>
import treeMenuItem from './treeMenuItem';

export default {
  name: 'treeMenu',
  components: {
    treeMenuItem
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
    };
  },
  computed: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    onHandleNodeClick() {
      const currentNode = this.$refs.elTree.getCurrentNode();
      console.log(currentNode);
    },

    bottomUpSetup(item) {
      if ( item ) {
        const childCount = item.children.length;
        let readCount = 0;
        let writeCount = 0;

        item.children.forEach(function (child) {
          readCount += (child.readYn === 'Y' ? 1 : 0);
          writeCount += (child.writeYn === 'Y' ? 1 : 0);
        });

        let tmp = {
          dummy: item.dummy,
          readYn: item.readYn,
          writeYn: item.writeYn
        };

        if (readCount > 0) {
          Object.assign(tmp, {dummy: 'N', readYn: 'Y'});
        } else {
          Object.assign(tmp, {dummy: 'Y', readYn: 'N'});
        }

        if (childCount === writeCount) {
          Object.assign(tmp, {dummy: 'N', readYn: 'N', writeYn: 'Y'});
        } else if ( readCount > 0 || writeCount > 0) {
          Object.assign(tmp, {dummy: 'N', readYn: 'Y', writeYn: 'N'});
        } else {
          Object.assign(tmp, {writeYn: 'N'});
        }

        Object.assign(item, tmp);

        const parent = this.data.findBy(x => x.menuNo, item.parentMenuNo);

        this.bottomUpSetup(parent);
      }
    },
    topDownSetup(item) {
      if ( item.children ) {
        item.children.forEach(child => {
          Object.assign(child, {dummy: item.dummy, readYn: item.readYn, writeYn: item.writeYn});
          this.topDownSetup(child);
        });
      }
    },
    onHandlePermissionClick(e) {
      this.topDownSetup(e.data);

      const parent = this.data.findBy(x => x.menuNo, e.data.parentMenuNo);

      this.bottomUpSetup(parent);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
