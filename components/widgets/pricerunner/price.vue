<template>
  <div>
    <Value v-if="productInfo" :value="productInfo.value" :label="productInfo.label" :state="productInfo.state" />
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
        name: '',
      }),
    },
  },
  setup(props) {
    const { data, isFetching, refetch } = useFetchProductInfo(
      props.settings.productId,
      props.settings.country
    )

    const productInfo = computed(() => {
      const { value, label, state }: ValueProps = data.value ? parseProductInfo(data.value) : {
          value: '',
          label: '',
          state: 'danger',
      };

      return { value, label: props.settings.name ? props.settings.name : label, state }
    });

    return { productInfo, isFetching, refetch };
  },
})
</script>
