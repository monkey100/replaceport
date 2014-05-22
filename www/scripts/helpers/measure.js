//helpers.js
//They way I want to organise the helper objects is into sub poperties of the property object.
//EG helpers : {php : {somefunction : function(){}}
//This doesn't need any deep functionality, that's what plugins are for.


Twoshoes.init(
{
	helpers : {
		measure : {

			//These are on hold untill a good API can be finalised. Using templates for now in app helper.
			formatDistance : function(display, distance)
			{

			},

			formatWeight : function(display, weight)
			{

			},

			mToIn : function(meters)
			{
				var conversion = 39.37007874;

				//Validate value.
				if (meters)
				{
					if (Twoshoes.isString(meters))
					{
						meters = parseFloat(meters);
					}
					else if (!Twoshoes.isNumber(meters))
					{
						return 0;
					}
				}

				if (meters)
				{
					return meters * conversion;
				}

				return conversion;
			},

			mToFt : function(meters)
			{
				var conversion = 3.28083976;

				//Validate value.
				if (meters)
				{
					if (Twoshoes.isString(meters))
					{
						meters = parseFloat(meters);
					}
					else if (!Twoshoes.isNumber(meters))
					{
						return 0;
					}
				}

				if (meters)
				{
					return meters * conversion;
				}

				return conversion;
			},

			mToYd : function(meters)
			{
				var conversion = 1.09361339;

				//Validate value.
				if (meters)
				{
					if (Twoshoes.isString(meters))
					{
						meters = parseFloat(meters);
					}
					else if (!Twoshoes.isNumber(meters))
					{
						return 0;
					}
				}

				if (meters)
				{
					return meters * conversion;
				}

				return conversion;
			},

			mToMi : function(meters)
			{
				var conversion = 0.00062137;

				//Validate value.
				if (meters)
				{
					if (Twoshoes.isString(meters))
					{
						meters = parseFloat(meters);
					}
					else if (!Twoshoes.isNumber(meters))
					{
						return 0;
					}
				}

				if (meters)
				{
					return meters * conversion;
				}

				return conversion;
			},

			distance : function(value, units)
			{
				var distanceValues = {mm:0,cm:0,m:0,km:0,in:0,ft:0,yd:0,mi:0};

				//Convert value from string.
				if (Twoshoes.isString(value))
				{
					value = parseFloat(value);
				}

				//Convert to meters.
				var base = false;
				switch (units.toLowerCase())
				{
					case 'millimeters': case 'mm': base = value / 1000; break;
					case 'centimeters': case 'cm': base = value / 100; break;
					case 'meters': case 'm': base = value; break;
					case 'kilometers': case 'km': base = value * 1000; break;
					case 'inches': case 'in': base = value / Twoshoes.helper('measure').mToIn(); break;
					case 'feet': case 'ft': base = value / Twoshoes.helper('measure').mToFt(); break;
					case 'yards': case 'yd': base = value / Twoshoes.helper('measure').mToYd(); break;
					case 'miles': case 'mi': base = value / Twoshoes.helper('measure').mToMi(); break;
					default:
						//do error here.
						return distanceValues;
				}

				//We're not doing straight up conversion here, we are setting splittable properties
				distanceValues = {
					mm : (base * 1000),
					cm : (base * 100),
					m : base,
					km : (base / 1000),
					in : Twoshoes.helper('measure').mToIn(base),
					ft : Twoshoes.helper('measure').mToFt(base),
					yd : Twoshoes.helper('measure').mToYd(base),
					mi : Twoshoes.helper('measure').mToMi(base)
				};

				return distanceValues;
			},

			gToOz : function(grams)
			{
				var conversion = 0.03527397;

				//Validate value.
				if (grams)
				{
					if (Twoshoes.isString(grams))
					{
						grams = parseFloat(grams);
					}
					else if (!Twoshoes.isNumber(grams))
					{
						return 0;
					}
				}

				if (grams)
				{
					return grams * conversion;
				}

				return conversion;
			},

			gToLb : function(grams)
			{
				var conversion = 0.00220462;

				//Validate value.
				if (grams)
				{
					if (Twoshoes.isString(grams))
					{
						grams = parseFloat(grams);
					}
					else if (!Twoshoes.isNumber(grams))
					{
						return 0;
					}
				}

				if (grams)
				{
					return grams * conversion;
				}

				return conversion;
			},

			gToSt : function(grams)
			{
				var conversion = 0.00015747;

				//Validate value.
				if (grams)
				{
					if (Twoshoes.isString(grams))
					{
						grams = parseFloat(grams);
					}
					else if (!Twoshoes.isNumber(grams))
					{
						return 0;
					}
				}

				if (grams)
				{
					return grams * conversion;
				}

				return conversion;
			},

			weight : function(value, units)
			{
				var weightValues = {g:0,kg:0,oz:0,lb:0,st:0};

				//Convert value from string.
				if (Twoshoes.isString(value))
				{
					value = parseFloat(value);
				}

				//Convert to meters.
				var base = false;
				switch (units.toLowerCase())
				{
					case 'grams': case 'g': base = value; break;
					case 'kilograms': case 'kg': base = value * 1000; break;
					case 'ounces': case 'oz': base = value / Twoshoes.helper('measure').gToOz(); break;
					case 'pounds': case 'lb': base = value / Twoshoes.helper('measure').gToLb(); break;
					case 'stone': case 'st': base = value / Twoshoes.helper('measure').gToSt(); break;
					default:
						//do error here.
						return weightValues;
				}

				//We're not doing straight up conversion here, we are setting splittable properties
				weightValues = {
					g : base,
					kg : (base / 1000),
					oz : Twoshoes.helper('measure').gToOz(base),
					lb : Twoshoes.helper('measure').gToLb(base),
					st : Twoshoes.helper('measure').gToSt(base),
				};

				return weightValues;
			}
		}
	}

});
