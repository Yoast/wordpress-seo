import { describe, expect, test } from "@jest/globals";
import { DifferencePercentage } from "../../../src/dashboard/components/difference-percentage";
import { render } from "../../test-utils";

describe( "DifferencePercentage", () => {
	test.each( [
		[ "+", "100%", false, "yst-text-green-600", "" ],
		[ "-", "-100%", true, "yst-text-red-600", "yst-rotate-180" ],
	] )( "should render the value with the appropriate sign: %s and color", ( sign, formattedValue, isNegative, colorClassName, iconClassName ) => {
		const { getByText } = render(
			<DifferencePercentage isNegative={ isNegative } formattedValue={ formattedValue } />
		);
		// For positive numbers, the component adds the plus sign.
		const element = getByText( isNegative ? formattedValue : `${ sign }${ formattedValue }` );
		expect( element ).toBeInstanceOf( HTMLDivElement );
		expect( element.className ).toContain( colorClassName );
		expect( element.firstChild ).toBeInstanceOf( SVGElement );
		if ( iconClassName ) {
			expect( element.firstChild.classList.contains( iconClassName ) ).toBeTruthy();
		}
	} );
} );
