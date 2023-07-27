<template>
  <table>
    <thead>
      <th>Refill</th>
      <th>Distance</th>
      <th>km/l</th>
      <th>Days</th>
      <th>From Date</th>
      <th>To Date</th>
    </thead>
    <tbody>
      <tr v-for="(stat, statIndex) in stats" :key="`${statIndex}`">
        <td>
          <span class="form-field m-b">{{ stat.refillAmount }} l</span>
        </td>
        <td for="drivenDistance">{{ stat.drivenDistance }}km</td>
        <td>
          <template v-if="stat && stat.drivenDistance && stat.refillAmount">
            {{ parseFloat(stat.drivenDistance / stat.refillAmount).toFixed(2) }}
            km/l
          </template>
        </td>
        <td v-if="stats[statIndex - 1] && stats[statIndex - 1].refillDate">
          {{ dateDiffInDays(stats[statIndex - 1].refillDate, stat.refillDate) }}
          days
        </td>
        <td>
          {{
            stats[statIndex - 1] && stats[statIndex - 1].refillDate
              ? new Date(stats[statIndex - 1].refillDate).toLocaleDateString()
              : ''
          }}
        </td>
        <td>
          {{ new Date(stat.refillDate).toLocaleDateString() }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import { useFetchCarDetails, useFuelStats } from '~/queries/car'
import {
  carDetailsGuidStorageKey,
  createOrUpdateFuelStats,
} from '~/modules/apis/car'
import { FuelStats } from '~/types/car/carDetails'
import { dateDiffInDays } from '~/constants/time'
export default defineComponent({
  name: 'CarMilageTable',
  setup() {
    const gistGuid = process.browser
      ? (localStorage.getItem(carDetailsGuidStorageKey) as string)
      : ''

    const { data: carDetails } = useFetchCarDetails({
      enabled: !!gistGuid,
      gistGuid,
    })

    const {
      data: fuelStats,
      isLoading,
      isError,
    } = useFuelStats({
      enabled: !!gistGuid,
      gistGuid,
    })

    const queryClient = useQueryClient()

    return {
      fuelStats,
      isLoading,
      isError,
      gistGuid,
      carDetails,
      queryClient,
    }
  },
  data() {
    return {
      stats: [
        {
          drivenDistance: '0',
          refillAmount: '0',
          refillDate: new Date().toISOString(),
        },
      ],
      name: '',
    }
  },
  head: {
    title: 'Car Fuel Stats Form',
  },
  watch: {
    fuelStats(stats: FuelStats) {
      if (stats.length >= 1) {
        this.$data.stats = [
          ...stats.map(({ drivenDistance, refillAmount, refillDate }) => ({
            drivenDistance: drivenDistance.toString(),
            refillAmount: refillAmount.toString(),
            refillDate: refillDate.toString(),
          })),
        ]
      }
    },
  },
  methods: {
    submitForm() {
      createOrUpdateFuelStats({
        gistGuid: this.gistGuid,
        stats: [
          ...(this.stats.map(
            ({ drivenDistance, refillAmount, refillDate }) => ({
              drivenDistance: Number.parseFloat(drivenDistance),
              refillAmount: Number.parseFloat(refillAmount),
              refillDate,
            })
          ) as FuelStats),
        ],
        createNew: this.isError,
      }).then(() => {
        this.queryClient.invalidateQueries('fuelStats')
      })
    },
    addNewStatItem() {
      this.stats.push({
        drivenDistance: '0',
        refillAmount: '0',
        refillDate: new Date().toISOString(),
      })
    },
    removeStatItem(itemIndex: number) {
      this.stats.splice(itemIndex, 1)
    },
    dateDiffInDays,
  },
})
</script>
<style lang="scss" scoped>
.form {
  display: flex;
  align-items: center;
  justify-content: center;
  label {
    gap: 0;
    & + label {
      margin-top: 0;
    }
  }
}
.new-item-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-bottom: (var(--padding));
}

table {
  border-collapse: collapse;
  width: 100%;
  background-color: var(--accent-50);
  margin: var(--padding) 0;
}

tbody {
  border-bottom: 2px solid var(--accent-100);
  font-family: var(--font-family);
}

tbody td {
  padding: var(--padding) calc(var(--padding) / 2);
}

tbody tr:not(:last-of-type) {
  border-bottom: 1px solid var(--accent-0);
}

tbody tr:hover:not(:last-of-type) {
  background-color: var(--accent-secondary);
}
</style>
