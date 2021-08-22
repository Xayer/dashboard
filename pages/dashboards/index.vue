<template>
  <div v-if="$route.query.id">
    <client-only>
      <template v-if="currentBoard">
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
      </template>
      <template v-else>
        Board not found :(
      </template>
    </client-only>
  </div>
  <div v-else>
    Dashboard List
    <client-only>
    <Card v-for="(board, index) in boards" :key="board.name">
      <template #title> {{board.name }}</template>
      <template #action>
        <Button class="primary" @click="link(index)">view</Button>
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
} from '@/components/widgets'
import { Board } from '~/types/dashboards'
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

  get boards() {
    return this.$store.getters['userSettings/boards'];
  }

  get currentBoard(): Board | null {
    const currentBoard = this.$route.query.id as string;
      if(!currentBoard) {
        return null;
      }
      return this.boards[currentBoard];
  }

  mounted() {
    this.loadWidgetsBasedOnId(this.currentBoard);
  }

  @Watch('currentBoard')
  loadWidgetsBasedOnId(currentBoard: Board | null) {
    this.DashboardWidgets = this.getDashboardWidgets(currentBoard?.widgets);
  }

  // eslint-disable-next-line class-methods-use-this
  getDashboardWidgets(widgets: Board[] | undefined) {
    if (!process.browser || !widgets) {
      return undefined
    }

    // to make sure we dont override the store, we copy it.
    const clonedWidgets = JSON.parse(JSON.stringify(widgets)) as Widget[];
    return clonedWidgets.map((widget) => {
      const widgetData = { ...widget }
      if (!widget.guid) {
        widgetData.guid = new Date().toUTCString()
      }
      return widgetData
    });
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
}
</script>
