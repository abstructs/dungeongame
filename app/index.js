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
      boardArray: []
    }
  },
  componentDidMount: function() {
    var that = this;
    this.createBoardArray();
    this.addListener();
    $(document).ready(function(){
      $('#2203').addClass('current');
      that.addDarkness($('#2203'));
    });
    this.addRoom();
  },
  shouldComponentUpdate: function(nextProps) {
    var that = this;
    $(document).ready(function(){
      if (nextProps.darkness) $('.box').addClass('darkness'), that.addDarkness($('.current'));
      else { $('.box').removeClass('darkness') }
    });
    return true;
  },
  createBoardArray: function() {
    var board = [];
    var count = 0;
    for (var i = 0; i < 78; i++) {
      for (var j = 0; j < 80; j++) {
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
    this.setState({
      boardArray: board
    });
  },
  createBoard: function(arr) {
    if (arr) {
      var count = 1;
      return arr.map(function(item){
        var boxCo = ('0' + item.coordinates.y).slice(-2) + ('0' + item.coordinates.x).slice(-2);
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
  addRoom: function() {
    var that = this;
    $(document).ready(function(){
      var nextY,
      nextX;
      var y = 0,
      x = 0;
      for (var i = -5; i <= 5; i++) {
        nextY = i;
        for (var j = -5; j <= 5; j++) {
          nextX = j;
          $('#' + that.formatCo(y, nextY) + that.formatCo(x, nextX)).removeClass('darkness');
        }
      }
      console.log('room added!');
    });
  },
  addListener: function() {
    var that = this;
    var manageCo = function(selector) { // removes and adds currents
      if (selector.length !== 0) { //stops from going off map
        $('.current').removeClass('current');
        selector.addClass('current');
        if (that.props.darkness === true) { that.addDarkness(selector) }
        else if (that.props.darkness === false) { $('.box').removeClass('darkness') }
      }
    }
    window.onkeydown = function(e) {
      if ($('.current').length !== 0) {
        var $currentY = $('.current').attr('id').split('').slice(0, 2).join(''),
        $currentX = $('.current').attr('id').split('').slice(2, 4).join('');
        var directions = {
          up: $('#' + that.formatCo($currentY, -1) + that.formatCo($currentX)),
          down: $('#' + that.formatCo($currentY, 1) + that.formatCo($currentX)),
          left: $('#' + that.formatCo($currentY) + that.formatCo($currentX, -1)),
          right: $('#' + that.formatCo($currentY) + that.formatCo($currentX, 1))
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
