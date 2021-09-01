import { MachinatUser } from '@machinat/core';
import { makeFactoryProvider } from '@machinat/core/service';
import Profiler, { MachinatProfile } from '@machinat/core/base/Profiler';
import StateController from '@machinat/core/base/StateController';

const PROFILE_STATE_KEY = 'user_profile_cache';

const useProfileFactory = makeFactoryProvider({
  deps: [Profiler, StateController] as const,
})(
  (profiler, stateController) =>
    async (user: MachinatUser): Promise<null | MachinatProfile> => {
      let profile =
        (await stateController
          .userState(user)
          .get<MachinatProfile>(PROFILE_STATE_KEY)) || null;

      if (profile) {
        return profile;
      }

      profile = await profiler.getUserProfile(user);
      if (!profile) {
        return null;
      }

      await stateController
        .userState(user)
        .set<MachinatProfile>(PROFILE_STATE_KEY, profile);

      return profile;
    }
);

export default useProfileFactory;
