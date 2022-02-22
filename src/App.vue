<template>
  <div class="sku-container">
    <div v-for="(item, index) in commoditySpecs" :key="index">
      <div>
        <h3>{{item.title}}</h3>
        <div class="flex-wrap-options">
          <span 
            v-for="(option, index) in item.list" 
            :key="index"
            :class="{
              'option': optionSpecs.indexOf(option) > -1,
              'active': optionChecks.indexOf(option) > -1
            }"
            @click="optionSpecs.indexOf(option) > -1 && handleClick(optionChecks.indexOf(option) > -1, option, index)">
              {{ option }}
            </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import ShopAdjoin from "./ShopAdjoin";
export default {
  name: "App",
  setup() {
    const shopAdjoinRef = ref(null);
    const data = reactive([
      { id: "1", specs: ["紫色", "套餐一", "64G"] },
      { id: "2", specs: ["紫色", "套餐一", "128G"] },
      { id: "3", specs: ["紫色", "套餐二", "128G"] },
      { id: "4", specs: ["黑色", "套餐三", "256G"] },
    ]);

    const commoditySpecs = reactive([
      { title: "颜色", list: ["红色", "紫色", "白色", "黑色"] },
      { title: "套餐", list: ["套餐一", "套餐二", "套餐三", "套餐四"] },
      { title: "内存", list: ["64G", "128G", "256G"] },
    ]);

    shopAdjoinRef.value = new ShopAdjoin(commoditySpecs, data);

    // 当前选择的option
    const optionChecks = ref([])

    const optionSpecs = computed(() => {
      return shopAdjoinRef.value.querySpecsOptions(optionChecks.value)
    })
    

    // 点击选项
    const handleClick = (isClick, value, index) => {
      console.log('click', isClick, value, index)
      if(!isClick){
        optionChecks.value.push(value)
      }else {
        let index = optionChecks.value.findIndex(item => item === value)
        optionChecks.value.splice(index, 1)
      }
    }

    return {
      commoditySpecs,
      data,
      shopAdjoinRef,
      optionChecks,
      optionSpecs,
      handleClick
    }
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.flex-wrap-options {
  display: flex;
  flex-wrap: wrap;
  & > span {
    display: inline-block;
    border: 1px solid rgb(228, 52, 52);
    margin-right: 8px;
    padding: 2px 6px;
    user-select: none;
    background: #d8d5d5;
    cursor: not-allowed;
    border-radius: 4px;
    &.option {
      cursor: pointer;
      background: #fff;
    }
    &.active {
      cursor: pointer;
      background: #fef0f0;
      color: #f56c6c;
    }
  }
}
</style>
