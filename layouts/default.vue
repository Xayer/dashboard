<template>
  <main>
    <nav>
      <ThemeToggle />
    </nav>
    <Nuxt />
  </main>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ThemeToggle } from '@/components/molecules'
@Component({
  components: {
    ThemeToggle,
  },
})
export default class Layout extends Vue {
  created() {
    this.$store.dispatch('themes/loadTheme')
    this.$store.dispatch('userSettings/validate')
    this.$store.dispatch('userSettings/loadExistingSettings')
  }
}
</script>
<style lang="scss">
:root {
  --accent-0: #e2d8cc;
  --accent-50: #ddd2c4;
  --accent-100: #d8cdbc;
  --accent-primary: #445eee;
  --accent-danger: #ee4444;
  --accent-warning: #ff7300;
  --accent-success: #04d442;
  --accent-secondary: var(--accent-100);

  --font-display: 'Poppins', sans-serif;
  --font-weight: 600;

  /** General Global styling options */
  --padding: 25px;
  --radius: 5px;
  --transition: ease 150ms;

  --link-color: #646dec;
  --link-hover: #e46299;
  --text-color: #444;
  --white: #eee;

  --box-shadow-general: 0px 0px 15px -5px;
  --button-box-shadow: var(--box-shadow-general);
}

body,
html {
  --layout-bg: var(--accent-0);
  background: var(--layout-bg);
  font-family: var(--font-display);
  font-weight: var(--font-weight);
  color: var(--text-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

main {
  padding: var(--padding);
}

a {
  color: var(--link-color);
  text-decoration: none;
  box-shadow: 0px 2px 0px 0px var(--link-color);
  transition: var(--transition);
  &:hover {
    --link-color: var(--link-hover);
  }
}

nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 25px;
  display: flex;
  align-items: center;
  width: 100vw;
  box-sizing: border-box;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-display);
  font-weight: 600;
  margin: 0;
  padding: 0;
}
</style>
