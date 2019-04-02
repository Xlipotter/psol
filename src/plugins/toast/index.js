import toastComponent from './Toast.vue'

const toast = {};

toast.install = (Vue) => {
	// 扩展组件子类并实例
	const toastClass = Vue.extend(toastComponent);
	const toastSimple = new toastClass();
	
	// 手动挂载到body下
	toastSimple.$mount(document.createElement('div'));
    document.body.appendChild(toastSimple.$el);
    
    // 注入原型方法
	Vue.prototype.$toast = (msg = '123', duration = 1500, callback) => {
		toastSimple.show = 1;
		toastSimple.content = msg;
		setTimeout(() => {
			toastSimple.show = 0;
			typeof callback === 'function' && callback();
        }, duration);
		
    }	
}

export default toast;

