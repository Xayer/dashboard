<template>
  <div>
    <portal to="page-title">Settings</portal>
    <CardCollection>
      <Card v-for="route in routes" :key="route">
        <template #title>
          {{ route }}
        </template>
        <template #action>
          <Button class="primary" @click="link(route)">View</Button>
        </template>
      </Card>
    </CardCollection>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Card, CardCollection } from '@/components/molecules'
import { Button } from '@/components/atoms'

@Component({
  components: {
    Button,
    Card,
    CardCollection,
  },
})
export default class Settings extends Vue {
  head = {
    title: 'Settings',
  }

  routes = ['github', 'spotify', 'hue', 'location', 'car']

  link(route: string) {
    this.$router.push({ path: `settings/${route}` })
  }
}
</script>
