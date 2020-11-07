import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Step, Steps } from "../lib";
import Step1 from "../stepComponents/Step1";
import Step2 from "../stepComponents/Step2";
import Step3 from "../stepComponents/Step3";
import Step4 from "../stepComponents/Step4";

const beforeStepChange = jest.fn(() => "");

test("beforeStepChange is called before step change", () => {
	render(
		<Steps>
			<Step component={Step1} beforeStepChange={beforeStepChange} />
			<Step component={Step2} />
		</Steps>,
	);

	let next_button = screen.getByText(/next/i);
	fireEvent.click(next_button);
	expect(beforeStepChange).toHaveBeenCalled();
});

test("Rendered components: Steps, Step", () => {
	render(
		<Steps>
			<Step component={Step1} beforeStepChange={beforeStepChange} />
			<Step component={Step2} />
			<Step component={Step3} />
			<Step component={Step4} />
		</Steps>,
	);

	// Get enabled previous button on the first screen
	let first_visible_prev = screen.getByText(/visible prev/i);

	// Make sure it's not disabled
	expect(first_visible_prev).not.toBeDisabled();

	fireEvent.click(first_visible_prev);

	// Prev button does not do anything on the first step
	expect(screen.getByTestId("first-visible-prev")).toBeVisible();

	// Get the "Next" and "Previous" buttons
	let next_button = screen.getByText(/next/i);
	let prev_button = screen.getByText(/previous/i);

	// Both visible, next enabled, previous disabled
	expect(next_button).toBeVisible();
	expect(next_button).not.toBeDisabled();
	expect(prev_button).toBeVisible();
	expect(prev_button).toBeDisabled();

	// Click "Next" button
	fireEvent.click(next_button);

	// Now on Step2
	// Get "Previous" button
	prev_button = screen.getByText(/previous/i);

	// Expect it to be visible and not disabled
	expect(prev_button).toBeVisible();
	expect(prev_button).not.toBeDisabled();

	// Click "Previous" button
	fireEvent.click(prev_button);

	// Now on Step1
	// Previous button
	prev_button = screen.getByText(/previous/i);

	// Visible and disabled
	expect(prev_button).toBeVisible();
	expect(prev_button).toBeDisabled();

	// Get the checkbox
	let checkbox = screen.getByTestId("checkbox");
	fireEvent.click(checkbox);

	// It is checked
	expect(checkbox).toBeChecked();

	// Now on Step 1
	// Get Jump to 3. Step button
	let jump_to_3 = screen.getByTestId("jump3");
	fireEvent.click(jump_to_3);

	// Step 3
	// Input fields address and phone visible
	expect(screen.getByTestId("address")).toBeVisible();
	expect(screen.getByTestId("phone")).toBeVisible();

	// Step 3 -> Step 2
	prev_button = screen.getByText(/previous/i);
	fireEvent.click(prev_button);

	// Step 2 -> Step 1
	prev_button = screen.getByText(/previous/i);
	fireEvent.click(prev_button);

	let jump_to_5 = screen.getByTestId("jump5");
	fireEvent.click(jump_to_5);

	// There is no Step 5, so the component remains same
	expect(jump_to_5).toBeVisible();

	// Step 1 form elements
	const firstname = screen.getByTestId("firstname");
	const lastname = screen.getByTestId("lastname");
	const green = screen.getByTestId("green");
	const blue = screen.getByTestId("blue");

	// Fill out
	fireEvent.change(firstname, { target: { value: "John" } });
	fireEvent.change(lastname, { target: { value: "Doe" } });
	fireEvent.click(green);
	fireEvent.click(blue);

	// This also tests that props.getState() properly works
	expect(firstname.value).toBe("John");
	expect(lastname.value).toBe("Doe");

	// Move to Step 2
	next_button = screen.getByText(/next/i);
	fireEvent.click(next_button);

	// Step 2 form elements
	const email = screen.getByTestId("email");
	const password = screen.getByTestId("password");

	// Fill out
	fireEvent.change(email, { target: { value: "john@doe.com" } });
	fireEvent.change(password, { target: { value: "123456" } });

	expect(email.value).toBe("john@doe.com");
	expect(password.value).toBe("123456");

	// Move to Step 3
	next_button = screen.getByText(/next/i);
	fireEvent.click(next_button);

	// Step 3 form elements
	const address = screen.getByTestId("address");
	const phone = screen.getByTestId("phone");

	// Fill out
	fireEvent.change(address, { target: { value: "1234 NY" } });
	fireEvent.change(phone, { target: { value: "555-555-5555" } });

	expect(address.value).toBe("1234 NY");
	expect(phone.value).toBe("555-555-5555");

	// Move to Step 4
	next_button = screen.getByText(/next/i);
	fireEvent.click(next_button);

	// Make sure all entered data is there
	expect(screen.queryByText("John Doe")).not.toBeNull();
	expect(screen.queryByText("john@doe.com")).not.toBeNull();
	expect(screen.queryByText("123456")).not.toBeNull();
	expect(screen.queryByText("1234 NY")).not.toBeNull();
	expect(screen.queryByText("555-555-5555")).not.toBeNull();
	expect(screen.queryByText("blue")).not.toBeNull();

	// Make sure next button is disabled on the last step
	expect(screen.getByTestId("last-next")).toBeDisabled();

	// Get another next button on the last screen
	let last_visible_next = screen.getByText(/visible next/i);

	// Make sure it's not disabled
	expect(last_visible_next).not.toBeDisabled();

	fireEvent.click(last_visible_next);

	// Next button does not do anything on the last step
	expect(screen.getByTestId("last-visible-next")).toBeVisible();

	expect(screen.getByTestId("order 1")).toBeVisible();
	expect(screen.getByTestId("title 1")).toBeVisible();
	expect(screen.getByTestId("order 2")).toBeVisible();
	expect(screen.getByTestId("title 2")).toBeVisible();
	expect(screen.getByTestId("order 3")).toBeVisible();
	expect(screen.getByTestId("title 3")).toBeVisible();
	expect(screen.getByTestId("order 4")).toBeVisible();
	expect(screen.getByTestId("title 4")).toBeVisible();
});