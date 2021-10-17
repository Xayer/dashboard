<template>
  <div>
    <Value v-if="addressBalance" :value="addressBalance.value" :label="addressBalance.label" :state="addressBalance.state" />
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
import { useFetchAddressBalance, parseAccountBalance, useFetchEtherPrice } from '~/queries/etherscan'
import { Value, Button } from '~/components/atoms'
import { ValueProps } from '~/types/widgets/value'
export default defineComponent({
  name: 'AddressBalance',
  components: {
    Value,
    Button,
  },
  props: {
    settings: {
      type: Object,
      default: () => ({
        address: ''
      }),
    },
  },
  setup(props) {
    const { data, isFetching, refetch } = useFetchAddressBalance(
      props.settings.address
    )

    const { data: usdEtherPrice } = useFetchEtherPrice(
    )

    const addressBalance = computed(() => {
      const { value, label, state }: ValueProps = data.value && usdEtherPrice.value ? parseAccountBalance(data.value, usdEtherPrice.value) : {
          value: '',
          label: 'not available',
          state: 'danger',
      };

      return { value, label: props.settings.name ? props.settings.name : label, state }
    });

    return { addressBalance, isFetching, refetch };
  },
})
</script>
