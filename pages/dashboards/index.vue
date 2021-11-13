<template>
  <div v-if="$route.query.id">
    <client-only>
      <template v-if="currentBoard">
        <portal v-if="currentBoard.name" to="page-title">{{
          currentBoard.name
        }}</portal>
        <portal to="page-actions">
          <Button class="primary m-b" @click="editDashboard">Edit</Button>
        </portal>
        <grid-layout
          v-if="getDashboardWidgets"
          :layout.sync="DashboardWidgets"
          :cols="defaultSettings.columns"
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
  <div v-else>
    <portal to="page-title">Dashboards</portal>
    <portal to="page-actions">
      <Button class="primary" @click="createNewDashboard">Create</Button>
    </portal>
    <client-only>
      <Card v-for="(board, index) in boards" :key="`${index}-${board.name}`">
        <template #title> {{ board.name }}</template>
        <template #action>
          <Button class="primary" @click="link(index)">view</Button>
          <Button class="danger" @click="deleteDashboard(index)">X</Button>
        </template>
      </Card>
    </client-only>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { defaultSettings } from '@/constants/dashboard'
import { Button } from '@/components/atoms'
import { Card } from '@/components/molecules'
import { Widget } from '~/types/widgets'
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
} from '@/components/widgets'
import { Board } from '~/types/dashboards'

@Component({
  components: {
    Button,
    Card,
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
  },
})
export default class Dashboard extends Vue {
  defaultSettings = defaultSettings

  DashboardWidgets: any = null

  get boards() {
    return this.$store.getters['userSettings/boards']
  }

  get currentBoard(): Board | null {
    const currentBoard = this.$route.query.id as string
    if (!currentBoard && !this.boards[currentBoard]) {
      return null
    }
    return this.boards[currentBoard]
  }

  mounted() {
    this.$store.dispatch('userSettings/loadExistingSettings')
    this.loadWidgetsBasedOnId(this.currentBoard)
  }

  @Watch('currentBoard')
  loadWidgetsBasedOnId(currentBoard: Board | null) {
    if (!currentBoard) {
      return []
    }
    this.DashboardWidgets = this.getDashboardWidgets(currentBoard?.widgets)
  }

  // eslint-disable-next-line class-methods-use-this
  getDashboardWidgets(widgets: Widget[] | undefined) {
    if (!process.browser || !widgets) {
      return undefined
    }

    // to make sure we dont override the store, we copy it.
    const clonedWidgets = JSON.parse(JSON.stringify(widgets)) as Widget[]
    return clonedWidgets.map((widget) => {
      const widgetData = { ...widget }
      if (!widget.guid) {
        widgetData.guid = new Date().toUTCString()
      }
      return widgetData
    })
  }

  editDashboard() {
    this.$router.push({
      path: '/dashboards/edit',
      query: {
        id: this.$route.query.id,
      },
    })
  }

  link(id: number) {
    this.$router.push({ path: '/dashboards', query: { id: id.toString() } })
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

  createNewDashboard() {
    this.$store.commit('userSettings/CREATE_NEW_DASHBOARD')
    this.$store.dispatch('userSettings/loadExistingSettings')
  }

  deleteDashboard(dashboardIndex: number) {
    this.$store.commit('userSettings/REMOVE_DASHBOARD', dashboardIndex)
    this.$store.dispatch('userSettings/loadExistingSettings')
  }
}
</script>
