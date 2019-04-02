<template>
  <div class="panel" ref="panel">
    <div class="head" ref="panelHead">面板</div>
    <div class="operation">
      <select name class="mode">
        <option value="0">正常</option>
        <option value="1">正片叠底</option>
        <option value="2">变亮</option>
        <option value="3">变暗</option>
        <option value="4">颜色加深</option>
        <option value="5">颜色减淡</option>
        <option value="6">线性加深</option>
        <option value="7">线性减淡</option>
        <option value="8">深色</option>
        <option value="9">浅色</option>
        <option value="10">叠加</option>
        <option value="11">滤色</option>
        <option value="12">柔光</option>
        <option value="13">强光</option>
        <option value="14">亮光</option>
        <option value="15">点光</option>
        <option value="16">线性光</option>
        <option value="17">实色混合</option>
        <option value="18">差值</option>
        <option value="19">排除</option>
      </select>
    </div>
    <div class="section">
      <li
        v-show="list.length > 0"
        v-for="item in list"
        :key="item.id"
        :class="{selected: item.id===currentId}"
        @click="changeCurrentId(item.id)"
        :id="item.id"
      >
        <div class="img">
          <img :src="item.imgSrc" alt class="layout" :id="item.id">
        </div>

        <div class="context">{{item.name}}</div>
      </li>
    </div>
    <!-- 图像混合 -->
    <!-- 透明度 -->
    <div class="footer">
      <li @click="addLayout">+</li>
      <li @click="deleteLayout">D</li>
    </div>
  </div>
</template>
<script>
import drag from "@/assets/js/drag";
export default {
  name: "layoutpanel",
  computed: {
    list() {
      return this.$store.state.layout.layoutList;
    },
    currentId(){
      return this.$store.state.layout.currentId;
    }
  },
  mounted() {
    drag(this.$refs.panelHead, this.$refs.panel);
  },
  methods: {
    /**
     * @desc change current operating image layout
     */
    changeCurrentId(id) {
      this.$store.commit("layout/updateCurrentId", id);
      
    },
    addLayout() {
      // this.$store.commit('layout/updateLayout', this.$store.state.layout.layoutList.unshift())
    },
    deleteLayout() {
      if (this.currentId === -1) {
        this.$toast('please select the layout first')
      }
      for (let n = 0, l = this.list.length; n < l; n++) {
        if (this.list[n].id === this.currentId) {
          this.list.splice(n, 1);
          break;
        }
      }

      // update layouot
      this.$store.commit("layout/updateLayout", this.list);

      // no selected layout
      this.$store.commit("layout/updateCurrentId", -1);
    }
  }
};
</script>
<style lang="scss">
/* 面板 */
.panel {
  position: absolute;
  z-index: 10;
  right: 0;
  width: 200px;
  height: 420px;
  overflow: auto;
  background-color: #3d3d3d;
  border-radius: 4px;
  .head {
    height: 24px;
    padding-left: 12px;
    line-height: 24px;
    color: #fff;
    font-size: 12px;
    background-color: #333;
  }
  .section li {
    list-style: none;
    /* height: 0px; */
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: flex-start;
    border-bottom: 1px solid #a7a7a7;
    cursor: pointer;
    &.selected {
      background-color: rgba(255, 255, 255, 0.3);
    }
    .img {
      width: 40px;
      height: 40px;
      overflow: hidden;
      box-shadow: 0 0 0 1px #fff;
    }
    .context {
      padding-left: 20px;
      display: flex;
      align-items: center;
      font-size: 13px;
      color: #fff;
    }
  }
  img {
    width: 100%;
    vertical-align: top;
  }
  .operation {
    padding-right: 10px;
    text-align: right;
  }
  .mode {
    margin-top: 4px;
    background-color: #7c7c7c;
    border: none;
    outline: none;
    height: 24px;
    line-height: 24px;
    display: inline-block;
  }
  .footer {
    height: 24px;
    width: 100%;
    border-top: 1px solid #656565;
    display: flex;
    li {
      list-style: none;
      width: 24px;
      height: inherit;
      color: #fff;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: #4d4d4d;
      }
    }
  }
}
</style>
