package com.ls.gpis.config;

import org.springframework.stereotype.Service;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


//토큰 정보를 위한 서비스
@Service
public class TokenService{

    protected Log log = LogFactory.getLog(this.getClass());
    
    //사용 가능한 토큰인지 체크 한다.
    public boolean isUsableToken(String tokenString)
    {
        log.debug("isUsableToken");

        //TODO : 코드 작성한다.
        
        return true;
    }




}