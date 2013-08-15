
/**
 * Module dependencies.
 */
var os = require('os');
var _= require('underscore');

/**
 * Main function that converts json to csv
 *
 * @param {Object} params Function parameters containing data, fields and delimiter
 * @param {Function} callback Callback function returning csv output
 */
module.exports = function(params, callback) {
  params.data = JSON.parse(JSON.stringify(params.data));
  params.delim = params.delim || ',';
  params.nbsp = params.nbsp || ' ';
  prams.fields = prams.fields || function() {
    var fields = _.keys(params.data[0]);
    var cache = fields.join('');

    _.each(params.data, function(e) {
      var f = _.keys(e);
      var s = f.join('');
      if ( cache !== s ) {
        fields = _.union(fields, f);        
      }
    });
  
    return _.object(fields, fields);

  }();

  
  createColumnTitles(params, function(err, title) {
    if (err) return callback(err);
    createColumnContent(params, title, function(csv) {
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
var createColumnTitles = function(params, callback) {
  var delim = params.delim;
  var str = '';
  _.map(params.fields, function(value, key) {
    return JSON.stringify( _.isEmpty(value)? key : value );
  }).join(delim);
 
  callback(null, str);
};

/**
 * Create the content column by column and row by row below the title
 *
 * @param {Object} params Function parameters containing data, fields and delimiter
 * @param {String} str Title row as a string
 * @param {Function} callback Callback function returning title row and all content rows
 */
var createColumnContent = function(params, str, callback) {
  var delim = params.delim;
  var nbsp = params.nbsp; 

  params.data.forEach(function(data_element) {
    var line = '';
    params.fields.forEach(function(field_element) {
      if (line !== '') {
        line += delim;
      }
      var e = data_element[field_element];
      line += JSON.stringify(_.isEmpty(e)?nbsp:e);
    });
    line = line.replace(/\\"/g, '""');
    str += os.EOL + line;
  });
  callback(str);
};
