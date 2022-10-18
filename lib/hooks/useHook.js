import { useContext } from "react";

import { HookContext } from "lib";

export default function useHook() {
  const { hook, setHook } = useContext(HookContext);

  return {
    hook,
  };
}
