import { mount } from "enzyme";
import CompanyInfoMissingOnboardingWizard from "../../src/components/CompanyInfoMissingOnboardingWizard";

describe( "CompanyInfoMissingOnboardingWizard", () => {
	it( "matches the snapshot", () => {
		const tree = mount(
			<CompanyInfoMissingOnboardingWizard
				properties={ {
					message: "Testing.",
					link: "https://example.com/",
				} }
				stepState={ {
					fieldValues: {
						"publishing-entity": {
							publishingEntityCompanyName: "company",
							publishingEntityCompanyLogo: "https://example.com/logo.png",
						},
					},
				} }
			/>,
		);

		expect( tree ).toMatchSnapshot();
	} );
} );
