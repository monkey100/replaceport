//time.js
//They way I want to organise the helper objects is into sub poperties of the property object.
//EG helpers : {php : {somefunction : function(){}}
//This doesn't need any deep functionality, that's what plugins are for.


Twoshoes.init(
{
	helpers : {
		dom : {
			getClasses : function(element)
			{
				var classes = [];
				if (Twoshoes.helper('dom').hasAttribute(element, 'class'))
				{
					var attribute = jQuery(element).attr('class').split(' ');
					var count = 0;
				    jQuery.each(attribute, function(index, value)
					{
				        if (value !== '')
						{
				            classes[count] = value;
				            count++;
				        }
				    });
				}

				return classes;
			},
			hasAttribute : function(element, attribute)
			{
				var value = jQuery(element).attr('class');
				if ((typeof value !== 'undefined') && (value !== false))
				{
					return true;
				}

				return false;
			},
			matchClass : function(element, string)
			{
				var match = '';
				var classes = Twoshoes.helper('dom').getClasses(element);
				jQuery.each(classes, function(index, value)
				{
					if (value.indexOf(string) != -1)
					{
						match = value;
					}
				});

				return match;
			}
		}
	}

});
