import { Widget } from '~/types/widgets'

export const widgetsLocalStorageKey = 'widgets'

export const WidgetsAvailable = {
  TextWidget: 'TextWidget',
  HueBridges: 'HueBridges',
  HueLight: 'HueLight',
  HueGroup: 'HueGroup',
  RejseplanenDeparture: 'RejseplanenDeparture',
  TodoList: 'TodoList',
  Weather: 'Weather',
  Forecast: 'Forecast',
  StockPrice: 'StockPrice',
  PriceRunnerProductInfo: 'PriceRunnerProductInfo',
  EtherScanAddressBalance: 'EtherScanAddressBalance',
  Location: 'Location',
  SpotifyTopTracks: 'SpotifyTopTracks',
  SpotifyPlayer: 'SpotifyPlayer',
  carTotalDistance: 'carTotalDistance',
}

export const WidgetTitles: { [key: string]: string } = {
  [WidgetsAvailable.TextWidget]: 'Text',
  [WidgetsAvailable.HueBridges]: 'Hue',
  [WidgetsAvailable.HueLight]: 'HueLight',
  [WidgetsAvailable.HueGroup]: 'Hue Group',
  [WidgetsAvailable.RejseplanenDeparture]: 'Departure Board',
  [WidgetsAvailable.TodoList]: 'Todo List',
  [WidgetsAvailable.Weather]: 'Weather',
  [WidgetsAvailable.Forecast]: 'Forecast',
  [WidgetsAvailable.StockPrice]: 'Stock Price',
  [WidgetsAvailable.PriceRunnerProductInfo]: 'PriceRunner Price',
  [WidgetsAvailable.EtherScanAddressBalance]: 'Ether Address Balance',
  [WidgetsAvailable.Location]: 'Location',
  [WidgetsAvailable.SpotifyTopTracks]: 'Top Tracks Spotify',
  [WidgetsAvailable.SpotifyPlayer]: 'Spotify Player',
  [WidgetsAvailable.carTotalDistance]: 'Car Total Distance',
}

export const WidgetDefaultSettings: { [key: string]: Widget } = {
  [WidgetsAvailable.TextWidget]: {
    type: WidgetsAvailable.TextWidget,
    title: WidgetTitles[WidgetsAvailable.TextWidget],
    settings: {
      message: 'Foo',
    },
    w: 6,
    h: 1,
    y: 1,
    x: 0,
    i: 0,
  },
  [WidgetsAvailable.Weather]: {
    type: WidgetsAvailable.Weather,
    title: WidgetTitles[WidgetsAvailable.Weather],
    settings: {
      city: 'Odense',
      units: 'metric',
    },
    w: 2,
    h: 1,
    y: 1,
    x: 0,
    i: 0,
    minW: 1,
    minH: 1,
  },
  [WidgetsAvailable.Forecast]: {
    type: WidgetsAvailable.Forecast,
    title: WidgetTitles[WidgetsAvailable.Forecast],
    settings: {
      city: 'Odense',
      units: 'metric',
    },
    w: 3,
    h: 2,
    y: 1,
    x: 0,
    i: 0,
    minW: 1,
    minH: 1,
  },
  [WidgetsAvailable.HueBridges]: {
    type: WidgetsAvailable.HueBridges,
    title: WidgetTitles[WidgetsAvailable.HueBridges],
    settings: {},
    w: 6,
    h: 1,
    y: 1,
    x: 6,
    i: 1,
  },
  [WidgetsAvailable.HueLight]: {
    type: WidgetsAvailable.HueLight,
    title: WidgetTitles[WidgetsAvailable.HueLight],
    settings: {},
    w: 1,
    h: 1,
    y: 0,
    x: 0,
    i: 1,
  },
  [WidgetsAvailable.HueGroup]: {
    type: WidgetsAvailable.HueGroup,
    title: WidgetTitles[WidgetsAvailable.HueGroup],
    settings: {
      group: '',
    },
    w: 3,
    h: 2,
    y: 0,
    x: 0,
    i: 1,
    minW: 2,
    minH: 2,
  },
  [WidgetsAvailable.RejseplanenDeparture]: {
    type: WidgetsAvailable.RejseplanenDeparture,
    title: WidgetTitles[WidgetsAvailable.RejseplanenDeparture],
    settings: {
      title: 'Departures',
      stationId: '461853100',
    },
    w: 6,
    h: 2,
    y: 0,
    x: 0,
    i: 1,
    minH: 2,
  },
  [WidgetsAvailable.TodoList]: {
    type: WidgetsAvailable.TodoList,
    title: WidgetTitles[WidgetsAvailable.TodoList],
    settings: {
      todos: [],
    },
    w: 2,
    h: 1,
    y: 2,
    x: 6,
    i: 2,
  },
  [WidgetsAvailable.StockPrice]: {
    type: WidgetsAvailable.StockPrice,
    title: WidgetTitles[WidgetsAvailable.StockPrice],
    settings: {
      stockName: 'AAPL',
    },
    w: 2,
    h: 1,
    y: 0,
    x: 0,
    i: 1,
    minW: 1,
  },
  [WidgetsAvailable.EtherScanAddressBalance]: {
    type: WidgetsAvailable.EtherScanAddressBalance,
    title: WidgetTitles[WidgetsAvailable.EtherScanAddressBalance],
    settings: {
      address: '',
    },
    w: 2,
    h: 1,
    y: 0,
    x: 0,
    i: 1,
    minW: 1,
  },
  [WidgetsAvailable.PriceRunnerProductInfo]: {
    type: WidgetsAvailable.PriceRunnerProductInfo,
    title: WidgetTitles[WidgetsAvailable.PriceRunnerProductInfo],
    settings: {
      country: 'dk',
      productId: '5182343',
      name: 'Canon EOS R',
    },
    w: 2,
    h: 1,
    maxH: 1,
    y: 0,
    x: 0,
    i: 0,
  },
  [WidgetsAvailable.Location]: {
    type: WidgetsAvailable.Location,
    title: WidgetTitles[WidgetsAvailable.Location],
    settings: {},
    w: 2,
    h: 1,
    maxH: 1,
    y: 0,
    x: 0,
    i: 0,
  },
  [WidgetsAvailable.SpotifyTopTracks]: {
    type: WidgetsAvailable.SpotifyTopTracks,
    title: WidgetTitles[WidgetsAvailable.SpotifyTopTracks],
    settings: {
      range: 'medium_term',
    },
    w: 2,
    h: 1,
    y: 0,
    x: 0,
    i: 0,
  },
  [WidgetsAvailable.SpotifyPlayer]: {
    type: WidgetsAvailable.SpotifyPlayer,
    title: WidgetTitles[WidgetsAvailable.SpotifyPlayer],
    settings: {},
    w: 2,
    h: 1,
    y: 0,
    x: 0,
    i: 0,
  },
  [WidgetsAvailable.carTotalDistance]: {
    type: WidgetsAvailable.carTotalDistance,
    title: WidgetTitles[WidgetsAvailable.carTotalDistance],
    settings: {},
    w: 2,
    h: 1,
    y: 0,
    x: 0,
    i: 0,
  },
}
