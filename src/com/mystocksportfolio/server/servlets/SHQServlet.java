package com.mystocksportfolio.server.servlets;

import java.io.IOException;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.mystocksportfolio.server.handlers.SHQHandler;

/**
 * Servlet implementation class StocksHistoricalQuotes
 */
@WebServlet("/stocks/shq")
public class SHQServlet extends HttpServlet implements Servlet {
	private static final long serialVersionUID = 1L;

	private SHQHandler handler = new SHQHandler();

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SHQServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String ticker = request.getParameter(RequestConstants.ticker);

		if (StringUtils.isBlank(ticker))
			ticker = RequestConstants.defaultTicker;

		ServletOutputStream output = response.getOutputStream();
		output.println(handler.getQoutes(ticker));
		output.close();
	}

}
