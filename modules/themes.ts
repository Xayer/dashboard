import { Commit, Dispatch } from "vuex";
import { themeStorageKey } from "@/constants/themes";

interface State {
	theme: string;
	themes: { name: string; icon: string }[];
}

export interface Theme {
	name: string;
	icon: string;
}

export default {
	state: {
		theme: "light",
		themes: [
			{ name: "dark", icon: "moon" },
			{ name: "light", icon: "sun" },
			{ name: "red", icon: "star" },
			{ name: "green", icon: "tree" },
			{ name: "tornado", icon: "tornado" },
		],
	} as State,

	getters: {
		theme: (state: State) => state.theme,
		themeIcon: (state: State) => {
			const foundTheme = state.themes.find((theme) => theme.name === state.theme);
			return foundTheme ? foundTheme.icon : "";
		},
		themes: (state: State) => state.themes,
	},

	actions: {
		setTheme: ({ commit }: { commit: Commit }, theme: string) => {
			commit("SET_THEME", theme);
		},
		loadTheme: ({ dispatch }: { dispatch: Dispatch }) => {
			const localTheme = localStorage.getItem(themeStorageKey);
			let theme: string | null = localTheme ? JSON.parse(localTheme) : null;
			if(theme === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				theme = 'dark';
			}
			if(theme === null ) {
				theme = 'light';
			}
			dispatch('setTheme', theme);
		}
	},

	mutations: {
		SET_THEME: (state: State, theme: string) => {
			state.theme = theme;
			localStorage.setItem(themeStorageKey, JSON.stringify(theme));
		},
	},
};
