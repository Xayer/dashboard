<template>
  <div>
    <Value
      v-if="isSuccess"
      :value="stockData.value"
      :title="stockData.title"
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
import { parseStockPrice } from '~/modules/apis/alpha'

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

    const stockData = computed(() => {
      if (data?.value) {
        const formattedData = parseStockPrice(data?.value)
        return {
          value: formattedData.value,
          label: formattedData.label,
          state: formattedData.state,
          title: formattedData.title,
        } as ValueProps
      } else {
        return {
          value: 'N/A',
          label: 'N/A',
          title: props.settings.stockName,
          state: 'danger',
        }
      }
    })

    return {
      stockData,
      refetch,
      isFetching,
      isSuccess,
    }
  },
})
</script>
