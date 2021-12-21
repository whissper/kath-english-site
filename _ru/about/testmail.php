<?php

function isGRecaptchaValid($grrVal) {
	$url = 'https://www.google.com/recaptcha/api/siteverify';
	
	$params = array(
		'secret' => '***',
		'response' => $grrVal,
	);
	
	//$proxyAuth = base64_encode('***:***');//A PROXY LIKE THIS
	
	$result = file_get_contents($url, false, stream_context_create(array(
		'ssl' => array(
			'verify_peer' => false,
			'verify_peer_name' => false,
		),
		'http' => array(
			//'proxy' => 'tcp://proxy.com:8080',//A PROXY LIKE THIS
			//'request_fulluri' => true,//A PROXY LIKE THIS
			//'header' => array('Proxy-Authorization: Basic ' . $proxyAuth . '\r\n', 'Content-type: application/x-www-form-urlencoded'),//A PROXY LIKE THIS
			'method'  => 'POST',
			'content' => http_build_query($params),
		),
	)));
	
	$answerData = json_decode($result);
	
	return $answerData->{'success'};
}

function postValueIsValid($postValue){
	if( $postValue === false || is_null($postValue) ){
		return false;
	}
	else {
		return true;
	}
}

function sendMessage($name, $email, $subjectVal, $body) {
	$to = 'info@kath-english.com';
	$subject = $subjectVal;
	$message = "Sent by: " . $name .
					   "\r\n" .
					   "\r\n" .
			   $body . "\r\n" .
					   "\r\n" .
					   "\r\n" .
	'This message was sent from site page: kath-english.com';
	
	$headers = 'From: info@kath-english.com' . "\r\n" .
    'Reply-To: '. $email . "\r\n" .
    'X-Mailer: PHP/' . phpversion();
	
	$isSent = mail($to, $subject, $message, $headers);
	
	return $isSent;
}

if (postValueIsValid(filter_input(INPUT_GET, 'action'))) {
    switch (filter_input(INPUT_GET, 'action')) {
        case 'send':
			$nameVal 	 = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
			$nameVal	 = substr($nameVal, 0, 255);
		
			$emailVal 	 = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
			$emailVal	 = substr($emailVal, 0, 255);
			
			$subjectVal  = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
			$subjectVal	 = substr($subjectVal, 0, 255);

			$textareaVal = filter_input(INPUT_POST, 'textarea', FILTER_SANITIZE_STRING);
			$textareaVal = substr($textareaVal, 0, 255);

			$grecaptcha	 = filter_input(INPUT_POST, 'grr');

			if( !isGRecaptchaValid($grecaptcha) || !filter_var($emailVal, FILTER_VALIDATE_EMAIL) ){
				echo '{ "isvalid" : false }';
			} else {
				$mailWasSent = sendMessage($nameVal, $emailVal, $subjectVal, $textareaVal);
				
				if($mailWasSent) {
					echo '{ "isvalid" : true }';
				} else {
					echo '{ "isvalid" : false }';
				}
			}
			break;
	}
} else {
	echo '{ "isvalid" : false }';
}