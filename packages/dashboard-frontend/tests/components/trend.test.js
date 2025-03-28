import { describe, expect, test } from "@jest/globals";
import { Trend } from "../../src/components/trend";
import { render } from "../test-utils";

describe( "Trend", () => {
	test.each( [
		[ "positive is green and adds a plus", 1, "100.00%", "+100.00%", "yst-text-green-600" ],
		[ "negative is red and leaves the minus", -1, "-100.00%", "-100.00%", "yst-text-red-600", "yst-rotate-180" ],
	] )( "should render correctly: %s", ( _, value, formattedValue, expected, colorClassName = "", iconClassName = "" ) => {
		const { getByText } = render( <Trend value={ value } formattedValue={ formattedValue } /> );
		const element = getByText( expected );
		expect( element ).toBeInstanceOf( HTMLDivElement );
		if ( colorClassName ) {
			expect( element.className ).toContain( colorClassName );
		}
		expect( element.firstChild ).toBeInstanceOf( SVGElement );
		if ( iconClassName ) {
			expect( element.firstChild.classList.contains( iconClassName ) ).toBeTruthy();
		}
	} );

	test.each( [
		[ "zero", 0 ],
		[ "not a number", NaN ],
		[ "null", null ],
		[ "undefined", undefined ],
	] )( "should not render when falsy: %s", ( _, value ) => {
		const { container } = render( <Trend value={ value } formattedValue="" /> );
		expect( container.firstChild ).toBeNull();
	} );
} );
