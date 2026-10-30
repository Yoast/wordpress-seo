import { beforeAll, describe, expect, it } from "@jest/globals";
import { AiPlusCard } from "../../../../src/plans/components/cards/ai-plus-card";
import { ADD_ONS_NAME, CURRENT_PROMOTIONS_NAME, registerStore } from "../../../../src/plans/store";
import { render } from "../../../test-utils";

// The store registers once for the whole file: the WP data registry is global, so a second register would clash.
beforeAll( () => {
	registerStore( {
		initialState: {
			[ ADD_ONS_NAME ]: {
				ids: [ "premium" ],
				entities: {
					premium: { id: "premium", isActive: true, hasLicense: true, ctb: { action: "", id: "" } },
				},
			},
			[ CURRENT_PROMOTIONS_NAME ]: { promotions: [ "black-friday-promotion" ] },
		},
	} );
} );

describe( "AiPlusCard", () => {
	it( "shows the Black Friday badge while the promotion is active", () => {
		const { getByText } = render( <AiPlusCard /> );
		expect( getByText( "30% off - Black Friday" ) ).toBeInTheDocument();
	} );

	it( "hides the free trial badge while the promotion is active", () => {
		const { queryByText } = render( <AiPlusCard /> );
		expect( queryByText( "Free trial available" ) ).not.toBeInTheDocument();
	} );

	it( "keeps the free trial button while the promotion is active", () => {
		const { getByRole } = render( <AiPlusCard /> );
		expect( getByRole( "link", { name: /Start your free trial/ } ) ).toBeInTheDocument();
	} );
} );
