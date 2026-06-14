// Solving 6x6 Sudoku with 2x3 blocks using backtracking
function solve6x6(inputArr) {
	const N = 6;
	const blockRows = 2; // 2 rows per block
	const blockCols = 3; // 3 cols per block

	// build numeric grid (0 for empty)
	const grid = [];
	for (let r = 0; r < N; r++) {
		grid[r] = inputArr.slice(r * N, (r + 1) * N).map((v) => {
			const n = parseInt(v, 10);
			return Number.isFinite(n) ? n : 0;
		});
	}

	function isSafe(r, c, val) {
		for (let i = 0; i < N; i++) if (grid[r][i] === val) return false;
		for (let i = 0; i < N; i++) if (grid[i][c] === val) return false;
		const br = Math.floor(r / blockRows) * blockRows;
		const bc = Math.floor(c / blockCols) * blockCols;
		for (let i = 0; i < blockRows; i++) {
			for (let j = 0; j < blockCols; j++) {
				if (grid[br + i][bc + j] === val) return false;
			}
		}
		return true;
	}

	function backtrack() {
		for (let r = 0; r < N; r++) {
			for (let c = 0; c < N; c++) {
				if (grid[r][c] === 0) {
					for (let val = 1; val <= N; val++) {
						if (isSafe(r, c, val)) {
							grid[r][c] = val;
							if (backtrack()) return true;
							grid[r][c] = 0;
						}
					}
					return false;
				}
			}
		}
		return true; // solved
	}

	if (backtrack()) return grid.flat();
	return null;
}

function solve9x9(inputArr) {
	const N = 9;
	const blockRows = 3;
	const blockCols = 3;

	// build numeric grid (0 for empty)
	const grid = [];
	for (let r = 0; r < N; r++) {
		grid[r] = inputArr.slice(r * N, (r + 1) * N).map((v) => {
			const n = parseInt(v, 10);
			return Number.isFinite(n) ? n : 0;
		});
	}

	function isSafe(r, c, val) {
		// row
		for (let i = 0; i < N; i++) {
			if (grid[r][i] === val) return false;
		}

		// column
		for (let i = 0; i < N; i++) {
			if (grid[i][c] === val) return false;
		}

		// 3x3 block
		const br = Math.floor(r / blockRows) * blockRows;
		const bc = Math.floor(c / blockCols) * blockCols;

		for (let i = 0; i < blockRows; i++) {
			for (let j = 0; j < blockCols; j++) {
				if (grid[br + i][bc + j] === val) return false;
			}
		}

		return true;
	}

	function backtrack() {
		for (let r = 0; r < N; r++) {
			for (let c = 0; c < N; c++) {
				if (grid[r][c] === 0) {
					for (let val = 1; val <= N; val++) {
						if (isSafe(r, c, val)) {
							grid[r][c] = val;

							if (backtrack()) {
								return true;
							}

							grid[r][c] = 0;
						}
					}

					return false;
				}
			}
		}

		return true;
	}

	if (backtrack()) {
		return grid.flat();
	}

	return null;
}

const solveSudoku = async () => {
	const cells = [...document.querySelectorAll("div[data-cell]")]; //get all cells in a flat array
	const data = cells.map((cell) => (cell.textContent || "").replace(/\D/g, "")); // extract digits only, empty string for blanks

	const solved = cells.length === 6 ? solve6x6(data) : solve9x9(data); // returns flat array of 36 values or null if no solution

	if (!solved) {
		alert("No solution found");
		console.warn("No solution for:", data);
		return;
	}

	// choose one cell to leave empty: prefer an originally empty cell
	const emptyIndices = data
		.map((v, idx) => (v === "" ? idx : -1))
		.filter((i) => i !== -1);
	let indexToLeaveEmpty = -1;
	if (emptyIndices.length > 0) {
		indexToLeaveEmpty = emptyIndices[0];
	}

	// helper: small async sleep
	const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

	// simulate a click on an element (to activate the cell for input)
	const simulateClick = (element) => {
		const opts = { bubbles: true, cancelable: true, view: window };
		element.dispatchEvent(new PointerEvent("pointerdown", opts));
		element.dispatchEvent(new MouseEvent("mousedown", opts));
		element.dispatchEvent(new PointerEvent("pointerup", opts));
		element.dispatchEvent(new MouseEvent("mouseup", opts));
		element.click();
	};

	const inputbuttons = document.querySelectorAll(".su-keyboard__number");

	// fill in the cells with the solved values
	for (let i = 0; i < cells.length; i++) {
		const cell = cells[i];

		// Use this to test (i != indexToLeaveEmpty && emptyIndices.includes(i))
		if (emptyIndices.includes(i)) {
			simulateClick(cells[i]);

			const inputButton = inputbuttons[solved[i] - 1]; // find the input button for the solved value
			if (inputButton) {
				simulateClick(inputButton);
			}

			await sleep(50); // wait for any click-related updates
		}
	}
};
