import { MachinatUser } from '@machinat/core';
import { makeFactoryProvider } from '@machinat/core/service';
import Profiler, { MachinatProfile } from '@machinat/core/base/Profiler';
import StateController from '@machinat/core/base/StateController';

const PROFILE_STATE_KEY = 'user_profile_cache';

const useProfileFactory = makeFactoryProvider({
  deps: [Profiler, StateController] as const,
})((profiler, stateController) => async (user: MachinatUser) => {
  const state = await stateController
    .userState(user)
    .get<MachinatProfile>(PROFILE_STATE_KEY);
  if (state) {
    return state;
  }

  const profile = await profiler.getUserProfile(user);
  await stateController
    .userState(user)
    .set<MachinatProfile>(PROFILE_STATE_KEY, profile);
  return profile;
});

export default useProfileFactory;
