<template>
  <main>
    <Header />
    <div class="sub-header m-b">
      <h2><portal-target name="page-title" /></h2>
      <portal-target name="page-actions" />
    </div>
    <Nuxt />
    <client-only>
      <VueQueryDevTools :initial-is-open="true" />
    </client-only>
  </main>
</template>
<script lang="ts">
// import { Component, Vue, Watch } from 'nuxt-property-decorator'
// import { mapGetters } from 'vuex'
import { useQueryProvider } from 'vue-query'
import VueCompositionApi, { defineComponent } from '@vue/composition-api'
import Vue from 'vue'
import { VueQueryDevTools } from 'vue-query/devtools'
import { Header } from '@/components/organisms'

export default defineComponent({
  // token?: string
  // bridgeAddressNotFound = true
  // devicesTimeout!: ReturnType<typeof setTimeout>
  name: 'Default',
  components: {
    Header,
    VueQueryDevTools,
  },
  setup(_props, { root }) {
    Vue.use(VueCompositionApi)

    useQueryProvider()

    if (!process.browser) {
      return undefined
    }

    root.$store.dispatch('themes/loadTheme')
    root.$store.dispatch('userSettings/validate')
    root.$store.dispatch('userSettings/loadExistingSettings')
    root.$store.dispatch('hue/loadSettings')
    if (process.browser) {
      window.addEventListener('offline', () => {
        root.$store.commit('internet/SET_CONNECTION_STATUS', false)
      })
      window.addEventListener('online', () => {
        root.$store.commit('internet/SET_CONNECTION_STATUS', true)
      })
    }
  },

  // detectDevices() {
  //   if (this.token) {
  //     return
  //   }
  //   root.$store.dispatch('hue/getDevices')
  // }

  // @Watch('bridgeAddress')
  // commitBridgeAddress(address: string) {
  //   root.$store.commit('hue/SET_BRIDGE_ADDRESS', address)
  //   this.bridgeAddressNotFound = false
  //   this.detectDevices()
  // }

  // @Watch('bridgeAddressNotFound')
  // bridgeAddressChanged(found: boolean) {
  //   if (found) {
  //     this.devicesTimeout = setInterval(() => {
  //       this.detectDevices()
  //     }, 3000)
  //   } else {
  //     clearInterval(this.devicesTimeout)
  //   }
  // }
})
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
  --weight-normal: 600;
  --weight-bold: 700;
  --weight-thin: 300;

  --blur: 10px;

  /** General Global styling options */
  --padding: 25px;
  --radius: 5px;
  --transition: ease 150ms;

  --link-color: #646dec;
  --link-hover: #e46299;
  --link-current: var(--accent-success);
  --text-color: #444;
  --white: #eee;

  --box-shadow-general: 0px 0px 15px -5px;

  --button-text-color: var(--white);
  --button-box-shadow: var(--box-shadow-general);

  --input-bg: var(--accent-0);

  --widget-padding: 15px;
}

body,
html {
  --layout-bg: var(--accent-0);
  background: var(--layout-bg);
  font-family: var(--font-display);
  font-weight: var(--weight-normal);
  color: var(--text-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input {
  font-family: var(--font-display);
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

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-display);
  font-weight: var(--weight-normal);
  margin: 0;
  padding: 0;
}

.m-r {
  margin-right: calc(var(--padding) / 2);
}
.m-b {
  margin-bottom: calc(var(--padding) / 2);
}
.m-t {
  margin-top: calc(var(--padding) / 2);
}
.m-l {
  margin-left: calc(var(--padding) / 2);
}

.sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: var(-transition);
}
.slide-fade-leave-active {
  transition: var(--transition);
}
.slide-fade-enter, .slide-fade-leave-to
	/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-var(--padding));
  opacity: 0;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.fade-enter-active {
  transition: var(--transition);
  opacity: 1;
}
.fade-leave-active {
  transition: var(--transition);
  opacity: 0 !important;
}
.fade-leave-to {
  transition: var(--transition);
  opacity: 0 !important;
}
.fade-enter,
.fade-leave-to {
  transition: var(--transition);
  opacity: 0 !important;
}
</style>
