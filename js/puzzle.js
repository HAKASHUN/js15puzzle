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

Puzzle.prototype._createTile = function(count){
	var tile = document.createElement('div');
	tile.classList.add('tile');
	tile.setAttribute('data-tile-count', count);
	if (count === this.config.totalTileCount) {
		tile.classList.add('empty');
	} else {
		tile.appendChild(document.createTextNode(count));
		tile.addEventListener('click', this._onTileClick);
	}
	return tile;
};

/**
 * タイルのx, yから実際の座標(px)を取得
 * @param x
 * @param y
 * @return {Object}
 * @private
 */
Puzzle.prototype._getAbsolutePosition = function(x, y){
	return {
		x: x,
		y: y,
		left: (x * this.config.tileSize + this.config.margin * (x + 1)),
		top: (y * this.config.tileSize + this.config.margin * (y + 1))

	}
};

Puzzle.prototype._onTileClick = function(e){
	e.preventDefault();
};

/**
 * タイルを初期化
 */
Puzzle.prototype.init = function(){
	this.config.totalTileCount = Math.pow(this.config.tileCount, 2);
	this._boardElement = document.querySelector(this.config.boardSelector);
	this._boardElement.innerHTML = '';
	this._position = [];
	this._board = [];

	//盤面の作成
	for (var i = 0; i < this.config.totalTileCount; i++) {
		var tile = this._createTile(i + 1),
			curPos = this._getPositionFromCount(i),
			positionObj = this._getAbsolutePosition(curPos.x, curPos.y);

		tile.style.left = positionObj.left + 'px';
		tile.style.top = positionObj.top + 'px';
		tile.setAttribute('data-current-count', (i + 1));
		this._position.push(positionObj);
		this._board[i] = tile;
		this._boardElement.appendChild(tile);
	}
	this._answer = this._board.concat();
};

/**
 * タイルをランダムに並び替え
 * @return {*}
 */
Puzzle.prototype.randomize = function(){
	var ary = this._getShuffledArray(this._getSerialArray(this.config.totalTileCount)),
		tempAry = [];

	this._boardElement.innerHTML = '';
	console.log('ary:', ary);
	for (var i = 0; i < this.config.totalTileCount; i++) {
		tempAry[i] = this._board[ary[i]];
		tempAry[i].style.left = this._position[i].left + 'px';
		tempAry[i].style.top = this._position[i].top + 'px';
		tempAry[i].setAttribute('data-current-count', (i + 1));
		this._boardElement.appendChild(tempAry[i]);
	}
	return ary;
};

/**
 *
 * @param count
 * @return {Array}
 * @private
 */
Puzzle.prototype._getSerialArray = function(count){
	var resultAry = [];
	for (var i = 0; i < count; i++) {
		resultAry.push(i);
	}
	return resultAry;
};

/**
 *
 * @param ary
 * @return {Array}
 * @private
 */
Puzzle.prototype._getShuffledArray = function(ary){
	var len = ary.length,
		tempAry = ary.concat(),
		result = [];

	while(len) {
		result.push(tempAry.splice(Math.floor(Math.random() * len--), 1)[0]);
	}
	return result;
};

/**
 *
 * @param count
 * @return {Object}
 * @private
 */
Puzzle.prototype._getPositionFromCount = function(count){
	var result = {};
	var tempCount = count + 1;
	result.x = tempCount % this.config.tileCount === 0 ? this.config.tileCount - 1 : tempCount % this.config.tileCount - 1;
	result.y = Math.ceil(tempCount / this.config.tileCount) - 1;
	return result;
};

/**
 *
 * @param position
 * @return {*}
 * @private
 */
Puzzle.prototype._getCountFromPosition = function(position){
	//position = { x: int, y: int }
	return this.config.tileCount * position.y + (position.x + 1);
}

