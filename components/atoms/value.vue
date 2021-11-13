<template>
  <div>
    <div class="top">
      <span class="title" v-text="title"></span>
      <span class="label" :class="labelClass" v-text="label"></span>
    </div>
    <h1 class="value" v-text="value"></h1>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
export default defineComponent({
    name: 'Value',
  props: {
    title: {
      type: String,
      default: () => '',
    },
    label: {
      type: String,
      default: () => '',
    },
    value: {
      type: String,
      default: () => '',
    },
    state: {
        type: String,
        default: () => '',
    }
  },
  setup(props) {
    const labelClass = computed(() => {
      if(props.state === 'success') { return 'positive'}
      if(props.state === 'danger') { return 'negative'}
      if(props.state === 'default') { return ''}
      return ''
    })
    return { labelClass }
  }
})
</script>
<style lang="scss" scoped>
div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: -var(--padding);
  .top {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    .title {
      font-size: 10px;
      font-weight: var(--weight-bold);
      text-transform: uppercase;
    }
    .label {
      font-size: 10px;
      font-weight: var(--weight-bold);
      text-transform: uppercase;
    }
  }
  .value {
    font-weight: var(--weight-thin);
    text-align: right;
  }

  .positive {
    color: var(--accent-success);
  }
  .negative {
    color: var(--accent-danger);
  }
}
</style>
