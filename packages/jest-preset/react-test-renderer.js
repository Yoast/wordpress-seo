// Opt-in Jest setup for packages that test with react-test-renderer under React 18 and React 19.
// Use it from a `setupFilesAfterEnv` file: `import "@yoast/jest-preset/react-test-renderer";`.

// Tell React this is a test environment, so it expects updates to be wrapped in `act()`.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// React 19 passes `ref` through as a regular prop, so react-test-renderer prints it in snapshots.
// Strip it so the same snapshots hold under React 18 and React 19.
expect.addSnapshotSerializer( {
	test: ( value ) => Boolean( value && value.$$typeof === Symbol.for( "react.test.json" ) && value.props && "ref" in value.props ),
	serialize: ( value, config, indentation, depth, refs, printer ) => {
		// Mutate rather than copy: jest-styled-components tracks the nodes it has printed by identity.
		// `toJSON()` returns fresh objects on every call, so this does not leak between tests.
		delete value.props.ref;
		return printer( value, config, indentation, depth, refs );
	},
} );
