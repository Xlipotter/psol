const state = {
  operation: '',
  layoutList: [], // image layout list
  currentLayout: 0, // current image layout
  counter: 0, // image id, only increase from 0 and plus 1 once;
  currentId: 0, // current operating image id. first one is default;
  width: 0, // source canvas width
  height: 0, // source canvas height
  currentLayout: {},
  frontColor: 'rgb(255, 255, 255)',
}

// update
const mutations = {
  updateLayout(state, newlist) {
    state.layoutList = newlist;
  },
  updateCurrentId(state, data) {
    state.currentId = data;
  },
  updateCurrentLayout(state, data) {
    state.currentLayout = data;
  },
  updateCounter(state, data) {
    state.counter = data;
  },
  updateCanvasInfo(state, data) {
    state.width = data.width;
    state.height = data.height;
  },
  updateOperation(state, data) {
    state.operation = data
  },
  updateFrontColor(state, data){
    state.frontColor = data
  }
}

export default {
  namespaced: true,
  state,
  // actions,
  mutations
}