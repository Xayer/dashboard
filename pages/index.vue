<template>
  <div>
    <client-only>
      <portal to="page-title"
        >Welcome back{{ accountName ? `, ${accountName}` : '' }}!</portal
      >
      <CardCollection>
        <div class="vue-grid-item">
          <WidgetWrapper v-if="city">
            <Weather :settings="{ units: 'metric', city }" />
          </WidgetWrapper>
        </div>

        <Card>
          <template #title>Explore Dashboards</template>
          <template #action>
            <Button class="primary" @click="link('/dashboards')"
              >Explore</Button
            >
          </template>
        </Card>
      </CardCollection>
      <div class="vue-grid-item todo-wrapper">
        <WidgetWrapper>
          <TodoList />
        </WidgetWrapper>
      </div>
    </client-only>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { Card, CardCollection } from '@/components/molecules'
import { Button } from '@/components/atoms'
import { userInfoStorageKey } from '~/constants/account'
import {
  Widget as WidgetWrapper,
  Weather,
  TodoList,
} from '@/components/widgets'
import { useFetchIpInfo } from '~/queries/ip-api'
import { cityStorageKey } from '~/constants/location'

export default defineComponent({
  name: 'Home',
  components: {
    Card,
    CardCollection,
    WidgetWrapper,
    Button,
    Weather,
    TodoList,
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
      return accountDetails && accountDetails?.name ? accountDetails?.name : ''
    })

    const cityFromSettings = computed(() => {
      if (!process.browser) {
        return {}
      }

      return JSON.parse(localStorage.getItem(cityStorageKey) || '""');
    });

    const { data, isFetching, refetch } = useFetchIpInfo()

    const city = computed(() => cityFromSettings.value || data.value?.city)

    return {
      accountName,
      city,
      isFetching,
      refetch,
    }
  },
  head: {
    title: 'Dashboard Home',
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

.todo-wrapper {
  width: 100%;
  height: calc(100vh - 272px);
  margin-top: var(--padding);
}
</style>
