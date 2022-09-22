<template>
  <div>
    <client-only>
      <Value
        v-if="isSuccess"
        :value="`${totalDistance.toLocaleString()}km`"
        title="total driven"
        :label="`${
          fuelStats.length
        } refuels - average ${averageDrivenDistance.toLocaleString()}km (${parseFloat(
          totalDistance / totalFuelConsumed
        ).toFixed(2)}km/l)`"
      />
      <Button
        class="refresh-button"
        :class="{ primary: isFetching }"
        @click="refetch"
        ><i class="bi bi-arrow-repeat" :class="{ spin: isFetching }"></i
      ></Button>
    </client-only>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import { Button, Value } from '@/components/atoms'
import { useFuelStats } from '~/queries/car'
import { carDetailsGuidStorageKey } from '~/modules/apis/car'
import { FuelStat, FuelStats } from '~/types/car/carDetails'
export default defineComponent({
  name: 'CarTotalDistance',
  components: {
    Value,
    Button,
  },
  setup() {
    const gistGuid = process.browser
      ? (localStorage.getItem(carDetailsGuidStorageKey) as string)
      : ''

    const {
      data: fuelStats,
      isLoading,
      isError,
      isFetching,
      refetch,
      isSuccess,
    } = useFuelStats({
      enabled: !!gistGuid,
      gistGuid,
    })

    const queryClient = useQueryClient()

    return {
      isLoading,
      isFetching,
      isError,
      gistGuid,
      queryClient,
      refetch,
      isSuccess,
      fuelStats,
    }
  },
  data() {
    return {
      stats: [
        {
          drivenDistance: '0',
          refillAmount: '0',
        },
      ],
      name: '',
    }
  },
  head: {
    title: 'Car Fuel Stats Form',
  },
  computed: {
    totalDistance() {
      return this.fuelStats
        ? (this.fuelStats as FuelStats).reduce(
            (acc: number, curentStat: FuelStat) => {
              return parseFloat(`${curentStat.drivenDistance}`) + acc
            },
            0
          )
        : 0
    },
    totalFuelConsumed() {
      return this.fuelStats
        ? (this.fuelStats as FuelStats).reduce(
            (acc: number, curentStat: FuelStat) => {
              return parseFloat(`${curentStat.refillAmount}`) + acc
            },
            0
          )
        : 0
    },
    averageDrivenDistance() {
      return this.fuelStats
        ? (this.fuelStats as FuelStats).reduce(
            (acc: number, curentStat: FuelStat) => {
              return parseFloat(`${curentStat.drivenDistance}`) + acc
            },
            0
          ) / (this.fuelStats as FuelStats).length
        : 0
    },
    averageMilage() {},
  },
})
</script>
