<?php
	// Start session.
	session_start();
	
	// Set a key, checked in mailer, prevents against spammers trying to hijack the mailer.
	$security_token = $_SESSION['security_token'] = uniqid(rand());
	
	if ( ! isset($_SESSION['formMessage'])) {
		$_SESSION['formMessage'] = 'Please fill out this form and we will get back to you as quickly as possible.';	
	}
	
	if ( ! isset($_SESSION['formFooter'])) {
		$_SESSION['formFooter'] = '';
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
<!--[if IE 8 ]><html lang="en" class="ie8"><![endif]-->
<!--[if IE 9 ]><html lang="en" class="ie9"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html lang="en"><!--<![endif]-->
	<head>

		<!-- Reason Pro 1.1.0 -->
			
		<meta id="res" name="viewport" content="initial-scale=1 maximum-scale=1"/>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title>R & J Precision Welding - Contact Form</title>
		<link rel="stylesheet" type="text/css" media="screen" href="rw_common/themes/reason/styles.css" />
		<link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
		<link rel="stylesheet" type="text/css" media="screen" href="rw_common/themes/reason/css/toggle-hide-breadcrumb.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="rw_common/themes/reason/css/max-width-1100.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="rw_common/themes/reason/css/background-color.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="rw_common/themes/reason/css/header-op-5.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="rw_common/themes/reason/css/nav-op-2.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="rw_common/themes/reason/css/body-small.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="rw_common/themes/reason/css/feature-1.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="rw_common/themes/reason/css/feature-500.css" />
		
		<!--[if lt IE 9]><script src="rw_common/themes/reason/ie.js"></script><![endif]-->
		<link rel="stylesheet" type="text/css" media="screen" href="rw_common/themes/reason/colour_tags.css" />
		
		
		<style type="text/css" media="all">#bgblur, #feature {background-image: url(resources/images/extrabanners/banner_3.jpg); }</style>
	</head>
	<body>
		<div id="wrapper">
			<div id="shadow">
				<div id="headerWrap">
					<div class="width">
					<header class="theme">
						<div id="noblur">
							
							<div id="title">
								<h1><a id="siteLink" href="http://www.rjprecisionwelding.com/">R & J Precision Welding</a></h1><br>
								<h2>(713) 946-5685</h2>
							</div>
							<div class="clear"></div>
						<div id="menu"><i class="fa fa-bars"></i></div>
						</div>
						<div id="bgblur"></div>
					</header>
					<nav class="theme"><ul><li><a href="./" rel="self">Home</a></li><li><a href="aboutus.html" rel="self">About Us</a></li><li><a href="findus.html" rel="self">Our Shop</a></li><li><a href="ourwork.html" rel="self">Our Work</a><ul><li><a href="weldingandfabrication.html" rel="self">Welding & Fabrication</a></li><li><a href="equipment.html" rel="self">Equipment</a></li><li><a href="oilfieldtools.html" rel="self">Oil Field Tools</a></li><li><a href="mudscreens.html" rel="self">Mud Screens</a></li></ul></li><li><a class="currentAncestor" href="contactrj.html" rel="self">Contact R & J</a><ul><li><a class="current" href="contactform.php" rel="self">Contact Form</a></li></ul></li></ul></nav>
					</div>
				</div><!-- #headerWrap -->
				<div id="feature">
					<div id="extraContainer1"></div>
				</div>
				<section id="container" class="theme">
					<section id="content" class="theme">
						<div id="push">
<div class="message-text"><?php echo $_SESSION['formMessage']; unset($_SESSION['formMessage']); ?></div><br />

<form action="./contactform_files/mailer.php" method="post" enctype="multipart/form-data">
	 <div>
		<label>Your Name:</label> *<br />
		<input class="form-input-field" type="text" value="<?php echo check('element0'); ?>" name="form[element0]" size="40"/><br /><br />

		<label>Your Email:</label> *<br />
		<input class="form-input-field" type="text" value="<?php echo check('element1'); ?>" name="form[element1]" size="40"/><br /><br />

		<label>Subject:</label> *<br />
		<select name="form[element2]">			<option <?php echo check('element2', 'select','RJPW - Custom Order'); ?> value="RJPW - Custom Order">RJPW - Custom Order</option>
			<option <?php echo check('element2', 'select','RJPW - General Questions'); ?> value="RJPW - General Questions">RJPW - General Questions</option>
			<option <?php echo check('element2', 'select','RJPW - Pre-Sales'); ?> value="RJPW - Pre-Sales">RJPW - Pre-Sales</option>
		</select><br /><br />

		<label>Message:</label> *<br />
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

<?php unset($_SESSION['form']); ?></div>
					</section>
					<aside class="theme">
						<h2 id="sideTitle"></h2>
						<div class="content">
							<h3><a class="social-phone"></a> (713) 946-5685 Main</h3>
<h3><a class="social-phone"></a> (713) 946-5662</h3>
<h3><a class="social-phone"></a> (713) 946-1060 Fax</h3><br>

<h5>
R & J Precision Inc.<br>1401 Pennsylvania St.<br>South Houston, TX 77587<br>
</h5>

<h5>
Find us on Yelp <a class="social-yelp" href="http://www.yelp.com/biz/r-and-j-precision-welding-south-houston"></a><br>
Like us on Facebook  <a class="social-facebook" href="http://www.facebook.com/rjprecisionwelding"></a></h5>

<iframe src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Frjprecisionwelding&amp;width=100&amp;layout=button_count&amp;action=like&amp;show_faces=true&amp;share=true&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:250px; height:21px;" allowTransparency="true"></iframe>
							
						</div>
					</aside>
					<footer class="theme"><span>&copy; 2014 R & J Precision Welding <a href="#" id="rw_email_contact">Contact Us</a><script type="text/javascript">var _rwObsfuscatedHref0 = "mai";var _rwObsfuscatedHref1 = "lto";var _rwObsfuscatedHref2 = ":ad";var _rwObsfuscatedHref3 = "min";var _rwObsfuscatedHref4 = "@rj";var _rwObsfuscatedHref5 = "pre";var _rwObsfuscatedHref6 = "cis";var _rwObsfuscatedHref7 = "ion";var _rwObsfuscatedHref8 = "wel";var _rwObsfuscatedHref9 = "din";var _rwObsfuscatedHref10 = "g.c";var _rwObsfuscatedHref11 = "om";var _rwObsfuscatedHref = _rwObsfuscatedHref0+_rwObsfuscatedHref1+_rwObsfuscatedHref2+_rwObsfuscatedHref3+_rwObsfuscatedHref4+_rwObsfuscatedHref5+_rwObsfuscatedHref6+_rwObsfuscatedHref7+_rwObsfuscatedHref8+_rwObsfuscatedHref9+_rwObsfuscatedHref10+_rwObsfuscatedHref11; document.getElementById('rw_email_contact').href = _rwObsfuscatedHref;</script></span><div id="social"></div><div class="clear"></div></footer>
				</section>
			</div>
		</div>
		<script type='text/javascript' charset='utf-8' src='http://code.jquery.com/jquery-1.8.3.min.js'></script>
		<script type="text/javascript" src="rw_common/themes/reason/javascript.js"></script>
		<script type="text/javascript">
			 // Insert this snippet in the Javascript tab in RapidWeaver's Page Inspector.
// You will need to modify the nav link list in the code below 
// to contain the name of the pages that you want to disable.
document.addEventListener("DOMContentLoaded",function(event) {

	// Add your Navigation titles to this list
    var nav_titles = ['Our Work','Contact R & J'];
    
	// ------------------------------------------
	// Do not modify below this line
    var links = document.querySelectorAll('ul li a');
    for (var i = 0; i < links.length; i++) {
        if (nav_titles.indexOf(links[i].textContent) >= 0) links[i].href = 'javascript:void(0)';
    }
}); 
		</script>
	</body>
</html>
