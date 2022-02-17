<template>
  <div>
    <client-only v-if="currentBoard">
      <portal to="page-title">Edit Dashboard</portal>
      <portal to="page-actions">
        <Button key="view-dashboard" class="m-r m-b" @click="viewDashboard"
          >View Dashboard</Button
        >
        <span v-show="errorMessage" key="dashboardErrors" class="error m-b">{{
          errorMessage
        }}</span>
        <Select
          key="selectDashboardWidgets"
          v-model="selectedWidget"
          class="m-b"
          :options="widgetOptions"
        />
        <Button key="addWidget" class="m-l m-b" @click="addWidget"
          >Add Widget</Button
        >
        <Button
          key="saveDashboard"
          class="primary m-l m-b"
          @click="saveWidgetLayout"
          >Save Dashboard</Button
        >
      </portal>
      <grid-layout
        v-if="DashboardWidgets"
        :layout.sync="DashboardWidgets"
        :cols="defaultSettings.columns"
        :row-height="defaultSettings.columnHeight"
        :is-draggable="true"
        :is-resizable="true"
        :margin="defaultSettings.margin"
        :use-css-transforms="true"
        :responsive="true"
      >
        <grid-item
          v-for="(item, itemIndex) in DashboardWidgets"
          :key="`${item.i}${item.guid}`"
          :i="item.i"
          :w="item.w"
          :h="item.h"
          :x="item.x"
          :y="item.y"
          :min-w="item.minW || 1"
          :min-h="item.minH || 1"
          :max-w="item.maxW || Infinity"
          :max-h="item.maxH || Infinity"
          :drag-allow-from="'.drag'"
        >
          <WidgetWrapper>
            <div class="settings-header m-b">
              <span class="drag m-r"><i class="bi bi-arrows-move"></i></span>
              <h2>
                {{
                  WidgetTitles && WidgetTitles[item.type]
                    ? WidgetTitles[item.type]
                    : item.type
                }}
              </h2>
              <span class="remove m-l" @click="removeWidget(itemIndex)">
                <i class="bi bi-x-circle"></i>
              </span>
              <Button @click="openSettingsPanel(item.guid)">Settings</Button>
            </div>
          </WidgetWrapper>
          <portal
            v-if="item.guid === currentSettings"
            :key="currentSettings"
            to="widget-settings"
          >
            <component
              :is="widgetSettingsComponent(item.type)"
              v-model="DashboardWidgets[itemIndex].settings"
            />
          </portal>
          <portal
            v-if="item.guid === currentSettings"
            :key="`${currentSettings}-name`"
            to="widget-settings-title"
          >
            {{ item.type }}
          </portal>
        </grid-item>
      </grid-layout>
      <p v-else>
        No Widgets added yet. Select a widget from the dropdown and click "Add
        Widget".
      </p>
    </client-only>
    <template v-else> Board not found :( </template>
    <Sidebar v-model="settingsOpen">
      <template #title>
        <portal-target name="widget-settings-title" />
      </template>
      <template #default>
        <portal-target name="widget-settings" />
      </template>
    </Sidebar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Watch } from 'nuxt-property-decorator'
import { Select, Button } from '@/components/atoms'
import { Sidebar } from '@/components/molecules'
import WidgetSettings from '@/components/widgets/settings.vue'
import WeatherSettings from '@/components/widgets/weather/settings.vue'
import {
  WidgetDefaultSettings,
  WidgetsAvailable,
  WidgetTitles,
} from '@/constants/widgets'
import {
  dasboardsLocalStorageKey,
  defaultSettings,
} from '@/constants/dashboard'
import WidgetWrapper from '@/components/widgets/widget.vue'
import { Widget } from '~/types/widgets'
import { Board } from '~/types/dashboards'
import HueGroupSettings from '~/components/widgets/hue/group/settings.vue'
import { SpotifyTopTracksSettings } from '~/components/widgets'
import { githubSyncDashboardToGist } from '~/modules/apis/github'

@Component({
  components: {
    WidgetSettings,
    Select,
    Button,
    Sidebar,
    Weather: WeatherSettings,
    HueGroup: HueGroupSettings,
    WidgetWrapper,
    Forecast: WeatherSettings,
    SpotifyTopTracks: SpotifyTopTracksSettings,
  },
})
export default class EditableDashboard extends Vue {
  defaultSettings = defaultSettings

  errorMessage = ''

  selectedWidget: string = WidgetsAvailable.TextWidget.toString()

  DashboardWidgets?: any = null

  WidgetTitles = WidgetTitles

  currentSettings = ''

  settingsOpen = false

  widgetOptions = Object.values(WidgetsAvailable).map((widget) => ({
    text: widget,
    value: widget,
  }))

  created() {
    this.DashboardWidgets = this.getDashboardWidgets(this.currentBoard?.widgets)
  }

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

  addWidget() {
    if (!WidgetDefaultSettings[this.selectedWidget]) {
      this.errorMessage = "Widget doesn't have any default settings"
      return
    }
    const widgetSettings = WidgetDefaultSettings[this.selectedWidget]

    const maxYCoords = Math.max(
      ...this.DashboardWidgets.map((widget: Widget) => widget.y),
      0
    )

    const newSettings = {
      ...widgetSettings,
      i: Date.now(),
      guid: Date.now(),
      x: 0,
      y: maxYCoords ? maxYCoords + 1 : 0,
    }
    this.DashboardWidgets.push(newSettings)
  }

  // eslint-disable-next-line class-methods-use-this
  async saveWidgetLayout() {
    if (!process.browser || !this.currentBoard) {
      return
    }
    
    const { id } = await githubSyncDashboardToGist(this.DashboardWidgets, this.currentBoard?.guid, this.currentBoard?.name);

    const existingBoards = JSON.parse(
      localStorage.getItem(dasboardsLocalStorageKey) || JSON.stringify([])
    )
    // make a copy of the existing boards
    const newBoards = JSON.parse(JSON.stringify(existingBoards))
    newBoards[this.$route.query.id as string] = {
      ...this.currentBoard,
      widgets: this.DashboardWidgets,
      guid: id || null,
    }

    localStorage.setItem(dasboardsLocalStorageKey, JSON.stringify(newBoards))
  }

  removeWidget(widgetIndex: number) {
    const { guid } = this.DashboardWidgets[widgetIndex]
    if (this.currentSettings === guid) {
      this.currentSettings = ''
    }

    this.DashboardWidgets.splice(widgetIndex, 1)
  }

  viewDashboard() {
    this.$router.push({
      path: '/dashboards',
      query: {
        id: this.$route.query.id,
      },
    })
  }

  widgetSettingsComponent(widget: string) {
    if (
      this.$options.components &&
      Object.keys(this!.$options!.components).includes(widget)
    ) {
      return widget
    }
    return 'WidgetSettings'
  }

  openSettingsPanel(widgetGuid: string) {
    if (this.currentSettings === widgetGuid) {
      this.currentSettings = ''
      this.settingsOpen = false
      return
    }
    this.currentSettings = widgetGuid
    this.settingsOpen = true
  }

  // since we can close the sidebar with the close button, we need to clear the settings too.
  @Watch('settingsOpen')
  watchSettingsSidebar(visible: boolean) {
    if (!visible) {
      this.currentSettings = ''
    }
  }
}
</script>
<style lang="scss">
.error {
  color: red;
}
.debug {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  color: var(--secondary);
  margin-right: var(--padding);
}

.vue-grid-item {
  & > .vue-resizable-handle {
    /* Styling from .bi-arrow-down-right */
    &::before {
      content: '\f123';
      display: inline-block;
      font-family: bootstrap-icons !important;
      font-style: normal;
      font-weight: normal !important;
      font-variant: normal;
      text-transform: none;
      line-height: 1;
      vertical-align: -0.125em;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    position: absolute;
    bottom: var(--padding);
    right: var(--padding);
    /** reset of the original styling from framework */
    padding: 0;
    background: none;
  }

  .vue-resizable-handle,
  .drag,
  .remove {
    color: var(--text-color);
    font-size: 20px;
  }
}

.settings-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  justify-content: center;
  align-items: center;
  > * {
    font-size: 1rem;
    font-weight: var(--weight-normal);
  }
  text-transform: uppercase;
}
</style>
