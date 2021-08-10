<template>
  <main>
    <Nuxt />
  </main>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
@Component({})
export default class Layout extends Vue {
    
}
</script>
<style lang="scss">
  :root {
    --accent-0: #1D2733;
    --accent-50: #222D3B;
    --accent-100: #273243;
    --accent-primary: #445eee;
    --accent-danger: #ee4444;
    --accent-warning: #ff7300;
    --accent-success: #04d442;
    --accent-secondary: var(--accent-100);

    --font-display: "Poppins",sans-serif;
    --font-weight: 600;

    --layout-bg: var(--accent-0);

    /** General Global styling options */
    --padding: 25px;
    --radius: 5px;
    --transition: ease 150ms;

    --link-color: #646DEC;
    --link-hover: #E46299;
    --text-color: #eee;

    --box-shadow-general: 0px 0px 15px -5px;
    --button-box-shadow: var(--box-shadow-general);
  }

  body, html {
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
</style>