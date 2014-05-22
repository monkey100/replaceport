//helpers.js
//They way I want to organise the helper objects is into sub poperties of the property object.
//EG helpers : {php : {somefunction : function(){}}
//This doesn't need any deep functionality, that's what plugins are for.


Twoshoes.init(
{
	helpers : {
		time : {

			//Convert date object to datetime string
			dateToDatetime : function(date)
			{
				if (typeof date == 'undefined')
				{
					date = new Date();
				}

				return Twoshoes.helper('time').formatDate('Y-m-d H:i:s', date);
			},

			dayNames : function()
			{
				return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
			},

			dayNamesAbbrev : function()
			{
				return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
			},

			monthNames : function()
			{
				return ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			},

			monthNamesAbbrev : function()
			{
				return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			},

			timezones : function()
			{
				return ['Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', 'Africa/Asmera', 'Africa/Bamako', 'Africa/Bangui', 'Africa/Banjul', 'Africa/Bissau', 'Africa/Blantyre', 'Africa/Brazzaville', 'Africa/Bujumbura', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Ceuta', 'Africa/Conakry', 'Africa/Dakar', 'Africa/Dar_es_Salaam', 'Africa/Djibouti', 'Africa/Douala', 'Africa/El_Aaiun', 'Africa/Freetown', 'Africa/Gaborone', 'Africa/Harare', 'Africa/Johannesburg', 'Africa/Kampala', 'Africa/Khartoum', 'Africa/Kigali', 'Africa/Kinshasa', 'Africa/Lagos', 'Africa/Libreville', 'Africa/Lome', 'Africa/Luanda', 'Africa/Lubumbashi', 'Africa/Lusaka', 'Africa/Malabo', 'Africa/Maputo', 'Africa/Maseru', 'Africa/Mbabane', 'Africa/Mogadishu', 'Africa/Monrovia', 'Africa/Nairobi', 'Africa/Ndjamena', 'Africa/Niamey', 'Africa/Nouakchott', 'Africa/Ouagadougou', 'Africa/Porto-Novo', 'Africa/Sao_Tome', 'Africa/Timbuktu', 'Africa/Tripoli', 'Africa/Tunis', 'Africa/Windhoek', 'America/Adak', 'America/Anchorage', 'America/Anguilla', 'America/Antigua', 'America/Araguaina', 'America/Argentina/Buenos_Aires', 'America/Argentina/Catamarca', 'America/Argentina/ComodRivadavia', 'America/Argentina/Cordoba', 'America/Argentina/Jujuy', 'America/Argentina/La_Rioja', 'America/Argentina/Mendoza', 'America/Argentina/Rio_Gallegos', 'America/Argentina/San_Juan', 'America/Argentina/Tucuman', 'America/Argentina/Ushuaia', 'America/Aruba', 'America/Asuncion', 'America/Atikokan', 'America/Atka', 'America/Bahia', 'America/Barbados', 'America/Belem', 'America/Belize', 'America/Blanc-Sablon', 'America/Boa_Vista', 'America/Bogota', 'America/Boise', 'America/Buenos_Aires', 'America/Cambridge_Bay', 'America/Campo_Grande', 'America/Cancun', 'America/Caracas', 'America/Catamarca', 'America/Cayenne', 'America/Cayman', 'America/Chicago', 'America/Chihuahua', 'America/Coral_Harbour', 'America/Cordoba', 'America/Costa_Rica', 'America/Cuiaba', 'America/Curacao', 'America/Danmarkshavn', 'America/Dawson', 'America/Dawson_Creek', 'America/Denver', 'America/Detroit', 'America/Dominica', 'America/Edmonton', 'America/Eirunepe', 'America/El_Salvador', 'America/Ensenada', 'America/Fort_Wayne', 'America/Fortaleza', 'America/Glace_Bay', 'America/Godthab', 'America/Goose_Bay', 'America/Grand_Turk', 'America/Grenada', 'America/Guadeloupe', 'America/Guatemala', 'America/Guayaquil', 'America/Guyana', 'America/Halifax', 'America/Havana', 'America/Hermosillo', 'America/Indiana/Indianapolis', 'America/Indiana/Knox', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Vevay', 'America/Indiana/Vincennes', 'America/Indianapolis', 'America/Inuvik', 'America/Iqaluit', 'America/Jamaica', 'America/Jujuy', 'America/Juneau', 'America/Kentucky/Louisville', 'America/Kentucky/Monticello', 'America/Knox_IN', 'America/La_Paz', 'America/Lima', 'America/Los_Angeles', 'America/Louisville', 'America/Maceio', 'America/Managua', 'America/Manaus', 'America/Martinique', 'America/Mazatlan', 'America/Mendoza', 'America/Menominee', 'America/Merida', 'America/Mexico_City', 'America/Miquelon', 'America/Moncton', 'America/Monterrey', 'America/Montevideo', 'America/Montreal', 'America/Montserrat', 'America/Nassau', 'America/New_York', 'America/Nipigon', 'America/Nome', 'America/Noronha', 'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/Panama', 'America/Pangnirtung', 'America/Paramaribo', 'America/Phoenix', 'America/Port-au-Prince', 'America/Port_of_Spain', 'America/Porto_Acre', 'America/Porto_Velho', 'America/Puerto_Rico', 'America/Rainy_River', 'America/Rankin_Inlet', 'America/Recife', 'America/Regina', 'America/Rio_Branco', 'America/Rosario', 'America/Santiago', 'America/Santo_Domingo', 'America/Sao_Paulo', 'America/Scoresbysund', 'America/Shiprock', 'America/St_Johns', 'America/St_Kitts', 'America/St_Lucia', 'America/St_Thomas', 'America/St_Vincent', 'America/Swift_Current', 'America/Tegucigalpa', 'America/Thule', 'America/Thunder_Bay', 'America/Tijuana', 'America/Toronto', 'America/Tortola', 'America/Vancouver', 'America/Virgin', 'America/Whitehorse', 'America/Winnipeg', 'America/Yakutat', 'America/Yellowknife', 'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/DumontDUrville', 'Antarctica/Mawson', 'Antarctica/McMurdo', 'Antarctica/Palmer', 'Antarctica/Rothera', 'Antarctica/South_Pole', 'Antarctica/Syowa', 'Antarctica/Vostok', 'Arctic/Longyearbyen', 'Asia/Aden', 'Asia/Almaty', 'Asia/Amman', 'Asia/Anadyr', 'Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Ashgabat', 'Asia/Ashkhabad', 'Asia/Baghdad', 'Asia/Bahrain', 'Asia/Baku', 'Asia/Bangkok', 'Asia/Beirut', 'Asia/Bishkek', 'Asia/Brunei', 'Asia/Calcutta', 'Asia/Choibalsan', 'Asia/Chongqing', 'Asia/Chungking', 'Asia/Colombo', 'Asia/Dacca', 'Asia/Damascus', 'Asia/Dhaka', 'Asia/Dili', 'Asia/Dubai', 'Asia/Dushanbe', 'Asia/Gaza', 'Asia/Harbin', 'Asia/Hong_Kong', 'Asia/Hovd', 'Asia/Irkutsk', 'Asia/Istanbul', 'Asia/Jakarta', 'Asia/Jayapura', 'Asia/Jerusalem', 'Asia/Kabul', 'Asia/Kamchatka', 'Asia/Karachi', 'Asia/Kashgar', 'Asia/Katmandu', 'Asia/Krasnoyarsk', 'Asia/Kuching', 'Asia/Kuwait', 'Asia/Macao', 'Asia/Macau', 'Asia/Magadan', 'Asia/Makassar', 'Asia/Manila', 'Asia/Muscat', 'Asia/Nicosia', 'Asia/Novosibirsk', 'Asia/Omsk', 'Asia/Oral', 'Asia/Phnom_Penh', 'Asia/Pontianak', 'Asia/Pyongyang', 'Asia/Qatar', 'Asia/Qyzylorda', 'Asia/Rangoon', 'Asia/Riyadh', 'Asia/Saigon', 'Asia/Sakhalin', 'Asia/Samarkand', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Taipei', 'Asia/Tashkent', 'Asia/Tbilisi', 'Asia/Tehran', 'Asia/Tel_Aviv', 'Asia/Thimbu', 'Asia/Thimphu', 'Asia/Tokyo', 'Asia/Ujung_Pandang', 'Asia/Ulaanbaatar', 'Asia/Ulan_Bator', 'Asia/Urumqi', 'Asia/Vientiane', 'Asia/Vladivostok', 'Asia/Yakutsk', 'Asia/Yekaterinburg', 'Asia/Yerevan', 'Atlantic/Azores', 'Atlantic/Bermuda', 'Atlantic/Canary', 'Atlantic/Cape_Verde', 'Atlantic/Faeroe', 'Atlantic/Jan_Mayen', 'Atlantic/Madeira', 'Atlantic/Reykjavik', 'Atlantic/South_Georgia', 'Atlantic/St_Helena', 'Atlantic/Stanley', 'Australia/ACT', 'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Broken_Hill', 'Australia/Canberra', 'Australia/Currie', 'Australia/Darwin', 'Australia/Hobart', 'Australia/LHI', 'Australia/Lindeman', 'Australia/Lord_Howe', 'Australia/Melbourne', 'Australia/North', 'Australia/NSW', 'Australia/Perth', 'Australia/Queensland', 'Australia/South', 'Australia/Sydney', 'Australia/Tasmania', 'Australia/Victoria', 'Australia/West', 'Australia/Yancowinna', 'Europe/Amsterdam', 'Europe/Andorra', 'Europe/Athens', 'Europe/Belfast', 'Europe/Belgrade', 'Europe/Berlin', 'Europe/Bratislava', 'Europe/Brussels', 'Europe/Bucharest', 'Europe/Budapest', 'Europe/Chisinau', 'Europe/Copenhagen', 'Europe/Dublin', 'Europe/Gibraltar', 'Europe/Guernsey', 'Europe/Helsinki', 'Europe/Isle_of_Man', 'Europe/Istanbul', 'Europe/Jersey', 'Europe/Kaliningrad', 'Europe/Kiev', 'Europe/Lisbon', 'Europe/Ljubljana', 'Europe/London', 'Europe/Luxembourg', 'Europe/Madrid', 'Europe/Malta', 'Europe/Mariehamn', 'Europe/Minsk', 'Europe/Monaco', 'Europe/Moscow', 'Europe/Nicosia', 'Europe/Oslo', 'Europe/Paris', 'Europe/Prague', 'Europe/Riga', 'Europe/Rome', 'Europe/Samara', 'Europe/San_Marino', 'Europe/Sarajevo', 'Europe/Simferopol', 'Europe/Skopje', 'Europe/Sofia', 'Europe/Stockholm', 'Europe/Tallinn', 'Europe/Tirane', 'Europe/Tiraspol', 'Europe/Uzhgorod', 'Europe/Vaduz', 'Europe/Vatican', 'Europe/Vienna', 'Europe/Vilnius', 'Europe/Volgograd', 'Europe/Warsaw', 'Europe/Zagreb', 'Europe/Zaporozhye', 'Europe/Zurich', 'Indian/Antananarivo', 'Indian/Chagos', 'Indian/Christmas', 'Indian/Cocos', 'Indian/Comoro', 'Indian/Kerguelen', 'Indian/Mahe', 'Indian/Maldives', 'Indian/Mauritius', 'Indian/Mayotte', 'Indian/Reunion', 'Pacific/Apia', 'Pacific/Auckland', 'Pacific/Chatham', 'Pacific/Easter', 'Pacific/Efate', 'Pacific/Enderbury', 'Pacific/Fakaofo', 'Pacific/Fiji', 'Pacific/Funafuti', 'Pacific/Galapagos', 'Pacific/Gambier', 'Pacific/Guadalcanal', 'Pacific/Guam', 'Pacific/Honolulu', 'Pacific/Johnston', 'Pacific/Kiritimati', 'Pacific/Kosrae', 'Pacific/Kwajalein', 'Pacific/Majuro', 'Pacific/Marquesas', 'Pacific/Midway', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Norfolk', 'Pacific/Noumea', 'Pacific/Pago_Pago', 'Pacific/Palau', 'Pacific/Pitcairn', 'Pacific/Ponape', 'Pacific/Port_Moresby', 'Pacific/Rarotonga', 'Pacific/Saipan', 'Pacific/Samoa', 'Pacific/Tahiti', 'Pacific/Tarawa', 'Pacific/Tongatapu', 'Pacific/Truk', 'Pacific/Wake', 'Pacific/Wallis', 'Pacific/Yap'];
			},

			//Converts a database datetime string to a date object
			stringToDate : function(datetime)
			{
				date = new Date();
				datetimeRegex = /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})[\s]{1}([0-9]{2}):([0-9]{2}):([0-9]{2})?/;
				datetimeValues = datetime.match(datetimeRegex);

				//Set values to date object.
				date.setYear(parseInt(datetimeValues[1]));
				date.setMonth(parseInt(datetimeValues[2]));
				date.setDate(parseInt(datetimeValues[3]));
				date.setHours(parseInt(datetimeValues[4]));
				date.setMinutes(parseInt(datetimeValues[5]));
				date.setSeconds(parseInt(datetimeValues[6]));

				return date;
			},

			//Adds leading zeros to the value.
			addZeros : function(value, size)
			{
				if ((value == 0) ||(parseInt(value) / Math.pow(10, size - 1)) < 1)
				{
					value = '0'+value;
				}

				return value;
			},

			getSuffix : function(value)
			{
				var suffix = 'th';

				//Get last digit.
				var stringValue = value.toString();
				var decimalUnits = stringValue.substr(stringValue.length, 1);
				switch(decimalUnits)
				{
					case '1': suffix = 'st';
					case '2': suffix = 'nd';
					case '3': suffix = 'rd';
				}

				return suffix;
			},

			isLeapYear : function(value)
			{
				if (value % 4 != 0)
				{
					return true;
				}

				return false;
			},

			getAmPm : function(value)
			{
				//need 24 time
				if (value > 11)
				{
					return 'am';
				}

				return 'pm';
			},

			getClockHour : function(value)
			{
				if (value >= 12)
				{
					value = value - 12;
				}

				return value;
			},

			//this should be a separate helper in the future with php syle options.
			//Formats the datetime into a string for display
			// - format:		The format string in which to substitute the datetime values
			// - datetime:		Datetime string to format for display
			//NB: This function replicates the strtotime function using UTC
			formatDate : function(format, datetime)
			{
				//should check that datetime is a Date object
				var date;
				if (Object.prototype.toString.call(datetime) === '[object String]')
				{
					date = Twoshoes.helper('time').stringToDate(datetime);
				}
				else
				{
					date = new Date();
				}

				//These values can be globalised.
				var weekDaysShort = Twoshoes.helper('time').dayNamesAbbrev();
				var weekDaysLong = Twoshoes.helper('time').dayNames();
				var monthsShort = Twoshoes.helper('time').monthNamesAbbrev();
				var monthsLong = Twoshoes.helper('time').monthNames();

				//Replace string fomrat values with datetime value.
				var splitDatetime = format.split("");
				var formattedDatetime = '';
				for (var i = 0, j = splitDatetime.length; i < j; i++)
				{
					(function(i)
					{
						switch(splitDatetime[i])
						{
							case 'd': formattedDatetime += Twoshoes.helper('time').addZeros(date.getDate().toString(), 2); break;
							case 'D': formattedDatetime += weekDaysShort[date.getDay().toString()]; break;
							case 'j': formattedDatetime += date.getDate().toString(); break;
							case 'l': formattedDatetime += weekDaysLong[date.getDay().toString()]; break;
							case 'S': formattedDatetime += Twoshoes.helper('time').getSuffix(date.getDate().toString()); break;
							case 'w': formattedDatetime += date.getDay().toString(); break;
							//case 'z': formattedDatetime += date.getDay().toString(); break; //cannot d the day of the year without full calculation(same with 'z')
							//case 'w': formattedDatetime += date.getDay().toString(); break; //cannot get week of te year without ful calculation
							case 'F': formattedDatetime += monthsLong[date.getMonth().toString()]; break;
							case 'm': formattedDatetime += Twoshoes.helper('time').addZeros(date.getMonth().toString(), 2); break;
							case 'M': formattedDatetime += monthsShort[date.getMonth().toString()]; break;
							case 'n': formattedDatetime += date.getMonth().toString(); break;
							//case 't': formattedDatetime += date.getMonth().toString(); break; //cannot get the number of days in given month yet
							case 'L': formattedDatetime += Twoshoes.helper('time').isLeapYear(date.getFullYear().toString()); break;
							case 'o': formattedDatetime += date.getFullYear().toString(); break; //Need formatting?
							case 'Y': formattedDatetime += date.getFullYear().toString(); break; //Need formatting?
							case 'y': formattedDatetime += date.getFullYear().toString().substr(0, 2); break;
							case 'a': formattedDatetime += Twoshoes.helper('time').getAmPm(date.getHours().toString()); break;
							case 'A': formattedDatetime += date.getHours(); break;
							//case 'B': formattedDatetime += Twoshoes.helper('time').getAmPm(date.getHours().toString().toUpperCase()); break;  //Don't understand this value
							case 'G': formattedDatetime += date.getHours().toString(); break;
							case 'g': formattedDatetime += Twoshoes.helper('time').getClockHour(date.getHours().toString()); break;
							case 'h': formattedDatetime += Twoshoes.helper('time').getClockHour(Twoshoes.helper('time').addZeros(date.getHours().toString(), 2)); break;
							case 'H': formattedDatetime += Twoshoes.helper('time').addZeros(date.getHours().toString(), 2); break;
							case 'i': formattedDatetime += Twoshoes.helper('time').addZeros(date.getMinutes().toString(), 2); break;
							case 's': formattedDatetime += Twoshoes.helper('time').addZeros(date.getSeconds().toString(), 2); break;
							//not doing milliseconds
							//not doing timezones
							//not doing full datetimes
							default: formattedDatetime += splitDatetime[i];
						}
					})(i);
				}

				return formattedDatetime;
			},

			getDayOfWeek : function(datetime)
			{
				//convert the datetime into a date.
				var date = Twoshoes.helper('time').stringToDate(datetime);
				return date.getDay().toString();
			},

			getDifferenceMilliseconds : function(firstDatetime, secondDatetime)
			{
				var timeDifference = 0;

				//If there is no value make the dates now.
				if (!firstDatetime)
				{
					firstDatetime = Date();
				}

				if (!secondDatetime)
				{
					secondDatetime = Date();
				}

				//Convert strings to date object.
				if (Twoshoes.isString(firstDatetime))
				{
					firstDatetime = Twoshoes.helper('time').stringToDate(firstDatetime);
				}

				if (Twoshoes.isString(secondDatetime))
				{
					secondDatetime = Twoshoes.helper('time').stringToDate(secondDatetime);
				}

				//Get universal date value var secondUTCDate = Date.UTC(secondDatetime.getFullYear(), secondDatetime.getMonth(), secondDatetime.getDate(), secondDatetime.getHours(), secondDatetime.getMinutes(), secondDatetime.getSeconds(), secondDatetime.getMilliseconds());

				timeDifference = firstDatetime - secondDatetime;
				return timeDifference;
			},

			getTimeDifference : function(timeUnit, firstDatetime, secondDatetime, roundUp)
			{
				var msDifference = Twoshoes.helper('time').getDifferenceMilliseconds(firstDatetime, secondDatetime, roundUp);

				var divider;
				switch (timeUnit)
				{
					case 'seconds': divider = 1000; break;
					case 'minutes': divider = 1000 * 60; break;
					case 'hours': divider = 1000 * 60 * 60; break;
					case 'days': divider = 1000 * 60 * 60 * 24; break;
					case 'weeks': divider = 1000 * 60 * 60 * 24 * 7; break;
					//case 'months': divider = 1000; break;
					//case 'years': divider = 1000; break;
				}

				if (msDifference == 0)
				{
					return msDifference;
				}

				if ((typeof roundUp != 'undefined') && (roundUp == true))
				{
					return Math.ceil(msDifference / divider);
				}

				return Math.floor(msDifference / divider);
			},

			getDifferenceSeconds : function(firstDatetime, secondDatetime, roundUp)
			{
				var msDifference = Twoshoes.helper('time').getDifferenceMilliseconds(firstDatetime, secondDatetime, roundUp);
			},

			getDifferenceMinutes : function(firstDatetime, secondDatetime, roundUp)
			{
				var msPerMinute = 1000 * 60;
				var msDifference = Twoshoes.helper('time').getDifferenceMilliseconds(firstDatetime, secondDatetime, roundUp);
				return msDifference * msPerMinute;
			},

			getDifferenceHours : function(firstDatetime, secondDatetime, roundUp)
			{
				var msPerHour = 1000 * 60 * 60;
				var msDifference = Twoshoes.helper('time').getDifferenceMilliseconds(firstDatetime, secondDatetime, roundUp);
				return msDifference * msPerHour;
			},

			getDifferenceDays : function(firstDatetime, secondDatetime, roundUp)
			{
				var msPerDay = 1000 * 60 * 60 * 24;
				var msDifference = Twoshoes.helper('time').getDifferenceMilliseconds(firstDatetime, secondDatetime, roundUp);
				return msDifference * msPerDay;
			},

			//*!*These last three just best to use date object
			getDifferenceWeeks : function(firstDatetime, secondDatetime, roundUp)
			{
				var msPerWeek = 1000 * 60 * 60 * 24 * 7;
				var msDifference = Twoshoes.helper('time').getDifferenceMilliseconds(firstDatetime, secondDatetime, roundUp);
				return msDifference * msPerWeek;
			},

			getDifferenceMonths : function(firstDatetime, secondDatetime, roundUp)
			{
				var msPerDay = 1000 * 60 * 60 * 24;//need to get days in months between dates
				var daysBetweenDates = 1;//?
				var msDifference = Twoshoes.helper('time').getDifferenceMilliseconds(firstDatetime, secondDatetime, roundUp);
				return msDifference * msPerDay * daysBetweenDates;
			},

			getDifferenceYears : function(firstDatetime, secondDatetime, roundUp)
			{
				var msPerDay = 1000 * 60 * 60 * 24 * 0;//need to get days in years between dates
				var daysBetweenDates = 1;//?
				var msDifference = Twoshoes.helper('time').getDifferenceMilliseconds(firstDatetime, secondDatetime, roundUp);
				return msDifference * msPerDay * daysBetweenDates;
			}

		}
	}

});
