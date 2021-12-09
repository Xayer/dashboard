<template>
  <div>
    <template v-if="isAuthenticated">
      <portal to="page-title">Welcome back, {{ accountDetails.name }}!</portal>
      <Button
        :class="isAuthenticated ? 'primary' : 'danger'"
        :disabled="!isAuthenticated"
        @click="downloadSettings"
        ><i class="bi bi-download"></i> Download Settings</Button
      >
      <Button
        class="m-l"
        :class="isAuthenticated ? 'primary' : 'danger'"
        :disabled="!isAuthenticated"
        @click="uploadSettings"
        ><i class="bi bi-upload"></i> Upload Settings</Button
      >
      <Button
        class="m-l"
        :class="isAuthenticated ? 'primary' : 'danger'"
        :disabled="!isAuthenticated"
        @click="signOut"
        ><i class="bi bi-box-arrow-in-right"></i> Sign out</Button
      >
    </template>
    <form v-else ref="form" @submit.stop.prevent="submitForm">
      <label for="username"
        >Username:
        <FormInput v-model="username" name="username" class="form-field m-b" />
      </label>
      <label for="password"
        >Password:
        <FormInput
          v-model="password"
          name="password"
          type="password"
          class="form-field m-b"
        />
      </label>
      <div v-if="error" class="error m-b">{{ error }}</div>
      <Button
        :class="isAuthenticated ? 'danger' : 'primary'"
        :disabled="isAuthenticated"
        @submit="submitForm"
        >Authenticate</Button
      >
    </form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapGetters } from 'vuex'
import { FormInput } from '@/components/molecules'
import { Button } from '@/components/atoms'
import { themeStorageKey } from '~/constants/themes'
import { userInfoStorageKey } from '~/constants/account'

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
export default class Login extends Vue {
  password = ''

  username = ''

  error = ''

  $ref!: {
    form: typeof HTMLFormElement
  }

  get accountDetails() {
    if (!process.browser) {
      return {}
    }
    return JSON.parse(localStorage.getItem(userInfoStorageKey) as string)
  }

  // eslint-disable-next-line class-methods-use-this
  submitForm() {
    const { username, password } = this
    this.error = ''
    this.$store
      .dispatch('userSettings/authenticate', { username, password })
      .catch((error) => {
        this.error = error
      })
  }

  downloadSettings() {
    this.$store.dispatch('userSettings/download').then(() => {
      this.updateLocalSettings()
    })
  }

  uploadSettings() {
    this.$store.dispatch('userSettings/upload').then(() => {
      this.updateLocalSettings()
    })
  }

  updateLocalSettings() {
    this.$store.dispatch(
      'themes/setTheme',
      JSON.parse(localStorage.getItem(themeStorageKey) || '')
    )
  }

  signOut() {
    this.$store.dispatch('userSettings/signOut')
  }
}
</script>
<style lang="scss" scoped>
.error {
  color: var(--danger);
}
</style>
