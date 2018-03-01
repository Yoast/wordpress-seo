import React from "react";

const GetSupportPremium = () => {
	return (
		<div>
			This is the premium modal content.
			<form>
				<button type="button">tabbing</button>
				<button type="button">is constrained</button>
				<button type="button">within</button>
				<button type="button">the modal</button>
			</form>

			<div className="contact-premium-support">
				<p className="contact-premium-support__content">
					If you have a problem that you can not solve with our video tutorials or knowledge
					base, you can send a message to our support team. They can be reached 24/7.
				</p>
				<p className="contact-premium-support__content">
					Support requests you create here are sent directly into our support system, which is
					secured with 256 bit SSL, so communication is 100% secure.
				</p>
				<button className="contact-premium-support__button sc-dnqmqq etWwma sc-htoDjs bLheLS" type="button">
					<span>New support request</span>
				</button>
			</div>
		</div>
	);
};

export default GetSupportPremium;
