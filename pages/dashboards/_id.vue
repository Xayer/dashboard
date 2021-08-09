<template>
    <div>Dashboard {{ this.$route.path }}</div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
@Component({})
export default class Dashboard extends Vue {
    asyncData({ params: { id } }: { params: { id: string}}) {
      return { id }
    }
}
</script>