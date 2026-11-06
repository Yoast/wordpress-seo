import "jest-styled-components";
import "@testing-library/jest-dom";

// React 19.1+ formats `useId` values as `_r_0_` instead of React 18's `:r0:` (e.g. in headlessui ids).
// Normalise them to the React 18 form so the same snapshots hold under React 18 and React 19.
const REACT_19_USE_ID = /_r_([0-9a-z]+)_/g;
expect.addSnapshotSerializer( {
	test: ( value ) => typeof value === "string" && /_r_[0-9a-z]+_/.test( value ),
	serialize: ( value, config, indentation, depth, refs, printer ) => printer( value.replace( REACT_19_USE_ID, ":r$1:" ), config, indentation, depth, refs ),
} );
