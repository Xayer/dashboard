<template>
    <div>
        <div>Settings</div>
        <Card v-for="route in routes" :key="route">
            <template #title>
            {{ route }}
            </template>
            <template #action>
            <Button class="primary" @click="link(route)">View</Button>
            </template>
        </Card>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Card } from '@/components/molecules';
import { Button } from '@/components/atoms';

@Component({
    components: {
        Button,
        Card,
    }
})
export default class Settings extends Vue {
    routes = [
        'login',
        'spotify'
    ];

    link(route: string){
      this.$router.push({ path: `settings/${route}` });
    }
}
</script>