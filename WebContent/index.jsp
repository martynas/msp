<?xml version="1.0" encoding="ISO-8859-1" ?>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
		<script type="text/javascript" src="js/prototype.js"></script>
		<script type="text/javascript" src="js/types.js"></script>
		<script type="text/javascript" src="js/logic.js"></script>
		<script type="text/javascript" src="js/tests.js"></script>
		<link rel="stylesheet" type="text/css" media="screen,all" href="css/display.css" />
		<title>MSP Index Page</title>
		
		<!-- Google Analytics -->
		<script type="text/javascript">
		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', 'UA-22008680-1']);
		  _gaq.push(['_trackPageview']);
		
		  (function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();
		</script>
		
	</head>
<body onload="onLoad()">
	
	<div id="main">
		<div class="header">
			<h1>MSP: Index page</h1>
		</div>
		<div id="top">
			<input type="text" id="ticker" size=10 value="GOOG" />  
			<input type="button" title="labas" value="Add" onclick="testAjax();" />
		</div>
		<div id="content-wrapper">
			<div class="portfolios">
				<div id="phPortfolios"></div>
			</div>
			<div class="charts">
				<canvas id="stockChart" width="650px" height="200">
					Empty
				</canvas>
			</div>
			
		</div>
	
		<div>
			<p><%= new java.util.Date() %></p>
		</div>
	</div>
	
	<div id="prototypes" style="display:none" >
		<div class="portfolio">
		</div>
		<div class="stock">
			<input type="checkbox" class="show" checked="checked" onclick="onCheckboxClick(this)"/>
			<span class="ticker">-</span>
			<img src="img/busy.gif" alt="busy" style="display:none" class="busy" />
		</div>
	</div>
</body>
</html>