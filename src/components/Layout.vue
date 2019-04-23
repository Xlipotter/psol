<template>
  <div ref="bg" class="bg" :style="`transform:scale(${zoom},${zoom})`" @mousedown="triggerEvent">
    <input
      v-show="isShowTexting"
      v-model="content"
      ref="texter"
      type="text"
      :style="`top:${posY}px;left:${posX}px;color:${color}`"
      @blur="$refs.texter.focus()"
    >
    <template v-for="(item,index) in list">
      <img
        v-if="+item.type===2"
        :key="item.id"
        :data-type="item.type"
        :src="item.base64"
        :width="item.width"
        :height="item.height"
        :style="`z-index:${10000-index}`"
        ref="cvs"
        class="cvs"
      >
      <div 
        v-else-if="+item.type===1" 
        :key="item.id"
        :data-type="item.type"
        class="text cvs"
        :style="`z-index:${10000-index};top:${item.y}px;left:${item.x}px;color:${item.color}`"
        ref="cvs"
      >
        {{item.name}}
      </div>
    </template>
  </div>
</template>
<script>
import drag from "../assets/js/drag";

export default {
  name: "layout",
  data() {
    return {
      container: {
        width: 0,
        height: 0
      },
      content: "",
      posX: 0,
      posY: 0
    };
  },
  computed: {
    list() {
      return this.$store.state.layout.layoutList;
    },
    currentId() {
      return this.$store.state.layout.currentId;
    },
    isBg() {
      return !this.$store.state.layout.width;
    },
    zoom() {
      return this.$store.state.layout.zoom;
    },
    isShowTexting() {
      return this.$store.state.layout.operation === "text" ? true : false;
    },
    color() {
      return this.$store.state.layout.frontColor;
    }
  },
  watch: {
    // listen changing current layout
    "$store.state.layout.currentId"() {
      if (this.currentId !== -1) {
        for (let n = 0, l = this.list.length; n < l; n++) {
          if (this.list[n].id === this.currentId) {
            let num = l - n - 1;
            this.$store.commit("layout/updateCurrentLayout", {
              layout: this.$refs.cvs[num],
              width: this.$refs.cvs[num].width,
              height: this.$refs.cvs[num].height,
              type: this.$refs.cvs[num].dataset.type
            });
            break;
          }
        }
      }
    },
    // listen changing hide texter
    isShowTexting() {
      if (!this.isShowTexting && this.content !== "") {
        let index = this.$store.state.layout.logicIndex;
        this.list.splice(index - 1, 0, {
          id: Date.now(),
          name: this.content, // file name
          x: this.posX,
          y: this.posY,
          color: this.color,
          isShow: true, // if show in viewer
          type: 1
        });
        this.content = "";
      }
    }
  },
  updated(data) {
    this.$nextTick(() => {
      if (this.isBg) {
        let layout = this.list[0];
        this.$refs.bg.style.width = `${layout.width}px`;
        this.$refs.bg.style.height = `${layout.height}px`;
        this.$refs.bg.style.top = `${layout.y}px`;
        this.$refs.bg.style.left = `${layout.x}px`;
        // update source canvas infomation
        this.$store.commit("layout/updateCanvasInfo", {
          width: layout.width,
          height: layout.height,
          x: layout.x,
          y: layout.y
        });
        // update current layout
        this.$store.commit("layout/updateCurrentLayout", {
          layout: this.$refs.cvs[0],
          width: layout.width,
          height: layout.height,
          type: 2
        });
      }
    });
  },
  methods: {
    triggerEvent(e) {
      switch (this.$store.state.layout.operation) {
        case "move":
          drag(
            this.$refs.bg,
            this.$store.state.layout.currentLayout.layout,
            e.pageX,
            e.pageY
          );
          break;
        case "text":
          this.posX = e.pageX - this.$refs.bg.offsetLeft;
          this.posY = e.pageY - this.$refs.bg.offsetTop;
          this.$refs.texter.focus();
          break;
      }
    },
    showInput() {}
  }
};
</script>
<style lang="scss" scoped>
img {
  position: absolute;
}
.bg {
  overflow: hidden;
  position: absolute;
  background-image: linear-gradient(
      45deg,
      rgba(180, 180, 180, 0.5) 25%,
      transparent 0
    ),
    linear-gradient(-135deg, rgba(180, 180, 180, 0.5) 25%, transparent 0),
    linear-gradient(45deg, rgba(180, 180, 180, 0.5) 25%, transparent 0),
    linear-gradient(-135deg, rgba(180, 180, 180, 0.5) 25%, transparent 0);
  background-size: 30px 30px;
  background-position: 0 0, 15px 15px, 15px 15px, 30px 30px;
  input {
    position: absolute;
    z-index: 99999;
    background-color: transparent;
    outline: none;
    border: none;
    caret-color: #000;
    font-size: 14px;
    font-family: "MicroSoft YaHei";
  }
  .text{
    position: absolute;
  }
}
</style>
