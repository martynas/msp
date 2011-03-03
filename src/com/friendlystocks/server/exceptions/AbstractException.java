package com.friendlystocks.server.exceptions;

public abstract class AbstractException extends Exception {

	private static final long serialVersionUID = 2535655926109319819L;
	
	public AbstractException(String message) {
		super(message);
	}

}