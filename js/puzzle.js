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
	var that = this,
		tile = document.createElement('div');

	tile.classList.add('tile');
	tile.setAttribute('data-tile-count', count);
	if (count === this.config.totalTileCount) {
		tile.classList.add('empty');
	} else {
		tile.appendChild(document.createTextNode(count));
		tile.addEventListener('click', function(e){
			e.preventDefault();
			that._onTileClick(this);
		});
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

Puzzle.prototype._onTileClick = function(tileEl){
	var that = this,
		currentPosition = +tileEl.getAttribute('data-current-index');

	//現在の位置から上下左右に空タイルがあるか確認、あったらリプレース
	if ((currentPosition + 1) <= that.config.totalTileCount && that._isEmptyTile(currentPosition + 1)) {
		that._swapTile(currentPosition, currentPosition + 1);
		return false;
	}

	if ((currentPosition - 1) > 0  && that._isEmptyTile(currentPosition - 1)) {

		that._swapTile(currentPosition, currentPosition - 1);
		return false;
	}

	if ((currentPosition + that.config.tileCount) <= that.config.totalTileCount
		&& that._isEmptyTile(currentPosition + that.config.tileCount)) {

		that._swapTile(currentPosition, currentPosition + that.config.tileCount);
		return false;
	}

	if ((currentPosition + that.config.tileCount) > 0
		&& that._isEmptyTile(currentPosition - that.config.tileCount)) {

		that._swapTile(currentPosition, currentPosition - that.config.tileCount);
		return false;
	}
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
			curPos = this._getPositionFromIndex(i),
			positionObj = this._getAbsolutePosition(curPos.x, curPos.y);

		tile.style.left = positionObj.left + 'px';
		tile.style.top = positionObj.top + 'px';
		tile.setAttribute('data-current-index', (i + 1));
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
		tempAry[i].setAttribute('data-current-index', (i + 1));
		this._boardElement.appendChild(tempAry[i]);
	}
	this._board = tempAry;
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
 * @param index
 * @return {Object}
 * @private
 */
Puzzle.prototype._getPositionFromIndex = function(index){
	var result = {};
	var tempCount = index + 1;
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
Puzzle.prototype._getIndexFromPosition = function(position){
	//position = { x: int, y: int }
	return this.config.tileCount * position.y + (position.x + 1);
}

Puzzle.prototype._isEmptyTile = function(index){
	var tile = this._board[index - 1];
	return tile.classList.contains('empty');
};

Puzzle.prototype._swapTile = function(indexA, indexB){
	var tempIndexA = indexA - 1,
		tempIndexB = indexB - 1,
		tempValue = this._board[tempIndexA],
		positionA = this._position[tempIndexA],
		positionB = this._position[tempIndexB];

	this._board[tempIndexA] = this._board[tempIndexB];
	this._board[tempIndexB] = tempValue;
	this._board[tempIndexA].style.top = positionA.top + 'px';
	this._board[tempIndexA].style.left = positionA.left + 'px';
	this._board[tempIndexB].style.top = positionB.top + 'px';
	this._board[tempIndexB].style.left = positionB.left + 'px';
	this._board[tempIndexA].setAttribute('data-current-index', indexA);
	this._board[tempIndexB].setAttribute('data-current-index', indexB);
	console.log('swap', indexA, indexB, this._board);
};