'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
require('./style.css');

var MainContainer = React.createClass({
  getInitialState: function() {
    return {
      darkness: false
    }
  },
  componentDidMount: function() {
    $('.box').removeClass('darkness');
  },
  toggleDarkness: function() {
    if (this.state.darkness === true) {
      this.setState({
        darkness: false
      });
    }
    else {
      this.setState({
        darkness: true
      });
    }
  },
  render: function() {
    return (
      <div className="container">
        <div className="row">
          <PlayerHUD />
          <div id="board-container">
          <button className="btn btn-default" onClick={this.toggleDarkness}>Toggle Darkness</button>
            <Board darkness={this.state.darkness}/>
          </div>
        </div>
      </div>
    )
  }
});

  // TODO: everything v

var PlayerHUD = React.createClass({
  render: function() {
    return (
      <div>
        <h4></h4>
      </div>
    )
  }
});

var Board = React.createClass({
  getInitialState: function() {
    return {
      boardArray: [],
      roomArray: []
    }
  },
  componentDidMount: function() {
    var that = this;
    this.createBoardArray();
    this.addListener();
    $(function(){
      $('#1030').addClass('current');
      $('.box').addClass('wall');
      that.addDarkness($('#2203'));
      that.addRoom($('#2222'));
      that.createRoomArray();
    });
  },
  shouldComponentUpdate: function(nextProps) {
    var that = this;
    $(function(){
      if (nextProps.darkness) $('.box').addClass('darkness'), that.addDarkness($('.current'));
      else { $('.box').removeClass('darkness') }
    });
    return true;
  },
  createBoardArray: function() {
    $('.box').addClass('wall');
    var board = [];
    var count = 0;
    for (var i = 0; i < 88; i++) {
      for (var j = 0; j < 90; j++) { // creates an object for each coordinate and pushes them to the board array
        var coordinates = {
          y: i,
          x: j
        };
        var newBox = {
          coordinates: coordinates
        }
        board.push({coordinates});
      }
    }
    this.setState({ // sets the state of the boardArray to the board full of coordinates
      boardArray: board
    });
  },
  createRoomArray: function() {
    var that = this,
    getRand = function(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    };
    $(function(){
      var $currentY, $currentX, room = [], $newId, allBorders = [$('.border')];

      var directions = function($selector, direction) {
        $currentY = $selector.attr('id').split('').slice(0, 2).join('');
        $currentX = $selector.attr('id').split('').slice(2, 4).join('');

        if (direction === 'right') {
          $newId = $('#' + that.formatCo($currentY) + that.formatCo($currentX, 22)); // change integer value to change distance between rooms
        }
        else if (direction === 'left') {
          $newId = $('#' + that.formatCo($currentY) + that.formatCo($currentX, -22));
        }
        else if (direction === 'down'){
          $newId = $('#' + that.formatCo($currentY, 17) + that.formatCo($currentX));
        }
        else if (direction === 'up') {
          $newId = $('#' + that.formatCo($currentY, -17) + that.formatCo($currentX));
        }
        else {
          console.log("direction isn't in database!");
          return false;
        }
        $selector.removeClass('border');
        $newId.addClass('border');
        // console.log('added new border');
        allBorders.push($('.border'));
        return $newId;
      }

      //TODO: make loop to randomly generate rooms

      that.addRoom(directions($('.border'), 'right'));
      // that.addRoom(directions($('.border'), 'right'));
      // that.addRoom(directions($('.border'), 'down'));
      // that.addRoom(directions($('.border'), 'down'));
      // that.addRoom(directions($('.border'), 'down'));
      // that.addRoom(directions($('.border'), 'left'));
      // that.addRoom(directions($('.border'), 'down'));
      // that.addRoom(directions($('.border'), 'left'));
      // that.addRoom(directions($('.border'), 'up'));
      // that.addRoom(directions($('.border'), 'left'));
      // that.addRoom(directions($('.border'), 'up'));

      // TODO: add percent based pathway generation

      allBorders.map(function($border) {
        var count = 0;
        var possibleDirections = []; // TODO: find a way to check if two rooms are already connected
        var pathLogic = function($selector, dir) {
          if (that.canCreatePath($selector, dir)) {
            if (count !== 1) {
              that.createPath(that.canCreatePath($selector, dir), dir);
              count++;
            }
            else {
              if (getRand(0, 2) === 1) {
                that.createPath(that.canCreatePath($selector, dir), dir);
              }
            }
            possibleDirections.push(dir);
          }

        };
        $(function(){
          // TODO: check these values randomly
          pathLogic($border, 'right');
          pathLogic($border, 'left');
          pathLogic($border, 'up');
          pathLogic($border, 'down');

          // if (that.canCreatePath($border, 'up')) {
          //   pathCreated = true;
          //   possibleDirections.push('up');
          // }
          // if (that.canCreatePath($border, 'down')) {
          //   pathCreated = true;
          //   possibleDirections.push('down');
          // }
          // possibleDirections.map(function(){
          //
          // });
        });
      });
    });
  },
  findWall: function($target, dir) {
    var $currentY = $target.attr('id').split('').slice(0, 2).join(''),
      $currentX = $target.attr('id').split('').slice(2, 4).join(''), // parses out x and y coordinates from id
      y = parseInt($currentY),
      x = parseInt($currentX),
      $wallTestBox, wallNotFound = true, count = 0, that = this;

    while (wallNotFound) {

      // goes through each element until a div with the classname of "wall" is found (allows us to find the wall in a given direction)

      if (dir == 'left') { $wallTestBox = $('#' + that.formatCo(y) + that.formatCo(x, count--)) }
      else if (dir == 'right') { $wallTestBox = $('#' + that.formatCo(y) + that.formatCo(x, count++)) }
      else if (dir == 'up') { $wallTestBox = $('#' + that.formatCo(y, count--) + that.formatCo(x)) }
      else if (dir == 'down') { $wallTestBox = $('#' + that.formatCo(y, count++) + that.formatCo(x)) }
      if ($wallTestBox.hasClass('wall')) { // if a wall is found
        // console.log('The wall from ' + $target.attr('id') + ' that is ' + direction + ' is at: ' + $wallTestBox.attr('id')); // log out the position of the wall for debugging purposes
        wallNotFound = false; // stop the loop

        return $wallTestBox; // returns the selector containing the wall

      }
    }
  },
  hasPath: function($border, direction) { // always takes the 'top left' border
    var that = this,
    $wall = that.findWall($border, direction),
    $currentY = $wall.attr('id').split('').slice(0, 2).join(''),
    $currentX = $wall.attr('id').split('').slice(2, 4).join(''), // parses out x and y coordinates from id
    y = parseInt($currentY),
    x = parseInt($currentX),
    $startSelector = $wall, stillRoom = true, count = 0, $nextSelector, control = 0;

    while (stillRoom) {
      if (direction == 'right' || direction == 'left') {
        $nextSelector = $('#' + that.formatCo(y, count++) + that.formatCo(x));

        if ($nextSelector.hasClass('path')) {
          stillRoom = false;
          return true
        }
      }
      if (direction == 'up' || direction == 'down') {
        $nextSelector = $('#' + that.formatCo(y) + that.formatCo(x, count++));
        if ($nextSelector.hasClass('path')) {
          stillRoom = false;
          return true
        }
      }
      else {
        if (control == 20) {
          stillRoom = false;
          return false;
        }
        control++;
      }
    }
  },
  createBoard: function(arr) {
    if (arr) {
      var count = 1;
      return arr.map(function(item){ // maps out each element of the boardArray which contains coordinates, returns a component box for each element
        var boxCo = ('0' + item.coordinates.y).slice(-2) + ('0' + item.coordinates.x).slice(-2); // formats the coordinates so it always contains two digits, three digits not supported
        return <Box key={count++} boxCo={boxCo} />
      });
    }
  },
  addDarkness: function($curr) { // expects number
    if (typeof($curr) === 'object') {
      $('.box').addClass('darkness')
      var y = $curr.attr('id').split('').slice(0, 2).join(''),
      x = $curr.attr('id').split('').slice(2, 4).join('');
      var nextX = 0,
      nextY = 0;
      for (var i = -5; i <= 5; i++) {
        nextY = i;
        for (var j = -5; j <= 5; j++) {
          nextX = j;
          $('#' + this.formatCo(y, nextY) + this.formatCo(x, nextX)).removeClass('darkness');
        }
      }
    }
  },
  formatCo: function(num, calc) { // coordinate string manipulation is dependent on formatCo
    if (typeof(num) !== 'number') num = parseInt(num);
    if (calc) {
      return ('0' + ((num + calc).toString())).slice(-2);
    } else {
      return ('0' + ((num).toString())).slice(-2);
    }
  },
  canCreatePath: function($target, direction) {
    var that = this,
    getRand = function(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    };

    var $currentY = $target.attr('id').split('').slice(0, 2).join(''),
    $currentX = $target.attr('id').split('').slice(2, 4).join(''), // parses out x and y coordinates from id
    y = parseInt($currentY),
    x = parseInt($currentX),
    roomExists = function($wall, dir) {
      // I like the redefine these values in case they need to be changed later
      var $wallY = $wall.attr('id').split('').slice(0, 2).join(''),
        $wallX = $wall.attr('id').split('').slice(2, 4).join(''),
        pWallY = parseInt($wallY),
        pWallX = parseInt($wallX),
        $floorTestBox, count = 0;
      for (var i = 0; i < 25; i++) {
        if (dir == 'left') { $floorTestBox = $('#' + that.formatCo(pWallY) + that.formatCo(pWallX, count--)) }
        else if (dir == 'right') { $floorTestBox = $('#' + that.formatCo(pWallY) + that.formatCo(pWallX, count++)) }
        else if (dir == 'up') { $floorTestBox = $('#' + that.formatCo(pWallY, count--) + that.formatCo(pWallX)) }
        else if (dir == 'down') { $floorTestBox = $('#' + that.formatCo(pWallY, count++) + that.formatCo(pWallX)) }
        // console.log(!$floorTestBox.hasClass('wall'));
        if ($floorTestBox.length == 0) {
          return false
        }
        if ($floorTestBox.hasClass('box') && !$floorTestBox.hasClass('wall')) {
          // console.log('Direction: ' + direction);
          // console.log($floorTestBox);
          return true;
        }
        // if loop checks 20 elements, if it doesnt find a room it will stop, can be changed to get rooms that are farther away by changing value added to count or loop iterations
        // $floorTestBox.removeClass('wall'); // creates the path... considering making a seperate function for this if there needs to be truly random generation
      }
      // default return false
      return false
    }
    var $wall = that.findWall($target ,direction);
    if (roomExists($wall, direction)) {
      return $wall;
    }
    return false;
  },
  createPath: function($target, direction) {
    var $currentY = $target.attr('id').split('').slice(0, 2).join(''),
    $currentX = $target.attr('id').split('').slice(2, 4).join(''),
    y = parseInt($currentY),
    x = parseInt($currentX),
    count = 0, that = this, $wall, notComplete = true,
    getRand = function(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    };
    $(function(){
      var randNum = getRand(5, 7);
      while (notComplete) {
        if (direction == 'left') { $wall = $('#' + that.formatCo(y, randNum) + that.formatCo(x, count--)) }
        else if (direction == 'right') { $wall = $('#' + that.formatCo(y, randNum) + that.formatCo(x, count++)) }
        else if (direction == 'up') { $wall = $('#' + that.formatCo(y, count--) + that.formatCo(x, randNum)) }
        else if (direction == 'down') { $wall = $('#' + that.formatCo(y, count++) + that.formatCo(x, randNum)) }
        if ($wall.hasClass('wall')) {
          $wall.addClass('path');
          $wall.removeClass('wall');
        }
        else if (!$wall.hasClass('wall')) {
          notComplete = false;
        }
      }
    });
  },
  addRoom: function($target) {
    var that = this;
    var $currentY = $target.attr('id').split('').slice(0, 2).join(''),
      $currentX = $target.attr('id').split('').slice(2, 4).join(''),
      y = parseInt($currentY),
      x = parseInt($currentX),
      nextY = y,
      nextX = x,
      getRand = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      };

    $(function() {
      var count = 0,
      rows = getRand(10, 15),
      columns = getRand(10, 20);
      $('.border').removeClass('border');
      $target.addClass('border');
        for (var i = 0; i < rows; i++) { // changes rows
          for (var j = 0; j < columns; j++) { // changes columns
            nextX = j;
            // creates the room
            $('#' + that.formatCo(nextY) + that.formatCo(x, nextX)).removeClass('wall');
          }
          nextY++;
        }
    });
  },
  addListener: function() {
    var that = this;
    var manageCo = function(selector) { // removes and adds currents
      if (selector.length !== 0 && !selector.hasClass('wall')) { //stops from going off map
        $('.current').removeClass('current');
        selector.addClass('current');
        if (that.props.darkness === true) { that.addDarkness(selector) }
        else if (that.props.darkness === false) { $('.box').removeClass('darkness') }
      }
    }
    window.onkeydown = function(e) {
      if ($('.current').length !== 0) {
        var $currentY = $('.current').attr('id').split('').slice(0, 2).join(''),
        $currentX = $('.current').attr('id').split('').slice(2, 4).join(''),
        y = parseInt($currentY),
        x = parseInt($currentX);
        var directions = {
          up: $('#' + that.formatCo(y, -1) + that.formatCo(x)),
          down: $('#' + that.formatCo(y, 1) + that.formatCo(x)),
          left: $('#' + that.formatCo(y) + that.formatCo(x, -1)),
          right: $('#' + that.formatCo(y) + that.formatCo(x, 1))
        }
        // find the surrounding elements (also appends a 0 to the beginning of an element less that 10)
        if (e.keyCode == 37) e.preventDefault(), manageCo(directions.left); // left
        else if (e.keyCode == 38) e.preventDefault(), manageCo(directions.up); // up
        else if (e.keyCode == 39) e.preventDefault(), manageCo(directions.right); // right
        else if (e.keyCode == 40) e.preventDefault(), manageCo(directions.down); // down
      }
    }
  },
  render: function() {
    return (
      <div id="board">
        {this.createBoard(this.state.boardArray)}
      </div>
    )
  }
});
var Box = React.createClass({
  render: function() {
    return (
      <div className="box" id={this.props.boxCo}>
      </div>
    )
  }
});

ReactDOM.render(
  <MainContainer />,
  document.getElementById('app')
);
