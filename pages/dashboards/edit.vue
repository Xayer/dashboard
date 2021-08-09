<template>
    <div v-if="$route.query.id">
        <NuxtLink to="/dashboards">Back</NuxtLink>
      Edit Dashboard {{ $route.query.id }}
    </div>
    <div v-else>
      Edit Dashboard List
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
export default class EditDashboard extends Vue {
    created(){
      
    }
}
</script>