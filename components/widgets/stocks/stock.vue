<template>
  <div>
    <Value
      v-if="isSuccess"
      :value="stockData.value"
      :label="stockData.label"
      :state="stockData.state"
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
import { Value, Button } from '~/components/atoms'
import { useFetchStockPrice } from '@/queries/stock'
import { ValueProps } from '~/types/widgets/value'

export default defineComponent({
  name: 'StockPrice',
  components: {
    Value,
    Button,
  },
  props: {
    settings: {
      type: Object,
      default: () => ({
        stockName: '',
      }),
    },
  },
  setup(props) {
    const interval = '60min' // [1min, 5min, 15min, 30min, 60min]
    const { data, refetch, isFetching, isSuccess } = useFetchStockPrice(
      props.settings.stockName,
      interval
    )

    console.dir({
      test: data.value,
    })

    const stockData = computed(() =>
      data?.value
        ? ({
            value: data?.value?.value,
            label: data?.value?.label,
            state: data?.value?.state,
          } as ValueProps)
        : {
            value: 'N/A',
            label: 'sad',
            state: 'danger',
          }
    )

    return {
      stockData,
      refetch,
      isFetching,
      isSuccess,
    }
  },
})
</script>
