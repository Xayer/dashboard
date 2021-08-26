<template>
  <div>
    <portal to="page-title">Welcome!</portal>
    <CardCollection>
      <Card>
        <template #title>Explore Dashboards</template>
        <template #action>
          <Button class="primary" @click="link('/dashboards')">Explore</Button>
        </template>
      </Card>
      <Card>
        <template #title>Setup Account </template>
        <template #action>
          <Button class="primary" @click="link('/settings/login')"
            >Setup</Button
          >
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
    Card,
    Button,
    CardCollection,
  },
})
export default class Frontpage extends Vue {
  link(path: string) {
    this.$router.push({ path })
  }
}
</script>
