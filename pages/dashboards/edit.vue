<template>
    <div>Edit Dashboard {{ id }}</div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
@Component({})
export default class EditDashboard extends Vue {
    asyncData({ params: { id } }: { params: { id: string}}) {
      return { id }
    }
}
</script>