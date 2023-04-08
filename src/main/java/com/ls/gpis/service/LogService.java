package com.ls.gpis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ls.gpis.dao.LogDAO;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class LogService {

    @Autowired
    private LogDAO logDAO;
    
    @Autowired
    JwtService jwtService;

    private static final String HEADER_AUTH = "X-Auth-Token";
    

    //사용정보를 가져온다.
    public List<HashMap<String,Object>> selectLogInfo(HashMap<String,Object> SearchCond) throws Exception
    {
        return logDAO.selectLogInfo(SearchCond);        
    }

    //오류 리스트를 반환 한다.
    public List<HashMap<String,Object>> selectErrLogList(HashMap<String,Object> SearchCond) throws Exception
    {
        return logDAO.selectErrLogList(SearchCond);                
    }


    // 사용정보를 DB에 저장한다.
    public int insertUseLog(HttpServletRequest request, String tokenString) throws Exception
    {
        HashMap<String, Object> useLogInfo = new HashMap<String, Object>();
        if(tokenString != null)
        {
            useLogInfo.put("LOGIN_ID", jwtService.GetUserID(tokenString));
        }else{
            useLogInfo.put("LOGIN_ID", "");                
        }
        
        useLogInfo.put("REQ_URL", request.getServletPath());
        useLogInfo.put("USER_IP", request.getRemoteAddr());

        return logDAO.insertUseLog(useLogInfo);        
    }

    // 에러정보를 DB에 저장한다.
    public int insertErrorLog(HttpServletRequest req, Exception e)throws Exception
    {
        HashMap<String, Object> errorLogInfo = new HashMap<String, Object>();

        String tokenString = req.getHeader(HEADER_AUTH);
        String UserID = "";
        if(tokenString != null)
        {
            UserID = jwtService.GetUserID(tokenString);
        }

        errorLogInfo.put("LOGIN_ID", UserID);
        errorLogInfo.put("REQ_URL", req.getServletPath());
        errorLogInfo.put("USER_IP", req.getRemoteAddr());
        errorLogInfo.put("CAUSE_EXCEPTION_NM", e.getClass().getName());
        errorLogInfo.put("CAUSE_EXCEPTION_MSG", e.toString());

        String causedClassName = "";
        StackTraceElement[] ste = e.getStackTrace();
        for (StackTraceElement element : ste) {
			if (element.getClassName().indexOf("Controller") != -1) {
				causedClassName = element.getClassName() + "["+ element.getMethodName() +"]" + "("+ element.getLineNumber()+ ")";
				
				break;
			}
        }    
        errorLogInfo.put("CAUSE_CLASS_NM", causedClassName);    //에러발생 클래스명
        
        return logDAO.insertErrorLog(errorLogInfo);

    }

    // 사용자 로그인정보를 DB에 저장한다.
    public int insertUseLoginLog(String logInd, String remoteAddr) throws Exception
    {
        HashMap<String, Object> useLogInfo = new HashMap<String, Object>();
        useLogInfo.put("LOGIN_ID", logInd);
        useLogInfo.put("USER_IP", remoteAddr);
        return logDAO.insertUseLoginLog(useLogInfo);       
    }

   //사용자 로그인 정보를 가져온다.
   public List<HashMap<String,Object>> selectUseLoginLog(HashMap<String,Object> SearchCond) throws Exception
   {
       return logDAO.selectUseLoginLog(SearchCond);        
   }
}

