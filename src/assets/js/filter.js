import m from './math';
let {weightingFactor, createMartixArray, weightingFactorValue} = m;

function Filter(data) {
  if (!data.context instanceof Object) {
    throw '参数类型不正确';
  }
  // 上下文

  this.context = data.context;
  this.composite = data.composite;
  // this.W = Math.floor(data.width);
  // this.H = Math.floor(data.height);
  // this.imgdata = this.context.getImageData(0, 0, this.W, this.H);
  // this.imgdata = null
}
Filter.prototype = {
  /*
   * @desc 反相
   */
  reverseColor: function (w, h) {
    let imgdata = this.context.getImageData(0, 0, w, h);
    for (var i = 0; i < imgdata.data.length; i += 4) {
      var r = imgdata.data[i],
        g = imgdata.data[i + 1],
        b = imgdata.data[i + 2];

      imgdata.data[i] = 255 - r;
      imgdata.data[i + 1] = 255 - g;
      imgdata.data[i + 2] = 255 - b;
    }
    this.context.clearRect(0, 0, w, h);
    this.context.putImageData(imgdata, 0, 0);
  },
  /*
   * @desc 灰度
   * @param num [1]像素平均值所得灰度 ;[2]像素对比最大值所得灰度 ;[3]加权平均所得灰度（default）
   */
  grayMix: function (w,h,num) {
    let imgdata = this.context.getImageData(0, 0, w, h);
    var n = (!num || isNaN(+num)) ? 3 : num;
    // 灰调
    if (n == 1) {
      // 平均值
      for (var i = 0; i < imgdata.data.length; i += 4) {
        var r = imgdata.data[i];
        var g = imgdata.data[i + 1];
        var b = imgdata.data[i + 2];

        var v = parseInt((r + g + b) / 3);
        imgdata.data[i] = v;
        imgdata.data[i + 1] = v;
        imgdata.data[i + 2] = v;
      }
    } else if (n == 2) {
      // 最大值
      for (var i = 0; i < imgdata.data.length; i += 4) {
        var r = imgdata.data[i];
        var g = imgdata.data[i + 1];
        var b = imgdata.data[i + 2];

        var v = r > g ? (r > b ? r : b) : (g > b ? g : b);
        imgdata.data[i] = v;
        imgdata.data[i + 1] = v;
        imgdata.data[i + 2] = v;
      }
    } else if (n == 3) {
      // 加权平均值
      for (var i = 0; i < imgdata.data.length; i += 4) {
        var r = imgdata.data[i];
        var g = imgdata.data[i + 1];
        var b = imgdata.data[i + 2];

        var v = parseInt(r * 0.3 + g * 0.59 + b * 0.11);
        imgdata.data[i] = v;
        imgdata.data[i + 1] = v;
        imgdata.data[i + 2] = v;
      }
    }

    this.context.clearRect(0, 0, w, h);
    this.context.putImageData(imgdata, 0, 0);
  },
  /*
   * @desc 黑白
   */
  blackWhite: function (w,h) {
    // 黑白
    let imgdata = this.context.getImageData(0, 0, w, h);
    for (var i = 0; i < imgdata.data.length; i += 4) {
      var r = imgdata.data[i];
      var g = imgdata.data[i + 1];
      var b = imgdata.data[i + 2];

      var v = (r + g + b) / 3 > 128 ? 255 : 0;
      imgdata.data[i] = v;
      imgdata.data[i + 1] = v;
      imgdata.data[i + 2] = v;
    }
    this.context.clearRect(0, 0, w, h);
    this.context.putImageData(imgdata, 0, 0);
  },
  /*
   * @desc 浮雕(凹面)
   */
  relief: function (w,h) {
    let imgdata = this.context.getImageData(0, 0, w, h);
    // 浮雕(凹面)，若实现凸面再执行反色
    for (var i = 0, j = 4; i < imgdata.data.length; i += 4, j += 4) {
      if (j > imgdata.data.length) {
        j = imgdata.data.length - 4;
      }
      var r = imgdata.data[i] - imgdata.data[j] + 128;
      var g = imgdata.data[i + 1] - imgdata.data[j + 1] + 128;
      var b = imgdata.data[i + 2] - imgdata.data[j + 2] + 128;

      var v = r * 0.3 + g * 0.59 + b * 0.11;
      imgdata.data[i] = v;
      imgdata.data[i + 1] = v;
      imgdata.data[i + 2] = v;


    }
    this.context.clearRect(0, 0, w, h);
    this.context.putImageData(imgdata, 0, 0);
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
  gaussianBlur: function (w,h,R = 1) {
    let imgdata = this.context.getImageData(0, 0, w, h);
    var pxInfo = imgdata.data;   //
    var newImgData = [];                    // 处理后的图像信息
    var weightingfactor = weightingFactor(createMartixArray(R));
    // 遍历行
    for (var rows = 0; rows < h; rows++) {
      // 遍历列
      for (var cols = 0; cols < w; cols++) {
        var calDataR = [],  // 周围红通道的集合
          calDataG = [],  // 周围绿通道的集合
          calDataB = [],  // 周围蓝通道的集合
          calDataA = [];  // 周围Alpha通道的集合
        // 获取周边像素信息的行
        for (var i = -Math.abs(R); i <= Math.abs(R); i++) {
          if ((rows + i) < 0 || (rows + i) >= h) {
            // 若超出行边界，跳过
            continue;
          }
          // 获取周边像素信息的列 
          for (var j = -Math.abs(R); j <= Math.abs(R); j++) {
            if ((cols + j) < 0 || (cols + j) >= w) {
              // 若超出列边界，跳过
              continue;
            }
            var index = ((rows + i) * w + cols + j) * 4;
            calDataR.push(pxInfo[index]);
            calDataG.push(pxInfo[index + 1]);
            calDataB.push(pxInfo[index + 2]);
            calDataA.push(pxInfo[index + 3]);
          }
        }
        // 计算新像素
        imgdata.data[(rows * w + cols) * 4] = weightingFactorValue(weightingfactor, calDataR);
        imgdata.data[(rows * w + cols) * 4 + 1] = weightingFactorValue(weightingfactor, calDataG);
        imgdata.data[(rows * w + cols) * 4 + 2] = weightingFactorValue(weightingfactor, calDataB);
        imgdata.data[(rows * w + cols) * 4 + 3] = weightingFactorValue(weightingfactor, calDataA);
      }
    }
    this.context.clearRect(0, 0, w, h);
    this.context.putImageData(imgdata, 0, 0);
  },
  /*
   * @desc 水平翻转
   */
  flipHorizontal: function (w,h) {
    let imgdata = this.context.getImageData(0, 0, w, h);
    var colsLimt = w * 4 / 2;
    for (var rows = 0; rows < h; rows++) {
      var colsStart = rows * w * 4,
        colsEnd = (rows + 1) * w * 4 - 4;
      var transferLimit = colsEnd - colsLimt;
      for (; colsStart <= transferLimit; colsStart += 4, colsEnd -= 4) {
        var tr = imgdata.data[colsStart],
          tg = imgdata.data[colsStart + 1],
          tb = imgdata.data[colsStart + 2],
          ta = imgdata.data[colsStart + 3];

        imgdata.data[colsStart] = imgdata.data[colsEnd];
        imgdata.data[colsStart + 1] = imgdata.data[colsEnd + 1];
        imgdata.data[colsStart + 2] = imgdata.data[colsEnd + 2];
        imgdata.data[colsStart + 3] = imgdata.data[colsEnd + 3];

        imgdata.data[colsEnd] = tr;
        imgdata.data[colsEnd + 1] = tg;
        imgdata.data[colsEnd + 2] = tb;
        imgdata.data[colsEnd + 3] = ta;
      }
    }
    this.context.clearRect(0, 0, w, h);
    this.context.putImageData(imgdata, 0, 0);
  },
  /*
   * @desc 垂直翻转
   */
  flipVertical: function () {
    let imgdata = this.context.getImageData(0, 0, w, h);
    var rowsLimit = Math.floor(h / 2),
      colsLimt = w * 4;
    for (var rows = 0; rows < rowsLimit; rows++) {
      var rowsStart = rows * colsLimt,
        rowsEnd = (h - rows - 1) * colsLimt;
      for (; rowsStart < colsLimt * (rows + 1); rowsStart += 4, rowsEnd += 4) {
        var tr = imgdata.data[rowsStart],
          tg = imgdata.data[rowsStart + 1],
          tb = imgdata.data[rowsStart + 2],
          ta = imgdata.data[rowsStart + 3];

        imgdata.data[rowsStart] = imgdata.data[rowsEnd];
        imgdata.data[rowsStart + 1] = imgdata.data[rowsEnd + 1];
        imgdata.data[rowsStart + 2] = imgdata.data[rowsEnd + 2];
        imgdata.data[rowsStart + 3] = imgdata.data[rowsEnd + 3];

        imgdata.data[rowsEnd] = tr;
        imgdata.data[rowsEnd + 1] = tg;
        imgdata.data[rowsEnd + 2] = tb;
        imgdata.data[rowsEnd + 3] = ta;
      }
    }
    this.context.clearRect(0, 0, w, h);
    this.context.putImageData(imgdata, 0, 0);
  }
}

export default Filter;