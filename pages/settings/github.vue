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
      <pre v-if="debugEnabled">{{
        {
        userInfo,
        token
        }
      }}
      <Button @click="clearGithubData">Clear Data</Button>
      </pre>
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
  watch,
} from '@nuxtjs/composition-api'
import { Button } from '@/components/atoms'
import {
  githubAuthorizationUrl,
  githubGetAccessToken,
  githubTokenStorageKey,
  githubStateStorageKey,
  githubUserInfoStorageKey,
} from '@/modules/apis/github'
import { useFetchGithubUserInfo } from '@/queries/github'
export default defineComponent({
  name: 'GithubSettings',
  components: {
    Button,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authCode = computed(() => route.value.query.code)
    const state = computed(() => route.value.query.state)
    const authorizationUrl = computed(() => githubAuthorizationUrl())
    const isAuthorized = ref(false)
    const authorizationSuccessful = ref(false)
    const token = ref('')
    const { data: userInfo } = useFetchGithubUserInfo()
    const debugEnabled = computed(() => !!route.value.query.debug)
    watch(userInfo, () => {
      if (token.value && userInfo.value?.id) {
        localStorage.setItem(
          githubUserInfoStorageKey,
          JSON.stringify(userInfo.value)
        )
        isAuthorized.value = true
      }
    })

    onMounted(async () => {
      if (!process.browser) {
        return
      }
      // if user is already authenticated and has a token
      const tokenFromLocalStorage = localStorage.getItem(
        githubTokenStorageKey
      ) as string
      if (tokenFromLocalStorage) {
        token.value = tokenFromLocalStorage
      }
      if (token.value !== null) {
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
          isAuthorized.value = true
        }
        router.replace({ query: {} })
      }
    })

    return {
      authCode,
      authorizationUrl,
      authorizationSuccessful,
      isAuthorized,
      userInfo,
      debugEnabled,
      token,
    }
  },
  methods: {
    clearGithubData() {
      if (!process.browser) {
        return
      }
      localStorage.removeItem(githubStateStorageKey)
      localStorage.removeItem(githubTokenStorageKey)
      localStorage.removeItem(githubUserInfoStorageKey)
    },
  },
})
</script>