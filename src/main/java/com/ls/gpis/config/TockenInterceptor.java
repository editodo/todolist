package com.ls.gpis.config;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ls.gpis.service.JwtService;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

//사용자 메뉴별 권한을 체크하기 위한 인터셉터
@Component
public class TockenInterceptor extends HandlerInterceptorAdapter {
    protected Log log = LogFactory.getLog(this.getClass());
    private static final String HEADER_AUTH = "X-Auth-Token";
    
    @Autowired
    JwtService jwtService;

    @Override
    // @SuppressWarnings("unchecked")
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        log.info("TokenInterceptor");

        
        String tokenString = request.getHeader(HEADER_AUTH);

        log.debug("token String : " +  tokenString);

        if(tokenString != null){
            
            if(jwtService.checkJwt(tokenString) == true)
            {
                log.debug("토큰 인증성공");
                List<HashMap<String, Object>> lists = jwtService.GetMenuAuth(tokenString);
                for(HashMap<String, Object> list: lists) {				
                    log.info(list.get("MENU_ID").toString());
                    log.info(list.get("AUTH_LEVEL").toString());
                }    
            }
            else
            {
                log.debug("토큰 인증 실패");
            }
        }

        return true; // 인증 성공
    }

}