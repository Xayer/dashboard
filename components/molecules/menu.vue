<template>
  <nav>
    <slot name="prepend"></slot>
    <NuxtLink
      v-for="{ path, label } in items"
      :key="`${path}${label}`"
      :to="{ path }"
      >{{ label }}</NuxtLink
    >
    <slot name="append"></slot>
  </nav>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({})
export default class Menu extends Vue {
  @Prop() items!: { path: string; label: string }[]
}
</script>
<style lang="scss">
nav {
  --menu-shadow: 0px 2px 0px 0px;
  a {
    color: var(--text-color);
    text-decoration: none;
    box-shadow: var(--menu-shadow) var(--link-color);
    padding-bottom: calc(var(--padding) / 6);
    transition: var(--transition);
    &.nuxt-link-active {
      box-shadow: var(--menu-shadow) var(--link-current);
    }
    + a {
      margin-left: calc(var(--padding) / 2);
    }
    &:hover {
      box-shadow: var(--menu-shadow) var(--link-hover);
    }
  }
}
</style>
