<template>
  <div>
    <Value
      class="location-box"
      title="Location"
      :value="city"
      :label="`${regionName}, ${country}`"
    />
    <Button
      class="refresh-button"
      :class="{ primary: isFetching }"
      @click="refetch"
      ><i class="bi bi-arrow-repeat" :class="{ spin: isFetching }"></i
    ></Button>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { Button, Value } from '@/components/atoms'
import { useFetchIpInfo } from '~/queries/ip-api'

export default defineComponent({
  name: 'Location',
  components: {
    Value,
    Button,
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
    const { data, isFetching, refetch } = useFetchIpInfo()

    const city = computed(() => data.value?.city)

    const regionName = computed(() => data.value?.region)

    const country = computed(() => data.value?.country)

    return {
      city,
      isFetching,
      regionName,
      country,
      refetch,
    }
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