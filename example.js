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