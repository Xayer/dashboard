<template>
    <div v-if="$route.query.id">
      <NuxtLink :to="{ path: '/dashboards' }">Back</NuxtLink>
      Dashboard {{ $route.query.id }}
    </div>
    <div v-else>
      Dashboard List
      <Card v-for="id in 10" :key="id">
        <template #title>
          Dashboard {{ id }}
        </template>
        <template #action>
          <Button class="primary" @click="link(id)">Dashboard {{ id }}</Button>
        </template>
      </Card>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Card }  from '@/components/molecules';
import { Button } from '@/components/atoms';
@Component({
  components: {
    Card,
    Button,
  }
})
export default class Dashboard extends Vue {
    link(id: number){
      this.$router.push({ path: '/dashboards', query: { id: id.toString() }});
    }
}
</script>
