import {weightingFactor, createMartixArray, weightingFactorValue} from './math';

function Filter(data) {
  if (typeof data.width !== 'number' || typeof data.height !== 'number' || !data.context instanceof Object) {
    throw '参数类型不正确';
  }
  // 上下文

  this.context = data.context;
  this.composite = data.composite;
  this.W = Math.floor(data.width);
  this.H = Math.floor(data.height);
  var img_data = this.imgdata = this.context.getImageData(0, 0, this.W, this.H);
}
Filter.prototype = {
  /*
   * @desc 反相
   */
  reverseColor: function () {
    for (var i = 0; i < this.imgdata.data.length; i += 4) {
      var r = this.imgdata.data[i],
        g = this.imgdata.data[i + 1],
        b = this.imgdata.data[i + 2];

      this.imgdata.data[i] = 255 - r;
      this.imgdata.data[i + 1] = 255 - g;
      this.imgdata.data[i + 2] = 255 - b;
    }
    this.context.clearRect(0, 0, this.W, this.H);
    this.context.putImageData(this.imgdata, 0, 0);
  },
  /*
   * @desc 灰度
   * @param num [1]像素平均值所得灰度 ;[2]像素对比最大值所得灰度 ;[3]加权平均所得灰度（default）
   */
  grayMix: function (num) {
    var n = (!num || isNaN(+num)) ? 3 : num;
    // 灰调
    if (n == 1) {
      // 平均值
      for (var i = 0; i < this.imgdata.data.length; i += 4) {
        var r = this.imgdata.data[i];
        var g = this.imgdata.data[i + 1];
        var b = this.imgdata.data[i + 2];

        var v = parseInt((r + g + b) / 3);
        this.imgdata.data[i] = v;
        this.imgdata.data[i + 1] = v;
        this.imgdata.data[i + 2] = v;
      }
    } else if (n == 2) {
      // 最大值
      for (var i = 0; i < this.imgdata.data.length; i += 4) {
        var r = this.imgdata.data[i];
        var g = this.imgdata.data[i + 1];
        var b = this.imgdata.data[i + 2];

        var v = r > g ? (r > b ? r : b) : (g > b ? g : b);
        this.imgdata.data[i] = v;
        this.imgdata.data[i + 1] = v;
        this.imgdata.data[i + 2] = v;
      }
    } else if (n == 3) {
      // 加权平均值
      for (var i = 0; i < this.imgdata.data.length; i += 4) {
        var r = this.imgdata.data[i];
        var g = this.imgdata.data[i + 1];
        var b = this.imgdata.data[i + 2];

        var v = parseInt(r * 0.3 + g * 0.59 + b * 0.11);
        this.imgdata.data[i] = v;
        this.imgdata.data[i + 1] = v;
        this.imgdata.data[i + 2] = v;
      }
    }

    this.context.clearRect(0, 0, this.W, this.H);
    this.context.putImageData(this.imgdata, 0, 0);
  },
  /*
   * @desc 黑白
   */
  blackWhite: function () {
    // 黑白
    for (var i = 0; i < this.imgdata.data.length; i += 4) {
      var r = this.imgdata.data[i];
      var g = this.imgdata.data[i + 1];
      var b = this.imgdata.data[i + 2];

      var v = (r + g + b) / 3 > 128 ? 255 : 0;
      this.imgdata.data[i] = v;
      this.imgdata.data[i + 1] = v;
      this.imgdata.data[i + 2] = v;
    }
    this.context.clearRect(0, 0, this.W, this.H);
    this.context.putImageData(this.imgdata, 0, 0);
  },
  /*
   * @desc 浮雕(凹面)
   */
  relief: function () {
    // 浮雕(凹面)，若实现凸面再执行反色
    for (var i = 0, j = 4; i < this.imgdata.data.length; i += 4, j += 4) {
      if (j > this.imgdata.data.length) {
        j = this.imgdata.data.length - 4;
      }
      var r = this.imgdata.data[i] - this.imgdata.data[j] + 128;
      var g = this.imgdata.data[i + 1] - this.imgdata.data[j + 1] + 128;
      var b = this.imgdata.data[i + 2] - this.imgdata.data[j + 2] + 128;

      var v = r * 0.3 + g * 0.59 + b * 0.11;
      this.imgdata.data[i] = v;
      this.imgdata.data[i + 1] = v;
      this.imgdata.data[i + 2] = v;


    }
    this.context.clearRect(0, 0, this.W, this.H);
    this.context.putImageData(this.imgdata, 0, 0);
  },
  warmColor: function () {
    // 暖光

  },
  coldColor: function () {
    // 冷光

  },
  /*
   * @desc 高斯模糊
   * @param radius 模糊半径（default：1）
   */
  gaussianBlur: function (R = 1) {
    var pxInfo = this.imgdata.data;   //
    var newImgData = [];                    // 处理后的图像信息
    var weightingfactor = weightingFactor(createMartixArray(R));
    // 遍历行
    for (var rows = 0; rows < this.H; rows++) {
      // 遍历列
      for (var cols = 0; cols < this.W; cols++) {
        var calDataR = [],  // 周围红通道的集合
          calDataG = [],  // 周围绿通道的集合
          calDataB = [],  // 周围蓝通道的集合
          calDataA = [];  // 周围Alpha通道的集合
        // 获取周边像素信息的行
        for (var i = -Math.abs(R); i <= Math.abs(R); i++) {
          if ((rows + i) < 0 || (rows + i) >= this.H) {
            // 若超出行边界，跳过
            continue;
          }
          // 获取周边像素信息的列 
          for (var j = -Math.abs(R); j <= Math.abs(R); j++) {
            if ((cols + j) < 0 || (cols + j) >= this.W) {
              // 若超出列边界，跳过
              continue;
            }
            var index = ((rows + i) * this.W + cols + j) * 4;
            calDataR.push(pxInfo[index]);
            calDataG.push(pxInfo[index + 1]);
            calDataB.push(pxInfo[index + 2]);
            calDataA.push(pxInfo[index + 3]);
          }
        }
        // 计算新像素
        this.imgdata.data[(rows * this.W + cols) * 4] = weightingFactorValue(weightingfactor, calDataR);
        this.imgdata.data[(rows * this.W + cols) * 4 + 1] = weightingFactorValue(weightingfactor, calDataG);
        this.imgdata.data[(rows * this.W + cols) * 4 + 2] = weightingFactorValue(weightingfactor, calDataB);
        this.imgdata.data[(rows * this.W + cols) * 4 + 3] = weightingFactorValue(weightingfactor, calDataA);
      }
    }
    this.context.clearRect(0, 0, this.W, this.H);
    this.context.putImageData(this.imgdata, 0, 0);
  },
  /*
   * @desc 水平翻转
   */
  flipHorizontal: function () {
    var colsLimt = this.W * 4 / 2;
    for (var rows = 0; rows < this.H; rows++) {
      console.log(rows);
      var colsStart = rows * this.W * 4,
        colsEnd = (rows + 1) * this.W * 4 - 4;
      var transferLimit = colsEnd - colsLimt;
      for (; colsStart <= transferLimit; colsStart += 4, colsEnd -= 4) {
        var tr = this.imgdata.data[colsStart],
          tg = this.imgdata.data[colsStart + 1],
          tb = this.imgdata.data[colsStart + 2],
          ta = this.imgdata.data[colsStart + 3];

        this.imgdata.data[colsStart] = this.imgdata.data[colsEnd];
        this.imgdata.data[colsStart + 1] = this.imgdata.data[colsEnd + 1];
        this.imgdata.data[colsStart + 2] = this.imgdata.data[colsEnd + 2];
        this.imgdata.data[colsStart + 3] = this.imgdata.data[colsEnd + 3];

        this.imgdata.data[colsEnd] = tr;
        this.imgdata.data[colsEnd + 1] = tg;
        this.imgdata.data[colsEnd + 2] = tb;
        this.imgdata.data[colsEnd + 3] = ta;
      }
    }
    this.context.clearRect(0, 0, this.W, this.H);
    this.context.putImageData(this.imgdata, 0, 0);
  },
  /*
   * @desc 垂直翻转
   */
  flipVertical: function () {
    var rowsLimit = Math.floor(this.H / 2),
      colsLimt = this.W * 4;
    for (var rows = 0; rows < rowsLimit; rows++) {
      var rowsStart = rows * colsLimt,
        rowsEnd = (this.H - rows - 1) * colsLimt;
      for (; rowsStart < colsLimt * (rows + 1); rowsStart += 4, rowsEnd += 4) {
        var tr = this.imgdata.data[rowsStart],
          tg = this.imgdata.data[rowsStart + 1],
          tb = this.imgdata.data[rowsStart + 2],
          ta = this.imgdata.data[rowsStart + 3];

        this.imgdata.data[rowsStart] = this.imgdata.data[rowsEnd];
        this.imgdata.data[rowsStart + 1] = this.imgdata.data[rowsEnd + 1];
        this.imgdata.data[rowsStart + 2] = this.imgdata.data[rowsEnd + 2];
        this.imgdata.data[rowsStart + 3] = this.imgdata.data[rowsEnd + 3];

        this.imgdata.data[rowsEnd] = tr;
        this.imgdata.data[rowsEnd + 1] = tg;
        this.imgdata.data[rowsEnd + 2] = tb;
        this.imgdata.data[rowsEnd + 3] = ta;
      }
    }
    this.context.clearRect(0, 0, this.W, this.H);
    this.context.putImageData(this.imgdata, 0, 0);
  }
}

export default Filter;