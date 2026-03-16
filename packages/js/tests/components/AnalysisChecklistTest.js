import AnalysisChecklist from "../../src/components/AnalysisChecklist";
import { render } from "../test-utils";
import { axe } from "../a11y-test-utils";

const defaultArgs = {
	checklist: [
		{ label: "SEO", score: "good", scoreValue: "Good" },
		{ label: "Readability", score: "ok", scoreValue: "Needs improvement" },
	],
	onClick: jest.fn(),
};

describe( "AnalysisChecklist", () => {
	it( "has no accessibility violations", async() => {
		const { container } = render( <AnalysisChecklist { ...defaultArgs } /> );
		expect( await axe( container ) ).toHaveNoViolations();
	} );
} );
