<template>
  <div>
    <div class="setting-header">
      <div>
        <a :href="authUrl">Authenticate with Nordea</a>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Select, Button } from '@/components/atoms'
import { Card, CardCollection } from '@/components/molecules'
import { authenticateToken, nordeaAuthUrl } from '~/constants/nordea'

@Component({
  components: {
    Select,
    Button,
    Card,
    CardCollection,
  },
})
export default class SpotifyIntegrationPage extends Vue {
  head = {
    title: 'Spotify Settings',
  }

  // eslint-disable-next-line class-methods-use-this

  authUrl = nordeaAuthUrl()

  async requestAccessToken() {
    console.log(this.$route.query.code)
    const response = await authenticateToken(
      this.$route.query.code as string
    ).catch(() => {
      this.$route.query.code = ''
    })
    console.log(response)
  }

  mounted() {
    if (this.$route.query.code) {
      this.requestAccessToken()
    }
  }
}
</script>
