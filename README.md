# Convert json to csv

Converts json into csv. 
Origonal: https://github.com/zeMirco/json2csv

## How to use

Install

```bash
$ npm install tocsv
```

Include the module and run

```javascript
var tocsv = require('tocsv');
    
toocsv({data: someJSONData, fields: ['field1', 'field2', 'field3']}, function(err, csv) {
  if (err) console.log(err);
  console.log(csv);
});
```

## Features

- Uses proper line endings on various operating systems
- Handles double quotes
- Allows custom column selection
- Reads column selection from file
- Pretty writing to stdout
- Supports optional custom delimiters
    
## Use as a module

### Example 1

```javascript
var tocsv = require('tocsv');

var json = [
  {
    "car": "Audi",
    "price": 40000,
    "color": "blue"
  }, {
    "car": "BMW",
    "price": 35000,
    "color": "black"
  }, {
    "car": "Porsche",
    "price": 60000,
    "color": "green"
  }
];

json2csv({data: json, fields: ['car', 'price', 'color']}, function(err, csv) {
  if (err) console.log(err);
  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
});
```
 
The content of the "file.csv" should be

```
car, price, color
"Audi", 40000, "blue"
"BMW", 35000, "black"
"Porsche", 60000, "green"
```

### Example 2
    
Similarly to [mongoexport](http://www.mongodb.org/display/DOCS/mongoexport) you can choose which fields to export

```javascript
tocsv({data: json, fields: ['car', 'color']}, function(err, csv) {
  if (err) console.log(err);
  console.log(csv);
});
```

Results in

```
car, color
"Audi", "blue"
"BMW", "black"
"Porsche", "green"
```

### Example 3

Use a custom delimiter to create tsv files. Add it as the value of the del property on the parameters:

```javascript
tocsv({data: json, fields: ['car', 'price', 'color'], delimiter: '\t'}, function(err, tsv) {
  if (err) console.log(err);
  console.log(tsv);
});
```
 
Will output:

```
car price color
"Audi"  10000 "blue"
"BMW" 15000 "red"
"Mercedes"  20000 "yellow"
"Porsche" 30000 "green"
```

If no delimiter is specified, the default `,` is used

### Example 4
    
You can choose custom column names for the exported file.

```javascript
json2csv({data: json, fields: [ { name:'car', label:'Car Name'}, { name:'price','Price USD' } ] }, function(err, csv) {
  if (err) console.log(err);
  console.log(csv);
});
```

Results in

```
"Car Name", "Price USD"
"Audi", "blue"
"BMW", "black"
"Porsche", "green"
```

    
## License
Copyright (C) 2013 [Robin Cloud](mailto: dio.paper@gmail.com)
Copyright (C) 2012 [Mirco Zeiss](mailto: mirco.zeiss@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
