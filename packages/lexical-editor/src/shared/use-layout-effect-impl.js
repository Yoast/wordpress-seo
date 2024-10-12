import { CAN_USE_DOM } from "@lexical/utils";
import { useEffect, useLayoutEffect } from "react";

export const useLayoutEffectImpl = CAN_USE_DOM ? useLayoutEffect : useEffect;
