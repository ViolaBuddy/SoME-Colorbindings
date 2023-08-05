"use strict";

function createEnum(values) {
	const enumObject = {};
	for (let i=0; i<values.length; i++) {
		enumObject[i] = values[i];
		enumObject[values[i]] = values[i];
	}
	enumObject.length = values.length;
	return Object.freeze(enumObject);
}

const TerrainTypes = createEnum(['Empty', 'Impassable', 'Goal', 'MagicalShield', 'PhysicalShield']);
const Alignment = createEnum(['Player', 'Enemy']);
const GamePhase = createEnum([
	'PlayerPhaseBanner',
	'PlayerTurn',
	'UnitSelected',
	'UnitAnimation',
	'EnemyPhaseBanner',
	'EnemyTurn',
	'EnemyUnitAnimation',
	]);
const MovementCategory = createEnum(['Leaper', 'Rider']);
const WeaponType = createEnum(['Magical', 'Physical']);

const CSS_CELL_SIZE = 32; //must match `td .cell` size in index.css

const CSS_CELL = 'cell';
const CSS_CELL_INNER_TEXT = 'cellinnertext';
const CSS_PIECE = 'pieceemoji';

const CSS_STARTCELL = 'startcell';
const CSS_DARKCELL = 'darkcell';
const CSS_LIGHTCELL = 'lightcell';
const CSS_SELECTABLE = 'selectable';

const CSS_HIGHLIGHTED = 'highlighted'

const ANIMATION_TIME = 100; // in milliseconds

/** Interface. Something that has internal state and also must display it in the DOM.
JavaScript doesn't enforce interfaces, of course, but this is for organizational purposes. */
class GameObject {
	constructor() {
		this.domElement = null;
	}

	addDomToParent(parentId) {
		if (typeof parentId == 'string')
		{
			var parentElement = document.getElementById(parentId);
		}
		else
		{
			var parentElement = parentId;
		}
		parentElement.appendChild(this.domElement);
	}
}

class Piece extends GameObject {
	constructor(emoji, alignment, moves, attackType=null, defenseType=null) {
		super()
		this.emoji = emoji;
		this.alignment = alignment;
		this.moves = moves; // unlike everything else which are (row, column), moves are (x, y)
		this.attackType = attackType;
		this.defenseType = defenseType;

		this.alreadyMoved = false;
		this.domElement = document.createElement('p');
		this.domElement.innerText = this.emoji;
		this.domElement.classList.add(CSS_PIECE);
	}
}

class Board extends GameObject {
	constructor(numRows, numColumns, terrain=null, domId=null, tileOnClickCallback=null, loseGameFunc=null, winGameFunc=null) {
		super()
		console.assert(terrain === null || (terrain.length == numRows && terrain[0].length == numColumns));

		this.numRows = numRows;
		this.numColumns = numColumns;
		this.boardTerrain = null;
		this.boardPieces = null;
		this.boardClickCallbacks = null;
		this.domElement = null;
		this.selectedTile = null;
		this.selectedTileMoveable = [];
		this.previouslyMoveable = [];
		this.gamePhase = GamePhase.PlayerPhaseBanner;
		this.turnCounter = 1;
		this.showCheckered = true;
		this.showMoveTo = true;

		if (terrain === null) {
			// empty board
			this.boardTerrain = new Array(numRows);
			for (let r = 0; r < this.numRows; r++) {
				this.boardTerrain[r] = new Array(numColumns);
				for (let c = 0; c < this.numColumns; c++) {
					this.boardTerrain[r][c] = TerrainTypes.Empty;
				}
			}
		} else {
			this.boardTerrain = terrain;
		}

		this.boardPieces = new Array(numRows);
		for (let r = 0; r < this.numRows; r++) {
			this.boardPieces[r] = new Array(numColumns);
			for (let c = 0; c < this.numColumns; c++) {
				this.boardPieces[r][c] = null;
			}
		}

		this.boardClickCallbacks = new Array(numRows);
		for (let r = 0; r < this.numRows; r++) {
			this.boardClickCallbacks[r] = new Array(numColumns);
			for (let c = 0; c < this.numColumns; c++) {
				this.boardClickCallbacks[r][c] = null;
			}
		}

		this.domElement = document.createElement('table');
		if (domId) {
			this.domElement.id = domId;
		}
		for (let r = 0; r < this.numRows; r++) {
			let thisRow = document.createElement('tr');
			this.domElement.appendChild(thisRow);
			for (let c = 0; c < this.numColumns; c++) {
				let thisCell = document.createElement('td');
				thisRow.appendChild(thisCell);
				let thisCellDiv = document.createElement('div');
				thisCellDiv.classList.add(CSS_CELL);
				thisCell.appendChild(thisCellDiv);

				let cartesianX = c - Math.ceil(this.numColumns/2 - 1);
				let cartesianY = Math.floor(this.numRows/2) - r;

				if (cartesianX === 0 && cartesianY === 0 ) {
					thisCellDiv.classList.add(CSS_STARTCELL);
				}

				let thisTextDiv = document.createElement('div');
				thisCellDiv.appendChild(thisTextDiv);

				thisTextDiv.innerText = ''+cartesianX+', '+cartesianY;
				thisTextDiv.classList.add(CSS_CELL_INNER_TEXT)
			}
		}

		if (tileOnClickCallback)
		{
			this.setTilesOnClick(tileOnClickCallback);
		}
		if (loseGameFunc)
			this.loseGame = loseGameFunc;
		else
			this.loseGame = function(){
				console.log('YOU LOSE');
			};
		if (winGameFunc)
			this.winGame = winGameFunc;
		else
			this.winGame = function(){
				console.log('YOU WIN');
			};

	}

	setTilesOnClick(callback) {
		for (let r = 0; r < this.numRows; r++) {
			for (let c = 0; c < this.numColumns; c++) {
				let tdDom = this.domElement.children[r].children[c].firstChild;
				this.boardClickCallbacks[r][c] = (event) => {
					callback(r, c);
				};

				tdDom.addEventListener('click', this.boardClickCallbacks[r][c]);
			}
		}
	}

	findPiece(piece) {
		for (let r = 0; r < this.numRows; r++) {
			for (let c = 0; c < this.numColumns; c++) {
				if(this.boardPieces[r][c] == piece)
					return [r,c];
			}
		}
		return null;
	}

	removePieceAt(row, column) {
		this.boardPieces[row][column] = null;
	}

	/** teleports instantly, no animation */
	addPiece(piece, row, column) {
		console.assert(row >=0 && row < this.numRows);
		console.assert(column >=0 && column < this.numColumns);

		let oldLocation = this.findPiece(piece);
		if (oldLocation !== null)
		{
			this.removePieceAt(oldLocation[0], oldLocation[1]);
		}

		this.boardPieces[row][column] = piece;

		let tdDom = this.domElement.children[row].children[column].firstChild;
		piece.addDomToParent(tdDom);
	}

	/** move piece - with animation */
	movePiece(piece, row, column, callback=null) {
		console.assert(row >=0 && row < this.numRows);
		console.assert(column >=0 && column < this.numColumns);

		let youAreLosingThisTurn = false;

		let oldLocation = this.findPiece(piece);
		console.assert(oldLocation !== null);
		let capturedPiece = this.boardPieces[row][column];
		if (capturedPiece === piece)
			capturedPiece = null; // there isn't actually a captured piece, so set this back to null
		if (capturedPiece !== null) {
			this.removePieceAt(row, column);
			let tdDom = this.domElement.children[row].children[column].firstChild;
			tdDom.removeChild(capturedPiece.domElement);
			if(capturedPiece.alignment === Alignment.Player)
			{
				youAreLosingThisTurn = true;
			}
		}
		this.removePieceAt(oldLocation[0], oldLocation[1]);
		this.boardPieces[row][column] = piece;

		let distanceY = CSS_CELL_SIZE * (row - oldLocation[0]);
		let distanceX = CSS_CELL_SIZE * (column - oldLocation[1]);
		const animationStates = [
			{ transform: "translate(0px,0px)" },
			{ transform: "translate(" + distanceX + "px," + distanceY + "px)" },
		];
		const animationTiming = {
			duration: ANIMATION_TIME,
			easing: 'ease-in-out' };

		piece.domElement.style.zIndex = 1000;
		let animation = piece.domElement.animate(animationStates, animationTiming);
		animation.addEventListener('finish', (event) => {
			let tdDom = this.domElement.children[row].children[column].firstChild;
			piece.addDomToParent(tdDom);
			piece.domElement.style.zIndex = null;

			if (youAreLosingThisTurn) {
				this.loseGame();
				// and just stop here; don't do the callback
			} else if (callback !== null) {
				callback(row, column);
			}
		}, { once: true });
	}

	/** clear all additional tags */
	resetDom() {
		for (let r = 0; r < this.numRows; r++) {
			for (let c = 0; c < this.numColumns; c++) {
				let tdDom = this.domElement.children[r].children[c].firstChild;

				tdDom.classList.remove(CSS_SELECTABLE);
				tdDom.classList.remove(CSS_HIGHLIGHTED);
				tdDom.classList.remove(CSS_DARKCELL);
				tdDom.classList.remove(CSS_LIGHTCELL);
			}
		}
	}

	/** the safest thing to do is to reset and update everything every time this is called */
	updateDomToMatchState() {
		this.resetDom();

		for (let r = 0; r < this.numRows; r++) {
			for (let c = 0; c < this.numColumns; c++) {
				let tdDom = this.domElement.children[r].children[c].firstChild;

				if (this.previouslyMoveableContains(r, c)) {
					tdDom.classList.add(CSS_HIGHLIGHTED);
				}
				let cartesianX = c - Math.ceil(this.numColumns/2 - 1);
				let cartesianY = Math.floor(this.numRows/2) - r;
				if ( (c%2) ^ (r%2) ) {
					tdDom.classList.add(this.showCheckered ? CSS_DARKCELL : CSS_LIGHTCELL);
				} else {
					tdDom.classList.add(CSS_LIGHTCELL);
				}


				switch (mainBoard.gamePhase) {
				case GamePhase.PlayerTurn:
					break;
				case GamePhase.UnitSelected:
					if (this.showMoveTo && this.selectedTileMoveableContains(r,c)) {
						tdDom.classList.add(CSS_SELECTABLE);
					}
					break;
				case GamePhase.PlayerPhaseBanner:
				case GamePhase.EnemyPhaseBanner:
				case GamePhase.EnemyTurn:
				case GamePhase.UnitAnimation:
					break;
				default:
					console.error('NOT IMPLEMENTED: DOM UPDATE FOR ' + mainBoard.gamePhase);
				}
			}
		}
	}

	setSelectedTile(r, c) {
		this.selectedTile = [r, c];
		let thisPiece = this.boardPieces[r][c];
		console.assert(thisPiece);

		// remember that moves are (x,y) while everything else is (r,c)!
		for (let direction of thisPiece.moves) {
			let targetTile = [r-direction[1], c+direction[0]];
			if (direction.length < 3 || direction[2] === MovementCategory.Leaper || (direction[0] === 0 && direction[1] === 0)) {
				if (this.tileIsPassable(targetTile[0], targetTile[1], thisPiece)) {
					this.selectedTileMoveable.push(targetTile);
					this.addToPreviouslyMoveable(targetTile);
				}
			} else if (direction[2] === MovementCategory.Rider) {
				while (this.tileIsPassable(targetTile[0], targetTile[1], thisPiece)) {
					this.selectedTileMoveable.push(targetTile);
					this.addToPreviouslyMoveable(targetTile);
					targetTile = [targetTile[0]-direction[1], targetTile[1]+direction[0]];
				}
			} else {
				console.error('UNRECOGNIZED MOVEMENT CATEGORY '+ direction[2]);
			}
		}
	}

	tileIsPassable(r, c, movingPiece) {
		let withinBoard = r >= 0 && r < this.numRows && c >= 0 && c < this.numColumns;
		if (!withinBoard)
			return false;

		let containsUnit = this.boardPieces[r][c] !== null;
		let passableTerrain =
			this.boardTerrain[r][c] === TerrainTypes.Empty ||
			(this.boardTerrain[r][c] === TerrainTypes.Goal && movingPiece.alignment === Alignment.Player) ||
			(this.boardTerrain[r][c] === TerrainTypes.MagicalShield && movingPiece.attackType !== WeaponType.Magical) ||
			(this.boardTerrain[r][c] === TerrainTypes.PhysicalShield && movingPiece.attackType !== WeaponType.Physical);
		return !containsUnit && passableTerrain;
	}

	tileIsAttackable(r, c, attackingPiece) {
		if (attackingPiece.attackType === null)
			return false;

		let withinBoard = r >= 0 && r < this.numRows && c >= 0 && c < this.numColumns;
		if (!withinBoard)
			return false;

		let defendingPiece = this.boardPieces[r][c];
		if (defendingPiece === null)
			return false;

		let sameTeam = defendingPiece.alignment === attackingPiece.alignment;
		let isDefended = defendingPiece.defenseType !== null
			&& attackingPiece.attackType === defendingPiece.defenseType;
		let passableTerrain =
			this.boardTerrain[r][c] === TerrainTypes.Empty ||
			(this.boardTerrain[r][c] === TerrainTypes.Goal && movingPiece.alignment === Alignment.Player) ||
			(this.boardTerrain[r][c] === TerrainTypes.MagicalShield && attackingPiece.attackType !== WeaponType.Magical) ||
			(this.boardTerrain[r][c] === TerrainTypes.PhysicalShield && attackingPiece.attackType !== WeaponType.Physical);
		
		return !sameTeam && !isDefended && passableTerrain;
	}

	unsetSelectedTile() {
		this.selectedTile = null;
		this.selectedTileMoveable = [];
	}

	resetAll() {
		this.selectedTile = null;
		this.selectedTileMoveable = [];
		this.previouslyMoveable = [];
	}

	selectedTileMoveableContains(r,c) {
		for (let i = 0; i < this.selectedTileMoveable.length; i++)
		{
			let tile = this.selectedTileMoveable[i];
			if (tile[0] === r && tile[1] === c)
			{
				return true;
			}
		}
		return false;
	}

	previouslyMoveableContains(r,c) {
		for (let i = 0; i < this.previouslyMoveable.length; i++)
		{
			let tile = this.previouslyMoveable[i];
			if (tile[0] === r && tile[1] === c)
			{
				return true;
			}
		}
		return false;
	}

	addToPreviouslyMoveable(targetTile) {
		let bExisting = false;
		for (let existingTile of this.previouslyMoveable) {
			if (existingTile[0] === targetTile[0] && existingTile[1] === targetTile[1])
			{
				bExisting = true;
			}
		}
		if (!bExisting)
		{
			this.previouslyMoveable.push(targetTile);
		}
	}

	getAllTilesWithUnitsOfThisAlignment(alignment) {
		let toReturn = [];
		for (let r = 0; r < this.numRows; r++) {
			for (let c = 0; c < this.numColumns; c++) {
				if (this.boardPieces[r][c] === null)
					continue;
				if (this.boardPieces[r][c].alignment === alignment)
					toReturn.push([r, c]);
			}
		}
		return toReturn;
	}

	checkVictory() {
		let allPlayerUnits = this.getAllTilesWithUnitsOfThisAlignment(Alignment.Player);
		if (allPlayerUnits.length === 0) {
			this.winGame();
			return true;
		}
		return false;
	}
}