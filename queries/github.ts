import { useQuery } from 'vue-query'
import { UserInfo } from '~/types/github/user'
import { githubGetUserInfo } from '~/modules/apis/github'
import { minutes } from '~/constants/time'

export function useFetchGithubUserInfo(username?: string) {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<UserInfo>(
      [`${username || 'self'}`, 'userInfo'],
      () => githubGetUserInfo(username),
      {
        enabled: true,
        staleTime: minutes(5),
      }
    )

  return { isLoading, isError, isFetching, data, error, refetch }
}
