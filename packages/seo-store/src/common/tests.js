import { renderHook } from "@testing-library/react-hooks";
import { useEffectWithDeepCompare } from "./hooks";

describe( "Common hooks", () => {
	describe( "useEffectWithDeepCompare", () => {
		test( "should not run the callback when the dependency values did not change", () => {
			const callback = jest.fn();

			const { rerender } = renderHook(
				( { test } ) => useEffectWithDeepCompare( callback, [ { test } ] ),
				{ initialProps: { test: 1 } },
			);

			expect( callback ).toHaveBeenCalledTimes( 1 );

			rerender( { test: 1 } );

			expect( callback ).toHaveBeenCalledTimes( 1 );
		} );

		test( "should run the callback when a dependency value changed", () => {
			const callback = jest.fn();
			let test = 1;

			const { rerender } = renderHook( () => useEffectWithDeepCompare( callback, [ { test } ] ) );

			expect( callback ).toHaveBeenCalledTimes( 1 );

			test = 2;
			rerender();

			expect( callback ).toHaveBeenCalledTimes( 2 );

			test = 3;
			rerender();

			expect( callback ).toHaveBeenCalledTimes( 3 );
		} );

		test( "should run the callback when a dependency value mutated", () => {
			const callback = jest.fn();
			let dependency = { test: 1 };

			const { rerender } = renderHook( () => useEffectWithDeepCompare( callback, [ dependency ] ) );

			expect( callback ).toHaveBeenCalledTimes( 1 );

			dependency = { test: 2 };
			rerender();

			expect( callback ).toHaveBeenCalledTimes( 2 );

			/*
			 * This test failed when `useEffectWithDeepCompare` did not use `cloneDeep`.
			 * Due to the `ref.current` being mutated, thus no change was reported.
			 */
			dependency.test = 3;
			rerender();

			expect( callback ).toHaveBeenCalledTimes( 3 );
		} );
	} );
} );
