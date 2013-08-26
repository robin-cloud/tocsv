
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
};

var isArray = function(obj) {
  return Array.isArray ? Array.isArray(obj) : toString.call(obj) == '[object Array]';
};

/**
 * Main function that converts json to csv
 *
 * @param {Object} params Function parameters containing data, fields, empty, EOL and delimiter 
 * @param {Function} callback Callback function returning csv output
 */
module.exports = function(params, callback) {
  var context = {};
  context.data = JSON.parse( JSON.stringify(params.data) );
  context.ignorecase = params.options.ignorecase || false;
  context.delimiter = params.options.delimiter || ',';
  context.empty = params.options.empty || '';
  context.EOL = params.options.EOL || os.EOL;
  context.sample = params.options.sample || 0; 
  context.fields = toString.call(params.options.fields) === '[object Array]'? params.options.fields : function() {
    var cache = {}, h = {};
    var d = toString.call(context.data) === '[object Array]'? context.data: [];
    var l = context.sample || d.length;
    var ig = context.ignorecase;

    l = l > d.length? d.length: l;
    for ( var i = 0; i < l; i++ ) {
      var e = d[i];
      var s = ig? Object.keys(e).join('').toUpperCase() : Object.keys(e).join('');
      if ( cache.hasOwnProperty( s ) ) { continue; }
      cache[s] = null;
      for ( var a in e ) { h[ ig? a.toUpperCase() : a ] = null; }
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
  var ig = context.ignorecase;
  context.fields = context.fields.map(function(field, index){
    
    var f = isEmpty(field.name)? ( typeof field === 'string'? { 'name' : field } : {} ) : field;
    
    if ( !isEmpty(f.name) ) {
      if ( typeof f.name === 'string' && f.name.indexOf('|') >= 0 ) {
        f.name = f.name.split('|');
        //console.log('@@'+ JSON.stringify(f.name));
        for (var i =0 , l=f.name.length; i<l; i++) {
          f.name[i] = f.name[i].trim();
        }
      } else {
        f.name = [f.name];
      } 
    }
    return f;
    //return isEmpty(field.name)? ( typeof field === 'string'? { 'name' : field } : {} ) : field;
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
    var label = isEmpty(field.label)? ( isEmpty(field.name)? '@'+index : field.name.toString() ) : field.label;
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
  var ig = context.ignorecase;
//console.log('**'+ JSON.stringify(ig) );
  context.data.forEach(function(d) {
    var line = '';
    context.fields.forEach(function(f) {
      if (line !== '') {
        line += delim;
      }
      for (var i = 0 , l = f.name.length; i < l; i++) {
//        console.log('@@'+f.name[i]); 
        var n = !isEmpty(f.name[i]) && ig? f.name[i].toUpperCase() : f.name[i] || '';  
        var e = isEmpty(n)? '' : d[n];
        if ( !isEmpty(e) ) { break; } 
        if ( ig && isEmpty(e) ) {
          var s = Object.keys(d).join(',');
          var id = s.toUpperCase().indexOf(n.toUpperCase());
          if ( id > 0 ) {
            var k = s.substr(id, n.length); 
            e = d[k];
            if ( !isEmpty(e) ) { break; }
          }
        }
      }
      line += JSON.stringify(isEmpty(e)? nbsp : e);
    });
    line = line.replace(/\\"/g, '""');
    str += eol + line;
  });
  callback(str);
};
