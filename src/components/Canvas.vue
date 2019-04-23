<template>
  <div>
    <canvas ref="cvs"/>
    <a ref="download" :href="imgUrl" download="psol.jpg"></a>
  </div>
</template>
<script>
import Filter from "@/assets/js/filter";

export default {
  name: "cvs",
  data() {
    return {
      filter: null,
      ctx: null,
      imgUrl: ""
    };
  },
  computed: {
    list() {
      return this.$store.state.layout.layoutList;
    }
  },
  mounted() {
    this.ctx = this.$refs.cvs.getContext("2d");
    this.filter = new Filter({
      context: this.ctx
    });
  },
  watch: {
    "$store.state.layout.isCallCanvas"() {
      let self = this;
      let state = self.$store.state.layout;
      if (state.isCallCanvas) {
        self.$store.commit("layout/updateCanvasStatus", false);

        // save image
        if (state.filterMethod === "save") {
          let els = document.querySelectorAll('.bg>.cvs');
          self.$refs.cvs.width = state.width;
          self.$refs.cvs.height = state.height;
          for (let n = self.list.length - 1; n >= 0; n--) {
            if (+self.list[n].type === 1) {
              self.ctx.fillStyle = self.list[n].color;
              self.ctx.textBaseline = "middle";
              self.ctx.font = "14px MicroSoft YaHei";
              self.ctx.fillText(
                self.list[n].name,
                // self.list[n].x,
                // self.list[n].y
                els[n].offsetLeft,
                els[n].offsetTop
              );
            } else {
              self.ctx.drawImage(
                self.list[n].obj,
                // self.list[n].x - state.x,
                // self.list[n].y - state.y
                els[n].offsetLeft,
                els[n].offsetTop
              );
            }
          }
          self.imgUrl = self.$refs.cvs.toDataURL("image/png", 1);

          let event = document.createEvent("MouseEvents");
          event.initMouseEvent(
            "click",
            true,
            true,
            document.defaultView,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
          );
          setTimeout(()=>{self.$refs.download.dispatchEvent(event);},500)
          
        } else {
          if (+state.currentLayout.type === 1) {
            // 文本类型不能执行滤镜操作
            return self.$toast("文本类型不能执行滤镜操作");
          }
          let list = self.list.map((item, index) => {
            if (item.id === state.currentId) {
              self.$refs.cvs.width = state.currentLayout.width;
              self.$refs.cvs.height = state.currentLayout.height;
              self.ctx.drawImage(
                state.currentLayout.layout,
                0,
                0,
                state.currentLayout.width,
                state.currentLayout.height
              );
              this.filter[state.filterMethod](
                state.currentLayout.width,
                state.currentLayout.height
              );
              item.base64 = self.$refs.cvs.toDataURL();
              let newImg = new Image();
              newImg.src = item.base64;
              item.obj = newImg;
            }
            return item;
          });
          self.$store.commit("layout/updateLayout", list);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
canvas {
  position: absolute;
  top: 0;
  z-index: -1;
}
</style>



