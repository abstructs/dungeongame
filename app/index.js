'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
require('./style.css');

var MainContainer = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row">
          <PlayerHUD />
          <div id="board-container">
            <Board />
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
        <h4>Test</h4>
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
    this.createBoardArray();
    this.addListener();
    $(document).ready(function(){
      $('#2203').addClass('current');
      $('#0000').addClass('wall');
    })
  },
  createBoardArray: function() {
    var board = [];
    var count = 0;
    for (var i = 0; i < 39; i++) {
      for (var j = 0; j < 40; j++) {
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
  addListener: function() {
    var manageCo = function(selector, direction) { // removes and adds currents TODO: manage undefined values
      if (selector.length !== 0) { //stops from going off map
        $('.current').removeClass('current');
        selector.addClass('current');
      }
    }
    window.onkeydown = function(e) {
      if ($('.current').length !== 0) {
        var $currentY = $('.current').attr('id').split('').slice(0, 2).join(''),
        $currentX = $('.current').attr('id').split('').slice(2, 4).join('');

        var up = $('#' + ('0' + (parseInt($currentY) - 1).toString()).slice(-2) + ('0' + $currentX).slice(-2));
        var down = $('#' + ('0' + (parseInt($currentY) + 1).toString()).slice(-2) + ('0' + $currentX).slice(-2));
        var left = $('#' + ('0' + $currentY).slice(-2) + ('0' + (parseInt($currentX) - 1).toString()).slice(-2));
        var right = $('#' + ('0' + $currentY).slice(-2) + ('0' + (parseInt($currentX) + 1).toString()).slice(-2));

        // find the surrounding elements (also appends a 0 to the beginning of an element less that 10)

        if (e.keyCode == 37) manageCo(left); // left
        else if (e.keyCode == 38) manageCo(up); // up
        else if (e.keyCode == 39) manageCo(right); // right
        else if (e.keyCode == 40) manageCo(down); // down
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
