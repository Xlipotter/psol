<template>
  <div v-show="show" class="toast" :data-msg="content" @touchmove="forbitMove()"></div>
</template>
<script>
export default {
  name: "toast",
  data() {
    return {
      show: 0,
      content: "123"
    }
  },
  mounted() {},
  methods: {
    forbitMove(e) {
      e = e || window.event
      e.preventDefault()
    }
  }
}
</script>
<style lang="scss" scoped>
.toast {
  color: #fff;
  font-size: 16px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: 99;
  &::after {
    content: attr(data-msg);
    position: relative;
    top: 50%;
    left: 50%;
    display: inline-block;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    margin: auto;
    transform: translate(-50%);
    padding-left: 20px;
    padding-right: 20px;
    line-height: 64px;
  }
}
</style>
