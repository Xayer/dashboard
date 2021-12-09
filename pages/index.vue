<template>
  <div>
    <portal to="page-title"
      >Welcome back{{ accountName ? `, ${accountName}` : '' }}!</portal
    >
    <CardCollection class="m-b">
      <div class="vue-grid-item">
        <WidgetWrapper>
          <Location />
        </WidgetWrapper>
      </div>
      <div class="vue-grid-item">
        <WidgetWrapper v-if="city">
          <Weather :settings="{ units: 'metric', city }" />
        </WidgetWrapper>
      </div>
    </CardCollection>

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
import { computed, defineComponent } from '@vue/composition-api'
import { Card, CardCollection } from '@/components/molecules'
import { Button } from '@/components/atoms'
import { userInfoStorageKey } from '~/constants/account'
import {
  Widget as WidgetWrapper,
  Location,
  Weather,
} from '@/components/widgets'
import { useFetchIpInfo } from '~/queries/ip-api'

export default defineComponent({
  name: 'Home',
  components: {
    Card,
    CardCollection,
    WidgetWrapper,
    Location,
    Button,
    Weather,
  },
  props: {
    settings: {
      type: Object,
      default: () => ({
        address: '',
      }),
    },
  },
  setup(_props) {
    const accountName = computed(() => {
      if (!process.browser) {
        return {}
      }
      const accountDetails = JSON.parse(
        localStorage.getItem(userInfoStorageKey) as string
      )
      return accountDetails ? accountDetails.name : ''
    })

    const { data, isFetching, refetch } = useFetchIpInfo()

    const city = computed(() => data.value?.city)

    return {
      accountName,
      city,
      isFetching,
      refetch,
    }
  },
  methods: {
    link(path: string) {
      this.$router.push({ path })
    },
  },
})
</script>
<style lang="scss">
.location-box {
  background-color: var(--accent-50);
  .value {
    text-transform: uppercase;
  }
}
</style>
