import { useQuery } from 'vue-query'
import { minutes } from '~/constants/time'
import { getTopTracks } from '~/modules/apis/spotify'
import { TopTracksResponse, TopTimeRange } from '~/types/spotify/topTracks'

export function useTopTracks(
  enabled: boolean,
  timeRange: TopTimeRange = 'medium_term'
) {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<TopTracksResponse>(
      [timeRange, 'topTracks'],
      () => getTopTracks(timeRange),
      {
        enabled,
        staleTime: minutes(5),
      }
    )

  return { isLoading, isError, isFetching, data, error, refetch }
}
