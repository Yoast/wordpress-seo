import { describe, expect, test } from "@jest/globals";
import { Trend } from "../../src/components/trend";
import { render } from "@testing-library/react";

describe( "Trend", () => {
	test.each( [
		[ "positive is green and adds a plus", 1, "100.00%", "+100.00%", "yst-text-green-600", true ],
		[ "positive is red and adds a plus", 1, "100.00%", "+100.00%", "yst-text-red-600", false ],
		[ "negative is red and leaves the minus", -1, "-100.00%", "-100.00%", "yst-text-red-600", true ],
		[ "negative is green and leaves the minus", -1, "-100.00%", "-100.00%", "yst-text-green-600", false ],
	] )( "should render correctly: %s", ( _, value, formattedValue, expected, colorClassName, moreIsGood ) => {
		const { getByText } = render( <Trend value={ value } formattedValue={ formattedValue } moreIsGood={ moreIsGood } /> );
		const element = getByText( expected );
		expect( element ).toBeInstanceOf( HTMLDivElement );
		if ( colorClassName ) {
			expect( element.className ).toContain( colorClassName );
		}
	} );

	test.each( [
		[ "zero", 0 ],
		[ "not a number", NaN ],
		[ "null", null ],
		[ "undefined", undefined ],
	] )( "should not render when falsy: %s", ( _, value ) => {
		const { container } = render( <Trend value={ value } formattedValue=""  /> );
		expect( container.firstChild ).toBeNull();
	} );
} );
