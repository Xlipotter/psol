<template>
  <div class="toolbar">
    <!-- 工具 -->
    <li
      v-for="item in toolList"
      :key="item.id"
      :class="[item.type, item.id===activeId && 'active']"
      :title="item.title"
      @click="changeTool(item)"
    ></li>

    <!-- 前景色 -->
    <li class="singht" :style="`background-color:${frontColor};`" title="前景色" @click="triggerPallet"></li>
  </div>
</template>
<script>
export default {
  name: "toolbar",
  data() {
    return {
      activeId: 0,
      toolList: [
        {
          title: '移动工具',
          type: "move",
          id: 1
        },
        {
          title: '选区工具',
          type: "choose",
          id: 2
        },
        {
          title: '裁剪工具',
          type: "clip",
          id: 3
        },
        {
          title: '橡皮擦',
          type: "eraser",
          id: 4
        },
        {
          title: '画笔',
          type: "draw",
          id: 5
        },
        {
          title: '文本',
          type: "text",
          id: 6
        }
      ]
    };
  },
  computed: {
    frontColor() {
      return this.$store.state.layout.frontColor;
    }
  },
  methods: {
    changeTool(item) {
      let type;
      if (this.activeId === item.id) {
        type = "";
        this.activeId = -1;
      } else {
        type = item.type;
        this.activeId = item.id;
      }

      this.$store.commit("layout/updateOperation", type);
    },
    triggerPallet(){
      this.$store.commit("layout/updatePalletStatus")
    }
  }
};
</script>
<style lang="scss" scoped>
.toolbar {
  width: 30px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background-color: rgb(75, 74, 74);
  position: absolute;
  padding-top: 10px;
  li {
    cursor: pointer;
    list-style: none;
    margin-left: auto;
    margin-right: auto;
    width: 20px;
    height: 20px;
    margin-bottom: 10px;
    border-radius: 2px;
    &:not(.singht):hover,
    &.active {
      background-color: rgb(116, 115, 115);
    }
    &.move {
      background-image: url(../assets/images/move.png);
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-size: 18px 18px;
    }
    &.choose {
      background-image: url(../assets/images/choose.png);
      background-size: contain;
    }
    &.clip {
      background-image: url(../assets/images/clip.png);
      background-size: contain;
    }
    &.eraser {
      background-image: url(../assets/images/eraser.png);
      background-size: contain;
    }
    &.draw {
      background-image: url(../assets/images/furpen.png);
      background-size: contain;
    }
    &.text {
      background-image: url(../assets/images/text.png);
      background-size: contain;
    }
  }
  .singht {
    width: 20px;
    height: 20px;
  }
}
</style>
