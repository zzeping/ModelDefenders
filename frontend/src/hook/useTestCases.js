import { useQuery } from 'react-query';
import APIClient from '../services/api-client'; 
import useBattleFieldStore from '../store/battleFieldStore';

const testCasesApiClient = new APIClient('/testCase/game');

const useGameTestCases = () => {
  const gameId = useBattleFieldStore((state) => state.gameId);
  return useQuery('testCases', async () => {

    const testCases = await testCasesApiClient.get(gameId);

    testCases.forEach(testCase => {
      testCase.events = testCase.events.map(eventString => JSON.parse(eventString));
  });

    return testCases;
  });
};

export default useGameTestCases;