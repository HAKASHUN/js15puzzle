class Puzzle
  constructor: ->
    @init()
  config:
    tileSize: 75
    tileCount: 4
    margin: 1
    totalTileCount: undefined
    boardSelector: '#puzzle'
  _ansower: []
  _position: []
  _board: []
  _createTile: (count) ->
    $tile = $('</div>')

    $tile.addClass('tile').data('tile-count', count)

    if count is @config.totalTileCount
      $tile.addClass 'empty'
    else
      $tile.text(count).click (e) =>
        e.preventDefault()
        @_onTileClick(@)

    return tile
  ###*
  * タイルのx, yから実際の座標(px)を取得
  * @param x
  * @param y
  * @return {Object}
  * @private
  ###
  _onTileClick: (tileEl) =>
    currentPosition = + $(tileEl).data('current-index')
    totalTileCount = @config.totalTileCount
    tileCount = @config.tileCount
    isEmptyTile = @_isEmptyTile
    swapTile = @_swapTile

    if (currentPosition + 1) <= totalTileCount and isEmptyTile(currentPosition + 1)
      swapTile currentPosition, currentPosition + 1
      return false

    if currentPosition - 1 > 0 and isEmptyTile(currentPosition - 1)
      swapTile currentPosition, currentPosition - 1
      return false

    if currentPosition + tileCount <= totalTileCount and isEmptyTile(currentPosition + tileCount)
      swapTile currentPosition, currentPosition + tileCount
      return false

    if currentPosition + tileCount > 0 and isEmptyTile(currentPosition - tileCount)
      swapTile currentPosition, currentPosition - tileCount
      return false
  ###*
  * タイルを初期化
  ###
  init: ->
    @config.totalTileCount = Math.pow @config.tileCount, 2
    @_boardElement = $(@config.boardSelector)
    @_boardElement.html ''
    @_position = []
    @_board = []

    for i in @config.totalTileCount
      tile = @_createTile i + 1
      curPos = @_getPositionFromIndex i
      positionObj = @_getAbsolutePosition curPos.x, curPos.y

      $(tile).css
        left: "#{positionObj.left}px"
        top: "#{positionObj.top}px"
      .data 'current-index', i + 1
      @_position.push positionObj
      @_board[i] = tile
      @_boardElement.append tile

    @_answer = @_board.concat()
  ###*
  * タイルをランダムに並び替え
  * @return {*}
  ###
  randomize: ->
    ary = @_getShuffledArray(@_getSerialArray @config.totalTileCount)
    tempAry = []

    @_boardElement.html ''
    console.log "ary: #{ary}"

    for i in @config.totalTileCount
      tempAry[i] = @_board[ary[i]]
      $(tempAry[i]).css
        left: "#{@_position[i].left}px"
        top: "#{@_position[i].top}px"
      .data 'current-index', i + 1
      @_boardElement.append tempAry[i]

    @_board = tempAry

    return ary
  ###*
  *
  * @param count
  * @return {Array}
  * @private
  ###
  _getSerialArray: (count) ->
    resultAry = []

    for i in count
      resultAry.push i

    return resultAry
  ###*
  *
  * @param ary
  * @return {Array}
  * @private
  ###
  _getShuffledArray: (ary) ->
    len = ary.length
    tempAry = ary.concat()
    result = []

    while len
      result.push tempAry.splice(Math.floor(Math.random() * len--), 1)[0]

    return result
  ###*
  *
  * @param index
  * @return {Object}
  * @private
  ###
  _getPositionFromIndex: (index) ->
    result = {}
    tempCount = index + 1
    result.x = if tempCount % @config.tileCount is 0 then @config.tileCount - 1 else tempCount % @config.tileCount - 1
    result.y = Math.ceil(tempCount / @config.tileCount) - 1

    return result
  ###*
  *
  * @param position
  * @return {*}
  * @private
  ###
  _getIndexFromPosition: (position) ->
    @config.tileCount * position.y + (position.x + 1)
  _isEmptyTile: (index) ->
    tile = @_board[index - 1]
    return $(tile).hasClass('empty')
  _swapTile: (indexA, indexB) ->
    tempIndexA = indexA - 1
    tempIndexB = indexB - 1
    temValue = @_board[tempIndexA]
    positionA = @_position[tempIndexA]
    positionB = @_position[tempIndexB]

    @_board[tempIndexA] = @_board[tempIndexB]
    @_board[tempIndexB] = temValue
    $(@_board[tempIndexA]).css
      top: "#{positionA.top}px"
      left: "#{positionA.left}px"
    .data 'current-index', indexA
    $(@_board[tempIndexB]).css
      top: "#{positionB.top}px"
      left: "#{positionB.left}px"
    .data 'current-index', indexB

    console.log 'swap', indexA, indexB, @_board

$ ->
  puzzle = new Puzzle()

  $('#initPuzzle').click ->
    puzzle.init()

  $('#randomizePuzzle').click ->
    puzzle.randomize()
