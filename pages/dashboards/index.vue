<template>
  <div v-if="$route.query.id">
    <client-only>
      <NuxtLink :to="{ path: '/dashboards' }">Back</NuxtLink>
      <!-- <portal to="page-title">Dashboard</portal> -->
      <!-- <portal to="page-actions"> -->
      <Button class="primary m-b" @click="editDashboard">Edit</Button>
      <!-- </portal> -->
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
              :is="item.type"
              :settings="item.settings"
              :dimensions="{ w: item.w, h: item.h }"
            ></component>
          </widget-wrapper>
        </grid-item>
      </grid-layout>
    </client-only>
  </div>
  <div v-else>
    Dashboard List
    <Card v-for="id in 10" :key="id">
      <template #title> Dashboard {{ id }} </template>
      <template #action>
        <Button class="primary" @click="link(id)">Dashboard {{ id }}</Button>
      </template>
    </Card>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { defaultSettings } from '@/constants/dashboard'
import { Button } from '@/components/atoms'
import { Card } from '@/components/molecules'
import { widgetsLocalStorageKey } from '~/constants/widgets'
import { Widget } from '~/types/widgets'
import {
  Widget as WidgetWrapper,
  Text,
  Weather,
  Forecast,
  TodoList,
  RejseplanenDeparture,
} from '@/components/widgets'
// import HueBridges from '@/components/widgets/hue/bridges.vue';
// import HueLight from '@/components/widgets/hue/light.vue';
// import HueGroup from '@/components/widgets/hue/group/group.vue';

@Component({
  components: {
    Button,
    Card,
    TextWidget: Text,
    // HueBridges,
    // HueLight,
    // HueGroup,
    RejseplanenDeparture,
    WidgetWrapper,
    TodoList,
    Weather,
    Forecast,
  },
})
export default class Dashboard extends Vue {
  defaultSettings = defaultSettings

  DashboardWidgets: any = null

  created() {
    this.DashboardWidgets = this.getDashboardWidgets()
  }

  // eslint-disable-next-line class-methods-use-this
  getDashboardWidgets() {
    let widgets = []
    if (!process.browser) {
      return null
    }
    if (localStorage.getItem(widgetsLocalStorageKey)) {
      const parsedWidgets = JSON.parse(
        localStorage.getItem(widgetsLocalStorageKey) || ''
      )
      if (typeof parsedWidgets === 'object') {
        widgets = parsedWidgets
        widgets.map((widget: Widget) => {
          const widgetData = { ...widget }
          if (!widget.guid) {
            widgetData.guid = new Date().toUTCString()
          }
          return widgetData
        })
      }
    }
    return widgets
  }

  editDashboard() {
    this.$router.push({
      name: 'dashboard-edit',
      params: {
        id: this.$route.params.id,
      },
    })
  }

  link(id: number) {
    this.$router.push({ path: '/dashboards', query: { id: id.toString() } })
  }
}
</script>
