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
        <div id="board-container">
        <button className="btn btn-default" onClick={this.toggleDarkness}>Toggle Darkness</button>
          <Board darkness={this.state.darkness} />
        </div>
      </div>
    )
  }
});

var PlayerHUD = React.createClass({
  render: function() {
    return (
      <div>
        <h4>
          <span className='playerStats'>Health: {this.props.health}</span>
          <span className='playerStats'>Weapon: {this.props.weapon}</span>
          <span className='playerStats'>Damage: [{this.props.minDamage} ~ {this.props.maxDamage}]</span>
          <span className='playerStats'>Experience: {this.props.experience}</span>
          <span className='playerStats'>Level: {this.props.playerLevel}</span>
        </h4>
      </div>
    )
  }
});

var Board = React.createClass({
  getInitialState: function() {
    return {
      boardArray: [],
      roomArray: [],
      playerLevel: 1,
      weapon: 'Fist',
      health: 100,
      enemyCount: 0,
      healthAmount: 15, // how much health green blocks restore
      maxDamage: 15,
      minDamage: 10,
      experience: 0
    }
  },
  componentDidMount: function() {
    var that = this;
    this.createBoardArray();
    this.addListener();
    $(function(){
      // $('#2827').addClass('current');
      $('.box').addClass('wall');
      that.addDarkness($('#2203'));
      that.addRoom($('#2222'));
      that.createRoomArray();
      // add player to random square
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
//    board.push({y: 88, x: 00}); //one short for board
    this.setState({ // sets the state of the boardArray to the board full of coordinates
      boardArray: board
    });
  },
  spawnElements: function() {
    var that = this;
    $(function(){
      //add enemies and weapons

      for (var i = 0; i < 15; i++) {
        var $fl = $('.canSpawn');
        var random = Math.floor(Math.random() * $fl.length);

        if (i <= 4) { // spawns 5 level 1 enemies
          $fl.eq(random % $fl.length).addClass('enemy1 100').removeClass('canSpawn');
        }
        else if (i <= 9) { // spawns 5 level 2 enemies
          $fl.eq(random % $fl.length).addClass('enemy2 120').removeClass('canSpawn');
        }
        else if (i <= 12) { // spawns 3 level 3 enemies
          $fl.eq(random % $fl.length).addClass('enemy3 150').removeClass('canSpawn');
        }
        else if (i <= 15) { // spawns 3 level 4 enemies
          $fl.eq(random % $fl.length).addClass('enemy4 200').removeClass('canSpawn');
        }
      }

      for (var i = 0; i < 5; i++) {
        var $fl = $('.canSpawn');
        var random = Math.floor(Math.random() * $fl.length);
        $fl.eq(random % $fl.length).addClass('weapon').removeClass('canSpawn');
      }

      for (var i = 0; i < 10; i++) {
        var $fl = $('.canSpawn');
        var random = Math.floor(Math.random() * $fl.length);
        $fl.eq(random % $fl.length).addClass('health').removeClass('canSpawn');
      }

      for (var i = 0; i < 22; i++) { // remove unneccessary walls (save space)
        $('.row' + i.toString()).remove();
      }
      //$('#2827').addClass('current');
      var $fl = $('.canSpawn');
      var random = Math.floor(Math.random() * $fl.length);
      $fl.eq(random % $fl.length).addClass('current');
      that.centerPlayer();
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
          $newId = $('#' + that.formatCo($currentY) + that.formatCo($currentX, getRand(20, 22))); // change integer value to change distance between rooms
        }
        else if (direction === 'left') {
          $newId = $('#' + that.formatCo($currentY) + that.formatCo($currentX, getRand(-20, -22)));
        }
        else if (direction === 'down'){
          $newId = $('#' + that.formatCo($currentY, getRand(17, 20)) + that.formatCo($currentX));
        }
        else if (direction === 'up') {
          $newId = $('#' + that.formatCo($currentY, getRand(-17, -20)) + that.formatCo($currentX));
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

      that.addRoom(directions($('.border'), 'right'));
      that.addRoom(directions($('.border'), 'right'));
      that.addRoom(directions($('.border'), 'down'));
      that.addRoom(directions($('.border'), 'down'));
      that.addRoom(directions($('.border'), 'down'));
      that.addRoom(directions($('.border'), 'left'));
      that.addRoom(directions($('.border'), 'left'));
      that.addRoom(directions($('.border'), 'up'));
      that.addRoom(directions($('.border'), 'right'));
      that.addRoom(directions($('.border'), 'up'));

      allBorders.map(function($border) {
        var count = 0;
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
          }
        };
        $(function(){
          // TODO: check these values randomly
          pathLogic($border, 'right');
          pathLogic($border, 'down');
          pathLogic($border, 'left');
          pathLogic($border, 'up');
        });
      });
      that.spawnElements();
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
      else if (direction == 'up' || direction == 'down') {
        $nextSelector = $('#' + that.formatCo(y) + that.formatCo(x, count++));
        if ($nextSelector.hasClass('path')) {
          stillRoom = false;
          return true
        }
      }
      if (control == 20) {
        stillRoom = false;
        return false;
      }
      else {
        control++;
      }
    }
  },
  createBoard: function(arr) {
    if (arr) {
      var count = 1,
      rowCount = 0;
      return arr.map(function(item){ // maps out each element of the boardArray which contains coordinates, returns a component box for each element
        if (('0' + item.coordinates.x).slice(-2) === '00') {
          var boxCo = ('0' + item.coordinates.y).slice(-2) + ('0' + item.coordinates.x).slice(-2); // formats the coordinates so it always contains two digits, three digits not supported
          return <Box key={count++} boxCo={boxCo} rowCount={rowCount++} />
        }
        else {
          var boxCo = ('0' + item.coordinates.y).slice(-2) + ('0' + item.coordinates.x).slice(-2); // formats the coordinates so it always contains two digits, three digits not supported
          return <Box key={count++} boxCo={boxCo} rowCount={rowCount}/>
        }
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
      if (that.hasPath($target, direction)) {
        notComplete = false;
      }
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
      enemyCount = 0,
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
          var $newBox = $('#' + that.formatCo(nextY) + that.formatCo(x, nextX));
          $newBox.removeClass('wall').addClass('floor canSpawn');
          var rand = getRand(1, 150);
          // if (rand === 1) {
          //   enemyCount++;
          //   $('#' + that.formatCo(nextY) + that.formatCo(x, nextX)).addClass('enemy');
          // }
        }
        nextY++;
      }
      enemyCount += that.state.enemyCount;
      that.setState({
        enemyCount: enemyCount
      });
    });
  },
  centerPlayer: function(direction) {
    $(function(){
      if (direction == 'right' || direction == 'left') {
        $('html,body').scrollLeft($('.current').position().left - 150);
      }
      else if (direction == 'up' || direction == 'down'){
        $('html,body').scrollTop($('.current').position().top - 100);
      }
      else {
        var elementId = $('.current').attr('id');
        window.location.hash = elementId;
      }
    });
  },
  addListener: function() {
    var that = this,
    getRand = function(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    newWeapon = function(weapon) {
      var newDamage = that.state.maxDamage += 15;
      that.setState({
        maxDamage: newDamage,
        minDamage: newDamage - 10
      });
      if (weapon == 'Fist') {
        return 'Dagger'
      }
      else if (weapon === 'Dagger') {
        return 'Sword'
      }
      else if (weapon === 'Sword') {
        return 'Great Sword'
      }
      else if (weapon === 'Great Sword') {
        return 'Scythe'
      }
      else if (weapon === 'Scythe') {
        return 'Death'
      }
    },
    manageEnemyHealth = function(selector, level) {
      var boxClasses = selector.attr('class').split(' '); // split enemy element
      var health = parseInt(boxClasses[boxClasses.length - 1]); // get last element from element (which is the health)

      health -= getRand(that.state.minDamage, that.state.maxDamage); // substract player damage from enemies current health
      selector.attr('class', 'box floor enemy' + level.toString() + ' ' + health.toString()); // add the new health to enemy element
      if (health <= 0) {
        selector.removeClass('enemy' + level);
        playerExperience(level);
        return; // makes it so if the player kills the enemy he wont take damage (our hero is naturaly fast)
      };
      // do damage to the player
      var playerHealth = that.state.health -= damageToPlayer(level);
      that.setState({
        health: playerHealth
      })
    },
    playerLevel = function(expAmount, pLvl) {
      var playerExp = that.state.experience;
      if (pLvl === 1) {
        if (expAmount >= 50) {
          var newDamage = that.state.maxDamage += 15;
          that.setState({
            playerLevel: 2,
            maxDamage: newDamage,
            minDamage: newDamage - 10
          });
        }
      }
      if (pLvl === 2) {
        if (expAmount >= 100) {
          var newDamage = that.state.maxDamage += 15;
          that.setState({
            playerLevel: 3,
            maxDamage: newDamage,
            minDamage: newDamage - 10
          });
        }
      }
      if (pLvl === 3) {
        if (expAmount >= 200) {
          var newDamage = that.state.maxDamage += 15;
          that.setState({
            playerLevel: 4,
            maxDamage: newDamage,
            minDamage: newDamage - 10
          });
        }
      }
      if (pLvl === 4) {
        if (expAmount >= 250) {
          var newDamage = that.state.maxDamage += 15;
          that.setState({
            playerLevel: 5,
            maxDamage: newDamage,
            minDamage: newDamage - 10
          });
        }
      }
    },
    playerExperience = function(level) {
      var pExp = that.state.experience
      if (level == 1) {
        pExp += 10;
      }
      else if (level == 2) {
        pExp += 25
      }
      else if (level == 3) {
        pExp += 50
      }
      else if (level == 4) {
        pExp += 75
      }
      playerLevel(pExp, that.state.playerLevel)
      that.setState({
        experience: pExp
      });
    },
    damageToPlayer = function(level) {
      if (level == 1) {
        return getRand(3, 7)
      }
      else if (level == 2) {
        return getRand(7, 10)
      }
      else if (level == 3) {
        return getRand(10, 15)
      }
      else if (level == 4) {
        return getRand(15, 20)
      }
      else if (level == 5) {
        return getRand(20, 30)
      }
    },
    manageCo = function(selector, direction) { // removes and adds currents
      if (selector.length !== 0 && !selector.hasClass('wall') && !selector.hasClass('enemy1') && !selector.hasClass('enemy2') && !selector.hasClass('enemy3') && !selector.hasClass('enemy4')) { //stops from going off map
        $('.current').removeClass('current');
        selector.addClass('current');

        // TODO: add scrolling logic
        that.centerPlayer(direction);

        if (that.props.darkness === true) { that.addDarkness(selector) }
        else if (that.props.darkness === false) { $('.box').removeClass('darkness') }
      }
      if (selector.hasClass('health')) {
        var newHealth = that.state.health += that.state.healthAmount
        that.setState({
          health: newHealth
        });
        selector.removeClass('health')
      }
      else if (selector.hasClass('weapon')) {
        var oldWeapon = that.state.weapon
        that.setState({
          weapon: newWeapon(oldWeapon)
        });
        selector.removeClass('weapon');
      }
      else if (selector.hasClass('enemy1')) {
        manageEnemyHealth(selector, 1);
      }
      else if (selector.hasClass('enemy2')) {
        manageEnemyHealth(selector, 2);
      }
      else if (selector.hasClass('enemy3')) {
        manageEnemyHealth(selector, 3);
      }
      else if (selector.hasClass('enemy4')) {
        manageEnemyHealth(selector, 4);
      }
      else if (selector.hasClass('enemy5')) {
        manageEnemyHealth(selector, 5);
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
        if (e.keyCode == 37) e.preventDefault(), manageCo(directions.left, 'left'); // left
        else if (e.keyCode == 38) e.preventDefault(), manageCo(directions.up, 'up'); // up
        else if (e.keyCode == 39) e.preventDefault(), manageCo(directions.right, 'right'); // right
        else if (e.keyCode == 40) e.preventDefault(), manageCo(directions.down, 'down'); // down
      }
    }
  },
  render: function() {
    return (
      <div>
        <PlayerHUD health={this.state.health} weapon={this.state.weapon} experience={this.state.experience} maxDamage={this.state.maxDamage} minDamage={this.state.minDamage} playerLevel={this.state.playerLevel}/>

        <div id="board">
          {this.createBoard(this.state.boardArray)}
        </div>
      </div>
    )
  }
});
var Box = React.createClass({
  render: function() {
    return (
      <div className={'box ' + 'row' + this.props.rowCount} id={this.props.boxCo}>
      </div>
    )
  }
});

ReactDOM.render(
  <MainContainer />,
  document.getElementById('app')
);
