class Resource {

	constructor(elem, widget){
        //A reference to the element from which the resource is called
		this.elem = elem;

        //A reference to the widget from which the resource is called
        this.widget = widget;

        //Container for modify return values. This is the place to store a plugin's instances, 
        //a reference to widgets contents api etc.
        this.modifierReturn;
        //Check if modify is defined
        if(typeof this.modify !== 'function'){
            throw new Error("You must define a `modify` method in classes inheriting from `Resource`");
        } else {
            this.modifierReturn = this.modify.call(this);
        }
	}
}

module.exports = Resource;