var stage = new pb.Stage();
var ctx = stage.getContext();
var board = new pb.Board(ctx);

/**
 * Create Effect Types
 */
var overdrive = new pb.stomp.Overdrive(ctx);
var reverb = new pb.stomp.Reverb(ctx);
var volume = new pb.stomp.Volume(ctx);
var cabinet = new pb.stomp.Cabinet(ctx);
var delay = new pb.stomp.Delay(ctx);

var availablePedals = {
  'overdrive': overdrive,
  'delay': delay,
  'reverb': reverb,
  'cabinet': cabinet,
  'volume': volume
};

/**
 * Start Board
 */

stage.render(document.getElementById('floor'));
stage.setBoard(board);

/**
 * Start React
 */

var PedalList = React.createClass({
  getInitialState: function() {
    return {
      pedals: [
        {'name': 'OD', 'class': 'overdrive', 'classString': 'btn btn-success btn-fab btn-raised'},
        {'name': 'DL', 'class': 'delay', 'classString': 'btn btn-material-grey btn-fab btn-raised'},
        {'name': 'RV', 'class': 'reverb', 'classString': 'btn btn-info btn-fab btn-raised'},
        {'name': 'CA', 'class': 'cabinet', 'classString': 'btn btn-material-purple btn-fab btn-raised'},
        {'name': 'VL', 'class': 'volume', 'classString': 'btn btn-material-lightyellow btn-fab btn-raised'}
      ]
    };
  },

  showPedal: function(className) {
    if(availablePedals[className]) {
      className = availablePedals[className];
    }

    var list = board.getPedals();
    var found = false;

    _.each(list, function(item) {
      if(_.isEqual(item, className)) {
        found = true;
      }
    });

    if(found) {
      board.removeChild(className, true);
      board.exitDocument();
    } else {
      board.addChild(className, true);
    }
  },

  render: function() {
    var that = this;
    return(
      <ul className="pedal-menu">
        {this.state.pedals.map(function(pedal) {
          return <li className="pedal-list" key={pedal.class}>
            <a href="javascript:void(0)" onClick={that.showPedal.bind(that, pedal.class)} 
              className={pedal.classString} data-name={pedal.class}>{pedal.name}
            <div className="ripple-wrapper"></div>
            </a>
          </li>
        })}
      </ul>
    );
  }
});

React.render(<PedalList />, document.getElementById('pedalList'));

/**
 * Control Panel
 */

var ControlPanel = React.createClass({
  render: function() {
    return (
      <div>
        <ControlButton />
        <SongList />
      </div>
    );
  }
});

/**
 * Control Button
 */

var ControlButton = React.createClass({
  getInitialState: function() {
    return { icon: 'mdi-av-play-arrow', state: false }
  },

  buttonHandler: function() {
    this.state.state = !this.state.state;
    if(this.state.state) {
      this.setState({icon: 'mdi-av-stop'})
      stage.play();
    } else {
      this.setState({icon: 'mdi-av-play-arrow'})
      stage.stop();
    }
  },

  render: function() {
    return (
      <div id="controlButton"><span onClick={this.buttonHandler} className={this.state.icon}></span></div>
    );
  }
});

/**
 * Song List
 */

var SongList = React.createClass({
  getInitialState: function() {
    return {
      songs: [{'name': 'Sabbath Bloody Sabbath', 'path': 'assets/samples/bloody_sabbath.mp3'}, 
              {'name':'Going To California', 'path': 'assets/samples/going_to_california.mp3'}]
    };
  },

  playSong: function(path) {
    state = true;
    cBDraw();
    stage.play(path);
  },

  render: function() {
    var that = this;
    return(
      <div className='samples'>
        {this.state.songs.map(function(song) {
          return <div className='sample' key={song.name} onClick={that.playSong.bind(that, song.path)}>{song.name}</div>
        })}
      </div>
    );
  }
});

React.render(<ControlPanel />, document.getElementById('controlPanel'));


/************* LINE IN && OLD CODE *****************/

/**
 * Sample Controls
 */

// var state = false;
// var controlBtn = document.getElementById('controlButton');
// var line = document.getElementsByClassName('linein')[0];
// var settings = [];
// var samples = document.getElementsByClassName('sample');
// var sampleNo = 1;

// /**
//  * LineIn Functions *** TODO | TAKING OUT FOR DEMO ***
//  */

// var playLineIn = function() {
//   stage.stop();
//   stage.input = new pb.io.StreamInput(stage.getContext());
//   stage.input.addEventListener('loaded', function() {
//       stage.route();
//   });
// };

// line.addEventListener('click', function() {
//   state = true;
//   sampleNo = 6;
//   cBDraw();
//   //settings[sampleNo - 1]();
//   playLineIn();
// }, false);

// var play = function() {
//   if (sampleNo == 6) {
//       playLineIn();
//       return;
//   }
//   // settings[sampleNo - 1] && settings[sampleNo - 1]();
//   stage.play();
// };

// settings.push(function() {
//   !overdrive.bypassSwitch.getState() && overdrive.bypassSwitch.toggle();
//   overdrive.setLevel(1);
//   overdrive.setDrive(0.1);
//   overdrive.setTone(1);
//   reverb.setLevel(1);
//   !delay.bypassSwitch.getState() && delay.bypassSwitch.toggle();
//   delay.setDelayTimer(0.6);
//   delay.setFeedbackGain(0.5);
//   delay.setLevel(0.7);
// });