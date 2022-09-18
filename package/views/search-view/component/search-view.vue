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
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const vscode = acquireVsCodeApi();

const searchValue = ref('');

const active = ref(false);

const handleInput = () => {
  vscode.postMessage({
    name: 'search',
    data: {
      command: 'search',
      searchValue: searchValue.value
    }
  });
};
</script>
