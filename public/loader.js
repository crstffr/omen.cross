(function() {
    
    function load(script) {
        document.write('<' + 'script src="' + script + '" type="text/javascript"><' + '/script>');
    }

    load('vendor/system.js');
    load('config.js');
    load('bundles.js');
    load('bootstrap.js');
    
})();

