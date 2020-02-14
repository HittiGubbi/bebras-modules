var quickAlgoContext = function(display, infos) {
//  console.log('quickAlgoContext infos', infos)
  var context = {
    display: display,
    infos: infos,
    nbRobots: 1
    };

  // Set the localLanguageStrings for this context
  context.setLocalLanguageStrings = function(localLanguageStrings) {
    context.localLanguageStrings = localLanguageStrings;
    window.stringsLanguage = window.stringsLanguage || "fr";
    window.languageStrings = window.languageStrings || {};

    if (typeof window.languageStrings != "object") {
      console.error("window.languageStrings is not an object");
    } else { // merge translations
      $.extend(true, window.languageStrings, localLanguageStrings[window.stringsLanguage]);
    }
    context.strings = window.languageStrings;
    return context.strings;
  };

  // Import more language strings
  context.importLanguageStrings = function(source, dest) {
    if ((typeof source != "object") || (typeof dest != "object")) {
      return;
    }
    for (var key1 in source) {
      if (dest[key1] != undefined) {
        if (typeof dest[key1] == "object") {
          replaceStringsRec(source[key1], dest[key1]);
        } else {
          dest[key1] = source[key1];
        }
      }
    }
  };

  // Default implementations
  context.changeDelay = function(newDelay) {
    // Change the action delay while displaying
    infos.actionDelay = newDelay;
  };

  context.waitDelay = function(callback, value) {
    // Call the callback with value after actionDelay
    if(context.runner) {
      context.runner.waitDelay(callback, value, infos.actionDelay);
    } else {
      // When a function is used outside of an execution
      setTimeout(function () { callback(value); }, infos.actionDelay);
    }
  };

  context.callCallback = function(callback, value) {
    // Call the callback with value directly
    if(context.runner) {
      context.runner.noDelay(callback, value);
    } else {
      // When a function is used outside of an execution
      callback(value);
    }
  };

  context.debug_alert = function(message, callback) {
    // Display debug information
    message = message ? message.toString() : '';
    if (context.display) {
      alert(message);
    }
    context.callCallback(callback);
  };

  // Placeholders, should be actually defined by the library
  context.reset = function() {
    // Reset the context
    if(display) {
      context.resetDisplay();
    }
  };

  context.resetDisplay = function() {
    // Reset the context display
  };

  context.updateScale = function() {
    // Update the display scale when the window is resized for instance
  };

  context.unload = function() {
    // Unload the context, cleaning up
  };

  context.provideBlocklyColours = function() {
    // Provide colours for Blockly
    return {};
  };

  context.program_end = function(callback) {
    if(context.display && 'namespaceViews' in window.quickAlgoInterface) {
      window.quickAlgoInterface.namespaceViews.showLast();
    }
    var curRobot = context.curRobot;
    if (!context.programEnded[curRobot]) {
      context.programEnded[curRobot] = true;
      if('mergedCheckEndCondition' in context) {
        context.mergedCheckEndCondition();
      } else {
        infos.checkEndCondition(context, true);
      }
    }
    context.waitDelay(callback);
  };

  // Properties we expect the context to have
  context.localLanguageStrings = {};
  context.customBlocks = {};
  context.customConstants = {};
  context.conceptList = [];

  return context;
};


// Global variable allowing access to each getContext
var quickAlgoLibraries = {
  libs: {},
  order: [],
  contexts: {},
  mergedMode: false,

  get: function(name) {
    return this.libs[name];
  },

  getContext: function() {
    //console.log('getContext mergedMode', this.mergedMode)

    function extendArguments(args, namespace) {
      var res = Array.prototype.slice.call(args);
      if('namespaceViews' in window.quickAlgoInterface) {
        res.push(quickAlgoInterface.namespaceViews.add(namespace))
      }
      return res;
    }

    // Get last context registered
    if(this.order.length) {
      if(this.mergedMode) {
        var gc = this.getMergedContext();
        return gc.apply(gc, arguments);
      } else {
        var ns = this.order[this.order.length-1];
        var gc = this.libs[ns];
        return gc.apply(
          gc,
          extendArguments(arguments, ns)
        );
      }
    } else {
      if('getContext' in window) {
        return getContext.apply(
          getContext,
          extendArguments(arguments, 'default')
        );
      } else {
        throw "No context registered!";
      }
    }
  },

  setMergedMode: function(options) {
    // Set to retrieve a context merged from all contexts registered
    // options can be true or an object with the following properties:
    // -displayed: name of module to display first
    this.mergedMode = options;
  },


  getMergedContextInfos: function(namespace, infos) {
    if('mergedModeInfos' in infos && namespace in infos.mergedModeInfos) {
      var res = Object.assign({}, infos, infos.mergedModeInfos[namespace]);
      delete res.mergedModeInfos;
      return res;
    }
    return infos;
  },


  getMergedContext: function() {
    // Make a context merged from multiple contexts
    if(this.mergedMode.displayed && this.order.indexOf(this.mergedMode.displayed) > -1) {
      this.order.splice(this.order.indexOf(this.mergedMode.displayed), 1);
      this.order.unshift(this.mergedMode.displayed);
    }
    var that = this;

    return function(display, infos, curLevel, gridElement) {
      // Merged context
      var context = quickAlgoContext(display, infos);
      var localLanguageStrings = {};
      context.customBlocks = {};
      context.customConstants = {};
      context.conceptList = [];

      var subContexts = [];
      for(var scIdx=0; scIdx < that.order.length; scIdx++) {
        // Only the first context gets display = true
        var namespace = that.order[scIdx];
        var newContext = that.libs[namespace](
          display && (scIdx == 0),
          that.getMergedContextInfos(namespace, infos),
          curLevel,
          quickAlgoInterface.namespaceViews.add(namespace)
        );
        subContexts.push(newContext);



        // Merge objects
        mergeIntoObject(localLanguageStrings, newContext.localLanguageStrings);
        mergeIntoObject(context.customBlocks, newContext.customBlocks);
        mergeIntoObject(context.customConstants, newContext.customConstants);
        mergeIntoArray(context.conceptList, newContext.conceptList);

        // Merge namespaces
        for(var namespace in newContext.customBlocks) {
          if(!context[namespace]) { context[namespace] = {}; }
          for(var category in newContext.customBlocks[namespace]) {
            var blockList = newContext.customBlocks[namespace][category];
            for(var i=0; i < blockList.length; i++) {
              var name = blockList[i].name;
              if(name && !context[namespace][name] && newContext[namespace] && newContext[namespace][name]) {
                //alert([namespace,name])
                if(!(namespace in context)) {
                  context[namespace] = {};
                }
                context[namespace][name] = function(nc, func, namespace) {
                  return function() {
                    //that.setVisibleNamespace(namespace);
                    if('namespaceViews' in window.quickAlgoInterface) {
                      window.quickAlgoInterface.namespaceViews.setLast(namespace);
                    }
                    context.propagate(nc);
                    func.apply(nc, arguments);
                  };
                }(newContext, newContext[namespace][name], namespace);
              }
            }
          }
        }
      }

      var strings = context.setLocalLanguageStrings(localLanguageStrings);

      // Propagate properties to the subcontexts
      context.propagate = function(subContext) {
        var properties = ['raphaelFactory', 'delayFactory', 'blocklyHelper', 'display', 'runner'];
        for(var i=0; i < properties.length; i++) {
          subContext[properties[i]] = context[properties[i]];
        }
      }

      // Merge functions
      context.reset = function(taskInfos) {
        for(var i=0; i < subContexts.length; i++) {
          context.propagate(subContexts[i]);
          subContexts[i].reset(taskInfos ? taskInfos[that.order[i]] : taskInfos);
        }
      };
      context.resetDisplay = function() {
        for(var i=0; i < subContexts.length; i++) {
          context.propagate(subContexts[i]);
          subContexts[i].resetDisplay();
        }
      };
      context.updateScale = function() {
        for(var i=0; i < subContexts.length; i++) {
          context.propagate(subContexts[i]);
          subContexts[i].updateScale();
        }
      };
      context.unload = function() {
        for(var i=subContexts.length-1; i >= 0; i--) {
          // Do the unload in reverse order
          context.propagate(subContexts[i]);
          subContexts[i].unload();
        }
      };
      context.provideBlocklyColours = function() {
        var colours = {};
        for(var i=0; i < subContexts.length; i++) {
          mergeIntoObject(colours, subContexts[i].provideBlocklyColours());
        }
        return colours;
      };

      context.mergedCheckEndCondition = function() {
        var messages = [];
        var errors = [];


        for(var i=0; i < subContexts.length; i++) {
          if('checkEndCondition' in subContexts[i].infos) {
            try {
              subContexts[i].infos.checkEndCondition(subContexts[i], true);
            } catch(e) {
              var msg = typeof e == 'string' ? e : e.message;
              if(subContexts[i].success) {
                messages.push(msg);
              } else {
                errors.push(msg);
              }
            }
          } else {
            console.error('checkEndCondition missed in ' + that.order[i] + ' subcontext infos');
          }
        }
        //console.log('errors', errors)
        //console.log('messages', messages)
        if(errors.length) {
          context.success = false;
          throw errors.join(' ');
        } else {
          context.success = true;
          throw messages.join(' ');
        }
      }

      // Fetch some other data / functions some contexts have
      for(var i=0; i < subContexts.length; i++) {
        for(var prop in subContexts[i]) {
          if(typeof context[prop] != 'undefined') { continue; }
          if(typeof subContexts[i][prop] == 'function') {
            context[prop] = function(sc, func) {
              return function() {
                context.propagate(sc);
                func.apply(sc, arguments);
              }
            }(subContexts[i], subContexts[i][prop]);
          } else {
            context[prop] = subContexts[i][prop];
          }
        }
      };

      return context;
    };
  },

  register: function(name, func) {
    if(this.order.indexOf(name) > -1) { return; }
    this.libs[name] = func;
    this.order.push(name);
  }
};

// Initialize with contexts loaded before
if(window.quickAlgoLibrariesList) {
  for(var i=0; i<quickAlgoLibrariesList.length; i++) {
    quickAlgoLibraries.register(quickAlgoLibrariesList[i][0], quickAlgoLibrariesList[i][1]);
  }
}
