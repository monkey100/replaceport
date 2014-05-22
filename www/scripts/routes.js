//routes.js

//Need a routine to limit the amount of free trial that the user can signup for - 3months
Twoshoes.init(
{
	routes : {
		testGroup : {
			testRoute1 : {
				path : /test/,
				dispatch : function()
				{
alert('test111');
				}
			},
			testRoute2 : {
				event : 'click',
				target : '#clickme',
				dispatch : function()
				{
Twoshoes.paths('test', 'testGroup');
// alert('SUCCESS!');
// Twoshoes.route('testGroup').adapt('testRoute2', {target:'#clickyou'});
// console.log(Twoshoes.config.routes);

				}
			}
		}
	}
});