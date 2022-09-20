<template>
  <div class="input-warper">
    <input
      v-model="searchValue"
      class="search"
      type="text"
      placeholder="搜索"
      @input="handleInput"
    />
    <span
      title="区分大小写"
      :class="['input-rule', { active: active }]"
      @click="active = !active"
      >Aa</span
    >
  </div>
  <div class="function-warper">
    <div class="pinel-collapse">
      <div class="pinel-header" @click="collapse = !collapse">
        <span class="el-icon">
          <ArrowDown v-if="collapse" />
          <ArrowRight v-else />
        </span>
        <span class="pinel-title">函数库</span>
        <div class="opearte-warper">
          <span>{{ renderList.length }}</span>
        </div>
      </div>
      <Transition>
        <FunctionList
          v-if="collapse"
          :function-lists="renderList"
          :highlight="searchValue"
          @item-click="handleClick"
        />
      </Transition>
    </div>
  </div>
</template>
<script lang="tsx" setup>
import { computed, ref, toRaw } from 'vue';
import { ArrowDown, ArrowRight } from '@element-plus/icons-vue';
import FunctionList from './functionList.vue';
import type { FunctionInfo } from '../../../tools/file';

const vscode = acquireVsCodeApi();

const searchValue = ref('');

const active = ref(false);

const collapse = ref(true);

const functionLists = ref<FunctionInfo[]>([]);

const renderList = computed(() => {
  return functionLists.value.filter((x) => {
    return active.value
      ? x.name.includes(searchValue.value)
      : x.name.toUpperCase().includes(searchValue.value.toUpperCase());
  });
});

const handleInput = () => {
  vscode.postMessage({
    name: 'search',
    origin: 'silder-view',
    data: {
      command: 'search',
      searchValue: searchValue.value
    }
  });
};

const handleClick = (item: FunctionInfo) => {
  vscode.postMessage({
    name: 'clickFun',
    origin: 'silder-view',
    data: {
      funcItem: toRaw(item)
    }
  });
};

window.addEventListener('message', (event) => {
  const message = event.data;
  if (message.origin === 'vueuse') return;
  if (message.type === 'init') functionLists.value = message.data.functionList;
});

vscode.postMessage({
  name: 'init',
  origin: 'silder-view',
  data: {
    command: 'init'
  }
});
</script>

<style lang="less">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
  height: 100%;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  height: 0;
}
.pinel-header {
  margin-top: 8px;
  font-size: 11px;
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pinel-header .el-icon {
  position: absolute;
  left: -17px;
  font-size: 14px;
}
.function-warper {
  width: 100%;
  height: 100%;
}

.function-warper .input-warper {
  font-size: 11px;
}
.opearte-warper {
  padding: 3px 6px;
  border-radius: 11px;
  font-size: 11px;
  min-width: 18px;
  min-height: 18px;
  line-height: 11px;
  font-weight: 400;
  text-align: center;
  display: inline-block;
  box-sizing: border-box;
  background-color: rgb(77, 77, 77);
  color: rgb(255, 255, 255);
}
</style>
