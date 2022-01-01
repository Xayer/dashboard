<template>
  <div>
    <CardCollection v-if="!!boards.length">
      <Card v-for="(board, index) in boards" :key="`${index}-${board.name}`">
        <template #title> {{ board.name }}</template>
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
  },
})
</script>
<style lang="scss" scoped>
.help-message {
  text-align: center;
  font-weight: var(--weight-thin);
}
</style>
