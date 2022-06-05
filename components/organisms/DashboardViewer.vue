<template>
  <div>
    <client-only>
      <template v-if="name || DashboardWidgets">
        <portal v-if="name" to="page-title">{{ name }}</portal>
        <grid-layout
          v-if="DashboardWidgets"
          :layout.sync="DashboardWidgets"
          :cols="defaultSettings.columns"
          :breakpoints="defaultSettings.breakpoints"
          :row-height="defaultSettings.columnHeight"
          :is-draggable="false"
          :is-resizable="false"
          :margin="defaultSettings.margin"
          :use-css-transforms="true"
          :responsive="true"
        >
          <grid-item
            v-for="item in DashboardWidgets"
            :key="item.i"
            :i="item.i"
            :w="item.w"
            :h="item.h"
            :x="item.x"
            :y="item.y"
            :min-w="item.minW || 1"
            :min-h="item.minH || 1"
            :max-w="item.maxW || Infinity"
            :max-h="item.maxH || Infinity"
          >
            <widget-wrapper>
              <component
                :is="getWidget(item.type)"
                :type="item.type"
                :settings="item.settings"
                :dimensions="{ w: item.w, h: item.h }"
              ></component>
            </widget-wrapper>
          </grid-item>
        </grid-layout>
      </template>
      <portal v-else to="page-title">Board not found :(</portal>
    </client-only>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import {
  Widget as WidgetWrapper,
  Text,
  Weather,
  Forecast,
  TodoList,
  RejseplanenDeparture,
  PriceRunnerProductInfo,
  HueGroup,
  HueLight,
  HueBridges,
  EtherScanAddressBalance,
  Placeholder,
  StockPrice,
  Location,
  SpotifyTopTracks,
  SpotifyPlayer,
} from '@/components/widgets'
import { Widget } from '~/types/widgets'
import { defaultSettings } from '~/constants/dashboard'

@Component({
  components: {
    TextWidget: Text,
    HueBridges,
    HueLight,
    HueGroup,
    RejseplanenDeparture,
    WidgetWrapper,
    TodoList,
    Weather,
    Forecast,
    PriceRunnerProductInfo,
    EtherScanAddressBalance,
    Placeholder,
    StockPrice,
    Location,
    SpotifyTopTracks,
    SpotifyPlayer,
  },
})
export default class DashboardViewer extends Vue {
  defaultSettings = defaultSettings

  @Prop() DashboardWidgets: Widget[] | undefined
  @Prop() name!: string

  created() {
    this.updatePageTitle()
  }

  @Watch('name')
  updatePageTitle() {
    if (this.name) {
      document.title = `${this.name} - Dashboard`
    }
  }

  getWidget(widget: string) {
    if (
      this.$options.components &&
      Object.keys(this!.$options!.components).includes(widget)
    ) {
      return widget
    }
    return 'Placeholder'
  }
}
</script>
