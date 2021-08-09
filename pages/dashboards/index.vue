<template>
    <div v-if="$route.query.id">
      <NuxtLink to="/dashboards">Back</NuxtLink>
      Dashboard {{ $route.query.id }}
    </div>
    <div v-else>
      Dashboard List
      <ul>
        <li v-for="id in 10" :key="id">
          <NuxtLink :to="{ path: 'dashboards', query: { id }}">
            Dashboard {{ id }}
          </NuxtLink>
        </li>
      </ul>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
@Component({})
export default class Dashboard extends Vue {
    created(){
      
    }
}
</script>