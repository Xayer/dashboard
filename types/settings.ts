
export type BoardResponse = {
	name: string;
	widgets: string;
};

export type SettingKeyValue = {
	key: string;
	value: string;
}

export type SettingsResponse = {
	id: number;
	name: string;
	meta: {
		settings: {
			boards: BoardResponse[];
			settings: SettingKeyValue[];
		};
	};
};

export type UserSettings = {
	boards: BoardResponse[];
	settings: SettingKeyValue[];
};

export type UserInfo = {
	id?: number;
	name?: string;
}
