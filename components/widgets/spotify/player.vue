<template>
  <div>
    <a v-if="!integrationActive" :href="authUrl">Authenticate with Spotify</a>
    <template v-if="integrationActive">
      <Card v-if="currentTrack">
        <img
          v-if="currentTrack.album.images"
          :src="currentTrack.album.images[2].url"
          :alt="`${currentTrack.name} - ${currentTrack.artists
            .map((artist) => artist.name)
            .join(', ')}`"
          :width="currentTrack.album.images[2].width"
          :height="currentTrack.album.images[2].height"
        />
        <div class="titles">
          <a class="title" :href="currentTrack.href">{{ currentTrack.name }}</a>
          <div class="artists">
            <a
              v-for="artist in currentTrack.artists"
              :key="artist.id"
              :href="artist.href"
              >{{ artist.name }}</a
            >
          </div>
        </div>
        <div
          class="stats"
          :class="isPlaying ? 'on' : 'off'"
          :style="trackProgressStyling"
        ></div>

        <Button
          class="play-button"
          :class="{ primary: isTogglingPlayState }"
          @click="togglePlayState(isPlaying)"
        >
          <i v-if="isPlaying" class="icon bi bi-pause"></i>
          <i v-else class="icon bi bi-play"></i>
        </Button>
      </Card>
    </template>
  </div>
</template>
<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import {
  integrationActiveStorageKey,
  authUrl as spotifyAuthUrl,
  pauseTrack,
  playTrack,
} from '@/modules/apis/spotify'
import { usePlaybackState } from '@/queries/spotify'
import { Card } from '@/components/molecules'
import { Button } from '@/components/atoms'

export default defineComponent({
  name: 'SpotifyPlayer',
  components: {
    Card,
    Button,
  },
  props: {
    settings: {
      type: Object,
      default: () => {},
    },
  },
  setup(_props) {
    const authUrl = spotifyAuthUrl

    const integrationActive = computed(
      () =>
        JSON.parse(localStorage.getItem(integrationActiveStorageKey)) === true
    )

    const { isLoading, isError, isFetching, data, refetch } = usePlaybackState(
      !!integrationActive
    )

    const playbackState = computed(() => data.value)

    const currentTrack = computed(() =>
      data.value && data.value.pages[0].item ? data.value.pages[0].item : null
    )

    const playStateProgress = computed(() =>
      data.value && data.value.pages[0].progress_ms
        ? data.value.pages[0].progress_ms
        : 0
    )

    const trackDuration = computed(() => currentTrack.value?.duration_ms || 0)

    const currentTrackPlayProgress = computed(() => {
      return trackDuration && playStateProgress
        ? 100 -
            ((trackDuration.value - playStateProgress.value) * 100) /
              trackDuration.value
        : 0
    })

    const trackProgressStyling = computed(
      () => `--percentage: ${currentTrackPlayProgress.value}%`
    )

    const isPlaying = computed(() => data.value?.pages[0].is_playing)

    return {
      authUrl,
      integrationActive,
      isLoading,
      isError,
      isFetching,
      playbackState,
      currentTrack,
      currentTrackPlayProgress,
      isPlaying,
      trackProgressStyling,
      refetch,
    }
  },
  data() {
    return {
      isTogglingPlayState: false,
    }
  },
  methods: {
    togglePlayState(isPlaying) {
      const playStateCallback = isPlaying ? pauseTrack : playTrack
      this.$data.isTogglingPlayState = true

      playStateCallback().then(() => {
        this.$data.isTogglingPlayState = false
      })
    },
  },
})
</script>
<style lang="scss" scoped>
div[type='SpotifyPlayer'] {
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  width: calc((var(--widget-padding) * 2) + 100%);
  height: calc((var(--widget-padding) * 2) + 100%);
  margin: calc(var(--widget-padding) * -1);
  box-sizing: border-box;
}
.card {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--padding);
  height: 100%;
  width: 100%;
  background-color: var(--accent-50);
  padding: 0 calc(var(--padding) / 2);
  padding-bottom: calc(var(--padding) / 4);
  overflow-y: visible;
  position: relative;
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

.stats {
  --percentage: 0%;
  z-index: 2;
  --progress-height: calc(var(--padding) / 16);
  font-size: 0.65rem;
  bottom: calc(var(--progress-height) * 4);
  right: 0;
  left: 0;
  position: absolute;
  display: block;
  height: var(--progress-height);
  background-color: var(--accent-100);
  &::before {
    transition: width 0.25s ease;
    content: '';
    width: var(--percentage);
    height: var(--progress-height);
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: var(--accent-success);
    border-radius: var(--radius);
  }
  &.off::before {
    background-color: var(--accent-danger);
  }
}
.play-button {
  font-size: 1.5rem;
}
</style>
