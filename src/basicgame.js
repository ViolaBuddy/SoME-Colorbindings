"use strict";

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
	constructor(imgPath) {
		super()
		this.imgPath = imgPath;
		this.domElement = document.createElement('img');
		this.domElement.setAttribute('src', this.imgPath);
	}
}

class Board extends GameObject {
	constructor(numRows=8, numColumns=8, domId=null) {
		super()
		this.numRows = numRows;
		this.numColumns = numColumns;
		this.pieces = [];

		this.domElement = document.createElement('table');
		if (domId) {
			this.domElement.id = domId;
		}
		for (var r = 0; r < this.numRows; r++) {
			var thisRow = document.createElement('tr');
			this.domElement.appendChild(thisRow);
			for (var c = 0; c < this.numColumns; c++) {
				var thisCell = document.createElement('td');
				thisRow.appendChild(thisCell);
				var thisCellDiv = document.createElement('div');
				thisCellDiv.classList.add('cell');
				thisCell.appendChild(thisCellDiv);

				if ( (c%2) ^ (r%2) ) {
					thisCellDiv.classList.add('darkcell');
				}
				else {
					thisCellDiv.classList.add('lightcell');
				}
			}
		}
	}

	addPiece(piece, row=0, column=0) {
		console.assert(row >=0 && row < this.numRows);
		console.assert(column >=0 && column < this.numColumns);

		this.pieces.push({
			piece: piece,
			row: row,
			column: column
		});

		var tdDom = this.domElement.children[row].children[column].firstChild;
		piece.addDomToParent(tdDom);
	}
}

function setupGame(arg) {
	const boardsize = 8;


	var mainBoard = new Board(boardsize, boardsize, 'maintable');
	mainBoard.addDomToParent('main');

	var tempPiece = new Piece('../../GMTKGameJam2023/src/img/PLACEHOLDER_JS.gif');
	mainBoard.addPiece(tempPiece, 3, 6)

}

function startGame(arg) {
}