<template>
  <div class="menubar">
    <!-- 文件 -->
    <li>
      <div data-name="title">文件</div>
      <dl class="submenu">
        <!-- <dd @click="build">新建</dd> -->
        <dd>
          <span>打开</span>
          <input class="file" type="file" @change="chooseFile">
        </dd>
        <dd @click="save">保存</dd>
      </dl>
    </li>

    <!-- 图像 -->
    <li>
      <div data-name="title">图像</div>
      <dl class="submenu">
        <dd @click="triggerFilter('reverseColor')">反相</dd>
        <dd @click="triggerFilter('blackWhite')">黑白</dd>
        <dd @click="triggerFilter('grayMix')">灰度</dd>
        <dd @click="triggerFilter('flipHorizontal')">水平翻转</dd>
        <dd @click="triggerFilter('flipVertical')">垂直翻转</dd>
      </dl>
    </li>

    <!-- 滤镜 -->
    <li>
      <div data-name="title">滤镜</div>
      <dl class="submenu">
        <dd @click="triggerFilter('relief')">浮雕</dd>
        <dd @click="triggerFilter('gaussianBlur')">高斯模糊</dd>
      </dl>
    </li>
  </div>
</template>
<script>
import { readFile } from "@/assets/js/readFile";
import filter from "@/assets/js/filter";

var self = {
  name: "menubar",
  data() {
    self = this;
    return {
      list: [],
      currentMenu: "",
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth
    };
  },
  computed: {
    counter() {
      return this.$store.state.layout.counter;
    },
    currentId() {
      return this.$store.state.layout.currentId;
    },
    currentLayout() {
      return this.$store.state.layout.currentLayout;
    }
  },
  methods: {
    chooseFile(e) {
      let file = e.target.files[0];
      readFile(file).then(data => {
        // 生成图像
        let image = new Image();
        image.src = data;
        image.onload = () => {
          // 插入到图层面板
          let imgH = image.height;
          let imgW = image.width;

          self.list.unshift({
            obj: image,
            id: self.counter, // id
            name: file.name, // file name
            base64: data, // image path
            type: 2,
            x: (self.innerWidth - imgW) / 2, // x position
            y: (self.innerHeight - imgH) / 2, // y position
            width: imgW, // width of image
            height: imgH, // height of image
            isShow: true, // if show in viewer
          });

          // update store
          self.$store.commit("layout/updateCounter", self.counter + 1);
          self.$store.commit("layout/updateLayout", self.list);

          if (imgH > self.innerHeight) {
            let zoom = self.innerHeight / imgH;
            self.$store.commit("layout/updateZoom",zoom);
          }
        };
      });
    },
    build() {},
    save() {
      this.$store.commit("layout/updateFilter", "save");
    },
    triggerFilter(method) {
      this.$store.commit("layout/updateFilter", method);
      
    }
  }
};
export default self;
</script>
<style lang="scss" scope>
/* 工具栏 */
.menubar {
  line-height: 32px;
  margin-left: 30px;
  background-color: rgba(50, 50, 50, 0.5);
  display: flex;
  text-align: center;
  position: relative;
  z-index: 11;
  li {
    list-style: none;
    width: 64px;
    height: 30px;
    position: relative;
    color: #fff;
    cursor: pointer;
    font-size: 13px;
    & > div:hover + .submenu {
      display: block;
      z-index: 1;
    }
    & > div[data-name="title"] {
      position: relative;
      z-index: 2;
    }
    &:hover > div {
      background-color: rgb(96, 106, 139);
    }
    .submenu {
      position: absolute;
      top: 30px;
      left: 0;
      line-height: 28px;
      margin: 0;
      padding: 0;
      width: inherit;
      background-color: rgba(50, 50, 50, 0.5);
      font-size: 12px;
      display: none;
      z-index: -1;
      transition: all 0.5s;
      &:hover {
        display: block;
      }
    }
    dd {
      margin: 0;
      padding: 0;
      width: inherit;
      &:hover {
        background-color: #4d4d4d;
      }
    }
    .file {
      position: absolute;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      height: 30px;
    }
  }
}
</style>


