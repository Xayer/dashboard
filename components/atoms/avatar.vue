<template>
    <img :src="`${avatar}?s=${size}`" />
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { mapGetters } from 'vuex'
@Component({
    computed: {
        ...mapGetters({
            'avatar' : 'userSettings/avatar'
        })
    }
})
export default class Avatar extends Vue {
    @Prop({ default: 48}) size!: number;
    avatar!: string;
}
</script>