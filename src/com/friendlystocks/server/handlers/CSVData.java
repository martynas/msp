package com.friendlystocks.server.handlers;

import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import net.sf.json.*;

import com.friendlystocks.server.*;
import com.friendlystocks.server.exceptions.DataException;

public class CSVData {

	private String[] header;
	private ArrayList<String[]> dataLines = new ArrayList<String[]>();

	public CSVData(InputStream inputStream) throws IOException {

		BufferedReader dataInputStream = new BufferedReader(
				new InputStreamReader(inputStream));

		header = dataInputStream.readLine().split(Constants.fieldSeparator);

		String line;
		while ((line = dataInputStream.readLine()) != null) {
			dataLines.add(line.split(Constants.fieldSeparator));
		}
	}

	public String[] getHeader() {
		return header;
	}

	public ArrayList<String[]> getDataLines() {
		return dataLines;
	}

	public JSONArray toJSON(DataType[] dataTypes) {
		String[] h = new String[header.length];
		for (int i = 0; i < header.length; i++) {
			h[i] = header[i].replace(" ", "");
		}
		try {
			return toJSON(h, dataTypes);
		} catch (DataException e) {
			assert false; // This should never happen
			return null;
		}
	}

	/*
	 * @param cHeader Customer header
	 */
	public JSONArray toJSON(String[] cHeader, DataType[] dataTypes)
			throws DataException {
		if (cHeader.length != header.length
				|| cHeader.length != dataTypes.length) {
			throw new DataException("Wrong header size");
		}

		JSONObject mainObj = new JSONObject();
		JSONArray array = new JSONArray();
		for (String[] line : dataLines) {
			JSONObject obj = new JSONObject();
			for (int i = 0; i < cHeader.length; i++) {
				switch (dataTypes[i]) {
				case NUMBER:
					obj.put(cHeader[i], Float.parseFloat(line[i]));
					break;
				case DATE:
					obj.put(cHeader[i],
							String.format("Date('%s')", line[i]));
					break;
				default:
					obj.put(cHeader[i], line[i]);
					break;
				}

			}
			array.add(obj);
		}

		mainObj.put("quotes", array);

		return array;
	}

}