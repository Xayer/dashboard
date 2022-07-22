<template>
  <div>
    <client-only>
      <form ref="form" @submit.stop.prevent="submitForm">
        <CardCollection
          v-for="(stat, statIndex) in stats"
          :key="`${statIndex}-${stat.drivenDistance}-${stat.refillAmount}`"
        >
          <Card>
            <pre>{{ stat }}</pre>
            <label for="name">
              Driven Distance:
              <FormInput v-model="stat.drivenDistance" class="form-field m-b" />
            </label>
            <label for="name">
              Refill Amount:
              <FormInput v-model="stat.refillAmount" class="form-field m-b" />
            </label>
            <template #action>
              <Button class="danger" @click.prevent="removeStatItem(statIndex)"
                >remove</Button
              >
            </template>
            <p v-if="carDetails && carDetails.tankSize">
              {{
                parseFloat(stat.drivenDistance / stat.refillAmount).toFixed(2)
              }}
              km/l
            </p>
          </Card>
        </CardCollection>
        <Button class="primary" @click.prevent="addNewStatItem">+</Button>
        <Button
          class="primary"
          :disabled="isLoading"
          type="submit"
          @submit="submitForm"
          >Save</Button
        >
      </form>
    </client-only>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import { Button } from '@/components/atoms'
import { FormInput, Card, CardCollection } from '@/components/molecules'
import { useFuelStats } from '~/queries/car'
import {
  carDetailsGuidStorageKey,
  createOrUpdateFuelStats,
} from '~/modules/apis/car'
import { FuelStats } from '~/types/car/carDetails'
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
      queryClient,
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
  watch: {
    fuelStats(stats: FuelStats) {
      if (stats.length >= 1) {
        this.$data.stats = [
          ...stats.map(({ drivenDistance, refillAmount }) => ({
            drivenDistance: drivenDistance.toString(),
            refillAmount: refillAmount.toString(),
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
          ...(this.stats.map(({ drivenDistance, refillAmount }) => ({
            drivenDistance: Number.parseFloat(drivenDistance),
            refillAmount: Number.parseFloat(refillAmount),
          })) as FuelStats),
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
      })
    },
    removeStatItem(itemIndex: number) {
      this.stats.splice(itemIndex, 1)
    },
  },
})
</script>
