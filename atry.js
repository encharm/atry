var domain = require("domain");
var atry = module.exports = function(toRun) {

  var dom = domain.create();
  var argsWithoutFirst = Array.prototype.slice.call(arguments, 1);
  return {
    run: function(errHandle) {
      dom.run(function() {
        try {
          toRun.apply(null, argsWithoutFirst);
        } catch (err) {
          dom.exit();
          errHandle(err);
        }
      });
    },
    catch: function(errHandle) {
      dom.on("error", function(err) {
        dom.exit();
        return errHandle(err);
      })
      this.run(errHandle);
      return this;
    },
    ignoreCatch: function() {
      dom.on("error", function() {});
      this.run(function() {});
    }
  };
};

module.exports.bind = function(bindFunction) {
  return {
    catch: function(catchFunction) {

      return function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift(bindFunction);
        atry.apply(atry, args).catch (catchFunction);
      }
    }
  };
}

module.exports.intercept = function(bindFunction) {
  return {
    catch: function(catchFunction) {
      return function(err) {
        if(err) 
          return catchFunction(err);

        var args = Array.prototype.slice.call(arguments, 1);

        args.unshift(bindFunction);
        atry.apply(atry, args).catch (catchFunction);
      };
    }
  };
}