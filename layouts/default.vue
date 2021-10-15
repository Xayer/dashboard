<template>
  <main>
    <Header />
    <div class="sub-header m-b">
      <h2><portal-target name="page-title" /></h2>
      <portal-target name="page-actions" />
    </div>
    <Nuxt />
  </main>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { mapGetters } from 'vuex'
import { Header } from '@/components/organisms'
@Component({
  components: {
    Header,
  },
  computed: {
    ...mapGetters({
      token: 'hue/token',
      hueAvailable: 'hue/available',
      hueAddress: 'hue/hueAddress',
    }),
  },
})
export default class Layout extends Vue {
  token?: string
  bridgeAddressNotFound = true
  devicesTimeout!: ReturnType<typeof setTimeout>
  created() {
    this.$store.dispatch('themes/loadTheme')
    this.$store.dispatch('userSettings/validate')
    this.$store.dispatch('userSettings/loadExistingSettings')
    this.$store.dispatch('hue/loadSettings')
    if (process.browser) {
      window.addEventListener('offline', () => {
        this.$store.commit('internet/SET_CONNECTION_STATUS', false)
      })
      window.addEventListener('online', () => {
        this.$store.commit('internet/SET_CONNECTION_STATUS', true)
      })
    }
  }

  detectDevices() {
    if (this.token) {
      return
    }
    this.$store.dispatch('hue/getDevices').catch((error: any) => {})
  }

  @Watch('bridgeAddress')
  commitBridgeAddress(address: string) {
    this.$store.commit('hue/SET_BRIDGE_ADDRESS', address)
    this.bridgeAddressNotFound = false
    this.detectDevices()
  }

  @Watch('bridgeAddressNotFound')
  bridgeAddressChanged(found: boolean) {
    if (found) {
      this.devicesTimeout = setInterval(() => {
        this.detectDevices()
      }, 3000)
    } else {
      clearInterval(this.devicesTimeout)
    }
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
  --weight-normal: 600;
  --weight-bold: 700;
  --weight-thin: 300;

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
  --button-box-shadow: var(--box-shadow-general);
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
</style>
