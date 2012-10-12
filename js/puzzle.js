document.addEventListener('DOMContentLoaded', function(){
	var puzzle = new Puzzle();

	var initButton = document.querySelector('#initPuzzle');
	initButton.addEventListener('click', function(){
		puzzle.init();
	});

	var randomButton = document.querySelector('#randomizePuzzle');
	randomButton.addEventListener('click', function(){
		puzzle.randomize();
	})

});

var Puzzle = function(){
	this.init();
};
Puzzle.prototype.config = {
	tileSize: 75,               //タイルの幅・高さ
	tileCount: 4,               //縦・横のタイル数
	margin: 1,                  //タイル間のマージン
	totalTileCount: undefined,   //合計タイル数
	boardSelector: '#puzzle'      //盤面要素のセレクタ
};

Puzzle.prototype._answer = [];
Puzzle.prototype._position = [];

Puzzle.prototype._board = [];

Puzzle.prototype._createTile = function(position){
	var tile = document.createElement('div');
	if (position === this.config.totalTileCount) {
		tile.classList.add('emptyTile');
	} else {
		tile.classList.add('tile');
		tile.appendChild(document.createTextNode(position));
		tile.addEventListener('click', this._onTileClick);
	}
	return tile;
};

Puzzle.prototype._getPosition = function(y, x){
	return {
		y: y,
		x: x,
		left: (x * this.config.tileSize + this.config.margin * (x + 1)),
		top: (y * this.config.tileSize + this.config.margin * (y + 1))

	}
};

Puzzle.prototype._onTileClick = function(e){
	e.preventDefault();
};

Puzzle.prototype.init = function(){
	this.config.totalTileCount = Math.pow(this.config.tileCount, 2);
	this._boardElement = document.querySelector(this.config.boardSelector);
	this._boardElement.innerHTML = '';
	this._position = [];
	this._board = [];
	//盤面の作成
	for (var y = 0; y < this.config.tileCount; y++) {
		this._board[y] = [];
		for (var x = 0; x < this.config.tileCount; x++) {
			var tile = this._createTile((y * this.config.tileCount + x + 1));
			var positionObj = this._getPosition(y, x);
			tile.style.left = positionObj.left + 'px';
			tile.style.top = positionObj.top + 'px';
			this._position.push(positionObj);
			this._board[y][x] = tile;
			this._boardElement.appendChild(tile);
		}
	}
	this._answer = this._board.concat();
};

Puzzle.prototype.randomize = function(){
	var ary = this._getShuffledArray(this._getSerialArray(this.config.totalTileCount));
	var tempAry = [];
	this._boardElement.innerHTML = '';
	var tileCount = 0;
	console.log('ary:', ary);
	for (var x = 0, lenX = this.config.tileCount; x < lenX; x++) {
		tempAry[x] = [];
		for (var y = 0, lenY = this.config.tileCount; y < lenY; y++) {
			var curPos = this._getPositionFromCount(ary[tileCount]);
			tempAry[x][y] = this._board[curPos.x][curPos.y];
			tempAry[x][y].style.left = this._position[tileCount].left + 'px';
			tempAry[x][y].style.top = this._position[tileCount].top + 'px';
			this._boardElement.appendChild(tempAry[x][y]);
			tileCount++;
		}
	}
	return ary;
};

Puzzle.prototype._getSerialArray = function(count){
	var resultAry = [];
	for (var i = 0; i < count; i++) {
		resultAry.push(i);
	}
	return resultAry;
};

Puzzle.prototype._getShuffledArray = function(ary){
	var len = ary.length,
		tempAry = ary.concat(),
		result = [];
	while(len) {
		result.push(tempAry.splice(Math.floor(Math.random() * len--), 1)[0]);
	}
	return result;
};

Puzzle.prototype._getPositionFromCount = function(count){
	var result = {};
	var tempCount = count + 1;
	result.x = tempCount % this.config.tileCount === 0 ? this.config.tileCount - 1 : tempCount % this.config.tileCount - 1;
	result.y = Math.ceil(tempCount / this.config.tileCount) - 1;
	return result;
};

Puzzle.prototype._getCountFromPosition = function(position){
	//position = { x: int, y: int }
	return this.config.tileCount * position.y + (position.x + 1);
}

