package com.ls.gpis.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.service.JwtService;
import com.ls.gpis.service.LogService;

import org.springframework.web.method.HandlerMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;

@Component
public class LoginCheckInterceptor extends HandlerInterceptorAdapter{

    protected Log log = LogFactory.getLog(this.getClass());

    private static final String HEADER_AUTH = "X-Auth-Token";

    @Autowired
    private JwtService jwtService;

    @Autowired
    private LogService logService;      //사용 로그 정보를 저장하기 위한 서비스
    
    String tokenString = "";

    @Override    
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
                
            // 1. handler 종류 확인
            // 우리가 관심 있는 것은 Controller에 있는 메서드이므로 HandlerMethod 타입인지 체크
            if( handler instanceof HandlerMethod == false ) {
                // return true이면  Controller에 있는 메서드가 아니므로, 그대로 컨트롤러로 진행
                return true;
            }
            
            //핸들러에 클래스 어노테이션을 가져온다
            HandlerMethod hm = (HandlerMethod)handler; 
            Method method = hm.getMethod();                 
            LoginCheck classlogincheck = method.getDeclaringClass().getAnnotation(LoginCheck.class);                
            LoginCheck logincheckmethod = method.getAnnotation(LoginCheck.class);                

            
            if(logincheckmethod == null)
            {
                if(classlogincheck ==  null)
                {
                    return true;
                }
                else
                {     
                    log.debug("class LoginCheckInterceptor in");

                    tokenString = request.getHeader(HEADER_AUTH);
                    
                    if(jwtService.checkJwt(tokenString) == false)
                    {
                        int errType = jwtService.checkJwt2(tokenString);    //1:토큰만료 2:토큰변조

                        HttpServletResponse res = (HttpServletResponse) response;
                        if(errType == 1)
                            res.sendError(HttpServletResponse.SC_UNAUTHORIZED); //권한 오류로 처리한다.(토큰만료) 401
                        if(errType == 2)
                            res.sendError(HttpServletResponse.SC_EXPECTATION_FAILED); //권한 오류로 처리한다.(토큰변조) 417
                        
                        return false;                    
                    }      
                    
                    request.setAttribute("UserID", jwtService.GetUserID(tokenString));  //사용자 ID추가

                    
                }                    
            }
            else
            {
                log.debug("method LoginCheckInterceptor in");

                tokenString = request.getHeader(HEADER_AUTH);
                    
                if(jwtService.checkJwt(tokenString) == false)
                {
                    HttpServletResponse res = (HttpServletResponse) response;
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED); //권한 오류로 처리한다.
                    return false;                    
                }              
                
                request.setAttribute("UserID", jwtService.GetUserID(tokenString));  //사용자 ID추가      
            }            
            
            return true;    //인증 성공
    }






}