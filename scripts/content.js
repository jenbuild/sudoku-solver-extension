function renderSolveButton() {
	if (!document.body) return;

	const solveButton = document.createElement("button");
	solveButton.innerText = "Solve";
	solveButton.id = "puzzle-solver-btn";

	document.body.appendChild(solveButton);

	// On click, read the board, solve it, and fill in the answers
	solveButton.addEventListener("click", () => {
		const path = document.URL; // get the current URL to determine which puzzle we're on
		solveSudoku();
	});
}

renderSolveButton();
