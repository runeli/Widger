class Widget {
	constructor(opts){

		//A destination DOM element. The widget will rendered inside this element
		this.destination = opts.destination;

		//Widget's body consisting of pure HTML
		this.HTMLBody = opts.HTMLBody;

		//Wrapper element string, e.g. 'div'
		this.wrapperElementString = opts.wrapper.wrapperElementString;

		//Class names that will be set to the wrapper element
		this.classNames = opts.wrapper.classNames;

		//An array of constructors that will be executed after the element has been rendered
		//each constructor will receive the widgets wrapper element as an argument
		this.resources = opts.resources;

		//This is a transform function that modifies the data provided by subscription.
		//Use case: another widget emits data, that needs to be modified before it can be
		//passed to this widget. This function spesifies how the data is modified.
		this.subscriptionDataTransform = opts.subscriptionDataTransform;

/*
These are not yet implemented
		//Executed before node is rendered.
		//Args: string nodeString, string classesString
		//this.beforeNodeCreation = opts.lifeCycle.beforeNodeCreation;

		//Executed before node is rendered to the DOM.
		//Args: element
		//this.beforeRender = opts.lifeCycle.beforeRender;

		//Executed after the node is rendered to the DOM
		//Args: element
		//this.afterRender = opts.lifeCycle.afterRender;

		//Executed before each resource is applied to the widget
		//Args: resourceConstructor, DOMElement
		//this.beforeResourceApply = opts.lifeCycle.beforeResourceApply;

		//Executed after each resource is applied to the widget
		//Args: DOMElement
		//this.afterResourceApply = opts.lifeCycle.afterResourceApply;
*/
		//A container for modifier return values / references
		//When modifiers are executed upon the widget, their return values are placed in this container in the order of their execution
		this.modifierReturns = [];

		//A widget can be added to a dashboard.
		//Adding is done through dashboard.addWidget(); method.
		//When this method is execued, this reference is set to the dashboard.
		this.dashboard;

		//Widgets datastore. This is used to store data that is internal to the widget.
		this.dataStore;



		this.createWrapperElement()
		.addClassNames(this.classNames)
		.appendHTML()
		.insertToDOM()
		.handleResources();

	}

	//Execute resources over the widgets element
	//Resources are used to add functionality to the widget
	//See widgetSpec.js for more info
	handleResources(){
		this.resources.forEach(res => {
			var performer = new res(this._wrapperElement, this);
			this.modifierReturns.push(performer.modifierReturn);
			this._wrapperElement = performer.elem;
		}, this);
		return this;
	}


	//Create a wrapper element that wraps the widgets contents
	createWrapperElement(){
		this._wrapperElement = document.createElement(this.wrapperElementString);
		return this;
	}

	//Add defined class names to the widget's container element
	addClassNames(classNames){
		this._wrapperElement.className = this._wrapperElement.className + ' ' + classNames;
		return this;
	}

	//Append the HTML structure to the widget's container
	appendHTML(){
		var r = document.createRange();
		this._wrapperElement.appendChild(r.createContextualFragment(this.HTMLBody));
		return this;
	}

	//Append the widget to the dom
	insertToDOM(){
		this.destination.appendChild(this._wrapperElement);
		return this;
	}

	//Warn the dashboard of updated data in the widgets datastore
	hasNewData(){
		return this.dashboard.widgetHasNewData(this, this.dataStore);
	}
	
	//Anything that tries to call this will throw an error if it is overridden in a derived  class
	//This method should be widget spesific since data has different froms depending on the widget
	updateDatasource(){
		throw new Error("updateDatasource() method not implemented in a derived class");
	}

}

module.exports = Widget;