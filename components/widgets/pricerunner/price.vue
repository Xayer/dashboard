<template>
  <div>
    <Value v-if="productInfo" :value="productInfo.value" :label="productInfo.label" :active="productInfo.active" />
    <Button
      class="refresh-button"
      :class="{ primary: isFetching }"
      @click="refetch"
      ><i class="bi bi-arrow-repeat" :class="{ spin: isFetching }"></i
    ></Button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useFetchProductInfo, parseProductInfo } from '~/queries/pricerunner'
import { Value, Button } from '~/components/atoms'
import { ValueProps } from '~/types/widgets/value'
export default defineComponent({
  name: 'Price',
  components: {
    Value,
    Button,
  },
  props: {
    settings: {
      type: Object,
      default: () => ({
        productId: '',
        country: 'dk',
      }),
    },
  },
  setup(props) {
    const { data, isFetching, refetch } = useFetchProductInfo(
      props.settings.productId,
      props.settings.country
    )

    const { value, label, active }: ValueProps = data.value ? parseProductInfo(data.value) : {
        value: '',
        label: '',
        active: false,
    };

    return { productInfo: { value, label, active }, isFetching, refetch };
  },
})
</script>
