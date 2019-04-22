<template>
  <div id="app" ref="app">
    <Toolbar />
    <Menubar />
    <LayoutPanel />
    <Statusbar />
    <Layout />
    <ColorPanel />
    <Canvas />
  </div>
</template>

<script>

import Toolbar from "./components/Toolbar.vue";
import Menubar from "./components/Menubar.vue";
import LayoutPanel from "./components/LayoutPanel.vue";
import Statusbar from "./components/Statusbar.vue";
import Layout from "./components/Layout.vue";
import ColorPanel from "./components/ColorPanel.vue";
import Canvas from "./components/Canvas.vue"

export default {
  name: "app",
  components: {
    Toolbar,
    LayoutPanel,
    Statusbar,
    Layout,
    Menubar,
    ColorPanel,
    Canvas
  }
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: "MicroSoft YaHei";
}
* {
  box-sizing: border-box;
}
#app {
  background-color: #5c5c5c;
  // max-width: 1024px;
  height: inherit;
  margin: auto;
  overflow: hidden;
  position: relative;
  font-size: 14px;
}



/* 底部状态栏 */
.footer {
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 0;
  right: 0;
  height: 24px;
  // background-color: rgb(141, 63, 63);
}
.footer .scale {
  width: 80px;
}
.footer .scale input {
  line-height: 24px;
  font-size: 12px;
  height: 24px;
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  text-align: center;
  color: #fff;
  box-shadow: 0 0 0 4px #515151 inset;
}
</style>
