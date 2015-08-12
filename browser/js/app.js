define([], function () {
	sigma.parsers.json('data.json', {
    container: 'container',
    settings: {
      defaultNodeColor: '#ec5148'
    }
  });

	return App;
});
