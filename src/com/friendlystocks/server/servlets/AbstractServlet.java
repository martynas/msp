package com.friendlystocks.server.servlets;

import java.util.HashMap;
import java.util.Map;

import net.sf.jsr107cache.Cache;
import net.sf.jsr107cache.CacheException;
import net.sf.jsr107cache.CacheFactory;
import net.sf.jsr107cache.CacheManager;
import javax.servlet.http.HttpServlet;

import com.google.appengine.api.memcache.jsr107cache.GCacheFactory;

public abstract class AbstractServlet extends HttpServlet {
	private static final long serialVersionUID = 1118087838352100060L;
	
	private Cache cache;
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private Cache createCache() {
		Cache cache;

        Map props = new HashMap();
        props.put(GCacheFactory.EXPIRATION_DELTA, 3600);

        try {
            CacheFactory cacheFactory = CacheManager.getInstance().getCacheFactory();
            cache = cacheFactory.createCache(props);
            return cache;
        } catch (CacheException e) {
            return null;
        }
	}
	
	protected Cache getCache() {
		return cache;
	}

	public AbstractServlet() {
		super();
		cache = createCache();
	}

}
