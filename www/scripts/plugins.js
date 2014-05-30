//plugins.js

Twoshoes.init(
{
	plugins : {
		projectRating : {
			plugin : 'raty',
			target : '.gallery',
			config : {
				numberMax : 5,
				number    : 100
			}
		},
		navigatioMenu : {
			plugin : 'navPlugin',
			target : 'ul#category_menu',
			config : {}
		}
	}
});