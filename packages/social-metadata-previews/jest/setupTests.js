import "raf/polyfill";
import "jest-styled-components";

// Tell React this is a test environment, so it expects updates to be wrapped in `act()`.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
