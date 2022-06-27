import {
  makeFactoryProvider,
  BasicProfiler,
  SociablyUser,
  SociablyProfile,
  StateController,
} from '@sociably/core';

const PROFILE_STATE_KEY = 'user_profile_cache';

const useUserProfile = makeFactoryProvider({
  deps: [BasicProfiler, StateController],
})(
  (profiler, stateController) =>
    async (user: SociablyUser | null): Promise<null | SociablyProfile> => {
      if (!user) {
        return null;
      }

      let profile =
        (await stateController
          .userState(user)
          .get<SociablyProfile>(PROFILE_STATE_KEY)) || null;

      if (profile) {
        return profile;
      }

      profile = await profiler.getUserProfile(user);
      if (!profile) {
        return null;
      }

      await stateController
        .userState(user)
        .set<SociablyProfile>(PROFILE_STATE_KEY, profile);

      return profile;
    }
);

export default useUserProfile;
