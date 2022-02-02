import {
  makeFactoryProvider,
  BasicProfiler,
  MachinatUser,
  MachinatProfile,
  StateController,
} from '@machinat/core';

const PROFILE_STATE_KEY = 'user_profile_cache';

const useUserProfile = makeFactoryProvider({
  deps: [BasicProfiler, StateController],
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

export default useUserProfile;
