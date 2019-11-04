
var maple = {
  baz: 3,
};
var foo = {
  baz: 4,
  bar: function() {
    console.log(this);
    for (var i = 0; i < maple.baz; i++) {
      setImmediate(function() {
        console.log(i);
      });
    }
    for (let i = 0; i < this.baz; i++) {
      setTimeout(function() {
        console.log(i);
      })
    }
  }
};
foo.bar.bind(foo).call(maple)