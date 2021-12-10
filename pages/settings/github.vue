<template>
  <div>
    <client-only>
      <pre v-if="authCode">
        {{ authCode }}
    </pre
      >
      <a v-else :href="authorizationUrl">Login with Github</a>
    </client-only>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  useRoute,
} from '@nuxtjs/composition-api'
import {
  githubAuthorizationUrl,
  githubGetAccessToken,
  localStorageStateKey,
} from '@/modules/apis/github'
export default defineComponent({
  name: 'GithubSettings',
  setup() {
    const route = useRoute()
    const authCode = computed(() => route.value.query.code)
    const state = computed(() => route.value.query.state)
    const authorizationUrl = computed(() => githubAuthorizationUrl())
    let authorizationSuccessful = false
    let loginSuccessful = false

    onMounted(async () => {
      if (authCode.value && state.value) {
        if (!process.browser) {
          return
        }
        // compare state with what was set in localStorage before authorizing
        if (localStorage.getItem(localStorageStateKey) !== state.value) {
          authorizationSuccessful = false
        }

        localStorage.removeItem(localStorageStateKey)

        const response = await githubGetAccessToken(authCode.value as string)
        console.log(response)

        if (response.access_token) {
          console.log(response.access_token)
          loginSuccessful = true
        } else {
          loginSuccessful = false
        }
        route.value.query.code = ''
      }
    })

    return {
      authCode,
      authorizationUrl,
      authorizationSuccessful,
      loginSuccessful,
    }
  },
})
</script>