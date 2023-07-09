import { Audio } from "expo-av";
import { create } from "zustand";

import System from "../constants/System";
import { SeasonInfo, Task, TaskState, UserTaskStatusEnum } from "../types/task";

const taskStore = create<TaskState>((set, get) => ({
  seasonInfo: null,
  points: 0,
  taskList: [],
  ranking: 0,
  clainSound: null,
  hasClaimableTask: false,
  seasonEndDate: null,
  setSeasonInfo(season: SeasonInfo) {
    set({ seasonInfo: season, seasonEndDate: season.endDate });
  },

  async clearClainSound() {
    if (get().clainSound) {
      await get().clainSound.unloadAsync();
      set({ clainSound: null });
    }
  },

  async createdClainSound() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    Audio.Sound.createAsync({
      uri: `${System?.avatarImgHost}audio/claim_sound.mp3`,
    })
      .then(({ sound }) => {
        set({ clainSound: sound });
      })
      .catch((e) => e);
  },

  setTaskList(taskList: Task[]): void {
    set({
      taskList,
      hasClaimableTask: taskList.some(
        (task) => task.status === UserTaskStatusEnum.Claimable,
      ),
    });
  },

  setPoints(points: number, addToClaimed = false) {
    const originPoints = get().points;
    if (addToClaimed) {
      get().setClaimedPoints(points - originPoints);
    }
    set({ points });
  },

  setRanking(ranking: number) {
    set({ ranking });
  },

  claimedPoints: 0,
  setClaimedPoints(points: number) {
    set({ claimedPoints: get().claimedPoints + points });
  },
  clearClaimedPoints() {
    set({ claimedPoints: 0 });
  },
}));

export default taskStore;
