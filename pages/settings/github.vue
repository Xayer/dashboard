<template>
  <div>
    <client-only>
      <div>
        <p v-if="authCode">Authenticating...</p>
        <a v-if="!isAuthorized" :href="authorizationUrl">Login with Github</a>
      </div>
      <p v-if="isAuthorized && userInfo">
        <pre>{{ userInfo }}</pre>
      </p>
    </client-only>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import {
  githubAuthorizationUrl,
  githubGetAccessToken,
  githubTokenStorageKey,
  githubStateStorageKey,
} from '@/modules/apis/github'
import { userInfoStorageKey } from '~/constants/account'
import { useFetchGithubUserInfo } from '@/queries/github'
export default defineComponent({
  name: 'GithubSettings',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authCode = computed(() => route.value.query.code)
    const state = computed(() => route.value.query.state)
    const authorizationUrl = computed(() => githubAuthorizationUrl())
    const isAuthorized = ref(false)
    const authorizationSuccessful = ref(false)
    const loginSuccessful = ref(false)
    const userInfo = ref({})

    onMounted(async () => {
      if (!process.browser) {
        return
      }
      // if user is already authenticated and has a token
      const token = localStorage.getItem(githubTokenStorageKey)
      if (token) {
        const { data } = useFetchGithubUserInfo()
        if (data.value?.id) {
          localStorage.setItem(userInfoStorageKey, JSON.stringify(data.value))
          userInfo.value = data.value
          isAuthorized.value = true
        }
        return
      }

      if (authCode.value && state.value) {
        // compare state with what was set in localStorage before authorizing
        if (localStorage.getItem(githubStateStorageKey) !== state.value) {
          authorizationSuccessful.value = false
        } else {
          authorizationSuccessful.value = true
        }

        localStorage.removeItem(githubStateStorageKey)

        const response = await githubGetAccessToken(authCode.value as string)

        if (response.access_token) {
          localStorage.setItem(githubTokenStorageKey, response.access_token)
          loginSuccessful.value = true
        }
        router.replace({ query: {} })
      }
    })

    return {
      authCode,
      authorizationUrl,
      authorizationSuccessful,
      loginSuccessful,
      isAuthorized,
      userInfo,
    }
  },
})
</script>