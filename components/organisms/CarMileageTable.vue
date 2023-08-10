<template>
  <ag-grid-vue
    style="width: 100%; height: 100vh"
    class="ag-theme-alpine-dark"
    :column-defs="columnDefs"
    :row-data="fuelStats"
    :defaultColDef="defaultColDef"
  >
  </ag-grid-vue>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import { useFetchCarDetails, useFuelStats } from '~/queries/car'
import {
  carDetailsGuidStorageKey,
  createOrUpdateFuelStats,
} from '~/modules/apis/car'
import { FuelStats, FuelStat } from '~/types/car/carDetails'
import { dateDiffInDays } from '~/constants/time'
import { ValueFormatterParams, ValueGetterParams } from 'ag-grid-community'
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
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        sortable: true,
        filter: true,
      },
      columnDefs: [
        {
          field: 'refillAmount',
          headerName: 'Refill',
          valueFormatter: ({ data }: ValueFormatterParams<FuelStat>) => {
            return data && data.refillAmount
              ? new Intl.NumberFormat('da-DK', {
                  style: 'unit',
                  unit: 'liter',
                }).format(data.refillAmount)
              : ''
          },
        },
        {
          field: 'drivenDistance',
          headerName: 'Distance',
          valueFormatter: ({ data }: ValueFormatterParams<FuelStat>) => {
            return data && data.drivenDistance
              ? new Intl.NumberFormat('da-DK', {
                  style: 'unit',
                  unit: 'kilometer',
                }).format(data.drivenDistance)
              : ''
          },
        },
        {
          headerName: 'km/l',
          valueFormatter: ({ data }: ValueGetterParams<FuelStat>) => {
            return data && data.drivenDistance && data.refillAmount
              ? (data.drivenDistance / data.refillAmount).toFixed(2)
              : 0
          },
          valueGetter: ({ data }: ValueGetterParams<FuelStat>) => {
            return data && data.drivenDistance && data.refillAmount
              ? data.drivenDistance / data.refillAmount
              : 0
          },
        },
        {
          headerName: 'Days',
          valueGetter: ({ data, api, node }: ValueGetterParams<FuelStat>) => {
            if (!node || !data) {
              return 0
            }
            const statIndex = node.rowIndex
            if (statIndex === 0 || statIndex === null) {
              return 0
            }
            const previousRow = api.getDisplayedRowAtIndex(statIndex - 1)

            if (!previousRow || !previousRow.data) {
              return 0
            }

            if (previousRow && previousRow.data.refillDate && data.refillDate) {
              const diff = dateDiffInDays(
                previousRow.data.refillDate,
                data.refillDate
              )
              return diff
            }
            return 0
          },
        },
        {
          headerName: 'From',
          valueGetter: ({
            data,
            api,
            node,
          }: ValueFormatterParams<FuelStat>) => {
            if (!node || !data) {
              return 0
            }
            const statIndex = node.rowIndex
            if (statIndex === 0 || statIndex === null) {
              return 0
            }
            const previousRow = api.getDisplayedRowAtIndex(statIndex - 1)

            if (!previousRow || !previousRow.data) {
              return 0
            }

            return previousRow && previousRow.data.refillDate
              ? new Date(previousRow.data.refillDate)
              : 0
          },
          valueFormatter: ({
            data,
            api,
            node,
          }: ValueFormatterParams<FuelStat>) => {
            if (!node || !data) {
              return ''
            }
            const statIndex = node.rowIndex
            if (statIndex === 0 || statIndex === null) {
              return ''
            }
            const previousRow = api.getDisplayedRowAtIndex(statIndex - 1)

            if (!previousRow || !previousRow.data) {
              return ''
            }

            return previousRow && previousRow.data.refillDate
              ? new Date(previousRow.data.refillDate).toLocaleDateString()
              : ''
          },
        },
        {
          field: 'refillDate',
          headerName: 'To',
          valueFormatter: ({ data }: ValueFormatterParams<FuelStat>) =>
            data && data.refillDate
              ? new Date(data.refillDate).toLocaleDateString()
              : '',
        },
      ],
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
