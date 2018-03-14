import React from "react";

const ModalTestContent = () => {
	return (
		<div>
			<p>
				<strong>The modal width is controlled by the width of its content.</strong>
				The modal itself uses a max-width and max-height.
			</p>
			<form>
				<button type="button">tabbing</button>
				<button type="button">is constrained</button>
				<button type="button">within</button>
				<button type="button">the modal</button>
			</form>

			<p>
				One morning, when Gregor Samsa woke from troubled dreams, he found himself
				transformed in his bed into a horrible vermin. He lay on his armour-like back,
				and if he lifted his head a little he could see his brown belly, slightly domed
				and divided by arches into stiff sections.
			</p>
			<p>
				The bedding was hardly able to cover it and seemed ready to slide off any moment.
				His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked.
			</p>
		</div>
	);
};

export default ModalTestContent;
