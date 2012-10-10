document.addEventListener('DOMContentLoaded', function(){
	var puzzle = new Puzzle();
	var initButton = document.querySelector('#initPuzzle');
	initButton.addEventListener('click', function(){
		puzzle.init();
	});
});

var Puzzle = function(){
	this.init();
};
Puzzle.prototype.config = {
	tileSize: 75,               //タイルの幅・高さ
	boardSize: 4,               //縦・横のタイル数
	margin: 1,                  //タイル間のマージン
	totalBoardSize: undefined,   //合計タイル数
	boardSelector: '#puzzle'      //盤面要素のセレクタ
};
//Puzzle.prototype._answer = {};
//Puzzle.prototype._position = [];
Puzzle.prototype._board = [];
Puzzle.prototype._createTile = function(position){
	var tile = document.createElement('div');
	if (position === this.config.totalBoardSize) {
		tile.classList.add('emptyTile');
	} else {
		tile.classList.add('tile');
		tile.appendChild(document.createTextNode(position));
		tile.addEventListener('click', this._onTileClick);
	}
	return tile;
};
Puzzle.prototype._setTilePosition = function(tile, x, y){
	tile.style.left = (x * this.config.tileSize + this.config.margin) + 'px';
	tile.style.right = (y * this.config.tileSize + this.config.margin) + 'px';
	return tile;
};
Puzzle.prototype._onTileClick = function(e){
	e.preventDefault();
};
Puzzle.prototype.init = function(){
	this.config.totalBoardSize = Math.pow(this.config.boardSize, 2);
	this._boardElement = document.querySelector(this.config.boardSelector);
	this._boardElement.innerHTML = '';
	//盤面の作成
	for (var x = 0; x < this.config.boardSize; x++) {
		this._board[x] = [];
		for (var y = 0; y < this.config.boardSize; y++) {
			var tile = this._createTile((x * this.config.boardSize + y + 1));
			tile = this._setTilePosition(tile, x, y);
			this._board[x][y] = tile;
			this._boardElement.appendChild(tile);
		}
	}
};