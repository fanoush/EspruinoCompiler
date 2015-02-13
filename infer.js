var utils = require("./utils.js");
var acorn_walk = require("acorn/util/walk");

function infer(node) {
  var modified = false;
  function setType(node, type) {
    if (node.varType!==type) {
      node.varType = type;
      modified = true;
    }
  }
  function getType(node) {
    return node.varType;
  }
  
  acorn_walk.simple(node, {
    "Literal" : function(node) {
      if (utils.isInt(node.value)) setType(node, "int"); 
      else if (utils.isBool(node.value)) setType(node, "bool");
      else setType(node, "JsVar");
    },
    "BinaryExpression" : function(node) {
      var boolExprs = ["==","===","!=","!==","<","<=",">",">="];
      var intExprs = ["&","|","^"];
      var floatExprs = ["/"];
      if (boolExprs.indexOf(node.operator)>=0) setType(node, "bool");
      else if (intExprs.indexOf(node.operator)>=0) setType(node, "int");
      else if (floatExprs.indexOf(node.operator)>=0) setType(node, "JsVar");
      else { // normal operator - do type promotion
        setType(node, utils.maxType(getType(node.left), getType(node.right)));
      }
    },
    "VariableDeclaration" : function (n) {
    }
  });
}
    
exports.infer = function(node) {
  // while modified, keep going
  while (infer(node));
  // now output
  console.log(JSON.stringify(node,null,2));
}