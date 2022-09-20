<template>
  <div class="function-list">
    <div
      v-for="item in functionLists"
      :key="item.name"
      class="functio-item"
      @click="handleClick(item)"
    >
      <span v-html="renderText(item.name)"></span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type { FunctionInfo } from '../../../tools/file';

const props = defineProps({
  functionLists: {
    type: Array as PropType<FunctionInfo[]>,
    reqiured: true
  },
  highlight: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['item-click']);

const handleClick = (item: FunctionInfo) => {
  emit('item-click', item);
};

const renderText = (text: string) => {
  if (props.highlight) {
    return text.replace(
      new RegExp(`${props.highlight}`, 'g'),
      `<span class="highlight">${props.highlight}</span>`
    );
  }
  return text;
};
</script>
<style lang="less">
.functio-item {
  cursor: pointer;
  line-height: 24px;
  &:hover {
    background-color: var(--vscode-inputOption-hoverBackground);
  }
  .highlight {
    background-color: rgb(208, 152, 79);
  }
}
</style>
