package com.friendlystocks.server.servlets;

import java.io.IOException;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.jsr107cache.Cache;

import org.apache.commons.lang.StringUtils;

import com.friendlystocks.server.handlers.SHQHandler;

/**
 * Servlet implementation class StocksHistoricalQuotes
 */
public class SHQServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;
	private static final String prefix = "SHQServlet-";
	
	private SHQHandler handler = new SHQHandler();

	public SHQServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String ticker = request.getParameter(RequestConstants.ticker);

		if (StringUtils.isBlank(ticker))
			ticker = RequestConstants.defaultTicker;
		
		String cacheKey = prefix + ticker;
		String respString;
		
		Cache cache = getCache();
		if (cache != null && cache.containsKey(cacheKey)) {
			respString = (String)cache.get(cacheKey);
		} else {
			respString = handler.getQoutes(ticker); // Generating response
			if (cache != null)
				cache.put(cacheKey, respString);
		}
		
		ServletOutputStream output = response.getOutputStream();
		output.println(respString);
		output.close();
	}

}
