<template>
  <div>
    <client-only>
      <template v-if="!!gistGuid">
        <CardCollection>
          <Card>
            <Widget>
              <CarTotalDistance />
            </Widget>
          </Card>
          <Card>
            <Widget>
              <form ref="form" class="form" @submit.stop.prevent="submitForm">
                <label for="tankSize"
                  >Tank Size:
                  <FormInput v-model="tankSize" class="form-field m-b" />
                </label>
                <label for="name"
                  >Car Name:
                  <FormInput v-model="name" class="form-field m-b" />
                </label>
                <Button
                  class="primary"
                  :disabled="isLoading"
                  @submit="submitForm"
                  >Save</Button
                >
                <Button class="danger" @click="removeGistId">disconnect</Button>
              </form>
            </Widget>
          </Card>
        </CardCollection>
        <CarMilageForm />
      </template>
      <template v-else>
        <form ref="form" @submit.stop.prevent="setGistId">
          <FormInput
            v-model="newGistGuid"
            aria-placeholder="gist uuid"
            class="form-field m-b"
          /><Button class="primary" @submit="setGistId">Save</Button>
        </form>
      </template>
    </client-only>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import { Button } from '@/components/atoms'
import { FormInput, Card, CardCollection } from '@/components/molecules'
import { CarMilageForm } from '@/components/organisms'
import { useFetchCarDetails } from '~/queries/car'
import {
  carDetailsGuidStorageKey,
  createOrUpdateCarDetails,
} from '~/modules/apis/car'
import { CarTotalDistance, Widget } from '~/components/widgets'
export default defineComponent({
  name: 'CarSettings',
  components: {
    Button,
    FormInput,
    CarMilageForm,
    Card,
    CardCollection,
    CarTotalDistance,
    Widget,
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
      newGistGuid: '',
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
    removeGistId() {
      localStorage.removeItem(carDetailsGuidStorageKey)
      window.location.reload()
    },
    setGistId() {
      localStorage.setItem(carDetailsGuidStorageKey, this.newGistGuid)
      window.location.reload()
    },
  },
})
</script>
