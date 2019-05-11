var MakeTimer = function() {
  var t = {
    start: function(duration, func, callback) {
      this.func = func;
      this.duration = duration;
      this.callback = callback;
      this.timer = setTimeout(function() {
        func();
        if (typeof callback === "function") {
          callback();
        }
      }, duration);
    },
    stop: function() {
      clearTimeout(this.timer);
      return;
    }
  };
  return {
    start: t.start,
    stop: t.stop
  };
};

var playerTimer = new MakeTimer();
var simonTimer = new MakeTimer();

//cacheDOM
var $button = {
  blue: document.getElementById("blue"),
  green: document.getElementById("green"),
  red: document.getElementById("red"),
  yellow: document.getElementById("yellow"),
  center: document.getElementById("bodycenter"),
  power: document.getElementById("power"),
  strict: document.getElementById("strictbutton"),
  start: document.getElementById("startbutton")
};

var $el = {
  digits: document.getElementById("digits"),
  powerled: document.getElementById("powerled")
};

var _game = {
  buttons: ["red", "blue", "green", "yellow"],
  clearsequence: function() {
    this.sequence.forEach((e, i) => (this.sequence[i] = ""));
  },
  duration: 0,
  error: false,
  flashstate: "off",
  level: [600, 400, 200],
  makeSequence: function() {
    this.sequence.forEach(
      (e, i) => (this.sequence[i] = this.buttons[Math.floor(Math.random() * 4)])
    );
  },
  number: [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "00",
    ":(",
    ":)"
  ],
  power: "off",
  progress: 0,
  sequence: [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ],
  start: "off",
  strict: false,
  timerstate: "off",
  turn: 0,
  turnsequence: [],
  user: "off",
  westminster: [
    "red",
    "blue",
    "green",
    "yellow",
    "blue",
    "green",
    "red",
    "blue"
  ]
};

var noise = {
  blue: new Pizzicato.Sound({
    source: "wave",
    options: {
      type: "triangle",
      frequency: 164.81
    }
  }),
  green: new Pizzicato.Sound({
    source: "wave",
    options: {
      type: "triangle",
      frequency: 82.4
    }
  }),
  red: new Pizzicato.Sound({
    source: "wave",
    options: {
      type: "triangle",
      frequency: 110
    }
  }),
  yellow: new Pizzicato.Sound({
    source: "wave",
    options: {
      type: "triangle",
      frequency: 138.59
    }
  }),
  error: new Pizzicato.Sound({
    source: "wave",
    options: {
      type: "sawtooth",
      frequency: 50,
      volume: 0.2
    }
  })
};

// added array in atempt to make touch screen compatible
// touch works but not reliably and sound does not work reliably
// to-do fix the touch screen interface
// to-do fix mobile audio not playing
// bind events
['mousedown','ontouchstart'].forEach(function(e){$button.blue.addEventListener(e,function(){
  if(!$button.power.checked || _game.user === "off"){
    return;
  }
  $button.blue.classList.add('brightness');
  noise.blue.play();
})});

['mouseup','ontouchend'].forEach(function(e){$button.blue.addEventListener(e, function() {
  if (!$button.power.checked || _game.user === "off") {
    return;
  } else {
    $button.blue.classList.remove('brightness');
    noise.blue.stop();
    playerTimer.stop();
    playerSays('blue');
  }
})});

['mousedown','ontouchstart'].forEach(function(e){$button.green.addEventListener(e,function(){
  if(!$button.power.checked || _game.user === "off"){
    return;
  }
  $button.green.classList.add('brightness');
  noise.green.play();
})});

['mouseup','ontouchend'].forEach(function(e){$button.green.addEventListener(e, function() {
  if (!$button.power.checked || _game.user === "off") {
    return;
  } else {
    $button.green.classList.remove('brightness');
    noise.green.stop();
    playerTimer.stop();
    playerSays('green');
  }
})});

['mousedown','ontouchstart'].forEach(function(e){$button.red.addEventListener(e,function(){
  if(!$button.power.checked || _game.user === "off"){
    return;
  }
  $button.red.classList.add('brightness');
  noise.red.play();
})});

['mouseup','ontouchend'].forEach(function(e){$button.red.addEventListener(e, function() {
  if (!$button.power.checked || _game.user === "off") {
    return;
  } else {
    $button.red.classList.remove('brightness');
    noise.red.stop();
    playerTimer.stop();
    playerSays('red');
  }
})});

['mousedown','ontouchstart'].forEach(function(e){$button.yellow.addEventListener(e,function(){
  if(!$button.power.checked || _game.user === "off"){
    return;
  }
  $button.yellow.classList.toggle('brightness');
  noise.yellow.play();
})});

['mouseup','ontouchend'].forEach(function(e){$button.yellow.addEventListener(e, function() {
  if (!$button.power.checked || _game.user === "off") {
    return;
  } else {
    $button.yellow.classList.toggle('brightness');
    noise.yellow.stop();
    playerTimer.stop();
    playerSays('yellow');
  }
})});


$button.power.addEventListener("change", function() {
  $el.digits.value = !$button.power.checked ? "" : _game.number[20];
  _game.power = _game.power === "off" ? "on" : "off";
  _game.start = "on";
  if (_game.power === "off") {
    simonTimer.stop();
    playerTimer.stop();
    _game.flashes = 0;
    _game.progress = 0;
    _game.turn = 0;
    _game.strict = false;
    $el.powerled.style.opacity = "0.6";
    _game.buttons.forEach(button =>
      $button[button].classList.remove("brightness")
    );
    _game.buttons.forEach(sound => noise[sound].stop());
    noise.error.stop();
    _game.start = "off";
    _game.flashstate = "off";
  }
});

$button.start.addEventListener("mouseup", function() {
  if (_game.power === "on") {
    _game.start = "on";
    _game.flashstate = "off";
    _game.flashes = 0;
    _game.progress = 0;
    _game.turn = 0;
    _game.clearsequence();
    _game.makeSequence();
    $el.digits.value = _game.number[20];
    simonSays();
  }
});

$button.start.addEventListener("mousedown", function() {
  if (_game.power === "on") {
    _game.start = "on";
    simonTimer.stop();
    playerTimer.stop();
    _game.buttons.forEach(button =>
      $button[button].classList.remove("brightness")
    );
    _game.buttons.forEach(sound => noise[sound].stop());
    noise.error.stop();
    $el.digits.value = _game.number[20];
    _game.flashstate = "off";
  }
});

$button.strict.addEventListener("click", function() {
  if (_game.power === "on") {
    _game.strict = !_game.strict ? true : false;
    $el.powerled.style.opacity = !_game.strict ? "0.6" : "1";
  }
});

$button.center.addEventListener("click", function() {
  return;
});

function getTurnSequence(turn) {
  var arr = [];
  ++turn;
  for (var i = 0; i < turn; ++i) {
    arr.push(_game.sequence[i]);
  }
  return arr;
}

function simonSays() {
  let level = 0;
  if(_game.power === "off"){
    simonTimer.stop();
    playerTimer.stop();
    return;
  }

  if (_game.strict && _game.error) {
    _game.error = false;
    _game.turn = 0;
    _game.progress = 0;
    _game.clearsequence();
    _game.makeSequence();
  }

  if(_game.turn >= 4 && _game.turn <= 11)  {
    level = 1;
  }

  if(_game.turn > 11){
    level = 2;
  }

  if(_game.turn > 20){
    $el.digits.value = _game.number[22]; // ':)'
    _game.user = 'off';
    return;
  }

  _game.turnsequence = getTurnSequence(_game.turn);
  $el.digits.value = _game.number[_game.turn];
  _game.duration = _game.level[level];
  console.log(_game.sequence)
  _game.user = 'off';
  simonTimer.start(1500, playSequence);
}

function playSequence(){
  var simonsays = _game.turnsequence.shift();
  playerTimer.stop();
  var flash = {
    ON: function(){
      if(simonsays === undefined){
        _game.user = 'on';
        _game.progress = 0;
        playerTimeError();
        return;
      }
      $button[simonsays].classList.toggle('brightness');
      noise[simonsays].play();
      simonTimer.start(_game.duration,function(){
        $button[simonsays].classList.toggle('brightness');
        noise[simonsays].stop();
      },flash.OFF);
    },
    OFF: function(){
      simonTimer.start(_game.duration,function(){
        simonsays= _game.turnsequence.shift();
      },flash.ON);
    }
  }

  flash.ON();
}

function playerSays(buttonPressed) {
  if (_game.user !== "on") {
    return;
  }

  if (_game.progress === 0){
    _game.turnsequence = getTurnSequence(_game.turn);
  }

  let turnButton = _game.turnsequence.shift();

  if (buttonPressed !== turnButton) {
    playerError();
    return;
  } else {
    ++_game.progress;
  }

  if (_game.turnsequence.length === 0){
    ++_game.turn;
    _game.progress = 0;
    simonSays();
  }
}

function playerError() {
  playerTimer.stop();
  _game.user = 'off';
  if(_game.power === 'off'){
    return;
  }
  simonTimer.start(700,razz);
}

function playerTimeError() {
  _game.user = "on";
  playerTimer.start(5000, function(){
    if (_game.power === "off") {
     return;
    }
  },playerError);
}

function razz() {
  _game.error = true;
  $button[_game.sequence[_game.progress]].classList.toggle("brightness");
  noise.error.play();
  $el.digits.value = _game.number[21];  // ':('
  simonTimer.start(1500, function() {
    if(_game.power === 'off'){
      return;
    }
    noise.error.stop();
    $button[_game.sequence[_game.progress]].classList.toggle("brightness");
    $el.digits.valuse = _game.number[_game.turn];
    _game.progress = 0;
  },simonSays);
}
