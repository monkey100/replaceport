//tables.js
Twoshoes.init(
{
	tables : {
		projects : {
			fields : ['key', 'title', 'owner', 'version', 'created', 'summary', 'description', 'image', 'thumbnail', 'totaldownloads', 'monthlydownloads', 'rating', 'followers'],
			defaults : [],
			filters : {},
			values : []
		},
		users : {
			fields : ['username', 'alias', 'locale', 'expires', 'created'],
			defaults : [],
			filters : {},
			values : []
		},
		tags : {
			fields : ['tag', 'active', 'created'],
			defaults : [],
			filters : {},
			values : []
		}
	}
});