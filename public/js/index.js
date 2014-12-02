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
      <ul>
        {this.state.pedals.map(function(pedal) {
          return <li className="pedal-menu" key={pedal.class}>
            <a href="javascript:void(0)" onClick={that.showPedal.bind(that, pedal.class)} 
              className={pedal.classString} data-name={pedal.class}>{pedal.name}
            <div className="ripple-wrapper"></div>
            </a>
            </li>
        })
      }
      </ul>
    );
  }
});

React.render(<PedalList />, document.getElementById('pedalList'));


/**
 * Sample Controls
 */
var state = false;
var cb = document.getElementById('controlButton');
var samples = document.getElementsByClassName('sample');
var lb = document.getElementsByClassName('linein')[0];
var sampleNo = 1;
var settings = [];

samples = Array.prototype.slice.call(samples);

var playLineIn = function() {
  stage.stop();
  stage.input = new pb.io.StreamInput(stage.getContext());
  stage.input.addEventListener('loaded', function() {
      stage.route();
  });
};

lb.addEventListener('click', function() {
  state = true;
  sampleNo = 6;
  cBDraw();
  settings[sampleNo - 1]();
  playLineIn();
}, false);

var cBDraw = function() {
  cb.innerHTML = state ? '&#9724;' : '&#9654;';
  samples.forEach(function(sample) {
      sample.className = 'sample';
  });
  samples[sampleNo - 1] && (samples[sampleNo - 1].className = 'sample on');

  sampleNo === 6 ? lb.className = 'linein on' : lb.className = 'linein';
};

var play = function() {
  // Check for line in
  if (sampleNo == 6) {
      playLineIn();
      return;
  }
  settings[sampleNo - 1] && settings[sampleNo - 1]();
  stage.play('assets/samples/bloody_sabbath.mp3');
};

var cBHandler = function() {
    state = !state;
    cBDraw();
    stage.stop();
    if (state) play();
};

cb.addEventListener('click', cBHandler, false);

samples.forEach(function(sample) {
  sample.addEventListener('click', function() {
      sampleNo = Array.prototype.slice.call(sample.parentNode.children).indexOf(sample) + 1;
      state = true;
      cBDraw();
      play();
  });
});

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