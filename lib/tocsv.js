
/**
 * Module dependencies.
 */
var os = require('os');

/**
 *  function that check object is undefined, null, {}, '' 
 *  @param {Object} params 
 *  result boolean
 */
var isEmpty = function(obj) {
  if (typeof obj === 'number') { return false; } 
  for( var i in obj ) { return false; }
  return true;
}

/**
 * Main function that converts json to csv
 *
 * @param {Object} params Function parameters containing data, fields, empty, EOL and delimiter 
 * @param {Function} callback Callback function returning csv output
 */
module.exports = function(params, callback) {
  var context = {};
  context.data = JSON.parse( JSON.stringify(params.data) );
  context.delimiter = params.delimiter || ',';
  context.empty = params.empty || '';
  context.EOL = params.EOL || os.EOL;
  context.sample = params.sample || 0; 
  context.fields = toString.call(params.fields) === '[object Array]'? params.fields : function() {
    var cache = {}, h = {};
    var d = toString.call(context.data) === '[object Array]'? context.data: [];
    var l = context.sample || d.length;

    l = l > d.length? d.length: l;
    for ( var i = 0; i < l; i++ ) {
      var e = d[i];
      var s = Object.keys(e).join('');
      if ( cache.hasOwnProperty( s ) ) { continue; }
      cache[s] = null;
      for ( var a in e ) { h[a] = null; }
    } 
    return Object.keys(h);
//    for ( var k in h ) { result[result.length] = { 'name': k, 'label': k }; }
///    return result;
  }();

  
  createColumnTitles(context, function(err, title) {
    if (err) return callback(err);
    createColumnContent(context, title, function(csv) {
      callback(null, csv);
    });
  });
};

/**
 * Create the title row with all the provided fields as column headings
 *
 * @param {Object} params Function parameters containing data, fields and delimiter
 * @param {Function} callback Callback function returning error and title row as a string
 */
var createColumnTitles = function(context, callback) {
  context.fields = context.fields.map(function(field, index){
    return isEmpty(field.name)? ( typeof field === 'string'? { 'name' : field } : {} ) : field;
  });
/*  context.fields = function(fields) {
    var result = [];
    fields.forEach( function(f){
      result[result.length] = isEmpty(f.name)? ( typeof f === 'string'? { 'name' : f } : {} ) : f;
    });
    return result;
  }(context.fields);
*/
  callback(null, context.fields.map( function(field, index) {
    var label = isEmpty(field.label)? ( isEmpty(field.name)? '@'+index : field.name ) : field.label;
    return JSON.stringify( label );
  }).join(context.delimiter));
};

/**
 * Create the content column by column and row by row below the title
 *
 * @param {Object} params Function parameters containing data, fields and delimiter
 * @param {String} str Title row as a string
 * @param {Function} callback Callback function returning title row and all content rows
 */
var createColumnContent = function(context, str, callback) {
  var delim = context.delimiter;
  var nbsp = context.empty; 
  var eol = context.EOL;

  context.data.forEach(function(d) {
    var line = '';
    context.fields.forEach(function(f) {
      if (line !== '') {
        line += delim;
      }
//       console.log('**'+ f.name + ' : '+ d[f.name] );
      var e = isEmpty(f.name)? '' : d[f.name];
      line += JSON.stringify(isEmpty(e)? nbsp : e);
    });
    line = line.replace(/\\"/g, '""');
    str += eol + line;
  });
  callback(str);
};
