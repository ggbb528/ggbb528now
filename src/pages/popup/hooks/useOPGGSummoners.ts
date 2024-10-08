import { useQuery } from '@tanstack/react-query';
import { Datum, GameType } from '../models/summoner-type';

const OPGG_API_URL =
  'https://op.gg/api/v1.0/internal/bypass/games/{SERVER}/summoners/{SUMMONER_ID}';

export default function useOPGGSummoners({
  limit = 10,
  lang = 'zh_TW',
  server,
  summonerId,
  gameType = GameType.SoloRanked,
}: {
  limit?: number;
  lang?: string;
  server: 'kr' | 'tw';
  summonerId: string;
  gameType?: GameType;
}) {
  // prettier-ignore
  const API_URL = OPGG_API_URL
  .replace('{SERVER}', server)
  .replace('{SUMMONER_ID}',summonerId);

  return useQuery({
    queryKey: ['summoners', server, summonerId, gameType],
    queryFn: () =>
      fetch(
        `${API_URL}?${new URLSearchParams({
          hl: lang,
          game_type: gameType,
          limit: `${limit}`,
        })}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((response) => response.data as Datum[]),
    staleTime: 60000,
  });
}
