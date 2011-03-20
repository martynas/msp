package com.friendlystocks.server.handlers;

import java.io.IOException;

import com.friendlystocks.server.Constants;
import com.friendlystocks.server.exceptions.DataException;

import net.sf.json.JSONArray;

public class SHQHandler extends AbstractHandler {

	private static DataType[] dataTypes = new DataType[] { DataType.DATE,
			DataType.NUMBER, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER,
			DataType.NUMBER, DataType.NUMBER };

	public String getQoutes(String ticker) throws IOException, DataException {
		CSVData data = getDataFromURL(String.format(Constants.qoutes, ticker));
		JSONArray json = data.toJSON(dataTypes);
		return json.toString();
	}

}
