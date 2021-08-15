export type Widget = {
	type: string;
	title: string;
	settings: { [key: string]: any | null };
	w: number;
	h: number;
	x: number;
	y: number;
	i: number;
	minW?: number;
	minH?: number;
	maxW?: number;
	maxH?: number;
	guid?: string;
};

export type WidgetSetting = {
	[key: string]: any | null;
};

export type WidgetDimensions = { w: number; h: number };
