//This class resembers a dashboard, with all the widgets and controls.
//It stores data widgets use to render their graphics, has a reference 
//to each widget and manages widgets' communation
class Dashboard {

	constructor(){
		this._widgetStore = {};
		this._dataStore = {};
		this._dataSubscribers = {};
	}

	addWidget(widgetReference, widgetName){
		
		//If there is no argument passed that defines widget's name, use its classes names
		if(typeof widgetName !== 'string'){
			
			//Replace all '-' or ' ' characters
			//or
			//if there are no classes, use a integer
			widgetName = widgetReference.classNames.replace(/-|\s/g,'');
			
			//if the name exists, append a string to it's name
			if(this.getWidgetByName(widgetName) !== undefined || widgetName.length === 0){
				widgetName = Object.keys(this._widgetStore).length.toString();
				console.warn('New widget created under name of: ' + widgetName);
			}
		}

		//Set widget's dashboard to refer to this dashboard.
		//Doing so enabled the widget to see in which dashboard it belongs to.
		widgetReference.dashboard = this;

		//Add widget to the store
		this._widgetStore[widgetName] = widgetReference;
		

		return widgetName;
	}

	//Gets a widget by its name
	getWidgetByName(name){
		var key = Object.keys(this._widgetStore)
		.filter(key => key === name)[0];
		return this._widgetStore[key];
	}

	//Lists all widgets
	getWidgets(){
		return Object.keys(this._widgetStore)
		.map(key => this._widgetStore[key]);
	}

	//Notifies the dashboard if a widget has a new value
	widgetHasNewData(widget, data){
	
		//We need the key of the widget in the widgetstore
		var widgetKey;
		Object.keys(this._widgetStore).forEach(key => {if(this._widgetStore[key] == widget){ widgetKey = key }}, this);
		
		//Check if the widget actually exists in the widget store (should always exist)
		if(widgetKey){
			this._dataStore[widgetKey] = data;
			this.notifySubscribers(widgetKey);
			
		}
	}

	//Allow widgets to subscribe to other widgets data changes
	//This is especially useful when one widget loads data for other widgets that consume that data
	subscribeToData(subscribeTo, widgetKey){

		if(this._dataSubscribers[subscribeTo] === undefined){
			this._dataSubscribers[subscribeTo] = [];
			this._dataSubscribers[subscribeTo].push(widgetKey);
		} else {
			//Check for uniqueness
			if(this._dataSubscribers[subscribeTo].indexOf(widgetKey) === -1){
				this._dataSubscribers[subscribeTo].push(widgetKey);
			} else {
				console.warn("Already subscribed to: " + widgetKey);
			}
		}
	}

	unsubscribeFromData(subscribeTo, widgetKey){
		
		if(this._hasActiveSubscriptions(subscribeTo)){
			this._dataSubscribers[subscribeTo].splice(this._dataSubscribers[subscribeTo].indexOf(widgetKey), 1);
		}
	}

	//Notifies subscribed widgets of the changed data and attempts to update them it via .updateDatasource method.
	notifySubscribers(subscribeTo){
		//If has active subscriptions
		if(this._hasActiveSubscriptions(subscribeTo)){
			this._dataSubscribers[subscribeTo]
			.forEach(subscriber => { 
				this._widgetStore[subscriber].updateDatasource(this._dataStore[subscribeTo]); 
			}, this);
		}
	}

	//A helper method to see if there are any subscriptions for a given key
	_hasActiveSubscriptions(subscribeTo){
		return (this._dataSubscribers[subscribeTo] != undefined && this._dataSubscribers[subscribeTo].length > 0);
	}

}

module.exports = Dashboard;