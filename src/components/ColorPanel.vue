<template>
  <div ref="panelCon" class="color_panel">
    <div class="header">&gt;&gt;</div>
    <div class="panel_con" @mousedown="triggerPanel">
      <canvas ref="panel"/>
      <div ref="cir" class="cir_point" :style="`top:${panelPoint.y - 2}px;left:${panelPoint.x - 2}px`"></div>
    </div>
    <canvas ref="range" class="range" @mousedown="triggerRange"/>

    <div class="operator">
      <li>
        <span>R:&emsp;</span>
        <input v-model="channel.r" type="text" readonly>
      </li>
      <li>
        <span>G:&emsp;</span>
        <input v-model="channel.g" type="text" readonly>
      </li>
      <li>
        <span>B:&emsp;</span>
        <input v-model="channel.b" type="text" readonly>
      </li>
      <li>
        <span>Hex:&emsp;</span>
        <input v-model="channel.hex" type="text" readonly>
      </li>
    </div>
    <div class="director" :style="`top:${directorY}px`"></div>
    <div class="head"></div>
  </div>
</template>
<script>
const randomInArr = (num, total) => {
  let arr = [];
  arr.length = total;
  if (total % num === 0) {
    let ran = total / num;
    for (let n = 0, l = arr.length; n < l; n++) {
      if (n % ran === 0) {
        arr[n] = 1;
      } else {
        arr[n] = 0;
      }
    }
  } else {
    let val = Math.ceil((num / total) * 100) / 100;
    for (let n = 1, l = arr.length; n < l; n++) {
      arr[n] = val;
    }
    arr[0] = 0;
  }
  return arr;
};
var colorUpdatable = true;
var panelUpdatable = true;
var raf;
var raf2;
var rangeColor;
var panelColor;

export default {
  name: "colorpanel",
  data() {
    return {
      colorRange: {
        width: 20,
        height: 256,
        startY: 0,
        moveY: 0,
        ctx: null
      },
      colorPanel: {
        width: 256,
        height: 256,
        ctx: null
      },
      directorY: 10,
      panelPoint: { x: 255, y: 0 }
    };
  },
  computed: {
    channel() {
      return {
        r: "255",
        g: "0",
        b: "0",
        hex: "ff0000"
      };
    }
  },
  mounted() {
    this.$refs.range.width = this.colorRange.width;
    this.$refs.range.height = this.colorRange.height;
    this.$refs.panel.width = this.colorPanel.width;
    this.$refs.panel.height = this.colorPanel.height;

    this.colorRange.ctx = this.$refs.range.getContext("2d");
    this.colorPanel.ctx = this.$refs.panel.getContext("2d");

    this.createColorRange(this.colorRange.ctx);
    this.createColorPanel(this.colorPanel.ctx);
  },
  methods: {
    createColorRange(ctx = this.colorRange.ctx) {
      let segment = 6;
      let range = Math.ceil(this.colorRange.height / segment);
      let r, g, b;
      let lineWidth = 1;
      for (let i = 0; i < this.colorRange.height; i++) {
        if (i <= range) {
          // 红到紫 ff0000 → ff00ff
          r = 255;
          g = 0;
          b = Math.min(255, i * segment);
        } else if (i <= range * 2) {
          // 紫到蓝 ff00ff → 0000ff
          r = 255 - Math.floor((i - range) * segment);
          g = 0;
          b = 255;
        } else if (i <= range * 3) {
          // 蓝到青 0000ff → 00ffff
          r = 0;
          g = Math.min(255, Math.floor((i - range * 2) * segment));
          b = 255;
        } else if (i <= range * 4) {
          // 青到绿 00ffff → 00ff00
          r = 0;
          g = 255;
          b = 255 - Math.floor((i - range * 3) * segment);
        } else if (i <= range * 5) {
          // 绿到黄 00ff00 → ffff00
          r = Math.min(255, Math.floor((i - range * 4) * segment));
          g = 255;
          b = 0;
        } else {
          // 黄到红 ffff00 → ff0000
          r = 255;
          g = 255 - Math.min(255, Math.floor((i - range * 5) * segment));
          b = 0;
        }
        let color = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillStyle = color;
        ctx.fillRect(0, i, this.colorRange.width, 1);
      }
    },
    /*
     * @desc 生成颜色面板
     *
     */
    createColorPanel({ ctx = this.colorPanel.ctx, color = "ff0000" } = {}) {
      let imageData = ctx.createImageData(
        this.colorPanel.width,
        this.colorPanel.height
      );
      let r, g, b;
      if (typeof color === "object" && color.length === 4) {
        r = color[0]; // 选择的颜色10进制值
        g = color[1];
        b = color[2];
      }

      if (typeof color === "string" && color.length === 6) {
        r = parseInt("0x" + color.substr(0, 2)); // 选择的颜色10进制值
        g = parseInt("0x" + color.substr(2, 2));
        b = parseInt("0x" + color.substr(4));
      }

      let posX,
        posY,
        posA = 3,
        posN; // 当前通道位置
      let startX, startY; //
      let rowArrX = [],
        rowArrY = [];
      let endX, endY;
      let colArrX = [],
        colArrY = [];
      let start;
      let colLen = this.colorPanel.width * 4;
      rowArrX.length = rowArrY.length = colArrX.length = colArrY.length = 256;

      // 代入取值非255的两个通道
      let x, y;
      if (r === 255) {
        x = g;
        y = b;
        posX = 1;
        posY = 2;
        posN = 0;
      } else if (g === 255) {
        x = r;
        y = b;
        posX = 0;
        posY = 2;
        posN = 1;
      } else if (b === 255) {
        x = r;
        y = g;
        posX = 0;
        posY = 1;
        posN = 2;
      }
      endX = x;
      endY = y;

      for (let r = 0, lr = this.colorPanel.height; r < lr; r++) {
        // 每行的开始值,第一列从上而下按 1 递减
        startX = startY = 255 - r;

        // 最后一列从上而下的概率均匀分布数组
        rowArrX = randomInArr(x, 256);
        rowArrY = randomInArr(y, 256);

        // 每行的结束值，最后一列从上而下按概率均居分布数据递减
        endX -= rowArrX[r];
        endY -= rowArrY[r];

        // 每一行从左而右的概率均匀分布数组
        colArrX = randomInArr(Math.abs(startX - endX), 256);
        colArrY = randomInArr(Math.abs(startY - endY), 256);

        //
        start = r * colLen;

        for (let c = 0, i = 0; c < colLen; c += 4, i++) {
          startX -= colArrX[i];
          startY -= colArrY[i];
          imageData.data[start + c + posX] = Math.floor(startX);
          imageData.data[start + c + posY] = Math.floor(startY);
          imageData.data[start + c + posN] = 255 - r;
          imageData.data[start + c + posA] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    },

    triggerRange(e) {
      let self = this;
      let startY = e.target.offsetTop + e.target.parentNode.offsetTop;
      let moveY;
      let el = e.target;
      const mouseMove = () => {
        if (panelUpdatable) {
          window.cancelAnimationFrame(raf);
          let posY = Math.max(0, window.event.pageY - startY);
          self.directorY = posY + 10;
          let data = self.colorRange.ctx.getImageData(0, posY, 1, 1);
          panelUpdatable = false;
          rangeColor = data.data;
          self.getCurrentColor()
          self.updateColorPanel();
        }
      };
      el.addEventListener("mousemove", mouseMove);
      el.addEventListener("mouseleave", () => {
        window.cancelAnimationFrame(raf);
        el.removeEventListener("mousemove", mouseMove);
      });
      el.addEventListener("mouseup", () => {
        window.cancelAnimationFrame(raf);
        el.removeEventListener("mousemove", mouseMove);
      });
    },
    updateColorPanel() {
      let self = this;
      self.createColorPanel({ color: rangeColor });
      self.getCurrentColor();
      panelUpdatable = true;
      raf = window.requestAnimationFrame(() => {
        self.updateColorPanel({ color: rangeColor });
      });
    },

    triggerPanel(e) {
      let self = this;
      let startX =
        e.target.parentNode.offsetLeft +
        e.target.parentNode.parentNode.offsetLeft;
      let startY =
        e.target.parentNode.offsetTop +
        e.target.parentNode.parentNode.offsetTop;
      let moveY, moveX;
      let el = e.currentTarget;
      const mouseMove = () => {
        if (colorUpdatable) {
          window.cancelAnimationFrame(raf2);
          colorUpdatable = false;

          let posX = Math.max(0, window.event.pageX - startX);
          let posY = Math.max(0, window.event.pageY - startY);

          Object.assign(self.panelPoint, {
            x: posX,
            y: posY
          });

          self.getCurrentColor();

          self.updateColor();
        }
      };
      el.addEventListener("mousemove", mouseMove);
      el.addEventListener("mouseleave", () => {
        window.cancelAnimationFrame(raf2);
        el.removeEventListener("mousemove", mouseMove);
      });
      el.addEventListener("mouseup", () => {
        window.cancelAnimationFrame(raf2);
        el.removeEventListener("mousemove", mouseMove);
      });
    },
    updateColor() {
      let self = this;
      colorUpdatable = true;
      raf2 = window.requestAnimationFrame(self.updateColor);
    },
    getCurrentColor() {
      panelColor = this.colorPanel.ctx.getImageData(
        this.panelPoint.x,
        this.panelPoint.y,
        1,
        1
      ).data;

      let hexList = [];
      panelColor.forEach((item, index) => {
        if (index < 3) {
          hexList.push(item < 16 ? `0${item.toString(16)}` : item.toString(16));
        }
      });

      Object.assign(this.channel, {
        r: panelColor[0],
        g: panelColor[1],
        b: panelColor[2],
        hex: `#${hexList.join("")}`
      });

      this.$store.commit('layout/updateFrontColor', this.channel.hex)
    }
  }
};
</script>
<style lang="scss" scoped>
.color_panel {
  .header{
    background-image: linear-gradient(0deg, #3c3c3c, #414141, #3c3c3c);
    text-align: right;
    color: #fff;
    line-height: 20px;
    width: 100%;
    position: absolute;
    top: -20px;
    left: 0;
  }
  background-color: #4d4d4d;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  position: absolute;
  right: 0;
  top: 120px;
  z-index: 10;
  .panel_con,
  .range {
    margin-right: 15px;
  }
  canvas {
    vertical-align: top;
    height: 256px;
  }
  li {
    list-style: none;
    display: flex;
    margin-bottom: 20px;
    justify-content: flex-end;
    line-height: 32px;
    span {
      margin-right: 10px;
    }
    input {
      height: 32px;

      border: none;
      background-color: #fff;
      border-radius: 4px;
      outline: none;
      width: 80px;
      text-indent: 12px;
    }
  }
  .director {
    width: 7px;
    height: 7px;
    background-image: linear-gradient(45deg, #fff 50%, transparent 0);
    transform: rotate(45deg) translateY(-3px);
    position: absolute;
    left: 306px;
    top: 10px;
  }
  .panel_con {
    position: relative;
    overflow: hidden;
    .cir_point {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      box-shadow: 0 0 0 1px #fff;
      position: absolute;
      z-index: 2;
      top: -2px;
      left: 254px;
    }
  }
}
</style>


