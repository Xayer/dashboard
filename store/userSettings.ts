import axios, { AxiosResponse } from "axios";
import { Commit, Dispatch } from "vuex";
import {
	jwtTokenStorageKey,
	jwtValidateEndpoint,
	jwtTokenEndpoint,
	settingsEndpoint,
	jwtInvalidateEndpoint,
	menuShownStorageKey,
	userInfoStorageKey,
} from "@/constants/login";
import { widgetsLocalStorageKey } from "@/constants/widgets";
import { SettingsResponse, UserSettings, UserInfo } from "@/types/settings";
import { storageKey as spotifyStorageKey } from "@/modules/apis/spotify";
import { todosStorageKey } from '@/constants/todo';
import { themeStorageKey } from "~/constants/themes";

type StateType = {
	isAuthenticated: boolean,
	userSettings: UserSettings,
	userInfo: UserInfo,
}

const SettingsState: StateType = {
	isAuthenticated: false,
	userInfo: {
		id: undefined,
		name: undefined,
	},
	userSettings: {
		boards: [],
		settings: []
	}
};

const SettingsGetters = {
	isAuthenticated: (state: StateType) => state.isAuthenticated,
	user: (state: StateType) => state.userInfo,
	settings: ( ) => ({
		boards: [
			{
				name: "Dashboard",
				widgets: JSON.parse(localStorage.getItem(widgetsLocalStorageKey) || JSON.stringify([])),
			},
		],
		settings: [
			{
				key: menuShownStorageKey,
				value: JSON.parse(localStorage.getItem(menuShownStorageKey) || "true"),
			},
			{
				key: themeStorageKey,
				value: JSON.parse(localStorage.getItem(themeStorageKey) || ""),
			},
			{
				key: spotifyStorageKey,
				value: JSON.parse(localStorage.getItem(spotifyStorageKey) || ""),
			},
		],
	}),
};

const actions = {
	validate: ({ commit }: { commit: Commit }) => {
		if(!process.browser){
			return null;
		}

		if (localStorage.getItem(jwtTokenStorageKey)) {
			const token = localStorage.getItem(jwtTokenStorageKey);
			axios
				.post(
					jwtValidateEndpoint,
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
				.then(() => {
					commit("SET_IS_AUTHENTICATED", true);
				})
				.catch(() => {
					commit("SET_IS_AUTHENTICATED", false);
					localStorage.removeItem(jwtTokenStorageKey);
				});
		} else {
			commit("SET_IS_AUTHENTICATED", false);
			localStorage.removeItem(jwtTokenStorageKey);
		}
	},
	loadExistingSettings: ({ commit } : { commit: Commit }) => {
		if(!process.browser){
			return;
		}

		const settings = {
			boards: [
				{
					name: "Dashboard",
					widgets: JSON.parse(localStorage.getItem(widgetsLocalStorageKey) || "[]"),
				},
			],
			settings: [
				{
					key: menuShownStorageKey,
					value: JSON.parse(localStorage.getItem(menuShownStorageKey) || '"true"'),
				},
				{
					key: themeStorageKey,
					value: JSON.parse(localStorage.getItem(themeStorageKey) || '"true"'),
				},
				{
					key: spotifyStorageKey,
					value: JSON.parse(localStorage.getItem(spotifyStorageKey) || '""'),
				},
				{
					key: todosStorageKey,
					value: JSON.parse(localStorage.getItem(todosStorageKey) || JSON.stringify([])),
				},
			],
		};
		const userInfo = JSON.parse(localStorage.getItem(userInfoStorageKey) || "{}");
	},
	authenticate: async (
		{ commit }: { commit: Commit; },
		{ username, password }: { username: string; password: string }
	) => {
		const formdata = new FormData();
		formdata.append("username", username);
		formdata.append("password", password);
		await axios.post(jwtTokenEndpoint, formdata).then((response) => {
			const {
				data: { token },
			} = response;
			localStorage.setItem(jwtTokenStorageKey, token);
			commit("SET_IS_AUTHENTICATED", true);
			
		});
	},
	signOut: ({ commit }: { commit: Commit }) => {
		if (localStorage.getItem(jwtTokenStorageKey)) {
			const token = localStorage.getItem(jwtTokenStorageKey);
			axios
				.delete(jwtInvalidateEndpoint, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
		} else {
			commit("SET_IS_AUTHENTICATED", false);
			localStorage.removeItem(jwtTokenStorageKey);
			localStorage.removeItem(userInfoStorageKey);
		}
	},
	download: async ({
		commit,
		dispatch,
	}: {
		commit: Commit;
		dispatch: Dispatch;
	}) => {
		await dispatch("fetch").then(({ data: { meta: { settings }, id, name}}: AxiosResponse<SettingsResponse>) => {
			commit('SET_SETTINGS', settings);
			commit('SET_USER_DATA', { id, name });
			dispatch('loadExistingSettings');
		});
	},
	fetch: (): Promise<AxiosResponse<SettingsResponse>> =>
		axios.get(settingsEndpoint, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem(jwtTokenStorageKey)}`,
			},
		}),
	upload: async ({ commit, dispatch }: { commit: Commit; dispatch: Dispatch }) => {
		let existingSettings = {};
		dispatch("fetch").then((response: AxiosResponse<SettingsResponse>) => {
			const { settings } = response.data.meta;
			existingSettings = settings;
		});

		const localSettings = {
			boards: [
				{
					name: "Dashboard",
					widgets: JSON.parse(localStorage.getItem(widgetsLocalStorageKey) || JSON.stringify([])),
				},
			],
			settings: [
				{
					key: menuShownStorageKey,
					value: JSON.parse(localStorage.getItem(menuShownStorageKey) || 'true'),
				},
				{
					key: themeStorageKey,
					value: JSON.parse(localStorage.getItem(themeStorageKey) || 'true'),
				},
				{
					key: spotifyStorageKey,
					value: JSON.parse(localStorage.getItem(spotifyStorageKey) || '""'),
				},
				{
					key: todosStorageKey,
					value: JSON.parse(localStorage.getItem(todosStorageKey) || JSON.stringify([])),
				},
			],
		};
			
		await axios.post(
			settingsEndpoint,
			{
				meta: {
					settings: {
						...existingSettings,
						...localSettings,
					},
				},
			},
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem(jwtTokenStorageKey)}`,
				},
			}
		)
			.then(({ data: { meta: { settings }, id, name}}: AxiosResponse<SettingsResponse>) => {
				commit('SET_SETTINGS', settings);
				commit('SET_USER_DATA', { id, name });
				dispatch('loadExistingSettings');
			})
			.catch((response) => {
				console.error(response);
			});
	},
};

const mutations = {
	SET_IS_AUTHENTICATED: (state: StateType, isAuthenticated: boolean) => {
		state.isAuthenticated = isAuthenticated;
	},
	SET_USER_DATA: (
		state: StateType,
		userInfo: UserInfo
	) => {
		state.userInfo = userInfo;
		localStorage.setItem(userInfoStorageKey, JSON.stringify(userInfo));
	},
	SET_SETTINGS: (
		_state: StateType,
		newSettings: UserSettings,
	) => {
		const { boards, settings} = newSettings;
		// TODO: change to have multiple boards, rather than just saving the widgets of the first board
		localStorage.setItem(widgetsLocalStorageKey, JSON.stringify(boards[0].widgets));
		settings.forEach(({ key, value}) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}
};

export default {
	state: SettingsState,
	getters: SettingsGetters,
	actions,
	mutations,
};
