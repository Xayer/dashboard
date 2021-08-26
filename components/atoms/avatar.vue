<template>
  <nuxt-link to="/settings/login">
    <img v-if="avatar" :src="avatar" />
  </nuxt-link>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { mapGetters } from 'vuex'
@Component({
  computed: {
    ...mapGetters({
      avatar: 'userSettings/avatar',
    }),
  },
})
export default class Avatar extends Vue {
  @Prop({ default: 48 }) size!: number
  get avatar() {
    const image = this.$store.getters['userSettings/avatar']
    return image ? `${image}?s=${this.size}` : undefined
  }
}
</script>
<style lang="scss" scoped>
img {
  border-radius: var(--radius);
}
div {
  display: flex;
  align-items: center;
}
</style>
