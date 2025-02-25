export class EditableText extends HTMLElement {
	static observedAttributes = ["label", "placeholder"];

	constructor() {
		super();

		this.attachShadow({ mode: "open" });

		const template = document.createElement("template");
		template.innerHTML = `
			<style>
				.visually-hidden {
					clip: rect(0 0 0 0);
					clip-path: inset(50%);
					height: 1px;
					width: 1px;
					overflow: hidden;
					position: absolute;
					white-space: nowrap;
				}

				:host {
					display: block;
				}

				div {
					min-height: 1rem;
					cursor: pointer;
				}

				input {
					display: none;
				}
			</style>

			<div part="text" tabindex="0"><slot></slot></div>
			<label part="label" for="input" class="visually-hidden"></label>
			<input part="input" id="input" type="text" />
  	`;

		this.currentText = "";

		const structure = template.content.cloneNode(true);
		this.shadowRoot?.appendChild(structure);

		this.textElement = this.shadowRoot?.querySelector("div");
		this.labelElement = this.shadowRoot?.querySelector("label");
		this.inputElement = this.shadowRoot?.querySelector("input");

		this.textElement?.addEventListener("click", () => this.edit());
		this.textElement?.addEventListener("keydown", (event) => {
			const isEnter = event.key === "Enter";
			if (isEnter) {
				this.edit();
			}
		});

		this.inputElement?.addEventListener("blur", () => this.save());
		this.inputElement?.addEventListener("keydown", (event) => {
			const isEnter = event.key === "Enter";
			if (isEnter) {
				this.save();
			}
		});
	}

	connectedCallback() {
		const slot = this.shadowRoot?.querySelector("slot");
		const assignedNodes = slot?.assignedNodes();
		const slotText =
			(assignedNodes && assignedNodes[0]?.textContent?.trim()) || "";
		this.currentText = slotText;

		if (this.textElement) {
			this.textElement.textContent = this.currentText;
		}

		if (!this.currentText) {
			this.showView("input");
		}
	}

	get label() {
		return this.getAttribute("label");
	}

	set label(value) {
		if (value) {
			this.setAttribute("label", value);
		} else {
			this.removeAttribute("label");
		}
	}

	get placeholder() {
		return this.getAttribute("placeholder");
	}

	set placeholder(value) {
		if (value) {
			this.setAttribute("placeholder", value);
		} else {
			this.removeAttribute("placeholder");
		}
	}

	/**
	 * @param {string} name
	 * @param {string} oldValue
	 * @param {string} newValue
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		const isLabelChange = name === "label";
		if (isLabelChange && this.labelElement) {
			this.labelElement.textContent = newValue;
			return;
		}

		const isPlaceholderChange = name === "placeholder";
		if (isPlaceholderChange && this.inputElement) {
			this.inputElement.placeholder = newValue;
			return;
		}
	}

	edit() {
		if (!this.textElement || !this.inputElement) {
			return;
		}

		this.inputElement.value = this.currentText;

		this.showView("input");
		this.inputElement.focus();
	}

	save() {
		if (!this.textElement || !this.inputElement) {
			return;
		}

		this.currentText = this.inputElement.value;
		this.textElement.textContent = this.currentText;

		if (!this.currentText) {
			return;
		}

		const event = new CustomEvent("change", {
			detail: { value: this.currentText },
			bubbles: true,
			composed: true,
		});
		this.dispatchEvent(event);

		this.showView("text");
		this.textElement.focus();
	}

	/**
	 * Changes view between text and input.
	 *
	 * @param {'text' | 'input'} view
	 */
	showView(view) {
		if (!this.textElement || !this.inputElement) {
			return;
		}

		const shouldShowTextView = view === "text";
		if (shouldShowTextView) {
			this.inputElement.style.display = "none";
			this.textElement.style.display = "block";
			return;
		}

		this.textElement.style.display = "none";
		this.inputElement.style.display = "block";
	}
}

customElements.define("editable-text", EditableText);
