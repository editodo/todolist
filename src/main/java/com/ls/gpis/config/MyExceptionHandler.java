package com.ls.gpis.config;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.ls.gpis.service.LogService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class MyExceptionHandler{
    
    @Autowired
    private LogService logService;

    Logger logger = LoggerFactory.getLogger(this.getClass()); 
        
    /* LogException메소드  Exception 타입으로 처리하는 모든 예외를 처리하도록 설정 */
    @ExceptionHandler(Exception.class)
    public void LogException(HttpServletRequest request, Exception e) throws Exception {        
        logService.insertErrorLog(request, e);
        logger.info(e.toString());
        throw e;  
    }

}


