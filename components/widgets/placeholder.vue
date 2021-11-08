<template>
  <div>
    <span>widget not found:</span>{{ type }}
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class TextWidget extends Vue {
  @Prop() private type!: string
}
</script>
<style lang="scss" scoped>
div {
  display: grid;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-items: center;
  margin: 0;
  padding: 0;
  text-align: center;

  span { font-weight: var(--weight-bold); color: var(--accent-danger); }

  i {
    font-size: 2rem;
  }
}
</style>
