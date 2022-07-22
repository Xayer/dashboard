<template>
  <div>
    <client-only>
      <pre>{{ carDetails }}</pre>
      <form ref="form" @submit.stop.prevent="submitForm">
        <label for="tankSize"
          >Tank Size:
          <FormInput
            v-model="tankSize"
            type="number"
            name="tankSize"
            class="form-field m-b"
          />
        </label>
        <Button class="primary" @submit="submitForm">Save</Button>
      </form>
    </client-only>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { Button } from '@/components/atoms'
import { FormInput } from '@/components/molecules'
import { useFetchCarDetails } from '~/queries/car'
export default defineComponent({
  name: 'CarSettings',
  components: {
    Button,
    FormInput,
  },
  setup() {
    const { data: carDetails, refetch } = useFetchCarDetails()

    return {
      carDetails,
      refetch,
    }
  },
  head: {
    title: 'Car Settings',
  },
  methods: {
    submitForm: () => {},
  },
})
</script>
