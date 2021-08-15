<template>
	<div class="theme" @click="toggleTheme">
		<i class="bi" :class="`bi-${themeIcon}`"></i>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Theme } from '@/types/themes';

@Component({
	computed: {
		...mapGetters({
			theme: 'themes/theme',
			themeIcon: 'themes/themeIcon',
			availableThemes: 'themes/themes',
		}),
	},
})
export default class ThemesWidget extends Vue {
	availableThemes!: Theme[];

	theme!: string;

	themeIcon!: string;

  	setTheme(theme: string) {
  		this.$store.dispatch('themes/setTheme', theme);
	}

	toggleTheme() {
		const currentTheme = this.availableThemes.findIndex((theme) => theme.name === this.theme);
		let nextThemeIndex: number = currentTheme + 1;
		if(nextThemeIndex >= this.availableThemes.length) { nextThemeIndex = 0; }
		this.setTheme(this.availableThemes[nextThemeIndex].name);
	}

  	mounted() {
  		this.updateTheme(this.theme);
	}
	  
	@Watch('theme')
  	// eslint-disable-next-line class-methods-use-this
  	updateTheme (themeName: string) {
		  if(!process.browser) {
			  return;
		  }
		  // document.body.className = theme;
		  const currentTheme = this.availableThemes.find((theme) => theme.name === themeName);
		  if(currentTheme?.icon) { this.themeIcon = currentTheme?.icon; }

		  const documentRoot = document.querySelector<HTMLElement>(':root');
		  if(documentRoot) {
			  // clean up existing variables
			  documentRoot.removeAttribute('style');
			  Object.entries(currentTheme?.variables || {}).forEach(([key, value]) => {
				documentRoot.style.setProperty(key, value);
			  });
		  }
  	}

}
</script>
<style lang="scss">
	span {
		text-transform: capitalize;
		display: inline-block;
		margin: {
			block-start: 0;
			block-end: 0;
		}
	}
	i {
		display: inline-block;
		margin-inline-end: 0.5rem;
	}
	.on {
		color: var(--success);
	}
	.off {
		color: var(--danger);
	}
</style>
