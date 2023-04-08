package com.ls.gpis.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.service.JwtService;
import com.ls.gpis.service.LogService;
import com.ls.gpis.service.MenuService;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.method.HandlerMethod;



//사용자 메뉴별 권한을 체크하기 위한 인터셉터
//JWT토큰 베이스로 권한체크를 진행한다.
@Component
public class AuthCheckInterceptor extends HandlerInterceptorAdapter {

    protected Log log = LogFactory.getLog(this.getClass());

    private static final String HEADER_AUTH = "X-Auth-Token";

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MenuService menuService;   

    @Autowired
    private LogService logService;

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
                AuthCheck classauthcheck = method.getDeclaringClass().getAnnotation(AuthCheck.class);                
                AuthCheck authcheckmethod = method.getAnnotation(AuthCheck.class);                
                
               if(authcheckmethod == null) //메소드에 대한 권한 체크인지 판단
                {
                    if(classauthcheck ==  null)
                    {
                        return true;
                    }
                    else
                    {   
                        log.debug("class AuthCheckInterceptor in");

                        int menu_id = classauthcheck.MENU_ID();
                        int auth_level = classauthcheck.LEVEL().ordinal();
                        
                        //JWT토큰에서 메뉴정보를 가져온다.
                        String tokenString = request.getHeader(HEADER_AUTH);
                        logService.insertUseLog(request, tokenString);      //사용 로그 추가

                        List<HashMap<String, Object>> lists = jwtService.GetMenuAuth(tokenString);
                        // for(HashMap<String, Object> list: lists) {				
                        //     log.info(list.get("MENU_ID").toString());
                        //     log.info(list.get("AUTH_LEVEL").toString());
                        // }    

                        


                        if(menuService.checkAuth(lists, menu_id, auth_level) == false)
                        {
                            HttpServletResponse res = (HttpServletResponse) response;
                            res.sendError(HttpServletResponse.SC_UNAUTHORIZED); //권한 오류로 처리한다.
                            return false;                    
                        }                    
                             
                        request.setAttribute("UserID", jwtService.GetUserID(tokenString));  //사용자 ID추가                        
                    }                    
                }
                else
                {
                    log.debug("method AuthCheckInterceptor in");

                    int menu_id = authcheckmethod.MENU_ID();
                    int auth_level = authcheckmethod.LEVEL().ordinal();
                    //JWT토큰에서 메뉴정보를 가져온다.
                    String tokenString = request.getHeader(HEADER_AUTH);
                    logService.insertUseLog(request, tokenString);      //사용 로그 추가
                    List<HashMap<String, Object>> lists = jwtService.GetMenuAuth(tokenString);

                    if(menuService.checkAuth(lists, menu_id, auth_level) == false)
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
