<template>
  <div>
    <a v-if="!integrationActive && !$route.query.code" :href="authUrl"
      >Authenticate with Spotify</a
    >
    <CardCollection v-if="integrationActive && topTracks" class="tracks">
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
    <Button
      class="refresh-button"
      :class="{ primary: isFetching }"
      @click="refetch"
      ><i class="bi bi-arrow-repeat" :class="{ spin: isFetching }"></i
    ></Button>
  </div>
</template>
<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { integrationActiveStorageKey } from '@/modules/apis/spotify'
import { authUrl as spotifyAuthUrl } from '~/modules/apis/spotify'
import { useTopTracks } from '@/queries/spotify'
import { Card, CardCollection } from '@/components/molecules'
import { Button } from '@/components/atoms'
export default defineComponent({
  name: 'SpotifyTopTracks',
  components: {
    Button,
    Card,
    CardCollection,
  },
  props: {
    settings: {
      type: Object,
      default: () => ({
        range: '',
      }),
    },
  },
  setup(props) {
    const authUrl = spotifyAuthUrl

    const integrationActive = computed(
      () =>
        JSON.parse(localStorage.getItem(integrationActiveStorageKey)) === true
    )

    const { isLoading, isError, isFetching, data, refetch } = useTopTracks(
      !!integrationActive,
      props.settings.range
    )

    const topTracks = computed(() =>
      data.value && data.value?.items ? data.value?.items : []
    )

    return {
      authUrl,
      integrationActive,
      isLoading,
      isError,
      isFetching,
      topTracks,
      refetch,
    }
  },
})
</script>
<style lang="scss">
.widget div[type='SpotifyTopTracks'] {
  height: inherit;
  overflow-y: scroll;
}
</style>
<style lang="scss" scoped>
section.tracks {
  display: flex;
  flex-direction: column;
  gap: calc(var(--padding) / 4);
  & > .card {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--padding);
    background-color: var(--accent-100);
    padding: 0 calc(var(--padding) / 2);
    overflow-y: visible;
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
</style>
