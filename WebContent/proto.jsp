<?xml version="1.0" encoding="ISO-8859-1" ?>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.Calendar;" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
		<script type="text/javascript" src="js/prototype.js"></script>
		<script type="text/javascript" src="js/types.js"></script>
		<script type="text/javascript" src="js/logic.js"></script>
		<script type="text/javascript" src="js/tests.js"></script>
		<link rel="stylesheet" type="text/css" media="screen,all" href="css/display.css" />
		<title>My Stocks Portfolio</title>
	</head>
<body onload="onLoad()">
	
	<div id="main">
		<div class="header">
			<h1>Manage risk and performance of your stocks portfolio.</h1>
			<h5>The goal is to help You improve performance and reduce risk of Your stocks portfolio.</h5>
			<hr/>
		</div>
		<div id="top">
			<h3>It's now 1st of March 
				<select id="StartYear">
					<% Calendar cal = Calendar.getInstance();
						for(int i = cal.get(Calendar.YEAR); i >= 1995 ; i--) { %>
						<option value="<%= i %>" <%= (i==cal.get(Calendar.YEAR))? "selected='selected'" :"" %> ><%= i %></option>
					<% }; %>
				</select>
				 and expected characteristics of your portfolio within  
				<select id="PeriodYears">
					<% for(int i = 1; i <= 10; i++) { %>
						<option value="<%= i %>" ><%= i %></option>
					<% }; %>
				</select>
				year(s) with <input type="number" id="Probability" value="95" maxlength="2" size="5" />% 
				probability are:</h3> 
			<table class="pc">
				<tr><th></th>
					<th>Expected</th>
					<th>Possible</th>
					<th></th>
					<th>Expected</th>
					<th>Possible</th>
				</tr>
				<tr>
					<td>Expected Value:</td>
					<td class="evaluation"><span class="l2">900$</span></td>
					<td class="evaluation"><span class="l5">2000$</span></td>
					<td>Standard Deviation:</td>
					<td class="evaluation"><span class="l4">3</span></td>
					<td class="evaluation"><span class="l5">5</span></td>
				</tr>
				<tr>
					<td>Expected Yearly Return:</td>
					<td class="evaluation"><span class="l2">4%</span></td>
					<td class="evaluation"><span class="l5">6%</span></td>
					<td>Value at Risk:</td>
					<td class="evaluation"><span class="l1">2000$</span></td>
					<td class="evaluation"><span class="l5">900$</span></td>
				</tr>
				<tr>
					
				</tr>
			</table>
		</div>
		<div id="content-wrapper">
			<div class="portfolios">
				<input type="text" id="ticker" size=10 value="GOOG" />  
				<input type="button" title="labas" value="Add" onclick="testAjax();" />
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
			<div class="pheader"><input class="invisible" value="My Portfolio 1"/></div>
		</div>
		<div class="stock">
			<input type="checkbox" class="show" checked="checked" onclick="onCheckboxClick(this)"/>
			<span class="ticker">-</span>
			<img src="img/busy.gif" alt="busy" style="display:none" class="busy" />
		</div>
	</div>
</body>
</html>