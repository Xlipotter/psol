<template>
  <div v-show="isShowPallet" ref="pallet" class="color_panel">
    <!-- <div class="header">&gt;&gt;</div> -->

    <!-- 色板 -->
    <div
      class="panel_con"
      ref="panelCon"
      @mousemove="colorPanel.unlock?moveOnPanel():''"
      @mouseup="colorPanel.unlock?cancelMoveOnPanel():''"
      @mouseleave="colorPanel.unlock?cancelMoveOnPanel():''"
    >
      <canvas ref="panel" @mousedown="triggerPanel"/>
      <div
        ref="cir"
        class="cir_point"
        :style="`top:${colorPanel.directorY - 2}px;left:${colorPanel.directorX - 2}px`"
      ></div>
    </div>

    <!-- 色域 -->
    <div
      class="range_con"
      ref="rangeCon"
      @mousemove="colorRange.unlock?moveOnRange():''"
      @mouseup="colorRange.unlock?cancelMoveOnRange():''"
      @mouseleave="colorRange.unlock?cancelMoveOnRange():''"
    >
      <canvas ref="range" class="range" @mousedown="triggerRange"/>
      <!-- 色域指示标 -->
      <div class="director" :style="`top:${colorRange.directorY}px`"></div>
    </div>

    <!-- 数据面板 -->
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
        width: 20, // 色域宽度
        height: 256, // 色域高度
        startY: 0, // mousedown 时 Y坐标
        moveY: 0, // mousemove 时 Y坐标
        ctx: null, // canvas上下文
        unlock: false, // 是否解锁 move 事件
        directorY: 10
      },
      colorPanel: {
        width: 256,
        height: 256,
        ctx: null,
        unlock: false,
        startX: 0,
        moveX: 255,
        startY: 0,
        moveY: 0,
        directorX: 255 + 10,
        directorY: 10
      }
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
    },
    isShowPallet() {
      return this.$store.state.layout.isShowPallet;
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
      // let self = this;
      this.colorRange.unlock = true;
      this.colorRange.startY =
        this.$refs.range.offsetTop +
        this.$refs.rangeCon.offsetTop +
        this.$refs.pallet.offsetTop;
    },
    moveOnRange() {
      if (panelUpdatable) {
        window.cancelAnimationFrame(raf);
        let y = window.event.pageY - this.colorRange.startY;
        if (y > 255) {
          y = 255;
        } else if (y < 0) {
          y = 0;
        }
        this.colorRange.moveY = y;
        this.colorRange.directorY = y + 10;
        panelUpdatable = false;
        rangeColor = this.colorRange.ctx.getImageData(
          0,
          this.colorRange.moveY,
          1,
          1
        ).data;
        this.getCurrentColor();
        this.updateColorPanel();
      }
    },
    cancelMoveOnRange() {
      window.cancelAnimationFrame(raf);
      this.colorRange.unlock = false;
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
      this.colorPanel.unlock = true;
      this.colorPanel.startX =
        e.target.offsetLeft +
        this.$refs.panelCon.offsetLeft +
        this.$refs.pallet.offsetLeft;
      this.colorPanel.startY =
        e.target.offsetTop +
        this.$refs.panelCon.offsetTop +
        this.$refs.pallet.offsetTop;
    },
    moveOnPanel() {
      if (colorUpdatable) {
        window.cancelAnimationFrame(raf2);
        colorUpdatable = false;

        let x = window.event.pageX - this.colorPanel.startX;
        let y = window.event.pageY - this.colorPanel.startY;
        
        if (y > 255) {
          y = 255;
        } else if (y < 0) {
          y = 0;
        }
        if (x > 255) {
          x = 255;
        } else if (x < 0) {
          x = 0;
        }

        Object.assign(this.colorPanel, {
          directorX: x + 10,
          directorY: y + 10,
          moveX: x,
          moveY: y
        });

        this.getCurrentColor();
        this.updateColor();
      }
    },
    cancelMoveOnPanel() {
      window.cancelAnimationFrame(raf2);
      this.colorPanel.unlock = false;
    },
    updateColor() {
      let self = this;
      colorUpdatable = true;
      raf2 = window.requestAnimationFrame(self.updateColor);
    },
    getCurrentColor() {
      panelColor = this.colorPanel.ctx.getImageData(
        this.colorPanel.moveX,
        this.colorPanel.moveY,
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

      this.$store.commit("layout/updateFrontColor", this.channel.hex);
    }
  }
};
</script>
<style lang="scss" scoped>
.color_panel {
  .header {
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
  // padding-top: 10px;
  position: absolute;
  right: 0;
  top: 120px;
  z-index: 10;
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
  .range_con {
    padding: 10px 0;
  }
  .panel_con {
    position: relative;
    overflow: hidden;
    margin-right: 5px;
    padding: 10px;
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
  .operator {
    padding-top: 10px;
    padding-right: 10px;
    span {
      -webkit-user-select: none;
      user-select: none;
      -webkit-user-drag: none;
      -webkit-font-smoothing: antialiased;
    }
  }
}
</style>


