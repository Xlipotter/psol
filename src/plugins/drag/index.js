const VueDrag = {}

VueDrag.install = function (Vue) {

  Vue.directive('tap', {
    acceptStatement: true,
    bind(el, binding, vnode) {
      let interval = 0; // \
      let startTime = 0; // 触摸开始时间
      let startPostion = {}; // 开始位置
      let destination = {}; // 触摸开始到触摸结束的距离
      let triggerInterval = 100; // 允许的时间间隔(毫秒)
      let triggerDestination = 20; // 允许的距离范围
      let fn = binding.value; // 回调

      if (typeof fn !== 'function') {
        return console.error('must be a function!')
      }

      el.addEventListener('touchstart', (e) => {
        startPostion.x = e.touches[0].pageX;
        startPostion.y = e.touches[0].pageY;
        startTime = Date.now()
      }, false)

      el.addEventListener('touchend', (e) => {
        interval = Math.abs(startTime - Date.now());
        destination.x = Math.abs(startPostion.x - e.changedTouches[0].pageX)
        destination.y = Math.abs(startPostion.y - e.changedTouches[0].pageY)
        if (interval <= triggerInterval && Math.max(destination.x, destination.y) < triggerDestination) {
          fn(e)
        }
        e.preventDefault();
      }, false)

    }
  })

}

export default VueDrag;