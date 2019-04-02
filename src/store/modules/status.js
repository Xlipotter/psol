const state = {
  layoutList: [],
  currentLayout: 0
}

// 更新
const mutations = {
  updateLayout(state, newlist){
    state.layoutList = newlist;
  },
  updateCurrent(state, data){
    state.currentLayout = data;
  }
}

export default {
  namespaced: true,
  state,
  // actions,
  mutations
}