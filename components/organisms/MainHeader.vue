<template>
  <header class="m-b">
    <Menu :items="menuItems" />
    <aside>
      <ThemeToggle />
      <Avatar :size="32" />
    </aside>
  </header>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Avatar } from '@/components/atoms'
import { ThemeToggle, Menu } from '@/components/molecules'
@Component({
  components: {
    ThemeToggle,
    Menu,
    Avatar,
  },
})
export default class Header extends Vue {
  menuItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboards', label: 'Dashboards' },
    { path: '/settings', label: 'Settings' },
  ]
}
</script>
<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

aside {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--padding);
}

.logo {
  box-shadow: none;
}

.sub-header {
  display: block;
  width: 100%;
}
</style>
