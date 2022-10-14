<template>
  <div ref="warperRef" class="function-list">
    <div
      v-for="item in functionLists"
      :key="item.name"
      :class="['functio-item', { active: select === item.name }]"
      @click="handleClick(item)"
    >
      <span v-html="renderText(item.name)"></span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
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

const select = ref();

const emit = defineEmits(['item-click']);

const handleClick = (item: FunctionInfo) => {
  select.value = item.name;
  emit('item-click', item);
};

const renderText = (text: string) => {
  if (props.highlight) {
    return text.replace(
      new RegExp(`${props.highlight}`, 'gi'),
      (val) => `<span class="highlight">${val}</span>`
    );
  }
  return text;
};

const warperRef = ref(null);
const warperheight = ref('600px');

onMounted(() => {
  const height =
    document.documentElement.clientHeight || document.body.clientHeight;
  warperheight.value = `${height - 70}px`;
});
</script>
<style lang="less">
.function-list {
  max-height: v-bind(warperheight);
  overflow-y: auto;
  padding: 0 20px;
  .functio-item {
    position: relative;
    cursor: pointer;
    line-height: 24px;
    .function-description {
      font-size: 10px;
      color: #f4f4f4;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    &:hover {
      background-color: var(--vscode-inputOption-hoverBackground);
    }
    &.active {
      background-color: var(--vscode-inputOption-hoverBackground);
    }
    .highlight {
      background-color: rgb(208, 152, 79);
    }
  }
}
</style>
