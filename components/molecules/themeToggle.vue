<template>
  <div class="theme" @click="toggleTheme">
    <client-only>
      <i v-if="icon" class="bi" :class="icon"></i>
    </client-only>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { mapGetters } from 'vuex'
import { Theme } from '@/types/themes'

@Component({
  computed: {
    ...mapGetters({
      theme: 'themes/theme',
      availableThemes: 'themes/themes',
    }),
  },
})
export default class ThemesWidget extends Vue {
  availableThemes!: Theme[]
  icon = ''

  theme!: string

  setTheme(theme: string) {
    this.$store.dispatch('themes/setTheme', theme)
  }

  toggleTheme() {
    const currentTheme = this.availableThemes.findIndex(
      (theme) => theme.name === this.theme
    )
    let nextThemeIndex: number = currentTheme + 1
    if (nextThemeIndex >= this.availableThemes.length) {
      nextThemeIndex = 0
    }
    this.setTheme(this.availableThemes[nextThemeIndex].name)
  }

  created() {
    this.updateTheme(this.theme)
  }

  @Watch('theme')
  // eslint-disable-next-line class-methods-use-this
  updateTheme(themeName: string) {
    if (!process.browser) {
      return
    }
    // document.body.className = theme;
    const currentTheme = this.availableThemes.find(
      (theme) => theme.name === themeName
    )

    if (currentTheme?.icon) {
      this.$set(this, 'icon', `bi-${currentTheme?.icon}`)
    }

    const documentRoot = document.querySelector<HTMLElement>(':root')
    if (documentRoot) {
      // clean up existing variables
      documentRoot.removeAttribute('style')
      Object.entries(currentTheme?.variables || {}).forEach(([key, value]) => {
        documentRoot.style.setProperty(key, value)
      })
    }
  }
}
</script>
<style lang="scss">
i {
  &:hover {
    cursor: pointer;
  }
}
</style>
