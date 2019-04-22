const state = {
  operation: '', // 操作类型；move: 移动；text: 文本
  layoutList: [], // image layout list
  counter: 0, // image id, only increase from 0 and plus 1 once;
  currentId: 0, // current operating image id. first one is default;
  logicIndex: 0, // logic index
  width: 0, // source canvas width
  height: 0, // source canvas height
  x: 0,
  y: 0,
  currentLayout: {},
  frontColor: 'rgb(255, 255, 255)',
  isShowPallet: false,
  zoom: 1,
  filterMethod: '',
  isCallCanvas: false,
}

// update
const mutations = {
  updateLayout(state, newlist) {
    state.layoutList = newlist;
  },
  updateCurrentId(state, data) {
    state.currentId = data.id;
    state.logicIndex = data.index;
  },
  updateCurrentLayout(state, data) {
    state.currentLayout = data;
  },
  updateCounter(state, data) {
    state.counter = data;
  },
  updateCanvasInfo(state, data) {
    Object.assign(state, data)
  },
  updateOperation(state, data) {
    state.operation = data
  },
  updateFrontColor(state, data){
    state.frontColor = data
  },
  updatePalletStatus(state, data){
    state.isShowPallet = !state.isShowPallet
  },
  updateZoom(state, data){
    state.zoom = data
  },
  updateFilter(state, data){
    state.isCallCanvas = true;
    state.filterMethod = data;
  },
  updateCanvasStatus(state, data){
    state.isCallCanvas = data;
  }
}

export default {
  namespaced: true,
  state,
  // actions,
  mutations
}