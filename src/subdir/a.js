Animal = (function() {
  function Animal(name) {
    this.name = name;
  }

  Animal.prototype.move = function(meters) {
    return alert(this.name + (" moved " + meters + "m."));
  };

  return Animal;

})();
Snake = (function(_super) {
  __extends(Snake, _super);

  function Snake() {
    _ref = Snake.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Snake.prototype.move = function() {
    alert("Slithering...");
    return Snake.__super__.move.call(this, 5);
  };

  return Snake;

})(Animal);
Horse = (function(_super) {
  __extends(Horse, _super);

  function Horse() {
    _ref1 = Horse.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Horse.prototype.move = function() {
    alert("Galloping...");
    return Horse.__super__.move.call(this, 45);
  };

  return Horse;

})(Animal);
sam = new Snake("Sammy the Python");
tom = new Horse("Tommy the Palomino");
sam.move();
tom.move();