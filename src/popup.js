	
	let code_el = document.getElementById('code');
	let save_el = document.getElementById('save');
	let font_increase_el = document.getElementById('font_increase');
	let font_decrease_el = document.getElementById('font_decrease');
	let run_el = document.getElementById('run');
	let save_run_el = document.getElementById('save_run');
	let status_el = document.getElementById('status');
	
	// set placeholder text
	code_el.setAttribute('placeholder', "// example...\n$(\"a\").each(function() {\n\tconsole.log(\"anchor link:\", $(this).attr('href'));\n});");
	
	// CodeMirror editor
	// https://codemirror.net/
	let editor = CodeMirror.fromTextArea(code_el, {
		'lineNumbers': true,
		'tabSize': 4,
		'indentUnit': 4,
		'indentWithTabs': true,
		'mode': {
			'name': "javascript"
		},
		'matchbrackets': true,
		'extraKeys': {
			'Ctrl-S': function() {
				saveCode();
			}
		}
	});
	
	let editor_el = document.getElementsByClassName(".CodeMirror")[0];
	
	// get stored code
	chrome.storage.sync.get('code', function(data) {
		if(data.code) {
			editor.setValue(data.code);
		}
	});
	
	// set display status
	function setStatus(txt) {
		status_el.innerHTML = txt;
	}
	
	// save code
	function saveCode() {
		let raw_code = editor.getValue();
		
		chrome.storage.sync.set({
			'code': raw_code
		}, setStatus("Saved"));
	}
	
	// run code
	function runCode(cb) {
		let raw_code = editor.getValue();
		
		chrome.tabs.query({
			'active': true,
			'currentWindow': true
		}, function(tabs) {
			chrome.tabs.executeScript(tabs[0].id, {
				'file': "src/lib/jquery-3.3.1.min.js"
			}, function() {
				chrome.tabs.executeScript(tabs[0].id, {
					'code': raw_code
				}, cb);
			});
		});
	}
	
	// save button click event
	save_el.onclick = function(element) {
		saveCode();
	};
	
	// run button click event
	run_el.onclick = function(element) {
		runCode(function() {
			setStatus("Ran");
		});
	};
	
	// save button click event
	save_run_el.onclick = function(element) {
		saveCode();
		runCode(function() {
			setStatus("Saved &amp; Ran");
		});
	};
	
	// get current code font size
	function getCodeFontSize() {
		let style = window.getComputedStyle(editor_el, null).getPropertyValue('font-size');
		
		return parseFloat(style); 
	}
	
	// font increase button click event
	font_increase_el.onclick = function(element) {
		let new_size = Math.max(6, Math.min(72, (getCodeFontSize() + 1)));
		
		editor_el.style.fontSize = new_size +"px";
	};
	
	// font decrease button click event
	font_decrease_el.onclick = function(element) {
		let new_size = Math.max(6, Math.min(72, (getCodeFontSize() - 1)));
		
		editor_el.style.fontSize = new_size +"px";
	};
	