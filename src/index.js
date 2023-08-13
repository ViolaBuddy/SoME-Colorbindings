"use strict";

var mainBoard;
var thePiece;
var cutsceneOverlay;

const BOARDSIZE_ROWS = 16;
const BOARDSIZE_COLUMNS = 16;
const zeroCol = Math.floor((BOARDSIZE_COLUMNS-1)/2);
const zeroRow = Math.floor(BOARDSIZE_ROWS/2);

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

// 

function main() {

	mainBoard = new Board(BOARDSIZE_ROWS, BOARDSIZE_COLUMNS, null, 'maintable', tileClickHandler, null, null);
	mainBoard.addDomToParent('boarddiv');

	thePiece = new Piece('♟️\uFE0F', Alignment.Player, 
		[ [0,1] ], null, null);
	mainBoard.addPiece(thePiece, zeroRow, zeroCol);
	mainBoard.setSelectedTile(zeroRow, zeroCol);

	mainBoard.gamePhase = GamePhase.UnitSelected;
	mainBoard.updateDomToMatchState();

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
			console.log(i);
			i.click();
		}
	}

}