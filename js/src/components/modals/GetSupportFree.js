import React from "react";

import Icon from "yoast-components/composites/Plugin/Shared/components/Icon";
import YoastSeoIcon from "yoast-components/composites/basic/YoastSeoIcon";

const GetSupportFree = () => {
	return (
		<div>
			This is the free modal content.
			<Icon icon={ YoastSeoIcon } width="150px" height="150px" className="alignright" />
			<form>
				<button type="button">tabbing</button>
				<button type="button">is constrained</button>
				<button type="button">within</button>
				<button type="button">the modal</button>
			</form>
			<div className="wpseo-premium-popup wp-clearfix">
				<h2 className="wpseo-premium-popup-title">Email support is a Yoast SEO Premium feature</h2>
				<p className="yoast-measure">
					Go Premium and our experts will be there for you to answer any questions you might have about
					the set-up and use of the plug-in!
					</p>
				<p>Other benefits of Yoast SEO Premium for you:</p>
				<ul className="wpseo-premium-advantages-list">
					<li>No more dead links: easy redirect manager</li>
					<li>Superfast internal links suggestions</li>
					<li>Social media preview: Facebook &amp; Twitter</li>
					<li>24/7 support</li>
					<li>No ads!</li>
				</ul>
				<a
					className="button button-primary"
					href="https://yoa.st/contact-support?utm_content=6.3.1"
					target="_blank"
					rel="noreferrer noopener"
				>
					Get Yoast SEO Premium now!
				</a><br/>
				<small>1 year free updates and upgrades included!</small>
			</div>
		</div>
	);
};

export default GetSupportFree;
