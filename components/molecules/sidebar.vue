<template>
  <div>
    <slot name="button" :opened="opened">
      <Button @click="opened = !opened">{{ opened ? 'Close' : 'Open' }}</Button>
    </slot>
    <transition name="slide-fade">
      <aside v-show="opened">
        <slot />
      </aside>
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Button } from '@/components/atoms'

@Component({
  components: {
    Button,
  },
})
export default class Sidebar extends Vue {
  opened = false
}
</script>
<style lang="scss" scoped>
div {
  z-index: 2;
}

aside {
  // position: fixed;
  // top: 0;
  // right: 100%;
  // bottom: 0;
  // height: 100vh;
  // width: 25vw;
  // z-index: 10;
  position: -webkit-sticky;
  position: sticky;
  top: 10px;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 99;
  cursor: pointer;
  user-select: none;
  // background-color: var(--accent-50);
}
</style>
