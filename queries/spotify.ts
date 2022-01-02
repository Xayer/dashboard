import { useInfiniteQuery, useQuery } from 'vue-query'
import { minutes, seconds } from '~/constants/time'
import { getPlaybackState, getTopTracks } from '~/modules/apis/spotify'
import { PlayerStateResponse } from '~/types/spotify/PlayerState'
import { TopTracksResponse, TopTimeRange } from '~/types/spotify/topTracks'

export function useTopTracks(
  enabled: boolean,
  timeRange: TopTimeRange = 'medium_term'
) {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<TopTracksResponse>(
      [timeRange, 'spotifyTopTracks'],
      () => getTopTracks(timeRange),
      {
        enabled,
        staleTime: minutes(5),
      }
    )

  return { isLoading, isError, isFetching, data, error, refetch }
}

export function usePlaybackState(enabled: boolean) {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useInfiniteQuery<PlayerStateResponse>(
      'spotifyPlaybackState',
      () => getPlaybackState(),
      {
        enabled,
        staleTime: seconds(1),
        refetchInterval: seconds(1),
      }
    )

  return { isLoading, isError, isFetching, data, error, refetch }
}
