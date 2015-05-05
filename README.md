# Widger
A simple widgeting UI engine.
Widgets are constructed by first building the frame and then applying a resource to that frame. Later widgets may be attached to a dashboard object that handles interactions between widgets.

## Usage
To instanciate a widget, pass in a config object.

    var widget = new Widget(configObject);
The config object has must have the following properties set:
### destination

> Type: HTML Dom Element

A destination DOM element. The widget will rendered inside this element
### HTMLBody
> Type: String

Widget's body consisting of pure HTML
### wrapper
> Type: Object

A wrapper has two elements: wrapper html element e.g. `<div>` and possible classes attached to it.The widget's content will be injected to this element

#### wrapper.classNames
> Type: String

A string containing class name(s) that will be applied to the wrapping DOM element.

#### wrapper.wrapperElementString

> Type: String

A string spesifying what DOM element to create. In most cases it would be a simple "div".

### resources
> Type: Resource

These resources will be applied after the HTML the widget has been created. Javascript resources should have a class (function). This classes constructor should take two arguments:  

 - the DOM element on which the widget's resources will be applied to
 -  the widget reference. These will be applied in ordre in the array.

Basically this is an array of constructors.

### subscriptionDataTransfer
>Type: Function

This is a transform function that modifies the data provided by subscription. Use case: another widget emits data, that needs to be modified before it can be
passed to this widget. This function spesifies how the data is modified.

## Example of using a widget with other libraries such as jQuery
```javascript
var Widget = require('./Widget.js');
var Dashboard = require('./Dashboard.js');
var Resource = require('./Resource.js');

//A resource class that extends the base resource. This class should always provide a modify method.
class ExampleResource extends Resource {
	constructor(elem, widget){
		super(elem, widget);
	}

	modify(){
		//Note that to use jQuery, it must be defined before this.
		return $(this.elem).append('Hey this is widgets content');
	}
}

var exampleWidget = new Widget({
		HTMLBody: '<div><h1>Widget title</h1></div>',
		destination: document.body,
		wrapper: {
			classNames: 'main-container',
			wrapperElementString: 'div'
		},
		resources: [ExampleResource],
		subscriptionDataTransform: function(data){
			return data;
		}
});

window.dashboard = new Dashboard();
dashboard.addWidget(exampleWidget);
```
Results in: 

```
<div class=" main-container"><div><h1>Widget title</h1></div>Hey this is widgets content</div>
```
