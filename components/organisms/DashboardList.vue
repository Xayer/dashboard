<template>
  <div>
    <CardCollection v-if="!!boards.length">
      <Card v-for="(board, index) in boards" :key="`${index}-${board.name}`">
        <template #title>
          <input
            v-if="dashboardEditIndex === index"
            v-model="dashboardName"
            class="edit-form"
            autofocus
            type="text"
            @blur="saveModifiedTodoItem"
          />
          <span
            v-show="dashboardEditIndex !== index"
            @click="editDashboardName(index, $event)"
            >{{ board.name }}</span
          >
        </template>
        <template #action>
          <Button class="primary" @click="link(index)">view</Button>
          <Button class="danger" @click="deleteDashboard(index)">X</Button>
        </template>
      </Card>
    </CardCollection>
    <p v-else class="help-message">
      Looks like you have no dashboards yet. Why not
      <a href="#" @click.prevent="createNewDashboard">create one</a>? :D
    </p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { Button } from '~/components/atoms'
import { Card, CardCollection } from '~/components/molecules'
import { Board } from '~/types/dashboards'

export default defineComponent({
  name: 'DashboardList',
  components: {
    Button,
    Card,
    CardCollection,
  },
  props: {
    boards: {
      type: Array,
      default: () => [],
    },
  },
  setup(_props) {},
  data() {
    return {
      dashboardName: '',
      dashboardEditIndex: -1,
      dashboardGuid: '',
    }
  },
  methods: {
    deleteDashboard(dashboardIndex: number) {
      this.$store.commit('userSettings/REMOVE_DASHBOARD', dashboardIndex)
      this.$store.dispatch('userSettings/loadExistingSettings')
    },
    link(id: number) {
      this.$router.push({ path: '/dashboards', query: { id: id.toString() } })
    },
    createNewDashboard() {
      this.$store.commit('userSettings/CREATE_NEW_DASHBOARD')
      this.$store.dispatch('userSettings/loadExistingSettings')
    },
    editDashboardName(index: number, event: Event) {
      this.$data.dashboardEditIndex = index
      const board = (this.$props.boards as Board[])[index];
      this.$data.dashboardName = board.name
      this.$data.dashboardGuid = board.guid || ''

      const parent = (event.target as HTMLElement).parentElement
      setTimeout(() => {
        parent?.querySelector<HTMLElement>('.edit-form')?.focus()
      }, 50)
    },
    saveModifiedTodoItem() {
      this.$emit('input', {
        name: this.$data.dashboardName,
        index: this.$data.dashboardEditIndex,
        guid: this.$data.dashboardGuid
      })
      this.$data.dashboardEditIndex = -1
      this.$data.dashboardName = ''
    },
  },
})
</script>
<style lang="scss" scoped>
.help-message {
  text-align: center;
  font-weight: var(--weight-thin);
}

input {
  // margin: calc(var(--padding) / 4) 0;
  max-width: 100%;
  margin-left: calc(var(--padding) / -4);
  padding: calc(var(--padding) / 4) calc(var(--padding) / 4);
  text-transform: uppercase;
  font-weight: var(--weight-normal);
  font-size: 12px;
}
</style>
