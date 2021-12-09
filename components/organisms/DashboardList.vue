<template>
  <CardCollection>
    <Card v-for="(board, index) in boards" :key="`${index}-${board.name}`">
      <template #title> {{ board.name }}</template>
      <template #action>
        <Button class="primary" @click="link(index)">view</Button>
        <Button class="danger" @click="deleteDashboard(index)">X</Button>
      </template>
    </Card>
  </CardCollection>
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
  },
})
</script>