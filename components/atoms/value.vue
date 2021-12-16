<template>
  <component :is="hasUrl" :href="link" target="_blank">
    <div class="top">
      <span class="title" v-text="title"></span>
      <span class="label" :class="labelClass" v-text="label"></span>
    </div>
    <h1 class="value" v-text="value"></h1>
  </component>
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
    },
    url: {
      type: String,
      default: () => '',
    },
  },
  setup(props) {
    const hasUrl = computed(() => (props.url ? 'a' : 'div'))
    const link = computed(() => props.url)
    const labelClass = computed(() => {
      if (props.state === 'success') {
        return 'positive'
      }
      if (props.state === 'danger') {
        return 'negative'
      }
      if (props.state === 'default') {
        return ''
      }
      return ''
    })

    return { labelClass, hasUrl, link }
  },
})
</script>
<style lang="scss" scoped>
div,
a {
  color: var(--text-color);
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
