<template>
  <div v-if="$route.query.id || $route.query.gist">
    <client-only>
      <portal v-if="$route.query.id" to="page-actions">
        <Button class="primary m-b" @click="editDashboard">Edit</Button>
      </portal>
      <DashboardViewer
        v-if="currentBoard"
        :dashboard-widgets="DashboardWidgets"
        :name="currentBoard.name"
      />
      <portal v-else to="page-title">Board not found :(</portal>
    </client-only>
  </div>
  <div v-else>
    <portal to="page-title">Dashboards</portal>
    <portal to="page-actions">
      <Button class="primary" @click="createNewDashboard">Create</Button>
    </portal>
    <client-only>
      <DashboardList :boards="boards" @input="updateDashboardName" />
    </client-only>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import {
  dasboardsLocalStorageKey,
  defaultSettings,
} from '@/constants/dashboard'
import { Button } from '@/components/atoms'
import { Card, CardCollection } from '@/components/molecules'
import { Widget } from '~/types/widgets'
import { Board } from '~/types/dashboards'
import { DashboardList, DashboardViewer } from '@/components/organisms'
import {
  githubFetchDashboardWidgetsFromGist,
  githubSyncDashboardToGist,
} from '~/modules/apis/github'

@Component({
  components: {
    Button,
    DashboardList,
    Card,
    CardCollection,
    DashboardViewer,
  },
})
export default class Dashboard extends Vue {
  head = {
    title: 'Dashboards',
  }

  defaultSettings = defaultSettings

  DashboardWidgets: any = null

  currentBoard: Board | null = null

  get boards() {
    return this.$store.getters['userSettings/boards']
  }

  get gistId() {
    return this.$route.query.gist
  }

  get boardId() {
    return this.$route.query.id
  }

  @Watch('gistId')
  @Watch('boardId')
  async fetchBoard() {
    if (this.boardId) {
      const currentBoard = this.boardId as string
      if (!currentBoard && !this.boards[currentBoard]) {
        return null
      }
      this.currentBoard = this.boards[currentBoard]
      return
    }
    if (this.gistId) {
      this.currentBoard = await this.fetchDashboardWidgetsFromGist(
        this.gistId as string
      )
      return
    }
    this.currentBoard = null
  }

  mounted() {
    this.$store.dispatch('userSettings/loadExistingSettings')
    this.fetchBoard()
  }

  @Watch('currentBoard')
  loadWidgetsBasedOnId(currentBoard: Board | null) {
    if (!currentBoard) {
      return []
    }
    this.DashboardWidgets = this.getDashboardWidgets(currentBoard?.widgets)
  }

  async fetchDashboardWidgetsFromGist(gist: string): Promise<Board | null> {
    const { files } = await githubFetchDashboardWidgetsFromGist(gist)
    if (!files || !files['dashboard.json']?.content) {
      return null
    }
    const dashboard = await JSON.parse(files['dashboard.json']?.content)

    return {
      widgets: dashboard.widgets,
      guid: dashboard.guid,
      name: dashboard.name,
    }
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

  updateDashboardName({
    name: dashboardName,
    index: dashboardEditIndex,
    guid: dashboardGuid,
  }: {
    name: string
    index: number
    guid: string
  }) {
    const newDashboards = JSON.parse(JSON.stringify([...this.boards]))

    newDashboards[dashboardEditIndex].name = dashboardName

    if (dashboardGuid) {
      githubSyncDashboardToGist(
        newDashboards[dashboardEditIndex],
        dashboardGuid,
        dashboardName
      )
    }

    localStorage.setItem(
      dasboardsLocalStorageKey,
      JSON.stringify(newDashboards)
    )
    this.$store.dispatch('userSettings/loadExistingSettings')
  }
}
</script>
