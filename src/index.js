"use strict";

var mainBoard;
var cutsceneOverlay;

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
	case GamePhase.PlayerPhaseBanner:
	case GamePhase.EnemyPhaseBanner:
	case GamePhase.UnitAnimation:
	case GamePhase.EnemyTurn:
		break;
	default:
		console.error('NOT IMPLEMENTED: tileClickHandler FOR ' + mainBoard.gamePhase);
	}

	mainBoard.updateDomToMatchState();
}

// 

function main() {
	const BOARDSIZE_ROWS = 16;
	const BOARDSIZE_COLUMNS = 16;

	mainBoard = new Board(BOARDSIZE_ROWS, BOARDSIZE_COLUMNS, null, 'maintable', tileClickHandler, null, null);
	mainBoard.addDomToParent('boarddiv');

	let zeroX = Math.floor((BOARDSIZE_COLUMNS-1)/2);
	let zeroY = Math.floor(BOARDSIZE_ROWS/2);

	let newPiece;
	newPiece = new Piece('♟️\uFE0F', Alignment.Player, 
		[ [1,-1, MovementCategory.Rider],[-1,1],[1,2],[2,1, MovementCategory.Rider],[-1,-2],[-2,-1],
		], null, null);
	mainBoard.addPiece(newPiece, zeroY, zeroX);
	mainBoard.setSelectedTile(zeroY, zeroX);

	mainBoard.gamePhase = GamePhase.UnitSelected;
	mainBoard.updateDomToMatchState();


	let leftDiv = document.getElementById('left');
	let resetBtn = document.createElement('button');
	resetBtn.innerText = 'reset';
	resetBtn.addEventListener('click', function(event){
		mainBoard.addPiece(newPiece, zeroY, zeroX);
		mainBoard.resetAll();
		mainBoard.setSelectedTile(zeroY, zeroX);
		mainBoard.updateDomToMatchState();
	});
	leftDiv.appendChild(resetBtn);

	function createCheckbox(id, text, onClick) {
		let checkeredCheckbox = document.createElement('input');
		checkeredCheckbox.setAttribute('type', 'checkbox');
		checkeredCheckbox.setAttribute('id', id);
		checkeredCheckbox.checked = true;
		checkeredCheckbox.addEventListener('click', onClick); 
		let checkeredCheckboxLabel = document.createElement('label');
		checkeredCheckboxLabel.setAttribute('for', id);
		checkeredCheckboxLabel.innerText = text;

		let boarddivcontrols = document.getElementById('boarddivcontrols');
		boarddivcontrols.appendChild(checkeredCheckbox);
		boarddivcontrols.appendChild(checkeredCheckboxLabel);
	}

	createCheckbox('checkeredCheckbox', 'Show checkboard coloring', function (event){
			let checkeredCheckbox = document.getElementById('checkeredCheckbox');
			mainBoard.showCheckered = checkeredCheckbox.checked;
			mainBoard.updateDomToMatchState();
		});
	createCheckbox('moveToCheckbox', 'Show tiles to move to', function (event){
			let moveToCheckbox = document.getElementById('moveToCheckbox');
			mainBoard.showMoveTo = moveToCheckbox.checked;
			mainBoard.updateDomToMatchState();
		});

}