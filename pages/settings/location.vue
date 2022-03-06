<template>
  <div>
    <form ref="form" @submit.stop.prevent="submitForm">
      <label for="city"
        >city:
        <FormInput v-model="city" type="text" name="city" class="form-field m-b" />
      </label>
      <Button
       class="primary"
        @submit="submitForm"
        >Save</Button
      >
    </form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapGetters } from 'vuex'
import { FormInput } from '@/components/molecules'
import { Button } from '@/components/atoms'
import { cityStorageKey } from '~/constants/location'

@Component({
  components: {
    FormInput,
    Button,
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'userSettings/isAuthenticated',
    }),
  },
})
export default class LocationSettings extends Vue {
  head = {
    title: 'Location Settings',
  }

  city = ''

  getCurrentCity() {
    if (!process.browser) {
      return ''
    }
    return JSON.parse(localStorage.getItem(cityStorageKey) || '""')
  }

  created() {
    this.city = this.getCurrentCity() as string;
  }

  // eslint-disable-next-line class-methods-use-this
  submitForm() {
    if (!process.browser) {
      return {}
    }
    const { city } = this

    localStorage.setItem(cityStorageKey, JSON.stringify(city))
  }
}
</script>
