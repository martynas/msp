package com.mystocksportfolio.server.handlers;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public abstract class AbstractHandler {
	
	/* General procedure for handling exceptions */
	protected String handleException(Exception e) {
		return e.getStackTrace().toString();
	}
	
	protected CSVData getDataFromURL(String sUrl) throws IOException {
		InputStream inputStream = null;

		try {
			URL url = new URL(sUrl);

			inputStream = url.openStream();

			return new CSVData(inputStream);
		} finally {
			try {
				inputStream.close();
			} catch (IOException ioe) {
				// just going to ignore this one
			}
		}
	}

}
