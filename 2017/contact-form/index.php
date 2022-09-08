<?php
	// Start session.
	session_start();
	
	// Set a key, checked in mailer, prevents against spammers trying to hijack the mailer.
	$security_token = $_SESSION['security_token'] = uniqid(rand());
	
	if ( ! isset($_SESSION['formMessage'])) {
		$_SESSION['formMessage'] = 'Please fill out this form and we will get back to you as quickly as possible.';	
	}
	
	if ( ! isset($_SESSION['formFooter'])) {
		$_SESSION['formFooter'] = ' ';
	}
	
	if ( ! isset($_SESSION['form'])) {
		$_SESSION['form'] = array();
	}
	
	function check($field, $type = '', $value = '') {
		$string = "";
		if (isset($_SESSION['form'][$field])) {
			switch($type) {
				case 'checkbox':
					$string = 'checked="checked"';
					break;
				case 'radio':
					if($_SESSION['form'][$field] === $value) {
						$string = 'checked="checked"';
					}
					break;
				case 'select':
					if($_SESSION['form'][$field] === $value) {
						$string = 'selected="selected"';
					}
					break;
				default:
					$string = $_SESSION['form'][$field];
			}
		}
		return $string;
	}
?><!DOCTYPE html>
<!--[if IE 9]><html class="no-js lt-ie10" lang="en"><![endif]-->
<!--[if gt IE 9]><!--><html lang="en"><!--<![endif]-->
	<head>
		<!-- Writer 1.0.8 -->
		
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="robots" content="index, follow" />
		<meta name="generator" content="RapidWeaver" />
		
		<meta name="viewport" content="initial-scale=1 maximum-scale=1">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="baseurl" content="http://rjprecisionwelding.com/">
		<title>Contact R & J | R & J Precision Welding</title>
		<link rel="stylesheet" type="text/css" media="all" href="../rw_common/themes/writer/consolidated-9.css?rwcache=501053307" />
		
		
		
		
		
		
	</head>
	<body>
		<div id="extraContainer1"></div>
		<header id="header-theme" class='theme'>
			<div class='site-logo'><a href="http://rjprecisionwelding.com/"></a></div>
			<div class='wrapper'>
				<h1 class="site-title"><a href="http://rjprecisionwelding.com/">R & J Precision Welding</a></h1>
				<h2 class="site-slogan"><span>(713) 946-5685</span></h2>
			</div>
			<div class="site-contact">
				<div>&copy; 2016 R & J Precision Welding  <a href="#" id="rw_email_contact">Contact us</a><script type="text/javascript">var _rwObsfuscatedHref0 = "mai";var _rwObsfuscatedHref1 = "lto";var _rwObsfuscatedHref2 = ":ad";var _rwObsfuscatedHref3 = "min";var _rwObsfuscatedHref4 = "@rj";var _rwObsfuscatedHref5 = "pre";var _rwObsfuscatedHref6 = "cis";var _rwObsfuscatedHref7 = "ion";var _rwObsfuscatedHref8 = "wel";var _rwObsfuscatedHref9 = "din";var _rwObsfuscatedHref10 = "g.c";var _rwObsfuscatedHref11 = "om";var _rwObsfuscatedHref = _rwObsfuscatedHref0+_rwObsfuscatedHref1+_rwObsfuscatedHref2+_rwObsfuscatedHref3+_rwObsfuscatedHref4+_rwObsfuscatedHref5+_rwObsfuscatedHref6+_rwObsfuscatedHref7+_rwObsfuscatedHref8+_rwObsfuscatedHref9+_rwObsfuscatedHref10+_rwObsfuscatedHref11; document.getElementById("rw_email_contact").href = _rwObsfuscatedHref;</script></div>
			</div>
			<div class="background-color"></div>
			<div class="background-image"></div>
			<div class="nav-bg"></div>
		</header>
		<div id="extraContainer2"></div>
		<div class="nav-bg"></div>
		<nav id="nav-theme" class='theme cf'><ul><li><a href="../" rel="">Home</a></li><li><a href="../page0/page0.html" rel="">About Us</a></li><li><a href="../page-2/page3.html" rel="">Our Shop</a></li><li><a href="../page-3/" rel="">Our Work</a><ul><li><a href="../page-3/page-4/" rel="">Welding & Fabrication</a></li><li><a href="../page-3/page-8/" rel="">Equipment</a></li><li><a href="../page-3/page-5/" rel="">Oil Field Tools</a></li><li><a href="../page-3/page-6/" rel="">Mud Screens</a></li></ul></li><li><a href="./" rel="" class="current">Contact R & J</a></li></ul></nav>
		<div class='wrapper main needsclick'>
			<section class="theme">
				<div id="section-theme" class="theme-push cf">
					
					
<div class="message-text"><?php echo $_SESSION['formMessage']; unset($_SESSION['formMessage']); ?></div><br />

<form class="rw-contact-form" action="./files/mailer.php" method="post" enctype="multipart/form-data">
	 <div>
		<label>Your Name</label> *<br />
		<input class="form-input-field" type="text" value="<?php echo check('element0'); ?>" name="form[element0]" size="40"/><br /><br />

		<label>Your Email</label> *<br />
		<input class="form-input-field" type="text" value="<?php echo check('element1'); ?>" name="form[element1]" size="40"/><br /><br />

		<label>Subject</label> *<br />
		<select class="form-select-field" name="form[element2]">			<option <?php echo check('element2', 'select','RJPW - Custom Order'); ?> value="RJPW - Custom Order">RJPW - Custom Order</option>
			<option <?php echo check('element2', 'select','RJPW - General Questions'); ?> value="RJPW - General Questions">RJPW - General Questions</option>
			<option <?php echo check('element2', 'select','RJPW - Pre-Sales'); ?> value="RJPW - Pre-Sales">RJPW - Pre-Sales</option>
		</select><br /><br />

		<label>Message</label> *<br />
		<textarea class="form-input-field" name="form[element3]" rows="8" cols="38"><?php echo check('element3'); ?></textarea><br /><br />

		<div style="display: none;">
			<label>Spam Protection: Please don't fill this in:</label>
			<textarea name="comment" rows="1" cols="1"></textarea>
		</div>
		<input type="hidden" name="form_token" value="<?php echo $security_token; ?>" />
		<input class="form-input-button" type="reset" name="resetButton" value="Reset" />
		<input class="form-input-button" type="submit" name="submitButton" value="Submit" />
	</div>
</form>

<br />
<div class="form-footer"><?php echo $_SESSION['formFooter']; unset($_SESSION['formFooter']); ?></div><br />

<?php unset($_SESSION['form']); ?>
				</div>
			</section>
			<aside class="theme cf">
				<span class="aside-title"></span>
				<div class="aside-content"><a class="social-phone social-import"></a> (713) 946-5685 Main<br>
<a class="social-phone social-import"></a> (713) 946-5662<br>
<a class="social-phone social-import"></a> (713) 946-1060 Fax<br>
<br>
R & J Precision Inc.<br>1401 Pennsylvania St.<br>South Houston, TX 77587<br>
<br>

Find us on Yelp <a class="social-yelp social-import" href="http://www.yelp.com/biz/r-and-j-precision-welding-south-houston"></a><br>
Like us on Facebook  <a class="social-facebook social-import" href="http://www.facebook.com/rjprecisionwelding"></a>

<iframe src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Frjprecisionwelding&amp;width=100&amp;layout=button_count&amp;action=like&amp;show_faces=true&amp;share=true&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:250px; height:21px;" allowTransparency="true"></iframe></div>
				<div class="plugin-aside"></div>
			</aside>
			<div id="social-icon-container"></div>
		</div>
		<div id="config-theme"></div>
		<script>window.jQuery || document.write('<script src="../rw_common/themes/writer/assets/js/jquery-1.11.2.min.js">\x3C/script>')</script>
		
		<script src="../rw_common/themes/writer/assets/js/javascript.js"></script>
		<script> 
			var $buoop = {vs:{i:8,f:15,o:12.1,s:4.0},c:2}; 
			function $buo_f(){ 
			 var e = document.createElement("script"); 
			 e.src = "http://browser-update.org/update.js"; 
			 document.body.appendChild(e);
			};
			try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
			catch(e){window.attachEvent("onload", $buo_f)}
		</script> 
	</body>
</html>