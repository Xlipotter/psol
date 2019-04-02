<template>
  <div ref="bg" class="bg" @mousedown="triggerEvent">
    <canvas
      v-for="item in list"
      v-show="item.isShow"
      :width="item.width"
      :height="item.height"
      :data-obj="item.imgSrc"
      :key="item.id"
      ref="cvs"
      :id="`cvs${item.id}`"
    />
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
      }
    };
  },
  computed: {
    list() {
      return this.$store.state.layout.layoutList;
    },
    currentId() {
      return this.$store.state.layout.currentId;
    },
    isBg(){
      return !this.$store.state.layout.width
    }
  },
  watch: {
    // listen changing current layout
    "$store.state.layout.currentId"() {
      if (this.currentId !== -1) {
        for(let n=0,l=this.list.length;n<l;n++){
          if(this.list[n].id === this.currentId){
            let num = l - n - 1
            this.$store.commit('layout/updateCurrentLayout', {
              layout: this.$refs.cvs[num],
              width: this.$refs.cvs[num].width,
              height: this.$refs.cvs[num].height
            })
            break;
          }
        }

        
      }
    }
  },
  updated(data) {
    if (this.isBg) {
      let layout = this.list[0];
      this.$refs.bg.style.width = `${layout.width}px`;
      this.$refs.bg.style.height = `${layout.height}px`;
      this.$refs.bg.style.top = `${layout.y}px`;
      this.$refs.bg.style.left = `${layout.x}px`;

      // update source canvas infomation
      this.$store.commit("layout/updateCanvasInfo", {
        width: layout.width,
        height: layout.height
      });

      // update current layout
      this.$store.commit('layout/updateCurrentLayout', {
        layout: this.$refs.cvs[0],
        width: layout.width,
        height: layout.height
      })
    }
    // this.$nextTick(() => {
    this.$refs.cvs.forEach((item, index) => {
      let ctx = item.getContext("2d");
      let img = new Image();
      item.style.zIndex = parseInt(index);
      img.src = item.dataset.obj;
      ctx.drawImage(img, 0, 0, item.width, item.height);
      delete item.dataset.obj;
    });

    // });
  },
  methods: {
    triggerEvent(e){
      switch(this.$store.state.layout.operation){
        case 'move':
          drag(this.$refs.bg, this.$store.state.layout.currentLayout.layout,e.pageX, e.pageY);
        break
      }
    }
  }
};
</script>
<style lang="scss" scoped>
canvas {
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
}
</style>
