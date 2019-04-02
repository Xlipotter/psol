const readFile = (file) => {
  var f = new FileReader();
  return new Promise((resolve, reject) => {

    if (/image\/\w+/.test(file.type)) {
      // 是图片
      f.readAsDataURL(file);
    }
    f.onload = function (e) {
      if (f.error) {
        throw new error('读取文件出错啦！');
      }
      if (f.readyState === 2) {
        // 已完成全部的读取请求，值2
        resolve(e.target.result)
      } else if (f.readyState == f.EMPTY) {
        // 还没有加载任何数据,值0
        // alert('亲，你还没有选文件哦');
      } else {
        // 数据正在被加载.值1
        // alert('文件加载中');
        f.onabort = function () {
          alert('你取消了本次操作');
        }
      }
    }

    f.onprogress = function () {
      console.log('加载中...');
    }
    f.onerror = function () {
      console.error('出错了...');
    }
    f.onloadstart = function () {
      // console.log('加载开始...' + (+new Date()));
    }
    f.onloadend = function () {
      // console.log('加载结束...' + (+new Date()));
    }
  })
}
module.exports = {
  readFile
}