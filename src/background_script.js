//console.log("background_script.js-init");

chrome.runtime.onInstalled.addListener(function() {
	//console.log("background_script.js-chrome.runtime.onInstalled.addListener");
	
	// set default stored code
	chrome.storage.sync.get('code', function(data) {
		if(!data.code) {
			chrome.storage.sync.set({
				'code': ""
			}, function() {
				//console.log("background_script.js-storage.sync.set");
			});
		}
	});
	
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([
			{
				'conditions': [
					new chrome.declarativeContent.PageStateMatcher({
						//'pageUrl': {
						//	'hostEquals': "developer.chrome.com"
						//},
					})
				],
				'actions': [
					new chrome.declarativeContent.ShowPageAction()
				]
			}
		]);
	});
});
