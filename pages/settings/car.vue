<template>
  <div>
    <client-only>
      <pre>{{ carDetails }}</pre>
      <form ref="form" @submit.stop.prevent="submitForm">
        <label for="tankSize"
          >Tank Size:
          <FormInput v-model="tankSize" class="form-field m-b" />
        </label>
        <label for="name"
          >Car Name:
          <FormInput v-model="name" class="form-field m-b" />
        </label>
        <Button class="primary" :disabled="isLoading" @submit="submitForm"
          >Save</Button
        >
      </form>
      <CarMilageForm />
    </client-only>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import { Button } from '@/components/atoms'
import { FormInput } from '@/components/molecules'
import { CarMilageForm } from '@/components/organisms'
import { useFetchCarDetails } from '~/queries/car'
import {
  carDetailsGuidStorageKey,
  createOrUpdateCarDetails,
} from '~/modules/apis/car'
export default defineComponent({
  name: 'CarSettings',
  components: {
    Button,
    FormInput,
    CarMilageForm,
  },
  setup() {
    const gistGuid = process.browser
      ? (localStorage.getItem(carDetailsGuidStorageKey) as string)
      : ''

    const { data: carDetails, isLoading } = useFetchCarDetails({
      enabled: !!gistGuid,
      gistGuid,
    })

    const queryClient = useQueryClient()

    return {
      carDetails,
      isLoading,
      gistGuid,
      queryClient,
    }
  },
  data() {
    return {
      tankSize: '0',
      name: '',
    }
  },
  head: {
    title: 'Car Settings',
  },
  watch: {
    carDetails(details) {
      if (details.tankSize) {
        this.$data.tankSize = details.tankSize.toString()
      }
      if (details.name) {
        this.$data.name = details.name
      }
    },
  },
  methods: {
    submitForm() {
      createOrUpdateCarDetails({
        gistGuid: this.gistGuid,
        details: {
          ...this.carDetails,
          tankSize: Number.parseInt(`${this.tankSize}`),
          name: this.name,
        },
      }).then(() => {
        this.queryClient.invalidateQueries('carDetails')
      })
    },
  },
})
</script>
