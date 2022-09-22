<template>
  <div>
    <client-only>
      <form ref="form" @submit.stop.prevent="submitForm">
        <portal to="page-title"
          ><i class="icon bi bi-car-front-fill"></i> Car</portal
        >
        <portal to="page-actions">
          <Button
            class="primary"
            :disabled="isLoading"
            type="submit"
            @submit.prevent="submitForm"
            @click="submitForm"
            >Save</Button
          >
        </portal>
        <div>
          <CardCollection>
            <Card v-for="(stat, statIndex) in stats" :key="`${statIndex}`">
              <template #title>
                <div class="form">
                  <label for="drivenDistance">
                    Driven Distance:
                    <FormInput
                      v-model="stat.drivenDistance"
                      class="form-field m-b"
                    />
                  </label>
                  <label for="refillAmount">
                    Refill Amount:
                    <FormInput
                      v-model="stat.refillAmount"
                      class="form-field m-b"
                    />
                  </label>
                  <label for="refillAmount">
                    Refill Date:
                    <FormInput
                      v-model="stat.refillDate"
                      class="form-field m-b"
                    />
                  </label>
                </div>
              </template>
              <p v-if="carDetails && carDetails.tankSize" class="consumption">
                {{
                  parseFloat(stat.drivenDistance / stat.refillAmount).toFixed(2)
                }}
                km/l
                <template
                  v-if="stats[statIndex - 1] && stats[statIndex - 1].refillDate"
                >
                  {{
                    new Date(
                      stats[statIndex - 1].refillDate
                    ).toLocaleDateString()
                  }}
                  -
                  {{ new Date(stat.refillDate).toLocaleDateString() }}
                  ({{
                    dateDiffInDays(
                      stats[statIndex - 1].refillDate,
                      stat.refillDate
                    )
                  }}
                  days)
                </template>
              </p>
              <template #action>
                <Button
                  v-if="stats.length > 1"
                  class="danger"
                  @click.prevent="removeStatItem(statIndex)"
                  ><i class="icon bi bi-x"></i
                ></Button>
              </template>
            </Card>
            <div class="new-item-wrapper">
              <Button class="primary" @click.prevent="addNewStatItem">+</Button>
            </div>
          </CardCollection>
        </div>
      </form>
    </client-only>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import { Button } from '@/components/atoms'
import { FormInput, Card, CardCollection } from '@/components/molecules'
import { useFetchCarDetails, useFuelStats } from '~/queries/car'
import {
  carDetailsGuidStorageKey,
  createOrUpdateFuelStats,
} from '~/modules/apis/car'
import { FuelStats } from '~/types/car/carDetails'
import { dateDiffInDays } from '~/constants/time'
export default defineComponent({
  name: 'CarMilageForm',
  components: {
    Button,
    FormInput,
    Card,
    CardCollection,
  },
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
}
</style>
