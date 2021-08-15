<template>
  <div>
    <h3 class="m-b">Spotify</h3>
    <a v-if="!integrationActive && !$route.query.code" :href="authUrl"
      >Authenticate with Spotify</a
    >
    <section v-if="topTracks">
      <article v-for="topTrack in topTracks" :key="topTrack.id">
        <img
          v-if="topTrack.album.images"
          :src="topTrack.album.images[2].url"
          :alt="`${topTrack.name} - ${topTrack.artists.join(', ')}`"
          :width="topTrack.album.images[2].width"
          :height="topTrack.album.images[2].height"
        />
        <div class="titles">
          <h2>
            <a :href="topTrack.href">{{ topTrack.name }}</a>
          </h2>
          <h3 v-for="artist in topTrack.artists" :key="artist.id">
            <a :href="artist.href">{{ artist.name }}</a>
          </h3>
        </div>
      </article>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import {
  authenticateToken,
  clientId,
  getTopTracks,
  integrationActiveStorageKey,
  redirectUri,
  storageKey,
} from '@/modules/apis/spotify'

@Component({})
export default class SpotifyIntegrationPage extends Vue {
  topTracks = []

  // eslint-disable-next-line class-methods-use-this
  get authUrl(): string {
    return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-currently-playing%20
user-top-read`
  }

  // eslint-disable-next-line class-methods-use-this
  get integrationActive() {
    if (!process.browser) {
      return
    }
    return (
      JSON.stringify(localStorage.getItem(integrationActiveStorageKey)) ===
      'true'
    )
  }

  @Watch('integrationActive')
  async fetchTopTracks() {
    if (!process.browser) {
      return
    }

    const existingToken = localStorage.getItem(storageKey)
    if (!this.integrationActive) {
      if (this.$route.query.code) {
        if (!existingToken || existingToken === 'undefined') {
          const response = await authenticateToken(
            this.$route.query.code as string
          )
          localStorage.setItem(
            storageKey,
            JSON.stringify(response.refresh_token)
          )
          localStorage.setItem(
            integrationActiveStorageKey,
            JSON.stringify(true)
          )
        }
      } else {
        return
      }
    }

    await getTopTracks()
      .then((topTracks) => {
        this.topTracks = topTracks.items
        localStorage.setItem(integrationActiveStorageKey, JSON.stringify(true))
      })
      .catch(() => {
        localStorage.setItem(integrationActiveStorageKey, JSON.stringify(false))
      })
  }

  mounted() {
    this.fetchTopTracks()
  }
}
</script>
<style lang="scss">
section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  article {
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 10px;
    background-color: var(--dark-bg-alt);
    .titles {
      padding: 5px;
    }
  }
}
</style>
