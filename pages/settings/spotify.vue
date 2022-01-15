<template>
  <div>
    <div class="setting-header">
      <h3 class="m-b">
        Spotify <b :class="[integrationActive ? 'on' : 'off']">O</b>
      </h3>
      <div>
        <a v-if="!integrationActive && !$route.query.code" :href="authUrl"
          >Authenticate with Spotify</a
        >
        <Select v-if="integrationActive && $route.query.code" v-model="timeRange" :options="timeRanges"></Select>
        <Button class="m-l danger" @click="clearSpotifyIntegration">X</Button>
      </div>
    </div>
    <CardCollection v-if="topTracks" class="tracks">
      <Card v-for="(topTrack, index) in topTracks" :key="topTrack.id">
        <template #title>
          {{ index + 1 }}
        </template>
        <img
          v-if="topTrack.album.images"
          :src="topTrack.album.images[2].url"
          :alt="`${topTrack.name} - ${topTrack.artists
            .map((artist) => artist.name)
            .join(', ')}`"
          :width="topTrack.album.images[2].width"
          :height="topTrack.album.images[2].height"
        />
        <div class="titles">
          <a class="title" :href="topTrack.href">{{ topTrack.name }}</a>
          <div class="artists">
            <a
              v-for="artist in topTrack.artists"
              :key="artist.id"
              :href="artist.href"
              >{{ artist.name }}</a
            >
          </div>
        </div>
      </Card>
    </CardCollection>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import {
  authenticateToken,
  authUrl,
  getTopTracks,
  integrationActiveStorageKey,
  storageKey,
} from '@/modules/apis/spotify'
import { Select, Button } from '@/components/atoms'
import { Card, CardCollection } from '@/components/molecules'

@Component({
  components: {
    Select,
    Button,
    Card,
    CardCollection,
  },
})
export default class SpotifyIntegrationPage extends Vue {
  topTracks = []
  timeRange = 'medium_term'
  timeRanges = [
    { text: '4 weeks', value: 'short_term' },
    { text: '6 months', value: 'medium_term' },
    { text: 'several years', value: 'long_term' },
  ]

  // eslint-disable-next-line class-methods-use-this
  get authUrl(): string {
    return authUrl
  }

  // eslint-disable-next-line class-methods-use-this
  get integrationActive() {
    if (!process.browser) {
      return
    }
    return (
      JSON.parse(localStorage.getItem(
        integrationActiveStorageKey
      ) as string || 'false') === true
    )
  }

  clearSpotifyIntegration() {
    if (!process.browser) {
      return
    }

    localStorage.removeItem(storageKey)
    localStorage.removeItem(integrationActiveStorageKey)
    this.$store.dispatch('userSettings/loadExistingSettings')
    this.fetchTopTracks();
  }

  @Watch('integrationActive')
  @Watch('timeRange')
  async fetchTopTracks() {
    if (!process.browser) {
      return
    }

    let existingToken = localStorage.getItem(storageKey)

    if (!this.integrationActive) {
      if (this.$route.query.code) {
        if (!existingToken || existingToken === 'undefined') {
          const response = await authenticateToken(
            this.$route.query.code as string
          )

          if (!response.error) {
            localStorage.setItem(
              storageKey,
              JSON.stringify(response.refresh_token)
            )
            localStorage.setItem(
              integrationActiveStorageKey,
              JSON.stringify(true)
            )
          } else {
            localStorage.removeItem(storageKey)
            localStorage.removeItem(integrationActiveStorageKey)
          }

          existingToken = localStorage.getItem(storageKey)
        }
      }
    }

    if (existingToken) {
      await getTopTracks(this.timeRange as 'medium_term')
        .then((topTracks) => {
          this.topTracks = topTracks.items
          localStorage.setItem(
            integrationActiveStorageKey,
            JSON.stringify(true)
          )
        })
        .catch(() => {
          localStorage.setItem(
            integrationActiveStorageKey,
            JSON.stringify(false)
          )
        })
    }
  }

  mounted() {
    this.fetchTopTracks()
  }
}
</script>
<style lang="scss">
section.tracks {
  & > .card {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--padding);
    padding: calc(var(--padding) / 2);
    a {
      color: var(--text-color);
    }
    .title {
      font-size: 1.25rem;
    }
    .artists {
      display: flex;
      gap: calc(var(--padding) / 4);
    }
  }
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--padding);
}

.on {
  color: var(--accent-success);
}
.off {
  color: var(--accent-danger);
}
</style>
