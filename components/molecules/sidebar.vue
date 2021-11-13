<template>
  <div style="--navbar-width: 100px">
    <transition name="sidebar-fade">
      <aside v-show="opened">
        <header class="m-b">
          <h2><slot name="title" /></h2>
          <slot name="button" :opened="opened">
            <Button @click="opened = false">X</Button>
          </slot>
        </header>
        <slot />
      </aside>
    </transition>
    <transition name="fade">
      <div v-show="opened" class="overlay" @click="opened = false"></div>
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, VModel, Vue } from 'vue-property-decorator'
import { Button } from '@/components/atoms'

@Component({
  components: {
    Button,
  },
})
export default class Sidebar extends Vue {
  @VModel({ type: Boolean }) opened!: boolean
}
</script>
<style lang="scss" scoped>
div {
  z-index: 2;
}

label {
  width: 100%;
}

header {
  display: flex;
  gap: var(--padding);
}

aside {
  height: 100%;
  width: auto;
  min-width: var(--navbar-width);
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  overflow-x: hidden;
  padding: var(--padding);
  z-index: 99;
  cursor: pointer;
  overflow-y: auto;
  user-select: none;
  background-color: var(--accent-50);
  box-shadow: var(--box-shadow-general) var(--accent-0);

  label {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    gap: var(--padding);
    & + label {
      margin-top: var(--padding);
    }

    .form-field {
      margin-left: 0;
    }
  }
}
.overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  content: '';
  z-index: 98;
  height: 100vh;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.sidebar-fade-enter-active {
  transition: var(--navbar-transition);
}
.sidebar-fade-leave-active {
  transition: var(--navbar-transition);
}
.sidebar-fade-enter, .sidebar-fade-leave-to
	/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-var(--navbar-width));
  opacity: 0;
}
</style>
