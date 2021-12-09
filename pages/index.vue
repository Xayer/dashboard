<template>
  <div>
    <portal to="page-title"
      >Welcome back{{ accountName ? `, ${accountName}` : '' }}!</portal
    >
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
          <Button class="primary" @click="link('/settings/account')"
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
import { userInfoStorageKey } from '~/constants/account'
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

  get accountName() {
    if (!process.browser) {
      return {}
    }
    const accountDetails = JSON.parse(
      localStorage.getItem(userInfoStorageKey) as string
    )
    return accountDetails ? accountDetails.name : ''
  }
}
</script>
