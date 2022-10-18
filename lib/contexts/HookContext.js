import { createContext } from "react";

const HookContext = createContext({
  hook: null,
  setHook: () => {
    throw Error("You forgot to wrap this in a Provider object");
  },
});

export default HookContext;
