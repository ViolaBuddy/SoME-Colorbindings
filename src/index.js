"use strict";

var mainBoard;
var thePiece;
var cutsceneOverlay;
var parallelogramDivs = [];
var showParallelogram = false;

var BOARDSIZE = 16;
var zeroCol = Math.floor((BOARDSIZE-1)/2);
var zeroRow = Math.floor(BOARDSIZE/2);

function tileFinishUnitAnimationHandler(r, c) {
	mainBoard.gamePhase = GamePhase.UnitSelected;
	mainBoard.unsetSelectedTile();
	mainBoard.setSelectedTile(r, c);
	mainBoard.updateDomToMatchState();
}

function tileClickHandlerUnitSelected(r, c) {
	if (mainBoard.selectedTileMoveableContains(r, c)) {
		mainBoard.gamePhase = GamePhase.UnitAnimation;
		let selectedPiece = mainBoard.boardPieces[mainBoard.selectedTile[0]][mainBoard.selectedTile[1]];
		mainBoard.movePiece(selectedPiece, r, c, tileFinishUnitAnimationHandler);
	}
}

function tileClickHandler(r, c) {
	switch (mainBoard.gamePhase) {
	case GamePhase.UnitSelected:
		tileClickHandlerUnitSelected(r, c);
		break;
	case GamePhase.PlayerTurn:
	case GamePhase.UnitAnimation:
		break;
	default:
		console.error('NOT IMPLEMENTED: tileClickHandler FOR ' + mainBoard.gamePhase);
	}

	mainBoard.updateDomToMatchState();
}

function turnOnShowParallelogram() {
	showParallelogram = true;
	let centerTD = document.getElementById('maintable').children[zeroRow].children[zeroCol];
	for (let i = 0; i < 4; i++) {
		centerTD.appendChild(parallelogramDivs[i]);
	}
}

function turnOffShowParallelogram() {
	showParallelogram = false;
	let centerTD = document.getElementById('maintable').children[zeroRow].children[zeroCol];
	for (let i = 0; i < 4; i++) {
		try {
			centerTD.removeChild(parallelogramDivs[i]);
		} catch (NotFoundError) {
			// ignore
		}
	}
}

function toggleShowParallelogram() {
	if (showParallelogram) {
		turnOffShowParallelogram();
	} else {
		turnOnShowParallelogram();
	}
}

function setPiece(pieceMovement, pieceName, pieceDescription) {
	thePiece.moves = pieceMovement;
	mainBoard.resetAll();
	mainBoard.addPiece(thePiece, zeroRow, zeroCol);
	mainBoard.setSelectedTile(zeroRow, zeroCol);
	mainBoard.updateDomToMatchState();

	let boardPieceNameDiv = document.getElementById('boardPieceName');
	let boardPieceDescriptionDiv = document.getElementById('boardPieceDescription');

	boardPieceNameDiv.innerHTML = pieceName;
	boardPieceDescriptionDiv.innerHTML = pieceDescription;

	try {
		MathJax.typeset();
	} catch (TypeError) {
		// ignore: the first time this function is called, MathJax isn't loaded yet
		// but that's fine
	}

	turnOffShowParallelogram();
}

function movesetToString(moveset) {
	let outputString = '$\\{';
	for (let move of moveset) {
		if (move[0] === 0 && move[1] === 0) {
			// ignore empty moves
			continue;
		}
		outputString += '(';
		outputString += move[0];
		outputString += ',';
		outputString += move[1];
		outputString += '),';
	}
	if (outputString[outputString.length-1] === ',') {
		outputString = outputString.slice(0, -1);
	}
	outputString += '\\}$';
	return outputString;
}

// 

function main(boardSize) {
	BOARDSIZE = boardSize;
	zeroCol = Math.floor((BOARDSIZE-1)/2);
	zeroRow = Math.floor(BOARDSIZE/2);

	// parallelogram lines
	for (let i = 0; i < 4; i++) {
		let thisParallelogramDiv = document.createElement('div');
		thisParallelogramDiv.setAttribute('class', 'divline');
		parallelogramDivs.push(thisParallelogramDiv);
	}

	// board
	mainBoard = new Board(BOARDSIZE, BOARDSIZE, null, 'maintable', tileClickHandler, null, null);
	mainBoard.addDomToParent('boarddiv');

	thePiece = new Piece('♟️\uFE0F', Alignment.Player, 
		[ [0,1] ], null, null);
	mainBoard.addPiece(thePiece, zeroRow, zeroCol);
	mainBoard.setSelectedTile(zeroRow, zeroCol);

	mainBoard.gamePhase = GamePhase.UnitSelected;
	mainBoard.updateDomToMatchState();

	setPiece(PAWN, ALL_NAMES_DICT['pawn'], ALL_DESCRIPTIONS_DICT['pawn']);

	// board controls
	let resetBtn = document.getElementById('reset_position');
	resetBtn.addEventListener('click', function(event){
		mainBoard.resetAll();
		mainBoard.addPiece(thePiece, zeroRow, zeroCol);
		mainBoard.setSelectedTile(zeroRow, zeroCol);
		mainBoard.gamePhase = GamePhase.UnitSelected;
		mainBoard.updateDomToMatchState();
	});

	let coloring_checkerboard = document.getElementById('coloring_checkerboard');
	coloring_checkerboard.addEventListener('click', function (event) {
		mainBoard.boardColoring = BoardColorings.Checkered;
		mainBoard.updateDomToMatchState();
	});
	let coloring_colorbinding = document.getElementById('coloring_colorbinding');
	coloring_colorbinding.addEventListener('click', function (event) {
		mainBoard.boardColoring = BoardColorings.Colorbinding;
		mainBoard.updateDomToMatchState();
	});
	let coloring_none = document.getElementById('coloring_none');
	coloring_none.addEventListener('click', function (event) {
		mainBoard.boardColoring = BoardColorings.None;
		mainBoard.updateDomToMatchState();
	});

	for (let i of [coloring_checkerboard, coloring_colorbinding, coloring_none]) {
		if(i.checked) {
			i.click();
		}
	}

	let board_size_slider = document.getElementById('board_size_input');
	let board_size_display = document.getElementById('board_size_output');
	board_size_slider.addEventListener('input', function (event) {
		board_size_display.innerText = event.target.value;
	});
	board_size_slider.addEventListener('change', function (event) {
		mainBoard.removeDomFromParent();
		main(event.target.value);
	});
}