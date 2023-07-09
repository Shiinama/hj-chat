import { useCallback, useState } from "react";

import { getPoints, getRanking, getTaskList } from "../../api/task";
import useTaskStore from "../../store/taskStore";

export function useTaskRequest() {
  const { setTaskList, setPoints, setRanking } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const queryTaskList = useCallback(
    async (isInitial = false) => {
      isInitial && setLoading(true);
      const data = await getTaskList();
      setTaskList(data);
      setLoading(false);
    },
    [setTaskList],
  );
  const queryPoints = useCallback(async () => {
    const data = await getPoints();
    setPoints(data, true);
  }, [setPoints]);

  const queryRanking = useCallback(async () => {
    const data = await getRanking();
    setRanking(Number((data * 100).toFixed(2)));
  }, [setRanking]);

  const queryAll = () => {
    Promise.all([queryTaskList(), queryPoints(), queryRanking()]).catch(
      (err) => err,
    );
  };

  return { loading, queryPoints, queryRanking, queryTaskList, queryAll };
}
