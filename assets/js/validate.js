
//g-recaptcha on load
function onloadCallback() {
    grecaptcha.render('grelem', {
        'sitekey' : '6LfFHhEUAAAAAIHSvYBhfCvQHgtz9qhiaHOfkS43',
        'callback' : 'recaptchaIsChecked',
        'expired-callback' : 'recaptchaExpired'
    });
};
//g-recaptcha is checked
function recaptchaIsChecked() {
	const el = document.getElementById('send');
	el.setAttribute('active', 'true');
	el.setAttribute('data-toggle', 'modal');
	el.setAttribute('data-target', '#windowModal');
	el.classList.remove('disabled');
};
//g-recaptcha expired
function recaptchaExpired() {
	const el = document.getElementById('send');
	el.setAttribute('active', 'false');
	el.setAttribute('data-toggle', '');
	el.setAttribute('data-target', '');
	el.classList.add('disabled');
}

function showCharLength() {
	let textLength = 255 - document.getElementById('messageTextArea').value.length;
	textLength = (textLength > 0) ? textLength : 0;	
	document.getElementById('countTA').value = "Characters left: " + textLength;
}

//reset login form
function resetForm() {
	if (document.querySelector("#sendStatusField .alert").classList.contains("alert-success")) {
		grecaptcha.reset();
		
		document.getElementById('nameInputAddress').value = '';
		document.getElementById('mailInputAddress').value = '';
		document.getElementById('subjectInputAddress').value = '';
		document.getElementById('messageTextArea').value = '';//'Good day!\nI want to try it now';
		
		showCharLength();
		
		const el = document.getElementById('send');
		el.setAttribute('active', 'false');
		el.setAttribute('data-toggle', '');
		el.setAttribute('data-target', '');
		el.classList.add('disabled');
	}
}

//JQuery -- start:
function allFieldsAreValid() {
	var allAreValid = false;
		
	var f = $('div.php-email-form').find('.form-group'),
	  ferror = false,
	  emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

	f.children('input').each(function() { // run all inputs
	 
	  var i = $(this); // current input
	  var rule = i.attr('data-rule');

	  if (rule !== undefined) {
		var ierror = false; // error flag for current input
		var pos = rule.indexOf(':', 0);
		if (pos >= 0) {
		  var exp = rule.substr(pos + 1, rule.length);
		  rule = rule.substr(0, pos);
		} else {
		  rule = rule.substr(pos + 1, rule.length);
		}

		switch (rule) {
		  case 'required':
			if (i.val() === '') {
			  ferror = ierror = true;
			}
			break;

		  case 'minlen':
			if (i.val().length < parseInt(exp)) {
			  ferror = ierror = true;
			}
			break;

		  case 'email':
			if (!emailExp.test(i.val())) {
			  ferror = ierror = true;
			}
			break;

		  case 'checked':
			if (! i.is(':checked')) {
			  ferror = ierror = true;
			}
			break;

		  case 'regexp':
			exp = new RegExp(exp);
			if (!exp.test(i.val())) {
			  ferror = ierror = true;
			}
			break;
		}
		i.next('.validate').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
	  }
	});
	
	f.children('textarea').each(function() { // run all inputs

	  var i = $(this); // current input
	  var rule = i.attr('data-rule');

	  if (rule !== undefined) {
		var ierror = false; // error flag for current input
		var pos = rule.indexOf(':', 0);
		if (pos >= 0) {
		  var exp = rule.substr(pos + 1, rule.length);
		  rule = rule.substr(0, pos);
		} else {
		  rule = rule.substr(pos + 1, rule.length);
		}

		switch (rule) {
		  case 'required':
			if (i.val() === '') {
			  ferror = ierror = true;
			}
			break;

		  case 'minlen':
			if (i.val().length < parseInt(exp)) {
			  ferror = ierror = true;
			}
			break;
		}
		i.next('.validate').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
	  }
	});
	
	if (!ferror) {
		allAreValid = true;
	}
	
	return allAreValid;
}
//JQuery -- end;

function doAJAX(dataObject) {
	const emptyFunc = function(){};
    let params 		= dataObject || {};
    
    params.method 	= (typeof params.method 	=== 'undefined') ? 'POST' 	: params.method;
    params.url 		= (typeof params.url 		=== 'undefined') ? '' 		: params.url;
    params.data 	= (typeof params.data 		=== 'undefined') ? {} 		: params.data;
    params.dataType = (typeof params.dataType 	=== 'undefined') ? 'text' 	: params.dataType;
    params.timeout 	= (typeof params.timeout 	=== 'undefined') ? 10000 	: params.timeout;
    
    params.success 	= (typeof params.success 	=== 'undefined') ? emptyFunc : params.success;
    params.error 	= (typeof params.error 		=== 'undefined') ? emptyFunc : params.error;
    params.complete = (typeof params.complete 	=== 'undefined') ? emptyFunc : params.complete;	
	
	let xhr = new XMLHttpRequest();
	
	xhr.responseType 	= params.dataType;
	xhr.timeout 		= params.timeout;
	
	xhr.onload 			= params.success;
	xhr.onerror 		= params.error;
	xhr.onloadend 		= params.complete;
	
	xhr.open(params.method, params.url, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	
	let urlParams = '';
	
	let index = 0;
	for (const property in params.data) {
		if (index === 0) {
			urlParams += property + '=' + params.data[property];
		} else {
			urlParams += '&' + property + '=' + params.data[property];
		}
		index++;
	}
	
	xhr.send(urlParams);
}

function sendData(event) {
	event.preventDefault();
	
	if (document.getElementById('send').getAttribute('active') === 'false') {
		return false;
	}
	
	if (window.jQuery) { 		
		if ( !allFieldsAreValid() ) {
			document.getElementById('sendStatusField').innerHTML = '<div class="alert alert-danger" role="alert">Be sure to fill all required input and textarea fields correctly!</div>';
			return false;
		}
 	}
	
	document.getElementById('sendStatusField').innerHTML = '<div class="alert alert-primary" role="alert">Sending message...</div>';
	
	const nameVal 		= document.getElementById('nameInputAddress').value.trim().substring(0, 255);
	const mailVal 		= document.getElementById('mailInputAddress').value.trim().substring(0, 255);
	const subjectVal 	= document.getElementById('subjectInputAddress').value.trim().substring(0, 255);
    const textareaVal 	= document.getElementById('messageTextArea').value.trim().substring(0, 255);
	
	if (	document.getElementById('send').getAttribute('active') === 'true' && 
			nameVal.length !== 0 &&
			mailVal.length !== 0 &&
			subjectVal.length !== 0 &&			
			textareaVal.length !== 0	) 
	{	
		doAJAX({
			url: '/about/testmail.php?action=send',
			data: {
				name: nameVal,
				email: mailVal,
				subject: subjectVal,
				textarea: textareaVal,
				grr: grecaptcha.getResponse()
			},
			success: function() {
				let messageData = JSON.parse(this.response);
				
				if (messageData.isvalid) {
					//alert('Message has been sent');
					document.getElementById('sendStatusField').innerHTML = '<div class="alert alert-success" role="alert">Message has been sent</div>';
				} else {
					//alert('Something went wrong! try to send it again');
					document.getElementById('sendStatusField').innerHTML = '<div class="alert alert-danger" role="alert">Something went wrong! try to send it again</div>';
				}
			},
			error: function(){
				//alert('Error occured! Try again later');
				document.getElementById('sendStatusField').innerHTML = '<div class="alert alert-danger" role="alert">Error occured! Try again later</div>';
			}
		});
	} else {
		if (nameVal.length !== 0 || mailVal.length === 0 || subjectVal.length !== 0 || textareaVal.length === 0) {
			//alert('Be sure to fill all required input and textarea fields correctly!');
			document.getElementById('sendStatusField').innerHTML = '<div class="alert alert-danger" role="alert">Be sure to fill all required input and textarea fields correctly!</div>';
		}
	}
}

function init() {
	document.getElementById('nameInputAddress').value = '';
	document.getElementById('mailInputAddress').value = '';
	document.getElementById('subjectInputAddress').value = '';
	document.getElementById('messageTextArea').value = '';//'Good day!\nI want to try it now';
	
	showCharLength();
	
	document.getElementById('messageTextArea').addEventListener('keyup', showCharLength);
	document.getElementById('send').addEventListener('click', sendData);
	
	document.getElementById('modalClose').addEventListener('click', function(){
		resetForm();
		document.getElementById('sendStatusField').innerHTML = '';		
	});
	document.getElementById('modalOKbutton').addEventListener('click', function(){
		resetForm();
		document.getElementById('sendStatusField').innerHTML = '';		
	});
}

document.addEventListener('DOMContentLoaded', init);
