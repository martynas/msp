package com.friendlystocks.server;

public final class Constants {

	public static String qoutes = "http://ichart.finance.yahoo.com/table.csv?s=%1$s&g=m&ignore=.csv";

	public static String newLineSeparator = "\n";
	public static String fieldSeparator = ",";
	
	public static int qoutesCacheExp = 60 * 60 * 12; // 12 hours
	
	public static String exWrongQuote = "No such quote";
}
