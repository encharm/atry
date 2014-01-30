## atry - async try

Asynchronous try-catch based on Node.JS domain module.

* `atry(runningFunction, [arg1, [arg2, ...]])`
 * `.catch(errorHandler)` - Catches both synchronous and asynchronous exceptions

 ```
  atry(function() {
    setTimeout(function() {
      throw new Error("Got error");
    }, 10);
  }).catch(function(err) {
    console.log("Got error", err);
  });
 ```

 * `.ignoreCatch(errorHandler)` - Ignores both synchronous and asynchronous exceptions

 ```
  atry(function() {
    setTimeout(function() {
      throw new Error("Got error");
    }, 10);
  }).ignoreCatch(); // ignore exceptions
 ```

* `atry.bind(bindFunction).catch(catchFunction)` - Returns function that will be exception safe
 ```
    fs.readFile('someFile', atry.intercept(function(err, data) {
      if(err) throw err; // this will be caught below
      console.log("Got data");
    }).catch(function(err) {
      console.log("got error during file reading", err);
    }));
  ```

* `atry.intercept(bindFunction).catch(catchFunction)` - Returns function that will be exception safe and its first argument will be handled as if it is `err`. 
 ```
    fs.readFile('someFile', atry.intercept(function(data) {
      console.log("Got data");
    }).catch(function(err) {
      console.log("got error during file reading", err);
    }));
 ```
