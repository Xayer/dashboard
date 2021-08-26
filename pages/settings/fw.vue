<template>
    <pre>{{ response }}</pre>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
@Component({})
export default class FitnessWorld extends Vue {
    response = [];

    async created() {
        const call = await fetch('https://www.fitnessworld.com/dk/dashboard/overview/training/year').then((response) => response.json()).catch((error) => console.error(error));
        console.log(call);
    }
}
</script>