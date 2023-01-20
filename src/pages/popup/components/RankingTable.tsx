import React from 'react';
import moment from 'moment';
import useOPGGChampions from '../hooks/useOPGGChampions';
import useOPGGSummoners from '../hooks/useOPGGSummoners';
import { Datum } from '../models/summoner-type';
import Skeleton from './Skeleton';
import 'moment/dist/locale/zh-tw';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfinity } from '@fortawesome/free-solid-svg-icons';
import Pill from './Pill';
import { Account } from '../models/account-type';
moment.locale('zh-tw');

function LoadingRow({ borderB = true }: { borderB?: boolean }) {
  return (
    <tr className={`h-7 ${borderB ? `border-b` : 'rounded-b'}`}>
      <td className="p-1 whitespace-nowrap">
        <Skeleton className="h-4 " />
      </td>
      <td className="p-1 whitespace-nowrap">
        <Skeleton className="h-4 " />
      </td>
      <td className="p-1 whitespace-nowrap">
        <Skeleton className="h-4 " />
      </td>
      <td className="p-1 whitespace-nowrap">
        <Skeleton className="h-4 " />
      </td>
      <td className="p-1 whitespace-nowrap">
        <Skeleton className="h-4 " />
      </td>
    </tr>
  );
}

function ResultBadge({ result }: { result: string }) {
  if (result.toUpperCase() === 'WIN')
    return <Pill className="text-white bg-blue-600">W</Pill>;
  else if (result.toUpperCase() === 'LOSE')
    return <Pill className="text-white bg-red-600">L</Pill>;
  return <Pill className="bg-gray-500">R</Pill>;
}

const getKDA = (k: number, d: number, a: number) => {
  if (d === 0) return <FontAwesomeIcon icon={faInfinity} />;
  return <span>KDA: {Math.round(((k + a) / d) * 100) / 100}</span>;
};

interface RecordRowProps extends Datum {
  borderB?: boolean;
}
function RecordRow({ borderB = true, myData, created_at }: RecordRowProps) {
  const champions = useOPGGChampions();
  const champion = champions.data?.find((x) => x.id === myData.champion_id);
  const result = myData.stats.result;

  let bgColor = '';
  if (result.toUpperCase() === 'WIN') bgColor = 'bg-blue-200';
  else if (result.toUpperCase() === 'LOSE') bgColor = 'bg-red-100';

  return (
    <tr className={`h-7 ${borderB ? `border-b` : 'rounded-b'} ${bgColor}`}>
      <td className="p-1 text-xs whitespace-nowrap">
        <ResultBadge result={result} />
      </td>
      <td className="p-1 text-xs whitespace-nowrap">
        {moment(created_at).fromNow()}
      </td>
      <td className="p-1 text-xs whitespace-nowrap">{champion?.name}</td>
      <td className="p-1 text-xs whitespace-nowrap">
        {myData.stats.kill} / {myData.stats.death} / {myData.stats.assist}
      </td>
      <td className="p-1 text-xs whitespace-nowrap text-left">
        {getKDA(myData.stats.kill, myData.stats.death, myData.stats.assist)}
      </td>
    </tr>
  );
}

function LoadingRows() {
  return (
    <>
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow borderB={false} />
    </>
  );
}

function TableBody({
  isLoading,
  isError,
  data,
}: {
  isLoading: boolean;
  isError: boolean;
  data?: Datum[];
}) {
  if (isLoading || isError) return <LoadingRows />;
  return (
    <>
      {data?.map((datum, index) => (
        <RecordRow
          key={datum.id}
          borderB={index !== data.length - 1}
          {...datum}
        ></RecordRow>
      ))}
    </>
  );
}

export default function RankingTable({ server, summonerId }: Account) {
  const summoners = useOPGGSummoners({
    server,
    summonerId,
    limit: 10,
  });

  return (
    <div className="px-2">
      <div className="flex flex-row justify-center items-center rounded bg-gray-100 px-2">
        <div className="w-3/12 flex flex-col justify-center items-center gap-2">
          <div>牌位</div>
          <div>
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <div className="w-9/12 grid grid-cols-2 ">
          <div className="border-b border-black p-1 flex justify-center items-center">
            <div className="w-1/2">分數</div>
            <div className="w-1/2">
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <div className="border-b  border-black p-1  flex justify-center items-center">
            <div className="w-1/2">勝率</div>
            <div className="w-1/2">
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <div className="p-1  flex justify-center items-center">
            <div className="w-1/2">勝場</div>
            <div className="w-1/2">
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <div className="p-1  flex justify-center items-center">
            <div className="w-1/2">敗場</div>
            <div className="w-1/2">
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded bg-gray-100 mt-1">
        <table className="w-full">
          <thead>
            <tr>
              <th
                scope="col"
                colSpan={5}
                className="text-black text-xl py-1 border-b border-black"
              >
                近10場積分記錄
              </th>
            </tr>
          </thead>
          <tbody>
            <TableBody
              isLoading={summoners.isLoading}
              isError={summoners.isError}
              data={summoners.data}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
