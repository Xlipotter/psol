<template>
  <div class="status_bar">
    <input type="text" :value="zoom" @input="verify">%
  </div>
</template>
<script>
export default {
  name: "statusbar",
  data() {
    return {
      zoom: 100
    };
  },
  watch:{
    zoom(a,b){
      console.log(a)
      console.log(b)
    }
  },
  methods: {
    verify(e) {
      if (!!e.target.value.match(/\d{1,3}/)) {
        this.zoom = e.target.value
        this.$store.state.layout.zoom = this.zoom / 100
      }
    }
  }
};
</script>
<style lang="scss" scope>
.status_bar {
  position: fixed;
  z-index: 9999;
  width: 100%;
  padding-left: 30px;
  bottom: 0;
  // padding-top:5px;
  // padding-bottom: 5px;
  background-color: rgba(50, 50, 50, 0.5);
  color: #fff;
  input {
    background-color: transparent;
    border: none;
    width: 50px;
    color: #fff;
    text-align: center;
  }
}
</style>


